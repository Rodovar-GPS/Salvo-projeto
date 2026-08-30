/**
 * ============================================================================
 * 🕊️ MOTOR DE LEILÃO E RELEVÂNCIA: "FÉ ENGINE"
 * ============================================================================
 *
 * PSEUDOCÓDIGO DO ALGORITMO FÉ ENGINE:
 * ----------------------------------------------------------------------------
 * FUNÇÃO ExecutarLeilaoFeEngine(usuarioId, bairroUsuario, categoriaInteresse):
 *   1. Obter todas as campanhas ONDE status == 'ativa' E status_pagamento == 'pago' E saldo_restante > 0.40
 *   2. Extrair anúncios ativos ONDE status == 'aprovado'
 *   3. SE lista_candidatos estiver vazia:
 *        RETORNAR NULO
 *   4. PARA CADA anúncio candidato:
 *        a. Calcular PontuacaoGeo:
 *             SE bairroUsuario ESTÁ EM anuncio.bairrosAlvo -> Geo = 1.0
 *             SENAO SE anuncio.bairrosAlvo CONTÉM 'Todos' -> Geo = (plano == 'premium' ? 0.9 : 0.7)
 *             SENAO -> Geo = 0.2
 *        b. Calcular PontuacaoCategoria:
 *             SE categoriaInteresse ESTÁ EM anuncio.categoriasAlvo -> Cat = 1.0
 *             SENAO -> Cat = 0.5
 *        c. Calcular PontuacaoQualidade:
 *             Qualidade = MIN(1.0, anuncio.ctr_historico / 3.0)
 *        d. Calcular RelevanciaUsuario = (Geo * 0.5) + (Cat * 0.3) + (Qualidade * 0.2)
 *             SE plano == 'premium' -> Relevancia = Relevancia * 1.15
 *        e. Normalizar LanceAnunciante = (anuncio.lance_cpc / 1.0)
 *        f. Calcular PontuacaoFinal = (LanceAnunciante * 0.6) + (RelevanciaUsuario * 0.4)
 *   5. Ordenar candidatos por PontuacaoFinal DECRESCENTE
 *   6. Selecionar Vencedor = candidatos[0]
 *   7. Incrementar contagem de impressões do Vencedor
 *   8. Registrar log de telemetria do leilão
 *   9. RETORNAR Vencedor
 * ----------------------------------------------------------------------------
 */

import {
  FeAdCreative,
  FeCampaign,
  FeEngineAuctionScore,
} from '../types';
import {
  getStoredFeCampaigns,
  recordFeAdImpression,
  recordFeAdClick,
} from '../data/salvoFeDatabase';

export interface FeAuctionInput {
  userId?: string;
  userNeighborhood: string;
  userCategoryInterest?: string;
}

export interface FeAuctionOutput {
  success: boolean;
  ad: FeAdCreative | null;
  campaign: FeCampaign | null;
  auctionTelemetry: {
    totalEligibleCandidates: number;
    winnerScore: number;
    explanation: string;
    allRankedScores: FeEngineAuctionScore[];
  };
}

export class FeEngineAuctionService {
  /**
   * Executa a seleção do anúncio mais adequado e com melhor retorno no leilão
   */
  public static selectBestAd(input: FeAuctionInput): FeAuctionOutput {
    const campaigns = getStoredFeCampaigns();
    const { userNeighborhood, userCategoryInterest = 'Geral' } = input;

    // 1. Filtrar anúncios ativos de campanhas ativas com saldo
    const eligible: { ad: FeAdCreative; campaign: FeCampaign }[] = [];

    for (const campaign of campaigns) {
      if (
        campaign.status === 'active' &&
        campaign.paymentStatus === 'paid' &&
        campaign.remainingBudget >= 0.40
      ) {
        for (const ad of campaign.ads) {
          if (ad.status === 'approved' && campaign.remainingBudget >= ad.bidCpc) {
            eligible.push({ ad, campaign });
          }
        }
      }
    }

    if (eligible.length === 0) {
      return {
        success: false,
        ad: null,
        campaign: null,
        auctionTelemetry: {
          totalEligibleCandidates: 0,
          winnerScore: 0,
          explanation: 'Nenhum anúncio elegível com saldo ativo no momento.',
          allRankedScores: [],
        },
      };
    }

    // 2 & 3. Calcular Relevância e Pontuação da Fé Engine: (Lance * 0.6) + (Relevância * 0.4)
    const rankedCandidates: FeEngineAuctionScore[] = eligible.map(({ ad, campaign }) => {
      // Geo match
      const targetExact = ad.targetNeighborhoods.some(
        (n) => n.toLowerCase() === userNeighborhood.toLowerCase()
      );
      const targetAll = ad.targetNeighborhoods.some(
        (n) => n.toLowerCase().includes('todos') || n.toLowerCase().includes('salvador')
      );

      let geoScore = 0.2;
      if (targetExact) {
        geoScore = 1.0;
      } else if (targetAll) {
        geoScore = campaign.planId === 'premium' ? 0.9 : 0.7;
      }

      // Category match
      let categoryScore = 0.5;
      if (
        userCategoryInterest !== 'Geral' &&
        ad.targetCategories.some((c) => c.toLowerCase().includes(userCategoryInterest.toLowerCase()))
      ) {
        categoryScore = 1.0;
      }

      // CTR quality score
      const qualityScore = Math.min(1.0, (ad.ctr || 1.5) / 3.0);

      // Plan boost (Fé Premium recebe bônus de prioridade na entrega)
      const planMultiplier = campaign.planId === 'premium' ? 1.15 : campaign.planId === 'plus' ? 1.05 : 1.0;

      const rawRelevance = (geoScore * 0.5 + categoryScore * 0.3 + qualityScore * 0.2) * planMultiplier;
      const userRelevance = Math.min(1.0, Math.max(0.05, rawRelevance));

      // Normalização do lance
      const advertiserBid = ad.bidCpc;
      const normalizedBid = advertiserBid / 1.0;

      // FÓRMULA MATEMÁTICA: (Lance * 0.6) + (Relevância * 0.4)
      const finalScore = Number(((normalizedBid * 0.6) + (userRelevance * 0.4)).toFixed(4));

      const explanation = `Lance R$ ${advertiserBid.toFixed(2)} (peso 60%) | Relevância ${Math.round(
        userRelevance * 100
      )}% (peso 40%) no bairro ${userNeighborhood}`;

      return {
        ad,
        campaign,
        advertiserBid,
        userRelevance,
        geoScore,
        categoryScore,
        qualityScore,
        finalScore,
        explanation,
      };
    });

    // 4. Ordenar candidatos pela maior pontuação
    rankedCandidates.sort((a, b) => b.finalScore - a.finalScore);

    const winner = rankedCandidates[0];

    // Registra a impressão entregue
    if (winner?.ad) {
      recordFeAdImpression(winner.ad.id);
    }

    return {
      success: true,
      ad: winner ? winner.ad : null,
      campaign: winner ? winner.campaign : null,
      auctionTelemetry: {
        totalEligibleCandidates: rankedCandidates.length,
        winnerScore: winner ? winner.finalScore : 0,
        explanation: winner ? winner.explanation : '',
        allRankedScores: rankedCandidates,
      },
    };
  }

  /**
   * Processa o clique do usuário no anúncio vencedor e debita o CPC do saldo da campanha
   */
  public static processAdClick(adId: string): { success: boolean; newRemainingBudget: number } {
    return recordFeAdClick(adId);
  }
}
