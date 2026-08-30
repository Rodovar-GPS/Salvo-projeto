import { Router } from 'express';
import { FeCampaignController } from '../controllers/feCampaignController';
import { FeAdminController } from '../controllers/feAdminController';
import { FeAuctionController } from '../controllers/feAuctionController';
import { authenticateJwt, requireAdminRole, requireMerchantRole } from '../middlewares/authJwt';
import { validatePlanPurchasePayload, validateAdCreativePayload } from '../middlewares/feValidator';

const router = Router();

// ==========================================
// 🕊️ ROTAS PÚBLICAS & CLIENTE
// ==========================================
// Lista os 3 planos SALVÓ Fé com simulações
router.get('/plans', FeCampaignController.getPlans);

// Roda o leilão Fé Engine e entrega o melhor anúncio para o usuário
router.post('/auction/serve', FeAuctionController.serveAd);

// Registra clique no anúncio
router.post('/auction/click', FeAuctionController.handleClick);

// ==========================================
// 💼 ROTAS DO LOJISTA (ANUNCIANTE)
// ==========================================
// Contratação de Plano & Checkout (Local: R$197, Plus: R$347, Premium: R$597)
router.post(
  '/campaigns/hire',
  validatePlanPurchasePayload,
  FeCampaignController.hirePlan
);

// Criação de Anúncio / Criativo
router.post(
  '/ads/create',
  validateAdCreativePayload,
  FeCampaignController.createAdCreative
);

// Listagem de Campanhas do Lojista
router.get('/campaigns/merchant/:merchantId', FeCampaignController.getMerchantCampaigns);

// ==========================================
// 🛡️ ROTAS DO PAINEL ADMINISTRATIVO (SALVÓ FÉ ADMIN)
// ==========================================
// Visão geral de faturamento, pagamentos e métricas
router.get('/admin/overview', FeAdminController.getAdminOverview);

// Aprovar ou Rejeitar anúncio de lojista
router.post('/admin/ads/:adId/moderate', FeAdminController.moderateAd);

// Atualizar status de pagamento (Webhook ou Ação Admin)
router.post('/admin/payments/:paymentId/status', FeAdminController.updatePaymentStatus);

export default router;
