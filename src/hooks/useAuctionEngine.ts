// ==============================================================================
// 🎯 USE AUCTION ENGINE HOOK — LEILÃO SALVÓ ADS (A CIDADE DAS MARÉS)
// ==============================================================================

import { useState, useMemo } from 'react';
import { FeEngineAuctionService } from '../services/feEngineAuctionService';
import { recordFeAdImpression } from '../data/salvoFeDatabase';
import { FeEngineAuctionScore, FeAdCreative, FeCampaign } from '../types';

export function useAuctionEngine(userNeighborhood = 'Barra', targetCategory = 'Geral') {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const auctionResult = useMemo(() => {
    return FeEngineAuctionService.selectBestAd({
      userNeighborhood,
      userCategoryInterest: targetCategory,
    });
  }, [userNeighborhood, targetCategory, refreshTrigger]);

  const topAd: FeAdCreative | null = auctionResult.ad;
  const topCampaign: FeCampaign | null = auctionResult.campaign;
  const rankedScores: FeEngineAuctionScore[] = auctionResult.auctionTelemetry.allRankedScores;

  const refreshAuction = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const registerClick = (adId: string) => {
    FeEngineAuctionService.processAdClick(adId);
    refreshAuction();
  };

  const registerImpression = (adId: string) => {
    recordFeAdImpression(adId);
  };

  return {
    topAd,
    topCampaign,
    rankedScores,
    auctionTelemetry: auctionResult.auctionTelemetry,
    refreshAuction,
    registerClick,
    registerImpression,
  };
}
