// ==============================================================================
// 📈 PLAN SELECTOR — SELETOR DOS PLANOS "SALVÔ FÉ" (ORLA, MARÉ ALTA, FUNDO DO MAR)
// Com Simulador de Alcance por Investimento
// Frase: "Não deixe seu negócio na maré baixa. Suba com a gente."
// ==============================================================================

import React, { useState } from 'react';
import { FE_PLANS } from '../data/salvoFeDatabase';
import { FePlanTier, FePlanDefinition } from '../types';
import { Check, Sparkles, TrendingUp, Eye, MousePointer, QrCode, CreditCard, ArrowRight } from 'lucide-react';
import { WavesPattern } from './MaresPattern';

interface PlanSelectorProps {
  currentPlanId?: FePlanTier;
  onSelectPlan: (planId: FePlanTier, method: 'pix' | 'credit_card') => void;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({
  currentPlanId = 'orla',
  onSelectPlan,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<FePlanTier>(currentPlanId);
  const [customInvestment, setCustomInvestment] = useState<number>(347);

  const plans: FePlanDefinition[] = Object.values(FE_PLANS);

  // Simulador de alcance
  const activePlanDef = FE_PLANS[selectedPlan] || FE_PLANS.mare_alta;
  const estimatedClicks = Math.round((customInvestment - 150) / activePlanDef.cpc);
  const estimatedImpressions = Math.round(((customInvestment - 150) / activePlanDef.cpm) * 1000);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Institucional & Posicionamento */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0F4C81] via-[#1A1A2E] to-[#0F4C81] text-white relative overflow-hidden shadow-lg">
        <WavesPattern intensity="soft" />
        <div className="relative z-10">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 inline-block mb-2">
            Planos de Visibilidade SALVÔ ADS
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight">
            "Não deixe seu negócio na maré baixa. Suba com a gente."
          </h2>
          <p className="text-xs text-cyan-200 mt-1 max-w-xl">
            Atraia clientes soteropolitanos e turistas a até 500 metros da sua loja física com anúncios hiperlocais no mapa e no feed de ofertas.
          </p>
        </div>
      </div>

      {/* Grid dos 3 Planos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;

          return (
            <div
              key={plan.id}
              onClick={() => {
                setSelectedPlan(plan.id);
                setCustomInvestment(plan.price);
              }}
              className={`relative rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 border-[#0F4C81] dark:border-cyan-400 shadow-xl scale-[1.02]'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#E89F3C] to-[#E76F51] text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                  Mais Escolhido
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-[#0F4C81]/10 text-[#0F4C81] dark:bg-cyan-950 dark:text-cyan-300 uppercase">
                    {plan.name}
                  </span>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-medium line-through">
                      R$ {(plan.price * 1.3).toFixed(0)}
                    </div>
                    <div className="text-lg font-black text-slate-900 dark:text-white font-display">
                      R$ {plan.price}
                      <span className="text-xs font-normal text-slate-500">/mês</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mb-4">{plan.tagline}</p>

                {/* Métricas Estimadas */}
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs mb-4 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-[#0F4C81]" />
                      <span>Impressões:</span>
                    </span>
                    <strong className="text-slate-900 dark:text-white">
                      ~{plan.estimatedImpressions.toLocaleString('pt-BR')}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <MousePointer className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Cliques Estimados:</span>
                    </span>
                    <strong className="text-emerald-600 dark:text-emerald-400">
                      ~{plan.estimatedClicks}
                    </strong>
                  </div>
                </div>

                {/* Benefícios */}
                <div className="flex flex-col gap-2 mb-6">
                  {plan.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botões de Ação de Pagamento */}
              <div className="flex flex-col gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPlan(plan.id, 'pix');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Contratar via PIX (Ativação Imediata)</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPlan(plan.id, 'credit_card');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#0F4C81] hover:bg-[#0c3e69] text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Cartão de Crédito (Até 3x)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulador Interativo de Alcance */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#E89F3C]" />
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Simulador de Alcance Hiperlocal por Investimento
          </h3>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              <span>Investimento Mensal Desejado</span>
              <span className="text-sm font-black text-[#0F4C81] dark:text-cyan-400 font-display">
                R$ {customInvestment.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <input
              type="range"
              min={197}
              max={1500}
              step={50}
              value={customInvestment}
              onChange={(e) => setCustomInvestment(Number(e.target.value))}
              className="w-full accent-[#0F4C81] cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Impressões Estimadas</div>
              <div className="text-base font-black text-slate-900 dark:text-white font-display mt-0.5">
                {Math.max(1000, estimatedImpressions).toLocaleString('pt-BR')} visualizações
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Cliques Diretos no Comércio</div>
              <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-display mt-0.5">
                ~{Math.max(50, estimatedClicks)} cliques
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Taxa de Conversão no Raio de 500m</div>
              <div className="text-base font-black text-[#E89F3C] font-display mt-0.5">
                +45% tráfego na loja física
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
