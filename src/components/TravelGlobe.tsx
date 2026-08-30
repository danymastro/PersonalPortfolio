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
    stemHeight: 1.28,
  },
  {
    lat: 40.7128,
    lng: -74.0060,
    src: 'https://assets.aceternity.com/avatars/2.webp',
    label: 'New York',
    stemHeight: 1.22,
  },
  {
    lat: 59.3293,
    lng: 18.0686,
    src: 'https://assets.aceternity.com/avatars/3.webp',
    label: 'Stoccolma',
    stemHeight: 1.22,
  },
  {
    lat: 59.8586,
    lng: 17.6389,
    src: 'https://assets.aceternity.com/avatars/4.webp',
    label: 'Uppsala',
    stemHeight: 1.38,
  },
  {
    lat: 55.6761,
    lng: 12.5683,
    src: 'https://assets.aceternity.com/avatars/5.webp',
    label: 'Copenaghen',
    stemHeight: 1.20,
  },
  {
    lat: 55.6050,
    lng: 13.0038,
    src: 'https://assets.aceternity.com/avatars/6.webp',
    label: 'Malmö',
    stemHeight: 1.35,
  },
  {
    lat: 59.9139,
    lng: 10.7522,
    src: 'https://assets.aceternity.com/avatars/7.webp',
    label: 'Oslo',
    stemHeight: 1.26,
  },
  {
    lat: 57.7089,
    lng: 11.9746,
    src: 'https://assets.aceternity.com/avatars/8.webp',
    label: 'Göteborg',
    stemHeight: 1.40,
  },
  {
    lat: 60.1699,
    lng: 24.9384,
    src: 'https://assets.aceternity.com/avatars/9.webp',
    label: 'Helsinki',
    stemHeight: 1.22,
  },
  {
    lat: 69.6492,
    lng: 18.9553,
    src: 'https://assets.aceternity.com/avatars/10.webp',
    label: 'Tromsø',
    stemHeight: 1.26,
  },
  {
    lat: 64.1466,
    lng: -21.9426,
    src: 'https://assets.aceternity.com/avatars/11.webp',
    label: 'Reykjavik',
    stemHeight: 1.22,
  },
  {
    lat: 52.3676,
    lng: 4.9041,
    src: 'https://assets.aceternity.com/avatars/12.webp',
    label: 'Amsterdam',
    stemHeight: 1.24,
  },
  {
    lat: 49.4521,
    lng: 11.0767,
    src: 'https://assets.aceternity.com/avatars/13.webp',
    label: 'Norimberga',
    stemHeight: 1.36,
  },
  {
    lat: 48.1351,
    lng: 11.5820,
    src: 'https://assets.aceternity.com/avatars/1.webp',
    label: 'Monaco di Baviera',
    stemHeight: 1.20,
  },
  {
    lat: 48.2600,
    lng: 11.4340,
    src: 'https://assets.aceternity.com/avatars/2.webp',
    label: 'Dachau',
    stemHeight: 1.35,
  },
  {
    lat: 47.2692,
    lng: 11.4041,
    src: 'https://assets.aceternity.com/avatars/3.webp',
    label: 'Innsbruck',
    stemHeight: 1.28,
  },
  {
    lat: 45.2267,
    lng: 13.5958,
    src: 'https://assets.aceternity.com/avatars/4.webp',
    label: 'Poreč',
    stemHeight: 1.20,
  },
  {
    lat: 43.8563,
    lng: 18.4131,
    src: 'https://assets.aceternity.com/avatars/5.webp',
    label: 'Sarajevo',
    stemHeight: 1.26,
  },
  {
    lat: 34.7071,
    lng: 33.0226,
    src: 'https://assets.aceternity.com/avatars/6.webp',
    label: 'Limassol',
    stemHeight: 1.22,
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
                ? 'Quando non sviluppo software, viaggiare è la mia più grande passione: dalle grandi capitali europee al nord Europa fino a New York. Visitare nuove culture e città allarga gli orizzonti e mi insegna ad approcciare ogni sfida da prospettive diverse.'
                : 'Outside of coding, traveling is my biggest passion: from major European capitals to Northern Europe and New York. Discovering new cultures and cities broadens my horizons and teaches me to approach challenges from diverse angles.'}
            </p>

            {/* Destination Tags */}
            <div className="space-y-2.5 pt-2">
              <p className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>{isIt ? 'Città & Destinazioni visitate' : 'Visited Cities & Destinations'}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">({travelMarkers.length} mete)</span>
              </p>

              <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
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
              <span>{isIt ? 'Trascina per ruotare o usa la rotella del mouse per zoomare' : 'Drag to rotate or scroll to zoom'}</span>
            </div>
          </div>

          {/* Right Column: Centered 3D Globe with Staggered 3D Pins */}
          <div className="lg:col-span-7 h-[440px] sm:h-[490px] md:h-[520px] w-full relative flex items-center justify-center">
            <Globe3D
              className="w-full h-full"
              markers={travelMarkers}
              activeMarkerLabel={activeCity}
              config={{
                radius: 68,
                atmosphereColor: '#38bdf8',
                bumpScale: 3,
                autoRotateSpeed: 0.3,
                showAtmosphere: true,
              }}
              onMarkerHover={(m) => {
                if (m?.label) setActiveCity(m.label);
              }}
              onMarkerClick={(m) => {
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
