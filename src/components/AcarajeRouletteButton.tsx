// ==============================================================================
// 🎲 ACARAJÉ ROULETTE BUTTON — BOTÃO FLUTUANTE "ME SURPREENDA"
// ==============================================================================

import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Sparkles } from 'lucide-react';

interface AcarajeRouletteButtonProps {
  className?: string;
}

export const AcarajeRouletteButton: React.FC<AcarajeRouletteButtonProps> = ({ className = '' }) => {
  const setIsOpen = useAppStore((s) => s.setIsAcarajeRouletteOpen);

  return (
    <button
      type="button"
      onClick={() => setIsOpen(true)}
      className={`group fixed bottom-20 right-4 z-30 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#E89F3C] via-[#E76F51] to-[#0F4C81] text-white font-black text-xs shadow-xl shadow-amber-900/25 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/40 ${className}`}
      aria-label="Acarajé Roulette — Me Surpreenda"
    >
      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm shadow-inner group-hover:rotate-45 transition-transform">
        🎲
      </div>
      <div className="text-left">
        <div className="leading-none text-[11px] font-black uppercase tracking-wider text-amber-100 flex items-center gap-1">
          <span>Me Surpreenda</span>
          <Sparkles className="w-3 h-3 text-amber-200" />
        </div>
        <div className="text-[10px] text-white/90 leading-tight font-medium">
          20% OFF Gastronomia
        </div>
      </div>
    </button>
  );
};
