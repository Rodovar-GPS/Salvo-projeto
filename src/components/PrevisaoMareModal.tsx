// ==============================================================================
// 🌊 PREVISÃO DE MARÉ INTELIGENTE — CAPITANIA DOS PORTOS & ALERTAS DE SALVADOR
// Salvador: Monitoramento de preamar, baixa-mar e rotas alternativas para alagamentos
// ==============================================================================

import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { X, Waves, AlertTriangle, Compass, ShieldAlert, ArrowRight } from 'lucide-react';

export const PrevisaoMareModal: React.FC = () => {
  const isOpen = useAppStore((s) => s.isPrevisaoMareOpen);
  const setIsOpen = useAppStore((s) => s.setIsPrevisaoMareOpen);
  const previsao = useAppStore((s) => s.previsaoMare);
  const setActiveTab = useAppStore((s) => s.setActiveTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-black">
              🌊
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white font-display">
                Tábua & Previsão de Maré
              </h3>
              <p className="text-xs text-slate-500">
                Dados da Marinha do Brasil & Alertas de Tráfego
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

        {/* Card do Nível da Maré */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0F4C81] to-[#2A9D8F] text-white flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-cyan-200">
              Estado Atual da Maré
            </div>
            <div className="text-xl font-black mt-0.5 font-display">
              {previsao.tideState}
            </div>
            <div className="text-xs text-cyan-100 mt-1">
              Altura Atual: <strong>{previsao.currentTideMeters} m</strong>
            </div>
          </div>

          <div className="text-right text-xs bg-white/10 p-3 rounded-xl backdrop-blur-xs">
            <div>
              🔺 Preamar: <strong>{previsao.nextHighTide}</strong>
            </div>
            <div className="mt-1">
              🔻 Baixa-mar: <strong>{previsao.nextLowTide}</strong>
            </div>
          </div>
        </div>

        {/* Aviso da Capitania */}
        <div className="p-3.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 text-xs text-cyan-950 dark:text-cyan-200 flex items-start gap-2.5">
          <Waves className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
          <div>
            <strong>Boletim Náutico:</strong> {previsao.marinhaAdvisory}
          </div>
        </div>

        {/* Zonas de Atenção e Rotas Alternativas */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Alerta de Vias Costeiras & Alagamentos</span>
          </h4>

          <div className="flex flex-col gap-2.5">
            {previsao.riskFloodZones.map((zone, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    {zone.zoneName}
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500 text-slate-950">
                    Risco {zone.riskLevel}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1">
                  <Compass className="w-3.5 h-3.5 text-[#0F4C81] shrink-0 mt-0.5" />
                  <span>
                    <strong>Rota Alternativa Recomendada:</strong> {zone.alternativeRoute}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            setIsOpen(false);
            setActiveTab('viajar');
          }}
          className="w-full bg-[#0F4C81] hover:bg-[#0c3e69] text-white py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-md"
        >
          <span>Ver Mapa de Tráfego & Rotas Alternativas no GPS (Viajar)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
