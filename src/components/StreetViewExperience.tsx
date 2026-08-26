import React, { useState, useEffect, useRef } from 'react';
import { Store } from '../types';
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  Compass,
  MapPin,
  MessageCircle,
  Navigation,
  Store as StoreIcon,
  Star,
  Sparkles,
  ExternalLink,
  Eye,
  AlertCircle,
  RotateCw,
} from 'lucide-react';

interface StreetViewExperienceProps {
  store: Store;
  onBackToMap: () => void;
  onOpenChat?: (store: Store) => void;
  onSelectStore?: (store: Store) => void;
}

export const StreetViewExperience: React.FC<StreetViewExperienceProps> = ({
  store,
  onBackToMap,
  onOpenChat,
  onSelectStore,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [heading, setHeading] = useState<number>(store.street_view_heading ?? 120);
  const [pitch, setPitch] = useState<number>(store.street_view_pitch ?? 0);
  const [zoomLevel, setZoomLevel] = useState<number>(store.street_view_zoom ?? 1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const lat = store.coordinates.lat;
  const lng = store.coordinates.lng;

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Street view iframe source url
  // Using Google Maps official Street View embed layer
  const streetViewUrl = `https://maps.google.com/maps?layer=c&cbll=${lat},${lng}&cbp=11,${heading},0,0,0&output=svembed`;
  const googleMapsRouteUrl =
    store.googleMapsUrl ||
    store.mapLink ||
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  const hasOffer = store.offers && store.offers.length > 0;
  const activeOffer = hasOffer ? store.offers[0] : null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-slate-950 flex flex-col overflow-hidden select-none font-sans"
    >
      {/* Top Header Navigation Bar */}
      <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMap}
            className="h-10 px-3.5 bg-white/10 hover:bg-[#FFC72C] text-white hover:text-[#0B4F8A] rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 shadow-sm active:scale-95 border border-white/10 hover:border-[#FFC72C]"
            title="Voltar ao mapa na localização da loja"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao mapa</span>
          </button>

          {/* Store Info Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white max-w-[200px] truncate">
              {store.name}
            </span>
            <span className="text-[11px] text-sky-300 font-medium">
              • {store.neighborhood}
            </span>
          </div>
        </div>

        {/* Center Title Badge */}
        <div className="flex items-center gap-2 text-center">
          <div className="px-3 py-1 bg-[#0B4F8A] border border-sky-400/30 rounded-full flex items-center gap-1.5 shadow-sm">
            <Eye className="w-3.5 h-3.5 text-[#FFC72C]" />
            <span className="text-xs font-black tracking-wide text-white uppercase">
              Visão da Rua Salvador
            </span>
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          <a
            href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}&heading=${heading}&pitch=${pitch}&fov=90`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex h-9 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold items-center gap-1.5 transition-all"
            title="Abrir no Google Street View oficial"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#FFC72C]" />
            <span>Google Maps</span>
          </a>

          <button
            onClick={toggleFullscreen}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center transition-all border border-white/10 active:scale-95"
            title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Street View Body */}
      <div className="relative flex-1 w-full h-full bg-slate-900 overflow-hidden">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/80 z-20 flex flex-col items-center justify-center gap-3 text-white">
            <div className="w-10 h-10 border-3 border-[#FFC72C] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs sm:text-sm font-bold text-slate-200">
              Carregando Visão da Rua de Salvador...
            </p>
            <p className="text-[11px] text-slate-400">
              {store.address || store.neighborhood}
            </p>
          </div>
        )}

        {/* Real Street View Embed */}
        {!hasError ? (
          <iframe
            src={streetViewUrl}
            className="w-full h-full border-0 absolute inset-0 z-10"
            allowFullScreen
            loading="eager"
            referrerPolicy="no-referrer"
            title={`Visão da Rua - ${store.name}`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        ) : (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center text-white bg-slate-900">
            <AlertCircle className="w-12 h-12 text-[#FFC72C] mb-3" />
            <h3 className="text-lg font-bold font-heading mb-1">
              Não encontramos uma visão da rua disponível neste endereço exato.
            </h3>
            <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
              O mapeamento fotográfico pode não cobrir a calçada interna deste ponto de {store.neighborhood}. Você ainda pode traçar rotas e ver no mapa.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onBackToMap}
                className="px-5 py-2.5 bg-[#FFC72C] text-[#0B4F8A] font-black rounded-2xl text-xs hover:bg-[#f5bc20] transition-all shadow-md active:scale-95"
              >
                ← Voltar ao mapa
              </button>
              <a
                href={googleMapsRouteUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs transition-all flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-[#FFC72C]" />
                <span>Abrir GPS / Rotas</span>
              </a>
            </div>
          </div>
        )}

        {/* Desktop Top-Right Mini Map Overlay */}
        <div className="hidden lg:block absolute top-4 right-4 z-30 w-52 h-44 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30 bg-slate-900/80 backdrop-blur-md">
          <div className="absolute top-2 left-2 z-10 bg-slate-900/90 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
            <Compass className="w-3 h-3 text-[#FFC72C]" />
            <span>MINI MAPA</span>
          </div>
          {/* Static / interactive OSM mini map centered on store */}
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.003}%2C${lat - 0.003}%2C${lng + 0.003}%2C${lat + 0.003}&layer=mapnik&marker=${lat}%2C${lng}`}
            className="w-full h-full border-0 pointer-events-none opacity-85"
            title="Mini mapa de localização"
          />
          <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-xs p-1.5 rounded-lg text-white text-[10px] flex items-center justify-between">
            <span className="truncate font-bold text-sky-200">📍 {store.neighborhood}</span>
            <span className="font-mono text-[#FFC72C] text-[9px]">{lat.toFixed(4)}, {lng.toFixed(4)}</span>
          </div>
        </div>

        {/* Desktop Bottom Store Card */}
        <div className="hidden md:block absolute bottom-6 left-6 right-6 z-30 max-w-2xl mx-auto">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-3xl p-4 text-white shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <img
                src={store.logo || store.coverImage}
                alt={store.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-white/30 bg-white shrink-0 shadow-md"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-heading font-black text-sm text-white truncate">
                    {store.name}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                      store.isOpenNow ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {store.isOpenNow ? '🟢 Aberto' : '🔴 Fechado'}
                  </span>
                  <div className="flex items-center gap-1 bg-amber-400/20 text-[#FFC72C] px-1.5 py-0.5 rounded text-[10px] font-bold">
                    <Star className="w-3 h-3 fill-[#FFC72C]" />
                    <span>{store.rating.toFixed(1)}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#FFC72C] shrink-0" />
                  <span>{store.address || store.neighborhood}</span>
                </p>

                {activeOffer && (
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-[#FFC72C] font-black">
                    <Sparkles className="w-3 h-3 fill-[#FFC72C]" />
                    <span className="truncate">🔥 {activeOffer.title} ({activeOffer.discountBadge})</span>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {onOpenChat && (
                <button
                  onClick={() => onOpenChat(store)}
                  className="h-10 px-3.5 bg-[#FFC72C] hover:bg-[#f5bc20] text-[#0B4F8A] font-black text-xs rounded-2xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                  title="Conversar com a loja"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat</span>
                </button>
              )}

              {onSelectStore && (
                <button
                  onClick={() => onSelectStore(store)}
                  className="h-10 px-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl transition-all border border-white/15 flex items-center gap-1.5"
                  title="Ver perfil completo da loja"
                >
                  <StoreIcon className="w-4 h-4 text-[#FFC72C]" />
                  <span>Ver Loja</span>
                </button>
              )}

              <a
                href={googleMapsRouteUrl}
                target="_blank"
                rel="noreferrer"
                className="h-10 px-3.5 bg-[#0B4F8A] hover:bg-[#083a66] text-white font-bold text-xs rounded-2xl transition-all border border-sky-400/30 flex items-center gap-1.5 shadow-md"
                title="Abrir rota no Google Maps GPS"
              >
                <Navigation className="w-4 h-4 text-[#FFC72C]" />
                <span>Rota</span>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Sheet Card */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 z-30 p-4 pb-6 bg-gradient-to-t from-slate-950 via-slate-900/95 to-slate-900/90 backdrop-blur-xl border-t border-white/15 rounded-t-3xl shadow-2xl text-white">
          {/* Store Info Row */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={store.logo || store.coverImage}
                alt={store.name}
                className="w-10 h-10 rounded-xl object-cover border border-white/30 bg-white shrink-0"
              />
              <div className="min-w-0">
                <h3 className="font-heading font-black text-sm text-white truncate">
                  {store.name}
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <span className={store.isOpenNow ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                    {store.isOpenNow ? '🟢 Aberto' : '🔴 Fechado'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {store.rating.toFixed(1)}
                  </span>
                  <span>•</span>
                  <span className="text-sky-300 truncate">{store.neighborhood}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Offer Banner if available */}
          {activeOffer && (
            <div className="mb-3 bg-amber-400/15 border border-amber-400/30 rounded-2xl p-2 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <span className="font-black text-[#FFC72C] shrink-0">🔥</span>
                <span className="font-bold text-amber-200 truncate text-[11px]">
                  {activeOffer.title}
                </span>
              </div>
              <span className="px-2 py-0.5 bg-[#FFC72C] text-[#0B4F8A] font-black text-[10px] rounded-lg shrink-0">
                {activeOffer.discountBadge}
              </span>
            </div>
          )}

          {/* Large Touch Friendly Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {onOpenChat && (
              <button
                onClick={() => onOpenChat(store)}
                className="h-11 bg-[#FFC72C] hover:bg-[#f5bc20] text-[#0B4F8A] font-black text-xs rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat</span>
              </button>
            )}

            <a
              href={googleMapsRouteUrl}
              target="_blank"
              rel="noreferrer"
              className="h-11 bg-[#0B4F8A] hover:bg-[#083a66] text-white font-bold text-xs rounded-2xl transition-all border border-sky-400/30 flex items-center justify-center gap-1.5 shadow-md active:scale-95"
            >
              <Navigation className="w-4 h-4 text-[#FFC72C]" />
              <span>Rota</span>
            </a>

            {onSelectStore && (
              <button
                onClick={() => onSelectStore(store)}
                className="h-11 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl transition-all border border-white/20 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <StoreIcon className="w-4 h-4 text-[#FFC72C]" />
                <span>Loja</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
