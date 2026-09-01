// ==============================================================================
// 🌊 DEPTH LEVEL — NÍVEL DE PROFUNDIDADE DO USUÁRIO EM SALVADOR
// Orla (1-4) → Abismo do Carmo (5-9) → Fossa das Marianas Soteropolitana (10+)
// ==============================================================================

import React from 'react';
import { useAppStore } from '../store/useAppStore';

interface DepthLevelProps {
  className?: string;
  showIcon?: boolean;
}

export const DepthLevel: React.FC<DepthLevelProps> = ({ className = '', showIcon = true }) => {
  const depthLevel = useAppStore((s) => s.gamification.depthLevel);
  const depthTitle = useAppStore((s) => s.gamification.depthTitle);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black bg-[#0F4C81]/10 dark:bg-cyan-950/40 border border-[#0F4C81]/20 dark:border-cyan-800 text-[#0F4C81] dark:text-cyan-300 ${className}`}
      title={`Nível de Profundidade: ${depthTitle}`}
    >
      {showIcon && <span>⚓</span>}
      <span>{depthTitle}</span>
      <span className="px-1.5 py-0.2 rounded-md bg-[#0F4C81] text-white text-[10px] font-black">
        Nív. {depthLevel}
      </span>
    </div>
  );
};
