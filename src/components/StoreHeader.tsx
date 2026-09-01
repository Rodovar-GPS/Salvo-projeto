// ==============================================================================
// 🏪 STORE HEADER — CABEÇALHO DO PERFIL DA LOJA (COM SELO GOTA DE DENDÊ)
// ==============================================================================

import React from 'react';
import { Store } from '../types';
import { MapPin, Star, Phone, Globe, Instagram, Clock, Heart, Navigation, MessageCircle, Share2 } from 'lucide-react';
import { GotaDeDendeBadge, WavesPattern } from './MaresPattern';

interface StoreHeaderProps {
  store: Store;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onNavigateToViajar: () => void;
  onOpenChat: () => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
  store,
  isFavorite,
  onToggleFavorite,
  onNavigateToViajar,
  onOpenChat,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs relative">
      {/* Capa com Padrão de Ondas */}
      <div className="h-44 sm:h-56 relative bg-gradient-to-r from-[#0F4C81] via-[#2A9D8F] to-[#E89F3C] overflow-hidden">
        {store.coverImage ? (
          <img src={store.coverImage} alt={store.name} className="w-full h-full object-cover" />
        ) : (
          <WavesPattern intensity="soft" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={onToggleFavorite}
            className={`p-2.5 rounded-2xl backdrop-blur-md transition-transform active:scale-90 ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
            aria-label="Salvar favorito"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Status Aberto / Fechado */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider backdrop-blur-md text-white shadow-xs ${
              store.isOpenNow ? 'bg-emerald-600/90' : 'bg-rose-600/90'
            }`}
          >
            {store.isOpenNow ? '● Aberto Agora' : '○ Fechado'}
          </span>
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-black/60 backdrop-blur-md text-cyan-200 border border-white/20">
            {store.category}
          </span>
        </div>
      </div>

      {/* Detalhes da Loja */}
      <div className="p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-800 shadow-md shrink-0 -mt-10 relative z-10">
              <img src={store.logo || store.coverImage} alt={store.name} className="w-full h-full object-cover" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
                  {store.name}
                </h1>
                <GotaDeDendeBadge label="Comércio Verificado" />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                <div className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{store.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({store.reviewCount} avaliações)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0F4C81]" />
                  <span>{store.address}, {store.neighborhood}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Ação Imediata */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenChat}
              className="flex-1 sm:flex-none py-2.5 px-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-50 active:scale-95 transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-[#0F4C81]" />
              <span>Chat com Lojista</span>
            </button>

            <button
              onClick={onNavigateToViajar}
              className="flex-1 sm:flex-none py-2.5 px-5 rounded-2xl bg-[#0F4C81] hover:bg-[#0c3e69] text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/20 active:scale-95 transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Como Chegar</span>
            </button>
          </div>
        </div>

        {/* Bio / Descrição */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {store.description}
        </p>

        {/* Contatos Rápidos */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
          {store.phone && (
            <a
              href={`tel:${store.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>{store.phone}</span>
            </a>
          )}

          {store.instagram && (
            <a
              href={`https://instagram.com/${store.instagram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300 hover:opacity-80 transition-opacity font-bold"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>{store.instagram}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
