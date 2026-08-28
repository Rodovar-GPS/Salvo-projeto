import React, { useState, useMemo } from 'react';
import { Store, StoreCategory, SalvadorNeighborhood, Offer } from '../types';
import { SALVADOR_NEIGHBORHOODS, STORE_CATEGORIES } from '../data/mockData';
import { isValidPublicStore } from '../utils/storeValidation';
import { OfferCard } from '../components/OfferCard';
import { ClearableInput } from '../components/ClearableInput';
import {
  Flame,
  Search,
  MapPin,
  Tag,
  ArrowUpDown,
  SlidersHorizontal,
  Navigation,
  Sparkles,
} from 'lucide-react';

interface OffersViewProps {
  stores: Store[];
  onSelectStore: (store: Store) => void;
  onOpenChat: (store: Store, offerContext?: Offer) => void;
  onOpenStreetView?: (store: Store) => void;
  userLocation?: { lat: number; lng: number } | null;
}

type SortOption = 'recent' | 'discount_desc' | 'price_asc' | 'popular' | 'distance';

export const OffersView: React.FC<OffersViewProps> = ({
  stores,
  onSelectStore,
  onOpenChat,
  onOpenStreetView,
  userLocation,
}) => {
  const [search, setSearch] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<SalvadorNeighborhood | 'Todos'>('Todos');
  const [selectedCategory, setSelectedCategory] = useState<StoreCategory | 'Todas'>('Todas');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  // Flatten all active offers with their parent store (from valid public stores only)
  const allOffersWithStores = useMemo(() => {
    const list: { offer: Offer; store: Store }[] = [];
    stores.forEach((store) => {
      if (!isValidPublicStore(store)) return;
      if (store.offers && store.offers.length > 0) {
        store.offers.forEach((offer) => {
          // Only show active offers (status !== 'EXPIRED' && status !== 'PAUSED' && status !== 'DRAFT')
          if (!offer.status || offer.status === 'ACTIVE') {
            list.push({ offer, store });
          }
        });
      }
    });
    return list;
  }, [stores]);

  const filteredAndSorted = useMemo(() => {
    let result = allOffersWithStores.filter(({ offer, store }) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = offer.title.toLowerCase().includes(q);
        const matchDesc = offer.description.toLowerCase().includes(q);
        const matchStore = store.name.toLowerCase().includes(q);
        const matchBadge = offer.discountBadge.toLowerCase().includes(q);
        const matchCategory = offer.category?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchStore && !matchBadge && !matchCategory) {
          return false;
        }
      }
      if (selectedNeighborhood !== 'Todos' && store.neighborhood !== selectedNeighborhood) {
        return false;
      }
      if (selectedCategory !== 'Todas' && offer.category !== selectedCategory) {
        return false;
      }
      return true;
    });

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'discount_desc') {
        const savingsA = (a.offer.originalPrice || 0) - (a.offer.discountPrice || 0);
        const savingsB = (b.offer.originalPrice || 0) - (b.offer.discountPrice || 0);
        return savingsB - savingsA;
      }
      if (sortBy === 'price_asc') {
        const priceA = a.offer.discountPrice || a.offer.originalPrice || 999999;
        const priceB = b.offer.discountPrice || b.offer.originalPrice || 999999;
        return priceA - priceB;
      }
      if (sortBy === 'popular') {
        return (b.store.rating || 0) - (a.store.rating || 0);
      }
      if (sortBy === 'distance' && userLocation) {
        const distA = Math.hypot(
          a.store.coordinates.lat - userLocation.lat,
          a.store.coordinates.lng - userLocation.lng
        );
        const distB = Math.hypot(
          b.store.coordinates.lat - userLocation.lat,
          b.store.coordinates.lng - userLocation.lng
        );
        return distA - distB;
      }
      // default: recent / featured
      return (b.offer.isFeatured ? 1 : 0) - (a.offer.isFeatured ? 1 : 0);
    });

    return result;
  }, [allOffersWithStores, search, selectedNeighborhood, selectedCategory, sortBy, userLocation]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Header Banner - Salvador Warm Identity */}
      <div className="bg-gradient-to-r from-[#0B4F8A] via-[#136ac2] to-[#E8552B] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#FFC72C] text-[#0B4F8A] rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-[#0B4F8A]" />
                Ofertas Comerciais de Salvador
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-heading font-black tracking-tight leading-tight">
              Ofertas Especiais da Cidade
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-xl leading-relaxed">
              Descubra preços imperdíveis nos comércios e serviços de Salvador. Conecte-se diretamente com as lojas no chat ou explore a rua em 360°.
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20 text-center shrink-0 shadow-lg">
            <span className="text-[11px] text-sky-200 font-black uppercase tracking-wider block">
              Ofertas Ativas
            </span>
            <span className="text-3xl sm:text-4xl font-heading font-black text-[#FFC72C]">
              {allOffersWithStores.length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/90 flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="flex-1 w-full">
          <ClearableInput
            placeholder="Buscar por oferta, promoção, 20% OFF, nome da loja..."
            value={search}
            onValueChange={setSearch}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            className="h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A]"
          />
        </div>

        {/* Neighborhood Filter */}
        <div className="w-full md:w-52 relative">
          <MapPin className="w-4 h-4 text-[#0B4F8A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedNeighborhood}
            onChange={(e) => setSelectedNeighborhood(e.target.value as any)}
            className="w-full h-11 pl-10 pr-8 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:bg-white focus:border-[#0B4F8A] outline-none appearance-none cursor-pointer"
          >
            <option value="Todos">📍 Todos os Bairros</option>
            {SALVADOR_NEIGHBORHOODS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-52 relative">
          <Tag className="w-4 h-4 text-[#0B4F8A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="w-full h-11 pl-10 pr-8 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:bg-white focus:border-[#0B4F8A] outline-none appearance-none cursor-pointer"
          >
            <option value="Todas">🏷️ Todas Categorias</option>
            {STORE_CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="w-full md:w-52 relative">
          <ArrowUpDown className="w-4 h-4 text-[#0B4F8A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full h-11 pl-10 pr-8 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:bg-white focus:border-[#0B4F8A] outline-none appearance-none cursor-pointer"
          >
            <option value="recent">✨ Destaques / Recentes</option>
            <option value="discount_desc">💰 Maior Desconto</option>
            <option value="price_asc">🏷️ Menor Preço</option>
            <option value="popular">⭐ Mais Populares</option>
            {userLocation && <option value="distance">📍 Mais Próximos</option>}
          </select>
        </div>
      </div>

      {/* Categories Quick Horizontal Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('Todas')}
          className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 shadow-2xs ${
            selectedCategory === 'Todas'
              ? 'bg-[#0B4F8A] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Todas as Ofertas
        </button>
        {STORE_CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 active:scale-95 shadow-2xs ${
              selectedCategory === cat.name
                ? 'bg-[#0B4F8A] text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Grid of Active Offers */}
      {filteredAndSorted.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-[#0B4F8A] mx-auto flex items-center justify-center text-2xl mb-3 shadow-inner">
            🔥
          </div>
          <h4 className="font-heading font-bold text-slate-900 text-lg mb-1">
            Nenhuma oferta encontrada
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
            Não encontramos ofertas ativas com os filtros selecionados. Tente limpar a busca para ver todas as opções de Salvador.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedNeighborhood('Todos');
              setSelectedCategory('Todas');
              setSortBy('recent');
            }}
            className="px-5 py-2.5 bg-[#0B4F8A] hover:bg-[#083a66] text-white rounded-2xl text-xs font-bold shadow-md active:scale-95 transition-all"
          >
            Ver Todas as Ofertas
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSorted.map(({ offer, store }) => (
            <OfferCard
              key={`${store.id}-${offer.id}`}
              offer={offer}
              store={store}
              onSelectStore={onSelectStore}
              onOpenChat={(st) => onOpenChat(st, offer)}
              onOpenStreetView={onOpenStreetView}
            />
          ))}
        </div>
      )}
    </div>
  );
};
