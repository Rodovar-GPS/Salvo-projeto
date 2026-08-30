import { Request, Response } from 'express';
import { FeEngineAuctionService } from '../services/feEngineAuctionService';

export class FeAuctionController {
  /**
   * Executa o leilão em tempo real e entrega o anúncio vencedor
   * POST /api/fe/auction/serve
   */
  public static serveAd(req: Request, res: Response) {
    const { userId, userNeighborhood = 'Barra', userCategoryInterest = 'Geral' } = req.body;

    const result = FeEngineAuctionService.selectBestAd({
      userId,
      userNeighborhood,
      userCategoryInterest,
    });

    return res.json(result);
  }

  /**
   * Registra clique e desconta do orçamento da campanha
   * POST /api/fe/auction/click
   */
  public static handleClick(req: Request, res: Response) {
    const { adId } = req.body;

    if (!adId) {
      return res.status(400).json({ error: 'adId é obrigatório.' });
    }

    const result = FeEngineAuctionService.processAdClick(adId);
    return res.json(result);
  }
}
