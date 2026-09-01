// ==============================================================================
// 🌊 ONDA DO DENDÊ — EVENTOS COLETIVOS EM TEMPO REAL
// Salvador: Quanto mais pessoas confirmam presença, maior a onda no mapa térmico
// ==============================================================================

import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { X, Flame, Users, Sparkles, MapPin, Radio } from 'lucide-react';

export const OndaDoDendeModal: React.FC = () => {
  const isOpen = useAppStore((s) => s.isOndaDoDendeOpen);
  const setIsOpen = useAppStore((s) => s.setIsOndaDoDendeOpen);
  const ondas = useAppStore((s) => s.ondasDoDende);
  const confirmPresence = useAppStore((s) => s.confirmPresenceOnda);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E89F3C] to-[#E76F51] text-white flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              🌊
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white font-display">
                Onda do Dendê
              </h3>
              <p className="text-xs text-slate-500">
                O calor dos eventos em tempo real por Salvador
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

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Veja onde a cidade está fervendo. Ao confirmar presença, você gera volume na maré coletiva e ganha <strong>+25 Marés 🌊</strong>.
        </p>

        <div className="flex flex-col gap-3">
          {ondas.map((onda) => (
            <div
              key={onda.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col gap-3 hover:border-amber-400/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    {onda.liveNow && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                        <Radio className="w-3 h-3" /> AO VIVO
                      </span>
                    )}
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      {onda.timeText}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1">
                    {onda.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {onda.venue} • <strong>{onda.neighborhood}</strong>
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white">
                    {onda.waveHeatIndex}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Calor da Onda: <strong>{onda.heatPercentage}%</strong>
                  </div>
                </div>
              </div>

              {/* Barra de Calor da Maré */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#2A9D8F] via-[#E89F3C] to-[#E76F51] rounded-full transition-all duration-500"
                  style={{ width: `${onda.heatPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                  <Users className="w-4 h-4 text-amber-500" />
                  <span>
                    <strong>{onda.participantsCount}</strong> pessoas confirmadas
                  </span>
                </div>

                <button
                  onClick={() => confirmPresence(onda.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0F4C81] to-[#2A9D8F] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-300" />
                  <span>Subir na Onda (+25 🌊)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
