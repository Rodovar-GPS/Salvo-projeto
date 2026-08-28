import React, { useRef, useState, useEffect } from 'react';
import { StoreCategory, SalvadorNeighborhood, Store } from '../types';
import { STORE_CATEGORIES, SALVADOR_NEIGHBORHOODS } from '../data/mockData';
import { ClearableInput } from './ClearableInput';
import { getCategoryIcon, CATEGORY_VISUALS } from '../utils/categoryIcons';
import {
  Search,
  MapPin,
  Map as MapIcon,
  List,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  LayoutGrid,
  X,
  Check,
  Layers,
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
  const [showAllCategoriesModal, setShowAllCategoriesModal] = useState(false);

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
      const amount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  const hasActiveFilters =
    selectedCategory !== 'Todas' ||
    selectedNeighborhood !== 'Todos os Bairros' ||
    searchQuery.trim().length > 0 ||
    onlyOffers ||
    onlyOpen;

  const handleResetFilters = () => {
    setSelectedCategory('Todas');
    setSelectedNeighborhood('Todos os Bairros');
    setSearchQuery('');
    setOnlyOffers(false);
    setOnlyOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/90 space-y-3.5">
        {/* ROW 1: Search + Neighborhood Selector + View Switcher */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5 sm:gap-3">
          {/* Search Input Box */}
          <div className="flex-1 w-full relative min-w-0">
            <ClearableInput
              placeholder="Buscar lojas, ofertas e serviços de Salvador..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              leftIcon={<Search className="w-4 h-4 text-slate-500 shrink-0" />}
              className="h-11 sm:h-12 bg-white border border-slate-300 hover:border-slate-400 focus:bg-white focus:border-[#0B3D91] focus:ring-2 focus:ring-[#0B3D91]/15 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-500 shadow-2xs rounded-2xl"
            />
          </div>

          {/* Neighborhood Selector with Cultural Guide Shortcut */}
          <div className="w-full lg:w-72 relative flex items-center gap-2">
            <div className="relative flex-1 min-w-0">
              <MapPin className="w-4 h-4 text-[#0B3D91] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value as any)}
                className="w-full h-11 sm:h-12 pl-10 pr-8 bg-white border border-slate-300 hover:border-slate-400 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#0B3D91] focus:ring-2 focus:ring-[#0B3D91]/15 shadow-2xs outline-none transition-all appearance-none cursor-pointer truncate"
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
                className="h-11 sm:h-12 px-3 sm:px-3.5 bg-sky-50 hover:bg-sky-100 active:bg-sky-200 text-[#0B3D91] border border-sky-200 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
                title="Explorar Guia Cultural de Bairros de Salvador"
              >
                <Compass className="w-4 h-4 text-[#0B3D91] shrink-0" />
                <span className="hidden sm:inline">Bairros</span>
              </button>
            )}
          </div>

          {/* View Mode Toggle: Mapa / Lista */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0 w-full lg:w-auto justify-center shadow-2xs">
            <button
              onClick={() => setViewMode('map')}
              className={`flex-1 lg:flex-initial px-4 py-2 sm:py-2.5 rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-[#0B3D91] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0B3D91] active:bg-slate-200'
              }`}
            >
              <MapIcon className="w-4 h-4 shrink-0" />
              <span>Mapa</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 lg:flex-initial px-4 py-2 sm:py-2.5 rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#0B3D91] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0B3D91] active:bg-slate-200'
              }`}
            >
              <List className="w-4 h-4 shrink-0" />
              <span>Lista ({filteredCount})</span>
            </button>
          </div>
        </div>

        {/* ROW 2: Horizontal Category Rail with Scroll Buttons and Category Grid Trigger */}
        <div className="relative pt-1 flex items-center gap-2">
          {/* Scroll Left Button */}
          {canScrollLeft && (
            <button
              onClick={() => handleScroll('left')}
              className="hidden sm:flex w-8 h-8 rounded-full bg-white shadow-md border border-slate-300 text-slate-700 hover:text-[#0B3D91] hover:bg-slate-50 items-center justify-center transition-all shrink-0 hover:scale-105 active:scale-95 cursor-pointer z-10"
              aria-label="Rolar categorias para a esquerda"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Scrollable Category Rail */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex-1 flex items-center gap-2 overflow-x-auto py-1 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {/* "TODOS" Pill */}
            <button
              onClick={() => setSelectedCategory('Todas')}
              className={`h-10 px-3.5 sm:px-4 rounded-2xl text-xs font-heading font-black uppercase tracking-wider shrink-0 transition-all flex items-center gap-2 border select-none cursor-pointer active:scale-95 ${
                selectedCategory === 'Todas'
                  ? 'bg-[#0B3D91] text-white border-[#0B3D91] shadow-xs ring-2 ring-[#0B3D91]/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <LayoutGrid
                size={16}
                strokeWidth={2}
                className={selectedCategory === 'Todas' ? 'text-white' : 'text-slate-700'}
              />
              <span className="whitespace-nowrap">TODOS</span>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  selectedCategory === 'Todas'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {stores.length}
              </span>
            </button>

            {/* Individual Category Pills (All 17 Categories) */}
            {STORE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              const count = stores.filter((s) => s.category === cat.name).length;

              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`h-10 px-3 sm:px-3.5 rounded-2xl text-xs font-heading font-bold shrink-0 transition-all flex items-center gap-2 border select-none cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-[#0B3D91] text-white border-[#0B3D91] shadow-xs ring-2 ring-[#0B3D91]/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="shrink-0">
                    {getCategoryIcon(cat.name, {
                      size: 16,
                      strokeWidth: 2,
                      color: isSelected ? '#FFFFFF' : cat.color,
                    })}
                  </span>
                  <span className="whitespace-nowrap">{cat.name}</span>
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          {canScrollRight && (
            <button
              onClick={() => handleScroll('right')}
              className="hidden sm:flex w-8 h-8 rounded-full bg-white shadow-md border border-slate-300 text-slate-700 hover:text-[#0B3D91] hover:bg-slate-50 items-center justify-center transition-all shrink-0 hover:scale-105 active:scale-95 cursor-pointer z-10"
              aria-label="Rolar categorias para a direita"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* "Ver Todas as 17 Categorias" Modal Shortcut */}
          <button
            onClick={() => setShowAllCategoriesModal(true)}
            className="h-10 px-2.5 sm:px-3 bg-sky-50 hover:bg-sky-100 text-[#0B3D91] border border-sky-200 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
            title="Ver todas as 17 categorias em grade completa"
          >
            <Layers className="w-3.5 h-3.5 text-[#0B3D91]" />
            <span className="hidden sm:inline">Todas</span>
            <span className="text-[10px] bg-[#0B3D91] text-white px-1.5 py-0.2 rounded-full font-black">
              {STORE_CATEGORIES.length}
            </span>
          </button>
        </div>

        {/* ROW 3: Secondary Quick Filter Pills & Result Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2.5 border-t border-slate-100 text-xs">
          {/* Quick Filter Action Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Toggle: Apenas com Oferta */}
            <button
              type="button"
              onClick={() => setOnlyOffers(!onlyOffers)}
              className={`h-9 px-3 sm:px-3.5 rounded-2xl text-xs font-heading font-bold transition-all flex items-center gap-1.5 sm:gap-2 border select-none cursor-pointer active:scale-95 ${
                onlyOffers
                  ? 'bg-[#C1502E] text-white border-[#C1502E] shadow-xs ring-2 ring-[#C1502E]/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Sparkles
                className={`w-3.5 h-3.5 ${onlyOffers ? 'text-white fill-white' : 'text-[#C1502E]'}`}
              />
              <span className="whitespace-nowrap">Apenas com Oferta</span>
              {onlyOffers && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>

            {/* Toggle: Aberto Agora */}
            <button
              type="button"
              onClick={() => setOnlyOpen(!onlyOpen)}
              className={`h-9 px-3 sm:px-3.5 rounded-2xl text-xs font-heading font-bold transition-all flex items-center gap-1.5 sm:gap-2 border select-none cursor-pointer active:scale-95 ${
                onlyOpen
                  ? 'bg-[#1F6E43] text-white border-[#1F6E43] shadow-xs ring-2 ring-[#1F6E43]/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Clock
                className={`w-3.5 h-3.5 ${onlyOpen ? 'text-white' : 'text-[#1F6E43]'}`}
              />
              <span className="whitespace-nowrap">Aberto Agora</span>
              {onlyOpen && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
          </div>

          {/* Active Filter Clear & Result Counter */}
          <div className="flex items-center gap-2 justify-between sm:justify-end">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-[#C1502E] hover:text-[#A33F22] font-bold text-xs underline transition-colors cursor-pointer"
              >
                Limpar filtros
              </button>
            )}

            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200 whitespace-nowrap">
              Mostrando <strong className="text-slate-900 font-bold">{filteredCount}</strong> de {stores.length} lojas
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: ALL CATEGORIES GRID (Comprehensive Marketplace View) */}
      {/* ========================================================= */}
      {showAllCategoriesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#0B3D91] text-white flex items-center justify-center shadow-sm">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-black text-slate-900">
                    Todas as Categorias de Salvador
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Escolha uma das 17 categorias de comércios e serviços
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAllCategoriesModal(false)}
                className="w-9 h-9 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Grid of Categories */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {/* Option to select "TODOS" */}
              <button
                onClick={() => {
                  setSelectedCategory('Todas');
                  setShowAllCategoriesModal(false);
                }}
                className={`w-full p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                  selectedCategory === 'Todas'
                    ? 'bg-[#0B3D91] text-white border-[#0B3D91] shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      selectedCategory === 'Todas' ? 'bg-white/20' : 'bg-slate-200'
                    }`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-heading font-black text-sm">Todas as Categorias</p>
                    <p
                      className={`text-xs ${
                        selectedCategory === 'Todas' ? 'text-white/80' : 'text-slate-500'
                      }`}
                    >
                      Exibir todos os comércios de Salvador
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-black px-2.5 py-1 rounded-xl ${
                    selectedCategory === 'Todas'
                      ? 'bg-white text-[#0B3D91]'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {stores.length} lojas
                </span>
              </button>

              {/* Grid of 17 Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {STORE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.name;
                  const count = stores.filter((s) => s.category === cat.name).length;
                  const meta = CATEGORY_VISUALS[cat.name];

                  return (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setShowAllCategoriesModal(false);
                      }}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between text-left cursor-pointer active:scale-98 ${
                        isSelected
                          ? 'bg-[#0B3D91] text-white border-[#0B3D91] shadow-md ring-2 ring-[#0B3D91]/20'
                          : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : meta?.bgLight || '#F1F5F9',
                          }}
                        >
                          {getCategoryIcon(cat.name, {
                            size: 20,
                            strokeWidth: 2,
                            color: isSelected ? '#FFFFFF' : cat.color,
                          })}
                        </div>
                        <div className="min-w-0">
                          <p className="font-heading font-bold text-xs sm:text-sm truncate">
                            {cat.name}
                          </p>
                          <p
                            className={`text-[11px] truncate ${
                              isSelected ? 'text-white/80' : 'text-slate-500'
                            }`}
                          >
                            {meta?.emoji || '📍'} Comércios de Salvador
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 pl-2">
                        <span
                          className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                            isSelected
                              ? 'bg-white text-[#0B3D91]'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {count}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Total: <strong>17 categorias</strong> disponíveis
              </span>
              <button
                onClick={() => setShowAllCategoriesModal(false)}
                className="px-4 py-2 bg-[#0B3D91] hover:bg-[#083a66] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
