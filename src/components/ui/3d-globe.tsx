import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import ThreeGlobe from 'three-globe';
import { cn } from '@/lib/utils';

export interface GlobeMarker {
  lat: number;
  lng: number;
  flag?: string;
  src?: string;
  label?: string;
  stemHeight?: number;
}

export interface Globe3DConfig {
  radius?: number;
  pointLight?: string;
  atmosphereColor?: string;
  showAtmosphere?: boolean;
  atmosphereAltitude?: number;
  atmosphereIntensity?: number;
  polygonColor?: string;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  bumpScale?: number;
  autoRotate?: boolean;
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
    pointLight = "#38bdf8",
    atmosphereColor = "#38bdf8",
    showAtmosphere = true,
    atmosphereAltitude = 0.12,
    polygonColor = "rgba(255, 255, 255, 0.75)",
    emissive = "#062056",
    emissiveIntensity = 0.15,
    shininess = 0.9,
    autoRotate = true,
    autoRotateSpeed = 0.35,
  } = config;

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 600;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(0, 0, 275);
    camera.lookAt(0, 0, 0);

    // Renderer (100% transparent)
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // Lock zoom as requested
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = autoRotateSpeed;
    controls.minPolarAngle = Math.PI / 3.5;
    controls.maxPolarAngle = Math.PI - Math.PI / 3;

    // GitHub Style ThreeGlobe instance
    const globe = new ThreeGlobe()
      .showGlobe(true)
      .showAtmosphere(showAtmosphere)
      .atmosphereColor(atmosphereColor)
      .atmosphereAltitude(atmosphereAltitude);

    // Globe Material (GitHub dark navy sphere with glossy dotted hex polygons)
    const globeMaterial = globe.globeMaterial() as THREE.MeshPhongMaterial;
    globeMaterial.color = new THREE.Color(0x050d1a);
    globeMaterial.emissive = new THREE.Color(emissive);
    globeMaterial.emissiveIntensity = emissiveIntensity;
    globeMaterial.shininess = shininess;

    // Load GeoJSON Countries Data for Hexagon Polygons
    fetch('/data/globe.json')
      .then((res) => res.json())
      .then((countriesData) => {
        globe
          .hexPolygonsData(countriesData.features)
          .hexPolygonResolution(3)
          .hexPolygonMargin(0.7)
          .hexPolygonUseDots(true)
          .hexPolygonColor(() => polygonColor);
      })
      .catch((err) => console.warn('Could not load globe.json:', err));

    // Home Base (Campobasso / Italy)
    const homeBase = { lat: 41.56, lng: 14.66 };

    // Flight Arcs connecting Home Base to all visited destinations
    const arcsData = markers
      .filter((m) => !(Math.abs(m.lat - homeBase.lat) < 1 && Math.abs(m.lng - homeBase.lng) < 1))
      .map((m, idx) => ({
        startLat: homeBase.lat,
        startLng: homeBase.lng,
        endLat: m.lat,
        endLng: m.lng,
        color: idx % 2 === 0 ? ['#2563EB', '#38BDF8', '#D0FF71'] : ['#38BDF8', '#D0FF71', '#FDE047'],
      }));

    globe
      .arcsData(arcsData)
      .arcColor('color')
      .arcAltitudeAutoScale(0.28)
      .arcStroke(0.6)
      .arcDashLength(0.85)
      .arcDashGap(3)
      .arcDashInitialGap((e: any) => (e.startLat + e.endLat) % 5)
      .arcDashAnimateTime(1200);

    // Pulsing Rings at destinations
    const ringsData = markers.map((m) => ({
      lat: m.lat,
      lng: m.lng,
      color: '#38bdf8',
      maxR: 4.5,
      propagationSpeed: 2.5,
      repeatPeriod: 900,
    }));

    globe
      .ringsData(ringsData)
      .ringColor('color')
      .ringMaxRadius('maxR')
      .ringPropagationSpeed('propagationSpeed')
      .ringRepeatPeriod('repeatPeriod');

    // Group wrapper offset 3/4 to the right & initial Europe front-facing orientation
    const globeGroup = new THREE.Group();
    globeGroup.position.set(32, 0, 0); // 3/4 visible on right
    globeGroup.rotation.x = 0.45;
    globeGroup.rotation.y = -3.22; // Europe front-center
    globeGroup.add(globe);
    scene.add(globeGroup);

    // Top Pin Anchors for 2D HTML markers
    const markerMeshes: { topMesh: THREE.Object3D; marker: GlobeMarker }[] = [];
    const radius = 100; // Standard ThreeGlobe radius

    markers.forEach((m) => {
      const topPos = latLngToVector3(m.lat, m.lng, radius * (m.stemHeight || 1.12));
      const topAnchor = new THREE.Object3D();
      topAnchor.position.copy(topPos);
      globeGroup.add(topAnchor);
      markerMeshes.push({ topMesh: topAnchor, marker: m });
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dLight1.position.set(-400, 200, 400);
    scene.add(dLight1);

    const dLight2 = new THREE.DirectionalLight(new THREE.Color(pointLight), 1.0);
    dLight2.position.set(200, 500, 200);
    scene.add(dLight2);

    const dLight3 = new THREE.DirectionalLight(0x38bdf8, 0.8);
    dLight3.position.set(-200, -500, -200);
    scene.add(dLight3);

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
    let reqId: number;
    const animate = () => {
      controls.update();
      globeGroup.updateMatrixWorld(true);

      // Real-time 60fps DOM transform sync for HTML tags
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
      window.removeEventListener("resize", onResize);
      controls.dispose();
      renderer.dispose();
    };
  }, [markers, pointLight, atmosphereColor, showAtmosphere, atmosphereAltitude, polygonColor, emissive, emissiveIntensity, shininess, autoRotate, autoRotateSpeed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative select-none overflow-visible cursor-grab active:cursor-grabbing w-full h-full flex items-center justify-center",
        className
      )}
    >
      <canvas ref={canvasRef} className="w-full h-full block bg-transparent" />

      {/* Floating 2D Marker Overlays */}
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
