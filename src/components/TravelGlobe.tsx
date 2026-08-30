import React, { useState } from 'react';
import { Plane, MapPin, Compass } from 'lucide-react';
import { Globe3D, GlobeMarker } from './ui/3d-globe';
import { useLanguage } from '../i18n/LanguageContext';

const countryMarkers: GlobeMarker[] = [
  {
    lat: 41.8719,
    lng: 12.5674,
    flag: '🇮🇹',
    label: 'Italia (Home)',
    stemHeight: 1.14,
  },
  {
    lat: 37.0902,
    lng: -95.7129,
    flag: '🇺🇸',
    label: 'USA',
    stemHeight: 1.10,
  },
  {
    lat: 51.1657,
    lng: 10.4515,
    flag: '🇩🇪',
    label: 'Germania',
    stemHeight: 1.10,
  },
  {
    lat: 47.5162,
    lng: 14.5501,
    flag: '🇦🇹',
    label: 'Austria',
    stemHeight: 1.16,
  },
  {
    lat: 46.8182,
    lng: 8.2275,
    flag: '🇨🇭',
    label: 'Svizzera',
    stemHeight: 1.10,
  },
  {
    lat: 60.1282,
    lng: 18.6435,
    flag: '🇸🇪',
    label: 'Svezia',
    stemHeight: 1.12,
  },
  {
    lat: 52.1326,
    lng: 5.2913,
    flag: '🇳🇱',
    label: 'Olanda',
    stemHeight: 1.14,
  },
  {
    lat: 56.2639,
    lng: 9.5018,
    flag: '🇩🇰',
    label: 'Danimarca',
    stemHeight: 1.16,
  },
  {
    lat: 45.1000,
    lng: 15.2000,
    flag: '🇭🇷',
    label: 'Croazia',
    stemHeight: 1.08,
  },
  {
    lat: 43.9159,
    lng: 17.6791,
    flag: '🇧🇦',
    label: 'Bosnia',
    stemHeight: 1.15,
  },
  {
    lat: 35.1264,
    lng: 33.4299,
    flag: '🇨🇾',
    label: 'Cipro',
    stemHeight: 1.10,
  },
  {
    lat: 60.4720,
    lng: 8.4689,
    flag: '🇳🇴',
    label: 'Norvegia',
    stemHeight: 1.12,
  },
  {
    lat: 61.9241,
    lng: 25.7482,
    flag: '🇫🇮',
    label: 'Finlandia',
    stemHeight: 1.15,
  },
];

export const TravelGlobe: React.FC = () => {
  const { language } = useLanguage();
  const isIt = language === 'it';
  const [activeCountry, setActiveCountry] = useState<string | null>(null);

  return (
    <div className="relative group w-full my-8">
      {/* Offset Neo-Brutalist shadow */}
      <div className="absolute inset-0 bg-[#D0FF71] rounded-3xl border-2 border-black rotate-1 -z-10 group-hover:rotate-2 transition-transform duration-300" />

      <div className="bg-[#FFFDF5] border-2 border-black rounded-3xl p-6 sm:p-10 text-slate-900 neo-shadow overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Text Content & Country Chips */}
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
                ? 'Quando non sviluppo software, viaggiare è la mia più grande passione. Dalle capitali europee al nord Europa, dai Balcani a Cipro fino agli Stati Uniti: scoprire nuove culture e tradizioni allarga gli orizzonti e mi insegna ad approcciare ogni sfida da prospettive diverse.'
                : 'Outside of coding, traveling is my biggest passion: from European capitals to Northern Europe, the Balkans, Cyprus and the United States. Discovering new cultures and traditions broadens my horizons and teaches me to approach challenges from diverse angles.'}
            </p>

            {/* Country Tags */}
            <div className="space-y-2.5 pt-2">
              <p className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>{isIt ? 'Nazioni & Destinazioni visitate' : 'Visited Countries & Destinations'}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">({countryMarkers.length} paesi)</span>
              </p>

              <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
                {countryMarkers.map((m) => (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => {
                      const lbl = m.label || null;
                      setActiveCountry(activeCountry === lbl ? null : lbl);
                    }}
                    className={`px-2.5 py-1 rounded-xl border-2 border-black text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeCountry === m.label
                        ? 'bg-[#D0FF71] text-black neo-shadow-sm scale-105'
                        : 'bg-white text-slate-800 hover:bg-[#FDE047] neo-shadow-sm'
                    }`}
                  >
                    <span>{m.flag}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 text-xs font-mono text-slate-500">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping" />
              <span>{isIt ? 'Trascina per ruotare o usa la rotella per zoomare' : 'Drag to rotate or scroll to zoom'}</span>
            </div>
          </div>

          {/* Right Column: Centered Large 3D Globe */}
          <div className="lg:col-span-7 h-[480px] sm:h-[540px] md:h-[580px] w-full relative flex items-center justify-center">
            <Globe3D
              className="w-full h-full"
              markers={countryMarkers}
              activeMarkerLabel={activeCountry}
              config={{
                radius: 92,
                atmosphereColor: '#38bdf8',
                bumpScale: 3,
                autoRotateSpeed: 0.25,
                showAtmosphere: true,
              }}
              onMarkerHover={(m) => {
                if (m?.label) setActiveCountry(m.label);
              }}
              onMarkerClick={(m) => {
                if (m?.label) setActiveCountry(m.label);
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
