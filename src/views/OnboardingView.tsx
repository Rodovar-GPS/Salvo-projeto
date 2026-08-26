import React, { useState } from 'react';
import { BonfimRibbon } from '../components/BonfimRibbon';
import { MapPin, Sparkles, MessageCircle, Store, ArrowRight, ArrowLeft, CheckCircle2, Compass } from 'lucide-react';

interface OnboardingViewProps {
  onComplete: () => void;
  onOpenAuth: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onComplete,
  onOpenAuth,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      step: '01',
      title: 'Encontre lojas perto de você',
      subtitle: 'Comércio de Salvador em um só lugar',
      description:
        'Explore bairros icônicos como Barra, Rio Vermelho, Pelourinho, Pituba, Itapuã, Bonfim e Stella Maris. Veja horários de funcionamento em tempo real e status de aberto agora.',
      icon: MapPin,
      color: '#0B4F8A',
      accentBg: 'bg-blue-50',
      badge: 'Localização Inteligente',
      illustration: '🏝️📍🏪',
    },
    {
      step: '02',
      title: 'Veja ofertas direto no mapa',
      subtitle: 'Economia e ofertas exclusivas',
      description:
        'Toque nos pinos do mapa para ver a prévia de promoções ativas sem precisar abrir o perfil completo. Descubra descontos especiais e aproveite os melhores preços do comércio baiano.',
      icon: Sparkles,
      color: '#E8552B',
      accentBg: 'bg-orange-50',
      badge: 'Economize em Salvador',
      illustration: '🎁🏷️✨',
    },
    {
      step: '03',
      title: 'Fale com a loja pelo chat',
      subtitle: 'Atendimento rápido e direto',
      description:
        'Tire dúvidas sobre produtos, cardápios, entregas e agendamentos instantaneamente com os lojistas locais, sem intermediários. 100% gratuito para o morador e turista.',
      icon: MessageCircle,
      color: '#2E9E5B',
      accentBg: 'bg-green-50',
      badge: 'Chat em Tempo Real',
      illustration: '💬🛵👋',
    },
    {
      step: '04',
      title: 'Para Lojistas de Salvador',
      subtitle: 'Divulgue sua empresa por R$ 12/mês',
      description:
        'Coloque sua loja no mapa mais acessado da Bahia! Tenha painel de controle próprio, publique ofertas relâmpago, receba avaliações e atenda clientes no chat.',
      icon: Store,
      color: '#0B4F8A',
      accentBg: 'bg-amber-50',
      badge: 'Plano Comercial R$ 12/mês',
      illustration: '🏬📈💼',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const current = slides[currentSlide];
  const IconComponent = current.icon;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      {/* Top Bonfim Ribbon */}
      <BonfimRibbon height="h-2" />

      {/* Top Header with Skip Button */}
      <header className="max-w-md mx-auto w-full px-6 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/salvo-logo.png"
            alt="SALVÔ"
            className="w-8 h-8 rounded-xl object-cover border border-slate-200"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://iili.io/CDs6WS1.jpg';
            }}
          />
          <span className="font-heading font-black text-sm text-[#0B4F8A]">SALVÔ</span>
        </div>

        <button
          onClick={onComplete}
          className="text-xs font-bold text-slate-500 hover:text-[#0B4F8A] uppercase tracking-wider py-1.5 px-3 rounded-xl hover:bg-slate-100 transition-all"
        >
          Pular Tutorial
        </button>
      </header>

      {/* Main Slide Card Container */}
      <main className="max-w-md mx-auto w-full px-6 py-6 flex-1 flex flex-col justify-center">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 relative overflow-hidden">
          {/* Subtle Top Accent Color Line */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5 transition-colors duration-300"
            style={{ backgroundColor: current.color }}
          />

          {/* Badge & Step indicator */}
          <div className="flex items-center justify-between mb-6">
            <span
              className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-white shadow-2xs"
              style={{ backgroundColor: current.color }}
            >
              {current.badge}
            </span>
            <span className="text-xs font-black text-slate-400">
              Passo {currentSlide + 1} de {slides.length}
            </span>
          </div>

          {/* Graphic Icon Box */}
          <div className="flex flex-col items-center justify-center my-4">
            <div
              className={`w-28 h-28 rounded-3xl ${current.accentBg} flex items-center justify-center mb-3 shadow-inner relative transition-transform duration-300 transform scale-100 hover:scale-105`}
            >
              <span className="text-4xl">{current.illustration}</span>
              <div
                className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: current.color }}
              >
                <IconComponent className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              {current.subtitle}
            </p>
          </div>

          {/* Texts */}
          <div className="text-center mb-6">
            <h2 className="font-heading font-black text-2xl text-slate-900 leading-tight mb-3">
              {current.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'w-8 bg-[#0B4F8A]'
                    : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
                title={`Ir para o slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Next / Back Buttons */}
          <div className="flex items-center gap-3">
            {currentSlide > 0 && (
              <button
                onClick={handlePrev}
                className="h-12 px-4 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs flex items-center justify-center transition-all active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span>Voltar</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex-1 h-12 bg-[#FFC72C] hover:bg-[#f3bd24] text-[#0B4F8A] font-heading font-black text-xs uppercase tracking-wider rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <span>{currentSlide === slides.length - 1 ? 'Explorar Salvador Agora' : 'Próximo'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Switch to Auth */}
      <footer className="max-w-md mx-auto w-full px-6 pb-6 text-center">
        <button
          onClick={onOpenAuth}
          className="text-xs font-bold text-[#0B4F8A] hover:underline"
        >
          Já tem uma conta ou quer cadastrar sua loja? Entrar aqui →
        </button>
      </footer>
    </div>
  );
};
