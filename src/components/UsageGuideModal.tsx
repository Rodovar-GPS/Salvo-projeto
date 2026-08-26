import React, { useState } from 'react';
import {
  X,
  LogIn,
  Search,
  MessageSquare,
  Sparkles,
  MapPin,
  Compass,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Store,
  Tag,
  ShieldCheck,
  Zap,
  HelpCircle,
  Clock,
  PhoneCall,
  Share2,
} from 'lucide-react';
import { BonfimRibbon } from './BonfimRibbon';

interface UsageGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
  onStartSearch?: () => void;
  onOpenChatDemo?: () => void;
}

export const UsageGuideModal: React.FC<UsageGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
  onStartSearch,
  onOpenChatDemo,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isOpen) return null;

  const steps = [
    {
      id: 1,
      title: 'Realizar Login & Cadastro',
      shortTitle: '1. Login & Cadastro',
      icon: LogIn,
      color: '#0B4F8A',
      badge: '100% Gratuito',
      badgeColor: 'bg-[#FFC72C] text-[#0B4F8A]',
      subtitle: 'Acesse como cliente, turista ou cadastre seu comércio',
      description:
        'Crie sua conta em segundos para salvar favoritos, conversar no chat e aproveitar ofertas exclusivas de Salvador.',
      instructions: [
        {
          title: 'Acesse pelo Botão Superior ou Menu',
          desc: 'Clique em "Entrar / Cadastrar" na barra de navegação superior ou na aba "Perfil" no rodapé do celular.',
        },
        {
          title: 'Conta de Cliente & Turista (Gratuita)',
          desc: 'Navegue à vontade, converse com lojas pelo chat e favorite estabelecimentos sem qualquer custo ou mensalidade.',
        },
        {
          title: 'Conta de Lojista / Comerciante',
          desc: 'Deseja divulgar seu negócio? Selecione a opção "Cadastrar Loja" para ter sua página oficial, ofertas e pino no mapa.',
        },
        {
          title: 'Alternância de Perfis em 1 Clique',
          desc: 'No menu superior, você pode alternar facilmente entre modo Cliente, Lojista e Administrador para testar todos os recursos.',
        },
      ],
      actionButton: onOpenAuth ? {
        label: 'Abrir Tela de Login / Cadastro',
        onClick: () => {
          onClose();
          onOpenAuth();
        },
      } : undefined,
    },
    {
      id: 2,
      title: 'Buscar Comércios & Filtrar no Mapa',
      shortTitle: '2. Busca & Mapa',
      icon: Search,
      color: '#0B4F8A',
      badge: 'Geolocalização & Bairros',
      badgeColor: 'bg-sky-100 text-[#0B4F8A]',
      subtitle: 'Encontre lojas, restaurantes e serviços perto de você',
      description:
        'Explore os principais bairros soteropolitanos com filtros inteligentes de horário, categorias e ofertas.',
      instructions: [
        {
          title: 'Campo de Busca Inteligente',
          desc: 'Digite o nome do comércio, prato típico (ex: "acaraké", "moqueca", "açaí"), serviço ou produto para filtrar em tempo real.',
        },
        {
          title: 'Filtro por Bairros Tradicionais',
          desc: 'Filtre por Barra, Pelourinho, Rio Vermelho, Pituba, Bonfim, Itapuã, Ondina e Stella Maris no seletor de bairros.',
        },
        {
          title: 'Modos de Visualização: Mapa e Lista',
          desc: 'Alterne entre o Mapa Interativo de Salvador com pinos coloridos ou a lista detalhada com fotos e avaliações.',
        },
        {
          title: 'Sua Posição no Mapa (GPS)',
          desc: 'Clique no botão "Minha Posição" no mapa para centralizar sua localização e calcular a distância até as lojas.',
        },
      ],
      actionButton: onStartSearch ? {
        label: 'Ir para Barra de Busca',
        onClick: () => {
          onClose();
          onStartSearch();
        },
      } : undefined,
    },
    {
      id: 3,
      title: 'Interagir via Chat em Tempo Real',
      shortTitle: '3. Chat com Lojas',
      icon: MessageSquare,
      color: '#2E9E5B',
      badge: 'Mensagens Diretas',
      badgeColor: 'bg-green-100 text-[#2E9E5B]',
      subtitle: 'Tire dúvidas, peça cardápios e consulte disponibilidade',
      description:
        'Converse diretamente com o atendente da loja pelo chat integrado sem precisar sair do aplicativo.',
      instructions: [
        {
          title: 'Iniciando uma Conversa',
          desc: 'No card de qualquer loja ou em sua página de perfil, clique no botão verde "Conversar no Chat" ou no ícone de balão de mensagem.',
        },
        {
          title: 'Botões de Perguntas Rápidas',
          desc: 'Utilize os atalhos prontos para perguntar sobre "Horário de atendimento", "Entregas no seu bairro", "Pagamento via Pix" e "Cardápio do dia".',
        },
        {
          title: 'Respostas Imediatas e Notificações',
          desc: 'O lojista responde diretamente pelo painel comercial e você visualiza o contador de mensagens não lidas no topo da tela.',
        },
        {
          title: 'Atalho para WhatsApp',
          desc: 'Se preferir atendimento externo, a página da loja também possui o link direto para o WhatsApp oficial do estabelecimento.',
        },
      ],
      actionButton: onOpenChatDemo ? {
        label: 'Abrir Central de Mensagens',
        onClick: () => {
          onClose();
          onOpenChatDemo();
        },
      } : undefined,
    },
    {
      id: 4,
      title: 'Aproveitar Ofertas & Traçar Rotas',
      shortTitle: '4. Ofertas & Rotas',
      icon: Sparkles,
      color: '#E8552B',
      badge: 'Economia Real',
      badgeColor: 'bg-orange-100 text-[#E8552B]',
      subtitle: 'Aproveite descontos especiais no comércio soteropolitano',
      description:
        'Descubra promoções exclusivas e calcule o tempo a pé ou de carro até o endereço desejado.',
      instructions: [
        {
          title: 'Aba de Ofertas Exclusivas',
          desc: 'Acesse a aba "Ofertas" para visualizar todas as promoções ativas e preços especiais com contagem regressiva.',
        },
        {
          title: 'Aproveite Preços Diretos',
          desc: 'Veja o valor original vs promocional e acione o lojista diretamente pelo chat ou WhatsApp para garantir sua oferta.',
        },
        {
          title: 'Rotas e Distâncias no Perfil',
          desc: 'Abra o perfil da loja para ver a distância exata, estimativa de tempo de deslocamento a pé e de carro, e horários de pico.',
        },
        {
          title: 'Avaliações com Estrelas',
          desc: 'Deixe sua nota e comentário sobre o atendimento para ajudar outros soteropolitanos e visitantes.',
        },
      ],
    },
  ];

  const currentStepData = steps.find((s) => s.id === activeStep) || steps[0];
  const StepIcon = currentStepData.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Bonfim Ribbon on Top */}
        <BonfimRibbon height="h-2" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0B4F8A] via-[#105a9c] to-[#0B4F8A] text-white flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-[#FFC72C] text-[#0B4F8A] flex items-center justify-center shadow-md shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-wider text-sky-100">
                  Manual Interativo
                </span>
                <span className="text-[11px] text-sky-200 font-semibold hidden sm:inline">
                  SALVÔ
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-heading font-black tracking-tight">
                Como Usar o SALVÔ
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 z-10"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Selector Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 p-2 sm:p-3 overflow-x-auto flex items-center gap-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0B4F8A] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFC72C]' : 'text-slate-400'}`} />
                <span>{step.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Active Step Intro Banner */}
          <div className="bg-gradient-to-br from-slate-50 to-sky-50/50 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#0B4F8A] text-white flex items-center justify-center shrink-0 shadow-sm">
                <StepIcon className="w-6 h-6 text-[#FFC72C]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#0B4F8A] bg-sky-100 px-2.5 py-0.5 rounded-full">
                    Passo {activeStep} de {steps.length}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${currentStepData.badgeColor}`}>
                    {currentStepData.badge}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-black text-slate-900">
                  {currentStepData.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                  {currentStepData.description}
                </p>
              </div>
            </div>

            {currentStepData.actionButton && (
              <button
                onClick={currentStepData.actionButton.onClick}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#0B4F8A] hover:bg-[#083a66] text-white text-xs font-heading font-black uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all shrink-0 active:scale-95"
              >
                <span>{currentStepData.actionButton.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FFC72C]" />
              </button>
            )}
          </div>

          {/* Detailed Instructions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentStepData.instructions.map((inst, idx) => (
              <div
                key={idx}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-[#0B4F8A]/40 transition-all flex items-start gap-3.5 group"
              >
                <div className="w-7 h-7 rounded-xl bg-slate-100 text-[#0B4F8A] font-heading font-black text-xs flex items-center justify-center shrink-0 group-hover:bg-[#0B4F8A] group-hover:text-white transition-all shadow-2xs">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {inst.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {inst.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick FAQ / Helper Highlight */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-center gap-3 text-xs text-amber-900">
            <Zap className="w-5 h-5 text-[#E8552B] shrink-0" />
            <p className="leading-relaxed">
              <strong>Dica Salvador:</strong> Você pode navegar pelo mapa usando os controles de zoom (+/-), trocar de bairro a qualquer momento e usar as respostas rápidas do chat para receber atendimento ágil!
            </p>
          </div>
        </div>

        {/* Modal Footer / Pagination */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
            disabled={activeStep === 1}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeStep === 1
                ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-200'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 active:scale-95'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Passo Anterior</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {steps.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveStep(s.id)}
                className={`h-2 rounded-full transition-all ${
                  activeStep === s.id
                    ? 'w-6 bg-[#0B4F8A]'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`Ir para Passo ${s.id}`}
              />
            ))}
          </div>

          {activeStep < steps.length ? (
            <button
              onClick={() => setActiveStep((prev) => Math.min(steps.length, prev + 1))}
              className="px-4 py-2.5 bg-[#0B4F8A] hover:bg-[#083a66] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <span>Próximo Passo</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FFC72C]" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#2E9E5B] hover:bg-[#25824a] text-white rounded-xl text-xs font-heading font-black uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Entendido! Explorar Agora</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
