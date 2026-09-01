// ==============================================================================
// 🌊 MARES INDICATOR — STATUS DA MARÉ & STREAK DE EXPLORAÇÃO
// ==============================================================================

import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Flame, Waves, AlertCircle } from 'lucide-react';

interface MaresIndicatorProps {
  compact?: boolean;
  className?: string;
}

export const MaresIndicator: React.FC<MaresIndicatorProps> = ({ compact = false, className = '' }) => {
  const gamification = useAppStore((s) => s.gamification);
  const isMareCheia = gamification.streakStatus === 'mare_cheia';

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
          isMareCheia
            ? 'bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
        } ${className}`}
        title={`${gamification.streakDays} dias de sequência`}
      >
        {isMareCheia ? (
          <>
            <Flame className="w-3.5 h-3.5 text-[#E89F3C] animate-pulse" />
            <span>Maré Cheia • {gamification.streakDays}d</span>
          </>
        ) : (
          <>
            <Waves className="w-3.5 h-3.5 text-cyan-600" />
            <span>Maré Baixa</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-2.5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
          isMareCheia ? 'bg-[#0F4C81] text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
        }`}>
          {isMareCheia ? '🌊' : '⏳'}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              {isMareCheia ? 'Status: Maré Cheia' : 'Status: Maré Baixa'}
            </h4>
            {isMareCheia && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                +{gamification.streakDays * 5} 🌊
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">
            {isMareCheia
              ? `${gamification.streakDays} dias seguidos explorando o comércio de Salvador.`
              : 'Faça um check-in hoje para ativar sua Maré Cheia e ganhar bônus!'}
          </p>
        </div>
      </div>

      <div className="text-right">
        <div className="text-sm font-black text-[#0F4C81] dark:text-cyan-400 font-display">
          {gamification.maresScore} 🌊
        </div>
        <span className="text-[10px] text-slate-400 font-bold">Marés Acumuladas</span>
      </div>
    </div>
  );
};
