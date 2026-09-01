// ==============================================================================
// 🐚 CONCHA BADGE — CONTADOR DE CONCHAS COLETADAS (7 = RECOMPENSA SURPRESA)
// ==============================================================================

import React from 'react';
import { useAppStore } from '../store/useAppStore';

interface ConchaBadgeProps {
  onClick?: () => void;
  showProgress?: boolean;
  className?: string;
}

export const ConchaBadge: React.FC<ConchaBadgeProps> = ({
  onClick,
  showProgress = false,
  className = '',
}) => {
  const conchasCount = useAppStore((s) => s.gamification.conchasCount);
  const maxConchas = 7;
  const isFull = conchasCount >= maxConchas;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
        isFull
          ? 'bg-amber-400 text-slate-950 shadow-xs animate-bounce'
          : 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 text-amber-900 dark:text-amber-300'
      } ${className}`}
      title={`${conchasCount} de ${maxConchas} conchas coletadas. Colete 7 para destravar um cupom surpresa!`}
    >
      <span className="text-sm">🐚</span>
      <span>
        {conchasCount}/{maxConchas}
      </span>
      {showProgress && (
        <span className="text-[10px] opacity-75 font-normal">
          ({maxConchas - conchasCount} p/ prêmio)
        </span>
      )}
    </button>
  );
};
