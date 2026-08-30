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
  Footprints,
} from 'lucide-react';
import { STORE_CATEGORIES } from '../data/mockData';
import { getCategoryIcon } from '../utils/categoryIcons';
import { getDistanceInMeters, formatDistance, formatTravelTime } from '../utils/geolocation';

interface StoreCardProps {
  store: Store;
  isFavorite: boolean;
  onToggleFavorite: (storeId: string) => void;
  onSelectStore: (store: Store) => void;
  onOpenChat: (store: Store) => void;
  onOpenStreetView?: (store: Store) => void;
  userLocation?: { lat: number; lng: number } | null;
}

export const StoreCard: React.FC<StoreCardProps> = ({
  store,
  isFavorite,
  onToggleFavorite,
  onSelectStore,
  onOpenChat,
  onOpenStreetView,
  userLocation,
}) => {
  const categoryInfo = STORE_CATEGORIES.find((c) => c.name === store.category);
  const hasActiveOffers = store.offers && store.offers.length > 0;
  const activeOffer = hasActiveOffers ? store.offers[0] : null;

  // Real-time GPS distance calculation
  const distanceInMeters = userLocation
    ? getDistanceInMeters(
        userLocation.lat,
        userLocation.lng,
        store.coordinates.lat,
        store.coordinates.lng
      )
    : store.distanceKm !== undefined
    ? store.distanceKm * 1000
    : null;

  const formattedDistance = distanceInMeters !== null ? formatDistance(distanceInMeters) : null;
  const travelTimeWalk = distanceInMeters !== null && distanceInMeters < 3000 ? formatTravelTime(distanceInMeters, 'walking') : null;
  const travelTimeDrive = distanceInMeters !== null && distanceInMeters >= 3000 ? formatTravelTime(distanceInMeters, 'driving') : null;

  const googleMapsUrl = userLocation
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${store.coordinates.lat},${store.coordinates.lng}&travelmode=driving`
    : store.googleMapsUrl ||
      store.mapLink ||
      `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.lat},${store.coordinates.lng}`;

  return (
    <div
      onClick={() => onSelectStore(store)}
      className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1 relative"
    >
      {/* Cover Image + Badges Container (Standardized 4:3 Aspect Ratio) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
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
          className={`absolute top-3 right-3 w-9 h-9 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all shadow-md active:scale-90 z-10 cursor-pointer ${
            isFavorite
              ? 'bg-rose-500 text-white'
              : 'bg-white/85 text-slate-700 hover:bg-white hover:text-rose-500'
          }`}
          title={isFavorite ? 'Remover dos favoritos' : 'Favoritar estabelecimento'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
        </button>

        {/* Top Left Badges: Open Status (Accent Green) & Active Offer (Accent Warm Terracotta) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
          <span
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs flex items-center gap-1.5 ${
              store.isOpenNow
                ? 'bg-[#1F6E43] text-white'
                : 'bg-slate-800/80 text-white/90'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                store.isOpenNow ? 'bg-emerald-300' : 'bg-rose-400'
              }`}
            />
            <span>{store.isOpenNow ? 'Aberto' : 'Fechado'}</span>
          </span>

          {hasActiveOffers && (
            <span className="px-2.5 py-1 rounded-xl bg-[#C1502E] text-white text-[11px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
              <Flame className="w-3 h-3 fill-white text-white" />
              <span>{activeOffer?.discountBadge || 'Oferta Ativa'}</span>
            </span>
          )}
        </div>

        {/* Bottom Neighborhood & Distance Over Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold z-10 gap-2">
          <span className="flex items-center gap-1 drop-shadow-md truncate">
            <MapPin className="w-3.5 h-3.5 text-[#FFC72C] shrink-0" />
            <span className="truncate">{store.neighborhood}</span>
          </span>
          {formattedDistance && (
            <span className="bg-black/60 px-2 py-0.5 rounded-lg backdrop-blur-xs text-[11px] whitespace-nowrap shrink-0 flex items-center gap-1 border border-white/10">
              <Navigation className="w-2.5 h-2.5 text-[#FFC72C]" />
              <span>a {formattedDistance}</span>
              {travelTimeWalk && <span className="text-amber-200 text-[10px]">({travelTimeWalk})</span>}
              {travelTimeDrive && <span className="text-sky-200 text-[10px]">({travelTimeDrive})</span>}
            </span>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              {getCategoryIcon(store.category, {
                size: 16,
                strokeWidth: 1.5,
                color: categoryInfo?.color || '#0B3D91',
              })}
              <span>{store.category}</span>
            </span>

            {/* Rating: Star icon colored if at least 5 reviews, otherwise clean 'Novo' tag */}
            {store.reviewCount >= 5 && store.rating > 0 ? (
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-lg text-slate-700 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-[#FFC72C] text-[#FFC72C]" />
                <span>{store.rating.toFixed(1)}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  ({store.reviewCount})
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-lg text-slate-600 font-bold text-[11px]">
                <span className="text-slate-600">Novo</span>
              </div>
            )}
          </div>

          {/* Store Name */}
          <h3 className="font-heading font-bold text-lg text-slate-900 leading-snug group-hover:text-[#0B3D91] transition-colors mb-1">
            {store.name}
          </h3>

          {/* Short Bio */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {store.description}
          </p>
        </div>

        {/* Active Offer Strip with Terracotta Accent */}
        {activeOffer && (
          <div className="mt-3 bg-[#C1502E]/5 border border-dashed border-[#C1502E]/30 rounded-2xl p-2.5 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <Flame className="w-3.5 h-3.5 text-[#C1502E] shrink-0" />
              <span className="font-bold text-slate-800 truncate text-[11px]">
                {activeOffer.title}
              </span>
            </div>
            <span className="text-[10px] font-bold text-white bg-[#C1502E] px-2 py-0.5 rounded-md shrink-0 shadow-2xs">
              {activeOffer.discountBadge}
            </span>
          </div>
        )}

        {/* Action Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
          {/* Left Buttons: Rota & Visão da Rua (Subordinate Outline Weight) */}
          <div className="flex items-center gap-1">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="h-8.5 px-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 shadow-2xs"
              title="Abrir rota no Google Maps GPS"
            >
              <Navigation className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Rota</span>
            </a>

            {onOpenStreetView && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenStreetView(store);
                }}
                className="h-8.5 px-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                title="Abrir Visão da Rua 360°"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Visão da Rua</span>
              </button>
            )}
          </div>

          {/* Right Buttons: Chat & Ver Loja (Primary / Action Weight) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenChat(store);
              }}
              className="h-8.5 px-3 bg-sky-50 hover:bg-sky-100 text-[#0B3D91] rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 active:scale-95 border border-sky-200 cursor-pointer shadow-2xs"
              title="Abrir chat direto com a loja"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#0B3D91]" />
              <span>Chat</span>
            </button>

            <button
              onClick={() => onSelectStore(store)}
              className="h-8.5 px-3 bg-[#0B3D91] hover:bg-[#082C69] text-white rounded-xl text-[11px] font-heading font-bold transition-all flex items-center gap-1 active:scale-95 shadow-xs cursor-pointer"
            >
              <StoreIcon className="w-3.5 h-3.5 text-white" />
              <span>Loja</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
