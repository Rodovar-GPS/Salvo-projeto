import React, { useState, useEffect } from 'react';
import { BonfimRibbon } from '../components/BonfimRibbon';
import { Sparkles, ArrowRight, Compass, Store, ShieldCheck, ChevronDown, Flame } from 'lucide-react';

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
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [showSubTitle, setShowSubTitle] = useState(false);

  const fullHeadline = 'SALVADOR NA PALMA DA MÃO.';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullHeadline.length) {
        setTypewriterText(fullHeadline.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setShowSubTitle(true);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between text-white overflow-hidden bg-[#05162E]">
      {/* 5-Color Bonfim Ribbon on Top */}
      <div className="fixed top-0 left-0 w-full z-50">
        <BonfimRibbon height="h-2" showText />
      </div>

      {/* FULLSCREEN HD VIDEO BACKGROUND FROM YOUTUBE (https://youtu.be/4A_EsZm-W3Y) */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-[#05162E]">
        {/* High-definition YouTube Aerial Salvador Background Video */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <iframe
            src="https://www.youtube-nocookie.com/embed/4A_EsZm-W3Y?autoplay=1&mute=1&loop=1&playlist=4A_EsZm-W3Y&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&playsinline=1&enablejsapi=1"
            title="Salvador Vídeo de Fundo HD"
            allow="autoplay; encrypted-media"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full pointer-events-none border-0 opacity-80 scale-105"
          />
        </div>

        {/* Static high-res background fallback */}
        <img
          src="https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=1600&q=80"
          alt="Farol da Barra - Salvador"
          className="absolute inset-0 w-full h-full object-cover -z-10 opacity-90"
        />

        {/* Sophisticated Dark Gradient & Turquoise Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-[#072559]/80 to-[#00B4D8]/30 backdrop-blur-[1px]" />
      </div>

      {/* TOP INNOVATION BADGE */}
      <header className="relative z-10 pt-10 sm:pt-12 px-4 flex justify-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg text-[11px] sm:text-xs font-heading font-black tracking-widest text-[#FFD60A] uppercase animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-[#FFD60A] animate-ping" />
          <span>O 1º APP SOCIAL DE COMERCIALIZAÇÃO DO BRASIL</span>
        </div>
      </header>

      {/* CENTRAL HERO CONTENT */}
      <main className="relative z-10 max-w-4xl mx-auto w-full px-5 sm:px-6 py-6 sm:py-8 my-auto flex flex-col items-center text-center">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 mb-2 animate-fadeIn">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/25 shadow-xl flex items-center justify-center">
            <img
              src="/salvo-logo.png"
              alt="SALVÔ"
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://iili.io/CDs6WS1.jpg';
              }}
            />
          </div>
          <div className="text-left">
            <h1 className="text-3xl sm:text-5xl font-heading font-black italic tracking-tighter text-white drop-shadow-[0_0_20px_rgba(0,180,216,0.6)] font-serif">
              SALVÔ
            </h1>
          </div>
          <span className="bg-gradient-to-r from-[#FFD60A] to-[#FF9100] text-[#072559] text-[10px] sm:text-xs font-heading font-black px-2 py-0.5 rounded-md shadow-md uppercase tracking-wider self-start mt-1">
            SSA • Bahia
          </span>
        </div>

        {/* Dynamic Title (Typewriter + Gradient Subtitle) */}
        <div className="mt-4 mb-3">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)] min-h-[1.3em]">
            <span>"{typewriterText}"</span>
            <span className="inline-block w-1 h-7 sm:h-9 bg-[#FFD60A] ml-1.5 align-middle animate-pulse" />
          </h2>

          <h3
            className={`text-xl sm:text-2xl md:text-3xl font-heading font-black tracking-tight mt-2 bg-gradient-to-r from-[#FFD60A] via-[#48CAE4] to-[#00B4D8] bg-clip-text text-transparent transition-all duration-700 ${
              showSubTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            SALVÔ — SUA CONEXÃO VIVA NA CIDADE.
          </h3>
        </div>

        {/* Subtitle Description */}
        <p className="text-sm sm:text-base md:text-lg text-slate-100 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md mb-4">
          Descubra o comércio local, encontre ofertas, conecte-se com pessoas e acompanhe a cidade em tempo real.
        </p>

        {/* Highlight Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs sm:text-sm font-heading font-black text-[#FFD60A] mb-6 sm:mb-8 shadow-md">
          <Sparkles className="w-4 h-4 text-[#FFD60A] shrink-0" />
          <span>Comércio, conexão e Salvador. Tudo em um só lugar.</span>
        </div>

        {/* Two Glassmorphic Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 w-full max-w-2xl mb-6 sm:mb-8 text-left">
          {/* Card 1: Morador & Turista */}
          <div className="bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-5 shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-[#FFD60A] border border-white/20 shadow-xs">
                <Compass className="w-4 h-4 text-[#FFD60A]" />
              </div>
              <h4 className="text-sm font-heading font-bold text-white">Morador & Turista</h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              <strong className="text-[#072559] bg-[#FFD60A] px-2 py-0.5 rounded-md font-black shadow-xs mr-1">
                100% Grátis
              </strong>
              para explorar bairros, conversar no chat e aproveitar cupons sem intermediários.
            </p>
          </div>

          {/* Card 2: Para Lojistas */}
          <div className="bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-5 shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-[#FFD60A] border border-white/20 shadow-xs">
                <Store className="w-4 h-4 text-[#FFD60A]" />
              </div>
              <h4 className="text-sm font-heading font-bold text-white">Para Lojistas</h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Vitrine de Salvador por apenas{' '}
              <strong className="text-[#FFD60A] font-black text-sm">R$ 12/mês</strong>. Venda direto pelo Pix sem taxas abusivas de entrega.
            </p>
          </div>
        </div>

        {/* Call to Action Button with Infinite Pulse Animation */}
        <div className="w-full max-w-md space-y-3">
          <button
            onClick={onStart}
            className="w-full py-4 sm:py-4.5 px-8 bg-gradient-to-r from-[#00B4D8] via-[#0077B6] to-[#FFD60A] hover:bg-pos-100 text-white font-heading font-black text-sm sm:text-base uppercase tracking-wider rounded-full shadow-[0_10px_35px_rgba(0,180,216,0.5)] border border-white/30 flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer animate-pulse hover:scale-105 active:scale-98"
          >
            <span>JUNTE-SE À REVOLUÇÃO</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Secondary Quick Action Buttons */}
          <div className="flex gap-2.5 pt-1">
            <button
              onClick={onOpenOnboarding}
              className="flex-1 py-2.5 px-3 bg-white/15 hover:bg-white/25 text-white font-heading font-bold text-xs rounded-xl backdrop-blur-md border border-white/15 transition-all cursor-pointer"
            >
              Como Funciona
            </button>
            <button
              onClick={onOpenAuth}
              className="flex-1 py-2.5 px-3 bg-white/15 hover:bg-white/25 text-white font-heading font-bold text-xs rounded-xl backdrop-blur-md border border-white/15 transition-all cursor-pointer"
            >
              Cadastrar Minha Loja
            </button>
          </div>

          <p className="text-[11px] text-white/75 font-medium tracking-wide">
            Sem download pesado • Funciona direto no navegador com geolocalização
          </p>
        </div>
      </main>

      {/* FOOTER & SCROLL ARROW */}
      <footer className="relative z-10 pb-4 pt-2 text-center flex flex-col items-center gap-1.5">
        <button
          onClick={onStart}
          className="flex flex-col items-center text-white/70 hover:text-[#FFD60A] transition-colors cursor-pointer"
        >
          <span className="text-[10px] font-heading font-bold uppercase tracking-widest">
            Entrar no Guia
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </button>
        <p className="text-[11px] text-white/80 font-semibold tracking-wide">
          SALVÔ SSA • O Portal que comunica pessoas e lojistas de Salvador - BA.
        </p>
      </footer>
    </div>
  );
};
