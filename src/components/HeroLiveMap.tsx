import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Store } from '../types';
import { isValidPublicStore } from '../utils/storeValidation';

interface HeroLiveMapProps {
  stores: Store[];
  onSelectStore?: (store: Store) => void;
  onExploreClick?: () => void;
}

interface HighlightNeighborhood {
  name: string;
  lat: number;
  lng: number;
  tag: string;
  badgeColor: string;
  textColor: string;
}

const HIGHLIGHT_NEIGHBORHOODS: HighlightNeighborhood[] = [
  {
    name: 'Pelourinho',
    lat: -12.9718,
    lng: -38.5080,
    tag: 'Histórico',
    badgeColor: '#C1502E',
    textColor: '#FFFFFF',
  },
  {
    name: 'Barra',
    lat: -13.0039,
    lng: -38.5326,
    tag: 'Orla & Farol',
    badgeColor: '#0B3D91',
    textColor: '#FFFFFF',
  },
  {
    name: 'Rio Vermelho',
    lat: -12.9860,
    lng: -38.4910,
    tag: 'Boemia & Acarajé',
    badgeColor: '#FFC72C',
    textColor: '#0B3D91',
  },
  {
    name: 'Bonfim',
    lat: -12.9230,
    lng: -38.5030,
    tag: 'Tradição',
    badgeColor: '#1F6E43',
    textColor: '#FFFFFF',
  },
  {
    name: 'Pituba',
    lat: -12.9960,
    lng: -38.4550,
    tag: 'Comércio',
    badgeColor: '#0B3D91',
    textColor: '#FFFFFF',
  },
  {
    name: 'Itapuã',
    lat: -12.9350,
    lng: -38.3580,
    tag: 'Praias',
    badgeColor: '#0284C7',
    textColor: '#FFFFFF',
  },
];

export const HeroLiveMap: React.FC<HeroLiveMapProps> = ({
  stores,
  onSelectStore,
  onExploreClick,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean previous map instance if exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      // Initialize mini leaflet map centered on Salvador peninsula
      const map = L.map(mapContainerRef.current, {
        center: [-12.982, -38.485],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: false,
      });

      // Modern Clean Voyager tiles (smooth, beautiful colors, no watermarks, free)
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        {
          subdomains: 'abcd',
          maxZoom: 19,
          className: 'salvo-hero-map-tiles',
        }
      ).addTo(map);

      // Plot real highlight neighborhoods markers
      const validStores = stores.filter(isValidPublicStore);

      HIGHLIGHT_NEIGHBORHOODS.forEach((item) => {
        const storeCount = validStores.filter((s) => s.neighborhood === item.name).length;
        const countText = storeCount > 0 ? ` (${storeCount})` : '';

        const customIcon = L.divIcon({
          className: 'hero-map-marker-container',
          html: `
            <div style="
              display: inline-flex;
              align-items: center;
              gap: 4px;
              background-color: ${item.badgeColor};
              color: ${item.textColor};
              font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
              font-size: 10px;
              font-weight: 800;
              padding: 2px 7px;
              border-radius: 9999px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.25);
              border: 1.5px solid #FFFFFF;
              white-space: nowrap;
              transform: translate(-50%, -50%);
              cursor: pointer;
            ">
              <span style="width: 5px; height: 5px; border-radius: 50%; background-color: #FFFFFF;"></span>
              <span>${item.name}${countText}</span>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(map);
        marker.on('click', () => {
          if (onExploreClick) onExploreClick();
        });
      });

      // Also plot actual store dots if coordinates exist
      stores.slice(0, 10).forEach((store) => {
        if (store.coordinates?.lat && store.coordinates?.lng) {
          const storeDot = L.circleMarker([store.coordinates.lat, store.coordinates.lng], {
            radius: 4,
            fillColor: '#FFC72C',
            color: '#0B3D91',
            weight: 1.5,
            opacity: 1,
            fillOpacity: 0.9,
          }).addTo(map);

          storeDot.on('click', () => {
            if (onSelectStore) onSelectStore(store);
          });
        }
      });

      mapInstanceRef.current = map;

      // Invalidate size after layout renders
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 200);

      return () => {
        clearTimeout(timer);
        map.remove();
        mapInstanceRef.current = null;
      };
    } catch (err) {
      console.error('Error initializing hero mini map:', err);
    }
  }, [stores, onSelectStore, onExploreClick]);

  return (
    <div className="relative w-full h-32 sm:h-36 rounded-2xl overflow-hidden border border-white/20 shadow-inner bg-slate-950">
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Mini Overlay Info Badge */}
      <div className="absolute bottom-2 left-2 z-10 pointer-events-none bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] text-white border border-white/10 flex items-center gap-1.5 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-slate-200">Mapa Georreferenciado de Salvador</span>
      </div>

      {/* Interactive click hint */}
      {onExploreClick && (
        <button
          onClick={onExploreClick}
          className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white text-[#0B3D91] px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
        >
          <span>Abrir Mapa Completo</span>
          <span>→</span>
        </button>
      )}
    </div>
  );
};
