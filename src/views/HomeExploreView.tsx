import React, { useState, useRef } from 'react';
import { Store, StoreCategory, SalvadorNeighborhood } from '../types';
import { STORE_CATEGORIES, SALVADOR_NEIGHBORHOODS } from '../data/mockData';
import { InteractiveMap } from '../components/InteractiveMap';
import { StoreCard } from '../components/StoreCard';
import { NeighborhoodGuideModal } from '../components/NeighborhoodGuideModal';
import { UsageGuideModal } from '../components/UsageGuideModal';
import { CategoryFilterBar } from '../components/CategoryFilterBar';
import { ClearableInput } from '../components/ClearableInput';
import {
  Search,
  Map as MapIcon,
  List,
  Sparkles,
  MapPin,
  X,
  SlidersHorizontal,
  Compass,
  Store as StoreIcon,
  Navigation,
  Info,
  HelpCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  Star,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface HomeExploreViewProps {
  stores: Store[];
  favorites: string[];
  onToggleFavorite: (storeId: string) => void;
  onSelectStore: (store: Store) => void;
  onOpenChat: (store: Store) => void;
  onOpenStreetView?: (store: Store) => void;
  selectedCategory: StoreCategory | 'Todas';
  setSelectedCategory: (cat: StoreCategory | 'Todas') => void;
  selectedNeighborhood: SalvadorNeighborhood | 'Todos os Bairros';
  setSelectedNeighborhood: (n: SalvadorNeighborhood | 'Todos os Bairros') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  userLocation: { lat: number; lng: number } | null;
  onUseLocation: () => void;
  isLocating: boolean;
  onOpenAuth?: () => void;
  onOpenChatDemo?: () => void;
  onOpenOffers?: () => void;
}

export const HomeExploreView: React.FC<HomeExploreViewProps> = ({
  stores,
  favorites,
  onToggleFavorite,
  onSelectStore,
  onOpenChat,
  onOpenStreetView,
  selectedCategory,
  setSelectedCategory,
  selectedNeighborhood,
  setSelectedNeighborhood,
  searchQuery,
  setSearchQuery,
  userLocation,
  onUseLocation,
  isLocating,
  onOpenAuth,
  onOpenChatDemo,
  onOpenOffers,
}) => {
  // View mode: 'map' | 'list'
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [showNeighborhoodGuide, setShowNeighborhoodGuide] = useState(false);
  const [showUsageGuide, setShowUsageGuide] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter logic
  const filteredStores = stores.filter((store) => {
    // Approval check
    if (store.approvalStatus === 'rejected') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = store.name.toLowerCase().includes(q);
      const matchesCategory = store.category.toLowerCase().includes(q);
      const matchesNeighborhood = store.neighborhood.toLowerCase().includes(q);
      const matchesDesc = store.description.toLowerCase().includes(q);
      const matchesOffer = store.offers.some((o) => o.title.toLowerCase().includes(q));
      if (!matchesName && !matchesCategory && !matchesNeighborhood && !matchesDesc && !matchesOffer) {
        return false;
      }
    }

    // Category
    if (selectedCategory !== 'Todas' && store.category !== selectedCategory) {
      return false;
    }

    // Neighborhood
    if (
      selectedNeighborhood !== 'Todos os Bairros' &&
      store.neighborhood !== selectedNeighborhood
    ) {
      return false;
    }

    // Filters
    if (onlyOffers && (!store.offers || store.offers.length === 0)) {
      return false;
    }
    if (onlyOpen && !store.isOpenNow) {
      return false;
    }

    return true;
  });

  const totalOffersCount = stores.reduce((acc, s) => acc + (s.offers?.length || 0), 0);

  // Featured sample store for product preview
  const sampleStore = stores.find((s) => s.offers && s.offers.length > 0) || stores[0];

  const handleScrollToMap = () => {
    setViewMode('map');
    const mapSection = document.getElementById('salvador-interactive-map');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleGoToOffers = () => {
    if (onOpenOffers) {
      onOpenOffers();
    } else {
      setOnlyOffers(true);
      setViewMode('list');
      const listSection = document.getElementById('salvador-stores-section');
      if (listSection) {
        listSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      {/* =========================================================
          HERO SECTION (DESKTOP: 2 COLUMNS | MOBILE: SINGLE COLUMN)
      ========================================================= */}
      <section className="bg-gradient-to-br from-[#0B4F8A] via-[#0B4F8A] to-[#07365F] rounded-3xl p-5 sm:p-8 lg:p-10 text-white shadow-xl relative overflow-hidden border border-blue-900/40">
        {/* Subtle geometric light accent */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-[#FFC72C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-20 w-64 h-64 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* =========================================================
            DESKTOP LAYOUT (2 COLUMNS: LEFT CONTENT + RIGHT REAL PRODUCT PREVIEW)
        ========================================================= */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* ESQUERDA: Informações e Ações Principais */}
          <div className="lg:col-span-7 space-y-5">
            {/* Tag de Localização */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-sky-100 border border-white/20 shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-[#FFC72C] shrink-0" />
              <span>SALVADOR • BAHIA</span>
            </div>

            {/* H1 Principal */}
            <h1 className="text-4xl xl:text-5xl font-heading font-black tracking-tight leading-[1.12] text-white">
              Encontre o melhor de Salvador.
            </h1>

            {/* Textos Descritivos com Alta Legibilidade */}
            <div className="space-y-1.5 text-sky-100 text-base leading-relaxed max-w-xl">
              <p className="font-semibold text-white/95 text-lg">
                Descubra lojas, ofertas e serviços perto de você.
              </p>
              <p className="text-sky-100/85 text-sm">
                Explore o comércio local de Salvador, encontre ofertas e descubra novos lugares.
              </p>
            </div>

            {/* Botões de Ação Padronizados */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {/* Botão Primário: AMARELO */}
              <button
                onClick={handleScrollToMap}
                className="px-6 py-3.5 bg-[#FFC72C] hover:bg-[#F5BC20] text-[#0B4F8A] rounded-2xl text-sm font-heading font-black uppercase tracking-wider transition-all duration-150 flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#FFC72C]/60 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#0B4F8A] shrink-0" />
                <span>Explorar Salvador</span>
              </button>

              {/* Botão Secundário: AZUL / Branco com Borda */}
              <button
                onClick={handleGoToOffers}
                className="px-6 py-3.5 bg-white/10 hover:bg-white text-white hover:text-[#0B4F8A] border border-white/30 hover:border-white rounded-2xl text-sm font-heading font-bold tracking-wide transition-all duration-150 flex items-center gap-2 backdrop-blur-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#FFC72C] shrink-0" />
                <span>Ver ofertas</span>
              </button>

              {/* Guias Auxiliares */}
              <button
                onClick={() => setShowNeighborhoodGuide(true)}
                className="px-4 py-3 text-sky-200 hover:text-white text-xs font-bold hover:underline inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Guia dos Bairros</span>
              </button>
            </div>

            {/* Métricas Rápidas */}
            <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-sky-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FFC72C]" />
                <span><strong className="text-white font-black">{stores.length}</strong> Lojas Cadastradas</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E8552B]" />
                <span><strong className="text-white font-black">{totalOffersCount}</strong> Ofertas Ativas</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span><strong className="text-white font-black">{SALVADOR_NEIGHBORHOODS.length}</strong> Bairros Cobertos</span>
              </div>
            </div>
          </div>

          {/* DIREITA: Representação Visual Real do Produto (SALVÔ Live Preview) */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl space-y-4 text-white relative">
              {/* Header do Mini Card */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="font-heading font-black tracking-wide text-white">SALVÔ AO VIVO</span>
                </div>
                <span className="text-[10px] font-bold text-sky-200 bg-white/10 px-2 py-0.5 rounded-full uppercase">
                  Salvador • BA
                </span>
              </div>

              {/* Stylized Mini Map Radar Graphic */}
              <div className="relative h-28 rounded-2xl bg-gradient-to-r from-blue-950 to-[#0B4F8A] border border-white/10 overflow-hidden flex items-center justify-center p-3">
                {/* Coastal silhouette effect */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#FFC72C_1px,transparent_1px)] [background-size:12px_12px]" />
                
                {/* Map Pins on Salvador landmarks */}
                <div className="absolute top-4 left-6 flex items-center gap-1 bg-white/90 text-[#0B4F8A] px-2 py-0.5 rounded-lg text-[10px] font-black shadow-md">
                  <MapPin className="w-3 h-3 text-[#E8552B]" />
                  <span>Pelourinho</span>
                </div>
                <div className="absolute bottom-4 left-10 flex items-center gap-1 bg-white/90 text-[#0B4F8A] px-2 py-0.5 rounded-lg text-[10px] font-black shadow-md">
                  <MapPin className="w-3 h-3 text-[#0B4F8A]" />
                  <span>Barra</span>
                </div>
                <div className="absolute top-7 right-8 flex items-center gap-1 bg-[#FFC72C] text-[#0B4F8A] px-2 py-0.5 rounded-lg text-[10px] font-black shadow-md animate-bounce">
                  <Sparkles className="w-3 h-3 text-[#0B4F8A]" />
                  <span>Rio Vermelho 🔥</span>
                </div>
              </div>

              {/* Card de Loja Real em Destaque */}
              {sampleStore && (
                <div
                  onClick={() => onSelectStore(sampleStore)}
                  className="bg-white text-slate-800 rounded-2xl p-3.5 shadow-md flex items-center gap-3.5 cursor-pointer hover:scale-[1.02] transition-all group"
                >
                  <img
                    src={sampleStore.coverImage || sampleStore.logo || (sampleStore.galleryImages && sampleStore.galleryImages[0]) || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80'}
                    alt={sampleStore.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-heading font-black text-sm text-slate-900 truncate">
                        {sampleStore.name}
                      </h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0B4F8A] shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-medium">{sampleStore.neighborhood}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 font-bold text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        {sampleStore.rating}
                      </span>
                    </div>
                    {sampleStore.offers && sampleStore.offers.length > 0 && (
                      <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold truncate max-w-full">
                        <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="truncate">{sampleStore.offers[0].title}</span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0B4F8A] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              )}

              {/* Rodapé do Preview */}
              <div className="flex items-center justify-between text-[11px] text-sky-200 font-medium px-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Comércio Oficial e Verificado
                </span>
                <span className="text-[#FFC72C] font-bold">100% Gratuito</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            MOBILE LAYOUT (SINGLE COLUMN STRICTLY ORDERED)
        ========================================================= */}
        <div className="lg:hidden space-y-4 relative z-10">
          {/* 1. Tag de Localização */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-black uppercase tracking-wider text-sky-100 border border-white/20">
            <MapPin className="w-3.5 h-3.5 text-[#FFC72C] shrink-0" />
            <span>SALVADOR • BAHIA</span>
          </div>

          {/* 2. Headline H1 */}
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight leading-tight text-white">
            Encontre o melhor de Salvador.
          </h1>

          {/* 3. Texto */}
          <p className="text-sky-100 text-xs sm:text-sm font-medium leading-relaxed">
            Descubra lojas, ofertas e serviços perto de você.
          </p>

          {/* 4. Campo de Busca com Destaque */}
          <div className="w-full relative pt-1">
            <ClearableInput
              placeholder="Buscar lojas, ofertas e serviços..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              className="h-12 bg-white text-slate-900 placeholder:text-slate-400 rounded-2xl border-0 shadow-lg text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-[#FFC72C]"
            />
          </div>

          {/* 5. Botões de Ação Mobile */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {/* Botão Primário: AMARELO */}
            <button
              onClick={handleScrollToMap}
              className="w-full min-h-[44px] py-3 px-3 bg-[#FFC72C] active:bg-[#F5BC20] text-[#0B4F8A] rounded-2xl text-xs font-heading font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
            >
              <Compass className="w-4 h-4 text-[#0B4F8A] shrink-0" />
              <span className="truncate">Explorar Salvador</span>
            </button>

            {/* Segundo Botão: AZUL / Branco com Borda */}
            <button
              onClick={handleGoToOffers}
              className="w-full min-h-[44px] py-3 px-3 bg-white/15 active:bg-white text-white active:text-[#0B4F8A] border border-white/30 rounded-2xl text-xs font-heading font-bold tracking-wide flex items-center justify-center gap-1.5 backdrop-blur-md active:scale-95 transition-transform"
            >
              <Sparkles className="w-4 h-4 text-[#FFC72C] shrink-0" />
              <span className="truncate">Ver ofertas</span>
            </button>
          </div>

          {/* 6. Prévia Visual Compacta do Produto no Mobile */}
          {sampleStore && (
            <div
              onClick={() => onSelectStore(sampleStore)}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-white flex items-center justify-between gap-3 active:scale-98 transition-transform cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={sampleStore.coverImage || sampleStore.logo || (sampleStore.galleryImages && sampleStore.galleryImages[0]) || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80'}
                  alt={sampleStore.name}
                  className="w-10 h-10 rounded-xl object-cover border border-white/20 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-heading font-bold text-xs text-white truncate">
                      {sampleStore.name}
                    </p>
                    <CheckCircle2 className="w-3 h-3 text-[#FFC72C] shrink-0" />
                  </div>
                  <p className="text-[10px] text-sky-200 truncate">
                    {sampleStore.neighborhood} • ★ {sampleStore.rating}
                  </p>
                </div>
              </div>
              <span className="px-2 py-1 bg-[#FFC72C] text-[#0B4F8A] text-[10px] font-black rounded-lg uppercase tracking-wider shrink-0">
                Ver Loja
              </span>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          SEARCH & FILTER SECTION (CategoryFilterBar)
      ========================================================= */}
      <section id="salvador-filters-section">
        <CategoryFilterBar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedNeighborhood={selectedNeighborhood}
          setSelectedNeighborhood={setSelectedNeighborhood}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onlyOffers={onlyOffers}
          setOnlyOffers={setOnlyOffers}
          onlyOpen={onlyOpen}
          setOnlyOpen={setOnlyOpen}
          stores={stores}
          filteredCount={filteredStores.length}
          onOpenNeighborhoodGuide={() => setShowNeighborhoodGuide(true)}
        />
      </section>

      {/* =========================================================
          MAIN INTERACTIVE MAP OR STORE LIST VIEW
      ========================================================= */}
      <div id="salvador-interactive-map" className="scroll-mt-20">
        {viewMode === 'map' ? (
          <div className="space-y-6">
            {/* Interactive Salvador Map Component */}
            <InteractiveMap
              stores={filteredStores}
              selectedCategory={selectedCategory}
              onSelectStore={onSelectStore}
              onOpenChat={onOpenChat}
              onOpenStreetView={onOpenStreetView}
              userLocation={userLocation}
              onUseLocation={onUseLocation}
              isLocating={isLocating}
            />

            {/* Quick List Preview under Map */}
            <div id="salvador-stores-section" className="scroll-mt-20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading font-black text-lg sm:text-xl text-slate-900">
                    Lojas em Salvador
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedNeighborhood !== 'Todos os Bairros'
                      ? `Filtrado por: ${selectedNeighborhood}`
                      : 'Principais destaques da capital baiana'}
                  </p>
                </div>

                <button
                  onClick={() => setViewMode('list')}
                  className="text-xs font-bold text-[#0B4F8A] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Ver lista completa ({filteredStores.length})</span>
                  <span>→</span>
                </button>
              </div>

              {filteredStores.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/90 shadow-xs">
                  <p className="text-3xl mb-2">🏖️</p>
                  <h4 className="font-heading font-bold text-slate-800 text-sm sm:text-base mb-1">
                    Nenhuma loja encontrada com esses filtros
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                    Tente limpar a busca ou selecionar outro bairro de Salvador.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Todas');
                      setSelectedNeighborhood('Todos os Bairros');
                      setOnlyOffers(false);
                      setOnlyOpen(false);
                    }}
                    className="px-4 py-2.5 bg-[#0B4F8A] hover:bg-[#083A66] text-white rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
                  >
                    Limpar Todos os Filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {filteredStores.slice(0, 8).map((store) => (
                    <StoreCard
                      key={store.id}
                      store={store}
                      isFavorite={favorites.includes(store.id)}
                      onToggleFavorite={onToggleFavorite}
                      onSelectStore={onSelectStore}
                      onOpenChat={onOpenChat}
                      onOpenStreetView={onOpenStreetView}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Full List View Mode */
          <div id="salvador-stores-section" className="scroll-mt-20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-black text-xl sm:text-2xl text-slate-900">
                  Catálogo de Lojas
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {filteredStores.length} lojas encontradas em Salvador
                </p>
              </div>
            </div>

            {filteredStores.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/90 shadow-xs">
                <p className="text-3xl mb-2">🏝️</p>
                <h4 className="font-heading font-bold text-slate-800 text-sm sm:text-base mb-1">
                  Nenhuma loja encontrada
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  Tente ajustar a busca ou escolher outra categoria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Todas');
                    setSelectedNeighborhood('Todos os Bairros');
                  }}
                  className="px-4 py-2.5 bg-[#0B4F8A] hover:bg-[#083A66] text-white rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
                >
                  Restaurar Catálogo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredStores.map((store) => (
                  <StoreCard
                    key={store.id}
                    store={store}
                    isFavorite={favorites.includes(store.id)}
                    onToggleFavorite={onToggleFavorite}
                    onSelectStore={onSelectStore}
                    onOpenChat={onOpenChat}
                    onOpenStreetView={onOpenStreetView}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Neighborhood Cultural Guide Modal */}
      <NeighborhoodGuideModal
        isOpen={showNeighborhoodGuide}
        onClose={() => setShowNeighborhoodGuide(false)}
        onSelectNeighborhood={(n) => {
          setSelectedNeighborhood(n);
        }}
        stores={stores}
      />

      {/* Interactive Step-by-Step Usage Guide Modal */}
      <UsageGuideModal
        isOpen={showUsageGuide}
        onClose={() => setShowUsageGuide(false)}
        onOpenAuth={onOpenAuth}
        onStartSearch={() => {
          searchInputRef.current?.focus();
        }}
        onOpenChatDemo={onOpenChatDemo}
      />
    </div>
  );
};
