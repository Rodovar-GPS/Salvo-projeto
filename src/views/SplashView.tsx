import React from 'react';
import { BonfimRibbon } from '../components/BonfimRibbon';
import { Compass, Sparkles, Store, ArrowRight, ShieldCheck } from 'lucide-react';

interface SplashViewProps {
  onStart: () => void;
  onOpenOnboarding: () => void;
  onOpenAuth: () => void;
}

export const SplashView: React.FC<SplashViewProps> = ({
  onStart,
  onOpenOnboarding,
  onOpenAuth,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B4F8A] via-[#083d6c] to-[#062c4e] text-white flex flex-col justify-between relative overflow-hidden">
      {/* 5-Color Bonfim Ribbon on Top */}
      <BonfimRibbon height="h-3" showText />

      {/* Background Decorative Bahia Wave Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg viewBox="0 0 1000 1000" className="w-full h-full">
          <circle cx="200" cy="300" r="350" fill="#FFC72C" />
          <circle cx="800" cy="700" r="400" fill="#E8552B" />
          <circle cx="900" cy="200" r="250" fill="#2E9E5B" />
        </svg>
      </div>

      {/* Main Center Content */}
      <div className="max-w-md mx-auto w-full px-6 py-12 flex-1 flex flex-col items-center justify-center text-center z-10">
        {/* Animated Brand Emblem */}
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-white rounded-3xl p-1.5 flex items-center justify-center shadow-2xl ring-8 ring-white/10 transform hover:scale-105 transition-all">
            <img
              src="/salvo-logo.png"
              alt="SALVÔ"
              className="w-full h-full object-cover rounded-2xl"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://iili.io/CDs6WS1.jpg';
              }}
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#FFC72C] text-[#0B4F8A] p-2 rounded-2xl shadow-lg">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
        </div>

        {/* Brand Typography */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-[#FFC72C] mb-3 border border-white/15">
          <span>Salvador • Bahia • Brasil</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tight leading-tight mb-2 text-white">
          SALVÔ
        </h1>

        <p className="text-base sm:text-lg font-heading font-bold text-[#FFC72C] mb-2">
          Guia Oficial do Comércio Local de Salvador.
        </p>

        <p className="text-sm sm:text-base text-sky-100 font-medium leading-relaxed max-w-sm mb-8">
          Encontre lojas, ofertas e serviços perto de você. Explore o comércio local de Salvador de um jeito simples, rápido e inteligente.
        </p>

        {/* Highlights Pills */}
        <div className="grid grid-cols-2 gap-3 w-full mb-8 text-left">
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-[#FFC72C] font-bold text-xs mb-1.5">
              <Compass className="w-4 h-4" />
              <span>Morador & Turista</span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">
              100% <strong className="text-[#0B4F8A] bg-[#FFC72C] px-2 py-0.5 rounded-md font-black shadow-sm inline-block">Grátis</strong> para explorar e conversar.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-[#FFC72C] font-bold text-xs mb-1.5">
              <Store className="w-4 h-4" />
              <span>Para Lojistas</span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">
              Vitrine de Salvador por apenas <strong className="text-[#FFC72C] font-black">R$ 12/mês</strong>.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          <button
            onClick={onStart}
            className="w-full h-14 bg-[#FFC72C] hover:bg-amber-400 text-[#0B4F8A] font-heading font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <span>Explorar Salvador Agora</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            <button
              onClick={onOpenOnboarding}
              className="flex-1 h-12 bg-white/15 hover:bg-white/25 text-white font-heading font-bold text-xs rounded-2xl transition-all border border-white/10"
            >
              Como Funciona (Tutorial)
            </button>
            <button
              onClick={onOpenAuth}
              className="flex-1 h-12 bg-white/15 hover:bg-white/25 text-white font-heading font-bold text-xs rounded-2xl transition-all border border-white/10"
            >
              Fazer Login / Cadastro
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="w-full py-4 text-center text-white/60 text-xs font-semibold z-10">
        <p>Feito com axé para impulsionar os bairros de Salvador, Bahia ✨</p>
      </footer>
    </div>
  );
};
