import React from 'react';
import { Offer, Store } from '../types';
import {
  Sparkles,
  Clock,
  ChevronRight,
  MessageCircle,
  Eye,
  Store as StoreIcon,
  Tag,
  MapPin,
  Flame,
} from 'lucide-react';

interface OfferCardProps {
  offer: Offer;
  store?: Store;
  onSelectStore?: (store: Store) => void;
  onOpenChat?: (store: Store, offerContext?: Offer) => void;
  onOpenStreetView?: (store: Store) => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  store,
  onSelectStore,
  onOpenChat,
  onOpenStreetView,
}) => {
  const formattedOriginalPrice = offer.originalPrice
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
        offer.originalPrice
      )
    : null;

  const formattedDiscountPrice = offer.discountPrice
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
        offer.discountPrice
      )
    : null;

  const savingsAmount =
    offer.originalPrice && offer.discountPrice && offer.originalPrice > offer.discountPrice
      ? offer.originalPrice - offer.discountPrice
      : null;

  const formattedExpiry = offer.expiresAt
    ? offer.expiresAt.includes('-')
      ? `${offer.expiresAt.split('-')[2]}/${offer.expiresAt.split('-')[1]}/${offer.expiresAt.split('-')[0]}`
      : offer.expiresAt
    : 'Em breve';

  const formattedSavings = savingsAmount
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(savingsAmount)
    : null;

  return (
    <div
      id={`offer-card-${offer.id}`}
      className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative"
    >
      {/* Top Banner: Salvador Identity + Store Info */}
      <div className="bg-[#0B3D91] p-4 text-white relative">
        <div className="flex items-center justify-between gap-3">
          {store ? (
            <button
              onClick={() => onSelectStore && onSelectStore(store)}
              className="flex items-center gap-2.5 text-left group/store hover:opacity-95 transition-opacity overflow-hidden min-w-0"
              title={`Ver loja ${store.name}`}
            >
              <img
                src={store.logo || store.coverImage}
                alt={store.name}
                className="w-9 h-9 rounded-xl object-cover border border-white/30 bg-white shrink-0 shadow-xs"
              />
              <div className="overflow-hidden min-w-0">
                <h4 className="text-xs font-heading font-bold text-white truncate group-hover/store:text-sky-200 transition-colors">
                  {store.name}
                </h4>
                <p className="text-[11px] text-sky-200 truncate font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#FFC72C] shrink-0" />
                  <span>{store.neighborhood}</span>
                </p>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-white/90 text-xs font-bold">
              <StoreIcon className="w-4 h-4 text-white" />
              <span>{offer.category || 'Oferta Salvador'}</span>
            </div>
          )}

          {/* Flame Offer Tag with Accent Warm (Terracotta) */}
          <span className="px-3 py-1 bg-[#C1502E] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs shrink-0 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-white text-white" />
            <span>{offer.discountBadge || 'OFERTA'}</span>
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Title & Description */}
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#C1502E] uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C1502E]" />
            <span>OFERTA SALVADOR</span>
          </div>

          <h3 className="font-heading font-bold text-base text-slate-900 leading-snug group-hover:text-[#0B3D91] transition-colors line-clamp-2 min-h-[2.5rem]">
            {offer.title}
          </h3>

          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 min-h-[2rem] mt-1">
            {offer.description}
          </p>
        </div>

        {/* Pricing Block - Clear, Strikethrough & Prominent */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1">
              <Tag className="w-3 h-3 text-[#C1502E]" />
              Preço Promocional
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              {formattedDiscountPrice ? (
                <>
                  <span className="text-xl sm:text-2xl font-heading font-bold text-[#1F6E43]">
                    {formattedDiscountPrice}
                  </span>
                  {formattedOriginalPrice && (
                    <span className="text-xs sm:text-sm text-slate-400 line-through font-semibold">
                      {formattedOriginalPrice}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-sm sm:text-base font-heading font-bold text-[#1F6E43]">
                  {offer.priceText || offer.discountBadge}
                </span>
              )}
            </div>
          </div>

          {formattedSavings ? (
            <div className="px-2.5 py-1 bg-[#1F6E43] text-white rounded-xl text-right shadow-2xs shrink-0">
              <span className="text-[9px] uppercase font-bold block opacity-90">Economize</span>
              <span className="text-xs font-bold">{formattedSavings}</span>
            </div>
          ) : (
            <span className="px-2.5 py-1 bg-[#C1502E] text-white text-[10px] font-bold uppercase rounded-lg shadow-2xs shrink-0">
              Imperdível
            </span>
          )}
        </div>

        {/* Card Footer: Expiration Date & Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 mt-auto">
          {/* Expiration Date */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-bold">
            <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Válida até {formattedExpiry}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
            {store && onOpenStreetView && (
              <button
                id={`streetview-offer-${offer.id}`}
                onClick={() => onOpenStreetView(store)}
                className="h-8.5 px-2.5 bg-sky-50 hover:bg-sky-100 text-[#0B3D91] border border-sky-200/80 rounded-xl font-bold transition-all shadow-2xs active:scale-95 flex items-center gap-1 text-[11px]"
                title="Ver fachada e arredores na Visão da Rua"
              >
                <Eye className="w-3.5 h-3.5 text-[#0B3D91]" />
                <span className="hidden sm:inline">Na Rua</span>
              </button>
            )}

            {store && onOpenChat && (
              <button
                id={`chat-store-${offer.id}`}
                onClick={() => onOpenChat(store, offer)}
                className="h-8.5 px-2.5 bg-blue-50 hover:bg-blue-100 text-[#0B3D91] border border-blue-200/80 rounded-xl font-bold transition-all shadow-2xs active:scale-95 flex items-center gap-1 text-[11px]"
                title="Conversar sobre esta oferta"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Chat</span>
              </button>
            )}

            {store && onSelectStore && (
              <button
                id={`view-store-${offer.id}`}
                onClick={() => onSelectStore(store)}
                className="h-8.5 px-3 bg-[#0B3D91] hover:bg-[#082f70] text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs active:scale-95 transition-all"
              >
                <span>Ver Loja</span>
                <ChevronRight className="w-3.5 h-3.5 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
