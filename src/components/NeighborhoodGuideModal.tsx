import React, { useState, useMemo, useEffect } from 'react';
import { SalvadorNeighborhood, Store, NeighborhoodSpot, NeighborhoodGuideInfo } from '../types';
import {
  SALVADOR_NEIGHBORHOOD_GUIDE,
  SALVADOR_NEIGHBORHOODS,
  SALVADOR_MACRO_REGIONS,
  SALVADOR_NEIGHBORHOOD_MACRO_MAP,
  SalvadorMacroRegion,
} from '../data/mockData';
import {
  X,
  MapPin,
  Compass,
  ArrowRight,
  Search,
  Users,
  Maximize2,
  Calendar,
  Store as StoreIcon,
  Eye,
  Navigation,
  Camera,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  Info,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface NeighborhoodGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNeighborhood: (neighborhood: SalvadorNeighborhood) => void;
  stores: Store[];
}

interface StreetViewModalData {
  title: string;
  subtitle?: string;
  lat: number;
  lng: number;
}

export const NeighborhoodGuideModal: React.FC<NeighborhoodGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectNeighborhood,
  stores,
}) => {
  const [activeNeighborhoodKey, setActiveNeighborhoodKey] = useState<string>('Barra');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isHistoryExpanded, setIsHistoryExpanded] = useState<boolean>(false);
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({
    'Orla Atlântica': true,
    'Centro Histórico & Cidade Antiga': true,
    'Península Itapagipana & Cidade Baixa': true,
    'Brotas & Região Central': true,
    'Miolo & Cabula / Paralela': true,
    'Cajazeiras, Águas Claras & Castelo Branco': true,
    'Subúrbio Ferroviário & Ilhas': true,
    'Região Norte & Aeroporto / Ipitanga': true,
  });
  const [streetViewData, setStreetViewData] = useState<StreetViewModalData | null>(null);

  // Reset history expansion when neighborhood changes
  useEffect(() => {
    setIsHistoryExpanded(false);
  }, [activeNeighborhoodKey]);

  // Ensure the active neighborhood's macro region is expanded when modal opens or active changes
  useEffect(() => {
    const macroRegion =
      SALVADOR_NEIGHBORHOOD_GUIDE[activeNeighborhoodKey]?.macro_region ||
      SALVADOR_NEIGHBORHOOD_MACRO_MAP[activeNeighborhoodKey] ||
      'Orla Atlântica';
    setExpandedRegions((prev) => ({
      ...prev,
      [macroRegion]: true,
    }));
  }, [activeNeighborhoodKey]);

  // Normalize search helper
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  // Grouped neighborhoods calculation
  const groupedNeighborhoods = useMemo(() => {
    const query = normalize(searchTerm.trim());
    const groups: Record<SalvadorMacroRegion, string[]> = {
      'Orla Atlântica': [],
      'Centro Histórico & Cidade Antiga': [],
      'Península Itapagipana & Cidade Baixa': [],
      'Brotas & Região Central': [],
      'Miolo & Cabula / Paralela': [],
      'Cajazeiras, Águas Claras & Castelo Branco': [],
      'Subúrbio Ferroviário & Ilhas': [],
      'Região Norte & Aeroporto / Ipitanga': [],
    };

    SALVADOR_NEIGHBORHOODS.forEach((neighborhood) => {
      if (query && !normalize(neighborhood).includes(query)) {
        return;
      }
      const macro =
        SALVADOR_NEIGHBORHOOD_GUIDE[neighborhood]?.macro_region ||
        SALVADOR_NEIGHBORHOOD_MACRO_MAP[neighborhood] ||
        'Miolo & Cabula / Paralela';
      if (groups[macro as SalvadorMacroRegion]) {
        groups[macro as SalvadorMacroRegion].push(neighborhood);
      } else {
        groups['Miolo & Cabula / Paralela'].push(neighborhood);
      }
    });

    return groups;
  }, [searchTerm]);

  if (!isOpen) return null;

  const currentGuide: NeighborhoodGuideInfo = SALVADOR_NEIGHBORHOOD_GUIDE[activeNeighborhoodKey] || {
    tagline: 'Conheça o comércio local e a cultura deste tradicional bairro soteropolitano',
    description: 'Explore lojas, serviços, gastronomia e empreendimentos locais cadastrados no SALVÔ nesta região.',
    vibe: 'Bairro de Salvador',
    icon: '📍',
    color: '#0B4F8A',
    macro_region: SALVADOR_NEIGHBORHOOD_MACRO_MAP[activeNeighborhoodKey] || 'Bairro Salvador',
    coordinates: { lat: -12.9714, lng: -38.5014 },
  };

  const neighborhoodStores = stores.filter(
    (s) => s.neighborhood === (activeNeighborhoodKey as SalvadorNeighborhood) && s.approvalStatus !== 'rejected'
  );

  const coordinates = currentGuide.coordinates || { lat: -12.9714, lng: -38.5014 };

  const toggleRegion = (region: string) => {
    setExpandedRegions((prev) => ({
      ...prev,
      [region]: !prev[region],
    }));
  };

  // Content completeness check helper
  const checkContentStatus = (neighborhood: string) => {
    const guide = SALVADOR_NEIGHBORHOOD_GUIDE[neighborhood];
    if (!guide) return 'incomplete';
    const hasStats = guide.population !== undefined || guide.founding_year !== undefined;
    const hasHistory = !!guide.history_text;
    const hasImage = !!guide.bannerImage;
    if (hasStats && hasHistory && hasImage) return 'complete';
    if (hasStats || hasHistory || hasImage) return 'partial';
    return 'incomplete';
  };

  return (
    <div
      id="neighborhood-guide-modal-container"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn select-none"
    >
      <div
        id="neighborhood-guide-dialog"
        className="bg-white w-full max-w-5xl h-[92vh] max-h-[850px] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative"
      >
        {/* Modal Top Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#0B4F8A] via-[#083b66] to-[#052949] text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFC72C] text-[#0B4F8A] flex items-center justify-center text-xl font-black shadow-md shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-wider text-white">
                  Guia Cultural de Salvador
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-[#FFC72C]/20 text-[#FFC72C] rounded-full text-[10px] font-bold">
                  <Sparkles className="w-3 h-3" /> Polos Comerciais
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-heading font-black text-white leading-tight">
                Bairros & Polos Comerciais
              </h2>
            </div>
          </div>
          <button
            id="close-neighborhood-guide-btn"
            onClick={onClose}
            aria-label="Fechar modal"
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Sidebar (Left) + Detail Panel (Right) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          
          {/* Left Sidebar: Neighborhood Selection with Macro-Regions & Search */}
          <div className="md:col-span-4 flex flex-col bg-slate-50/90 h-full overflow-hidden">
            {/* Search Input Box */}
            <div className="p-3.5 border-b border-slate-200 bg-white/80 backdrop-blur-xs shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="neighborhood-search-input"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar bairro de Salvador..."
                  className="w-full pl-9 pr-8 py-2 bg-slate-100/90 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0B4F8A]/30 focus:border-[#0B4F8A] transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-400 font-medium">
                <span className="font-bold text-slate-500">
                  {searchTerm ? 'Resultados filtrados' : 'Macrorregiões de Salvador'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Completo
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Em atualização
                  </span>
                </div>
              </div>
            </div>

            {/* Collapsible Macro-Region Neighborhood List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {SALVADOR_MACRO_REGIONS.map((region) => {
                const list = groupedNeighborhoods[region] || [];
                if (list.length === 0 && searchTerm) return null;
                const isExpanded = !!expandedRegions[region] || !!searchTerm;

                return (
                  <div key={region} className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                    <button
                      id={`macro-region-toggle-${region.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => toggleRegion(region)}
                      className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span className="font-heading font-black text-xs text-slate-800 truncate">
                          {region}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                        {list.length}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="p-1.5 pt-0 space-y-1 divide-y divide-slate-50">
                        {list.map((neighborhood) => {
                          const guide = SALVADOR_NEIGHBORHOOD_GUIDE[neighborhood];
                          const isSelected = activeNeighborhoodKey === neighborhood;
                          const storeCount = stores.filter((s) => s.neighborhood === neighborhood).length;
                          const status = checkContentStatus(neighborhood);

                          return (
                            <button
                              key={neighborhood}
                              id={`neighborhood-item-${neighborhood.replace(/[\s/]+/g, '-').toLowerCase()}`}
                              onClick={() => setActiveNeighborhoodKey(neighborhood)}
                              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                                isSelected
                                  ? 'bg-[#0B4F8A] text-white shadow-sm font-bold scale-[1.01]'
                                  : 'hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0 pr-1">
                                <span className="text-base shrink-0">{guide?.icon || '📍'}</span>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <p
                                      className={`font-heading font-bold text-xs truncate leading-tight ${
                                        isSelected ? 'text-white' : 'text-slate-900'
                                      }`}
                                    >
                                      {neighborhood}
                                    </p>
                                    <span
                                      title={status === 'complete' ? 'Conteúdo completo' : 'Dados em atualização'}
                                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                        status === 'complete' ? 'bg-emerald-400' : 'bg-amber-400'
                                      }`}
                                    />
                                  </div>
                                  <p
                                    className={`text-[10px] truncate ${
                                      isSelected ? 'text-white/80' : 'text-slate-400'
                                    }`}
                                  >
                                    {guide?.vibe || 'Bairro Salvador'}
                                  </p>
                                </div>
                              </div>

                              {storeCount > 0 && (
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                                    isSelected
                                      ? 'bg-white/20 text-[#FFC72C]'
                                      : 'bg-[#0B4F8A]/10 text-[#0B4F8A]'
                                  }`}
                                >
                                  {storeCount}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Detail Panel: Banner, Stats Grid, Street View & Map Actions, History & Spots */}
          <div className="md:col-span-8 h-full overflow-y-auto p-4 sm:p-6 space-y-6 bg-white">
            
            {/* 1. Header Banner (~180px height, full panel width, overlaid with dark gradient) */}
            <div
              id="neighborhood-cover-banner"
              className="w-full h-[180px] rounded-3xl overflow-hidden relative shadow-md flex flex-col justify-end p-5 text-white"
            >
              {currentGuide.bannerImage ? (
                <img
                  src={currentGuide.bannerImage}
                  alt={`Bairro ${activeNeighborhoodKey} Salvador`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                /* Neutral brand gradient when no image exists in database - never generic fake placeholder */
                <div
                  className="absolute inset-0 bg-gradient-to-r from-[#0B4F8A] via-[#083b66] to-[#041e34]"
                  style={{
                    backgroundColor: currentGuide.color || '#0B4F8A',
                  }}
                />
              )}

              {/* Dark gradient overlay for pristine typography legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

              {/* Banner content */}
              <div className="relative z-10 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-black uppercase tracking-wider text-white border border-white/20">
                    {currentGuide.vibe}
                  </span>
                  {currentGuide.macro_region && (
                    <span className="px-2.5 py-0.5 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-semibold text-slate-200 border border-white/10">
                      📍 {currentGuide.macro_region}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight drop-shadow-sm">
                    {activeNeighborhoodKey}
                  </h3>
                  <span className="text-xl">{currentGuide.icon}</span>
                </div>

                <p className="text-white/95 text-xs sm:text-sm font-medium italic drop-shadow-xs line-clamp-1">
                  "{currentGuide.tagline}"
                </p>
              </div>
            </div>

            {/* 2. Statistical Metrics Bar (4-column grid: Population, Area, Year, Registered Stores) */}
            <div
              id="neighborhood-stats-bar"
              className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-2xs"
            >
              {/* Stat 1: População */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/70 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Users className="w-3.5 h-3.5 text-[#0B4F8A]" />
                  <span className="text-[10px] font-black uppercase tracking-wider">População</span>
                </div>
                <p className="font-heading font-black text-sm sm:text-base text-slate-900 leading-none truncate">
                  {currentGuide.population
                    ? currentGuide.population.toLocaleString('pt-BR')
                    : 'Em atualização'}
                </p>
              </div>

              {/* Stat 2: Área */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/70 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Maximize2 className="w-3.5 h-3.5 text-[#E8552B]" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Área</span>
                </div>
                <p className="font-heading font-black text-sm sm:text-base text-slate-900 leading-none truncate">
                  {currentGuide.area_km2 || 'Em atualização'}
                </p>
              </div>

              {/* Stat 3: Fundação / Origem */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/70 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-[#FFC72C]" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Origem / Fundação</span>
                </div>
                <p className="font-heading font-black text-sm sm:text-base text-slate-900 leading-none truncate">
                  {currentGuide.founding_year ? `Ano ${currentGuide.founding_year}` : 'Em atualização'}
                </p>
              </div>

              {/* Stat 4: Comércios no SALVÔ */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/70 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <StoreIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[10px] font-black uppercase tracking-wider">No SALVÔ</span>
                </div>
                <p className="font-heading font-black text-sm sm:text-base text-emerald-700 leading-none truncate">
                  {neighborhoodStores.length}{' '}
                  <span className="text-xs font-semibold text-slate-500">
                    {neighborhoodStores.length === 1 ? 'loja' : 'lojas'}
                  </span>
                </p>
              </div>
            </div>

            {/* 3. Action Block: "Ver a Rua" (Street View & Map Buttons side-by-side) */}
            <div
              id="neighborhood-street-view-actions"
              className="p-4 bg-gradient-to-r from-slate-900 to-[#0B4F8A] rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md"
            >
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <Eye className="w-4 h-4 text-[#FFC72C]" />
                  <h4 className="font-heading font-black text-sm text-white">
                    Explore a Região em 360°
                  </h4>
                </div>
                <p className="text-xs text-white/80">
                  Navegue pelas ruas e descubra a atmosfera de {activeNeighborhoodKey}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  id="open-neighborhood-street-view-btn"
                  onClick={() => {
                    setStreetViewData({
                      title: `Bairro ${activeNeighborhoodKey}`,
                      subtitle: currentGuide.tagline,
                      lat: coordinates.lat,
                      lng: coordinates.lng,
                    });
                  }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFC72C] hover:bg-[#f5bc20] text-[#0B4F8A] font-heading font-black rounded-xl text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver no Street View</span>
                </button>

                <button
                  id="open-neighborhood-map-view-btn"
                  onClick={() => {
                    onSelectNeighborhood(activeNeighborhoodKey as SalvadorNeighborhood);
                    onClose();
                  }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/20 transition-all active:scale-95 cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Ver no Mapa</span>
                </button>
              </div>
            </div>

            {/* 4. Section "Sobre a Região" with Expandable History */}
            <div id="neighborhood-about-section" className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#0B4F8A]" />
                  Sobre a Região
                </h4>
                {currentGuide.macro_region && (
                  <span className="text-[11px] font-bold text-slate-400">
                    Região: {currentGuide.macro_region}
                  </span>
                )}
              </div>

              {/* Short description */}
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                {currentGuide.description}
              </p>

              {/* Expandable "Um pouco de história" */}
              <div className="pt-3 border-t border-slate-200/80">
                <div className="flex items-center justify-between mb-1.5">
                  <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#E8552B]" />
                    Um Pouco de História
                  </h5>
                </div>

                {currentGuide.history_text ? (
                  <div>
                    <p
                      className={`text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal transition-all ${
                        isHistoryExpanded ? '' : 'line-clamp-4'
                      }`}
                    >
                      {currentGuide.history_text}
                    </p>
                    <button
                      id="toggle-neighborhood-history-btn"
                      onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                      className="mt-2 text-xs font-bold text-[#0B4F8A] hover:text-[#083b66] inline-flex items-center gap-1 underline transition-colors cursor-pointer"
                    >
                      <span>{isHistoryExpanded ? 'Ler menos' : 'Ler mais sobre a história'}</span>
                      {isHistoryExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Dados históricos deste bairro em processo de catalogação pelo Guia SALVÔ.
                  </p>
                )}
              </div>
            </div>

            {/* 5. Section "Pontos Emblemáticos & Roteiros" (Thumbnail photo + Camera 360 icon) */}
            {currentGuide.bestSpots && currentGuide.bestSpots.length > 0 && (
              <div id="neighborhood-famous-spots" className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E8552B]" />
                    Pontos Emblemáticos & Roteiros
                  </h4>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    {currentGuide.bestSpots.length} destaques
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentGuide.bestSpots.map((spotItem, i) => {
                    const isObject = typeof spotItem === 'object' && spotItem !== null;
                    const spotName = isObject ? (spotItem as NeighborhoodSpot).name : (spotItem as string);
                    const spotPhoto = isObject ? (spotItem as NeighborhoodSpot).photo : undefined;
                    const spotDesc = isObject ? (spotItem as NeighborhoodSpot).description : undefined;
                    const spotCoords = isObject
                      ? (spotItem as NeighborhoodSpot).coordinates || coordinates
                      : coordinates;

                    return (
                      <div
                        key={i}
                        className="group p-2.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-[#0B4F8A]/40 transition-all flex items-center justify-between gap-2.5"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Photo Thumbnail (44-48px with rounded borders) */}
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                            {spotPhoto ? (
                              <img
                                src={spotPhoto}
                                alt={spotName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                                <MapPin className="w-4 h-4 text-[#E8552B]" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <h5 className="font-heading font-bold text-xs text-slate-900 truncate">
                              {spotName}
                            </h5>
                            {spotDesc ? (
                              <p className="text-[10px] text-slate-500 line-clamp-1">
                                {spotDesc}
                              </p>
                            ) : (
                              <p className="text-[10px] text-slate-400">
                                Ponto de interesse turístico
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Camera Street View Trigger Button */}
                        <button
                          id={`spot-street-view-btn-${i}`}
                          onClick={() => {
                            setStreetViewData({
                              title: spotName,
                              subtitle: `Localizado em ${activeNeighborhoodKey}, Salvador`,
                              lat: spotCoords.lat,
                              lng: spotCoords.lng,
                            });
                          }}
                          title={`Ver ${spotName} no Street View 360°`}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-[#0B4F8A] text-slate-600 hover:text-white transition-all shrink-0 active:scale-95 cursor-pointer shadow-2xs"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. Section "Comércios Cadastrados no Bairro" */}
            <div id="neighborhood-stores-list-section" className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <StoreIcon className="w-3.5 h-3.5 text-[#0B4F8A]" />
                    Comércios no SALVÔ ({neighborhoodStores.length})
                  </h4>
                  <p className="text-xs text-slate-500 font-semibold">
                    Lojas, serviços e restaurantes em {activeNeighborhoodKey}
                  </p>
                </div>

                <button
                  id="explore-neighborhood-stores-map-btn"
                  onClick={() => {
                    onSelectNeighborhood(activeNeighborhoodKey as SalvadorNeighborhood);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-3.5 py-1.5 bg-[#0B4F8A] hover:bg-[#083b66] text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <span>Ver Lojas no Mapa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {neighborhoodStores.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {neighborhoodStores.map((store) => (
                    <div
                      key={store.id}
                      className="p-3 bg-white rounded-2xl border border-slate-200/80 flex items-center gap-3 hover:border-[#0B4F8A] transition-all shadow-2xs"
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
                          <span className="text-[10px] font-bold text-[#FFC72C]">
                            ★ {store.rating}
                          </span>
                          {store.offers && store.offers.length > 0 && (
                            <span className="text-[9px] bg-red-100 text-[#E8552B] font-black px-1.5 py-0.5 rounded-md">
                              {store.offers[0].discountBadge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-5 bg-slate-50 rounded-2xl text-center border border-dashed border-slate-200">
                  <p className="text-xs text-slate-600 font-bold mb-1">
                    Ainda não há comércios cadastrados em {activeNeighborhoodKey}.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Se você é lojista neste bairro, cadastre seu negócio no SALVÔ por apenas R$ 12,00/mês!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
            SALVÔ • Guia Oficial e Cultural do Comércio de Salvador.
          </span>
          <button
            id="view-all-neighborhood-stores-btn"
            onClick={() => {
              onSelectNeighborhood(activeNeighborhoodKey as SalvadorNeighborhood);
              onClose();
            }}
            className="px-5 py-2.5 bg-[#FFC72C] hover:bg-[#f5bc20] text-[#0B4F8A] font-heading font-black rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Ver Todas as Lojas de {activeNeighborhoodKey}
          </button>
        </div>

        {/* Secondary Modal: Google Street View Embed Viewer */}
        {streetViewData && (
          <div
            id="street-view-secondary-modal"
            className="fixed inset-0 z-60 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          >
            <div className="bg-slate-900 w-full max-w-4xl h-[85vh] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col">
              {/* Street View Modal Top Bar */}
              <div className="px-5 py-3.5 bg-slate-900/90 border-b border-white/10 flex items-center justify-between text-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#FFC72C] text-[#0B4F8A] font-bold">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-sm text-white leading-tight">
                      {streetViewData.title}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {streetViewData.subtitle || 'Street View 360° interativo'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${streetViewData.lat},${streetViewData.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <span>Abrir no Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    id="close-street-view-secondary-modal"
                    onClick={() => setStreetViewData(null)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Street View Iframe Player */}
              <div className="flex-1 bg-black relative">
                <iframe
                  title={`Street View de ${streetViewData.title}`}
                  src={`https://maps.google.com/maps?layer=c&cbll=${streetViewData.lat},${streetViewData.lng}&cbp=11,120,0,0,0&output=svembed`}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              {/* Street View Modal Bottom Controls */}
              <div className="p-3 bg-slate-900 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>Salvador, Bahia • Coordenadas: {streetViewData.lat.toFixed(4)}, {streetViewData.lng.toFixed(4)}</span>
                <button
                  onClick={() => setStreetViewData(null)}
                  className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Fechar Street View
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
