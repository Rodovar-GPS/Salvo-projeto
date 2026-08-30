import { Request, Response } from 'express';
import {
  getStoredFeCampaigns,
  saveStoredFeCampaigns,
  getStoredFePayments,
  saveStoredFePayments,
  MONTHLY_REVENUE_HISTORY,
  FE_MANAGEMENT_FEE_MONTHLY,
} from '../data/salvoFeDatabase';

export class FeAdminController {
  /**
   * Retorna resumo financeiro e métricas para o Painel Admin
   * GET /api/fe/admin/overview
   */
  public static getAdminOverview(req: Request, res: Response) {
    const campaigns = getStoredFeCampaigns();
    const payments = getStoredFePayments();

    const activeCampaigns = campaigns.filter((c) => c.status === 'active' && c.paymentStatus === 'paid');
    const pendingAdsCount = campaigns.reduce(
      (acc, c) => acc + c.ads.filter((a) => a.status === 'pending').length,
      0
    );

    const paidPayments = payments.filter((p) => p.status === 'paid');
    const totalRevenue = paidPayments.reduce((acc, p) => acc + p.amount, 0);
    const totalManagementFees = paidPayments.reduce((acc, p) => acc + p.managementFee, 0);
    const totalMediaBudget = paidPayments.reduce((acc, p) => acc + p.mediaAmount, 0);

    const totalImpressions = campaigns.reduce(
      (acc, c) => acc + c.ads.reduce((aAcc, ad) => aAcc + ad.impressions, 0),
      0
    );
    const totalClicks = campaigns.reduce(
      (acc, c) => acc + c.ads.reduce((aAcc, ad) => aAcc + ad.clicks, 0),
      0
    );

    return res.json({
      success: true,
      metrics: {
        totalRevenue,
        totalManagementFees,
        totalMediaBudget,
        activeMerchantsCount: activeCampaigns.length,
        pendingAdsCount,
        totalImpressions,
        totalClicks,
        averageCtr: totalImpressions > 0 ? Number(((totalClicks / totalImpressions) * 100).toFixed(2)) : 0,
      },
      revenueHistory: MONTHLY_REVENUE_HISTORY,
      recentPayments: payments,
      campaigns,
    });
  }

  /**
   * Modera um anúncio (Aprovar ou Rejeitar)
   * POST /api/fe/admin/ads/:adId/moderate
   */
  public static moderateAd(req: Request, res: Response) {
    const { adId } = req.params;
    const { status, moderationNotes } = req.body;

    if (!['approved', 'rejected', 'paused'].includes(status)) {
      return res.status(400).json({ error: 'Status de moderação inválido.' });
    }

    const campaigns = getStoredFeCampaigns();
    let found = false;

    const updatedCampaigns = campaigns.map((camp) => {
      const adIdx = camp.ads.findIndex((a) => a.id === adId);
      if (adIdx >= 0) {
        const ad = camp.ads[adIdx];
        const newAds = [...camp.ads];
        newAds[adIdx] = {
          ...ad,
          status,
          moderationNotes: moderationNotes || (status === 'approved' ? 'Anúncio aprovado pela moderação.' : 'Necessita ajustes no texto/imagem.'),
          reviewedBy: 'Admin SALVÓ Fé',
          reviewedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        found = true;
        return { ...camp, ads: newAds };
      }
      return camp;
    });

    if (!found) {
      return res.status(404).json({ error: 'Anúncio não encontrado.' });
    }

    saveStoredFeCampaigns(updatedCampaigns);

    return res.json({
      success: true,
      message: `Anúncio ${status === 'approved' ? 'aprovado' : 'atualizado'} com sucesso!`,
    });
  }

  /**
   * Atualiza status de pagamento do lojista (ex: Webhook PagSeguro/Stripe)
   * POST /api/fe/admin/payments/:paymentId/status
   */
  public static updatePaymentStatus(req: Request, res: Response) {
    const { paymentId } = req.params;
    const { status } = req.body;

    const payments = getStoredFePayments();
    const paymentIndex = payments.findIndex((p) => p.id === paymentId);

    if (paymentIndex === -1) {
      return res.status(404).json({ error: 'Pagamento não encontrado.' });
    }

    const payment = payments[paymentIndex];
    payment.status = status;
    if (status === 'paid') {
      payment.paidAt = new Date().toISOString();
    }
    payments[paymentIndex] = payment;
    saveStoredFePayments(payments);

    // Atualiza a campanha correspondente
    const campaigns = getStoredFeCampaigns();
    const campIndex = campaigns.findIndex((c) => c.merchantId === payment.merchantId || c.storeName === payment.storeName);
    if (campIndex >= 0) {
      campaigns[campIndex].paymentStatus = status;
      if (status === 'paid') {
        campaigns[campIndex].status = 'active';
      }
      saveStoredFeCampaigns(campaigns);
    }

    return res.json({
      success: true,
      message: `Status do pagamento atualizado para: ${status}`,
      payment,
    });
  }
}
