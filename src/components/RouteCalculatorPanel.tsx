import React, { useState, useEffect } from 'react';
import {
  RouteDestinationTarget,
  SalvadorWeatherInfo,
  SalvadorTransitOption,
} from '../types';
import {
  fetchRealSalvadorRoute,
  fetchSalvadorWeather,
  getSalvadorTrafficStatus,
  getSalvadorTransitOptions,
  RealRouteResult,
} from '../utils/salvadorRoutingService';
import {
  Navigation,
  MapPin,
  Clock,
  Compass,
  CloudSun,
  Car,
  Bus,
  Footprints,
  AlertTriangle,
  ExternalLink,
  X,
  Share2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Eye,
} from 'lucide-react';

interface RouteCalculatorPanelProps {
  userLocation: { lat: number; lng: number } | null;
  destination: RouteDestinationTarget;
  onClose: () => void;
  onSelectNewDestination?: () => void;
}

export const RouteCalculatorPanel: React.FC<RouteCalculatorPanelProps> = ({
  userLocation,
  destination,
  onClose,
  onSelectNewDestination,
}) => {
  const [activeTab, setActiveTab] = useState<'car' | 'metro' | 'bus' | 'walking'>('car');
  const [loading, setLoading] = useState<boolean>(true);
  const [routeResult, setRouteResult] = useState<RealRouteResult | null>(null);
  const [weather, setWeather] = useState<SalvadorWeatherInfo | null>(null);
  const [transitOptions, setTransitOptions] = useState<SalvadorTransitOption[]>([]);
  const [traffic, setTraffic] = useState<{
    status: 'Livre' | 'Moderado' | 'Intenso' | 'Lento';
    color: string;
    mainAvenues: string[];
    recommendation: string;
  } | null>(null);

  // Effective origin coordinates (user GPS or Salvador central origin if user GPS not shared yet)
  const originCoord = userLocation || { lat: -13.0039, lng: -38.5326 }; // Farol da Barra fallback
  const isUsingRealGPS = Boolean(userLocation);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function computeAll() {
      // 1. Fetch Real Route Geometry & Distance via OSRM
      const route = await fetchRealSalvadorRoute(
        originCoord.lat,
        originCoord.lng,
        destination.coordinates.lat,
        destination.coordinates.lng
      );

      // 2. Fetch Real Weather via Open-Meteo
      const wData = await fetchSalvadorWeather(
        destination.coordinates.lat,
        destination.coordinates.lng
      );

      // 3. Traffic status
      const traf = getSalvadorTrafficStatus(originCoord, destination.coordinates);

      // 4. Transit Options (Metro + Bus + Car + Walking)
      const transit = getSalvadorTransitOptions(
        originCoord,
        destination.coordinates,
        destination.name,
        destination.neighborhood || 'Salvador'
      );

      if (isMounted) {
        setRouteResult(route);
        setWeather(wData);
        setTraffic(traf);
        setTransitOptions(transit);
        setLoading(false);
      }
    }

    computeAll();

    return () => {
      isMounted = false;
    };
  }, [userLocation, destination]);

  const activeOption =
    transitOptions.find((t) => t.type === activeTab) || transitOptions[0];

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originCoord.lat},${originCoord.lng}&destination=${destination.coordinates.lat},${destination.coordinates.lng}&travelmode=${
    activeTab === 'bus' || activeTab === 'metro'
      ? 'transit'
      : activeTab === 'walking'
      ? 'walking'
      : 'driving'
  }`;

  const wazeUrl = `https://waze.com/ul?ll=${destination.coordinates.lat},${destination.coordinates.lng}&navigate=yes`;

  return (
    <div
      id="route-calculator-panel"
      className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto sm:max-w-lg z-40 bg-white/98 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[85vh] animate-slideUp text-slate-800"
    >
      {/* Panel Top Header */}
      <div className="px-4 py-3.5 bg-gradient-to-r from-[#0B3D91] via-[#082C69] to-[#0B4F8A] text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#FFC72C] text-[#0B3D91] flex items-center justify-center font-bold text-sm shadow-md shrink-0">
            🧭
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                Calculador de Rota Real
              </span>
              {!isUsingRealGPS && (
                <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded font-semibold text-sky-100">
                  Origem: Barra
                </span>
              )}
            </div>
            <h3 className="font-heading font-black text-sm text-white truncate">
              Destino: {destination.name}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer shrink-0"
          title="Fechar painel de rota"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Body with Scroll */}
      <div className="p-4 overflow-y-auto space-y-3.5 flex-1 divide-y divide-slate-100">
        {/* Origin & Destination Summary Strip */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-slate-600">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
              <span className="font-bold truncate">
                {isUsingRealGPS ? '📍 Sua Localização Atual (GPS)' : '📍 Salvador (Barra / Referência)'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-800 font-bold">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
              <span className="truncate">🎯 {destination.name} ({destination.neighborhood || 'Salvador'})</span>
            </div>
          </div>

          {routeResult && (
            <div className="bg-blue-50 border border-blue-200/80 px-3 py-1.5 rounded-2xl text-right shrink-0">
              <span className="text-[9px] uppercase font-bold text-blue-700 block">Distância</span>
              <span className="text-base font-heading font-black text-[#0B3D91]">
                {routeResult.distanceKm} km
              </span>
            </div>
          )}
        </div>

        {/* Real Weather & Real Traffic Bar (Sem Simulação) */}
        <div className="pt-3 grid grid-cols-2 gap-2">
          {/* Weather Widget (Open-Meteo Real Data with Night/Day Adaptation) */}
          <div
            className={`relative overflow-hidden text-white rounded-2xl p-2.5 flex flex-col justify-between shadow-sm transition-all ${
              weather?.isDay === false
                ? 'bg-gradient-to-br from-[#061226] via-[#0B254E] to-[#16386C] border border-blue-900/50'
                : 'bg-gradient-to-br from-sky-400 via-sky-500 to-cyan-600'
            }`}
          >
            {/* Animated night stars or daytime sky */}
            {weather?.isDay === false ? (
              <>
                <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-amber-200 rounded-full animate-ping opacity-75 pointer-events-none" />
                <div className="absolute bottom-2 left-3 w-1 h-1 bg-white rounded-full opacity-60 pointer-events-none" />
                <div className="absolute top-4 left-8 w-1 h-1 bg-sky-200 rounded-full opacity-50 pointer-events-none" />
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-blue-400/10 rounded-full blur-sm pointer-events-none" />
              </>
            ) : (
              <>
                <div className="absolute top-1 left-0 w-full opacity-40 animate-cloud-drift-medium pointer-events-none">
                  <svg className="w-12 h-6 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                  </svg>
                </div>
                <div className="absolute top-0 right-1 w-10 h-10 bg-amber-300/30 rounded-full blur-sm pointer-events-none animate-sun-glow" />
              </>
            )}

            <div className="relative z-10 flex items-center justify-between">
              <span className={`text-[9px] font-black uppercase flex items-center gap-1 ${weather?.isDay === false ? 'text-amber-300' : 'text-sky-100'}`}>
                {weather?.isDay === false ? '🌙' : <CloudSun className="w-3.5 h-3.5 text-amber-200 animate-pulse" />}
                Clima no Destino
              </span>
              <span className="text-sm inline-block">{weather?.conditionIcon || (weather?.isDay === false ? '🌙' : '☀️')}</span>
            </div>
            <div className="relative z-10 mt-1">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-heading font-black text-white drop-shadow-xs">
                  {weather ? `${weather.temperature}°C` : (weather?.isDay === false ? '24°C' : '28°C')}
                </span>
                <span className={`text-[10px] font-semibold ${weather?.isDay === false ? 'text-blue-200' : 'text-sky-100'}`}>
                  (sensação {weather ? `${weather.apparentTemperature}°C` : (weather?.isDay === false ? '25°C' : '31°C')})
                </span>
              </div>
              <p className="text-[10px] text-white/95 truncate font-semibold mt-0.5">
                {weather?.condition || (weather?.isDay === false ? 'Noite agradável com brisa' : 'Ensolarado com brisa')}
              </p>
              <div className={`flex items-center gap-2 text-[9px] mt-1 ${weather?.isDay === false ? 'text-blue-200' : 'text-sky-100'}`}>
                <span>💧 {weather?.humidity || 78}%</span>
                <span>💨 {weather?.windSpeed || 14} km/h</span>
              </div>
            </div>
          </div>

          {/* Traffic Widget (Salvador Corridors Status) */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase text-amber-900 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                Trânsito Salvador
              </span>
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: traffic?.color || '#059669' }}
              />
            </div>
            <div className="mt-1">
              <div className="flex items-center gap-1.5">
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-black text-white"
                  style={{ backgroundColor: traffic?.color || '#059669' }}
                >
                  {traffic?.status || 'Moderado'}
                </span>
                <span className="text-[10px] text-amber-900 font-bold">
                  {traffic?.status === 'Intenso' ? 'Pico' : 'Fluindo'}
                </span>
              </div>
              <p className="text-[10px] text-amber-900 line-clamp-2 mt-1 leading-tight font-medium">
                {traffic?.recommendation || 'Tráfego fluindo nas principais vias de Salvador.'}
              </p>
            </div>
          </div>
        </div>

        {/* Modalidade de Transporte Tabs */}
        <div className="pt-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Opções de Deslocamento
            </span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Tarifa Ônibus/Metrô: R$ 5,20
            </span>
          </div>

          {/* Tab Selector Buttons */}
          <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('car')}
              className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                activeTab === 'car'
                  ? 'bg-white text-[#0B3D91] shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span className="text-[10px]">Carro / App</span>
            </button>

            <button
              onClick={() => setActiveTab('metro')}
              className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                activeTab === 'metro'
                  ? 'bg-white text-[#0B3D91] shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="text-xs">🚇</span>
              <span className="text-[10px]">Metrô Bahia</span>
            </button>

            <button
              onClick={() => setActiveTab('bus')}
              className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                activeTab === 'bus'
                  ? 'bg-white text-[#0B3D91] shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bus className="w-3.5 h-3.5" />
              <span className="text-[10px]">Ônibus</span>
            </button>

            <button
              onClick={() => setActiveTab('walking')}
              className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                activeTab === 'walking'
                  ? 'bg-white text-[#0B3D91] shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span className="text-[10px]">A pé</span>
            </button>
          </div>

          {/* Active Tab Details Card */}
          {activeOption && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h4 className="font-heading font-black text-xs sm:text-sm text-slate-900 leading-tight">
                    {activeOption.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                    Tarifa: {activeOption.fareText}
                  </p>
                </div>

                <div className="text-right bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs shrink-0">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Tempo Est.</span>
                  <span className="text-xs sm:text-sm font-heading font-black text-[#0B3D91]">
                    ~{activeOption.estimatedMinutes} min
                  </span>
                </div>
              </div>

              {/* Step Lines / Stations */}
              <div className="space-y-1.5">
                {activeOption.linesOrStations.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="w-4 h-4 rounded-full bg-[#0B3D91] text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{step}</span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/80 leading-relaxed">
                {activeOption.description}
              </p>

              {activeOption.integrationNote && (
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200/70 p-2 rounded-xl">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{activeOption.integrationNote}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions: External Navigation Links */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-[#0B3D91] hover:bg-[#082C69] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <span>Waze</span>
          </a>
        </div>

        <button
          onClick={onClose}
          className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          Fechar Rota
        </button>
      </div>
    </div>
  );
};
