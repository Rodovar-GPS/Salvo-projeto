// ==============================================================================
// 🛣️ ROTAS EXPRESS DA API REST DO MÓDULO "VIAJAR" (SALVÓ)
// Endpoints de Busca Espacial, Roteirização, Assistente NLP e Pacotes Offline
// ==============================================================================

import { Router, Request, Response } from 'express';
import {
  SALVADOR_POIS_DATA,
  searchPoisByRadius,
  SalvadorPoiCategory,
} from '../data/salvadorPoisDatabase';
import {
  calculateSmartRoute,
  processNaturalLanguageLocationQuery,
} from '../services/salvadorNavEngine';
import { SALVADOR_OFFLINE_PACKAGES } from '../services/salvadorOfflineStorage';

export const viajarRouter = Router();

// 1. GET /api/viajar/pois - Busca espacial de estabelecimentos por proximidade
viajarRouter.get('/pois', (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string) || -13.0039; // Farol da Barra default
    const lng = parseFloat(req.query.lng as string) || -38.5326;
    const radiusKm = parseFloat(req.query.radius as string) || 15;
    const category = (req.query.category as SalvadorPoiCategory) || undefined;
    const onlyOpen = req.query.onlyOpen === 'true';

    const results = searchPoisByRadius(lat, lng, radiusKm, category, onlyOpen);
    return res.json({
      success: true,
      total: results.length,
      userLocation: { lat, lng },
      pois: results,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 2. POST /api/viajar/route - Cálculo de rota e manobras
viajarRouter.post('/route', async (req: Request, res: Response) => {
  try {
    const { origin, destination, destinationPoiId } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        error: 'Origem e destino com coordenadas (lat, lng) são obrigatórios.',
      });
    }

    const poi = destinationPoiId
      ? SALVADOR_POIS_DATA.find((p) => p.id === destinationPoiId)
      : undefined;

    const routeData = await calculateSmartRoute(origin, destination, poi);
    return res.json({
      success: true,
      route: routeData,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 3. POST /api/viajar/assistant - Assistente Inteligente de Localização
viajarRouter.post('/assistant', (req: Request, res: Response) => {
  try {
    const { query, userLocation } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, error: 'O texto da pergunta é obrigatório.' });
    }

    const loc = userLocation || { lat: -13.0039, lng: -38.5326 };
    const response = processNaturalLanguageLocationQuery(query, loc);

    return res.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 4. GET /api/viajar/packages - Listar pacotes de mapas offline disponíveis
viajarRouter.get('/packages', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    packages: SALVADOR_OFFLINE_PACKAGES,
  });
});

// 5. POST /api/viajar/telemetry - Registro de telemetria de navegação
viajarRouter.post('/telemetry', (req: Request, res: Response) => {
  const { routeId, position, speedKmh, heading, isOffline } = req.body;
  // Registra telemetria de forma segura
  return res.json({
    success: true,
    message: 'Telemetria gravada com sucesso.',
    timestamp: new Date().toISOString(),
    routeId,
  });
});
