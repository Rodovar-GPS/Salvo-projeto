import React, { useState } from 'react';
import { User, Store, EventItem } from '../types';
import {
  Users,
  Store as StoreIcon,
  Sparkles,
  Flame,
  Heart,
  MessageCircle,
  Share2,
  Video,
  MapPin,
  Calendar,
  Radio,
  UserPlus,
  Handshake,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { BonfimRibbon } from '../components/BonfimRibbon';

interface ForYouSocialViewProps {
  currentUser: User;
  stores: Store[];
  events: EventItem[];
  onSelectStore: (store: Store) => void;
  onOpenChat: (store: Store) => void;
  onNavigateToOffers?: () => void;
  onNavigateToEvents?: () => void;
}

export const ForYouSocialView: React.FC<ForYouSocialViewProps> = ({
  currentUser,
  stores,
  events,
  onSelectStore,
  onOpenChat,
  onNavigateToOffers,
  onNavigateToEvents,
}) => {
  // Experience sub-tabs: 1. "para_mim" (Personalized discovery) | 2. "lojas_seguidas" (Followed stores feed)
  const [socialTab, setSocialTab] = useState<'para_mim' | 'lojas_seguidas'>('para_mim');
  const [selectedNeighborhoodFilter, setSelectedNeighborhoodFilter] = useState<string>('Todos');

  const isMerchant = currentUser.role === 'merchant';
  const userHandle = `@${currentUser.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* =========================================================
          1. HEADER & BONFIM RIBBON BANNER
      ========================================================= */}
      <div className="bg-white border-b border-slate-200">
        <BonfimRibbon height="h-1.5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#0B4F8A] to-[#083863] text-white">
                  Rede Social & Descoberta Local
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  Salvador • BA
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 mt-1.5 tracking-tight flex items-center gap-2">
                <span>Para Mim</span>
                <span className="text-[#E8552B] font-serif text-lg sm:text-xl font-normal italic">
                  — O que Salvador tem de melhor
                </span>
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl mt-1">
                Conecte-se com pessoas, acompanhe suas lojas favoritas, descubra ofertas em primeira mão e viva os eventos da cidade.
              </p>
            </div>

            {/* User Profile Overview Card */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-3 sm:px-4 shrink-0 shadow-2xs">
              <div className="relative">
                <img
                  src={
                    currentUser.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    isMerchant ? 'bg-[#0B4F8A]' : 'bg-[#2E9E5B]'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-900">{currentUser.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 font-mono text-slate-700">
                    {userHandle}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[11px] font-semibold text-slate-500">
                  <span>
                    <strong className="text-slate-800 font-bold">12</strong> {isMerchant ? 'seguidores' : 'amigos'}
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-slate-800 font-bold">{currentUser.favoriteStoreIds?.length || 3}</strong> lojas seguidas
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              2. SUB-EXPERIÊNCIAS (TABS: PARA MIM / LOJAS SEGUIDAS)
          ========================================================= */}
          <div className="flex items-center gap-2 mt-6 border-b border-slate-200 pb-0">
            <button
              onClick={() => setSocialTab('para_mim')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-heading font-black text-xs sm:text-sm tracking-wide border-b-2 transition-all select-none ${
                socialTab === 'para_mim'
                  ? 'border-[#0B4F8A] text-[#0B4F8A] bg-blue-50/50 rounded-t-xl'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-t-xl'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#FFC72C]" />
              <span>Para Mim</span>
              <span className="px-1.5 py-0.2 bg-[#0B4F8A] text-white text-[10px] rounded-full font-bold">
                Personalizado
              </span>
            </button>

            <button
              onClick={() => setSocialTab('lojas_seguidas')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-heading font-black text-xs sm:text-sm tracking-wide border-b-2 transition-all select-none ${
                socialTab === 'lojas_seguidas'
                  ? 'border-[#0B4F8A] text-[#0B4F8A] bg-blue-50/50 rounded-t-xl'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-t-xl'
              }`}
            >
              <StoreIcon className="w-4 h-4 text-[#0B4F8A]" />
              <span>Lojas Seguidas</span>
              <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 text-[10px] rounded-full font-bold">
                {currentUser.favoriteStoreIds?.length || 3}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          3. CORPO PRINCIPAL & PILARES DA REDE SOCIAL
      ========================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 7 Pilares de Descoberta Visual */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base font-heading font-black text-slate-900 flex items-center gap-2">
                <span className="text-lg">🌴</span> Pilares de Descoberta Social
              </h2>
              <p className="text-xs text-slate-500">
                Tudo o que você pode explorar e compartilhar na comunidade oficial de Salvador.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B4F8A] bg-blue-50 px-2.5 py-1 rounded-lg">
              Salvador 360°
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: 'Pessoas & Amigos', icon: Users, color: 'bg-blue-50 text-[#0B4F8A]' },
              { label: 'Lojas & Comércio', icon: StoreIcon, color: 'bg-amber-50 text-amber-700' },
              { label: 'Ofertas Quentes', icon: Flame, color: 'bg-orange-50 text-[#E8552B]' },
              { label: 'Fotos & Vídeos', icon: Video, color: 'bg-purple-50 text-purple-700' },
              { label: 'Lugares & Bairros', icon: MapPin, color: 'bg-emerald-50 text-emerald-700' },
              { label: 'Eventos & Shows', icon: Calendar, color: 'bg-rose-50 text-rose-700' },
              { label: 'Transmissões Ao Vivo', icon: Radio, color: 'bg-red-50 text-red-600' },
            ].map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center p-3 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${pillar.color}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    {pillar.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            4. ESTRUTURA DE RELACIONAMENTOS & AÇÕES DA ETAPA 1
        ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cartão 1: Relacionamentos Oficiais */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0B4F8A] flex items-center justify-center mb-4">
                <UserPlus className="w-5 h-5" />
              </div>
              <h3 className="text-base font-heading font-black text-slate-900">
                1. Conexões & Relacionamentos
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Arquitetura de 3 níveis de conexão configurada para Salvador:
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-base">🤝</span>
                  <div>
                    <strong className="font-bold text-slate-900">Cliente ↔ Cliente:</strong>
                    <span className="text-slate-600 block mt-0.5">Amizade e compartilhamento de dicas locais.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-base">⭐</span>
                  <div>
                    <strong className="font-bold text-slate-900">Cliente → Loja:</strong>
                    <span className="text-slate-600 block mt-0.5">Seguir estabelecimentos e receber ofertas no feed.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-base">🏢</span>
                  <div>
                    <strong className="font-bold text-slate-900">Loja ↔ Loja:</strong>
                    <span className="text-slate-600 block mt-0.5">Parceria comercial, cross-promoção e combos conjuntos.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Entidades estruturadas no sistema</span>
            </div>
          </div>

          {/* Cartão 2: Ações & Reações Diferenciadas */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#E8552B] flex items-center justify-center mb-4">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-heading font-black text-slate-900">
                2. Ações & Reações Inteligentes
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Reações exclusivas por perfil para impulsionar o comércio local:
              </p>

              <div className="mt-4 space-y-3">
                <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#0B4F8A] block mb-1">
                    Reações do Cliente
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-white rounded-xl text-xs font-bold text-slate-700 shadow-2xs border border-slate-200/60 flex items-center gap-1">
                      👍 Gostei
                    </span>
                    <span className="px-2.5 py-1 bg-gradient-to-r from-[#E8552B] to-[#FF5722] text-white rounded-xl text-xs font-black shadow-2xs flex items-center gap-1">
                      🔥 Eu Quero
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block mb-1">
                    Reações do Lojista
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-white rounded-xl text-xs font-bold text-slate-700 shadow-2xs border border-slate-200/60 flex items-center gap-1">
                      ❤️ Amei
                    </span>
                    <span className="px-2.5 py-1 bg-[#0B4F8A] text-white rounded-xl text-xs font-black shadow-2xs flex items-center gap-1">
                      💼 Eu Compro / Parceria
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Tipagem e esquema de reações ativos</span>
            </div>
          </div>

          {/* Cartão 3: Privacidade & Segurança */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-heading font-black text-slate-900">
                3. Privacidade & Segurança
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Controle de dados, moderação local e proteção de privacidade:
              </p>

              <div className="mt-4 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span>Perfil público ou fechado por escolha do usuário</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                  <MessageCircle className="w-4 h-4 text-slate-500" />
                  <span>Controle de recebimento de mensagens diretas</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                  <span>Denúncia e bloqueio de perfis e conteúdos</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Modelagem de segurança preparada</span>
            </div>
          </div>
        </div>

        {/* =========================================================
            5. FEED PREVIEW & LOJAS SEGUIDAS (CONTEÚDO REAL DO SISTEMA)
        ========================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-heading font-black text-slate-900">
                {socialTab === 'para_mim'
                  ? 'Destaques do Comércio e da Comunidade em Salvador'
                  : 'Atualizações das Lojas que Você Acompanha'}
              </h2>
              <p className="text-xs text-slate-500">
                {socialTab === 'para_mim'
                  ? 'Conteúdo com curadoria local de estabelecimentos e bairros de Salvador.'
                  : 'Publicações, combos e novidades dos estabelecimentos favoritados.'}
              </p>
            </div>

            {onNavigateToOffers && (
              <button
                onClick={onNavigateToOffers}
                className="text-xs font-bold text-[#0B4F8A] hover:underline flex items-center gap-1"
              >
                <span>Ver todas as ofertas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.slice(0, 3).map((store) => {
              const bestOffer = store.offers && store.offers.length > 0 ? store.offers[0] : null;

              return (
                <div
                  key={store.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Header do Post */}
                  <div className="p-4 flex items-center justify-between gap-3 border-b border-slate-100">
                    <div
                      onClick={() => onSelectStore(store)}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <img
                        src={store.logo}
                        alt={store.name}
                        className="w-10 h-10 rounded-2xl object-cover border border-slate-100 shadow-2xs group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-black text-slate-900 group-hover:text-[#0B4F8A] transition-colors line-clamp-1">
                            {store.name}
                          </h4>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E5B]" />
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {store.neighborhood} • Salvador
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenChat(store)}
                      className="p-2 text-slate-500 hover:text-[#0B4F8A] hover:bg-blue-50 rounded-xl transition-colors"
                      title="Conversar com o estabelecimento"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Imagem de Capa do Post */}
                  <div
                    onClick={() => onSelectStore(store)}
                    className="relative aspect-16/10 cursor-pointer overflow-hidden group"
                  >
                    <img
                      src={store.coverImage}
                      alt={store.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {bestOffer && (
                      <div className="absolute top-3 left-3 bg-[#E8552B] text-white px-2.5 py-1 rounded-xl text-xs font-black shadow-md flex items-center gap-1 border border-white/80">
                        <Flame className="w-3.5 h-3.5" />
                        <span>{bestOffer.discountBadge}</span>
                      </div>
                    )}
                  </div>

                  {/* Conteúdo & Ações */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                        {store.description}
                      </p>

                      {bestOffer && (
                        <div className="mt-3 p-2.5 rounded-2xl bg-orange-50/70 border border-orange-100 flex items-center justify-between text-xs">
                          <span className="font-bold text-orange-950 line-clamp-1">{bestOffer.title}</span>
                          <span className="font-black text-[#E8552B] shrink-0">{bestOffer.priceText || bestOffer.discountBadge}</span>
                        </div>
                      )}
                    </div>

                    {/* Barra de Reações e Interações da Arquitetura Social */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 text-slate-600 hover:text-[#0B4F8A] transition-colors py-1 px-2 rounded-lg hover:bg-slate-50">
                          <Heart className="w-3.5 h-3.5" />
                          <span className="font-bold text-[11px]">Gostei</span>
                        </button>
                        <button className="flex items-center gap-1 text-[#E8552B] hover:text-orange-700 transition-colors py-1 px-2 rounded-lg hover:bg-orange-50">
                          <Flame className="w-3.5 h-3.5" />
                          <span className="font-bold text-[11px]">Eu Quero</span>
                        </button>
                      </div>

                      <button
                        onClick={() => onSelectStore(store)}
                        className="text-[11px] font-black text-[#0B4F8A] hover:underline"
                      >
                        Ver Perfil
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
