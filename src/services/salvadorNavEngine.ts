// ==============================================================================
// 🚗 MOTOR DE NAVEGAÇÃO GPS PROFISSIONAL & ASSISTENTE INTELIGENTE "VIAJAR"
// Roteirização OSRM, Instruções Passo a Passo, Áudio Síntese e Assistente NLP
// ==============================================================================

import { SalvadorPoi, SALVADOR_POIS_DATA, searchPoisByRadius, calculateHaversineKm } from '../data/salvadorPoisDatabase';
import { offlineStorageService } from './salvadorOfflineStorage';

export interface TurnManeuver {
  id: string;
  stepIndex: number;
  instruction: string;
  streetName: string;
  type: 'depart' | 'turn-right' | 'turn-left' | 'straight' | 'roundabout' | 'arrive' | 'uturn' | 'merge';
  distanceMeters: number;
  durationSeconds: number;
  lat: number;
  lng: number;
  isCompleted?: boolean;
}

export interface NavigationRouteData {
  id: string;
  originName: string;
  destinationName: string;
  destinationPoi?: SalvadorPoi;
  originCoords: { lat: number; lng: number };
  destCoords: { lat: number; lng: number };
  totalDistanceKm: number;
  totalDurationMinutes: number;
  polyline: [number, number][]; // [lat, lng][]
  maneuvers: TurnManeuver[];
  trafficCondition: 'livre' | 'moderado' | 'intenso' | 'lento';
  isOffline: boolean;
  calculatedAt: string;
}

export interface NavigationLiveState {
  currentPosition: { lat: number; lng: number };
  heading: number; // 0 to 360 deg
  speedKmh: number;
  currentManeuverIndex: number;
  currentManeuver: TurnManeuver;
  distanceToNextManeuverMeters: number;
  remainingDistanceKm: number;
  remainingDurationMinutes: number;
  isOffRoute: boolean;
  hasArrived: boolean;
  progressPercent: number;
}

export interface NlpAssistantResponse {
  query: string;
  recognizedCategory?: string;
  answerText: string;
  speechText: string;
  matchedPois: (SalvadorPoi & { distanceKm: number })[];
  suggestedAction?: 'navigate' | 'filter' | 'info';
  targetPoi?: SalvadorPoi & { distanceKm: number };
}

// ==========================================
// 1. CÁLCULO DE ÂNGULO / BEARING (DIREÇÃO DO VEÍCULO)
// ==========================================
export function calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const y = Math.sin((lng2 - lng1) * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180));
  const x =
    Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
    Math.sin(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.cos((lng2 - lng1) * (Math.PI / 180));
  const brng = Math.atan2(y, x) * (180 / Math.PI);
  return (brng + 360) % 360;
}

// ==========================================
// 2. VOZ & SÍNTESE DE ÁUDIO NAVEGACIONAL (PT-BR)
// ==========================================
export function speakNavInstruction(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  try {
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Tentar selecionar voz brasileira de alta qualidade se disponível
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find((v) => v.lang.includes('pt-BR') || v.lang.includes('pt_BR'));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('[SALVÓ VIAJAR Voice] Erro ao reproduzir instrução por voz:', e);
  }
}

// ==========================================
// 3. CALCULAR ROTA INTELIGENTE (ONLINE OSRM OU OFFLINE TOPOLOGIA)
// ==========================================
export async function calculateSmartRoute(
  origin: { lat: number; lng: number; name?: string },
  dest: { lat: number; lng: number; name?: string },
  destPoi?: SalvadorPoi
): Promise<NavigationRouteData> {
  const isOnline = offlineStorageService.getOnlineStatus();
  const directDistanceKm = calculateHaversineKm(origin.lat, origin.lng, dest.lat, dest.lng);
  const routeId = `route-${Date.now()}`;

  let polyline: [number, number][] = [];
  let totalDistanceKm = Number((directDistanceKm * 1.32).toFixed(1));
  let totalDurationMinutes = Math.max(3, Math.round(totalDistanceKm * 2.6));
  let maneuvers: TurnManeuver[] = [];

  if (isOnline) {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson&steps=true`;
      const response = await fetch(url, { signal: AbortSignal.timeout(6000) });

      if (response.ok) {
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          totalDistanceKm = Number((route.distance / 1000).toFixed(1));
          totalDurationMinutes = Math.max(2, Math.round(route.duration / 60));

          // GeoJSON to Leaflet [lat, lng]
          polyline = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);

          // Extrair manobras reais do OSRM
          if (route.legs && route.legs[0] && route.legs[0].steps) {
            const steps = route.legs[0].steps;
            maneuvers = steps.map((step: any, index: number) => {
              let type: TurnManeuver['type'] = 'straight';
              const maneuverType = step.maneuver?.type || '';
              const modifier = step.maneuver?.modifier || '';

              if (maneuverType === 'depart') type = 'depart';
              else if (maneuverType === 'arrive') type = 'arrive';
              else if (modifier.includes('right')) type = 'turn-right';
              else if (modifier.includes('left')) type = 'turn-left';
              else if (modifier.includes('uturn')) type = 'uturn';
              else if (maneuverType.includes('roundabout')) type = 'roundabout';

              const street = step.name || 'Via Principal';
              let instruction = '';

              if (type === 'depart') {
                instruction = `Siga em direção a ${street}`;
              } else if (type === 'turn-right') {
                instruction = `Vire à direita na ${street}`;
              } else if (type === 'turn-left') {
                instruction = `Vire à esquerda na ${street}`;
              } else if (type === 'roundabout') {
                instruction = `Na rotatória, siga para ${street}`;
              } else if (type === 'arrive') {
                instruction = `Você chegou ao seu destino: ${dest.name || 'Ponto Selecionado'}`;
              } else {
                instruction = `Continue na ${street}`;
              }

              return {
                id: `step-${index}`,
                stepIndex: index,
                instruction,
                streetName: street,
                type,
                distanceMeters: Math.round(step.distance || 200),
                durationSeconds: Math.round(step.duration || 30),
                lat: step.maneuver?.location ? step.maneuver.location[1] : polyline[0]?.[0] || origin.lat,
                lng: step.maneuver?.location ? step.maneuver.location[0] : polyline[0]?.[1] || origin.lng,
              };
            });
          }
        }
      }
    } catch {
      // Fallback em caso de erro na API do OSRM
    }
  }

  // Se não obteve polylines via OSRM (modo offline ou erro de rede), gerar malha de navegação vetorial de Salvador
  if (polyline.length === 0) {
    const waypointsCount = 18;
    polyline = [];
    for (let i = 0; i <= waypointsCount; i++) {
      const t = i / waypointsCount;
      // Curvatura urbana de Salvador para evitar linha reta perfeita
      const curveFactor = Math.sin(t * Math.PI) * 0.004;
      const lat = origin.lat + (dest.lat - origin.lat) * t + curveFactor;
      const lng = origin.lng + (dest.lng - origin.lng) * t - curveFactor * 0.6;
      polyline.push([lat, lng]);
    }

    // Gerar manobras sintéticas
    const streetNames = [
      'Av. Octávio Mangabeira',
      'Av. Centenário',
      'Av. Anita Garibaldi',
      'Av. Luís Viana Filho (Paralela)',
      'Av. Antônio Carlos Magalhães (ACM)',
      'Rua Miguel Burnier',
      'Largo de Santana',
    ];

    maneuvers = [
      {
        id: 'step-0',
        stepIndex: 0,
        instruction: `Siga em frente pela ${streetNames[0]}`,
        streetName: streetNames[0],
        type: 'depart',
        distanceMeters: 450,
        durationSeconds: 60,
        lat: polyline[0][0],
        lng: polyline[0][1],
      },
      {
        id: 'step-1',
        stepIndex: 1,
        instruction: `Em 300 metros, vire à direita na ${streetNames[1]}`,
        streetName: streetNames[1],
        type: 'turn-right',
        distanceMeters: 1200,
        durationSeconds: 150,
        lat: polyline[4][0],
        lng: polyline[4][1],
      },
      {
        id: 'step-2',
        stepIndex: 2,
        instruction: `Na rotatória, pegue a 2ª saída em direção à ${dest.name || 'seu destino'}`,
        streetName: streetNames[3],
        type: 'roundabout',
        distanceMeters: 800,
        durationSeconds: 110,
        lat: polyline[10][0],
        lng: polyline[10][1],
      },
      {
        id: 'step-3',
        stepIndex: 3,
        instruction: `Vire à esquerda na via de acesso local`,
        streetName: 'Via Local',
        type: 'turn-left',
        distanceMeters: 300,
        durationSeconds: 45,
        lat: polyline[14][0],
        lng: polyline[14][1],
      },
      {
        id: 'step-4',
        stepIndex: 4,
        instruction: `Você chegou ao seu destino: ${dest.name || 'Local Escolhido'}`,
        streetName: dest.name || 'Destino',
        type: 'arrive',
        distanceMeters: 0,
        durationSeconds: 0,
        lat: polyline[polyline.length - 1][0],
        lng: polyline[polyline.length - 1][1],
      },
    ];
  }

  // Garantir que exista manobra de chegada
  if (maneuvers.length === 0) {
    maneuvers.push({
      id: 'step-arrive',
      stepIndex: 0,
      instruction: `Siga direto para ${dest.name || 'o destino'}`,
      streetName: dest.name || 'Destino',
      type: 'arrive',
      distanceMeters: Math.round(totalDistanceKm * 1000),
      durationSeconds: totalDurationMinutes * 60,
      lat: dest.lat,
      lng: dest.lng,
    });
  }

  return {
    id: routeId,
    originName: origin.name || 'Minha Localização Atual',
    destinationName: dest.name || 'Destino Selecionado',
    destinationPoi: destPoi,
    originCoords: { lat: origin.lat, lng: origin.lng },
    destCoords: { lat: dest.lat, lng: dest.lng },
    totalDistanceKm,
    totalDurationMinutes,
    polyline,
    maneuvers,
    trafficCondition: isOnline ? 'moderado' : 'livre',
    isOffline: !isOnline,
    calculatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  };
}

// ==========================================
// 4. ASSISTENTE DE LOCALIZAÇÃO INTELIGENTE (NLP / PROCESSAMENTO DE PERGUNTAS)
// ==========================================
export function processNaturalLanguageLocationQuery(
  rawQuery: string,
  userLocation: { lat: number; lng: number }
): NlpAssistantResponse {
  const query = rawQuery.toLowerCase().trim();

  // 1. Classificação de Intenção & Categoria
  let matchedCategory: SalvadorPoi['category'] | undefined;
  let categoryLabel = '';

  if (
    query.includes('posto') ||
    query.includes('gasolina') ||
    query.includes('combustivel') ||
    query.includes('abastecer') ||
    query.includes('gnv') ||
    query.includes('etanol')
  ) {
    matchedCategory = 'posto_combustivel';
    categoryLabel = 'Postos de Gasolina & Combustível';
  } else if (
    query.includes('shopping') ||
    query.includes('loja') ||
    query.includes('compras') ||
    query.includes('cinema')
  ) {
    matchedCategory = 'shopping';
    categoryLabel = 'Shoppings Centers';
  } else if (
    query.includes('padaria') ||
    query.includes('pão') ||
    query.includes('pao') ||
    query.includes('café') ||
    query.includes('cafe') ||
    query.includes('delicatessen') ||
    query.includes('lanche')
  ) {
    matchedCategory = 'padaria';
    categoryLabel = 'Padarias & Delicatessens';
  } else if (
    query.includes('farmacia') ||
    query.includes('farmácia') ||
    query.includes('drogaria') ||
    query.includes('remedio') ||
    query.includes('remédio') ||
    query.includes('24h') ||
    query.includes('24 horas')
  ) {
    matchedCategory = 'farmacia';
    categoryLabel = 'Farmácias & Drogarias';
  } else if (
    query.includes('hospital') ||
    query.includes('upa') ||
    query.includes('emergencia') ||
    query.includes('emergência') ||
    query.includes('pronto socorro') ||
    query.includes('médico')
  ) {
    matchedCategory = 'hospital_upa';
    categoryLabel = 'Hospitais & UPAs 24h';
  } else if (
    query.includes('ponto turistico') ||
    query.includes('turismo') ||
    query.includes('farol') ||
    query.includes('pelourinho') ||
    query.includes('bonfim') ||
    query.includes('lacerda') ||
    query.includes('museu') ||
    query.includes('praia')
  ) {
    matchedCategory = 'ponto_turistico';
    categoryLabel = 'Pontos Turísticos de Salvador';
  } else if (
    query.includes('restaurante') ||
    query.includes('acaraje') ||
    query.includes('acarajé') ||
    query.includes('moqueca') ||
    query.includes('comida') ||
    query.includes('almoço') ||
    query.includes('almoco') ||
    query.includes('sorvete')
  ) {
    matchedCategory = 'restaurante';
    categoryLabel = 'Restaurantes & Acarajé';
  } else if (
    query.includes('supermercado') ||
    query.includes('mercado') ||
    query.includes('atacadão') ||
    query.includes('atacadao')
  ) {
    matchedCategory = 'supermercado';
    categoryLabel = 'Supermercados & Mercados';
  } else if (
    query.includes('oficina') ||
    query.includes('mecanico') ||
    query.includes('mecânico') ||
    query.includes('pneu') ||
    query.includes('borracheiro') ||
    query.includes('carro quebrou')
  ) {
    matchedCategory = 'oficina_mecanica';
    categoryLabel = 'Oficinas Mecânicas & Auto Centers';
  }

  // 2. Filtragem e Ordenação por Proximidade
  const onlyOpen = query.includes('aberta') || query.includes('aberto') || query.includes('agora');
  const results = searchPoisByRadius(
    userLocation.lat,
    userLocation.lng,
    25,
    matchedCategory,
    onlyOpen
  );

  if (results.length > 0) {
    const closest = results[0];
    const answerText = `Encontrei **${results.length}** locais em Salvador. O mais próximo de você é o **${closest.name}** no bairro **${closest.neighborhood}**, a apenas **${closest.distanceKm.toFixed(1)} km** (${closest.isOpenNow ? '🟢 Aberto agora' : '🔴 Fechado no momento'}).`;
    const speechText = `Encontrei o ${closest.name} no bairro ${closest.neighborhood}, a ${closest.distanceKm.toFixed(1)} quilômetros de você. Deseja traçar a rota agora?`;

    return {
      query: rawQuery,
      recognizedCategory: categoryLabel,
      answerText,
      speechText,
      matchedPois: results.slice(0, 5),
      suggestedAction: 'navigate',
      targetPoi: closest,
    };
  }

  // Busca genérica por texto no nome de estabelecimentos
  const genericMatches = SALVADOR_POIS_DATA.filter((p) =>
    p.name.toLowerCase().includes(query) ||
    p.neighborhood.toLowerCase().includes(query) ||
    p.address.toLowerCase().includes(query)
  )
    .map((p) => ({
      ...p,
      distanceKm: calculateHaversineKm(userLocation.lat, userLocation.lng, p.lat, p.lng),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  if (genericMatches.length > 0) {
    const closest = genericMatches[0];
    return {
      query: rawQuery,
      recognizedCategory: 'Busca Direta em Salvador',
      answerText: `Localizei **${closest.name}** em **${closest.neighborhood}**, a **${closest.distanceKm.toFixed(1)} km** de você.`,
      speechText: `Localizei ${closest.name} em ${closest.neighborhood}.`,
      matchedPois: genericMatches.slice(0, 5),
      suggestedAction: 'navigate',
      targetPoi: closest,
    };
  }

  return {
    query: rawQuery,
    answerText: `Não encontrei nenhum local exato para "${rawQuery}". Tente perguntar por postos de gasolina, shoppings, padarias, farmácias 24h ou pontos turísticos de Salvador.`,
    speechText: `Não localizei resultados para essa busca em Salvador. Experimente pesquisar por postos ou shoppings mais próximos.`,
    matchedPois: [],
    suggestedAction: 'info',
  };
}
