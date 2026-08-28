import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { Store, StoreCategory, TheftIncident, RouteDestinationTarget } from '../types';
import { STORE_CATEGORIES, NEIGHBORHOOD_SALES_EXAMPLES, SALVADOR_NEIGHBORHOODS, NeighborhoodSaleExample } from '../data/mockData';
import { THEFT_TYPE_LABELS } from '../data/mockSafetyData';
import { isValidPublicStore } from '../utils/storeValidation';
import { fetchRealSalvadorRoute } from '../utils/salvadorRoutingService';
import {
  getSalvadorNeighborhoodLocation,
  SALVADOR_NEIGHBORHOOD_GEO_MAP,
} from '../utils/salvadorGeoDatabase';
import { ClearableInput } from './ClearableInput';
import { StoreCard } from './StoreCard';
import { RouteCalculatorPanel } from './RouteCalculatorPanel';
import { SafetyIncidentModal } from './SafetyIncidentModal';
import {
  MapPin,
  Navigation,
  Sparkles,
  Star,
  Clock,
  ChevronRight,
  MessageSquare,
  Compass,
  Layers,
  Crosshair,
  Route,
  Eye,
  Info,
  Maximize2,
  X,
  Search,
  Tag,
  Copy,
  Check,
  Building,
  ExternalLink,
  Flame,
  ShieldAlert,
  AlertTriangle,
  Plus,
} from 'lucide-react';

interface InteractiveMapProps {
  stores: Store[];
  selectedCategory: StoreCategory | 'Todas';
  onSelectStore: (store: Store) => void;
  onOpenChat: (store: Store) => void;
  onOpenStreetView?: (store: Store) => void;
  userLocation: { lat: number; lng: number } | null;
  onUseLocation: () => void;
  isLocating: boolean;
  favoriteStoreIds?: string[];
  onToggleFavorite?: (storeId: string) => void;
  theftIncidents?: TheftIncident[];
  onSubmitTheftIncident?: (newIncident: Omit<TheftIncident, 'id' | 'createdAt' | 'status' | 'verifiedByAdmin'>) => void;
  targetNeighborhood?: string;
  targetCoordinates?: { lat: number; lng: number };
}


function formatBrazilianDate(dateStr?: string): string {
  if (!dateStr) return '';
  if (dateStr.includes('/')) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

interface Landmark {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  icon: string;
  color: string;
  description: string;
}

const SALVADOR_LANDMARKS: Landmark[] = [
  {
    id: 'farol-barra',
    name: 'Farol da Barra & Forte Sto. Antônio',
    category: 'Ponto Turístico',
    lat: -13.0103,
    lng: -38.5327,
    icon: '🗼',
    color: '#0B4F8A',
    description: 'Um dos cartões postais mais famosos da Bahia com vista deslumbrante para o pôr do sol.',
  },
  {
    id: 'porto-barra',
    name: 'Porto da Barra & Forte Santa Maria',
    category: 'Praia & História',
    lat: -13.0031,
    lng: -38.5323,
    icon: '🏖️',
    color: '#0284C7',
    description: 'Águas calmas e cristalinas ideais para banho e stand-up paddle na Baía de Todos os Santos.',
  },
  {
    id: 'pelourinho',
    name: 'Largo do Pelourinho & Casa do Olodum',
    category: 'Patrimônio Mundial',
    lat: -12.9718,
    lng: -38.5080,
    icon: '🥁',
    color: '#E8552B',
    description: 'Coração cultural e histórico de Salvador com casarões coloridos e percussão baiana.',
  },
  {
    id: 'elevador-lacerda',
    name: 'Elevador Lacerda & Mercado Modelo',
    category: 'Monumento',
    lat: -12.9734,
    lng: -38.5133,
    icon: '🛗',
    color: '#FFC72C',
    description: 'Liga a Cidade Baixa à Cidade Alta com vista panorâmica da Baía de Todos os Santos.',
  },
  {
    id: 'igreja-bonfim',
    name: 'Basílica Santuário do Senhor do Bonfim',
    category: 'Tradição & Fé',
    lat: -12.9238,
    lng: -38.5086,
    icon: '⛪',
    color: '#2E9E5B',
    description: 'Famosa pelas fitinhas coloridas do Bonfim amarradas no gradil e pela bênção das águas.',
  },
  {
    id: 'dique-tororo',
    name: 'Dique do Tororó & Orixás',
    category: 'Cultura Afro-Baiana',
    lat: -12.9839,
    lng: -38.5074,
    icon: '🌊',
    color: '#06B6D4',
    description: 'Lagoa urbana com as imponentes esculturas flutuantes dos 8 Orixás de Tati Moreno.',
  },
  {
    id: 'rio-vermelho',
    name: 'Largo de Santana (Dinha) & Casa de Iemanjá',
    category: 'Boemia & Gastronomia',
    lat: -13.0145,
    lng: -38.4890,
    icon: '🍤',
    color: '#DC2626',
    description: 'Berço do tradicional acarajé baiano e centro das celebrações de 2 de Fevereiro.',
  },
  {
    id: 'farol-itapua',
    name: 'Farol de Itapuã',
    category: 'Praia & Poesia',
    lat: -12.9525,
    lng: -38.3533,
    icon: '🌴',
    color: '#059669',
    description: 'Eternizado nas canções de Dorival Caymmi e Vinicius de Moraes.',
  },
  {
    id: 'ponta-humaita',
    name: 'Ponta de Humaitá & Monte Serrat',
    category: 'Pôr do Sol Mágico',
    lat: -12.9298,
    lng: -38.5204,
    icon: '🌅',
    color: '#EA580C',
    description: 'Península charmosa com capela histórica e um dos pores do sol mais bonitos de Salvador.',
  },
];

const MAP_LAYERS = [
  {
    id: 'osm_classic',
    name: '🗺️ Ruas, Avenidas & Bairros (OpenStreetMap)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '',
    subdomains: 'abc',
    maxZoom: 19,
    className: 'salvo-map-classic-tiles',
  },
  {
    id: 'osm_clean',
    name: '🎨 Salvador Moderno (CartoDB Clean)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
    attribution: '',
    subdomains: 'abcd',
    maxZoom: 20,
    className: 'salvo-map-clean-tiles',
  },
  {
    id: 'esri_street',
    name: '🧭 Ruas Detalhadas & Relevo (Esri)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '',
    subdomains: '',
    maxZoom: 19,
    className: 'salvo-map-esri-tiles',
  },
  {
    id: 'osm_hot',
    name: '☀️ Salvador Vibrante (Cores Vivas)',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '',
    subdomains: 'abc',
    maxZoom: 19,
    className: 'salvo-map-hot-tiles',
  },
  {
    id: 'satellite',
    name: '🛰️ Satélite em Alta Resolução (Esri)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '',
    subdomains: '',
    maxZoom: 18,
    className: 'salvo-map-satellite-tiles',
  },
];

const QUICK_NEIGHBORHOODS = [
  { name: 'Visão Geral Salvador', lat: -12.9777, lng: -38.4800, zoom: 12 },
  { name: 'Barra', lat: -13.0039, lng: -38.5326, zoom: 16 },
  { name: 'Pelourinho', lat: -12.9718, lng: -38.5080, zoom: 16 },
  { name: 'Rio Vermelho', lat: -13.0135, lng: -38.4900, zoom: 16 },
  { name: 'Pituba', lat: -13.0010, lng: -38.4610, zoom: 16 },
  { name: 'Bonfim', lat: -12.9238, lng: -38.5086, zoom: 16 },
  { name: 'Itapuã', lat: -12.9525, lng: -38.3533, zoom: 16 },
  { name: 'Stella Maris', lat: -12.9350, lng: -38.3320, zoom: 16 },
  { name: 'Cajazeiras', lat: -12.8950, lng: -38.4200, zoom: 15 },
  { name: 'Liberdade', lat: -12.9490, lng: -38.4950, zoom: 16 },
];

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  stores,
  selectedCategory,
  onSelectStore,
  onOpenChat,
  onOpenStreetView,
  userLocation,
  onUseLocation,
  isLocating,
  favoriteStoreIds = [],
  onToggleFavorite,
  theftIncidents = [],
  onSubmitTheftIncident,
  targetNeighborhood,
  targetCoordinates,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const storeMarkersGroupRef = useRef<L.FeatureGroup | null>(null);
  const landmarksGroupRef = useRef<L.FeatureGroup | null>(null);
  const salesGroupRef = useRef<L.FeatureGroup | null>(null);
  const theftMarkersGroupRef = useRef<L.FeatureGroup | null>(null);
  const userMarkerRef = useRef<L.LayerGroup | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);

  const [mapZoom, setMapZoom] = useState<number>(13);
  // Valid public stores only
  const validStores = useMemo(() => stores.filter(isValidPublicStore), [stores]);
  const [activePinStore, setActivePinStore] = useState<Store | null>(null);
  const [activeSaleExample, setActiveSaleExample] = useState<NeighborhoodSaleExample | null>(null);
  const [activeMapFilter, setActiveMapFilter] = useState<'all' | 'offers_only' | 'open_only' | 'sales_examples'>('all');
  const [currentLayerId, setCurrentLayerId] = useState<string>('osm_classic');
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);
  const [showSalesExamples, setShowSalesExamples] = useState<boolean>(true);
  const [showTheftLayer, setShowTheftLayer] = useState<boolean>(true);
  const [showLayersMenu, setShowLayersMenu] = useState<boolean>(false);
  const [showNeighborhoodSearch, setShowNeighborhoodSearch] = useState<boolean>(false);
  const [neighborhoodSearchQuery, setNeighborhoodSearchQuery] = useState<string>('');
  const [showRouteLine, setShowRouteLine] = useState<boolean>(true);
  const [activeLandmark, setActiveLandmark] = useState<Landmark | null>(null);

  // Theft Incidents & Safety States
  const [activeTheftIncident, setActiveTheftIncident] = useState<TheftIncident | null>(null);
  const [showTheftModal, setShowTheftModal] = useState<boolean>(false);
  const [theftModalMode, setTheftModalMode] = useState<'view' | 'create'>('view');

  // Route Calculator States
  const [activeRouteDestination, setActiveRouteDestination] = useState<RouteDestinationTarget | null>(null);
  const [showRouteCalculator, setShowRouteCalculator] = useState<boolean>(false);

  // Approved theft incidents for public map display
  const approvedTheftIncidents = useMemo(() => {
    return theftIncidents.filter((inc) => inc.status === 'approved');
  }, [theftIncidents]);


  // Filtered neighborhood list for quick search
  const filteredNeighborhoods = useMemo(() => {
    if (!neighborhoodSearchQuery.trim()) {
      return SALVADOR_NEIGHBORHOODS;
    }
    const q = neighborhoodSearchQuery.toLowerCase();
    return SALVADOR_NEIGHBORHOODS.filter((n) => n.toLowerCase().includes(q));
  }, [neighborhoodSearchQuery]);

  // Filtered valid stores
  const filteredStores = useMemo(() => {
    return validStores.filter((store) => {
      if (selectedCategory !== 'Todas' && store.category !== selectedCategory) {
        return false;
      }
      if (activeMapFilter === 'offers_only' && (!store.offers || store.offers.length === 0)) {
        return false;
      }
      if (activeMapFilter === 'open_only' && !store.isOpenNow) {
        return false;
      }
      return true;
    });
  }, [validStores, selectedCategory, activeMapFilter]);

  const getCategoryColor = (category: StoreCategory) => {
    const found = STORE_CATEGORIES.find((c) => c.name === category);
    return found ? found.color : '#0B3D91';
  };

  const getCategoryIcon = (category: StoreCategory) => {
    const found = STORE_CATEGORIES.find((c) => c.name === category);
    return found ? found.icon : '📍';
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Create Map centered in Salvador, Bahia
    const map = L.map(mapContainerRef.current, {
      center: [-12.9800, -38.4800],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    // Add Attribution in bottom right with high-contrast custom styling
    L.control.attribution({
      position: 'bottomright',
      prefix: '<strong style="color:#0B3D91;">SALVÔ</strong>',
    }).addTo(map);

    // Initial Base Tile Layer
    const layerConfig = MAP_LAYERS.find((l) => l.id === currentLayerId) || MAP_LAYERS[0];
    const tileLayer = L.tileLayer(layerConfig.url, {
      attribution: layerConfig.attribution,
      subdomains: layerConfig.subdomains || 'abc',
      maxZoom: layerConfig.maxZoom || 19,
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Create Feature Groups
    const storeMarkersGroup = L.featureGroup().addTo(map);
    const landmarksGroup = L.featureGroup().addTo(map);
    const salesGroup = L.featureGroup().addTo(map);
    const theftMarkersGroup = L.featureGroup().addTo(map);
    const userMarkerGroup = L.layerGroup().addTo(map);

    storeMarkersGroupRef.current = storeMarkersGroup;
    landmarksGroupRef.current = landmarksGroup;
    salesGroupRef.current = salesGroup;
    theftMarkersGroupRef.current = theftMarkersGroup;
    userMarkerRef.current = userMarkerGroup;
    mapInstanceRef.current = map;


    // Listen to zoom changes for intelligent clustering
    map.on('zoomend', () => {
      setMapZoom(map.getZoom());
    });

    // Invalidate size after initial layout render
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    // Dynamic resize observer to maintain crisp map boundaries
    let resizeObserver: ResizeObserver | null = null;
    if (mapContainerRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Layer when changed
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const layerConfig = MAP_LAYERS.find((l) => l.id === currentLayerId) || MAP_LAYERS[0];

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const newTileLayer = L.tileLayer(layerConfig.url, {
      attribution: layerConfig.attribution,
      subdomains: layerConfig.subdomains || 'abc',
      maxZoom: layerConfig.maxZoom || 19,
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTileLayer;
  }, [currentLayerId]);

  // Render Landmarks (Point of Interest) with Hover Tooltip Only to prevent label overlapping
  useEffect(() => {
    const map = mapInstanceRef.current;
    const landmarksGroup = landmarksGroupRef.current;
    if (!map || !landmarksGroup) return;

    landmarksGroup.clearLayers();

    if (!showLandmarks) return;

    SALVADOR_LANDMARKS.forEach((lm) => {
      const landmarkIcon = L.divIcon({
        className: 'custom-landmark-pin',
        html: `
          <div class="cursor-pointer transform hover:scale-115 active:scale-95 transition-transform flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border-2 border-[#0B3D91]"
               title="${lm.name}"
               role="button"
               tabindex="0">
            <span class="text-sm leading-none">${lm.icon}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([lm.lat, lm.lng], { icon: landmarkIcon });

      // Label only visible on HOVER or click to eliminate visual clutter between nearby spots (e.g. Elevador Lacerda & Pelourinho)
      marker.bindTooltip(`
        <div class="font-bold text-xs text-slate-800 flex items-center gap-1.5 py-0.5">
          <span>${lm.icon}</span>
          <span>${lm.name}</span>
        </div>
      `, {
        direction: 'top',
        offset: [0, -16],
        opacity: 0.95,
        className: 'salvo-landmark-tooltip',
      });

      marker.on('click', () => {
        setActiveLandmark(lm);
        setActivePinStore(null);
        setActiveSaleExample(null);
        map.flyTo([lm.lat, lm.lng], Math.max(map.getZoom(), 15), { duration: 0.8 });
      });

      landmarksGroup.addLayer(marker);
    });
  }, [showLandmarks]);

interface StoreClusterItem {
  id: string;
  isCluster: boolean;
  stores: Store[];
  centerLat: number;
  centerLng: number;
  offersCount: number;
  openCount: number;
  bounds: L.LatLngBounds;
  primaryCategory: StoreCategory;
}

function computeStoreClusters(
  map: L.Map,
  storesList: Store[],
  zoom: number
): StoreClusterItem[] {
  // Safe coordinate filtering + valid public stores
  const valid = storesList.filter(
    (s) =>
      isValidPublicStore(s) &&
      s.coordinates &&
      typeof s.coordinates.lat === 'number' &&
      typeof s.coordinates.lng === 'number' &&
      !isNaN(s.coordinates.lat) &&
      !isNaN(s.coordinates.lng)
  );

  if (valid.length === 0) return [];

  // Determine cluster pixel radius by zoom level:
  // When two or more pins are within radiusPx distance on screen, group them into a single numbered cluster
  let radiusPx = 55;
  if (zoom <= 11) radiusPx = 80;
  else if (zoom === 12) radiusPx = 70;
  else if (zoom === 13) radiusPx = 60;
  else if (zoom === 14) radiusPx = 50;
  else if (zoom === 15) radiusPx = 40;
  else if (zoom === 16) radiusPx = 30;
  else radiusPx = 22; // zoom 17+

  interface ClusterAcc {
    id: string;
    stores: Store[];
    pixelX: number;
    pixelY: number;
    sumLat: number;
    sumLng: number;
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  }

  const clustersAcc: ClusterAcc[] = [];

  for (const store of valid) {
    const pt = map.project([store.coordinates.lat, store.coordinates.lng], zoom);

    let closestCluster: ClusterAcc | null = null;
    let minDistance = radiusPx;

    for (const cluster of clustersAcc) {
      const dist = Math.hypot(pt.x - cluster.pixelX, pt.y - cluster.pixelY);
      if (dist <= minDistance) {
        minDistance = dist;
        closestCluster = cluster;
      }
    }

    if (closestCluster) {
      closestCluster.stores.push(store);
      const count = closestCluster.stores.length;
      closestCluster.sumLat += store.coordinates.lat;
      closestCluster.sumLng += store.coordinates.lng;
      closestCluster.pixelX = (closestCluster.pixelX * (count - 1) + pt.x) / count;
      closestCluster.pixelY = (closestCluster.pixelY * (count - 1) + pt.y) / count;
      closestCluster.minLat = Math.min(closestCluster.minLat, store.coordinates.lat);
      closestCluster.maxLat = Math.max(closestCluster.maxLat, store.coordinates.lat);
      closestCluster.minLng = Math.min(closestCluster.minLng, store.coordinates.lng);
      closestCluster.maxLng = Math.max(closestCluster.maxLng, store.coordinates.lng);
    } else {
      clustersAcc.push({
        id: `cluster-${store.id}-${clustersAcc.length}`,
        stores: [store],
        pixelX: pt.x,
        pixelY: pt.y,
        sumLat: store.coordinates.lat,
        sumLng: store.coordinates.lng,
        minLat: store.coordinates.lat,
        maxLat: store.coordinates.lat,
        minLng: store.coordinates.lng,
        maxLng: store.coordinates.lng,
      });
    }
  }

  return clustersAcc.map((c) => {
    const count = c.stores.length;
    const centerLat = c.sumLat / count;
    const centerLng = c.sumLng / count;
    const offersCount = c.stores.filter((s) => s.offers && s.offers.length > 0).length;
    const openCount = c.stores.filter((s) => s.isOpenNow).length;
    const bounds = L.latLngBounds(
      [c.minLat, c.minLng],
      [c.maxLat, c.maxLng]
    );

    return {
      id: c.id,
      isCluster: count > 1,
      stores: c.stores,
      centerLat,
      centerLng,
      offersCount,
      openCount,
      bounds,
      primaryCategory: c.stores[0].category,
    };
  });
}

  // Render Store Markers with Intelligent Clustering & Zoom Hierarchy
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = storeMarkersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const currentZoom = map.getZoom();
    const clusters = computeStoreClusters(map, filteredStores, currentZoom);

    clusters.forEach((cluster) => {
      if (cluster.isCluster) {
        // Render Cluster Marker with numeric badge that expands on click
        const storesCount = cluster.stores.length;
        const offersCount = cluster.offersCount;
        const hasOffers = offersCount > 0;

        const clusterIcon = L.divIcon({
          className: 'salvo-cluster-icon',
          html: `
            <div class="cursor-pointer select-none group flex items-center justify-center filter drop-shadow-md hover:scale-105 active:scale-95 transition-transform"
                 role="button"
                 tabindex="0"
                 aria-label="${storesCount} lojas agrupadas${hasOffers ? `, ${offersCount} com ofertas` : ''}. Clique para aproximar.">
              <div class="flex items-center bg-[#0B3D91] text-white rounded-2xl p-1.5 px-3 shadow-xl border-2 border-white gap-2 font-bold text-xs">
                <div class="flex items-center gap-1.5">
                  <span class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-extrabold text-xs text-white">${storesCount}</span>
                  <span class="text-[11px] font-semibold text-sky-100 hidden sm:inline">lojas</span>
                </div>
                ${
                  hasOffers
                    ? `<div class="h-3.5 w-[1px] bg-white/30"></div>
                       <div class="flex items-center gap-1 bg-[#C1502E] text-white px-2 py-0.5 rounded-xl text-[10px] font-black border border-white/40 shadow-2xs">
                         <span class="text-xs">🔥</span>
                         <span>${offersCount}</span>
                       </div>`
                    : ''
                }
              </div>
            </div>
          `,
          iconSize: [hasOffers ? 130 : 90, 38],
          iconAnchor: [hasOffers ? 65 : 45, 19],
        });

        const clusterMarker = L.marker([cluster.centerLat, cluster.centerLng], {
          icon: clusterIcon,
        });

        clusterMarker.on('click', () => {
          const curZoom = map.getZoom();
          const bounds = cluster.bounds;
          if (
            bounds.isValid() &&
            (bounds.getNorthEast().lat !== bounds.getSouthWest().lat ||
              bounds.getNorthEast().lng !== bounds.getSouthWest().lng)
          ) {
            map.flyToBounds(bounds, {
              padding: [50, 50],
              maxZoom: Math.min(curZoom + 2, 17),
              duration: 0.6,
            });
          } else {
            map.flyTo([cluster.centerLat, cluster.centerLng], Math.min(curZoom + 2, 18), {
              duration: 0.6,
            });
          }
        });

        markersGroup.addLayer(clusterMarker);
      } else {
        // Render Individual Store Marker with Progressive Detail by Zoom
        const store = cluster.stores[0];
        const isSelected = activePinStore?.id === store.id;
        const catColor = getCategoryColor(store.category);
        const catIcon = getCategoryIcon(store.category);
        const hasOffer = store.offers && store.offers.length > 0;
        const bestOffer = hasOffer ? store.offers[0] : null;

        // Progressive HTML depending on Zoom Level
        let markerHtml = '';
        let iconSize: [number, number] = [130, 75];
        let iconAnchor: [number, number] = [65, 55];

        if (currentZoom <= 13) {
          // Zoom Afastado: Compact Pin, no large label
          iconSize = [40, 40];
          iconAnchor = [20, 20];
          markerHtml = `
            <div class="relative cursor-pointer select-none group flex flex-col items-center">
              ${
                isSelected
                  ? `<div class="absolute -inset-2 rounded-full bg-[#0B4F8A]/30 pulse-ring-effect pointer-events-none"></div>`
                  : ''
              }
              ${
                hasOffer
                  ? `<div class="mb-0.5 px-1 py-0.2 bg-[#E8552B] text-white text-[8px] font-black rounded-full shadow-2xs">🔥</div>`
                  : ''
              }
              <div class="relative flex items-center justify-center w-8 h-8 rounded-xl shadow-md transition-all transform ${
                isSelected
                  ? 'scale-120 ring-2 ring-white ring-offset-1 ring-offset-[#0B4F8A] shadow-xl'
                  : 'hover:scale-110'
              }" style="background-color: ${catColor}; border: 2px solid #FFFFFF;">
                <span class="text-sm drop-shadow-xs">${catIcon}</span>
                <div class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${
                  store.isOpenNow ? 'bg-[#2E9E5B]' : 'bg-slate-400'
                }"></div>
              </div>
            </div>
          `;
        } else if (currentZoom <= 15) {
          // Zoom Médio: Clean Pin + Offer Pill if any
          iconSize = [100, 56];
          iconAnchor = [50, 42];
          markerHtml = `
            <div class="relative cursor-pointer select-none group flex flex-col items-center">
              ${
                isSelected
                  ? `<div class="absolute -inset-2.5 rounded-full bg-[#0B4F8A]/30 pulse-ring-effect pointer-events-none"></div>`
                  : ''
              }
              ${
                hasOffer
                  ? `<div class="mb-0.5 px-2 py-0.5 bg-[#E8552B] text-white text-[9px] font-black uppercase tracking-wider rounded-full shadow-md whitespace-nowrap flex items-center gap-1 border border-white/80">
                       <span>🔥</span>
                       <span>${bestOffer?.discountBadge || 'OFERTA'}</span>
                     </div>`
                  : ''
              }
              <div class="relative flex items-center justify-center w-9 h-9 rounded-2xl shadow-lg transition-all transform ${
                isSelected
                  ? 'scale-115 ring-3 ring-white ring-offset-2 ring-offset-[#0B4F8A] shadow-2xl'
                  : 'hover:scale-110'
              }" style="background-color: ${catColor}; border: 2px solid #FFFFFF;">
                <span class="text-base drop-shadow-xs">${catIcon}</span>
                <div class="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                  store.isOpenNow ? 'bg-[#2E9E5B]' : 'bg-slate-400'
                }"></div>
              </div>
            </div>
          `;
        } else {
          // Zoom Próximo / Muito Próximo (>= 16): Full details with store name tag
          iconSize = [130, 75];
          iconAnchor = [65, 55];
          markerHtml = `
            <div class="relative cursor-pointer select-none group flex flex-col items-center">
              ${
                isSelected
                  ? `<div class="absolute -inset-2.5 rounded-full bg-[#0B4F8A]/30 pulse-ring-effect pointer-events-none"></div>`
                  : ''
              }
              ${
                hasOffer
                  ? `<div class="mb-1 px-2 py-0.5 bg-[#E8552B] text-white text-[9px] font-black uppercase tracking-wider rounded-full shadow-md whitespace-nowrap animate-bounce flex items-center gap-1 border border-white/80">
                       <span>✨</span>
                       <span>${bestOffer?.discountBadge || 'OFERTA'}</span>
                     </div>`
                  : ''
              }
              <div class="relative flex items-center justify-center w-11 h-11 rounded-2xl shadow-xl transition-all transform ${
                isSelected
                  ? 'scale-115 ring-3 ring-white ring-offset-2 ring-offset-[#0B4F8A] shadow-2xl'
                  : 'hover:scale-110'
              }" style="background-color: ${catColor}; border: 2.5px solid #FFFFFF;">
                <span class="text-lg drop-shadow-xs">${catIcon}</span>
                <div class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  store.isOpenNow ? 'bg-[#2E9E5B]' : 'bg-slate-400'
                }"></div>
              </div>
              <div class="mt-1 px-2 py-0.5 bg-slate-900/90 text-white rounded-md text-[10px] font-bold shadow-md max-w-[130px] truncate text-center backdrop-blur-xs border border-white/20">
                ${store.name}
              </div>
              <div class="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-0.5"></div>
            </div>
          `;
        }

        const storeIcon = L.divIcon({
          className: 'custom-store-pin',
          html: markerHtml,
          iconSize: iconSize,
          iconAnchor: iconAnchor,
        });

        const marker = L.marker([store.coordinates.lat, store.coordinates.lng], {
          icon: storeIcon,
        });

        marker.on('click', () => {
          setActivePinStore(store);
          setActiveLandmark(null);
          setActiveSaleExample(null);
          map.flyTo([store.coordinates.lat, store.coordinates.lng], Math.max(map.getZoom(), 15), {
            duration: 0.8,
          });
        });

        markersGroup.addLayer(marker);
      }
    });
  }, [filteredStores, mapZoom, activePinStore]);

  // Render Salvador Neighborhood Sales Examples Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const salesGroup = salesGroupRef.current;
    if (!map || !salesGroup) return;

    salesGroup.clearLayers();

    if (!showSalesExamples) return;

    const currentZoom = map.getZoom();

    NEIGHBORHOOD_SALES_EXAMPLES.forEach((sale) => {
      const isSelected = activeSaleExample?.id === sale.id;

      let iconSize: [number, number] = [125, 75];
      let iconAnchor: [number, number] = [62, 55];
      let markerHtml = '';

      if (currentZoom <= 13) {
        iconSize = [40, 40];
        iconAnchor = [20, 20];
        markerHtml = `
          <div class="relative cursor-pointer select-none group flex flex-col items-center">
            ${
              isSelected
                ? `<div class="absolute -inset-2 rounded-full bg-[#E8552B]/40 pulse-ring-effect pointer-events-none"></div>`
                : ''
            }
            <div class="relative flex items-center justify-center w-8 h-8 rounded-xl shadow-md transition-all transform ${
              isSelected
                ? 'scale-120 ring-2 ring-white ring-offset-1 ring-offset-[#E8552B] shadow-xl bg-[#E8552B]'
                : 'hover:scale-110 bg-[#0B4F8A]'
            }" style="border: 2px solid #FFFFFF;">
              <span class="text-sm drop-shadow-xs">${sale.icon}</span>
            </div>
          </div>
        `;
      } else {
        iconSize = [125, 75];
        iconAnchor = [62, 55];
        markerHtml = `
          <div class="relative cursor-pointer select-none group flex flex-col items-center">
            ${
              isSelected
                ? `<div class="absolute -inset-2 rounded-full bg-[#E8552B]/40 pulse-ring-effect pointer-events-none"></div>`
                : ''
            }
            
            <div class="mb-1 px-2 py-0.5 bg-[#E8552B] text-white text-[9px] font-black uppercase tracking-wider rounded-full shadow-md whitespace-nowrap flex items-center gap-1 border border-white/90">
              <span>🏷️</span>
              <span>${sale.saleBadge}</span>
            </div>

            <div class="relative flex items-center justify-center w-10 h-10 rounded-2xl shadow-lg transition-all transform ${
              isSelected
                ? 'scale-115 ring-3 ring-white ring-offset-2 ring-offset-[#E8552B] shadow-2xl bg-[#E8552B]'
                : 'hover:scale-110 bg-[#0B4F8A]'
            }" style="border: 2px solid #FFFFFF;">
              <span class="text-base drop-shadow-xs">${sale.icon}</span>
            </div>

            <div class="mt-1 px-2 py-0.5 bg-slate-900/95 text-white rounded-md text-[9px] font-bold shadow-md max-w-[125px] truncate text-center backdrop-blur-xs border border-white/20">
              ${sale.neighborhood}: ${sale.businessName}
            </div>
            
            <div class="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-0.5"></div>
          </div>
        `;
      }

      const saleIcon = L.divIcon({
        className: 'custom-sale-pin',
        html: markerHtml,
        iconSize: iconSize,
        iconAnchor: iconAnchor,
      });

      const marker = L.marker([sale.lat, sale.lng], { icon: saleIcon });

      marker.on('click', () => {
        setActiveSaleExample(sale);
        setActivePinStore(null);
        setActiveLandmark(null);
        map.flyTo([sale.lat, sale.lng], Math.max(map.getZoom(), 15), {
          duration: 0.8,
        });
      });

      salesGroup.addLayer(marker);
    });
  }, [showSalesExamples, activeSaleExample, mapZoom]);


  // Handle external navigation to neighborhood or coordinates
  useEffect(() => {
    if (targetCoordinates && mapInstanceRef.current) {
      handleFlyTo(targetCoordinates.lat, targetCoordinates.lng, 15);
    } else if (targetNeighborhood && mapInstanceRef.current) {
      const loc = getSalvadorNeighborhoodLocation(targetNeighborhood);
      if (loc) {
        handleFlyTo(loc.lat, loc.lng, loc.zoom || 15);
      }
    }
  }, [targetNeighborhood, targetCoordinates]);

  // Render Theft & Safety Incident Markers (Marcadores de Furto Aprovados)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const theftGroup = theftMarkersGroupRef.current;
    if (!map || !theftGroup) return;

    theftGroup.clearLayers();

    if (!showTheftLayer) return;

    approvedTheftIncidents.forEach((incident) => {
      const typeConfig = THEFT_TYPE_LABELS[incident.type] || THEFT_TYPE_LABELS['furto_celular'];
      const hasMedia = (incident.images && incident.images.length > 0) || Boolean(incident.videoUrl);

      const markerHtml = `
        <div class="relative cursor-pointer select-none group flex flex-col items-center animate-fadeIn">
          <div class="absolute -inset-2 rounded-full bg-red-600/30 pulse-ring-effect pointer-events-none"></div>
          
          <div class="mb-1 px-2 py-0.5 bg-red-600 text-white text-[9px] font-black uppercase tracking-wider rounded-full shadow-lg whitespace-nowrap flex items-center gap-1 border border-white/90">
            <span>🚨</span>
            <span>${typeConfig.label.split(' ')[0]}</span>
            ${hasMedia ? '<span class="text-[8px] bg-white/30 px-1 rounded">📸</span>' : ''}
          </div>

          <div class="relative flex items-center justify-center w-10 h-10 rounded-2xl shadow-xl transition-all transform hover:scale-115 bg-gradient-to-br from-red-600 to-rose-700 text-white" style="border: 2.5px solid #FFFFFF;">
            <span class="text-base drop-shadow-xs">${typeConfig.icon}</span>
            <div class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white shadow-xs"></div>
          </div>

          <div class="mt-1 px-2 py-0.5 bg-slate-950/90 text-white rounded-md text-[9px] font-bold shadow-md max-w-[130px] truncate text-center backdrop-blur-xs border border-white/20">
            ${incident.neighborhood}
          </div>
          
          <div class="w-1.5 h-1.5 bg-slate-950 rotate-45 -mt-0.5"></div>
        </div>
      `;

      const theftIcon = L.divIcon({
        className: 'custom-theft-pin',
        html: markerHtml,
        iconSize: [130, 80],
        iconAnchor: [65, 60],
      });

      const marker = L.marker([incident.coordinates.lat, incident.coordinates.lng], {
        icon: theftIcon,
      });

      marker.bindTooltip(`🚨 ${incident.title} (${incident.neighborhood}) • Clique para ver fotos e vídeo`, {
        permanent: false,
        direction: 'top',
        className: 'custom-leaflet-tooltip',
      });

      marker.on('click', () => {
        setActiveTheftIncident(incident);
        setTheftModalMode('view');
        setShowTheftModal(true);
        setActivePinStore(null);
        setActiveLandmark(null);
        setActiveSaleExample(null);
        map.flyTo([incident.coordinates.lat, incident.coordinates.lng], Math.max(map.getZoom(), 16), {
          duration: 0.8,
        });
      });

      theftGroup.addLayer(marker);
    });
  }, [approvedTheftIncidents, showTheftLayer, mapZoom]);

  // Render User Location and Dynamic Real Route (OSRM Geometry)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const userGroup = userMarkerRef.current;
    if (!map || !userGroup) return;

    userGroup.clearLayers();

    // Clear previous route line
    if (routeLineRef.current) {
      map.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }

    if (!userLocation) return;

    // User Radar Marker
    const userIcon = L.divIcon({
      className: 'custom-user-pin',
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <div class="absolute inset-0 rounded-full bg-blue-500/40 pulse-ring-effect"></div>
          <div class="w-5 h-5 rounded-full bg-[#0B3D91] border-2 border-white shadow-xl flex items-center justify-center">
            <div class="w-2 h-2 rounded-full bg-[#FFC72C]"></div>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
    userMarker.bindTooltip('📍 Você está aqui em Salvador (GPS Real)', { permanent: false, direction: 'top' });
    userGroup.addLayer(userMarker);

    // Draw high-fidelity route if activeRouteDestination is set
    if (activeRouteDestination && showRouteLine) {
      let isCancelled = false;

      fetchRealSalvadorRoute(
        userLocation.lat,
        userLocation.lng,
        activeRouteDestination.coordinates.lat,
        activeRouteDestination.coordinates.lng
      ).then((routeRes) => {
        if (isCancelled || !mapInstanceRef.current) return;

        if (routeLineRef.current) {
          mapInstanceRef.current.removeLayer(routeLineRef.current);
        }

        const polyline = L.polyline(routeRes.geometry, {
          color: '#0B3D91',
          weight: 5,
          opacity: 0.9,
          lineJoin: 'round',
          lineCap: 'round',
        }).addTo(mapInstanceRef.current);

        routeLineRef.current = polyline;

        // Auto zoom to fit user and destination
        const bounds = L.latLngBounds([
          [userLocation.lat, userLocation.lng],
          [activeRouteDestination.coordinates.lat, activeRouteDestination.coordinates.lng],
        ]);
        mapInstanceRef.current.flyToBounds(bounds, { padding: [60, 60], duration: 1.0 });
      });

      return () => {
        isCancelled = true;
      };
    } else if (activePinStore && showRouteLine) {
      // Basic dashed line to active store if no full route opened
      const latlngs: [number, number][] = [
        [userLocation.lat, userLocation.lng],
        [activePinStore.coordinates.lat, activePinStore.coordinates.lng],
      ];

      const polyline = L.polyline(latlngs, {
        color: '#0B3D91',
        weight: 3,
        opacity: 0.7,
        dashArray: '6, 6',
      }).addTo(map);

      routeLineRef.current = polyline;
    }
  }, [userLocation, activeRouteDestination, activePinStore, showRouteLine]);

  // When userLocation changes or is detected, fly smoothly to user position
  useEffect(() => {
    if (userLocation && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 16, { duration: 1.2 });
    }
  }, [userLocation]);

  // Helper to fly to a location
  const handleFlyTo = (lat: number, lng: number, zoom = 15) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 1.2 });
  };

  // Center on user and request fresh GPS position
  const handleCenterUser = () => {
    onUseLocation();
  };

  // Zoom controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  // Calculate distance between user and active store
  const calculateDistance = () => {
    if (!userLocation || !activePinStore) return null;
    const R = 6371; // km
    const dLat = ((activePinStore.coordinates.lat - userLocation.lat) * Math.PI) / 180;
    const dLon = ((activePinStore.coordinates.lng - userLocation.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLocation.lat * Math.PI) / 180) *
        Math.cos((activePinStore.coordinates.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d.toFixed(1);
  };

  // Handler to initiate route calculation for any store or point
  const handleStartRouteCalculation = (dest: RouteDestinationTarget) => {
    setActiveRouteDestination(dest);
    setShowRouteCalculator(true);
    // If user location is not active yet, trigger location request
    if (!userLocation) {
      onUseLocation();
    }
  };


  return (
    <div className="relative w-full h-[540px] sm:h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100 flex flex-col">
      {/* =========================================================
          TOP UNIFIED CONTROLS CONTAINER (FLEX-COL: NO OVERLAPPING)
      ========================================================= */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-col gap-2 pointer-events-none">
        {/* Row 1: Filter Badges (Left) & Key Action Triggers (Right) */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Filter Pills */}
          <div className="pointer-events-auto flex items-center bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-2xl shadow-lg border border-slate-200 text-xs font-bold gap-1 overflow-x-auto max-w-full scrollbar-none">
            <button
              onClick={() => {
                setActiveMapFilter('all');
                setShowSalesExamples(true);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeMapFilter === 'all'
                  ? 'bg-[#0B3D91] text-white shadow-xs'
                  : 'text-slate-700 hover:text-[#0B3D91] hover:bg-slate-100'
              }`}
            >
              Todas ({validStores.length})
            </button>
            <button
              onClick={() => {
                setActiveMapFilter('offers_only');
                setShowSalesExamples(false);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                activeMapFilter === 'offers_only'
                  ? 'bg-[#C1502E] text-white shadow-xs'
                  : 'text-slate-700 hover:text-[#C1502E] hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Com Oferta</span>
            </button>
            <button
              onClick={() => {
                setActiveMapFilter('open_only');
                setShowSalesExamples(false);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                activeMapFilter === 'open_only'
                  ? 'bg-[#1F6E43] text-white shadow-xs'
                  : 'text-slate-700 hover:text-[#1F6E43] hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#1F6E43] inline-block animate-ping"></span>
              <span>Abertas</span>
            </button>
            <button
              onClick={() => {
                setShowSalesExamples((prev) => !prev);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                showSalesExamples
                  ? 'bg-[#0B3D91] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Exibir Vendas e Promoções nos Bairros de Salvador"
            >
              <Tag className="w-3.5 h-3.5 text-[#E5A000]" />
              <span>Vendas ({NEIGHBORHOOD_SALES_EXAMPLES.length})</span>
            </button>

            {/* Theft Alerts Layer Toggle */}
            <button
              onClick={() => setShowTheftLayer((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                showTheftLayer
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Exibir ou ocultar alertas de furto e segurança comunitária em Salvador"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Furtos ({approvedTheftIncidents.length})</span>
            </button>
          </div>

          {/* Action Triggers: Signal Theft, Landmarks & Neighborhood Search */}
          <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
            {/* Signal Theft / Report Incident Button */}
            <button
              onClick={() => {
                setTheftModalMode('create');
                setShowTheftModal(true);
              }}
              className="px-3 py-2 rounded-2xl text-xs font-heading font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg border bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 border-red-700 transition-all active:scale-95 cursor-pointer"
              title="Sinalizar furto ou ocorrência no mapa (aprovado pela moderação)"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Sinalizar Furto</span>
            </button>

            {/* Landmarks Toggle */}
            <button
              onClick={() => setShowLandmarks((prev) => !prev)}
              className={`px-3 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-lg border transition-all cursor-pointer whitespace-nowrap ${
                showLandmarks
                  ? 'bg-[#0B3D91] text-white border-[#0B3D91]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Exibir Pontos Turísticos de Salvador"
            >
              <Compass className="w-3.5 h-3.5 text-[#E5A000]" />
              <span className="hidden sm:inline">Pontos Turísticos</span>
            </button>
          </div>
        </div>

        {/* Row 2: Quick Neighborhood Horizontal Navigation */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl shadow-md border border-slate-200/90 overflow-x-auto scrollbar-none w-fit max-w-full">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#0B4F8A] px-1.5 flex items-center gap-1 whitespace-nowrap">
            <Compass className="w-3 h-3 text-[#FFC72C]" />
            Bairros:
          </span>
          {QUICK_NEIGHBORHOODS.map((nh) => (
            <button
              key={nh.name}
              onClick={() => handleFlyTo(nh.lat, nh.lng, nh.zoom)}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white hover:bg-[#0B4F8A] text-slate-700 hover:text-white border border-slate-200 transition-all whitespace-nowrap active:scale-95 shadow-2xs cursor-pointer"
            >
              {nh.name}
            </button>
          ))}
          <button
            onClick={() => setShowNeighborhoodSearch(true)}
            className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#FFC72C] hover:bg-[#f5bc20] text-[#0B4F8A] border border-amber-300 transition-all whitespace-nowrap active:scale-95 shadow-2xs flex items-center gap-1 cursor-pointer font-black"
          >
            <Search className="w-3 h-3" />
            <span>Todos os 160+ Bairros</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          BOTTOM-RIGHT FLOATING MAP UTILITY CONTROLS (GPS, LAYERS, ZOOM)
      ========================================================= */}
      <div className="absolute bottom-4 right-3 z-30 flex flex-col items-end gap-2 pointer-events-none">
        {/* Layer Selector Dropdown Menu */}
        <div className="relative pointer-events-auto">
          <button
            onClick={() => setShowLayersMenu((prev) => !prev)}
            className="p-2 sm:px-3 sm:py-2 bg-white/95 backdrop-blur-md text-slate-700 hover:text-[#0B3D91] rounded-2xl shadow-xl border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            title="Mudar estilo e camada do mapa"
          >
            <Layers className="w-4 h-4 text-[#0B3D91]" />
            <span className="hidden sm:inline">Camadas</span>
          </button>

          {showLayersMenu && (
            <div className="absolute right-0 bottom-12 w-48 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-2 z-40 space-y-1 animate-fadeIn">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 py-1">
                Estilo do Mapa
              </div>
              {MAP_LAYERS.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => {
                    setCurrentLayerId(layer.id);
                    setShowLayersMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    currentLayerId === layer.id
                      ? 'bg-[#0B3D91] text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{layer.name}</span>
                  {currentLayerId === layer.id && <span className="text-[#E5A000]">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* GPS Location Button */}
        <button
          onClick={handleCenterUser}
          disabled={isLocating}
          className="pointer-events-auto flex items-center gap-1.5 px-3.5 py-2.5 bg-white/95 backdrop-blur-md text-[#0B3D91] hover:bg-sky-50 rounded-2xl shadow-xl border border-slate-200 text-xs font-bold transition-all active:scale-95 cursor-pointer"
          title="Minha Posição no Mapa (GPS Real de Salvador)"
        >
          <Navigation className={`w-4 h-4 text-[#0B3D91] ${isLocating ? 'animate-spin text-[#C1502E]' : ''}`} />
          <span className="font-extrabold">Meu GPS</span>
        </button>

        {/* Zoom Buttons Stack */}
        <div className="pointer-events-auto flex flex-col bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="p-2.5 hover:bg-slate-100 text-slate-800 font-bold active:scale-95 transition-all cursor-pointer flex items-center justify-center w-9 h-9"
            title="Aumentar Zoom"
            aria-label="Aumentar Zoom"
          >
            +
          </button>
          <div className="h-[1px] bg-slate-200 w-full"></div>
          <button
            onClick={handleZoomOut}
            className="p-2.5 hover:bg-slate-100 text-slate-800 font-bold active:scale-95 transition-all cursor-pointer flex items-center justify-center w-9 h-9"
            title="Diminuir Zoom"
            aria-label="Diminuir Zoom"
          >
            -
          </button>
        </div>
      </div>

      {/* Real Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0 cursor-grab active:cursor-grabbing" />

      {/* Salvador 160+ Neighborhoods Search Modal */}
      {showNeighborhoodSearch && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[85%] flex flex-col overflow-hidden animate-slideUp">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-[#0B4F8A] to-[#1E73BE] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center text-lg">
                  🏙️
                </div>
                <div>
                  <h3 className="font-heading font-black text-sm sm:text-base leading-tight">
                    Bairros de Salvador ({SALVADOR_NEIGHBORHOODS.length})
                  </h3>
                  <p className="text-[11px] text-sky-100">
                    Selecione qualquer bairro para navegar no mapa e ver vendas
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowNeighborhoodSearch(false);
                  setNeighborhoodSearchQuery('');
                }}
                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input with Clear Button */}
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <ClearableInput
                autoFocus
                placeholder="Digitar nome do bairro (ex: Periperi, Cabula, Cajazeiras, Barra...)"
                value={neighborhoodSearchQuery}
                onValueChange={setNeighborhoodSearchQuery}
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                className="h-11 bg-white border border-slate-200 text-xs font-bold"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
                <span>{filteredNeighborhoods.length} bairros encontrados</span>
                <span className="text-[#0B4F8A] font-semibold">1 clique para navegar</span>
              </div>
            </div>

            {/* Neighborhoods List */}
            <div className="p-3 overflow-y-auto flex-1 divide-y divide-slate-100 max-h-[380px]">
              {filteredNeighborhoods.map((bairro) => {
                const saleMatch = NEIGHBORHOOD_SALES_EXAMPLES.find(
                  (s) => s.neighborhood.toLowerCase() === bairro.toLowerCase()
                );
                return (
                  <button
                    key={bairro}
                    onClick={() => {
                      setShowNeighborhoodSearch(false);
                      setNeighborhoodSearchQuery('');
                      const geoLoc = getSalvadorNeighborhoodLocation(bairro);
                      handleFlyTo(geoLoc.lat, geoLoc.lng, geoLoc.zoom || 15);

                      if (saleMatch) {
                        setActiveSaleExample(saleMatch);
                        setActivePinStore(null);
                      }
                    }}
                    className="w-full text-left p-2.5 rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-slate-100 group-hover:bg-[#0B4F8A] group-hover:text-white flex items-center justify-center text-xs font-bold text-slate-600 transition-colors">
                        📍
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 group-hover:text-[#0B4F8A]">
                          {bairro}
                        </p>
                        {saleMatch && (
                          <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                            <span>🏷️</span> {saleMatch.businessName} • {saleMatch.saleBadge}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {saleMatch && (
                        <span className="px-2 py-0.5 bg-[#E8552B] text-white text-[9px] font-black rounded-lg">
                          {saleMatch.saleBadge}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0B4F8A] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Active Neighborhood Sale Example Bottom Card */}
      {activeSaleExample && !activePinStore && (
        <div className="absolute bottom-4 left-3 right-3 sm:left-4 sm:right-auto sm:max-w-md z-30 bg-white/98 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-2xl border border-slate-200/90 animate-fadeIn">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B4F8A] to-[#136ac2] text-white text-2xl flex items-center justify-center border-2 border-white shadow-md shrink-0">
                {activeSaleExample.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-[#FFC72C] text-[#0B4F8A] border border-amber-300 shadow-2xs">
                    {activeSaleExample.saleBadge}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 truncate">
                    📍 {activeSaleExample.neighborhood}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-heading font-black text-slate-900 leading-tight mt-0.5 truncate">
                  {activeSaleExample.businessName}
                </h4>
              </div>
            </div>

            <button
              onClick={() => setActiveSaleExample(null)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all shrink-0"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Description */}
          <div className="mt-2.5">
            <p className="text-xs font-bold text-slate-900 leading-snug">
              {activeSaleExample.saleTitle}
            </p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
              {activeSaleExample.description}
            </p>
          </div>

          {/* Price & Offer Highlight */}
          <div className="mt-3 bg-gradient-to-r from-amber-50 via-orange-50/60 to-amber-50 border border-amber-200/80 rounded-2xl p-2.5 flex items-center justify-between gap-2">
            <div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-amber-800 block">
                Valor Promocional
              </span>
              <span className="text-xs sm:text-sm font-heading font-black text-amber-900">
                {activeSaleExample.priceText}
              </span>
            </div>

            <span className="px-2.5 py-1 bg-[#E8552B] text-white text-[10px] font-black uppercase rounded-lg shadow-2xs">
              {activeSaleExample.saleBadge}
            </span>
          </div>

          {/* Footer: Expiration, Reference & Action CTA Aligned */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-lg shrink-0">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>Válido até {formatBrazilianDate(activeSaleExample.expiresAt) || '30/09/2026'}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() =>
                  handleStartRouteCalculation({
                    id: activeSaleExample.id,
                    name: activeSaleExample.businessName,
                    type: 'store',
                    coordinates: { lat: activeSaleExample.lat, lng: activeSaleExample.lng },
                    neighborhood: activeSaleExample.neighborhood,
                  })
                }
                className="px-3 py-1.5 bg-[#0B3D91] hover:bg-[#082C69] text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-2xs active:scale-95 cursor-pointer"
                title="Calcular rota real até este comércio"
              >
                <Compass className="w-3.5 h-3.5 text-[#FFC72C]" />
                <span>Como Chegar</span>
              </button>

              {activeSaleExample.whatsapp && (
                <a
                  href={`https://wa.me/${activeSaleExample.whatsapp}?text=Ol%C3%A1,%20vi%20a%20promo%C3%A7%C3%A3o%20${encodeURIComponent(
                    activeSaleExample.saleTitle
                  )}%20no%20SALV%C3%94!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-2xs active:scale-95"
                >
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Active Landmark Preview Card */}
      {activeLandmark && !activePinStore && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-30 bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-slate-200 animate-fadeIn">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-2xl flex items-center justify-center shrink-0 shadow-sm border border-amber-200">
                {activeLandmark.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-100 text-[#0B4F8A]">
                    {activeLandmark.category}
                  </span>
                </div>
                <h4 className="text-sm font-heading font-black text-slate-900 mt-1">
                  {activeLandmark.name}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {activeLandmark.description}
                </p>
                <div className="mt-3">
                  <button
                    onClick={() =>
                      handleStartRouteCalculation({
                        id: activeLandmark.id,
                        name: activeLandmark.name,
                        type: 'landmark',
                        coordinates: { lat: activeLandmark.lat, lng: activeLandmark.lng },
                      })
                    }
                    className="px-3.5 py-1.5 bg-[#0B3D91] hover:bg-[#082C69] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#FFC72C]" />
                    <span>Calcular Rota até Aqui</span>
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveLandmark(null)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Active Store Interactive Card (Uses identical StoreCard component with full design consistency) */}
      {activePinStore && (
        <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:max-w-sm z-30 animate-fadeIn">
          <div className="relative">
            <button
              onClick={() => setActivePinStore(null)}
              className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white backdrop-blur-xs transition-all shadow-md cursor-pointer"
              title="Fechar card de loja"
            >
              <X className="w-4 h-4" />
            </button>
            <StoreCard
              store={activePinStore}
              isFavorite={favoriteStoreIds.includes(activePinStore.id)}
              onToggleFavorite={onToggleFavorite || (() => {})}
              onSelectStore={onSelectStore}
              onOpenChat={onOpenChat}
              onOpenStreetView={onOpenStreetView}
            />
          </div>
        </div>
      )}

      {/* Route Calculator Floating Panel (Sem Simulação - OSRM + Open-Meteo + CCR Metrô / Integra) */}
      {showRouteCalculator && activeRouteDestination && (
        <RouteCalculatorPanel
          userLocation={userLocation}
          destination={activeRouteDestination}
          onClose={() => {
            setShowRouteCalculator(false);
            setActiveRouteDestination(null);
          }}
        />
      )}

      {/* Safety & Theft Incident Modal / Popup (Visualizador & Reporte de Ocorrência) */}
      {showTheftModal && (
        <SafetyIncidentModal
          mode={theftModalMode}
          incident={activeTheftIncident}
          userCoordinates={userLocation}
          onClose={() => {
            setShowTheftModal(false);
            setActiveTheftIncident(null);
          }}
          onSubmitIncident={(newInc) => {
            if (onSubmitTheftIncident) {
              onSubmitTheftIncident(newInc);
            }
          }}
        />
      )}
    </div>
  );
};

