import React, { useRef, useState, useEffect } from 'react';
import { StoreCategory, SalvadorNeighborhood, Store } from '../types';
import { STORE_CATEGORIES, SALVADOR_NEIGHBORHOODS } from '../data/mockData';
import { ClearableInput } from './ClearableInput';
import {
  Search,
  MapPin,
  Map as MapIcon,
  List,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Clock,
  SlidersHorizontal,
  Compass,
  Check,
} from 'lucide-react';

interface CategoryFilterBarProps {
  selectedCategory: StoreCategory | 'Todas';
  setSelectedCategory: (cat: StoreCategory | 'Todas') => void;
  selectedNeighborhood: SalvadorNeighborhood | 'Todos os Bairros';
  setSelectedNeighborhood: (n: SalvadorNeighborhood | 'Todos os Bairros') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  viewMode: 'map' | 'list';
  setViewMode: (mode: 'map' | 'list') => void;
  onlyOffers: boolean;
  setOnlyOffers: (val: boolean) => void;
  onlyOpen: boolean;
  setOnlyOpen: (val: boolean) => void;
  stores: Store[];
  filteredCount: number;
  onOpenNeighborhoodGuide?: () => void;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedNeighborhood,
  setSelectedNeighborhood,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  onlyOffers,
  setOnlyOffers,
  onlyOpen,
  setOnlyOpen,
  stores,
  filteredCount,
  onOpenNeighborhoodGuide,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll bounds
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const amount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/90 space-y-4">
      {/* ROW 1: Search Bar + Salvador Neighborhood Selector + View Switcher */}
      <div className="flex flex-col lg:flex-row items-center gap-3">
        {/* Search Input Box */}
        <div className="flex-1 w-full relative">
          <ClearableInput
            placeholder="Buscar lojas, ofertas e serviços..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            className="h-12 bg-slate-50/80 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-[#0B4F8A] text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 shadow-2xs rounded-2xl"
          />
        </div>

        {/* Neighborhood Selector with Cultural Shortcut */}
        <div className="w-full lg:w-72 relative flex items-center gap-2">
          <div className="relative flex-1">
            <MapPin className="w-4 h-4 text-[#0B4F8A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value as any)}
              className="w-full h-12 pl-10 pr-8 bg-slate-50/80 border border-slate-200 hover:border-slate-300 rounded-2xl text-xs font-bold text-slate-700 focus:bg-white focus:border-[#0B4F8A] outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="Todos os Bairros">📍 Todos os Bairros ({stores.length})</option>
              {SALVADOR_NEIGHBORHOODS.map((b) => {
                const count = stores.filter((s) => s.neighborhood === b).length;
                return (
                  <option key={b} value={b}>
                    {b} {count > 0 ? `(${count})` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {onOpenNeighborhoodGuide && (
            <button
              onClick={onOpenNeighborhoodGuide}
              className="h-12 px-3 bg-blue-50 hover:bg-blue-100 text-[#0B4F8A] border border-blue-200/80 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
              title="Ver Guia Cultural de Bairros"
            >
              <Compass className="w-4 h-4" />
              <span className="hidden xl:inline">Guia</span>
            </button>
          )}
        </div>

        {/* View Mode Toggle: Mapa / Lista */}
        <div className="flex bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 shrink-0 w-full lg:w-auto justify-center">
          <button
            onClick={() => setViewMode('map')}
            className={`flex-1 lg:flex-initial px-4 py-2.5 rounded-xl text-xs font-heading font-black flex items-center justify-center gap-2 transition-all ${
              viewMode === 'map'
                ? 'bg-[#0B4F8A] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0B4F8A]'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>Mapa</span>
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 lg:flex-initial px-4 py-2.5 rounded-xl text-xs font-heading font-black flex items-center justify-center gap-2 transition-all ${
              viewMode === 'list'
                ? 'bg-[#0B4F8A] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0B4F8A]'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Lista ({filteredCount})</span>
          </button>
        </div>
      </div>

      {/* ROW 2: Modernized Horizontal Category Rail with Scroll Navigation */}
      <div className="relative group/rail pt-1">
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-slate-200 text-slate-700 hover:text-[#0B4F8A] flex items-center justify-center transition-all -ml-2 hover:scale-110 active:scale-95"
            aria-label="Rolar para a esquerda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth"
        >
          {/* "TODOS" Pill */}
          <button
            onClick={() => setSelectedCategory('Todas')}
            className={`h-10 px-4 rounded-2xl text-xs font-heading font-black uppercase tracking-wider shrink-0 transition-all flex items-center gap-2 border select-none ${
              selectedCategory === 'Todas'
                ? 'bg-[#0B4F8A] text-white border-[#0B4F8A] shadow-sm ring-2 ring-blue-200/50'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#FFC72C]" />
            <span>TODOS</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                selectedCategory === 'Todas' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {stores.length}
            </span>
          </button>

          {/* Individual Category Pills */}
          {STORE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            const count = stores.filter((s) => s.category === cat.name).length;

            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`h-10 px-3.5 rounded-2xl text-xs font-heading font-bold shrink-0 transition-all flex items-center gap-2 border select-none ${
                  isSelected
                    ? 'bg-[#0B4F8A] text-white border-[#0B4F8A] shadow-sm ring-2 ring-blue-200/50'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <span className="text-base leading-none">{cat.icon}</span>
                <span className="whitespace-nowrap">{cat.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-slate-200 text-slate-700 hover:text-[#0B4F8A] flex items-center justify-center transition-all -mr-2 hover:scale-110 active:scale-95"
            aria-label="Rolar para a direita"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ROW 3: Secondary Quick Toggles & Active Filter Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer select-none bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors">
            <input
              type="checkbox"
              checked={onlyOffers}
              onChange={(e) => setOnlyOffers(e.target.checked)}
              className="w-4 h-4 rounded text-[#E8552B] focus:ring-[#E8552B] accent-[#E8552B] cursor-pointer"
            />
            <span className="flex items-center gap-1.5 text-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-[#E8552B]" />
              Apenas com Oferta
            </span>
          </label>

          <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer select-none bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors">
            <input
              type="checkbox"
              checked={onlyOpen}
              onChange={(e) => setOnlyOpen(e.target.checked)}
              className="w-4 h-4 rounded text-[#2E9E5B] focus:ring-[#2E9E5B] accent-[#2E9E5B] cursor-pointer"
            />
            <span className="flex items-center gap-1.5 text-slate-800">
              <Clock className="w-3.5 h-3.5 text-[#2E9E5B]" />
              Aberto Agora
            </span>
          </label>
        </div>

        {/* Clear Filters or Results Status */}
        <div className="flex items-center gap-2">
          {(selectedCategory !== 'Todas' ||
            selectedNeighborhood !== 'Todos os Bairros' ||
            searchQuery.trim() ||
            onlyOffers ||
            onlyOpen) && (
            <button
              onClick={() => {
                setSelectedCategory('Todas');
                setSelectedNeighborhood('Todos os Bairros');
                setSearchQuery('');
                setOnlyOffers(false);
                setOnlyOpen(false);
              }}
              className="text-[#E8552B] hover:text-red-700 font-bold text-xs underline transition-colors"
            >
              Limpar filtros
            </button>
          )}

          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            Mostrando <strong>{filteredCount}</strong> de {stores.length} lojas
          </span>
        </div>
      </div>
    </div>
  );
};
