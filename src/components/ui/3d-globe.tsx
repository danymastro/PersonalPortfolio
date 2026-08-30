import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

export interface GlobeMarker {
  lat: number;
  lng: number;
  src?: string;
  label?: string;
  size?: number;
}

export interface Globe3DConfig {
  radius?: number;
  globeColor?: string;
  textureUrl?: string;
  bumpMapUrl?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereIntensity?: number;
  atmosphereBlur?: number;
  bumpScale?: number;
  autoRotateSpeed?: number;
  enableZoom?: boolean;
  enablePan?: boolean;
  minDistance?: number;
  maxDistance?: number;
  initialRotation?: { x: number; y: number };
  markerSize?: number;
  showWireframe?: boolean;
  wireframeColor?: string;
  ambientIntensity?: number;
  pointLightIntensity?: number;
  backgroundColor?: string | null;
}

interface Globe3DProps {
  markers?: GlobeMarker[];
  config?: Globe3DConfig;
  className?: string;
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

const DEFAULT_EARTH_TEXTURE =
  "https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg";
const DEFAULT_BUMP_TEXTURE =
  "https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png";

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
  onMarkerClick,
  onMarkerHover,
}: Globe3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredMarker, setHoveredMarker] = useState<GlobeMarker | null>(null);
  const [markerPositions, setMarkerPositions] = useState<
    { marker: GlobeMarker; screenX: number; screenY: number; visible: boolean }[]
  >([]);

  const {
    radius = 100,
    textureUrl = DEFAULT_EARTH_TEXTURE,
    bumpMapUrl = DEFAULT_BUMP_TEXTURE,
    showAtmosphere = true,
    atmosphereColor = "#4da6ff",
    atmosphereIntensity = 20,
    bumpScale = 5,
    autoRotateSpeed = 0.3,
  } = config;

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 600;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(0, 40, radius * 2.8);
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
    // Tilt slightly forward so Europe/US/Asia look great
    globeGroup.rotation.x = 0.35;
    scene.add(globeGroup);

    // Globe Mesh
    const sphereGeometry = new THREE.SphereGeometry(radius, 64, 64);
    const textureLoader = new THREE.TextureLoader();

    // Fallback base material while loading
    const globeMaterial = new THREE.MeshStandardMaterial({
      color: 0x112244,
      roughness: 0.8,
      metalness: 0.1,
    });

    textureLoader.load(
      textureUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        globeMaterial.map = tex;
        globeMaterial.needsUpdate = true;
      },
      undefined,
      (err) => console.warn("Globe texture load error:", err)
    );

    textureLoader.load(
      bumpMapUrl,
      (bump) => {
        globeMaterial.bumpMap = bump;
        globeMaterial.bumpScale = bumpScale * 0.04;
        globeMaterial.needsUpdate = true;
      },
      undefined,
      () => {}
    );

    const globe = new THREE.Mesh(sphereGeometry, globeMaterial);
    globeGroup.add(globe);

    // Atmosphere Glow Mesh
    if (showAtmosphere) {
      const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.14, 64, 64);
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
          uniform float intensity;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            float fresnel = pow(1.0 - abs(dot(vNormal, normalize(-vPosition))), 2.2);
            gl_FragColor = vec4(atmosphereColor, fresnel * (intensity / 10.0));
          }
        `,
        uniforms: {
          atmosphereColor: { value: new THREE.Color(atmosphereColor) },
          intensity: { value: atmosphereIntensity },
        },
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      scene.add(atmosphere);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.3);
    sunLight.position.set(300, 200, 300);
    scene.add(sunLight);

    const blueLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    blueLight.position.set(-200, -100, -200);
    scene.add(blueLight);

    // Marker Meshes (Stems + Cones + Top Pin points)
    const markerMeshes: {
      topMesh: THREE.Object3D;
      marker: GlobeMarker;
    }[] = [];

    markers.forEach((m) => {
      const surfacePos = latLngToVector3(m.lat, m.lng, radius * 1.001);
      const topPos = latLngToVector3(m.lat, m.lng, radius * 1.22);
      const lineHeight = topPos.distanceTo(surfacePos);

      // Pin stem cylinder
      const center = surfacePos.clone().lerp(topPos, 0.5);
      const direction = topPos.clone().sub(surfacePos).normalize();
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction
      );

      const stemGeom = new THREE.CylinderGeometry(0.3, 0.3, lineHeight, 8);
      const stemMat = new THREE.MeshBasicMaterial({
        color: 0x94a3b8,
        transparent: true,
        opacity: 0.7,
      });
      const stemMesh = new THREE.Mesh(stemGeom, stemMat);
      stemMesh.position.copy(center);
      stemMesh.quaternion.copy(quaternion);
      globeGroup.add(stemMesh);

      // Pin cone at surface
      const coneGeom = new THREE.ConeGeometry(1.5, 3.5, 8);
      const coneMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const coneMesh = new THREE.Mesh(coneGeom, coneMat);
      coneMesh.position.copy(surfacePos);
      coneMesh.quaternion.copy(quaternion);
      globeGroup.add(coneMesh);

      // Top anchor object for 2D avatar projection
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

    container.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    container.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

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

    // Animation Loop
    const animate = () => {
      if (!isDragging && autoRotateSpeed > 0) {
        globeGroup.rotation.y += autoRotateSpeed * 0.004;
      }

      // Project 3D marker tops to 2D screen coordinates
      const positions: {
        marker: GlobeMarker;
        screenX: number;
        screenY: number;
        visible: boolean;
      }[] = [];

      markerMeshes.forEach(({ topMesh, marker }) => {
        const worldPos = new THREE.Vector3();
        topMesh.getWorldPosition(worldPos);

        // Check if marker is on the visible front hemisphere
        const cameraDir = camera.position.clone().normalize();
        const markerDir = worldPos.clone().normalize();
        const isVisible = markerDir.dot(cameraDir) > 0.08;

        const screenPos = worldPos.clone().project(camera);
        const screenX = ((screenPos.x + 1) * width) / 2;
        const screenY = ((-screenPos.y + 1) * height) / 2;

        positions.push({
          marker,
          screenX,
          screenY,
          visible: isVisible,
        });
      });

      setMarkerPositions(positions);
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
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, [markers, textureUrl, bumpMapUrl, atmosphereColor, atmosphereIntensity, bumpScale, autoRotateSpeed, radius, showAtmosphere]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative select-none overflow-hidden cursor-grab active:cursor-grabbing",
        className
      )}
      style={{ width: "100%", height: "100%" }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Floating 2D Marker Overlays with Avatar and Tooltip */}
      {markerPositions.map(({ marker, screenX, screenY, visible }, idx) => {
        if (!visible) return null;

        const isHovered = hoveredMarker?.label === marker.label;

        return (
          <div
            key={idx}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 z-20 pointer-events-auto"
            style={{ left: `${screenX}px`, top: `${screenY}px` }}
            onMouseEnter={() => {
              setHoveredMarker(marker);
              onMarkerHover?.(marker);
            }}
            onMouseLeave={() => {
              setHoveredMarker(null);
              onMarkerHover?.(null);
            }}
            onClick={() => onMarkerClick?.(marker)}
          >
            <div
              className={`flex items-center gap-1.5 p-1 pr-2.5 rounded-full border border-black/40 text-xs font-mono font-bold shadow-xl transition-all cursor-pointer ${
                isHovered
                  ? "bg-[#D0FF71] text-black scale-125 shadow-[0_0_20px_rgba(208,255,113,0.9)]"
                  : "bg-neutral-900/90 text-white backdrop-blur-md hover:bg-neutral-900 hover:scale-110"
              }`}
            >
              {marker.src ? (
                <img
                  src={marker.src}
                  alt={marker.label || "Marker"}
                  className="w-5 h-5 rounded-full object-cover border border-white/40 shrink-0"
                />
              ) : (
                <span className="w-2.5 h-2.5 rounded-full bg-[#D0FF71] animate-ping" />
              )}
              {marker.label && (
                <span className="whitespace-nowrap text-[11px] font-bold">
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
