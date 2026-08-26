import React, { useState } from 'react';
import { SalvadorNeighborhood, Store } from '../types';
import { SALVADOR_NEIGHBORHOOD_GUIDE, SALVADOR_NEIGHBORHOODS } from '../data/mockData';
import { X, MapPin, Sparkles, Navigation, ArrowRight, Compass, Heart, Store as StoreIcon } from 'lucide-react';

interface NeighborhoodGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNeighborhood: (neighborhood: SalvadorNeighborhood) => void;
  stores: Store[];
}

export const NeighborhoodGuideModal: React.FC<NeighborhoodGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectNeighborhood,
  stores,
}) => {
  const [activeNeighborhoodKey, setActiveNeighborhoodKey] = useState<string>('Barra');

  if (!isOpen) return null;

  const currentGuide = SALVADOR_NEIGHBORHOOD_GUIDE[activeNeighborhoodKey] || {
    tagline: 'Conheça o comércio local deste tradicional bairro soteropolitano',
    description: 'Explore lojas, serviços, gastronomia típica e viva a experiência única de Salvador.',
    vibe: 'Comercial & Acolhedor',
    bestSpots: ['Comércio local', 'Pontos turísticos', 'Praças centrais'],
    icon: '📍',
    color: '#0B4F8A',
  };

  const neighborhoodStores = stores.filter(
    (s) => s.neighborhood === (activeNeighborhoodKey as SalvadorNeighborhood) && s.approvalStatus !== 'rejected'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#0B4F8A] to-[#083b66] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFC72C] text-[#0B4F8A] flex items-center justify-center text-xl font-black shadow-md">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-wider">
                  Guia Cultural de Salvador
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-black">
                Bairros & Polos Comerciais
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Neighborhood Selector Sidebar */}
          <div className="md:col-span-4 p-4 space-y-1.5 bg-slate-50/70 overflow-y-auto max-h-64 md:max-h-none">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-3 mb-2 block">
              Selecione o Bairro
            </span>
            {SALVADOR_NEIGHBORHOODS.map((neighborhood) => {
              const guide = SALVADOR_NEIGHBORHOOD_GUIDE[neighborhood];
              const isSelected = activeNeighborhoodKey === neighborhood;
              const storeCount = stores.filter((s) => s.neighborhood === neighborhood).length;

              return (
                <button
                  key={neighborhood}
                  onClick={() => setActiveNeighborhoodKey(neighborhood)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all ${
                    isSelected
                      ? 'bg-white shadow-sm text-[#0B4F8A] font-bold border border-slate-200 scale-[1.02]'
                      : 'hover:bg-white/60 text-slate-600 text-sm'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{guide?.icon || '📍'}</span>
                    <div>
                      <p className="font-heading font-bold text-xs leading-tight">{neighborhood}</p>
                      <p className="text-[10px] text-slate-400">{guide?.vibe || 'Bairro Salvador'}</p>
                    </div>
                  </div>
                  {storeCount > 0 && (
                    <span className="px-2 py-0.5 bg-[#0B4F8A]/10 text-[#0B4F8A] rounded-full text-[10px] font-black">
                      {storeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Neighborhood Detail & Highlights Panel */}
          <div className="md:col-span-8 p-6 space-y-6 overflow-y-auto">
            {/* Top Neighborhood Banner */}
            <div
              className="p-6 rounded-3xl text-white relative overflow-hidden shadow-md"
              style={{ backgroundColor: currentGuide.color || '#0B4F8A' }}
            >
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentGuide.icon}</span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider">
                    {currentGuide.vibe}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-heading font-black">
                  {activeNeighborhoodKey}
                </h3>
                <p className="text-white/90 text-sm font-semibold italic">
                  "{currentGuide.tagline}"
                </p>
              </div>
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
            </div>

            {/* Description */}
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Sobre a Região
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                {currentGuide.description}
              </p>
            </div>

            {/* Famous Spots */}
            {currentGuide.bestSpots && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Pontos Emblemáticos & Roteiros
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {currentGuide.bestSpots.map((spot, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 text-xs font-bold text-slate-800"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#E8552B] shrink-0" />
                      <span className="truncate">{spot}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stores in this Neighborhood */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Comércios Cadastrados ({neighborhoodStores.length})
                  </h4>
                  <p className="text-xs text-slate-500 font-semibold">
                    Lojas, restaurantes e serviços em {activeNeighborhoodKey}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onSelectNeighborhood(activeNeighborhoodKey as SalvadorNeighborhood);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0B4F8A] hover:bg-[#083b66] text-white rounded-2xl text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  <span>Explorar no Mapa</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {neighborhoodStores.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {neighborhoodStores.map((store) => (
                    <div
                      key={store.id}
                      className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center gap-3 hover:border-[#0B4F8A] transition-all"
                    >
                      <img
                        src={store.logo}
                        alt={store.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-2xs shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h5 className="font-heading font-bold text-xs text-slate-900 truncate">
                          {store.name}
                        </h5>
                        <p className="text-[10px] text-slate-500 font-semibold truncate">
                          {store.category}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-[#FFC72C]">★ {store.rating}</span>
                          {store.offers.length > 0 && (
                            <span className="text-[9px] bg-red-100 text-[#E8552B] font-extrabold px-1.5 py-0.2 rounded-md">
                              {store.offers[0].discountBadge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-2xl text-center border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold mb-2">
                    Ainda não há comércios cadastrados em {activeNeighborhoodKey}.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Se você possui uma loja neste bairro, cadastre-se por apenas R$ 12,00/mês!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-semibold">
            SALVÔ • Guia Oficial do Comércio Local de Salvador.
          </span>
          <button
            onClick={() => {
              onSelectNeighborhood(activeNeighborhoodKey as SalvadorNeighborhood);
              onClose();
            }}
            className="px-6 py-2.5 bg-[#FFC72C] text-[#0B4F8A] font-heading font-black rounded-2xl text-xs hover:bg-[#f5bc20] transition-all shadow-md active:scale-95"
          >
            Ver Todas as Lojas de {activeNeighborhoodKey}
          </button>
        </div>
      </div>
    </div>
  );
};
