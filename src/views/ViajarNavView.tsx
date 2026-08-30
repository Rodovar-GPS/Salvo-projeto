// ==============================================================================
// 🚗 SALVÓ VIAJAR — MÓDULO DE NAVEGAÇÃO GPS PROFISSIONAL & DESCOBERTA LOCAL
// Estilo Uber / 99 com Roteirização em Tempo Real, Modo Offline e Assistente NLP
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Navigation,
  Compass,
  MapPin,
  Clock,
  ArrowRight,
  CornerUpRight,
  CornerUpLeft,
  ArrowUp,
  RotateCw,
  Fuel,
  ShoppingBag,
  Croissant,
  Pill,
  Hospital,
  Landmark,
  Utensils,
  Store,
  Wrench,
  Search,
  Mic,
  Volume2,
  VolumeX,
  Download,
  Wifi,
  WifiOff,
  Sparkles,
  ChevronUp,
  ChevronDown,
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Phone,
  MessageCircle,
  ExternalLink,
  Layers,
  AlertTriangle,
  Info,
} from 'lucide-react';
import {
  SalvadorPoi,
  SALVADOR_POIS_DATA,
  searchPoisByRadius,
  POI_CATEGORIES_METADATA,
  SalvadorPoiCategory,
} from '../data/salvadorPoisDatabase';
import {
  calculateSmartRoute,
  calculateBearing,
  speakNavInstruction,
  processNaturalLanguageLocationQuery,
  NavigationRouteData,
  TurnManeuver,
  NlpAssistantResponse,
} from '../services/salvadorNavEngine';
import {
  offlineStorageService,
  SALVADOR_OFFLINE_PACKAGES,
  OfflineMapPackage,
} from '../services/salvadorOfflineStorage';

interface ViajarNavViewProps {
  userLocation: { lat: number; lng: number } | null;
  onOpenChatWithStore?: (store: any) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const ViajarNavView: React.FC<ViajarNavViewProps> = ({
  userLocation,
  onOpenChatWithStore,
  onNavigateToTab,
}) => {
  // Posição base (Farol da Barra como padrão soteropolitano)
  const defaultLocation = { lat: -13.0039, lng: -38.5326 };
  const currentCoords = userLocation || defaultLocation;

  // Estados de Conexão & Modo Offline
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlinePackages, setOfflinePackages] = useState<OfflineMapPackage[]>(SALVADOR_OFFLINE_PACKAGES);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState<boolean>(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);

  // Estados da Rota Ativa & Navegação Estilo Uber/99
  const [activeRoute, setActiveRoute] = useState<NavigationRouteData | null>(null);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [vehiclePosition, setVehiclePosition] = useState<{ lat: number; lng: number }>(currentCoords);
  const [vehicleHeading, setVehicleHeading] = useState<number>(0);
  const [vehicleSpeed, setVehicleSpeed] = useState<number>(0);
  const [simulationSpeedMultiplier, setSimulationSpeedMultiplier] = useState<number>(1);
  const [isSimulationPaused, setIsSimulationPaused] = useState<boolean>(false);
  const [routeProgressPercent, setRouteProgressPercent] = useState<number>(0);

  // Estados de Busca & Assistente NLP
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<SalvadorPoiCategory | 'todas'>('todas');
  const [assistantResponse, setAssistantResponse] = useState<NlpAssistantResponse | null>(null);
  const [isAssistantDrawerOpen, setIsAssistantDrawerOpen] = useState<boolean>(false);

  // Detalhe do POI Selecionado
  const [selectedPoi, setSelectedPoi] = useState<SalvadorPoi | null>(null);

  // Referência do container do mapa e Leaflet
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const polylineLayerRef = useRef<any>(null);
  const vehicleMarkerRef = useRef<any>(null);
  const destinationMarkerRef = useRef<any>(null);
  const poiMarkersLayerRef = useRef<any>(null);
  const simulationIntervalRef = useRef<any>(null);

  // 1. Monitoramento de Conexão Online / Offline
  useEffect(() => {
    setIsOnline(offlineStorageService.getOnlineStatus());
    const unsub = offlineStorageService.onConnectionChange((online) => {
      setIsOnline(online);
    });
    return () => unsub();
  }, []);

  // 2. Inicialização do Mapa Leaflet
  useEffect(() => {
    let mapInstance: any = null;

    async function initMap() {
      if (!mapContainerRef.current) return;

      // Import dinâmico do Leaflet
      const L = await import('leaflet');

      if (!mapContainerRef.current) return;

      // Limpar mapa anterior se houver
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }

      mapInstance = L.map(mapContainerRef.current, {
        center: [currentCoords.lat, currentCoords.lng],
        zoom: 15,
        zoomControl: false,
      });

      // Tile layer CartoDB Positron / OSM
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }).addTo(mapInstance);

      // Camada de POIs
      const poiLayer = L.layerGroup().addTo(mapInstance);
      poiMarkersLayerRef.current = poiLayer;

      leafletMapRef.current = mapInstance;

      // Renderizar POIs no mapa
      renderPoiMarkers(L, mapInstance, poiLayer);
    }

    initMap();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // 3. Renderizar Marcadores de POIs no Mapa
  const renderPoiMarkers = (L: any, map: any, layer: any) => {
    if (!layer) return;
    layer.clearLayers();

    const pois = searchPoisByRadius(
      currentCoords.lat,
      currentCoords.lng,
      12,
      selectedCategory === 'todas' ? undefined : selectedCategory
    );

    pois.forEach((poi) => {
      const meta = POI_CATEGORIES_METADATA[poi.category];
      const color = meta?.color || '#0B3D91';

      // Custom HTML Pin
      const iconHtml = `
        <div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 13px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 2px solid white;
          cursor: pointer;
          transition: transform 0.2s;
        ">
          📍
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'salvo-poi-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([poi.lat, poi.lng], { icon: customIcon });
      marker.on('click', () => {
        setSelectedPoi(poi);
        map.setView([poi.lat, poi.lng], 16, { animate: true });
      });

      layer.addLayer(marker);
    });
  };

  // Atualizar POIs quando a categoria muda
  useEffect(() => {
    if (leafletMapRef.current && poiMarkersLayerRef.current) {
      import('leaflet').then((L) => {
        renderPoiMarkers(L, leafletMapRef.current, poiMarkersLayerRef.current);
      });
    }
  }, [selectedCategory]);

  // 4. Iniciar Navegação GPS para um Destino
  const handleStartRouteToPoi = async (poi: SalvadorPoi) => {
    setSelectedPoi(poi);
    const route = await calculateSmartRoute(
      { lat: currentCoords.lat, lng: currentCoords.lng, name: 'Minha Posição' },
      { lat: poi.lat, lng: poi.lng, name: poi.name },
      poi
    );

    setActiveRoute(route);
    setIsNavigating(true);
    setCurrentStepIndex(0);
    setVehiclePosition(route.polyline[0] ? { lat: route.polyline[0][0], lng: route.polyline[0][1] } : currentCoords);
    setVehicleSpeed(35);
    setRouteProgressPercent(0);

    // Desenhar Rota no Mapa Leaflet
    if (leafletMapRef.current) {
      const L = await import('leaflet');

      if (polylineLayerRef.current) {
        leafletMapRef.current.removeLayer(polylineLayerRef.current);
      }
      if (destinationMarkerRef.current) {
        leafletMapRef.current.removeLayer(destinationMarkerRef.current);
      }

      // Polyline Azul de Navegação com borda brilhante
      const poly = L.polyline(route.polyline, {
        color: '#0B4F8A',
        weight: 7,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(leafletMapRef.current);

      polylineLayerRef.current = poly;

      // Marcador de Destino com Bandeira de Chegada
      const destIcon = L.divIcon({
        html: `
          <div style="
            background: #DC2626;
            color: white;
            padding: 6px 10px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 4px;
            box-shadow: 0 4px 14px rgba(220,38,38,0.4);
            border: 2px solid white;
            white-space: nowrap;
          ">
            🏁 ${poi.name.slice(0, 18)}...
          </div>
        `,
        className: 'dest-marker',
        iconAnchor: [30, 20],
      });

      destinationMarkerRef.current = L.marker([poi.lat, poi.lng], { icon: destIcon }).addTo(
        leafletMapRef.current
      );

      // Criar ou atualizar Marcador do Veículo / Carro com orientação
      updateVehicleMarkerOnMap(L, route.polyline[0][0], route.polyline[0][1], 0);

      // Ajustar visualização do mapa para caber a rota inteira
      leafletMapRef.current.fitBounds(poly.getBounds(), { padding: [60, 60] });
    }

    // Falar primeira instrução por voz
    if (isVoiceEnabled && route.maneuvers.length > 0) {
      speakNavInstruction(route.maneuvers[0].instruction);
    }
  };

  // 5. Atualizar Marcador do Veículo no Mapa com Direção (Heading)
  const updateVehicleMarkerOnMap = (L: any, lat: number, lng: number, heading: number) => {
    if (!leafletMapRef.current) return;

    const carHtml = `
      <div style="
        transform: rotate(${heading}deg);
        transition: transform 0.3s ease-out;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          background: #0B4F8A;
          color: white;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 6px 16px rgba(11,79,138,0.5);
          position: relative;
        ">
          🚗
          <div style="
            position: absolute;
            top: -6px;
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 7px solid #F59E0B;
          "></div>
        </div>
      </div>
    `;

    const carIcon = L.divIcon({
      html: carHtml,
      className: 'vehicle-marker',
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    if (vehicleMarkerRef.current) {
      vehicleMarkerRef.current.setLatLng([lat, lng]);
      vehicleMarkerRef.current.setIcon(carIcon);
    } else {
      vehicleMarkerRef.current = L.marker([lat, lng], { icon: carIcon, zIndexOffset: 1000 }).addTo(
        leafletMapRef.current
      );
    }
  };

  // 6. Simulação de Movimento GPS em Tempo Real (Uber/99 Simulator)
  useEffect(() => {
    if (!isNavigating || !activeRoute || isSimulationPaused) {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
      return;
    }

    const poly = activeRoute.polyline;
    if (poly.length < 2) return;

    let currentIndex = 0;
    const totalPoints = poly.length;

    simulationIntervalRef.current = setInterval(async () => {
      if (currentIndex >= totalPoints - 1) {
        // Chegou ao destino
        clearInterval(simulationIntervalRef.current);
        setVehicleSpeed(0);
        setRouteProgressPercent(100);
        setCurrentStepIndex(activeRoute.maneuvers.length - 1);
        if (isVoiceEnabled) {
          speakNavInstruction(`Você chegou ao seu destino: ${activeRoute.destinationName}`);
        }
        return;
      }

      currentIndex += 1;
      const currentPoint = poly[currentIndex];
      const nextPoint = poly[Math.min(currentIndex + 1, totalPoints - 1)];

      const heading = calculateBearing(
        currentPoint[0],
        currentPoint[1],
        nextPoint[0],
        nextPoint[1]
      );

      const dynamicSpeed = Math.floor(38 + Math.sin(currentIndex) * 12);
      setVehicleSpeed(dynamicSpeed);
      setVehiclePosition({ lat: currentPoint[0], lng: currentPoint[1] });
      setVehicleHeading(heading);

      const progress = Math.round((currentIndex / (totalPoints - 1)) * 100);
      setRouteProgressPercent(progress);

      // Calcular qual manobra está ativa
      const stepIdx = Math.min(
        Math.floor((currentIndex / totalPoints) * activeRoute.maneuvers.length),
        activeRoute.maneuvers.length - 1
      );

      if (stepIdx !== currentStepIndex) {
        setCurrentStepIndex(stepIdx);
        if (isVoiceEnabled && activeRoute.maneuvers[stepIdx]) {
          speakNavInstruction(activeRoute.maneuvers[stepIdx].instruction);
        }
      }

      // Atualizar no mapa
      const L = await import('leaflet');
      updateVehicleMarkerOnMap(L, currentPoint[0], currentPoint[1], heading);

      if (leafletMapRef.current) {
        leafletMapRef.current.panTo([currentPoint[0], currentPoint[1]], {
          animate: true,
          duration: 0.5,
        });
      }

      // Gravar telemetria offline/online
      offlineStorageService.queueOfflineTelemetry({
        routeId: activeRoute.id,
        lat: currentPoint[0],
        lng: currentPoint[1],
        speedKmh: dynamicSpeed,
        heading,
        timestamp: Date.now(),
      });
    }, 1200 / simulationSpeedMultiplier);

    return () => {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    };
  }, [isNavigating, activeRoute, isSimulationPaused, simulationSpeedMultiplier]);

  // 7. Processar Pergunta em Linguagem Natural do Assistente
  const handleExecuteAssistantQuery = (textToQuery?: string) => {
    const term = textToQuery || searchQuery;
    if (!term.trim()) return;

    setIsSearching(true);
    const response = processNaturalLanguageLocationQuery(term, currentCoords);
    setAssistantResponse(response);
    setIsAssistantDrawerOpen(true);
    setIsSearching(false);

    if (isVoiceEnabled && response.speechText) {
      speakNavInstruction(response.speechText);
    }
  };

  // 8. Download de Pacote Offline
  const handleDownloadPackage = async (pkg: OfflineMapPackage) => {
    setOfflinePackages((prev) =>
      prev.map((p) => (p.id === pkg.id ? { ...p, downloadProgress: 10 } : p))
    );

    await offlineStorageService.downloadPackage(pkg.id, (progress) => {
      setOfflinePackages((prev) =>
        prev.map((p) =>
          p.id === pkg.id
            ? {
                ...p,
                downloadProgress: progress,
                isDownloaded: progress >= 100,
                downloadedAt: progress >= 100 ? 'Agora mesmo' : undefined,
              }
            : p
        )
      );
    });
  };

  // Ícone de Manobra para o HUD Superior
  const getManeuverIcon = (type: TurnManeuver['type']) => {
    switch (type) {
      case 'turn-right':
        return <CornerUpRight className="w-8 h-8 text-amber-300" />;
      case 'turn-left':
        return <CornerUpLeft className="w-8 h-8 text-amber-300" />;
      case 'roundabout':
        return <RotateCw className="w-8 h-8 text-amber-300" />;
      case 'arrive':
        return <CheckCircle2 className="w-8 h-8 text-emerald-400" />;
      default:
        return <ArrowUp className="w-8 h-8 text-amber-300" />;
    }
  };

  const currentManeuver = activeRoute?.maneuvers[currentStepIndex] || null;

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-slate-900 flex flex-col font-sans select-none">
      {/* ========================================================================= */}
      {/* 1. MAPA INTERATIVO LEAFLET COM POIs E VEÍCULO */}
      {/* ========================================================================= */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0 w-full h-full bg-slate-100" />

      {/* ========================================================================= */}
      {/* 2. BARRA SUPERIOR DE STATUS DE REDE & BUSCA INTELIGENTE */}
      {/* ========================================================================= */}
      <div className="relative z-10 p-3 flex flex-col gap-2 max-w-2xl mx-auto w-full pointer-events-none">
        {/* Badge de Conexão Rotoma & Áudio */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div
            onClick={() => setIsOfflineModalOpen(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-md cursor-pointer transition-all ${
              isOnline
                ? 'bg-emerald-600/90 text-white hover:bg-emerald-700'
                : 'bg-amber-500 text-slate-900 hover:bg-amber-600 animate-pulse'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? 'GPS Conectado (Online)' : 'Modo Offline (Rotoma Ativo)'}</span>
            <span className="text-[10px] opacity-80 underline">Mapas Offline</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const next = !isVoiceEnabled;
                setIsVoiceEnabled(next);
                if (next) speakNavInstruction('Voz de navegação ativada.');
              }}
              className={`p-2 rounded-full shadow-md transition-colors pointer-events-auto ${
                isVoiceEnabled ? 'bg-white text-[#0B4F8A]' : 'bg-slate-800 text-slate-400'
              }`}
              title="Voz de Navegação"
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsOfflineModalOpen(true)}
              className="p-2 rounded-full bg-white text-slate-700 shadow-md hover:bg-slate-50 transition-colors pointer-events-auto"
              title="Pacotes de Mapas de Salvador"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* HUD Superior de Instrução de Navegação (Estilo Uber/99) */}
        {isNavigating && currentManeuver && (
          <div className="bg-[#0B3D91] text-white p-4 rounded-2xl shadow-2xl border border-white/20 flex items-center justify-between gap-4 pointer-events-auto animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                {getManeuverIcon(currentManeuver.type)}
              </div>
              <div>
                <div className="text-xs font-semibold text-amber-300 tracking-wider uppercase">
                  {currentManeuver.type === 'arrive'
                    ? 'Chegada ao Destino'
                    : `Em ${currentManeuver.distanceMeters} metros`}
                </div>
                <div className="text-base font-bold leading-snug line-clamp-1">
                  {currentManeuver.instruction}
                </div>
                <div className="text-xs text-blue-200">{currentManeuver.streetName}</div>
              </div>
            </div>

            <button
              onClick={() => {
                if (isVoiceEnabled) speakNavInstruction(currentManeuver.instruction);
              }}
              className="p-2 rounded-lg bg-white/15 hover:bg-white/25 transition-colors shrink-0"
              title="Repetir Instrução por Voz"
            >
              <Volume2 className="w-5 h-5 text-white" />
            </button>
          </div>
        )}

        {/* Barra de Pergunta ao Assistente de Localização (Quando não navegando) */}
        {!isNavigating && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-2 border border-slate-200/80 flex items-center gap-2 pointer-events-auto">
            <div className="p-2 text-[#0B4F8A]">
              <Sparkles className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExecuteAssistantQuery()}
              placeholder="O que você procura em Salvador? (Ex: posto, shopping, padaria...)"
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => handleExecuteAssistantQuery()}
              disabled={isSearching}
              className="bg-[#0B4F8A] hover:bg-[#083a66] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Buscar</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. FILTROS RÁPIDOS DE CATEGORIAS (POSTOS, SHOPPINGS, PADARIAS...) */}
      {/* ========================================================================= */}
      {!isNavigating && (
        <div className="relative z-10 px-3 py-1 overflow-x-auto no-scrollbar flex items-center gap-2 max-w-3xl mx-auto w-full pointer-events-auto">
          <button
            onClick={() => setSelectedCategory('todas')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
              selectedCategory === 'todas'
                ? 'bg-[#0B4F8A] text-white'
                : 'bg-white/90 text-slate-700 hover:bg-white'
            }`}
          >
            🌟 Todos os Locais
          </button>
          <button
            onClick={() => setSelectedCategory('posto_combustivel')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-xs flex items-center gap-1.5 ${
              selectedCategory === 'posto_combustivel'
                ? 'bg-amber-600 text-white'
                : 'bg-white/90 text-slate-700 hover:bg-white'
            }`}
          >
            <Fuel className="w-3.5 h-3.5 text-amber-600" />
            <span>Postos & GNV</span>
          </button>
          <button
            onClick={() => setSelectedCategory('shopping')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-xs flex items-center gap-1.5 ${
              selectedCategory === 'shopping'
                ? 'bg-blue-600 text-white'
                : 'bg-white/90 text-slate-700 hover:bg-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
            <span>Shoppings</span>
          </button>
          <button
            onClick={() => setSelectedCategory('padaria')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-xs flex items-center gap-1.5 ${
              selectedCategory === 'padaria'
                ? 'bg-amber-700 text-white'
                : 'bg-white/90 text-slate-700 hover:bg-white'
            }`}
          >
            <Croissant className="w-3.5 h-3.5 text-amber-700" />
            <span>Padarias</span>
          </button>
          <button
            onClick={() => setSelectedCategory('farmacia')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-xs flex items-center gap-1.5 ${
              selectedCategory === 'farmacia'
                ? 'bg-red-600 text-white'
                : 'bg-white/90 text-slate-700 hover:bg-white'
            }`}
          >
            <Pill className="w-3.5 h-3.5 text-red-600" />
            <span>Farmácias 24h</span>
          </button>
          <button
            onClick={() => setSelectedCategory('ponto_turistico')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-xs flex items-center gap-1.5 ${
              selectedCategory === 'ponto_turistico'
                ? 'bg-emerald-600 text-white'
                : 'bg-white/90 text-slate-700 hover:bg-white'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pontos Turísticos</span>
          </button>
          <button
            onClick={() => setSelectedCategory('restaurante')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-xs flex items-center gap-1.5 ${
              selectedCategory === 'restaurante'
                ? 'bg-orange-600 text-white'
                : 'bg-white/90 text-slate-700 hover:bg-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-orange-600" />
            <span>Acarajé & Restaurantes</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PAINEL INFERIOR HUD NAVEGAÇÃO / TELEMETRIA (ESTILO UBER / 99) */}
      {/* ========================================================================= */}
      {isNavigating && activeRoute && (
        <div className="relative z-10 mt-auto p-4 max-w-2xl mx-auto w-full pointer-events-auto">
          <div className="bg-slate-900/95 backdrop-blur-xl text-white rounded-3xl p-5 shadow-2xl border border-slate-700/80 flex flex-col gap-4 animate-in slide-in-from-bottom-6 duration-300">
            {/* Barra de Progresso da Rota */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${routeProgressPercent}%` }}
              />
            </div>

            {/* Métricas Principais: Velocímetro, Distância Restante, Horário Previsto */}
            <div className="grid grid-cols-3 gap-2 items-center text-center">
              {/* Velocímetro */}
              <div className="flex flex-col items-center bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700">
                <span className="text-2xl font-black text-amber-400 leading-none">
                  {vehicleSpeed}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-bold mt-1">KM/H</span>
              </div>

              {/* Distância Restante */}
              <div className="flex flex-col items-center bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700">
                <span className="text-2xl font-black text-white leading-none">
                  {Math.max(0.1, activeRoute.totalDistanceKm * (1 - routeProgressPercent / 100)).toFixed(1)}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-bold mt-1">KM RESTANTES</span>
              </div>

              {/* Tempo Restante / Previsão */}
              <div className="flex flex-col items-center bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700">
                <span className="text-2xl font-black text-emerald-400 leading-none">
                  {Math.max(1, Math.round(activeRoute.totalDurationMinutes * (1 - routeProgressPercent / 100)))}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-bold mt-1">MIN DE VIAGEM</span>
              </div>
            </div>

            {/* Informações do Destino */}
            <div className="flex items-center justify-between bg-slate-800/50 px-3.5 py-2 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-xs font-bold text-slate-200 line-clamp-1">
                  Destino: {activeRoute.destinationName}
                </span>
              </div>
              <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded-full text-slate-300">
                Trânsito {activeRoute.trafficCondition}
              </span>
            </div>

            {/* Controles de Simulação & Cancelamento */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsSimulationPaused(!isSimulationPaused)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                  title={isSimulationPaused ? 'Continuar Simulação' : 'Pausar'}
                >
                  {isSimulationPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    const nextSpeed = simulationSpeedMultiplier === 1 ? 2 : simulationSpeedMultiplier === 2 ? 4 : 1;
                    setSimulationSpeedMultiplier(nextSpeed);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300"
                >
                  {simulationSpeedMultiplier}x Vel
                </button>
              </div>

              <button
                onClick={() => {
                  setIsNavigating(false);
                  setActiveRoute(null);
                  if (polylineLayerRef.current && leafletMapRef.current) {
                    leafletMapRef.current.removeLayer(polylineLayerRef.current);
                  }
                  if (destinationMarkerRef.current && leafletMapRef.current) {
                    leafletMapRef.current.removeLayer(destinationMarkerRef.current);
                  }
                  if (vehicleMarkerRef.current && leafletMapRef.current) {
                    leafletMapRef.current.removeLayer(vehicleMarkerRef.current);
                    vehicleMarkerRef.current = null;
                  }
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
              >
                Encerrar Rota
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CARD DETALHADO DO POI SELECIONADO (QUANDO NÃO EM NAVEGAÇÃO) */}
      {/* ========================================================================= */}
      {!isNavigating && selectedPoi && (
        <div className="relative z-10 mt-auto p-4 max-w-xl mx-auto w-full pointer-events-auto animate-in slide-in-from-bottom-6 duration-300">
          <div className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 flex flex-col gap-3.5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-[#0B4F8A]">
                    {selectedPoi.neighborhood}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      selectedPoi.isOpenNow ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {selectedPoi.isOpenNow ? '🟢 Aberto Agora' : '🔴 Fechado'}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1">{selectedPoi.name}</h3>
                <p className="text-xs text-slate-500">{selectedPoi.address}</p>
              </div>

              <button
                onClick={() => setSelectedPoi(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preços de Combustível (se for posto) */}
            {selectedPoi.fuelPrices && (
              <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-200/80 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[10px] font-bold text-amber-900">Gasolina Comum</div>
                  <div className="text-sm font-black text-amber-950">
                    R$ {selectedPoi.fuelPrices.gasolinaComum.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-amber-900">Etanol</div>
                  <div className="text-sm font-black text-amber-950">
                    R$ {selectedPoi.fuelPrices.etanol.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-amber-900">Diesel S10</div>
                  <div className="text-sm font-black text-amber-950">
                    R$ {selectedPoi.fuelPrices.dieselS10.toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            {/* Destaques / Features */}
            {selectedPoi.features && (
              <div className="flex flex-wrap gap-1.5">
                {selectedPoi.features.map((f, i) => (
                  <span
                    key={i}
                    className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-medium"
                  >
                    ✓ {f}
                  </span>
                ))}
              </div>
            )}

            {/* Botão de Navegar Agora */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleStartRouteToPoi(selectedPoi)}
                className="flex-1 bg-[#0B4F8A] hover:bg-[#083a66] text-white py-3 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all active:scale-98"
              >
                <Navigation className="w-4 h-4 fill-white" />
                <span>Navegar Agora (Estilo GPS)</span>
              </button>

              {selectedPoi.phone && (
                <a
                  href={`tel:${selectedPoi.phone.replace(/\D/g, '')}`}
                  className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors"
                  title="Ligar"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. DRAWER FLUTUANTE DO ASSISTENTE NLP (PERGUNTAS E RESPOSTAS) */}
      {/* ========================================================================= */}
      {isAssistantDrawerOpen && assistantResponse && (
        <div className="fixed inset-x-0 bottom-0 z-40 p-4 max-w-2xl mx-auto animate-in slide-in-from-bottom-8 duration-300 pointer-events-auto">
          <div className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0B4F8A] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    Assistente Local SALVÓ
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    {assistantResponse.recognizedCategory || 'Busca Inteligente'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsAssistantDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
              {assistantResponse.answerText}
            </p>

            {/* Lista de Resultados Encontrados */}
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
              {assistantResponse.matchedPois.map((poi) => (
                <div
                  key={poi.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{poi.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {poi.neighborhood} • {poi.distanceKm.toFixed(1)} km de você
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsAssistantDrawerOpen(false);
                      handleStartRouteToPoi(poi);
                    }}
                    className="bg-[#0B4F8A] text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-[#083a66] flex items-center gap-1"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Ir</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL DE GERENCIAMENTO DE MAPAS OFFLINE DE SALVADOR */}
      {/* ========================================================================= */}
      {isOfflineModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Mapas Offline de Salvador
                  </h3>
                  <p className="text-xs text-slate-500">
                    Navegue mesmo sem internet ou dados móveis
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOfflineModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Explicação Rotoma */}
            <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900 leading-relaxed">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Tecnologia Rotoma:</strong> Os blocos de mapas e estabelecimentos de Salvador
                são armazenados no seu IndexedDB local. Quando você passa por áreas sem sinal na orla
                ou túneis, o GPS continua ativo sem interrupções.
              </span>
            </div>

            {/* Lista de Pacotes Regionais */}
            <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
              {offlinePackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{pkg.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{pkg.description}</p>
                    </div>

                    <span className="text-xs font-bold text-slate-600 shrink-0 ml-2">
                      {pkg.sizeMb} MB
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      {pkg.poisCount} POIs incluídos
                    </span>

                    {pkg.isDownloaded ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Baixado
                      </span>
                    ) : pkg.downloadProgress > 0 && pkg.downloadProgress < 100 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full transition-all"
                            style={{ width: `${pkg.downloadProgress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700">
                          {pkg.downloadProgress}%
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDownloadPackage(pkg)}
                        className="bg-[#0B4F8A] hover:bg-[#083a66] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar Pacote</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsOfflineModalOpen(false)}
              className="w-full bg-slate-900 text-white py-3 rounded-2xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Fechar Gerenciador de Mapas
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
