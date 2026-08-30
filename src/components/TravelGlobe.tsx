import React, { useState } from 'react';
import { Plane, MapPin, Compass } from 'lucide-react';
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
      <div className="absolute inset-0 bg-[#D0FF71] rounded-3xl border-2 border-black rotate-1 -z-10 group-hover:rotate-2 transition-transform duration-300" />

      <div className="bg-[#FFFDF5] border-2 border-black rounded-3xl p-6 sm:p-10 text-slate-900 neo-shadow overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Text Content & City Chips */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-[#38BDF8]/20 border-2 border-black text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5 neo-shadow-sm text-slate-900">
                <Compass className="w-3.5 h-3.5 animate-spin text-[#2563EB]" style={{ animationDuration: '10s' }} />
                <span>{isIt ? 'Oltre il codice · Passione Viaggi' : 'Beyond Code · Travel & Explore'}</span>
              </span>

              <h3 className="font-syne font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight leading-tight">
                {isIt ? (
                  <>
                    All over the world. <br />
                    <span className="text-[#2563EB] underline decoration-4 underline-offset-6">
                      Esplorare il mondo
                    </span>{' '}
                    per aprire la mente.
                  </>
                ) : (
                  <>
                    All over the world. <br />
                    <span className="text-[#2563EB] underline decoration-4 underline-offset-6">
                      Exploring the globe
                    </span>{' '}
                    to broaden perspectives.
                  </>
                )}
              </h3>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              {isIt
                ? 'Quando non sviluppo software, viaggiare è la mia più grande passione. Visitare nuove nazioni, culture e città allarga gli orizzonti e mi insegna a guardare ogni problema da prospettive diverse — una curiosità che poi trasferisco in ogni prodotto digitale che realizzo.'
                : 'Outside of coding, traveling is my biggest passion. Discovering new cultures and cities broadens my horizons and teaches me to approach problems from diverse angles — a curiosity I pour directly into every digital product I build.'}
            </p>

            {/* Destination Tags */}
            <div className="space-y-2.5 pt-2">
              <p className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>{isIt ? 'Destinazioni & Nazioni esplorate' : 'Explored Cities & Destinations'}</span>
              </p>

              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                {travelMarkers.map((m) => (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => {
                      const lbl = m.label || null;
                      setActiveCity(activeCity === lbl ? null : lbl);
                    }}
                    className={`px-2.5 py-1 rounded-xl border-2 border-black text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeCity === m.label
                        ? 'bg-[#D0FF71] text-black neo-shadow-sm scale-105'
                        : 'bg-white text-slate-800 hover:bg-[#FDE047] neo-shadow-sm'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 text-xs font-mono text-slate-500">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping" />
              <span>{isIt ? 'Trascina per ruotare ed esplorare il globo 3D' : 'Drag to rotate & explore the 3D globe'}</span>
            </div>
          </div>

          {/* Right Column: Centered 3D Globe */}
          <div className="lg:col-span-7 h-[420px] sm:h-[480px] md:h-[500px] w-full relative flex items-center justify-center">
            <Globe3D
              className="w-full h-full"
              markers={travelMarkers}
              config={{
                radius: 68,
                atmosphereColor: '#60a5fa',
                bumpScale: 3,
                autoRotateSpeed: 0.35,
                showAtmosphere: true,
              }}
              onMarkerHover={(m) => {
                if (m?.label) setActiveCity(m.label);
              }}
            />

            {/* Interactive Overlay badge */}
            <div className="absolute bottom-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full border-2 border-black text-[10px] font-mono font-bold text-slate-900 flex items-center gap-1.5 pointer-events-none z-30 neo-shadow-sm">
              <Plane className="w-3 h-3 text-[#2563EB]" />
              <span>Base: Campobasso, IT (41.56° N, 14.66° E)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
