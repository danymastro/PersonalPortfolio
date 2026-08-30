import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

export interface GlobeMarker {
  lat: number;
  lng: number;
  src?: string;
  flag?: string;
  label?: string;
  stemHeight?: number;
}

export interface Globe3DConfig {
  radius?: number;
  textureUrl?: string;
  bumpMapUrl?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereIntensity?: number;
  bumpScale?: number;
  autoRotateSpeed?: number;
}

interface Globe3DProps {
  markers?: GlobeMarker[];
  config?: Globe3DConfig;
  className?: string;
  activeMarkerLabel?: string | null;
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

const DEFAULT_EARTH_TEXTURE = "/textures/earth-day.jpg";
const DEFAULT_BUMP_TEXTURE = "/textures/earth-topology.png";

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

export function Globe3D({
  markers = [],
  config = {},
  className = "",
  activeMarkerLabel = null,
  onMarkerClick,
  onMarkerHover,
}: Globe3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  const {
    radius = 68,
    textureUrl = DEFAULT_EARTH_TEXTURE,
    bumpMapUrl = DEFAULT_BUMP_TEXTURE,
    showAtmosphere = true,
    atmosphereColor = "#38bdf8",
    bumpScale = 3,
    autoRotateSpeed = 0.35,
  } = config;

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth || 500;
    let height = container.clientHeight || 500;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1500);
    camera.position.set(0, 0, 230);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Globe Group
    const globeGroup = new THREE.Group();
    // Tilt slightly so Europe and Northern Europe face the camera
    globeGroup.rotation.x = 0.3;
    globeGroup.rotation.y = -0.3;
    scene.add(globeGroup);

    // Globe Mesh
    const sphereGeometry = new THREE.SphereGeometry(radius, 64, 64);
    const textureLoader = new THREE.TextureLoader();

    const globeMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.65,
      metalness: 0.12,
    });

    textureLoader.load(
      textureUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        globeMaterial.map = tex;
        globeMaterial.needsUpdate = true;
      },
      undefined,
      () => {
        textureLoader.load(
          "https://unpkg.com/three-globe@2.31.0/example/img/earth-day.jpg",
          (tex2) => {
            tex2.colorSpace = THREE.SRGBColorSpace;
            globeMaterial.map = tex2;
            globeMaterial.needsUpdate = true;
          }
        );
      }
    );

    textureLoader.load(
      bumpMapUrl,
      (bump) => {
        globeMaterial.bumpMap = bump;
        globeMaterial.bumpScale = bumpScale * 0.035;
        globeMaterial.needsUpdate = true;
      },
      undefined,
      () => {}
    );

    const globe = new THREE.Mesh(sphereGeometry, globeMaterial);
    globeGroup.add(globe);

    // Atmosphere Glow Mesh
    if (showAtmosphere) {
      const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.05, 64, 64);
      const atmosphereMaterial = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 atmosphereColor;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
            gl_FragColor = vec4(atmosphereColor, intensity * 0.45);
          }
        `,
        uniforms: {
          atmosphereColor: { value: new THREE.Color(atmosphereColor) },
        },
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      scene.add(atmosphere);
    }

    // Balanced Daylight Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(0xffffff, 1.3);
    mainSun.position.set(200, 150, 300);
    scene.add(mainSun);

    const fillLight = new THREE.DirectionalLight(0x7dd3fc, 0.6);
    fillLight.position.set(-200, -100, -200);
    scene.add(fillLight);

    // Marker Meshes
    const markerMeshes: {
      topMesh: THREE.Object3D;
      marker: GlobeMarker;
    }[] = [];

    markers.forEach((m) => {
      const heightMult = m.stemHeight || 1.24;
      const surfacePos = latLngToVector3(m.lat, m.lng, radius * 1.001);
      const topPos = latLngToVector3(m.lat, m.lng, radius * heightMult);
      const lineHeight = topPos.distanceTo(surfacePos);

      // Pin Stem
      const center = surfacePos.clone().lerp(topPos, 0.5);
      const direction = topPos.clone().sub(surfacePos).normalize();
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction
      );

      const stemGeom = new THREE.CylinderGeometry(0.3, 0.3, lineHeight, 8);
      const stemMat = new THREE.MeshBasicMaterial({
        color: 0x334155,
        transparent: true,
        opacity: 0.8,
      });
      const stemMesh = new THREE.Mesh(stemGeom, stemMat);
      stemMesh.position.copy(center);
      stemMesh.quaternion.copy(quaternion);
      globeGroup.add(stemMesh);

      // Pin Surface Point
      const coneGeom = new THREE.ConeGeometry(1.2, 2.8, 8);
      const coneMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const coneMesh = new THREE.Mesh(coneGeom, coneMat);
      coneMesh.position.copy(surfacePos);
      coneMesh.quaternion.copy(quaternion);
      globeGroup.add(coneMesh);

      // Top anchor
      const topAnchor = new THREE.Object3D();
      topAnchor.position.copy(topPos);
      globeGroup.add(topAnchor);

      markerMeshes.push({ topMesh: topAnchor, marker: m });
    });

    // Mouse & Touch Drag Controls
    let isDragging = false;
    let previousPos = { x: 0, y: 0 };
    let reqId: number;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      const y = "touches" in e ? e.touches[0].clientY : e.clientY;
      previousPos = { x, y };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      const y = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = x - previousPos.x;
      const deltaY = y - previousPos.y;

      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;

      // Restrict vertical tilt
      globeGroup.rotation.x = Math.max(-0.6, Math.min(0.8, globeGroup.rotation.x));

      previousPos = { x, y };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    // Zoom on wheel
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.15;
      camera.position.z = Math.max(160, Math.min(300, camera.position.z));
    };

    container.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    container.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);
    container.addEventListener("wheel", onWheel, { passive: false });

    // Resize Handler
    const onResize = () => {
      if (!container || !renderer || !camera) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    // Animation Loop with Real-Time Matrix World Sync
    const animate = () => {
      if (!isDragging && autoRotateSpeed > 0) {
        globeGroup.rotation.y += autoRotateSpeed * 0.004;
      }

      // CRITICAL: Update world matrix so anchors follow rotation exactly
      globeGroup.updateMatrixWorld(true);

      // Direct DOM transform sync for instant 60fps tracking without state lag
      markerMeshes.forEach(({ topMesh }, idx) => {
        const el = tagRefs.current[idx];
        if (!el) return;

        const worldPos = new THREE.Vector3();
        topMesh.getWorldPosition(worldPos);

        const cameraDir = camera.position.clone().normalize();
        const markerDir = worldPos.clone().normalize();
        const isVisible = markerDir.dot(cameraDir) > 0.05;

        if (!isVisible) {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
          return;
        }

        const screenPos = worldPos.clone().project(camera);
        const screenX = ((screenPos.x + 1) * width) / 2;
        const screenY = ((-screenPos.y + 1) * height) / 2;

        el.style.opacity = "1";
        el.style.pointerEvents = "auto";
        el.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) translate(-50%, -50%)`;
      });

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      container.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      container.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      container.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, [markers, textureUrl, bumpMapUrl, atmosphereColor, bumpScale, autoRotateSpeed, radius, showAtmosphere]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative select-none overflow-visible cursor-grab active:cursor-grabbing w-full h-full flex items-center justify-center",
        className
      )}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Floating 2D Marker Overlays synchronized in real-time */}
      {markers.map((marker, idx) => {
        const isHovered = hoveredLabel === marker.label;
        const isActive = activeMarkerLabel === marker.label;
        const isPromoted = isHovered || isActive;

        return (
          <div
            key={marker.label || idx}
            ref={(el) => (tagRefs.current[idx] = el)}
            className={`absolute top-0 left-0 transition-opacity duration-150 ${
              isPromoted ? "z-40" : "z-20"
            }`}
            style={{ opacity: 0, pointerEvents: "none", willChange: "transform, opacity" }}
            onMouseEnter={() => {
              setHoveredLabel(marker.label || null);
              onMarkerHover?.(marker);
            }}
            onMouseLeave={() => {
              setHoveredLabel(null);
              onMarkerHover?.(null);
            }}
            onClick={() => onMarkerClick?.(marker)}
          >
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border-2 border-black text-xs font-mono font-bold transition-all cursor-pointer neo-shadow-sm ${
                isPromoted
                  ? "bg-[#D0FF71] text-black scale-110 shadow-[0_0_15px_rgba(208,255,113,0.9)]"
                  : "bg-white text-slate-900 hover:bg-[#FDE047] hover:scale-105"
              }`}
            >
              {marker.flag ? (
                <span className="text-sm">{marker.flag}</span>
              ) : marker.src ? (
                <img
                  src={marker.src}
                  alt={marker.label || "Marker"}
                  className="w-4 h-4 rounded-full object-cover border border-black/50 shrink-0"
                />
              ) : (
                <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0" />
              )}
              {marker.label && (
                <span className="whitespace-nowrap font-bold text-[11px]">
                  {marker.label}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Globe3D;
