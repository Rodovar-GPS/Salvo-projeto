// ==============================================================================
// 🌊 PAINEL MARÉS E CONCHAS — SISTEMA DE GAMIFICAÇÃO & RETENÇÃO
// "A Cidade das Marés": Marés (🌊), Conchas (🐚) e Níveis de Profundidade
// ==============================================================================

import React from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  Waves,
  Sparkles,
  Flame,
  Award,
  MapPin,
  Gift,
  CheckCircle,
  HelpCircle,
  Compass,
  ArrowUpRight,
} from 'lucide-react';
import { WavesPattern, GotaDeDendeBadge } from './MaresPattern';

export const MaresGamificationPanel: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const gamification = useAppStore((s) => s.gamification);
  const checkInBairro = useAppStore((s) => s.checkInBairro);
  const claimReward = useAppStore((s) => s.claimReward);
  const openRoulette = () => useAppStore.getState().setIsAcarajeRouletteOpen(true);
  const openOnda = () => useAppStore.getState().setIsOndaDoDendeOpen(true);
  const openHeranca = () => useAppStore.getState().setIsHerancaDigitalOpen(true);
  const openMare = () => useAppStore.getState().setIsPrevisaoMareOpen(true);

  const progressPercent = Math.min(100, (gamification.maresScore % 50) * 2);

  if (compact) {
    return (
      <div className="bg-gradient-to-br from-[#0F4C81] to-[#2A9D8F] text-white rounded-2xl p-3 shadow-md flex items-center justify-between gap-3 relative overflow-hidden">
        <WavesPattern intensity="soft" />
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-lg shadow-inner">
            🌊
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-cyan-200">
              {gamification.depthTitle} • Nível {gamification.depthLevel}
            </div>
            <div className="text-sm font-black flex items-center gap-1.5">
              <span>{gamification.maresScore} Marés</span>
              <span className="text-xs text-amber-300 font-bold">• 🐚 {gamification.conchasCount}/7</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => checkInBairro('Rio Vermelho')}
          className="relative z-10 px-3 py-1.5 rounded-xl bg-[#E89F3C] hover:bg-[#d88f2c] text-slate-950 font-black text-xs shadow-sm active:scale-95 transition-transform"
        >
          Check-in (+10 🌊)
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm flex flex-col gap-5 relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#2A9D8F]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0F4C81] via-[#2A9D8F] to-[#E89F3C] flex items-center justify-center text-2xl text-white shadow-md shadow-blue-900/20">
            🌊
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white font-display">
                Marés & Conchas
              </h3>
              <GotaDeDendeBadge label="Soteropolitano Ativo" />
            </div>
            <p className="text-xs text-slate-500">
              O ritmo da cidade guiando suas recompensas reais em Salvador
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {gamification.streakStatus === 'mare_cheia' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-black">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Maré Cheia • {gamification.streakDays} dias seguidos (+50 🌊)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 text-xs font-bold">
              <span>Maré Normal</span>
            </span>
          )}
        </div>
      </div>

      {/* Grid Principal de Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Saldo de Marés */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0F4C81] to-[#1A5B96] text-white flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-xs text-cyan-200 font-bold uppercase tracking-wider">
            <span>Moeda da Cidade</span>
            <span>🌊 Marés</span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-black font-display tracking-tight">
              {gamification.maresScore} <span className="text-lg font-normal text-cyan-200">🌊</span>
            </div>
            <div className="text-xs text-blue-100 mt-0.5">
              Profundidade: <strong>{gamification.depthTitle}</strong> (Nível {gamification.depthLevel})
            </div>
          </div>
          {/* Barra de Progresso */}
          <div>
            <div className="flex justify-between text-[10px] text-cyan-200 mb-1">
              <span>Nível {gamification.depthLevel}</span>
              <span>Nível {gamification.depthLevel + 1} ({progressPercent}%)</span>
            </div>
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#E89F3C] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Coleção de Conchas (7 = 1 Recompensa) */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Coleção de Conchas 🐚
            </span>
            <span className="text-xs font-bold text-[#E89F3C]">
              {gamification.conchasCount}/7 Conchas
            </span>
          </div>

          {/* Slots de 7 Conchas */}
          <div className="grid grid-cols-7 gap-1.5 my-3">
            {[0, 1, 2, 3, 4, 5, 6].map((idx) => {
              const isFilled = idx < gamification.conchasCount;
              const concha = gamification.conchasCollection[idx];
              return (
                <div
                  key={idx}
                  className={`aspect-square rounded-xl flex items-center justify-center text-sm border transition-all ${
                    isFilled
                      ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800/80 border-dashed border-slate-300 dark:border-slate-700 text-slate-400'
                  }`}
                  title={concha ? `${concha.name} (${concha.rarity})` : 'Slot Vazio'}
                >
                  {isFilled ? '🐚' : idx + 1}
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-500">
            {7 - gamification.conchasCount === 0
              ? '🎉 Ciclo fechado! Recompensa surpresa gerada!'
              : `Colete mais ${7 - gamification.conchasCount} conchas para desbloquear um cupom surpresa.`}
          </div>
        </div>

        {/* Card 3: Ranking do Bairro */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Liderança da Maré
            </span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>

          <div className="my-2 space-y-1.5">
            {gamification.neighborhoodRanks.slice(0, 2).map((rank, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
              >
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0F4C81]" />
                  <span className="font-bold text-slate-800 dark:text-white">
                    {rank.neighborhood}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-black text-[#E89F3C]">#{rank.rank}</span>
                  <span className="text-[10px] text-slate-400 block">{rank.title}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => checkInBairro('Rio Vermelho')}
            className="w-full bg-[#0F4C81] hover:bg-[#0c3e69] text-white py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Fazer Check-in no Bairro (+10 🌊)</span>
          </button>
        </div>
      </div>

      {/* Atalhos Rápidos para Mecânicas de Vício */}
      <div className="pt-2">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5">
          Mecânicas da Cidade das Marés
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={openRoulette}
            className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 hover:border-amber-400 text-left flex flex-col justify-between transition-all"
          >
            <div className="text-xl mb-1">🎲</div>
            <div>
              <div className="text-xs font-black text-slate-900 dark:text-white">
                Acarajé Roulette
              </div>
              <div className="text-[10px] text-slate-500">20% OFF Surpresa</div>
            </div>
          </button>

          <button
            onClick={openOnda}
            className="p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/40 hover:border-rose-400 text-left flex flex-col justify-between transition-all"
          >
            <div className="text-xl mb-1">🔥</div>
            <div>
              <div className="text-xs font-black text-slate-900 dark:text-white">
                Onda do Dendê
              </div>
              <div className="text-[10px] text-slate-500">Calor Coletivo</div>
            </div>
          </button>

          <button
            onClick={openHeranca}
            className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 hover:border-blue-400 text-left flex flex-col justify-between transition-all"
          >
            <div className="text-xl mb-1">📜</div>
            <div>
              <div className="text-xs font-black text-slate-900 dark:text-white">
                Herança Digital
              </div>
              <div className="text-[10px] text-slate-500">Memórias Locais</div>
            </div>
          </button>

          <button
            onClick={openMare}
            className="p-3 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200/60 dark:border-cyan-800/40 hover:border-cyan-400 text-left flex flex-col justify-between transition-all"
          >
            <div className="text-xl mb-1">🌊</div>
            <div>
              <div className="text-xs font-black text-slate-900 dark:text-white">
                Previsão de Maré
              </div>
              <div className="text-[10px] text-slate-500">Marinha & Alagamentos</div>
            </div>
          </button>
        </div>
      </div>

      {/* Cupons e Recompensas Desbloqueadas */}
      {gamification.availableRewards.length > 0 && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-amber-500" />
              <span>Recompensas & Cupons Desbloqueados</span>
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {gamification.availableRewards.map((reward) => (
              <div
                key={reward.id}
                className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200/60 dark:border-amber-800/50 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    {reward.title}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Código: <strong className="text-[#0F4C81]">{reward.code}</strong> • Vence em {reward.expiresAt}
                  </div>
                </div>

                <button
                  onClick={() => claimReward(reward.id)}
                  disabled={reward.isUsed}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black shadow-xs transition-all ${
                    reward.isUsed
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-[#E89F3C] text-slate-950 hover:bg-[#d88f2c]'
                  }`}
                >
                  {reward.isUsed ? 'Utilizado' : 'Ativar'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
