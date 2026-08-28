import { SalvadorWeatherInfo, SalvadorTransitOption } from '../types';

// ==========================================
// 🚇 ESTAÇÕES DO CCR METRÔ BAHIA (LINHAS 1 E 2)
// ==========================================
export interface MetroStation {
  id: string;
  name: string;
  line: 1 | 2;
  lat: number;
  lng: number;
  neighborhood: string;
  hasBusTerminal: boolean;
}

export const SALVADOR_METRO_STATIONS: MetroStation[] = [
  // LINHA 1 (Lapa - Águas Claras)
  { id: 'st-lapa', name: 'Estação Lapa', line: 1, lat: -12.9804, lng: -38.5108, neighborhood: 'Nazaré', hasBusTerminal: true },
  { id: 'st-campo-polvora', name: 'Estação Campo da Pólvora', line: 1, lat: -12.9772, lng: -38.5065, neighborhood: 'Nazaré', hasBusTerminal: false },
  { id: 'st-brotas', name: 'Estação Brotas', line: 1, lat: -12.9818, lng: -38.4988, neighborhood: 'Brotas', hasBusTerminal: false },
  { id: 'st-bonoco', name: 'Estação Bonocô', line: 1, lat: -12.9845, lng: -38.4905, neighborhood: 'Bonocô', hasBusTerminal: false },
  { id: 'st-acesso-norte-1', name: 'Estação Acesso Norte (Integração L1/L2)', line: 1, lat: -12.9723, lng: -38.4735, neighborhood: 'Horto Bela Vista', hasBusTerminal: true },
  { id: 'st-retiro', name: 'Estação Retiro', line: 1, lat: -12.9566, lng: -38.4712, neighborhood: 'Retiro', hasBusTerminal: false },
  { id: 'st-bom-jua', name: 'Estação Bom Juá', line: 1, lat: -12.9463, lng: -38.4687, neighborhood: 'Bom Juá', hasBusTerminal: false },
  { id: 'st-piraja', name: 'Estação Pirajá', line: 1, lat: -12.9230, lng: -38.4552, neighborhood: 'Pirajá', hasBusTerminal: true },
  { id: 'st-campinas', name: 'Estação Campinas de Pirajá', line: 1, lat: -12.9090, lng: -38.4420, neighborhood: 'Campinas', hasBusTerminal: false },
  { id: 'st-aguas-claras', name: 'Estação Águas Claras', line: 1, lat: -12.8940, lng: -38.4230, neighborhood: 'Águas Claras', hasBusTerminal: true },

  // LINHA 2 (Acesso Norte - Aeroporto)
  { id: 'st-detran', name: 'Estação Detran', line: 2, lat: -12.9739, lng: -38.4646, neighborhood: 'Iguatemi', hasBusTerminal: false },
  { id: 'st-rodoviaria', name: 'Estação Rodoviária', line: 2, lat: -12.9790, lng: -38.4550, neighborhood: 'Iguatemi / Pituba', hasBusTerminal: true },
  { id: 'st-pernambues', name: 'Estação Pernambués', line: 2, lat: -12.9765, lng: -38.4445, neighborhood: 'Pernambués', hasBusTerminal: false },
  { id: 'st-imbui', name: 'Estação Imbuí', line: 2, lat: -12.9698, lng: -38.4320, neighborhood: 'Imbuí', hasBusTerminal: false },
  { id: 'st-cab', name: 'Estação CAB (Centro Administrativo)', line: 2, lat: -12.9560, lng: -38.4190, neighborhood: 'CAB', hasBusTerminal: false },
  { id: 'st-pituacu', name: 'Estação Pituaçu', line: 2, lat: -12.9465, lng: -38.4080, neighborhood: 'Pituaçu', hasBusTerminal: true },
  { id: 'st-flamboyant', name: 'Estação Flamboyant', line: 2, lat: -12.9405, lng: -38.3980, neighborhood: 'Paralela', hasBusTerminal: false },
  { id: 'st-tamburugy', name: 'Estação Tamburugy', line: 2, lat: -12.9350, lng: -38.3880, neighborhood: 'Tamburugy / FTC', hasBusTerminal: false },
  { id: 'st-bairro-paz', name: 'Estação Bairro da Paz', line: 2, lat: -12.9280, lng: -38.3750, neighborhood: 'Bairro da Paz', hasBusTerminal: false },
  { id: 'st-mussurunga', name: 'Estação Mussurunga', line: 2, lat: -12.9190, lng: -38.3610, neighborhood: 'Mussurunga / São Cristóvão', hasBusTerminal: true },
  { id: 'st-aeroporto', name: 'Estação Aeroporto (Lauro de Freitas)', line: 2, lat: -12.9065, lng: -38.3390, neighborhood: 'Aeroporto / São Cristóvão', hasBusTerminal: true },
];

// ==========================================
// 🚌 LINHAS REAIS DE ÔNIBUS DE SALVADOR (INTEGRA SALVADOR / INTEGRAÇÃO)
// ==========================================
export interface BusLineGuide {
  number: string;
  name: string;
  corridor: string;
  neighborhoods: string[];
  stopsSample: string[];
}

export const SALVADOR_BUS_LINES: BusLineGuide[] = [
  {
    number: '1001',
    name: 'Aeroporto x Praça da Sé / Campo Grande',
    corridor: 'Orla Atlântica / Av. Octávio Mangabeira & Centenário',
    neighborhoods: ['Aeroporto', 'Itapuã', 'Pituba', 'Rio Vermelho', 'Ondina', 'Barra', 'Campo Grande', 'Sé'],
    stopsSample: ['Terminal Aeroporto', 'Farol de Itapuã', 'Jardim de Alah', 'Largo de Santana (Rio Vermelho)', 'Farol da Barra', 'Praça da Sé'],
  },
  {
    number: '0137',
    name: 'Estação da Lapa x Barra / Graça (Circular)',
    corridor: 'Vale do Canela / Centenário / Orla da Barra',
    neighborhoods: ['Nazaré', 'Graça', 'Barra', 'Canela', 'Vitória'],
    stopsSample: ['Estação da Lapa (Plataforma C)', 'Av. Centenário', 'Shopping Barra', 'Farol da Barra', 'Largo da Vitória'],
  },
  {
    number: '1388',
    name: 'Estação Pirajá x Barra 3',
    corridor: 'BR-324 / Av. Bonocô / Garibaldi / Barra',
    neighborhoods: ['Pirajá', 'Retiro', 'Bonocô', 'Garibaldi', 'Ondina', 'Barra'],
    stopsSample: ['Terminal Pirajá', 'Estação Bonocô', 'Hospital Aliança', 'São Lázaro', 'Shopping Barra'],
  },
  {
    number: '0713',
    name: 'Santa Cruz x Estação da Lapa',
    corridor: 'Itaigara / Av. ACM / Bonocô',
    neighborhoods: ['Santa Cruz', 'Nordeste', 'Itaigara', 'Brotas', 'Lapa'],
    stopsSample: ['Largo da Santa Cruz', 'Parque da Cidade', 'Shopping da Bahia', 'Estação da Lapa'],
  },
  {
    number: '1053',
    name: 'Estação Mussurunga x Barra 3',
    corridor: 'Av. Paralela / Orla / Barra',
    neighborhoods: ['Mussurunga', 'Paralela', 'Imbuí', 'Pituba', 'Rio Vermelho', 'Barra'],
    stopsSample: ['Terminal Mussurunga', 'Unijorge Paralela', 'Shopping Salvador', 'Amaralina', 'Farol da Barra'],
  },
  {
    number: '0321',
    name: 'Marechal Rondon x Barra',
    corridor: 'San Martin / Comércio / Campo Grande / Barra',
    neighborhoods: ['Marechal Rondon', 'San Martin', 'Calçada', 'Comércio', 'Barra'],
    stopsSample: ['Terminal Marechal Rondon', 'Plano Inclinado Liberdade', 'Mercado Modelo', 'Forte de São Diogo'],
  },
  {
    number: '1633',
    name: 'Mirantes de Periperi x Ondina (BRT / Suburbana)',
    corridor: 'Avenida Afrânio Peixoto (Suburbana) / Garibaldi',
    neighborhoods: ['Periperi', 'Plataforma', 'Lobato', 'Calçada', 'Garibaldi', 'Ondina'],
    stopsSample: ['Mirantes de Periperi', 'Estação Calçada', 'TCA / Campo Grande', 'UFBA Ondina'],
  },
  {
    number: '1230',
    name: 'Sussuarana x Barra R1',
    corridor: 'CAB / Paralela / ACM / Centenário',
    neighborhoods: ['Sussuarana', 'CAB', 'Pituba', 'Garibaldi', 'Barra'],
    stopsSample: ['Terminal Sussuarana', 'Estação CAB', 'Itaigara', 'Morro do Gato', 'Porto da Barra'],
  },
];

// Helper: Haversine distance in KM
export function calculateHaversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

// ==========================================
// 🛰️ BUSCAR ROTA REAL DE TRÂNSITO (OSRM API)
// ==========================================
export interface RealRouteResult {
  distanceKm: number;
  durationMinutes: number;
  geometry: [number, number][]; // [lat, lng] array
  source: 'osrm' | 'direct';
}

export async function fetchRealSalvadorRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): Promise<RealRouteResult> {
  const directKm = calculateHaversineKm(startLat, startLng, endLat, endLng);

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
    const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (response.ok) {
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceKm = Number((route.distance / 1000).toFixed(1));
        const durationMinutes = Math.max(1, Math.round(route.duration / 60));
        // In GeoJSON coords are [lng, lat], convert to Leaflet [lat, lng]
        const geometry: [number, number][] = route.geometry.coordinates.map(
          (c: [number, number]) => [c[1], c[0]]
        );

        return {
          distanceKm: distanceKm || directKm,
          durationMinutes,
          geometry,
          source: 'osrm',
        };
      }
    }
  } catch {
    // Fallback if network fails
  }

  // Fallback: realistic driving estimation in Salvador's urban geometry
  const estimatedRoadKm = Number((directKm * 1.35).toFixed(1));
  const estimatedMin = Math.max(3, Math.round(estimatedRoadKm * 2.8));

  return {
    distanceKm: estimatedRoadKm,
    durationMinutes: estimatedMin,
    geometry: [
      [startLat, startLng],
      [endLat, endLng],
    ],
    source: 'direct',
  };
}

// ==========================================
// ☀️ CLIMA REAL DE SALVADOR (OPEN-METEO API)
// ==========================================
export async function fetchSalvadorWeather(lat: number, lng: number): Promise<SalvadorWeatherInfo> {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Bahia',
    hour: 'numeric',
    hour12: false,
  });
  const currentHour = parseInt(formatter.format(now), 10) || 12;
  const isNightTime = currentHour < 6 || currentHour >= 18;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,is_day&timezone=America%2FBahia`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      const current = data.current;

      const code = current.weather_code || 0;
      const isDay = current.is_day === 1 && !isNightTime;

      let condition = isDay ? 'Ensolarado com brisa do mar' : 'Noite estrelada na Baía';
      let conditionIcon = isDay ? '☀️' : '🌙';

      if (code === 0) {
        condition = isDay ? 'Céu Limpo & Ensolarado' : 'Noite de Céu Limpo & Estrelado';
        conditionIcon = isDay ? '☀️' : '🌙';
      } else if (code >= 1 && code <= 3) {
        condition = isDay ? 'Sol Entre Nuvens & Brisa' : 'Noite Parcialmente Encoberta';
        conditionIcon = isDay ? '⛅' : '☁️';
      } else if (code >= 51 && code <= 67) {
        condition = isDay ? 'Chuva Passageira / Garoa' : 'Garoa Noturna Passageira';
        conditionIcon = '🌦️';
      } else if (code >= 80 && code <= 82) {
        condition = isDay ? 'Pancadas de Chuva na Orla' : 'Chuva Noturna na Orla';
        conditionIcon = '🌧️';
      } else if (code >= 95) {
        condition = 'Instabilidade com Trovoadas';
        conditionIcon = '⛈️';
      }

      return {
        temperature: Math.round(current.temperature_2m || (isDay ? 28 : 24)),
        apparentTemperature: Math.round(current.apparent_temperature || (isDay ? 31 : 25)),
        condition,
        conditionIcon,
        precipitation: current.precipitation || 0,
        humidity: current.relative_humidity_2m || 78,
        windSpeed: Math.round(current.wind_speed_10m || 14),
        isDay,
        updatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Bahia' }),
      };
    }
  } catch {
    // Fallback realístico para clima tropical marítimo de Salvador
  }

  const isDay = !isNightTime;
  return {
    temperature: isDay ? 28 : 24,
    apparentTemperature: isDay ? 31 : 25,
    condition: isDay ? 'Ensolarado com brisa marítima' : 'Noite agradável com brisa do mar',
    conditionIcon: isDay ? '☀️' : '🌙',
    precipitation: 0,
    humidity: 78,
    windSpeed: 14,
    isDay,
    updatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Bahia' }),
  };
}

// ==========================================
// 🚦 TRÂNSITO & CORREDORES VIÁRIOS DE SALVADOR
// ==========================================
export function getSalvadorTrafficStatus(startCoord: { lat: number; lng: number }, endCoord: { lat: number; lng: number }): {
  status: 'Livre' | 'Moderado' | 'Intenso' | 'Lento';
  color: string;
  mainAvenues: string[];
  recommendation: string;
} {
  const currentHour = new Date().getHours();
  const isRushHour = (currentHour >= 7 && currentHour <= 9) || (currentHour >= 17 && currentHour <= 19);

  // Identify principal arteries based on latitude span
  const avenues = [];
  const minLat = Math.min(startCoord.lat, endCoord.lat);
  const maxLat = Math.max(startCoord.lat, endCoord.lat);

  if (minLat < -12.95 && maxLat > -13.01) {
    avenues.push('Av. Octávio Mangabeira (Orla)', 'Av. Antônio Carlos Magalhães (ACM)');
  }
  if (minLat < -12.92) {
    avenues.push('Av. Luís Viana Filho (Paralela)', 'Av. Paralela BR-324');
  }
  if (minLat > -12.99) {
    avenues.push('Av. Centenário / Garibaldi', 'Vale do Canela');
  }

  if (avenues.length === 0) {
    avenues.push('Av. Mário Leal Ferreira (Bonocô)', 'Av. Paralela');
  }

  if (isRushHour) {
    return {
      status: 'Intenso',
      color: '#DC2626',
      mainAvenues: avenues,
      recommendation: 'Horário de pico soteropolitano: Metrô Bahia ou vias litorâneas são a opção mais rápida.',
    };
  }

  return {
    status: 'Moderado',
    color: '#059669',
    mainAvenues: avenues,
    recommendation: 'Tráfego fluindo com boa velocidade média pelos principais eixos viários da cidade.',
  };
}

// ==========================================
// 🚌 & 🚇 GUIA DE TRANSPORTE PÚBLICO INTEGRADO
// ==========================================
export function getSalvadorTransitOptions(
  startCoord: { lat: number; lng: number },
  endCoord: { lat: number; lng: number },
  destName: string,
  destNeighborhood = 'Salvador'
): SalvadorTransitOption[] {
  const directKm = calculateHaversineKm(startCoord.lat, startCoord.lng, endCoord.lat, endCoord.lng);
  const drivingKm = Number((directKm * 1.35).toFixed(1));

  // 1. Achar Estação do Metrô mais próxima da Origem e do Destino
  let closestOriginMetro = SALVADOR_METRO_STATIONS[0];
  let minOriginDist = 999;
  let closestDestMetro = SALVADOR_METRO_STATIONS[0];
  let minDestDist = 999;

  SALVADOR_METRO_STATIONS.forEach((st) => {
    const dStart = calculateHaversineKm(startCoord.lat, startCoord.lng, st.lat, st.lng);
    if (dStart < minOriginDist) {
      minOriginDist = dStart;
      closestOriginMetro = st;
    }
    const dEnd = calculateHaversineKm(endCoord.lat, endCoord.lng, st.lat, st.lng);
    if (dEnd < minDestDist) {
      minDestDist = dEnd;
      closestDestMetro = st;
    }
  });

  const needsLineTransfer = closestOriginMetro.line !== closestDestMetro.line;
  const metroTrainTimeMin = Math.round(calculateHaversineKm(closestOriginMetro.lat, closestOriginMetro.lng, closestDestMetro.lat, closestDestMetro.lng) * 1.8) + (needsLineTransfer ? 5 : 0) + 4;
  const totalMetroTripMin = Math.max(12, Math.round(minOriginDist * 14) + metroTrainTimeMin + Math.round(minDestDist * 14));

  // 2. Achar Linhas de Ônibus compatíveis
  const matchingBus = SALVADOR_BUS_LINES.filter((b) =>
    b.neighborhoods.some((n) => destNeighborhood.toLowerCase().includes(n.toLowerCase()))
  );
  const primaryBus = matchingBus[0] || SALVADOR_BUS_LINES[0];

  const busTripMin = Math.max(15, Math.round(drivingKm * 3.4) + 8);
  const carTripMin = Math.max(5, Math.round(drivingKm * 2.4));
  const walkTripMin = Math.round(directKm * 15);

  return [
    {
      type: 'metro',
      title: `CCR Metrô Bahia (Linha ${closestOriginMetro.line} ${needsLineTransfer ? `→ Linha ${closestDestMetro.line}` : ''})`,
      linesOrStations: [
        `Embarque: ${closestOriginMetro.name} (${minOriginDist.toFixed(1)} km de você)`,
        needsLineTransfer ? 'Baldeação na Estação Acesso Norte' : 'Viagem direta sem baldeação',
        `Desembarque: ${closestDestMetro.name} (${minDestDist.toFixed(1)} km de ${destName})`,
      ],
      estimatedMinutes: totalMetroTripMin,
      distanceKm: Number((directKm * 1.2).toFixed(1)),
      fareText: 'R$ 5,20 (com integração gratuita de até 2h com ônibus Integra)',
      description: `Pegue o metrô em ${closestOriginMetro.name}. Trens com ar-condicionado a cada 3 a 5 minutos. Desembarque em ${closestDestMetro.name} e siga a pé ou de ônibus alimentador até ${destName}.`,
      integrationNote: 'Integração Metrô + Ônibus de Salvador garantida pelo SalvadorCARD / CCR Metrô.',
    },
    {
      type: 'bus',
      title: `Ônibus Integra Salvador (Linha ${primaryBus.number}: ${primaryBus.name})`,
      linesOrStations: [
        `Linha ${primaryBus.number} • ${primaryBus.corridor}`,
        `Parada mais próxima de ${destNeighborhood}`,
        `Pontos-chave: ${primaryBus.stopsSample.slice(0, 3).join(' • ')}`,
      ],
      estimatedMinutes: busTripMin,
      distanceKm: Number((drivingKm).toFixed(1)),
      fareText: 'R$ 5,20 (Aceita SalvadorCARD, Cartão de Crédito/Débito por aproximação e Dinheiro)',
      description: `Utilize a Linha ${primaryBus.number} (${primaryBus.name}) que percorre ${primaryBus.corridor}, parando nos principais abrigos de Salvador.`,
      integrationNote: 'Integração de 2 horas entre diferentes linhas urbanas ou com o Metrô.',
    },
    {
      type: 'car',
      title: 'Carro / Aplicativo (Uber & 99) / Moto Táxi',
      linesOrStations: [
        'Vias principais: Av. Paralela, Av. ACM, Orla ou Garibaldi',
        'Vagas na região e pontos de parada rápida',
      ],
      estimatedMinutes: carTripMin,
      distanceKm: drivingKm,
      fareText: `Estimativa App: R$ ${(12 + drivingKm * 2.8).toFixed(2).replace('.', ',')} a R$ ${(18 + drivingKm * 3.5).toFixed(2).replace('.', ',')}`,
      description: 'Trajeto rodoviário direto pelos corredores de tráfego de Salvador.',
      trafficStatus: 'Moderado',
    },
    {
      type: 'walking',
      title: 'Caminhada a Pé',
      linesOrStations: [
        `Distância direta: ${directKm} km`,
        'Atenção aos aclives, ladeiras e calçadões de Salvador',
      ],
      estimatedMinutes: walkTripMin,
      distanceKm: directKm,
      fareText: 'Gratuito',
      description: 'Ideal para distâncias curtas pelo calçadão da orla, centros comerciais ou pelourinho.',
    },
  ];
}
