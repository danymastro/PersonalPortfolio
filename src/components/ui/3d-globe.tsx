import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export interface GlobeMarker {
  lat: number;
  lng: number;
  src?: string;
  label: string;
  size?: number;
}

export interface GlobeConfig {
  atmosphereColor?: string;
  atmosphereIntensity?: number;
  bumpScale?: number;
  autoRotateSpeed?: number;
  globeColor?: string;
  markerColor?: string;
}

export interface Globe3DProps {
  markers?: GlobeMarker[];
  config?: GlobeConfig;
  className?: string;
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

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
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredMarker, setHoveredMarker] = useState<GlobeMarker | null>(null);
  const [markerPositions, setMarkerPositions] = useState<
    { marker: GlobeMarker; screenX: number; screenY: number; visible: boolean }[]
  >([]);

  const {
    atmosphereColor = "#38bdf8",
    atmosphereIntensity = 15,
    bumpScale = 5,
    autoRotateSpeed = 0.4,
  } = config;

  useEffect(() => {
    if (!mountRef.current || !canvasRef.current) return;

    const container = mountRef.current;
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 600;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 250;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Globe Sphere
    const globeRadius = 90;
    const sphereGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);

    // Texture loader with fallback
    const textureLoader = new THREE.TextureLoader();
    const earthMap = textureLoader.load(
      "https://unpkg.com/three-globe/example/img/earth-dark.jpg",
      () => renderer.render(scene, camera)
    );
    const bumpMap = textureLoader.load(
      "https://unpkg.com/three-globe/example/img/earth-topology.png",
      () => renderer.render(scene, camera)
    );

    const globeMaterial = new THREE.MeshStandardMaterial({
      map: earthMap,
      bumpMap: bumpMap,
      bumpScale: bumpScale * 0.05,
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.1,
    });

    const globe = new THREE.Mesh(sphereGeometry, globeMaterial);
    scene.add(globe);

    // Atmosphere Glow
    const atmosphereGeometry = new THREE.SphereGeometry(globeRadius * 1.15, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 color;
        uniform float intensity;
        void main() {
          float power = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          gl_FragColor = vec4(color, power * (intensity / 10.0));
        }
      `,
      uniforms: {
        color: { value: new THREE.Color(atmosphereColor) },
        intensity: { value: atmosphereIntensity },
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(200, 200, 200);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.6);
    dirLight2.position.set(-200, -100, -100);
    scene.add(dirLight2);

    // Marker Mesh group
    const markerGroup = new THREE.Group();
    globe.add(markerGroup);

    // Add marker meshes on globe
    const markerMeshes: { mesh: THREE.Mesh; marker: GlobeMarker }[] = [];
    markers.forEach((m) => {
      const pos = latLngToVector3(m.lat, m.lng, globeRadius);

      // Marker glowing pin
      const pinGeom = new THREE.SphereGeometry(2.5, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: 0xd0ff71, // Neon lime
      });
      const pinMesh = new THREE.Mesh(pinGeom, pinMat);
      pinMesh.position.copy(pos);
      markerGroup.add(pinMesh);

      // Outer ripple ring
      const ringGeom = new THREE.RingGeometry(2.8, 4.5, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.position.copy(pos.clone().multiplyScalar(1.01));
      ringMesh.lookAt(pos.clone().multiplyScalar(2));
      markerGroup.add(ringMesh);

      markerMeshes.push({ mesh: pinMesh, marker: m });
    });

    // Interaction controls (mouse / touch drag)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let reqId: number;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      globe.rotation.y += deltaX * 0.005;
      globe.rotation.x += deltaY * 0.005;

      // Clamp vertical tilt
      globe.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, globe.rotation.x));

      previousMousePosition = { x: clientX, y: clientY };
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

    // Resize handler
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
      if (!isDragging) {
        globe.rotation.y += autoRotateSpeed * 0.005;
      }

      // Project 3D markers to 2D screen coordinates
      const positions: {
        marker: GlobeMarker;
        screenX: number;
        screenY: number;
        visible: boolean;
      }[] = [];

      markerMeshes.forEach(({ mesh, marker }) => {
        const worldPos = new THREE.Vector3();
        mesh.getWorldPosition(worldPos);

        // Check if facing camera
        const cameraToMarker = worldPos.clone().sub(camera.position).normalize();
        const normal = worldPos.clone().normalize();
        const dot = normal.dot(cameraToMarker.negate());

        const isFacing = dot > 0.1;

        const screenPos = worldPos.clone().project(camera);
        const screenX = ((screenPos.x + 1) * width) / 2;
        const screenY = ((-screenPos.y + 1) * height) / 2;

        positions.push({
          marker,
          screenX,
          screenY,
          visible: isFacing,
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
  }, [markers, atmosphereColor, atmosphereIntensity, bumpScale, autoRotateSpeed]);

  return (
    <div
      ref={mountRef}
      className={`relative select-none overflow-hidden cursor-grab active:cursor-grabbing ${className}`}
      style={{ width: "100%", height: "100%" }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Floating 2D Marker Overlays */}
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
              className={`flex items-center gap-2 px-2.5 py-1 rounded-full border border-black/40 text-xs font-mono font-bold shadow-lg transition-all ${
                isHovered
                  ? "bg-[#D0FF71] text-black scale-110 shadow-[0_0_15px_rgba(208,255,113,0.8)]"
                  : "bg-black/80 text-white backdrop-blur-md hover:bg-black"
              }`}
            >
              {marker.src ? (
                <img
                  src={marker.src}
                  alt={marker.label}
                  className="w-4 h-4 rounded-full object-cover border border-white/40"
                />
              ) : (
                <span className="w-2 h-2 rounded-full bg-[#D0FF71] animate-ping" />
              )}
              <span className="whitespace-nowrap">{marker.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
