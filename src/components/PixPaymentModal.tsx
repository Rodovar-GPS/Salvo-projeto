import React, { useState } from 'react';
import { Store } from '../types';
import { QrCode, Copy, Check, ShieldCheck, Sparkles, X, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: Store;
  onPaymentConfirmed: () => void;
}

export const PixPaymentModal: React.FC<PixPaymentModalProps> = ({
  isOpen,
  onClose,
  store,
  onPaymentConfirmed,
}) => {
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);

  if (!isOpen) return null;

  const pixCode = `00020126580014br.gov.bcb.pix0136salvo-mensalidade-lojista520400005303986540512.005802BR5905SALVO6008SALVADOR62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaidSuccess(true);
      setTimeout(() => {
        onPaymentConfirmed();
        onClose();
      }, 1800);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-[#0B4F8A] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFC72C] text-[#0B4F8A] flex items-center justify-center text-lg font-black shadow-md">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-wider">
                Assinatura Mensal Lojista
              </span>
              <h3 className="text-xl font-heading font-black">Pagamento via PIX</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-center">
          {paidSuccess ? (
            <div className="py-8 space-y-4 animate-scaleUp">
              <div className="w-20 h-20 bg-green-100 text-[#2E9E5B] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h4 className="text-2xl font-heading font-black text-slate-900">
                Pagamento Confirmado!
              </h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Sua loja <strong>{store.name}</strong> está 100% ativa no SALVÔ com destaque no mapa e ofertas liberadas!
              </p>
            </div>
          ) : (
            <>
              {/* Value Highlight */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Valor da Mensalidade
                </span>
                <span className="text-3xl font-heading font-black text-[#0B4F8A]">
                  R$ 12,00
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Acesso completo por 30 dias • Cancele quando quiser
                </span>
              </div>

              {/* Simulated QR Code */}
              <div className="inline-block p-4 bg-white rounded-3xl border-2 border-[#0B4F8A]/20 shadow-md">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=00020126580014br.gov.bcb.pix0136guia-salvador-mensalidade-lojista"
                  alt="PIX QR Code"
                  className="w-44 h-44 mx-auto rounded-xl"
                />
                <p className="text-[10px] font-bold text-slate-400 mt-2">
                  Abra o app do seu banco e escaneie o código
                </p>
              </div>

              {/* Copy Paste Code */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Código Pix Copia e Cola
                </label>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-200">
                  <input
                    type="text"
                    readOnly
                    value={pixCode}
                    className="flex-1 bg-transparent text-xs text-slate-700 font-mono outline-none px-2 truncate"
                  />
                  <button
                    onClick={handleCopyPix}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#0B4F8A] hover:bg-[#083b66] text-white rounded-xl text-xs font-bold shrink-0 transition-all active:scale-95"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {/* Simulate button */}
              <div className="pt-2">
                <button
                  onClick={handleSimulatePayment}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-[#2E9E5B] hover:bg-[#25834b] text-white font-heading font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#FFC72C]" />
                      <span>Simular Confirmação de Pagamento PIX</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-slate-400 font-semibold mt-2">
                  🔒 Ambiente seguro • Compensação instantânea em até 3 segundos
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
