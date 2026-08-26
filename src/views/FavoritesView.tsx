import React from 'react';
import { Store } from '../types';
import { StoreCard } from '../components/StoreCard';
import { Heart, Compass, Sparkles } from 'lucide-react';

interface FavoritesViewProps {
  favoriteStores: Store[];
  onToggleFavorite: (storeId: string) => void;
  onSelectStore: (store: Store) => void;
  onOpenChat: (store: Store) => void;
  onOpenStreetView?: (store: Store) => void;
  onExploreClick: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteStores,
  onToggleFavorite,
  onSelectStore,
  onOpenChat,
  onOpenStreetView,
  onExploreClick,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-rose-100 text-rose-600 rounded-xl">
              <Heart className="w-5 h-5 fill-rose-500" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
              Minhas Lojas Salvas
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Acompanhe atualizações de ofertas e novidades dos seus locais prediletos em Salvador.
          </p>
        </div>

        {favoriteStores.length > 0 && (
          <span className="px-3.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs rounded-2xl self-start sm:self-auto">
            {favoriteStores.length} {favoriteStores.length === 1 ? 'loja favorita' : 'lojas favoritas'}
          </span>
        )}
      </div>

      {/* Grid or Friendly Empty State */}
      {favoriteStores.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-slate-200 shadow-sm max-w-lg mx-auto">
          <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-rose-400">
            <Heart className="w-10 h-10 stroke-1" />
          </div>

          <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">
            Nenhuma loja favoritada ainda
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
            Você ainda não favoritou nenhuma loja por aqui — que tal explorar o mapa e salvar seus estabelecimentos preferidos de Salvador?
          </p>

          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 h-12 bg-[#0B4F8A] hover:bg-[#083a66] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md inline-flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Compass className="w-4 h-4" />
            <span>Explorar o Mapa de Salvador</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteStores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              onSelectStore={onSelectStore}
              onOpenChat={onOpenChat}
              onOpenStreetView={onOpenStreetView}
            />
          ))}
        </div>
      )}
    </div>
  );
};
