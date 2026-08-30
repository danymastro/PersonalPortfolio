import React, { useEffect, useRef, useState } from "react";
import { Canvas, extend, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ThreeGlobe from "three-globe";
import * as THREE from "three";
import countries from "./globe.json";

// Extend ThreeGlobe so Fiber can use it as <threeGlobe />
extend({ ThreeGlobe });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      threeGlobe: any;
    }
  }
}

export interface GlobeConfig {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

export interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

export interface Position {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
}

const defaultProps: GlobeConfig = {
  pointSize: 1,
  atmosphereColor: "#ffffff",
  showAtmosphere: true,
  atmosphereAltitude: 0.1,
  polygonColor: "rgba(255,255,255,0.7)",
  globeColor: "#1d072e",
  emissive: "#000000",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  arcTime: 2000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  ...defaultPropsConfig(),
};

function defaultPropsConfig() {
  return {
    ambientLight: "#ffffff",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
  };
}

export function Globe({ globeConfig, data }: WorldProps) {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const [globeData, setGlobeData] = useState<
    | {
        size: number;
        order: number;
        color: (t: number) => string;
        lat: number;
        lng: number;
      }[]
    | null
  >(null);

  const mergedConfig = { ...defaultProps, ...globeConfig };

  useEffect(() => {
    if (!globeRef.current) return;

    const globe = globeRef.current;

    // Configure globe appearance
    globe
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(mergedConfig.showAtmosphere ?? true)
      .atmosphereColor(mergedConfig.atmosphereColor ?? "#38BDF8")
      .atmosphereAltitude(mergedConfig.atmosphereAltitude ?? 0.15)
      .hexPolygonColor(() => mergedConfig.polygonColor ?? "rgba(255, 255, 255, 0.7)");

    // Arcs
    globe
      .arcsData(data)
      .arcStartLat((d: any) => d.startLat)
      .arcStartLng((d: any) => d.startLng)
      .arcEndLat((d: any) => d.endLat)
      .arcEndLng((d: any) => d.endLng)
      .arcColor((d: any) => d.color)
      .arcAltitude((d: any) => d.arcAlt)
      .arcStroke(() => 0.5)
      .arcDashLength(mergedConfig.arcLength ?? 0.8)
      .arcDashInitialGap((e: any) => e.order)
      .arcDashGap(15)
      .arcDashAnimateTime(() => mergedConfig.arcTime ?? 2000);

    // Points & Rings
    const points: any[] = [];
    data.forEach((arc) => {
      points.push({
        size: mergedConfig.pointSize ?? 1,
        order: arc.order,
        color: (_t: number) => arc.color,
        lat: arc.startLat,
        lng: arc.startLng,
      });
      points.push({
        size: mergedConfig.pointSize ?? 1,
        order: arc.order,
        color: (_t: number) => arc.color,
        lat: arc.endLat,
        lng: arc.endLng,
      });
    });

    // Remove duplicates
    const uniquePoints = points.filter(
      (v, i, a) => a.findIndex((v2) => v2.lat === v.lat && v2.lng === v.lng) === i
    );

    setGlobeData(uniquePoints);
  }, [data]);

  useEffect(() => {
    if (!globeRef.current || !globeData) return;

    const globe = globeRef.current;
    const arcTime = mergedConfig.arcTime ?? 2000;
    const arcLength = mergedConfig.arcLength ?? 0.8;
    const rings = mergedConfig.rings ?? 2;
    const maxRings = mergedConfig.maxRings ?? 3;

    globe
      .ringsData(globeData)
      .ringColor((e: any) => (t: any) => e.color(t))
      .ringMaxRadius(maxRings)
      .ringPropagationSpeed(2)
      .ringRepeatPeriod((arcTime * arcLength) / rings);
  }, [globeData]);

  return (
    <threeGlobe ref={globeRef} />
  );
}

export function WebGLGlobe({ globeConfig, data }: WorldProps) {
  const mergedConfig = { ...defaultProps, ...globeConfig };

  return (
    <Canvas
      camera={{ position: [0, 0, 300], fov: 45 }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <ambientLight color={mergedConfig.ambientLight} intensity={0.6} />
      <directionalLight
        color={mergedConfig.directionalLeftLight}
        position={[-400, 100, 400]}
        intensity={0.8}
      />
      <directionalLight
        color={mergedConfig.directionalTopLight}
        position={[-200, 500, 200]}
        intensity={0.8}
      />
      <pointLight
        color={mergedConfig.pointLight}
        position={[-200, 500, 200]}
        intensity={0.8}
      />
      <Globe globeConfig={mergedConfig} data={data} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={220}
        maxDistance={380}
        autoRotate={mergedConfig.autoRotate ?? true}
        autoRotateSpeed={mergedConfig.autoRotateSpeed ?? 1.2}
      />
    </Canvas>
  );
}
