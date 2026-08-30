/**
 * Geolocation & Distance Calculation Utility for SALVÔ Salvador
 * Calculates real-time Haversine distance, detects Salvador neighborhoods,
 * and formats travel times (walking, driving, transit).
 */

import { SALVADOR_NEIGHBORHOOD_GEO_MAP } from './salvadorGeoDatabase';

// Coordinates for all Salvador neighborhood centroids (dynamically mapped from official Salvador Geo Database)
export const SALVADOR_NEIGHBORHOOD_CENTROIDS: Record<string, { lat: number; lng: number }> = {
  ...Object.entries(SALVADOR_NEIGHBORHOOD_GEO_MAP).reduce((acc, [key, val]) => {
    acc[key] = { lat: val.lat, lng: val.lng };
    return acc;
  }, {} as Record<string, { lat: number; lng: number }>),
  // Additional common aliases & key landmarks
  'Pau da Lima': { lat: -12.9290, lng: -38.4280 },
  'Largo de Pau da Lima': { lat: -12.9290, lng: -38.4280 },
  'São Rafael': { lat: -12.9390, lng: -38.4210 },
  'São Marcos': { lat: -12.9340, lng: -38.4120 },
  'Castelo Branco': { lat: -12.9120, lng: -38.4210 },
  'Canabrava': { lat: -12.9330, lng: -38.4190 },
  'Sete de Abril': { lat: -12.9180, lng: -38.4120 },
  'Dom Avelar': { lat: -12.9160, lng: -38.4390 },
  'Vila Canária': { lat: -12.9240, lng: -38.4240 },
  'Nova Brasília': { lat: -12.9260, lng: -38.4020 },
  'Trobogy': { lat: -12.9380, lng: -38.3990 },
  'Mata Escura': { lat: -12.9420, lng: -38.4480 },
  'Sussuarana': { lat: -12.9380, lng: -38.4400 },
  'Jardim Santo Inácio': { lat: -12.9310, lng: -38.4520 },
  'Cabula VI': { lat: -12.9510, lng: -38.4550 },
  'Resgate': { lat: -12.9580, lng: -38.4650 },
  'Narandiba': { lat: -12.9550, lng: -38.4420 },
  'Arenoso': { lat: -12.9520, lng: -38.4490 },
  'Tancredo Neves': { lat: -12.9500, lng: -38.4400 },
  'Engomadeira': { lat: -12.9480, lng: -38.4560 },
  'Arraial do Retiro': { lat: -12.9540, lng: -38.4670 },
  'Barra': { lat: -13.0039, lng: -38.5326 },
  'Brotas': { lat: -12.9860, lng: -38.4890 },
};

/**
 * Calculates Haversine distance in meters between two GPS coordinates
 */
export function getDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Radius of Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Calculates Haversine distance in kilometers
 */
export function getDistanceInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  return Number((getDistanceInMeters(lat1, lon1, lat2, lon2) / 1000).toFixed(1));
}

/**
 * Formats distance into a human-friendly string (e.g., "150 m", "850 m", "1.2 km", "4.8 km")
 */
export function formatDistance(distanceInMeters: number): string {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)} m`;
  }
  const km = (distanceInMeters / 1000).toFixed(1);
  return `${km} km`;
}

/**
 * Formats travel time based on distance and travel mode
 */
export function formatTravelTime(
  distanceInMeters: number,
  mode: 'walking' | 'driving' | 'transit' = 'driving'
): string {
  const km = distanceInMeters / 1000;
  let minutes = 1;

  switch (mode) {
    case 'walking':
      // Average walking speed: 4.8 km/h => 12.5 min per km
      minutes = Math.max(1, Math.round(km * 12.5));
      return `${minutes} min a pé`;
    case 'driving':
      // Salvador traffic average: ~22 km/h in urban streets => 2.7 min per km + 2 min buffer
      minutes = Math.max(2, Math.round(km * 2.7 + 2));
      return `${minutes} min de carro`;
    case 'transit':
      // Bus/Metro average: ~16 km/h + 5 min wait time
      minutes = Math.max(5, Math.round(km * 3.75 + 5));
      return `${minutes} min de ônibus/metrô`;
    default:
      return `${minutes} min`;
  }
}

/**
 * Identifies the nearest Salvador neighborhood to given GPS coordinates
 */
export function detectSalvadorNeighborhood(
  lat: number,
  lng: number
): {
  neighborhood: string;
  distanceToCenterMeters: number;
  isWithinSalvador: boolean;
} {
  let closestNeighborhood = 'Barra';
  let minDistance = Infinity;

  for (const [name, coords] of Object.entries(SALVADOR_NEIGHBORHOOD_CENTROIDS)) {
    const dist = getDistanceInMeters(lat, lng, coords.lat, coords.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestNeighborhood = name;
    }
  }

  // Salvador metropolitan bounding box check:
  // Lat: roughly -12.75 to -13.10
  // Lng: roughly -38.65 to -38.20
  const isWithinSalvador =
    lat >= -13.15 && lat <= -12.75 && lng >= -38.65 && lng <= -38.20;

  return {
    neighborhood: closestNeighborhood,
    distanceToCenterMeters: minDistance,
    isWithinSalvador,
  };
}

export interface DirectionsOptions {
  origin?: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number };
  destinationName: string;
  travelMode?: 'driving' | 'transit' | 'walking';
}

/**
 * Generates turn-by-turn navigation deep links
 */
export function getDirectionsLinks(
  originOrOptions: { lat: number; lng: number } | null | DirectionsOptions,
  destination?: { lat: number; lng: number },
  destinationName?: string,
  travelMode: 'driving' | 'transit' | 'walking' = 'driving'
) {
  let originCoord: { lat: number; lng: number } | null = null;
  let destCoord: { lat: number; lng: number };
  let name = 'Destino Salvador';
  let mode: 'driving' | 'transit' | 'walking' = travelMode;

  if (originOrOptions && typeof originOrOptions === 'object' && 'destination' in originOrOptions) {
    const opts = originOrOptions as DirectionsOptions;
    originCoord = opts.origin || null;
    destCoord = opts.destination;
    name = opts.destinationName || name;
    if (opts.travelMode) mode = opts.travelMode;
  } else {
    originCoord = originOrOptions as { lat: number; lng: number } | null;
    destCoord = destination || { lat: -13.0039, lng: -38.5326 };
    name = destinationName || name;
  }

  const originParam = originCoord ? `${originCoord.lat},${originCoord.lng}` : '';
  const destParam = `${destCoord.lat},${destCoord.lng}`;

  const googleMapsUrl = originCoord
    ? `https://www.google.com/maps/dir/?api=1&origin=${originParam}&destination=${destParam}&travelmode=${mode}`
    : `https://www.google.com/maps/dir/?api=1&destination=${destParam}&travelmode=${mode}`;

  const wazeUrl = `https://waze.com/ul?ll=${destParam}&navigate=yes`;
  const uberUrl = `https://m.uber.com/ul/?action=setPickup&client_id=salvo_app&pickup=my_location&dropoff[latitude]=${destCoord.lat}&dropoff[longitude]=${destCoord.lng}&dropoff[nickname]=${encodeURIComponent(
    name
  )}`;

  const appleMapsUrl = `https://maps.apple.com/?daddr=${destParam}&dirflg=${
    mode === 'walking' ? 'w' : mode === 'transit' ? 'r' : 'd'
  }`;

  return {
    googleMapsUrl,
    googleMaps: googleMapsUrl,
    wazeUrl,
    waze: wazeUrl,
    uberUrl,
    uber: uberUrl,
    appleMapsUrl,
    appleMaps: appleMapsUrl,
  };
}
