// ==============================================================================
// 🏷️ USE OFFERS HOOK — GESTÃO DE OFERTAS, CUPONS, TIMERS E CASHBACK CRUZADO
// ==============================================================================

import { useState, useMemo, useEffect } from 'react';
import { Offer, Store, StoreCategory } from '../types';
import { INITIAL_STORES } from '../data/mockData';

export function useOffers(filterCategory?: string, filterNeighborhood?: string) {
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [redeemedOfferIds, setRedeemedOfferIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('salvo_redeemed_offers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cashbackBalance, setCashbackBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('salvo_cashback_balance');
      return saved ? Number(saved) : 18.5;
    } catch {
      return 18.5;
    }
  });

  // Todas as ofertas ativas extraídas das lojas
  const allOffers = useMemo(() => {
    const list: (Offer & { store: Store; distanceKm: number })[] = [];
    stores.forEach((store) => {
      const distance = store.distanceKm || 1.8;
      (store.offers || []).forEach((offer) => {
        list.push({
          ...offer,
          store,
          distanceKm: distance,
        });
      });
    });
    return list;
  }, [stores]);

  // Ofertas filtradas
  const filteredOffers = useMemo(() => {
    return allOffers.filter((item) => {
      const matchCat = !filterCategory || filterCategory === 'all' || item.category === filterCategory;
      const matchNeigh = !filterNeighborhood || filterNeighborhood === 'all' || item.store.neighborhood === filterNeighborhood;
      return matchCat && matchNeigh;
    });
  }, [allOffers, filterCategory, filterNeighborhood]);

  // Resgatar cupom de oferta
  const redeemOffer = (offerId: string) => {
    if (!redeemedOfferIds.includes(offerId)) {
      const updated = [...redeemedOfferIds, offerId];
      setRedeemedOfferIds(updated);
      try {
        localStorage.setItem('salvo_redeemed_offers', JSON.stringify(updated));
      } catch {}

      // Bônus de cashback cruzado (+ R$ 5,00 p/ gastar em outra loja parceira)
      const newCashback = cashbackBalance + 5.0;
      setCashbackBalance(newCashback);
      try {
        localStorage.setItem('salvo_cashback_balance', String(newCashback));
      } catch {}
    }
  };

  return {
    allOffers,
    filteredOffers,
    redeemedOfferIds,
    cashbackBalance,
    redeemOffer,
    totalActiveOffers: allOffers.length,
  };
}
