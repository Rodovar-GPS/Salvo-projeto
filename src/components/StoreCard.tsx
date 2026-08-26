import React from 'react';
import { Store } from '../types';
import {
  Star,
  MapPin,
  Heart,
  Sparkles,
  MessageCircle,
  Clock,
  Eye,
  Navigation,
  Flame,
  Store as StoreIcon,
} from 'lucide-react';
import { STORE_CATEGORIES } from '../data/mockData';

interface StoreCardProps {
  store: Store;
  isFavorite: boolean;
  onToggleFavorite: (storeId: string) => void;
  onSelectStore: (store: Store) => void;
  onOpenChat: (store: Store) => void;
  onOpenStreetView?: (store: Store) => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({
  store,
  isFavorite,
  onToggleFavorite,
  onSelectStore,
  onOpenChat,
  onOpenStreetView,
}) => {
  const categoryInfo = STORE_CATEGORIES.find((c) => c.name === store.category);
  const hasActiveOffers = store.offers && store.offers.length > 0;
  const activeOffer = hasActiveOffers ? store.offers[0] : null;

  const googleMapsUrl =
    store.googleMapsUrl ||
    store.mapLink ||
    `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.lat},${store.coordinates.lng}`;

  return (
    <div
      onClick={() => onSelectStore(store)}
      className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1 relative"
    >
      {/* Cover Image + Badges Container */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <img
          src={store.coverImage || store.logo}
          alt={store.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(store.id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all shadow-md active:scale-90 z-10 ${
            isFavorite
              ? 'bg-rose-500 text-white'
              : 'bg-white/85 text-slate-700 hover:bg-white hover:text-rose-500'
          }`}
          title={isFavorite ? 'Remover dos favoritos' : 'Favoritar estabelecimento'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
        </button>

        {/* Top Left Badges: Open Status & Active Offer */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
          <span
            className={`px-2.5 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm ${
              store.isOpenNow
                ? 'bg-[#2E9E5B] text-white'
                : 'bg-slate-800/80 text-white/90'
            }`}
          >
            {store.isOpenNow ? '🟢 Aberto' : '🔴 Fechado'}
          </span>

          {hasActiveOffers && (
            <span className="px-2.5 py-1 rounded-xl bg-[#E8552B] text-white text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Flame className="w-3 h-3 fill-white" />
              <span>{activeOffer?.discountBadge || 'Oferta Ativa'}</span>
            </span>
          )}
        </div>

        {/* Bottom Neighborhood & Distance Over Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold z-10">
          <span className="flex items-center gap-1 drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 text-[#FFC72C]" />
            {store.neighborhood}
          </span>
          {store.distanceKm !== undefined && (
            <span className="bg-black/50 px-2 py-0.5 rounded-lg backdrop-blur-xs text-[11px]">
              a {store.distanceKm} km
            </span>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <span>{categoryInfo?.icon || '🏪'}</span>
              <span>{store.category}</span>
            </span>

            {/* Rating Stars */}
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg text-amber-700 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{store.rating > 0 ? store.rating.toFixed(1) : 'Novo'}</span>
              <span className="text-[10px] text-slate-400 font-normal">
                ({store.reviewCount})
              </span>
            </div>
          </div>

          {/* Store Name */}
          <h3 className="font-heading font-bold text-lg text-slate-900 leading-snug group-hover:text-[#0B4F8A] transition-colors mb-1">
            {store.name}
          </h3>

          {/* Short Bio */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {store.description}
          </p>
        </div>

        {/* Active Offer Strip if available */}
        {activeOffer && (
          <div className="mt-3 bg-gradient-to-r from-amber-50 to-orange-50/80 border border-dashed border-[#E8552B]/40 rounded-2xl p-2.5 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="font-black text-[#E8552B] shrink-0">🔥</span>
              <span className="font-bold text-slate-800 truncate text-[11px]">
                {activeOffer.title}
              </span>
            </div>
            <span className="text-[10px] font-black text-[#0B4F8A] bg-[#FFC72C] px-2 py-0.5 rounded-md shrink-0 border border-amber-300 shadow-2xs">
              {activeOffer.discountBadge}
            </span>
          </div>
        )}

        {/* Action Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
          {/* Left Buttons: Rota & Visão da Rua */}
          <div className="flex items-center gap-1">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="h-8.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1"
              title="Abrir rota no Google Maps GPS"
            >
              <Navigation className="w-3.5 h-3.5 text-[#0B4F8A]" />
              <span className="hidden sm:inline">Rota</span>
            </a>

            {onOpenStreetView && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenStreetView(store);
                }}
                className="h-8.5 px-2 bg-sky-50 hover:bg-sky-100 text-[#0B4F8A] rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 border border-sky-100"
                title="Abrir Visão da Rua 360°"
              >
                <Eye className="w-3.5 h-3.5 text-[#0B4F8A]" />
                <span className="hidden sm:inline">Visão da Rua</span>
              </button>
            )}
          </div>

          {/* Right Buttons: Chat & Ver Loja */}
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenChat(store);
              }}
              className="h-8.5 px-2.5 bg-[#FFC72C] hover:bg-[#f5bc20] text-[#0B4F8A] rounded-xl text-[11px] font-black transition-all flex items-center gap-1 active:scale-95 shadow-2xs"
              title="Abrir chat direto com a loja"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>

            <button
              onClick={() => onSelectStore(store)}
              className="h-8.5 px-2.5 bg-[#0B4F8A] hover:bg-[#083a66] text-white rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 active:scale-95 shadow-2xs"
            >
              <StoreIcon className="w-3.5 h-3.5 text-[#FFC72C]" />
              <span>Loja</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
