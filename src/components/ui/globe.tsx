import React, { useEffect, useRef } from "react";
import createGlobe, { Marker, Arc } from "cobe";

export interface GlobeProps {
  className?: string;
  markers?: Marker[];
  arcs?: Arc[];
}

export function WorldGlobe({
  className,
  markers = [
    { location: [41.56, 14.66], size: 0.09 }, // Campobasso / Italy (Home Base)
    { location: [40.41, -3.70], size: 0.06 }, // Spain
    { location: [48.85, 2.35], size: 0.06 }, // France
    { location: [51.50, -0.12], size: 0.06 }, // UK
    { location: [52.52, 13.40], size: 0.06 }, // Germany
    { location: [37.98, 23.72], size: 0.06 }, // Greece
    { location: [52.36, 4.90], size: 0.06 }, // Netherlands
    { location: [40.71, -74.00], size: 0.07 }, // USA
    { location: [35.67, 139.65], size: 0.07 }, // Japan
  ],
  arcs = [
    { from: [41.56, 14.66], to: [40.41, -3.70] }, // Spain
    { from: [41.56, 14.66], to: [48.85, 2.35] }, // France
    { from: [41.56, 14.66], to: [51.50, -0.12] }, // UK
    { from: [41.56, 14.66], to: [52.52, 13.40] }, // Germany
    { from: [41.56, 14.66], to: [37.98, 23.72] }, // Greece
    { from: [41.56, 14.66], to: [52.36, 4.90] }, // Netherlands
    { from: [41.56, 14.66], to: [40.71, -74.00] }, // USA
    { from: [41.56, 14.66], to: [35.67, 139.65] }, // Japan
  ],
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  useEffect(() => {
    let phi = 0;
    let width = 0;
    let animId: number;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: (width || 400) * 2,
      height: (width || 400) * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 14000,
      mapBrightness: 5,
      baseColor: [0.06, 0.09, 0.18],
      markerColor: [0.81, 1, 0.44], // #D0FF71 Neon Lime
      glowColor: [0.22, 0.74, 0.97], // #38BDF8 Cyan
      arcColor: [0.81, 1, 0.44],
      arcWidth: 1.2,
      markers,
      arcs,
      scale: 1,
    });

    const loop = () => {
      if (!pointerInteracting.current) {
        phi += 0.003;
      }
      globe.update({
        phi: phi + pointerInteractionMovement.current,
        width: (width || 400) * 2,
        height: (width || 400) * 2,
      });
      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [markers, arcs]);

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none ${
        className || ""
      }`}
      onPointerDown={(e) => {
        pointerInteracting.current =
          e.clientX - pointerInteractionMovement.current;
      }}
      onPointerUp={() => {
        pointerInteracting.current = null;
      }}
      onPointerOut={() => {
        pointerInteracting.current = null;
      }}
      onMouseMove={(e) => {
        if (pointerInteracting.current !== null) {
          const delta = e.clientX - pointerInteracting.current;
          pointerInteractionMovement.current = delta * 0.005;
        }
      }}
      onTouchMove={(e) => {
        if (pointerInteracting.current !== null && e.touches[0]) {
          const delta = e.touches[0].clientX - pointerInteracting.current;
          pointerInteractionMovement.current = delta * 0.005;
        }
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "520px",
          aspectRatio: 1,
        }}
      />
    </div>
  );
}
