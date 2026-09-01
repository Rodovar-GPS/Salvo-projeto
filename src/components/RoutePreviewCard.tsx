// ==============================================================================
// 🧭 ROUTE PREVIEW CARD — CARD FLUTUANTE COM ETA E DISTÂNCIA AO SELECIONAR LOJA
// ==============================================================================

import React from 'react';
import { Store } from '../types';
import { Navigation, Clock, MapPin, X, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { GotaDeDendeBadge } from './MaresPattern';

interface RoutePreviewCardProps {
  store: Store;
  userDistanceKm?: number;
  onNavigateToViajar: (store: Store) => void;
  onOpenChat: (store: Store) => void;
  onClose: () => void;
}

export const RoutePreviewCard: React.FC<RoutePreviewCardProps> = ({
  store,
  userDistanceKm = 1.8,
  onNavigateToViajar,
  onOpenChat,
  onClose,
}) => {
  // Estimativa baseada em tráfego típico de Salvador
  const walkingEtaMin = Math.round(userDistanceKm * 12);
  const drivingEtaMin = Math.max(4, Math.round(userDistanceKm * 3.5));

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-96 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
            <img src={store.logo || store.coverImage} alt={store.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-sm font-black text-slate-900 dark:text-white font-display">
                {store.name}
              </h3>
              <GotaDeDendeBadge />
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
              <MapPin className="w-3 h-3 text-[#0F4C81]" />
              <span>{store.neighborhood}</span>
              <span>•</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {store.isOpenNow ? 'Aberto Agora' : 'Fechado'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Telemetria de Rota Rápida */}
      <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-[#0F4C81] dark:text-cyan-400 flex items-center justify-center font-black">
            🚗
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Carro/Uber</div>
            <div className="font-black text-slate-800 dark:text-slate-200">
              ~{drivingEtaMin} min ({userDistanceKm.toFixed(1)} km)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-black">
            🚶
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">A Pé</div>
            <div className="font-black text-slate-800 dark:text-slate-200">
              ~{walkingEtaMin} min
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onOpenChat(store)}
          className="flex-1 py-2.5 px-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-50 active:scale-95 transition-all"
        >
          <MessageCircle className="w-4 h-4 text-[#0F4C81]" />
          <span>Falar no Chat</span>
        </button>

        <button
          onClick={() => onNavigateToViajar(store)}
          className="flex-1 py-2.5 px-3 rounded-2xl bg-[#0F4C81] hover:bg-[#0c3e69] text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/20 active:scale-95 transition-all"
        >
          <Navigation className="w-4 h-4" />
          <span>Navegar até Aqui</span>
        </button>
      </div>
    </div>
  );
};
