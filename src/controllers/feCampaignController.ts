import { Request, Response } from 'express';
import {
  FE_PLANS,
  FE_MANAGEMENT_FEE_MONTHLY,
  getStoredFeCampaigns,
  saveStoredFeCampaigns,
  getStoredFePayments,
  saveStoredFePayments,
} from '../data/salvoFeDatabase';
import { FeCampaign, FeAdCreative, FePaymentRecord, FePlanTier } from '../types';

export class FeCampaignController {
  /**
   * Retorna os 3 planos disponíveis com preços e benefícios
   * GET /api/fe/plans
   */
  public static getPlans(req: Request, res: Response) {
    return res.json({
      success: true,
      managementFee: FE_MANAGEMENT_FEE_MONTHLY,
      plans: Object.values(FE_PLANS),
    });
  }

  /**
   * Contratação de Plano e Criação de Campanha
   * POST /api/fe/campaigns/hire
   */
  public static hirePlan(req: Request, res: Response) {
    const {
      planId,
      merchantId = `merch-${Date.now()}`,
      merchantName,
      merchantEmail,
      merchantPhone,
      storeName,
      paymentMethod = 'pix',
    } = req.body;

    const plan = FE_PLANS[planId as FePlanTier];
    if (!plan) {
      return res.status(400).json({ error: 'Plano não encontrado.' });
    }

    const campaignId = `camp-fe-${Date.now()}`;
    const paymentId = `pay-fe-${Date.now()}`;

    // Cria o pagamento
    const paymentRecord: FePaymentRecord = {
      id: paymentId,
      merchantId,
      merchantName,
      storeName,
      planId: plan.id,
      planName: plan.name,
      amount: plan.price,
      managementFee: plan.managementFee,
      mediaAmount: plan.netMediaBudget,
      paymentMethod,
      status: paymentMethod === 'credit_card' ? 'paid' : 'pending',
      gatewayTransactionId: `GW_${Date.now()}_${Math.floor(Math.random() * 99999)}`,
      paidAt: paymentMethod === 'credit_card' ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      pixQrCode:
        paymentMethod === 'pix'
          ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020126580014br.gov.bcb.pix0136salvo.fe.pagamentos@salvo.ba5204000053039865405${plan.price.toFixed(
              2
            )}5802BR5916SALVO%20FE%20MIDIA6008SALVADOR62070503***6304ABCD`
          : undefined,
      pixCopiaECola:
        paymentMethod === 'pix'
          ? `00020126580014br.gov.bcb.pix0136salvo.fe.pagamentos@salvo.ba5204000053039865405${plan.price.toFixed(
              2
            )}5802BR5916SALVO%20FE%20MIDIA6008SALVADOR62070503***6304ABCD`
          : undefined,
    };

    // Cria a campanha associada
    const newCampaign: FeCampaign = {
      id: campaignId,
      merchantId,
      merchantName,
      merchantEmail: merchantEmail || `${merchantId}@salvo.ba`,
      merchantPhone: merchantPhone || '(71) 99999-0000',
      storeName,
      planId: plan.id,
      planName: plan.name,
      monthlyPrice: plan.price,
      managementFee: plan.managementFee,
      totalBudget: plan.netMediaBudget,
      remainingBudget: plan.netMediaBudget,
      status: paymentRecord.status === 'paid' ? 'active' : 'pending_payment',
      paymentStatus: paymentRecord.status,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      ads: [],
    };

    // Persiste
    const existingPayments = getStoredFePayments();
    saveStoredFePayments([paymentRecord, ...existingPayments]);

    const existingCampaigns = getStoredFeCampaigns();
    saveStoredFeCampaigns([newCampaign, ...existingCampaigns]);

    return res.status(201).json({
      success: true,
      message: 'Plano contratado com sucesso!',
      campaign: newCampaign,
      payment: paymentRecord,
    });
  }

  /**
   * Criação de Anúncio / Criativo para a Campanha
   * POST /api/fe/ads/create
   */
  public static createAdCreative(req: Request, res: Response) {
    const {
      campaignId,
      merchantId,
      storeName,
      title,
      description,
      imageUrl,
      ctaText = 'Ver no WhatsApp',
      destinationUrl,
      targetNeighborhoods = ['Todos os Bairros'],
      targetCategories = ['Geral'],
      bidCpc = 0.50,
    } = req.body;

    const campaigns = getStoredFeCampaigns();
    const campaignIndex = campaigns.findIndex((c) => c.id === campaignId);

    if (campaignIndex === -1) {
      return res.status(404).json({ error: 'Campanha não encontrada.' });
    }

    const campaign = campaigns[campaignIndex];

    const newAd: FeAdCreative = {
      id: `ad-fe-${Date.now()}`,
      campaignId,
      merchantId: merchantId || campaign.merchantId,
      storeName: storeName || campaign.storeName,
      title,
      description,
      imageUrl,
      ctaText,
      destinationUrl,
      targetNeighborhoods: Array.isArray(targetNeighborhoods) ? targetNeighborhoods : [targetNeighborhoods],
      targetCategories: Array.isArray(targetCategories) ? targetCategories : [targetCategories],
      bidCpc: Number(bidCpc) || (campaign.planId === 'premium' ? 0.40 : campaign.planId === 'plus' ? 0.45 : 0.50),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      impressions: 0,
      clicks: 0,
      spentAmount: 0.0,
      ctr: 0.0,
    };

    campaign.ads = [newAd, ...campaign.ads];
    campaigns[campaignIndex] = campaign;

    saveStoredFeCampaigns(campaigns);

    return res.status(201).json({
      success: true,
      message: 'Anúncio enviado para moderação com sucesso!',
      ad: newAd,
    });
  }

  /**
   * Lista as campanhas do lojista
   * GET /api/fe/campaigns/merchant/:merchantId
   */
  public static getMerchantCampaigns(req: Request, res: Response) {
    const { merchantId } = req.params;
    const campaigns = getStoredFeCampaigns();

    const merchantCampaigns = campaigns.filter(
      (c) => c.merchantId === merchantId || merchantId === 'all'
    );

    return res.json({
      success: true,
      campaigns: merchantCampaigns,
    });
  }
}
