import React, { useState, useRef, useMemo } from 'react';
import { Store, StoreCategory, SalvadorNeighborhood } from '../types';
import { STORE_CATEGORIES, SALVADOR_NEIGHBORHOODS } from '../data/mockData';
import { isValidPublicStore, filterValidPublicStores } from '../utils/storeValidation';
import { getDistanceInMeters, detectSalvadorNeighborhood } from '../utils/geolocation';
import { InteractiveMap } from '../components/InteractiveMap';
import { HeroLiveMap } from '../components/HeroLiveMap';
import { StoreCard } from '../components/StoreCard';
import { NeighborhoodGuideModal } from '../components/NeighborhoodGuideModal';
import { UsageGuideModal } from '../components/UsageGuideModal';
import { CategoryFilterBar } from '../components/CategoryFilterBar';
import { ClearableInput } from '../components/ClearableInput';
import { SalvoFeAdBanner } from '../components/SalvoFeAdBanner';
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
  Crosshair,
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
  userLocation: { lat: number; lng: number; accuracy?: number; neighborhood?: string; isManual?: boolean } | null;
  onUseLocation: () => void;
  onSetManualNeighborhood?: (neighborhoodName: string) => void;
  isLocating: boolean;
  onOpenAuth?: () => void;
  onOpenChatDemo?: () => void;
  onOpenOffers?: () => void;
  onOpenNeighborhoodGuide?: () => void;
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
  onSetManualNeighborhood,
  isLocating,
  onOpenAuth,
  onOpenChatDemo,
  onOpenOffers,
  onOpenNeighborhoodGuide,
}) => {

  // View mode: 'map' | 'list'
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [onlyOffers, setOnlyOffers] = useState(true);
  const [onlyOpen, setOnlyOpen] = useState(true);
  const [proximityRadius, setProximityRadius] = useState<number | null>(null);
  const [sortByDistance, setSortByDistance] = useState<boolean>(false);
  const [showNeighborhoodGuide, setShowNeighborhoodGuide] = useState(false);
  const [showUsageGuide, setShowUsageGuide] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Detected neighborhood from user GPS coordinates or explicit manual selection
  const detectedGpsNeighborhood = useMemo(() => {
    if (!userLocation) return undefined;
    if (userLocation.neighborhood) return userLocation.neighborhood;
    const res = detectSalvadorNeighborhood(userLocation.lat, userLocation.lng);
    return res.neighborhood;
  }, [userLocation]);

  const handleOpenNeighborhoodGuide = () => {
    if (onOpenNeighborhoodGuide) {
      onOpenNeighborhoodGuide();
    } else {
      setShowNeighborhoodGuide(true);
    }
  };

  // Filter & sorting logic (strict validation against test/placeholder stores + real-time GPS)
  const filteredStores = useMemo(() => {
    let list = stores.filter((store) => {
      // Validate store quality for public listing
      if (!isValidPublicStore(store)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = store.name.toLowerCase().includes(q);
        const matchesCategory = store.category.toLowerCase().includes(q);
        const matchesNeighborhood = store.neighborhood.toLowerCase().includes(q);
        const matchesDesc = store.description.toLowerCase().includes(q);
        const matchesOffer = store.offers?.some((o) => o.title.toLowerCase().includes(q));
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

      // Proximity Radius filter (GPS)
      if (proximityRadius !== null && userLocation) {
        const dist = getDistanceInMeters(
          userLocation.lat,
          userLocation.lng,
          store.coordinates.lat,
          store.coordinates.lng
        );
        if (dist > proximityRadius) {
          return false;
        }
      }

      return true;
    });

    // Sorting by GPS distance if requested or when proximity radius is active
    if ((sortByDistance || proximityRadius !== null) && userLocation) {
      list = [...list].sort((a, b) => {
        const distA = getDistanceInMeters(
          userLocation.lat,
          userLocation.lng,
          a.coordinates.lat,
          a.coordinates.lng
        );
        const distB = getDistanceInMeters(
          userLocation.lat,
          userLocation.lng,
          b.coordinates.lat,
          b.coordinates.lng
        );
        return distA - distB;
      });
    }

    return list;
  }, [
    stores,
    searchQuery,
    selectedCategory,
    selectedNeighborhood,
    onlyOffers,
    onlyOpen,
    proximityRadius,
    sortByDistance,
    userLocation,
  ]);

  const totalOffersCount = stores.reduce((acc, s) => acc + (s.offers?.length || 0), 0);

  // Authenticated real featured store (strictly valid public store)
  const realFeaturedStore =
    stores.find((s) => s.isFeatured && isValidPublicStore(s)) ||
    stores.find((s) => isValidPublicStore(s) && s.offers && s.offers.length > 0) ||
    stores.find((s) => isValidPublicStore(s));

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
      <section className="rounded-3xl p-5 sm:p-8 lg:p-10 text-white shadow-2xl relative overflow-hidden border border-blue-800/40 bg-slate-950">
        {/* Imagem de Fundo em Alta Definição */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://iili.io/CpQGyhu.png"
            alt="Salvador Panorama"
            className="w-full h-full object-cover object-center scale-[1.02] transform transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          {/* Camada de Gradiente / Overlay para Máxima Legibilidade dos Textos */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#061C44]/90 via-[#0B3D91]/75 to-[#082457]/80 backdrop-brightness-[0.85]" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/50" />
        </div>

        {/* Ambient atmospheric glows */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-[#FFC72C]/15 rounded-full blur-3xl pointer-events-none z-1" />
        <div className="absolute left-1/3 -top-20 w-64 h-64 bg-sky-400/15 rounded-full blur-2xl pointer-events-none z-1" />

        {/* =========================================================
            DESKTOP LAYOUT (2 COLUMNS: LEFT CONTENT + RIGHT REAL PRODUCT PREVIEW)
        ========================================================= */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* ESQUERDA: Informações e Ações Principais */}
          <div className="lg:col-span-7 space-y-5">
            {/* Tag de Localização */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-[#FFC72C] border border-white/20 shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-[#FFC72C] shrink-0" />
              <span>SALVADOR NA PALMA DA MÃO</span>
            </div>

            {/* H1 Principal com Tipografia de Destaque do Design System (Fraunces) */}
            <h1 className="text-4xl xl:text-5xl font-display font-black tracking-tight leading-[1.15] text-white drop-shadow-md">
              SALVÔ — Seu Guia Diário
            </h1>

            {/* Textos Descritivos com Alta Legibilidade */}
            <div className="space-y-1.5 text-sky-100 text-base leading-relaxed max-w-xl">
              <p className="font-bold text-white text-lg drop-shadow-sm">
                Descubra o comércio local, encontre ofertas, conecte-se com pessoas e acompanhe a cidade em tempo real.
              </p>
              <p className="text-amber-200 font-semibold text-sm leading-relaxed drop-shadow-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FFC72C] shrink-0" />
                <span>Comércio, conexão e Salvador. Tudo em um só lugar.</span>
              </p>
            </div>

            {/* Botões de Ação Padronizados */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {/* Botão Primário: AMARELO CTA */}
              <button
                onClick={handleScrollToMap}
                className="px-6 py-3.5 bg-[#FFC72C] hover:bg-[#F0B719] text-[#0B3D91] rounded-2xl text-sm font-heading font-black uppercase tracking-wider transition-all duration-150 flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#FFC72C]/60 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#0B3D91] shrink-0" />
                <span>Explorar Salvador</span>
              </button>

              {/* Botão Secundário: ACCENT-WARM (Terracota) */}
              <button
                onClick={handleGoToOffers}
                className="px-6 py-3.5 bg-[#C1502E] hover:bg-[#A33F22] text-white border border-[#C1502E] rounded-2xl text-sm font-heading font-bold tracking-wide transition-all duration-150 flex items-center gap-2 shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#C1502E]/60 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white shrink-0" />
                <span>Ver ofertas</span>
              </button>

              {/* Explorar Bairros */}
              <button
                onClick={handleOpenNeighborhoodGuide}
                className="px-5 py-3.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-2xl text-sm font-heading font-bold tracking-wide transition-all duration-150 flex items-center gap-2 shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#FFC72C] shrink-0" />
                <span>Explorar Bairros</span>
              </button>
            </div>

            {/* 3 Métricas com Ícones do Novo Set */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-sky-100">
              <div className="flex items-center gap-2">
                <StoreIcon className="w-4 h-4 text-[#FFC72C] shrink-0" strokeWidth={2} />
                <span><strong className="text-white font-bold">{stores.length}</strong> Lojas Cadastradas</span>
              </div>
              <span className="text-white/30">•</span>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C1502E] shrink-0" strokeWidth={2} />
                <span><strong className="text-white font-bold">{totalOffersCount}</strong> Ofertas Ativas</span>
              </div>
              <span className="text-white/30">•</span>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1F6E43] shrink-0" strokeWidth={2} />
                <span><strong className="text-white font-bold">{SALVADOR_NEIGHBORHOODS.length}</strong> Bairros</span>
              </div>
            </div>
          </div>

          {/* DIREITA: Widget SALVÔ AO VIVO (Resumo ao Vivo com Mini-Mapa Real + Loja Real) */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/70 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl space-y-4 text-white relative">
              {/* Header do Widget */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="font-heading font-black tracking-wide text-white">SALVÔ AO VIVO</span>
                </div>
                <span className="text-[10px] font-bold text-sky-200 bg-white/10 px-2.5 py-0.5 rounded-full uppercase">
                  Resumo em Tempo Real
                </span>
              </div>

              {/* Mini-Mapa Real com Leaflet & Bairros em Destaque */}
              <HeroLiveMap
                stores={stores}
                onSelectStore={onSelectStore}
                onExploreClick={handleScrollToMap}
              />

              {/* Card de Loja Real em Destaque (ou Estado Vazio Elegante) */}
              {realFeaturedStore ? (
                <div
                  onClick={() => onSelectStore(realFeaturedStore)}
                  className="bg-white text-slate-800 rounded-2xl p-3.5 shadow-md flex items-center gap-3.5 cursor-pointer hover:scale-[1.01] transition-all group"
                >
                  <img
                    src={
                      realFeaturedStore.coverImage ||
                      realFeaturedStore.logo ||
                      (realFeaturedStore.galleryImages && realFeaturedStore.galleryImages[0]) ||
                      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80'
                    }
                    alt={realFeaturedStore.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-heading font-bold text-sm text-slate-900 truncate">
                        {realFeaturedStore.name}
                      </h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0B3D91] shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-medium">{realFeaturedStore.neighborhood}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 font-bold text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        {realFeaturedStore.rating}
                      </span>
                    </div>
                    {realFeaturedStore.offers && realFeaturedStore.offers.length > 0 && (
                      <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#C1502E]/10 text-[#C1502E] border border-[#C1502E]/20 text-[10px] font-bold truncate max-w-full">
                        <Sparkles className="w-3 h-3 text-[#C1502E] shrink-0" />
                        <span className="truncate">{realFeaturedStore.offers[0].title}</span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0B3D91] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center flex flex-col items-center justify-center space-y-1">
                  <StoreIcon className="w-6 h-6 text-sky-200" strokeWidth={1.5} />
                  <h4 className="font-heading font-bold text-xs text-white">Em breve: lojas em destaque</h4>
                  <p className="text-[11px] text-sky-200/80">Novos comércios e ofertas da cidade estão em validação.</p>
                </div>
              )}

              {/* Rodapé do Widget */}
              <div className="flex items-center justify-between text-[11px] text-sky-200 font-medium px-1">
                <span className="flex items-center gap-1.5">
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-bold uppercase tracking-wider text-[#FFC72C] border border-white/20">
            <MapPin className="w-3.5 h-3.5 text-[#FFC72C] shrink-0" />
            <span>SALVADOR NA PALMA DA MÃO</span>
          </div>

          {/* 2. Headline H1 com Tipografia Fraunces */}
          <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight leading-tight text-white drop-shadow-md">
            SALVÔ — Seu Guia Diário
          </h1>

          {/* 3. Texto */}
          <p className="text-slate-100 text-xs sm:text-sm font-medium leading-relaxed drop-shadow-xs">
            Descubra o comércio local, encontre ofertas, conecte-se com pessoas e acompanhe a cidade em tempo real.
          </p>

          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFC72C]/20 border border-[#FFC72C]/40 rounded-full text-[11px] font-bold text-[#FFC72C]">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Comércio, conexão e Salvador. Tudo em um só lugar.</span>
          </div>

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
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2">
              {/* Botão Primário: AMARELO CTA */}
              <button
                onClick={handleScrollToMap}
                className="w-full min-h-[44px] py-2.5 px-3 bg-[#FFC72C] active:bg-[#F0B719] text-[#0B3D91] rounded-2xl text-xs font-heading font-black tracking-wide flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#0B3D91] shrink-0" />
                <span className="whitespace-nowrap font-black">Explorar no Mapa</span>
              </button>

              {/* Segundo Botão: ACCENT-WARM (Terracota) */}
              <button
                onClick={handleGoToOffers}
                className="w-full min-h-[44px] py-2.5 px-3 bg-[#C1502E] active:bg-[#A33F22] text-white border border-[#C1502E] rounded-2xl text-xs font-heading font-bold tracking-wide flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-transform cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white shrink-0" />
                <span className="whitespace-nowrap font-bold">Ver Ofertas</span>
              </button>
            </div>

            {/* Botão Guia dos Bairros Mobile */}
            <button
              onClick={handleOpenNeighborhoodGuide}
              className="w-full min-h-[42px] py-2 px-3.5 bg-white/15 hover:bg-white/20 active:bg-white/25 backdrop-blur-md border border-white/25 rounded-2xl text-white text-xs font-bold flex items-center justify-between shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FFC72C] shrink-0" />
                <span className="font-heading font-bold">Explorar Bairros de Salvador</span>
              </div>
              <span className="text-[10px] font-black uppercase text-[#FFC72C] bg-black/20 px-2 py-0.5 rounded-lg border border-white/15">
                Guia Cultural →
              </span>
            </button>
          </div>

          {/* 6. Prévia Visual do Produto no Mobile (Mini-mapa e Card de Loja Real) */}
          <div className="space-y-2.5 pt-1">
            <HeroLiveMap
              stores={stores}
              onSelectStore={onSelectStore}
              onExploreClick={handleScrollToMap}
            />

            {realFeaturedStore ? (
              <div
                onClick={() => onSelectStore(realFeaturedStore)}
                className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-white flex items-center justify-between gap-3 active:scale-98 transition-transform cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={
                      realFeaturedStore.coverImage ||
                      realFeaturedStore.logo ||
                      (realFeaturedStore.galleryImages && realFeaturedStore.galleryImages[0]) ||
                      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80'
                    }
                    alt={realFeaturedStore.name}
                    className="w-10 h-10 rounded-xl object-cover border border-white/20 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="font-heading font-bold text-xs text-white truncate">
                        {realFeaturedStore.name}
                      </p>
                      <CheckCircle2 className="w-3 h-3 text-[#FFC72C] shrink-0" />
                    </div>
                    <p className="text-[10px] text-sky-200 truncate">
                      {realFeaturedStore.neighborhood} • ★ {realFeaturedStore.rating}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-[#FFC72C] text-[#0B3D91] text-[10px] font-black rounded-lg uppercase tracking-wider shrink-0">
                  Ver Loja
                </span>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center text-xs text-sky-200">
                Em breve: lojas em destaque
              </div>
            )}
          </div>
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
          onOpenNeighborhoodGuide={handleOpenNeighborhoodGuide}
          userLocation={userLocation}
          onUseLocation={onUseLocation}
          onSetManualNeighborhood={onSetManualNeighborhood}
          isLocating={isLocating}
          detectedNeighborhood={detectedGpsNeighborhood}
          gpsAccuracy={userLocation?.accuracy}
          proximityRadius={proximityRadius}
          setProximityRadius={setProximityRadius}
          sortByDistance={sortByDistance}
          setSortByDistance={setSortByDistance}
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
              favoriteStoreIds={favorites}
              onToggleFavorite={onToggleFavorite}
              targetNeighborhood={selectedNeighborhood !== 'Todos os Bairros' ? selectedNeighborhood : undefined}
            />


            {/* Banner Oficial SALVÓ Fé com leilão Fé Engine */}
            <SalvoFeAdBanner
              currentNeighborhood={selectedNeighborhood !== 'Todos os Bairros' ? selectedNeighborhood : 'Barra'}
              categoryInterest={selectedCategory !== 'Todas' ? selectedCategory : 'Geral'}
              className="mb-4"
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
                      : sortByDistance && userLocation
                      ? 'Ordenadas pela proximidade do seu GPS'
                      : proximityRadius
                      ? `Lojas no raio de ${proximityRadius / 1000} km do seu GPS`
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
                      userLocation={userLocation}
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
                  {sortByDistance && userLocation ? ' • Ordenadas por proximidade GPS' : ''}
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
                    userLocation={userLocation}
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
