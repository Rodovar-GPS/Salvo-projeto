import React, { useRef, useState, useEffect } from 'react';
import { StoreCategory, SalvadorNeighborhood, Store } from '../types';
import { STORE_CATEGORIES, SALVADOR_NEIGHBORHOODS } from '../data/mockData';
import { SALVADOR_NEIGHBORHOOD_GEO_MAP } from '../utils/salvadorGeoDatabase';
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
  Navigation,
  Crosshair,
  Loader2,
  Radio,
  ArrowUpDown,
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
  userLocation?: { lat: number; lng: number } | null;
  onUseLocation?: () => void;
  onSetManualNeighborhood?: (neighborhoodName: string) => void;
  isLocating?: boolean;
  detectedNeighborhood?: string;
  gpsAccuracy?: number;
  proximityRadius?: number | null;
  setProximityRadius?: (radius: number | null) => void;
  sortByDistance?: boolean;
  setSortByDistance?: (val: boolean) => void;
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
  userLocation,
  onUseLocation,
  onSetManualNeighborhood,
  isLocating = false,
  detectedNeighborhood,
  gpsAccuracy,
  proximityRadius = null,
  setProximityRadius,
  sortByDistance = false,
  setSortByDistance,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showAllCategoriesModal, setShowAllCategoriesModal] = useState(false);
  const [showLocationPickerModal, setShowLocationPickerModal] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');

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
    onlyOpen ||
    proximityRadius !== null ||
    sortByDistance;

  const handleResetFilters = () => {
    setSelectedCategory('Todas');
    setSelectedNeighborhood('Todos os Bairros');
    setSearchQuery('');
    setOnlyOffers(false);
    setOnlyOpen(false);
    if (setProximityRadius) setProximityRadius(null);
    if (setSortByDistance) setSortByDistance(false);
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

            {/* Toggle: Ordenar por Proximidade GPS */}
            {setSortByDistance && (
              <button
                type="button"
                onClick={() => {
                  if (!userLocation && onUseLocation) {
                    onUseLocation();
                  }
                  setSortByDistance(!sortByDistance);
                }}
                className={`h-9 px-3 sm:px-3.5 rounded-2xl text-xs font-heading font-bold transition-all flex items-center gap-1.5 sm:gap-2 border select-none cursor-pointer active:scale-95 ${
                  sortByDistance
                    ? 'bg-[#0B3D91] text-white border-[#0B3D91] shadow-xs ring-2 ring-[#0B3D91]/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
                title="Ordenar estabelecimentos pela distância real do seu GPS"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-[#FFC72C]" />
                <span className="whitespace-nowrap">Mais Próximos (GPS)</span>
                {sortByDistance && <span className="w-1.5 h-1.5 rounded-full bg-[#FFC72C]" />}
              </button>
            )}
          </div>

          {/* Active Filter Clear & Result Counter */}
          <div className="flex items-center gap-2 justify-between sm:justify-end flex-wrap">
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

        {/* ROW 4: GPS Location Banner & Distance Radius Selector */}
        <div className="pt-2.5 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs bg-slate-50/80 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-3.5 sm:p-4 rounded-b-3xl">
          {/* GPS Status & Locator Button */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={onUseLocation}
              disabled={isLocating}
              className={`h-9 px-3.5 rounded-xl font-heading font-bold text-xs flex items-center gap-2 transition-all shadow-2xs active:scale-95 cursor-pointer ${
                userLocation
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-[#0B3D91] hover:bg-[#082C69] text-white'
              }`}
              title="Obter coordenadas de alta precisão do GPS do aparelho"
            >
              {isLocating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Obtendo GPS...</span>
                </>
              ) : (
                <>
                  <Crosshair className="w-3.5 h-3.5 text-[#FFC72C]" />
                  <span>{userLocation ? 'GPS Ativo' : 'Ativar GPS Local'}</span>
                </>
              )}
            </button>

            {userLocation ? (
              <div className="flex items-center gap-2 text-slate-700 text-xs flex-wrap">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="font-semibold text-slate-800">
                  📍 {detectedNeighborhood ? `${detectedNeighborhood}, Salvador` : 'Salvador - BA'}
                </span>
                {gpsAccuracy && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    ±{Math.round(gpsAccuracy)}m
                  </span>
                )}
                <button
                  onClick={() => setShowLocationPickerModal(true)}
                  className="text-[11px] font-bold text-[#0B3D91] hover:text-[#082C69] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  title="Alterar ou corrigir manualmente o seu bairro de origem"
                >
                  <span>Ajustar Bairro</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    if (onSetManualNeighborhood) onSetManualNeighborhood('Pau da Lima');
                  }}
                  className="h-8 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                  title="Definir Pau da Lima como sua localização de referência"
                >
                  <span>🛍️</span>
                  <span>Estou em Pau da Lima</span>
                </button>

                <button
                  onClick={() => setShowLocationPickerModal(true)}
                  className="h-8 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-[11px] transition-colors cursor-pointer"
                >
                  Outro Bairro...
                </button>
              </div>
            )}
          </div>

          {/* Proximity Radius Selector */}
          {setProximityRadius && (
            <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto py-0.5">
              <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap mr-1">
                Raio:
              </span>
              {[
                { label: 'Todos', value: null },
                { label: '1 km', value: 1000 },
                { label: '3 km', value: 3000 },
                { label: '5 km', value: 5000 },
                { label: '10 km', value: 10000 },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    if (!userLocation && onUseLocation && item.value !== null) {
                      onUseLocation();
                    }
                    setProximityRadius(item.value);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                    proximityRadius === item.value
                      ? 'bg-[#0B3D91] text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
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

      {/* =========================================================
          LOCATION / NEIGHBORHOOD PICKER MODAL (GPS ADJUSTMENT)
      ========================================================= */}
      {showLocationPickerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-linear-to-r from-[#0B3D91] to-[#082C69] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                  <Navigation className="w-5 h-5 text-[#FFC72C]" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg text-white">
                    Definir Meu Bairro de Referência
                  </h3>
                  <p className="text-xs text-white/80">
                    Salvador - BA • Calcule distâncias exatas até as lojas
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLocationPickerModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* GPS Re-detect Banner & Search Input */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
              <div className="flex items-center justify-between gap-2 p-3 bg-white rounded-2xl border border-blue-100 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-[#0B3D91]" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800">Usar GPS do aparelho</span>
                    <p className="text-[11px] text-slate-500">Detecção automática via satélite/rede</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (onUseLocation) onUseLocation();
                    setShowLocationPickerModal(false);
                  }}
                  disabled={isLocating}
                  className="px-3 py-1.5 bg-[#0B3D91] hover:bg-[#082C69] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Crosshair className="w-3.5 h-3.5" />}
                  <span>{isLocating ? 'Obtendo...' : 'Detectar GPS'}</span>
                </button>
              </div>

              {/* Search neighborhood field */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={locationSearchQuery}
                  onChange={(e) => setLocationSearchQuery(e.target.value)}
                  placeholder="Buscar bairro (ex: Pau da Lima, Brotas, Barra)..."
                  className="w-full pl-9.5 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-[#0B3D91] focus:ring-2 focus:ring-[#0B3D91]/20 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              {/* Quick Select Highlights */}
              {!locationSearchQuery.trim() && (
                <div>
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFC72C]" />
                    Bairros em Destaque & Populares
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { name: 'Pau da Lima', desc: 'Av. São Rafael / Largo', tag: 'Destaque', emoji: '🛍️' },
                      { name: 'São Rafael', desc: 'Hospital / Shopping', tag: 'Miolo', emoji: '🏥' },
                      { name: 'Castelo Branco', desc: 'Via Regional', tag: 'Miolo', emoji: '🏰' },
                      { name: 'São Marcos', desc: 'Av. São Rafael', tag: 'Miolo', emoji: '🏘️' },
                      { name: 'Brotas', desc: 'Acupe / D. João VI', tag: 'Central', emoji: '🏢' },
                      { name: 'Barra', desc: 'Farol / Orla', tag: 'Orla', emoji: '⛵' },
                      { name: 'Pituba', desc: 'Manoel Dias / Av. Paulo VI', tag: 'Orla', emoji: '🌳' },
                      { name: 'Itapuã', desc: 'Farol / Dorival Caymmi', tag: 'Orla', emoji: '🌺' },
                      { name: 'Cajazeiras', desc: 'Rótula / Águas Claras', tag: 'Pau da Lima/Cajaz.', emoji: '🚇' },
                    ].map((item) => {
                      const isCurrent = detectedNeighborhood === item.name;
                      return (
                        <button
                          key={item.name}
                          onClick={() => {
                            if (onSetManualNeighborhood) {
                              onSetManualNeighborhood(item.name);
                            }
                            setShowLocationPickerModal(false);
                          }}
                          className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                            isCurrent
                              ? 'bg-blue-50/80 border-[#0B3D91] ring-2 ring-[#0B3D91]/20'
                              : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="text-base">{item.emoji}</span>
                            {isCurrent ? (
                              <span className="text-[9px] font-black bg-[#0B3D91] text-white px-1.5 py-0.5 rounded-md">
                                Atual
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                                {item.tag}
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="font-heading font-black text-xs text-slate-900 block leading-tight">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-slate-500 block truncate">
                              {item.desc}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* All Neighborhoods List */}
              <div>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Todos os Bairros de Salvador ({Object.keys(SALVADOR_NEIGHBORHOOD_GEO_MAP).length})</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {Object.keys(SALVADOR_NEIGHBORHOOD_GEO_MAP)
                    .filter((n) =>
                      n.toLowerCase().includes(locationSearchQuery.toLowerCase().trim())
                    )
                    .sort((a, b) => a.localeCompare(b, 'pt-BR'))
                    .map((nName) => {
                      const geoInfo = SALVADOR_NEIGHBORHOOD_GEO_MAP[nName];
                      const isCurrent = detectedNeighborhood === nName;
                      return (
                        <button
                          key={nName}
                          onClick={() => {
                            if (onSetManualNeighborhood) {
                              onSetManualNeighborhood(nName);
                            }
                            setShowLocationPickerModal(false);
                          }}
                          className={`p-2 rounded-xl text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                            isCurrent
                              ? 'bg-[#0B3D91] text-white font-bold'
                              : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <MapPin className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-[#FFC72C]' : 'text-slate-400'}`} />
                            <span className="truncate">{nName}</span>
                          </div>
                          {geoInfo?.region && (
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-md font-medium shrink-0 ml-1 ${
                                isCurrent
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {geoInfo.region}
                            </span>
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Localização atual: <strong>{detectedNeighborhood || 'Não definida'}</strong>
              </span>
              <button
                onClick={() => setShowLocationPickerModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
