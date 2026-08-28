import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  Store,
  Radio,
  Share2,
  Award,
  Users,
  Compass,
  Building2,
  Heart,
  PhoneCall,
  Mail,
  Instagram,
  Globe,
  ExternalLink,
  MessageCircle,
  Clock,
  ThumbsUp,
  Check,
  Star,
} from 'lucide-react';
import { User, Store as StoreType } from '../types';

interface SalvoOfficialViewProps {
  currentUser?: User;
  onNavigateToTab: (tab: any) => void;
  onSelectStore?: (store: StoreType) => void;
  allStores?: StoreType[];
}

export const SalvoOfficialView: React.FC<SalvoOfficialViewProps> = ({
  currentUser,
  onNavigateToTab,
  onSelectStore,
  allStores = [],
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeOfficialTab, setActiveOfficialTab] = useState<'sobre' | 'selo' | 'comunidade' | 'contato'>('sobre');

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SALVÔ Oficial — O Guia Oficial de Salvador',
        text: 'Conheça o portal e aplicativo oficial do comércio local de Salvador!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const verifiedStores = allStores.filter((s) => s.isFeatured || s.approvalStatus === 'approved').slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      {/* =========================================================
          HERO PROFILE CARD: SALVÔ OFICIAL COM SELO VERIFICADO
      ========================================================= */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white">
        {/* Banner de Fundo (Salvador/Pelourinho com Gradiente Baiano) */}
        <div className="h-44 sm:h-56 w-full bg-gradient-to-r from-[#0B3D91] via-[#0E4A9E] to-[#C1502E] relative overflow-hidden">
          <div className="absolute inset-0 opacity-25 mix-blend-overlay bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="absolute bottom-3 right-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20">
            <MapPin className="w-3.5 h-3.5 text-[#FFC72C]" />
            <span>Salvador, Bahia • Brasil</span>
          </div>
        </div>

        {/* Informações Principais do Perfil Oficial */}
        <div className="px-5 sm:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
            {/* Foto de Perfil Oficial com Ícone & Selo Verificado */}
            <div className="relative inline-block self-start sm:self-auto">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-white p-2 shadow-2xl border-4 border-white overflow-hidden relative group">
                <img
                  src="/salvo-logo.png"
                  alt="SALVÔ Oficial"
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://iili.io/CDs6WS1.jpg';
                  }}
                />
              </div>

              {/* ÍCONE DE VERIFICADO OFICIAL NA FOTO DE PERFIL */}
              <div
                className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#0B3D91] to-[#0E4A9E] text-white p-1.5 sm:p-2 rounded-2xl shadow-xl border-2 border-white flex items-center justify-center"
                title="Perfil Oficial Verificado Salvô"
              >
                <div className="relative flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFC72C] fill-[#FFC72C]/20" />
                  <span className="sr-only">Verificado Oficial</span>
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={handleShare}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs sm:text-sm font-heading font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Link Copiado!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Compartilhar Perfil</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onNavigateToTab('merchant_register')}
                className="px-5 py-2.5 bg-[#0B3D91] hover:bg-[#082B66] text-white rounded-2xl text-xs sm:text-sm font-heading font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Store className="w-4 h-4 text-[#FFC72C]" />
                <span>Cadastrar Comércio</span>
              </button>
            </div>
          </div>

          {/* Nome, Bio e Badges */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Salvô Oficial</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0B3D91] border border-blue-200 text-xs font-bold shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B3D91] fill-blue-100" />
                  <span>Conta Oficial Verificada</span>
                </span>
              </h1>
            </div>

            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-3xl leading-relaxed">
              O ecossistema e guia digital oficial do comércio local, serviços e cultura de Salvador.
              Conectando moradores, turistas e comerciantes em mais de 160 bairros soteropolitanos com inovação, segurança e axé.
            </p>

            {/* Badges de Destaque */}
            <div className="flex items-center gap-3 pt-2 flex-wrap text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 rounded-xl border border-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Feito em Salvador, BA</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Comércios 100% Verificados</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-800 rounded-xl border border-rose-200">
                <Radio className="w-3.5 h-3.5 text-rose-600" />
                <span>Rádio Salvô Oficial</span>
              </div>
            </div>
          </div>
        </div>

        {/* Abas Internas da Página Oficial */}
        <div className="border-t border-slate-100 px-5 sm:px-8 bg-slate-50/70 flex items-center gap-1 sm:gap-2 overflow-x-auto py-2">
          <button
            onClick={() => setActiveOfficialTab('sobre')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeOfficialTab === 'sobre'
                ? 'bg-white text-[#0B3D91] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sobre a Salvô
          </button>
          <button
            onClick={() => setActiveOfficialTab('selo')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeOfficialTab === 'selo'
                ? 'bg-white text-[#0B3D91] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Selo de Verificação
          </button>
          <button
            onClick={() => setActiveOfficialTab('comunidade')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeOfficialTab === 'comunidade'
                ? 'bg-white text-[#0B3D91] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lojas Verificadas
          </button>
          <button
            onClick={() => setActiveOfficialTab('contato')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeOfficialTab === 'contato'
                ? 'bg-white text-[#0B3D91] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Canais Oficiais & Contato
          </button>
        </div>
      </div>

      {/* =========================================================
          CONTEÚDO DA ABA: SOBRE A SALVÔ
      ========================================================= */}
      {activeOfficialTab === 'sobre' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Card Manifesto */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 text-[#0B3D91]">
                <Award className="w-6 h-6 text-[#C1502E]" />
                <h2 className="text-xl font-heading font-black text-slate-900">
                  O Manifesto Salvô: Valorizando Quem Movimenta Salvador
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                Salvador é pulsante, diversa e rica em histórias de empreendedores que fazem a cidade acontecer todos os dias — da baiana de acarajé no Rio Vermelho ao restaurante de frutos do mar em Itapuã, das lojas de moda da Pituba aos prestadores de serviços de Brotas e Liberdade.
              </p>
              <p className="text-slate-600 leading-relaxed font-medium">
                A <strong>SALVÔ</strong> nasceu com o compromisso de digitalizar e impulsionar os comerciantes locais, garantindo que qualquer morador ou visitante encontre rapidamente o que precisa, com localização por GPS em tempo real, ofertas autênticas, clima e rádios locais.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <h3 className="font-heading font-black text-sm text-[#0B3D91] flex items-center gap-1.5">
                    <Compass className="w-4 h-4" />
                    Missão
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    Conectar o consumidor soteropolitano aos melhores negócios da sua região com transparência e tecnologia.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                  <h3 className="font-heading font-black text-sm text-amber-900 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-amber-600" />
                    Identidade
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    100% baiana, feita com orgulho da cultura, gastronomia e comércio da capital da Bahia.
                  </p>
                </div>
              </div>
            </div>

            {/* Números e Impacto */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm text-center">
                <span className="text-2xl sm:text-3xl font-heading font-black text-[#0B3D91] block">
                  160+
                </span>
                <span className="text-xs text-slate-500 font-bold mt-1 block">
                  Bairros Mapeados
                </span>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm text-center">
                <span className="text-2xl sm:text-3xl font-heading font-black text-[#C1502E] block">
                  1.200+
                </span>
                <span className="text-xs text-slate-500 font-bold mt-1 block">
                  Lojas & Serviços
                </span>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm text-center">
                <span className="text-2xl sm:text-3xl font-heading font-black text-emerald-600 block">
                  100%
                </span>
                <span className="text-xs text-slate-500 font-bold mt-1 block">
                  Verificação Real
                </span>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm text-center">
                <span className="text-2xl sm:text-3xl font-heading font-black text-amber-600 block">
                  24h
                </span>
                <span className="text-xs text-slate-500 font-bold mt-1 block">
                  Rádio Salvô no Ar
                </span>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Recursos Oficiais */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#0B3D91] to-[#082B66] text-white rounded-3xl p-6 shadow-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <ShieldCheck className="w-6 h-6 text-[#FFC72C]" />
              </div>
              <h3 className="text-lg font-heading font-black">
                Selo Oficial de Salvador
              </h3>
              <p className="text-xs text-sky-100 font-medium leading-relaxed">
                As lojas e prestadores de serviços com o selo azul e dourado são auditados para garantir segurança, endereço válido e atendimento de excelência.
              </p>
              <button
                onClick={() => setActiveOfficialTab('selo')}
                className="w-full py-2.5 bg-[#FFC72C] hover:bg-[#FFAA00] text-[#0B3D91] rounded-xl text-xs font-heading font-black transition-all cursor-pointer uppercase tracking-wider"
              >
                Como Obter o Selo
              </button>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-heading font-black text-sm text-slate-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-600" />
                <span>Rádio Salvô Ao Vivo</span>
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Ouça o melhor do Axé, Samba-Reggae e Carnaval 24h sem propagandas diretamente pelo aplicativo.
              </p>
              <button
                onClick={() => onNavigateToTab('weather_traffic')}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer"
              >
                Abrir Central AoVivo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          CONTEÚDO DA ABA: SELO DE VERIFICAÇÃO
      ========================================================= */}
      {activeOfficialTab === 'selo' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-heading font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-[#0B3D91]" />
              <span>Programa de Verificação e Selo Oficial Salvô</span>
            </h2>
            <p className="text-sm text-slate-600 mt-2 font-medium leading-relaxed">
              O Selo Oficial Salvô é concedido a empresas soteropolitanas que cumprem critérios rigorosos de autenticidade, localização comprovada e compromisso com o consumidor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0B3D91] flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-heading font-black text-sm text-slate-900">
                Cadastro Completo
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Endereço físico em Salvador, telefone verificado, fotos do local e documentação básica.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0B3D91] flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-heading font-black text-sm text-slate-900">
                Auditoria de Localização
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Conferência do ponto no mapa de bairros e GPS de Salvador para garantir que a loja existe.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0B3D91] flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-heading font-black text-sm text-slate-900">
                Emissão do Selo
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                A loja recebe o selo verificado azul, destaque nos resultados de busca e prioridade no feed.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-heading font-black text-sm text-slate-900">
                É comerciante ou prestador de serviço em Salvador?
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Cadastre sua empresa gratuitamente e solicite sua verificação hoje mesmo.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('merchant_register')}
              className="px-6 py-3 bg-[#0B3D91] hover:bg-[#082B66] text-white rounded-2xl text-xs sm:text-sm font-heading font-black transition-all shadow-md cursor-pointer whitespace-nowrap"
            >
              Solicitar Selo Verificado
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          CONTEÚDO DA ABA: LOJAS VERIFICADAS
      ========================================================= */}
      {activeOfficialTab === 'comunidade' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-heading font-black text-slate-900">
                Comércios com Certificação Oficial Salvô
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Estabelecimentos auditados e com selo de autenticidade ativo
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('explore')}
              className="text-xs font-heading font-bold text-[#0B3D91] hover:underline"
            >
              Ver todos no Mapa →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {verifiedStores.map((store) => (
              <div
                key={store.id}
                onClick={() => onSelectStore && onSelectStore(store)}
                className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-32 rounded-2xl overflow-hidden mb-3">
                    <img
                      src={store.coverImage || store.logo}
                      alt={store.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#0B3D91] text-[#FFC72C] text-[10px] font-black uppercase flex items-center gap-1 shadow-md">
                      <ShieldCheck className="w-3 h-3" />
                      Verificado
                    </div>
                  </div>

                  <h3 className="font-heading font-black text-sm text-slate-900 group-hover:text-[#0B3D91] transition-colors">
                    {store.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#C1502E]" />
                    <span>{store.neighborhood}, Salvador</span>
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-slate-600">{store.category}</span>
                  <span className="text-amber-500 font-black flex items-center gap-0.5">
                    ★ {store.rating?.toFixed(1) || '4.9'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          CONTEÚDO DA ABA: CANAIS OFICIAIS & CONTATO
      ========================================================= */}
      {activeOfficialTab === 'contato' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-2xl font-heading font-black text-slate-900">
              Canais Oficiais de Atendimento Salvô
            </h2>
            <p className="text-sm text-slate-600 mt-1 font-medium">
              Fale diretamente com nossa equipe oficial de suporte a comerciantes e usuários em Salvador.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-black text-sm text-emerald-950">
                WhatsApp Oficial Salvô
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Atendimento rápido para lojistas, parcerias e dúvidas gerais.
              </p>
              <a
                href="https://wa.me/5571999999999?text=Ol%C3%A1%2C+estou+no+Salv%C3%B4+Oficial+e+gostaria+de+informa%C3%A7%C3%B5es"
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 text-xs font-heading font-black text-emerald-700 hover:underline"
              >
                Iniciar Conversa no Zap →
              </a>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#0B3D91] text-white flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-black text-sm text-blue-950">
                E-mail Institucional
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                contato@salvooficial.ba.gov.br
              </p>
              <span className="inline-block text-[11px] text-slate-400 font-medium mt-1">
                Resposta em até 24h úteis
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-pink-50/60 border border-pink-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center">
                <Instagram className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-black text-sm text-pink-950">
                Instagram Oficial
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                @salvooficial • Salvador, Bahia
              </p>
              <span className="inline-block text-[11px] text-pink-700 font-bold mt-1">
                Destaques, eventos e dicas
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
