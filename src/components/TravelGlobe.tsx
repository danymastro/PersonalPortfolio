import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, MapPin, Compass, Sparkles } from 'lucide-react';
import { Globe3D, GlobeMarker } from './ui/3d-globe';
import { useLanguage } from '../i18n/LanguageContext';

const travelMarkers: GlobeMarker[] = [
  {
    lat: 41.56,
    lng: 14.66,
    src: 'https://assets.aceternity.com/avatars/1.webp',
    label: 'Campobasso (Home)',
  },
  {
    lat: 41.9028,
    lng: 12.4964,
    src: 'https://assets.aceternity.com/avatars/2.webp',
    label: 'Roma',
  },
  {
    lat: 45.4642,
    lng: 9.1900,
    src: 'https://assets.aceternity.com/avatars/3.webp',
    label: 'Milano',
  },
  {
    lat: 41.3879,
    lng: 2.1699,
    src: 'https://assets.aceternity.com/avatars/4.webp',
    label: 'Barcellona',
  },
  {
    lat: 40.4168,
    lng: -3.7038,
    src: 'https://assets.aceternity.com/avatars/5.webp',
    label: 'Madrid',
  },
  {
    lat: 48.8566,
    lng: 2.3522,
    src: 'https://assets.aceternity.com/avatars/6.webp',
    label: 'Parigi',
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    src: 'https://assets.aceternity.com/avatars/7.webp',
    label: 'Londra',
  },
  {
    lat: 52.5200,
    lng: 13.4050,
    src: 'https://assets.aceternity.com/avatars/8.webp',
    label: 'Berlino',
  },
  {
    lat: 52.3676,
    lng: 4.9041,
    src: 'https://assets.aceternity.com/avatars/9.webp',
    label: 'Amsterdam',
  },
  {
    lat: 37.9838,
    lng: 23.7275,
    src: 'https://assets.aceternity.com/avatars/10.webp',
    label: 'Atene',
  },
  {
    lat: 40.7128,
    lng: -74.0060,
    src: 'https://assets.aceternity.com/avatars/11.webp',
    label: 'New York',
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    src: 'https://assets.aceternity.com/avatars/12.webp',
    label: 'Tokyo',
  },
];

export const TravelGlobe: React.FC = () => {
  const { language } = useLanguage();
  const isIt = language === 'it';
  const [activeCity, setActiveCity] = useState<string | null>(null);

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

            {/* Pinned Nations / Cities Chips */}
            <div className="space-y-2.5 pt-2">
              <p className="text-[11px] font-mono font-bold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D0FF71]" />
                <span>{isIt ? 'Destinazioni & Nazioni esplorate' : 'Explored Cities & Destinations'}</span>
              </p>

              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                {travelMarkers.map((m) => (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => setActiveCity(activeCity === m.label ? null : m.label)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeCity === m.label
                        ? 'bg-[#D0FF71] text-black border-black neo-shadow-sm scale-105'
                        : 'bg-white/5 border-white/15 text-white/90 hover:bg-white/15 hover:border-white/30'
                    }`}
                  >
                    {m.src && (
                      <img
                        src={m.src}
                        alt={m.label}
                        className="w-3.5 h-3.5 rounded-full object-cover"
                      />
                    )}
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 text-xs font-mono text-white/60">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D0FF71] animate-ping" />
              <span>{isIt ? 'Globo 3D interattivo: trascina per ruotare ed esplorare i pin' : 'Interactive 3D Globe: drag to rotate and explore pins'}</span>
            </div>
          </div>

          {/* 3D Interactive Globe Canvas */}
          <div className="lg:col-span-7 h-[380px] sm:h-[460px] md:h-[500px] w-full relative flex items-center justify-center">
            <Globe3D
              className="w-full h-full"
              markers={travelMarkers}
              config={{
                atmosphereColor: '#38bdf8',
                atmosphereIntensity: 18,
                bumpScale: 5,
                autoRotateSpeed: 0.35,
              }}
              onMarkerHover={(m) => {
                if (m) setActiveCity(m.label);
              }}
            />

            {/* Interactive Overlay badge */}
            <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-mono font-bold text-white/90 flex items-center gap-1.5 pointer-events-none z-30">
              <Plane className="w-3 h-3 text-[#38BDF8]" />
              <span>Base: Campobasso, IT (41.56° N, 14.66° E)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
