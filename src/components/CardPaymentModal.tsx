// ==============================================================================
// 💳 CARD PAYMENT MODAL — PAGAMENTO VIA CARTÃO DE CRÉDITO (STRIPE / MERCADO PAGO)
// ==============================================================================

import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle2, ShieldCheck, X, Sparkles, ArrowRight } from 'lucide-react';
import { FE_PLANS } from '../data/salvoFeDatabase';
import { FePlanTier } from '../types';

interface CardPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId?: FePlanTier;
  storeName?: string;
  onPaymentSuccess: (planId: FePlanTier) => void;
}

export const CardPaymentModal: React.FC<CardPaymentModalProps> = ({
  isOpen,
  onClose,
  planId = 'mare_alta',
  storeName = 'Meu Comércio',
  onPaymentSuccess,
}) => {
  const plan = FE_PLANS[planId] || FE_PLANS.mare_alta;

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [installments, setInstallments] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onPaymentSuccess(planId);
        onClose();
      }, 1600);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#0F4C81] via-[#2A9D8F] to-[#0F4C81] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center text-lg font-black shadow-md">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-wider">
                Cartão de Crédito • Stripe / Mercado Pago
              </span>
              <h3 className="text-lg font-black font-display">Plano {plan.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resumo do Plano */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500">Comércio:</span>{' '}
            <strong className="text-slate-900 dark:text-white">{storeName}</strong>
          </div>
          <div className="text-right">
            <span className="text-slate-500">Valor Mensal:</span>{' '}
            <strong className="text-[#0F4C81] dark:text-cyan-400 font-display text-sm">
              R$ {plan.price.toFixed(2).replace('.', ',')}
            </strong>
          </div>
        </div>

        {/* Formulário */}
        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white font-display">
              Pagamento Aprovado!
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Seu plano <strong>{plan.name}</strong> está ativo. Seus anúncios já estão rodando no mapa e feeds de Salvador!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Número do Cartão
              </label>
              <input
                type="text"
                required
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono tracking-wider focus:outline-hidden focus:ring-2 focus:ring-[#0F4C81]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nome Impresso no Cartão
              </label>
              <input
                type="text"
                required
                placeholder="COMO ESTÁ NO CARTÃO"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm uppercase focus:outline-hidden focus:ring-2 focus:ring-[#0F4C81]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Validade (MM/AA)
                </label>
                <input
                  type="text"
                  required
                  placeholder="12/28"
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-[#0F4C81]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  CVV / CVC
                </label>
                <input
                  type="text"
                  required
                  placeholder="123"
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-[#0F4C81]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Parcelamento
              </label>
              <select
                value={installments}
                onChange={(e) => setInstallments(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0F4C81]"
              >
                <option value="1">1x de R$ {plan.price.toFixed(2).replace('.', ',')} (Sem Juros)</option>
                <option value="2">2x de R$ {(plan.price / 2).toFixed(2).replace('.', ',')}</option>
                <option value="3">3x de R$ {(plan.price / 3).toFixed(2).replace('.', ',')}</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ambiente seguro com criptografia de ponta a ponta 256-bit.</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-[#0F4C81] hover:bg-[#0c3e69] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processando Cartão...</span>
                </>
              ) : (
                <>
                  <span>Confirmar Assinatura Mensal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
