// ==============================================================================
// 🌊 ONBOARDING VIEW — CONFIGURAÇÃO INICIAL UNIFICADA DO SUPERAPP SALVÔ
// Seleção de Bairros, Categorias de Interesse e Permissões (GPS & Notificações)
// ==============================================================================

import React, { useState } from 'react';
import { MaresRibbon, WavesPattern, SalvadorSkylineSilhouette } from '../components/MaresPattern';
import { MapPin, Sparkles, Bell, Navigation, CheckCircle2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

interface OnboardingViewProps {
  onComplete: () => void;
  onOpenAuth: () => void;
}

const POPULAR_NEIGHBORHOODS = [
  'Barra',
  'Rio Vermelho',
  'Pelourinho / Centro Histórico',
  'Pituba',
  'Itapuã',
  'Imbuí',
  'Stella Maris',
  'Bonfim / Cidade Baixa',
  'Graça',
  'Cabula',
];

const POPULAR_CATEGORIES = [
  'Restaurantes & Gastronomia',
  'Bares, Botecos & Vida Noturna',
  'Moda, Roupas & Acessórios',
  'Beleza, Barbearias & Estética',
  'Mercados, Padarias & Empórios',
  'Turismo, Passeios & Hotelaria',
];

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete, onOpenAuth }) => {
  const [step, setStep] = useState<'welcome' | 'neighborhoods' | 'categories' | 'permissions'>('welcome');
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>(['Barra', 'Rio Vermelho']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Restaurantes & Gastronomia']);
  const [gpsGranted, setGpsGranted] = useState(false);
  const [pushGranted, setPushGranted] = useState(false);

  const toggleNeighborhood = (n: string) => {
    if (selectedNeighborhoods.includes(n)) {
      setSelectedNeighborhoods(selectedNeighborhoods.filter((item) => item !== n));
    } else {
      setSelectedNeighborhoods([...selectedNeighborhoods, n]);
    }
  };

  const toggleCategory = (c: string) => {
    if (selectedCategories.includes(c)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== c));
    } else {
      setSelectedCategories([...selectedCategories, c]);
    }
  };

  const handleRequestGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setGpsGranted(true),
        () => setGpsGranted(true) // Simula consentimento
      );
    } else {
      setGpsGranted(true);
    }
  };

  const handleRequestPush = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(() => {
        setPushGranted(true);
      });
    } else {
      setPushGranted(true);
    }
  };

  const handleFinish = () => {
    try {
      localStorage.setItem('salvo_onboarding_done', 'true');
      localStorage.setItem('salvo_fav_neighborhoods', JSON.stringify(selectedNeighborhoods));
      localStorage.setItem('salvo_fav_categories', JSON.stringify(selectedCategories));
    } catch {}
    onComplete();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden font-sans">
      <WavesPattern intensity="soft" />
      <MaresRibbon />

      <div className="max-w-md mx-auto w-full px-5 py-8 flex-1 flex flex-col justify-between z-10">
        {/* Step Indicator */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-1.5">
            {['welcome', 'neighborhoods', 'categories', 'permissions'].map((st, i) => (
              <div
                key={st}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === st ? 'w-8 bg-[#E89F3C]' : 'w-3 bg-slate-800'
                }`}
              />
            ))}
          </div>
          <button
            onClick={onOpenAuth}
            className="text-xs font-bold text-cyan-300 hover:text-cyan-200 uppercase tracking-wider"
          >
            Já tenho conta
          </button>
        </div>

        {/* Step 1: Welcome */}
        {step === 'welcome' && (
          <div className="flex-1 flex flex-col justify-center animate-in fade-in duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0F4C81] to-[#2A9D8F] flex items-center justify-center text-2xl shadow-xl shadow-cyan-900/30 mb-4">
              🌊
            </div>

            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 w-fit mb-2">
              SuperApp Urbano & Comercial
            </span>

            <h1 className="text-3xl font-black font-display tracking-tight text-white mb-2 leading-tight">
              O mapa vivo do comércio de Salvador.
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Descubra onde tem oferta agora, navegue até a loja física e pague menos. Tudo no ritmo das marés de Salvador.
            </p>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Geolocalização precisa e ofertas relâmpago</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Navegação de destino sem complicação</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Gamificação de Marés (🌊) e Conchas (🐚)</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Bairros Favoritos */}
        {step === 'neighborhoods' && (
          <div className="flex-1 flex flex-col justify-center animate-in fade-in duration-300">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-[#E89F3C]" />
              <h2 className="text-xl font-black font-display text-white">Quais bairros você mais frequenta?</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Personalize o feed para ver promoções e comércios que estão no seu caminho.
            </p>

            <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto pr-1">
              {POPULAR_NEIGHBORHOODS.map((neighborhood) => {
                const isSelected = selectedNeighborhoods.includes(neighborhood);
                return (
                  <button
                    key={neighborhood}
                    type="button"
                    onClick={() => toggleNeighborhood(neighborhood)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#0F4C81] text-white border-2 border-cyan-400 shadow-md shadow-cyan-900/40'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {neighborhood}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Categorias de Interesse */}
        {step === 'categories' && (
          <div className="flex-1 flex flex-col justify-center animate-in fade-in duration-300">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-5 h-5 text-[#2A9D8F]" />
              <h2 className="text-xl font-black font-display text-white">O que você mais busca?</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Selecione suas categorias favoritas para receber cupons direcionados.
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {POPULAR_CATEGORIES.map((category) => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`p-3.5 rounded-2xl text-xs font-bold text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#0F4C81] to-[#2A9D8F] text-white border border-cyan-300'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{category}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-200" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Permissões */}
        {step === 'permissions' && (
          <div className="flex-1 flex flex-col justify-center animate-in fade-in duration-300">
            <h2 className="text-xl font-black font-display text-white mb-1">Para Salvador funcionar 100%</h2>
            <p className="text-xs text-slate-400 mb-6">
              Habilite as permissões para ver o mapa com as lojas em tempo real e receber alertas de maré alta e promoções relâmpago.
            </p>

            <div className="flex flex-col gap-3">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-950 text-cyan-400 flex items-center justify-center">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Geolocalização GPS</h3>
                    <p className="text-[11px] text-slate-400">Para calcular distância e rota até as lojas</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRequestGps}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${
                    gpsGranted ? 'bg-emerald-500 text-white' : 'bg-[#0F4C81] text-cyan-200'
                  }`}
                >
                  {gpsGranted ? 'Ativo ✓' : 'Permitir'}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Notificações Push</h3>
                    <p className="text-[11px] text-slate-400">Para alertas de Maré Cheia e cupons próximos</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRequestPush}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${
                    pushGranted ? 'bg-emerald-500 text-white' : 'bg-[#E89F3C] text-slate-950'
                  }`}
                >
                  {pushGranted ? 'Ativo ✓' : 'Permitir'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-900 flex items-center gap-3">
          {step === 'welcome' && (
            <button
              type="button"
              onClick={() => setStep('neighborhoods')}
              className="w-full py-4 rounded-2xl bg-[#0F4C81] hover:bg-[#0c3e69] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50 active:scale-95 transition-all"
            >
              <span>Começar a Explorar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 'neighborhoods' && (
            <button
              type="button"
              onClick={() => setStep('categories')}
              className="w-full py-4 rounded-2xl bg-[#0F4C81] hover:bg-[#0c3e69] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 'categories' && (
            <button
              type="button"
              onClick={() => setStep('permissions')}
              className="w-full py-4 rounded-2xl bg-[#0F4C81] hover:bg-[#0c3e69] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 'permissions' && (
            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#E89F3C] via-[#E76F51] to-[#0F4C81] text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-950/40 active:scale-95 transition-all"
            >
              <span>Entrar no SALVÔ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
