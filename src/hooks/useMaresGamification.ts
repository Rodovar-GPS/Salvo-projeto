// ==============================================================================
// 🌊 USE MARES GAMIFICATION HOOK — SISTEMA "MARÉS E CONCHAS"
// Salvador: "A Cidade das Marés"
// ==============================================================================

import { useAppStore } from '../store/useAppStore';

export function useMaresGamification() {
  const gamification = useAppStore((s) => s.gamification);
  const addMares = useAppStore((s) => s.addMares);
  const collectConcha = useAppStore((s) => s.collectConcha);
  const checkInBairro = useAppStore((s) => s.checkInBairro);
  const claimReward = useAppStore((s) => s.claimReward);

  // Cálculos derivados
  const progressToNextLevel = (gamification.maresScore % 50) * 2; // 0 to 100%
  const conchasRemainingForReward = 7 - gamification.conchasCount;

  return {
    ...gamification,
    progressToNextLevel,
    conchasRemainingForReward,
    addMares,
    collectConcha,
    checkInBairro,
    claimReward,
  };
}
