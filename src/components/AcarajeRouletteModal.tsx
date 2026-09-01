// ==============================================================================
// 🎲 ACARAJÉ ROULETTE — BOTÃO "ME SURPREENDA"
// Mecânica de Retenção & Gastronomia Soteropolitana com Desconto Surpresa
// ==============================================================================

import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Sparkles, Utensils, Navigation, X, Flame, CheckCircle, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AcarajeRouletteModal: React.FC = () => {
  const isOpen = useAppStore((s) => s.isAcarajeRouletteOpen);
  const setIsOpen = useAppStore((s) => s.setIsAcarajeRouletteOpen);
  const spinRoulette = useAppStore((s) => s.spinAcarajeRoulette);
  const activeResult = useAppStore((s) => s.activeRouletteResult);
  const setActiveTab = useAppStore((s) => s.setActiveTab);

  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [hasSpun, setHasSpun] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSpin = () => {
    setIsSpinning(true);
    setTimeout(() => {
      spinRoulette();
      setIsSpinning(false);
      setHasSpun(true);
      confetti({ particleCount: 90, spread: 70, colors: ['#E89F3C', '#E76F51', '#0F4C81'] });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black">
              🎲
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white font-display">
                Acarajé Roulette
              </h3>
              <p className="text-xs text-slate-500">
                Descubra um sabor secreto com 20% OFF
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card da Roleta */}
        {!hasSpun && !activeResult ? (
          <div className="bg-gradient-to-br from-[#0F4C81]/10 via-[#2A9D8F]/10 to-[#E89F3C]/15 p-6 rounded-3xl border border-amber-200/40 text-center flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#E89F3C] to-[#E76F51] flex items-center justify-center text-3xl shadow-xl shadow-amber-500/30 animate-pulse">
              🍤
            </div>

            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Onde a maré da fome vai te levar hoje?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                Gire a roleta e o SALVÔ sorteará um ponto gastronômico soteropolitano com{' '}
                <strong>20% de desconto secreto</strong>. O nome exato só é liberado no seu GPS!
              </p>
            </div>

            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className="w-full bg-gradient-to-r from-[#E89F3C] to-[#E76F51] hover:from-[#d88f2c] hover:to-[#d65f41] text-white py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSpinning ? 'Rodando o Dendê...' : 'Girar Roleta do Acarajé'}</span>
            </button>
          </div>
        ) : (
          activeResult && (
            <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                <Flame className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    Destino Secreto Sorteado!
                  </div>
                  <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                    {activeResult.dishCategory}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Bairro: <strong>{activeResult.storeNeighborhood}</strong> ({activeResult.distanceKm} km de você)
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <span className="text-base">💡</span>
                <span>
                  <strong>Pista do Local:</strong> "{activeResult.hintText}"
                </span>
              </div>

              <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/50">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                  <Clock className="w-4 h-4" />
                  <span>Válido pelos próximos 60 min</span>
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-md bg-amber-500 text-slate-950">
                  20% OFF
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setActiveTab('viajar');
                  }}
                  className="flex-1 bg-[#0F4C81] hover:bg-[#0c3e69] text-white py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Navegar até o Local (GPS)</span>
                </button>

                <button
                  onClick={handleSpin}
                  className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-slate-700 dark:text-slate-300 text-xs font-bold"
                  title="Girar Novamente"
                >
                  🎲 Girar de Novo
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
