import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, MapPin, Compass, Sparkles } from 'lucide-react';
import { WebGLGlobe, Position } from './ui/globe';
import { useLanguage } from '../i18n/LanguageContext';

export interface TravelDestination {
  id: string;
  name: string;
  flag: string;
  lat: number;
  lng: number;
  color: string;
}

const DESTINATIONS: TravelDestination[] = [
  { id: 'italy', name: 'Italia (Home)', flag: '🇮🇹', lat: 41.56, lng: 14.66, color: '#D0FF71' },
  { id: 'spain', name: 'Spagna', flag: '🇪🇸', lat: 40.41, lng: -3.70, color: '#FDE047' },
  { id: 'france', name: 'Francia', flag: '🇫🇷', lat: 48.85, lng: 2.35, color: '#38BDF8' },
  { id: 'uk', name: 'Regno Unito', flag: '🇬🇧', lat: 51.50, lng: -0.12, color: '#F9A8D4' },
  { id: 'germany', name: 'Germania', flag: '🇩🇪', lat: 52.52, lng: 13.40, color: '#4ADE80' },
  { id: 'greece', name: 'Grecia', flag: '🇬🇷', lat: 37.98, lng: 23.72, color: '#60A5FA' },
  { id: 'netherlands', name: 'Paesi Bassi', flag: '🇳🇱', lat: 52.36, lng: 4.90, color: '#FB923C' },
  { id: 'usa', name: 'Stati Uniti', flag: '🇺🇸', lat: 40.71, lng: -74.00, color: '#C084FC' },
  { id: 'japan', name: 'Giappone', flag: '🇯🇵', lat: 35.67, lng: 139.65, color: '#F43F5E' },
];

// Arcs from Home (Campobasso, Italy) to destinations
const SAMPLE_ARCS: Position[] = DESTINATIONS.filter((d) => d.id !== 'italy').map((d, i) => ({
  order: i + 1,
  startLat: 41.56,
  startLng: 14.66,
  endLat: d.lat,
  endLng: d.lng,
  arcAlt: 0.25 + (i % 3) * 0.08,
  color: d.color,
}));

export const TravelGlobe: React.FC = () => {
  const { language } = useLanguage();
  const isIt = language === 'it';
  const [selectedDest, setSelectedDest] = useState<string | null>(null);

  const globeConfig = {
    pointSize: 3,
    globeColor: '#070A13',
    showAtmosphere: true,
    atmosphereColor: '#38BDF8',
    atmosphereAltitude: 0.15,
    polygonColor: 'rgba(255, 255, 255, 0.75)',
    emissive: '#040714',
    emissiveIntensity: 0.2,
    shininess: 0.9,
    arcTime: 1800,
    arcLength: 0.75,
    rings: 2,
    maxRings: 4,
    autoRotate: true,
    autoRotateSpeed: 0.8,
  };

  return (
    <div className="relative group w-full my-8">
      {/* Offset Neo-Brutalist shadow */}
      <div className="absolute inset-0 bg-[#38BDF8] rounded-3xl border-2 border-black rotate-1 -z-10 group-hover:rotate-2 transition-transform duration-300" />

      <div className="bg-[#0B0F19] border-2 border-black rounded-3xl p-6 sm:p-10 text-white neo-shadow overflow-hidden relative">
        {/* Glowing ambient light flare */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#38BDF8] rounded-full blur-3xl opacity-15 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#D0FF71] rounded-full blur-3xl opacity-10 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Text & Destination list */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#38BDF8]/20 border border-[#38BDF8]/50 rounded-full text-[10px] sm:text-xs font-mono font-bold text-[#38BDF8] uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
                <span>{isIt ? 'Oltre il codice · Passione Viaggi' : 'Beyond Code · Travel & Explore'}</span>
              </div>

              <h3 className="font-syne font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
                {isIt ? (
                  <>
                    Esplorare il mondo <br />
                    <span className="text-[#D0FF71]">per aprire la mente.</span>
                  </>
                ) : (
                  <>
                    Exploring the world <br />
                    <span className="text-[#D0FF71]">to broaden perspectives.</span>
                  </>
                )}
              </h3>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {isIt
                ? 'Quando non sviluppo software, viaggiare è la mia più grande passione. Visitare nuove nazioni, culture e città allarga gli orizzonti e mi insegna a guardare ogni problema da prospettive diverse — una curiosità che poi trasferisco in ogni prodotto digitale che realizzo.'
                : 'Outside of coding, traveling is my biggest passion. Discovering new cultures and cities broadens my horizons and teaches me to approach problems from diverse angles — a curiosity I pour directly into every digital product I build.'}
            </p>

            {/* Pinned Nations Chips */}
            <div className="space-y-2.5 pt-2">
              <p className="text-[11px] font-mono font-bold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D0FF71]" />
                <span>{isIt ? 'Nazioni & Destinazioni visitate' : 'Visited Countries & Destinations'}</span>
              </p>

              <div className="flex flex-wrap gap-2">
                {DESTINATIONS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDest(selectedDest === d.id ? null : d.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedDest === d.id
                        ? 'bg-[#D0FF71] text-black border-black neo-shadow-sm scale-105'
                        : 'bg-white/5 border-white/15 text-white/90 hover:bg-white/15 hover:border-white/30'
                    }`}
                  >
                    <span>{d.flag}</span>
                    <span>{d.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 text-xs font-mono text-white/60">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D0FF71] animate-ping" />
              <span>{isIt ? 'Globo 3D interattivo: trascina per ruotare' : 'Interactive 3D Globe: drag to rotate'}</span>
            </div>
          </div>

          {/* 3D Interactive Globe Canvas */}
          <div className="lg:col-span-7 h-[360px] sm:h-[460px] md:h-[500px] w-full relative flex items-center justify-center">
            <div className="w-full h-full">
              <WebGLGlobe globeConfig={globeConfig} data={SAMPLE_ARCS} />
            </div>

            {/* Interactive Overlay badge */}
            <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-mono font-bold text-white/80 flex items-center gap-1.5 pointer-events-none">
              <Plane className="w-3 h-3 text-[#38BDF8]" />
              <span>Base: Campobasso, IT (41.56° N, 14.66° E)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
