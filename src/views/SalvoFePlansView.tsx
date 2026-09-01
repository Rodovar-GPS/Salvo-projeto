import React, { useState } from 'react';
import {
  FE_PLANS,
  FE_MANAGEMENT_FEE_MONTHLY,
  getStoredFeCampaigns,
  saveStoredFeCampaigns,
  getStoredFePayments,
  saveStoredFePayments,
} from '../data/salvoFeDatabase';
import {
  FePlanDefinition,
  FePlanTier,
  FeCampaign,
  FePaymentRecord,
  FeAdCreative,
  User,
} from '../types';
import { SalvoFeAuctionSimulatorModal } from '../components/SalvoFeAuctionSimulatorModal';
import {
  Check,
  Zap,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  CreditCard,
  QrCode,
  FileText,
  Clock,
  ArrowRight,
  MapPin,
  MessageCircle,
  Eye,
  Sliders,
  DollarSign,
  Award,
  ChevronRight,
  CheckCircle2,
  X,
  Send,
  Building2,
  Users,
} from 'lucide-react';

interface SalvoFePlansViewProps {
  currentUser?: User;
  onNavigateToAdmin?: () => void;
  onAdCreatedSuccess?: () => void;
}

const SALVADOR_POPULAR_NEIGHBORHOODS = [
  'Barra',
  'Graça',
  'Vitória',
  'Ondina',
  'Rio Vermelho',
  'Pituba',
  'Itaigara',
  'Caminho das Árvores',
  'Costa Azul',
  'Imbuí',
  'Brotas',
  'Cabula',
  'Itapuã',
  'Stella Maris',
  'Lauro de Freitas / RMS',
  'Centro / Pelourinho',
  'Todos os Bairros',
];

export const SalvoFePlansView: React.FC<SalvoFePlansViewProps> = ({
  currentUser,
  onNavigateToAdmin,
  onAdCreatedSuccess,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<FePlanTier>('plus');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isCreatingAd, setIsCreatingAd] = useState(false);

  // Form states for Checkout
  const [merchantName, setMerchantName] = useState(currentUser?.name || '');
  const [storeName, setStoreName] = useState(currentUser?.username || 'Minha Empresa');
  const [whatsapp, setWhatsapp] = useState(currentUser?.phone || '(71) 9');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'boleto'>('pix');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState<FePaymentRecord | null>(null);

  // Form states for New Ad Creative
  const [adTitle, setAdTitle] = useState('Super Oferta Especial de Inauguração');
  const [adDescription, setAdDescription] = useState('Produtos com garantia, atendimento humanizado e entrega rápida em Salvador.');
  const [adImageUrl, setAdImageUrl] = useState('https://images.unsplash.com/photo-1556742049-0a67e55722c0?w=700&auto=format&fit=crop&q=80');
  const [adCtaText, setAdCtaText] = useState('Pedir no WhatsApp');
  const [adDestinationUrl, setAdDestinationUrl] = useState('https://wa.me/5571999990000');
  const [adTargetNeighborhoods, setAdTargetNeighborhoods] = useState<string[]>(['Pituba', 'Itaigara']);
  const [adBidCpc, setAdBidCpc] = useState(0.45);
  const [adCreationFeedback, setAdCreationFeedback] = useState(false);

  const currentSelectedPlan = FE_PLANS[selectedPlanId];

  // Helper para lidar com contratação
  const handleOpenCheckout = (planId: FePlanTier) => {
    setSelectedPlanId(planId);
    setAdBidCpc(FE_PLANS[planId].cpc);
    setIsCheckoutOpen(true);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();

    const plan = FE_PLANS[selectedPlanId];
    const newPaymentId = `pay-fe-${Date.now()}`;
    const newCampaignId = `camp-fe-${Date.now()}`;

    const newPayment: FePaymentRecord = {
      id: newPaymentId,
      merchantId: currentUser?.id || `merch-${Date.now()}`,
      merchantName: merchantName || 'Lojista SALVÔ ADS',
      storeName: storeName || 'Minha Loja',
      planId: plan.id,
      planName: plan.name,
      amount: plan.price,
      managementFee: plan.managementFee,
      mediaAmount: plan.netMediaBudget,
      paymentMethod,
      status: paymentMethod === 'credit_card' ? 'paid' : 'pending',
      gatewayTransactionId: `STRIPE_GATEWAY_${Date.now()}`,
      paidAt: paymentMethod === 'credit_card' ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      pixQrCode:
        paymentMethod === 'pix'
          ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020126580014br.gov.bcb.pix0136salvo.fe.pagamentos@salvo.ba5204000053039865405${plan.price.toFixed(
              2
            )}5802BR5916SALVO%20FE%20MIDIA6008SALVADOR62070503***6304ABCD`
          : undefined,
      pixCopiaECola:
        paymentMethod === 'pix'
          ? `00020126580014br.gov.bcb.pix0136salvo.fe.pagamentos@salvo.ba5204000053039865405${plan.price.toFixed(
              2
            )}5802BR5916SALVO%20FE%20MIDIA6008SALVADOR62070503***6304ABCD`
          : undefined,
    };

    // Cria a campanha
    const newCampaign: FeCampaign = {
      id: newCampaignId,
      merchantId: newPayment.merchantId,
      merchantName: newPayment.merchantName,
      merchantEmail: `${newPayment.merchantId}@salvo.ba`,
      merchantPhone: whatsapp,
      storeName: newPayment.storeName,
      planId: plan.id,
      planName: plan.name,
      monthlyPrice: plan.price,
      managementFee: plan.managementFee,
      totalBudget: plan.netMediaBudget,
      remainingBudget: plan.netMediaBudget,
      status: newPayment.status === 'paid' ? 'active' : 'pending_payment',
      paymentStatus: newPayment.status,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      ads: [],
    };

    // Salva nos storages
    const payments = getStoredFePayments();
    saveStoredFePayments([newPayment, ...payments]);

    const campaigns = getStoredFeCampaigns();
    saveStoredFeCampaigns([newCampaign, ...campaigns]);

    setCheckoutSuccess(newPayment);
  };

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    const campaigns = getStoredFeCampaigns();
    if (campaigns.length === 0) return;

    const targetCamp = campaigns[0];

    const newAd: FeAdCreative = {
      id: `ad-fe-${Date.now()}`,
      campaignId: targetCamp.id,
      merchantId: targetCamp.merchantId,
      storeName: storeName || targetCamp.storeName,
      title: adTitle,
      description: adDescription,
      imageUrl: adImageUrl,
      ctaText: adCtaText,
      destinationUrl: adDestinationUrl,
      targetNeighborhoods: adTargetNeighborhoods.length > 0 ? adTargetNeighborhoods : ['Todos os Bairros'],
      targetCategories: ['Geral'],
      bidCpc: adBidCpc,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      impressions: 0,
      clicks: 0,
      spentAmount: 0.0,
      ctr: 0.0,
    };

    targetCamp.ads = [newAd, ...targetCamp.ads];
    saveStoredFeCampaigns(campaigns);

    setAdCreationFeedback(true);
    setTimeout(() => {
      setAdCreationFeedback(false);
      setIsCreatingAd(false);
      if (onAdCreatedSuccess) onAdCreatedSuccess();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* =========================================================================
          HERO BANNER SALVÔ ADS — A CIDADE DAS MARÉS
          "Não deixe seu negócio na maré baixa. Suba com a gente."
          ========================================================================= */}
      <section className="relative bg-gradient-to-br from-[#0F4C81] via-[#1A5B96] to-[#1A1A2E] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Padrão de Ondas Abstratas */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#2A9D8F" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,218.7C672,203,768,149,864,138.7C960,128,1056,160,1152,176C1248,192,1344,192,1392,192L1440,192L1440,320L0,320Z"></path>
          </svg>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#E89F3C] text-xs font-heading font-extrabold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#E89F3C]" />
                SALVÔ ADS • A Cidade das Marés
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight leading-tight text-white">
                Não deixe seu negócio na maré baixa. <span className="text-[#E89F3C]">Suba com a gente.</span>
              </h1>

              <p className="text-base sm:text-lg text-blue-100 font-medium leading-relaxed">
                Conecte seu comércio ou serviço ao fluxo real de soteropolitanos e turistas em Salvador. 
                Tecnologia de leilão hyperlocal <strong>Salvô Engine</strong>, gestão profissional inclusa e transparência absoluta.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#planos"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#E89F3C] to-[#E76F51] hover:opacity-90 text-white font-heading font-black text-sm shadow-xl active:scale-95 transition-all flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Ver Planos de Anúncios
                </a>

                <button
                  onClick={() => setIsSimulatorOpen(true)}
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-heading font-bold text-sm border border-white/30 backdrop-blur-md active:scale-95 transition-all flex items-center gap-2"
                >
                  <Sliders className="w-4 h-4 text-[#E89F3C]" />
                  Simular Alcance por Maré
                </button>

                {onNavigateToAdmin && (
                  <button
                    onClick={onNavigateToAdmin}
                    className="px-5 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 text-blue-200 hover:text-white font-heading font-semibold text-xs border border-blue-400/30 transition-all flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#2A9D8F]" />
                    Acesso Painel Admin
                  </button>
                )}
              </div>
            </div>

            {/* Destaques de Confiança */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl max-w-sm w-full space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E89F3C] flex items-center justify-center text-slate-950 font-black">
                  <ShieldCheck className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-sm">Gestão Profissional Fixa</h3>
                  <p className="text-xs text-blue-100">Taxa de R$ 150/mês inclusa em todos os planos</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2A9D8F] flex items-center justify-center text-white font-black">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-sm">Retorno por Clique & Mil</h3>
                  <p className="text-xs text-blue-100">CPC a partir de R$ 0,40 e CPM a partir de R$ 8,00</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E76F51] flex items-center justify-center text-white font-black">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-sm">Hiperlocalização Salvador</h3>
                  <p className="text-xs text-blue-100">Segmentação por bairros: Barra, Pituba, Rio Vermelho e mais</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SEÇÃO DE PLANOS OFICIAIS (Fé Local R$ 197, Fé Plus R$ 347, Fé Premium R$ 597)
          ========================================================================= */}
      <section id="planos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {Object.values(FE_PLANS).map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const isPopular = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl bg-white transition-all duration-300 flex flex-col justify-between border ${
                  isPopular
                    ? 'border-[#D97706] shadow-2xl ring-2 ring-[#D97706]/40 scale-100 md:-translate-y-2'
                    : 'border-slate-200 shadow-lg hover:shadow-xl'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D97706] text-white text-[11px] font-heading font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Topo do Card */}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Plano Comercial
                    </span>
                    <h3 className="text-2xl font-heading font-black text-slate-900 mt-1">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed min-h-[36px]">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Preço e Quebra Transparente */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold text-slate-500">R$</span>
                      <span className="text-3xl sm:text-4xl font-heading font-black text-slate-900">
                        {plan.price.toFixed(0)}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">/mês</span>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1 pt-2 border-t border-slate-200/80">
                      <div className="flex justify-between">
                        <span>Taxa de Gestão Fixa:</span>
                        <strong className="text-slate-900">R$ {plan.managementFee.toFixed(2)}</strong>
                      </div>
                      <div className="flex justify-between text-[#0B3D91] font-bold">
                        <span>Saldo Líquido em Mídia:</span>
                        <span>R$ {plan.netMediaBudget.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Estimativas de Performance */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                        CPC Médio
                      </span>
                      <strong className="text-base font-black text-[#0B3D91]">
                        R$ {plan.cpc.toFixed(2)}
                      </strong>
                      <span className="text-[10px] text-slate-500 block">
                        ~{plan.estimatedClicks} cliques
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                        CPM Médio
                      </span>
                      <strong className="text-base font-black text-[#D97706]">
                        R$ {plan.cpm.toFixed(2)}
                      </strong>
                      <span className="text-[10px] text-slate-500 block">
                        ~{plan.estimatedImpressions.toLocaleString('pt-BR')} views
                      </span>
                    </div>
                  </div>

                  {/* Lista de Benefícios */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                      O que está incluso:
                    </span>
                    <ul className="space-y-2.5 text-xs text-slate-600">
                      {plan.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Botão de Ação */}
                <div className="p-6 sm:p-8 pt-0">
                  <button
                    onClick={() => handleOpenCheckout(plan.id)}
                    className={`w-full py-4 rounded-2xl font-heading font-black text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 ${
                      isPopular
                        ? 'bg-[#D97706] hover:bg-[#b45309] text-white shadow-amber-500/20'
                        : 'bg-[#0B3D91] hover:bg-[#082a66] text-white shadow-blue-500/20'
                    }`}
                  >
                    <span>Contratar {plan.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SIMULADOR INTERATIVO DE RETORNO E ALCANCE
          ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 font-black text-xs">
                  Transparência SALVÔ ADS
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-900 mt-1">
                Calculadora Oficial de Mídia & Retorno
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Veja exatamente como cada centavo do seu investimento é convertido em clientes.
              </p>
            </div>

            {/* Seletor de Plano na Calculadora */}
            <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl gap-1">
              {(['local', 'plus', 'premium'] as FePlanTier[]).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedPlanId(tier)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
                    selectedPlanId === tier
                      ? 'bg-[#0B3D91] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {FE_PLANS[tier].name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-center">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wide block">
                Valor Total do Plano
              </span>
              <div className="text-3xl font-heading font-black text-slate-900 mt-1">
                R$ {currentSelectedPlan.price.toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Faturamento mensal recorrente</p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200">
              <span className="text-xs text-amber-800 font-bold uppercase tracking-wide block">
                Taxa de Gestão Fixa
              </span>
              <div className="text-3xl font-heading font-black text-[#D97706] mt-1">
                R$ {currentSelectedPlan.managementFee.toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-600 mt-1">Otimização, suporte e painel</p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200">
              <span className="text-xs text-blue-800 font-bold uppercase tracking-wide block">
                Saldo Injetado no Leilão
              </span>
              <div className="text-3xl font-heading font-black text-[#0B3D91] mt-1">
                R$ {currentSelectedPlan.netMediaBudget.toFixed(2)}
              </div>
              <p className="text-[11px] text-blue-700 font-medium mt-1">
                Gera até <strong>{currentSelectedPlan.estimatedClicks} cliques</strong> diretos
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-xs sm:text-sm text-emerald-900 font-medium">
                Seu anúncio participa do <strong>Fé Engine</strong> com CPC fixado em{' '}
                <strong>R$ {currentSelectedPlan.cpc.toFixed(2)}</strong> e CPM de{' '}
                <strong>R$ {currentSelectedPlan.cpm.toFixed(2)}</strong>.
              </span>
            </div>
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all shrink-0"
            >
              Começar Agora
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          TABELA COMPARATIVA DETALHADA DE BENEFÍCIOS
          ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-heading font-black text-slate-900">
            Comparativo Completo dos Planos SALVÔ ADS
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Escolha o nível de alcance ideal para o momento do seu negócio.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900 text-white font-heading font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4 sm:p-5">Recurso & Benefício</th>
                  <th className="p-4 sm:p-5 text-center">Fé Local (R$ 197)</th>
                  <th className="p-4 sm:p-5 text-center bg-[#D97706]/90">Fé Plus (R$ 347)</th>
                  <th className="p-4 sm:p-5 text-center">Fé Premium (R$ 597)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-4 font-semibold">Custo por Clique (CPC)</td>
                  <td className="p-4 text-center font-mono">R$ 0,50</td>
                  <td className="p-4 text-center font-mono font-bold text-[#D97706] bg-amber-50/40">R$ 0,45</td>
                  <td className="p-4 text-center font-mono font-bold text-emerald-700">R$ 0,40</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Custo por Mil Impressões (CPM)</td>
                  <td className="p-4 text-center font-mono">R$ 10,00</td>
                  <td className="p-4 text-center font-mono font-bold text-[#D97706] bg-amber-50/40">R$ 9,00</td>
                  <td className="p-4 text-center font-mono font-bold text-emerald-700">R$ 8,00</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Taxa de Gestão Mensal</td>
                  <td className="p-4 text-center">R$ 150,00</td>
                  <td className="p-4 text-center bg-amber-50/40 font-semibold">R$ 150,00</td>
                  <td className="p-4 text-center">R$ 150,00</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Saldo Líquido de Mídia</td>
                  <td className="p-4 text-center font-bold">R$ 47,00</td>
                  <td className="p-4 text-center font-bold text-[#0B3D91] bg-amber-50/40">R$ 197,00</td>
                  <td className="p-4 text-center font-bold text-[#0B3D91]">R$ 447,00</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Segmentação Geográfica</td>
                  <td className="p-4 text-center">1 a 3 Bairros</td>
                  <td className="p-4 text-center bg-amber-50/40 font-semibold">Até 8 Bairros</td>
                  <td className="p-4 text-center font-bold text-emerald-800">Salvador Inteira</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Prioridade no Algoritmo Fé Engine</td>
                  <td className="p-4 text-center text-slate-400">Padrão</td>
                  <td className="p-4 text-center bg-amber-50/40 font-semibold text-amber-800">Alta (+5% Score)</td>
                  <td className="p-4 text-center font-black text-emerald-700">Máxima (+15% Score)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Destaque em Busca & Mapa</td>
                  <td className="p-4 text-center text-slate-400">—</td>
                  <td className="p-4 text-center bg-amber-50/40 text-emerald-600 font-bold">✓ Incluso</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">✓ Topo Absoluto</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Consultoria de Tráfego com Especialista</td>
                  <td className="p-4 text-center text-slate-400">—</td>
                  <td className="p-4 text-center bg-amber-50/40 text-slate-400">—</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">✓ Mensal Individual</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CRIADOR DE ANÚNCIO / BANNER PATROCINADO (INTEGRADO)
          ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FFC72C]">
                Estúdio de Criativos
              </span>
              <h3 className="text-xl sm:text-2xl font-heading font-black text-white mt-0.5">
                Crie seu Anúncio Patrocinado SALVÔ ADS
              </h3>
              <p className="text-xs text-blue-200 mt-1">
                Configure o criativo que será distribuído pelo algoritmo Fé Engine após a aprovação.
              </p>
            </div>

            <button
              onClick={() => setIsCreatingAd(!isCreatingAd)}
              className="px-5 py-2.5 rounded-xl bg-[#FFC72C] hover:bg-[#ffcf4d] text-[#0B3D91] font-heading font-black text-xs transition-all shrink-0"
            >
              {isCreatingAd ? 'Ocultar Formulário' : '+ Configurar Criativo'}
            </button>
          </div>

          {isCreatingAd && (
            <form onSubmit={handleCreateAd} className="space-y-6 pt-4 border-t border-blue-800/80">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-blue-200 mb-1">
                    Título do Anúncio (Curto e direto)
                  </label>
                  <input
                    type="text"
                    required
                    value={adTitle}
                    onChange={(e) => setAdTitle(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-[#FFC72C]"
                    placeholder="Ex: 20% OFF no Primeiro Pedido"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-blue-200 mb-1">
                    Texto do Botão (CTA)
                  </label>
                  <input
                    type="text"
                    required
                    value={adCtaText}
                    onChange={(e) => setAdCtaText(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-[#FFC72C]"
                    placeholder="Ex: Pedir no WhatsApp"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-blue-200 mb-1">
                    Descrição Informativa do Anúncio
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={adDescription}
                    onChange={(e) => setAdDescription(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-[#FFC72C]"
                    placeholder="Descreva a oferta ou o diferencial da sua empresa..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-blue-200 mb-1">
                    URL da Imagem / Banner
                  </label>
                  <input
                    type="url"
                    required
                    value={adImageUrl}
                    onChange={(e) => setAdImageUrl(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-[#FFC72C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-blue-200 mb-1">
                    Link de Destino (WhatsApp ou Catálogo)
                  </label>
                  <input
                    type="url"
                    required
                    value={adDestinationUrl}
                    onChange={(e) => setAdDestinationUrl(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-[#FFC72C]"
                    placeholder="https://wa.me/5571..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-blue-200 mb-1">
                    Lance CPC Máximo (R$)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.40"
                    max="3.00"
                    value={adBidCpc}
                    onChange={(e) => setAdBidCpc(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-[#FFC72C]"
                  />
                  <span className="text-[11px] text-blue-300 mt-1 block">
                    Lance padrão sugerido: R$ {currentSelectedPlan.cpc.toFixed(2)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-blue-200 mb-1">
                    Bairros Alvo em Salvador
                  </label>
                  <select
                    multiple
                    value={adTargetNeighborhoods}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                      setAdTargetNeighborhoods(selected);
                    }}
                    className="w-full text-xs bg-slate-800 border border-white/20 rounded-xl p-2 text-white h-20 focus:outline-none"
                  >
                    {SALVADOR_POPULAR_NEIGHBORHOODS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prévia ao vivo */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10 space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#FFC72C] tracking-wider block">
                  Prévia do Anúncio no Feed:
                </span>
                <div className="bg-gradient-to-r from-[#0B3D91] to-[#1E3A8A] p-4 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={adImageUrl}
                      alt="Banner"
                      className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="bg-[#FFC72C] text-[#0B3D91] text-[9px] font-black uppercase px-1.5 py-0.5 rounded">
                        Patrocinado SALVÔ ADS
                      </span>
                      <h4 className="text-sm font-bold text-white line-clamp-1 mt-0.5">{adTitle}</h4>
                      <p className="text-[11px] text-blue-100 line-clamp-1">{adDescription}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-[#FFC72C] text-[#0B3D91] font-bold text-xs shrink-0">
                    {adCtaText}
                  </span>
                </div>
              </div>

              {adCreationFeedback && (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold text-center border border-emerald-500/30">
                  ✓ Anúncio enviado para a moderação do SALVÔ ADS com sucesso!
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#FFC72C] hover:bg-[#ffcf4d] text-[#0B3D91] font-heading font-black text-xs sm:text-sm shadow-md transition-all"
                >
                  Salvar e Enviar para Moderação
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* =========================================================================
          MODAL DE CHECKOUT INTEGRADO (PIX, CARTÃO, BOLETO)
          ========================================================================= */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            {/* Header Checkout */}
            <div className="p-6 bg-gradient-to-r from-[#0B3D91] to-[#1E3A8A] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FFC72C]">
                  Checkout Seguro SALVÔ ADS
                </span>
                <h3 className="text-xl font-heading font-black text-white">
                  Contratação {currentSelectedPlan.name}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setCheckoutSuccess(null);
                }}
                className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corpo do Checkout */}
            {!checkoutSuccess ? (
              <form onSubmit={handleProcessPayment} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                {/* Resumo do Pedido */}
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">Total a Pagar:</span>
                    <strong className="text-2xl font-heading font-black text-[#0B3D91]">
                      R$ {currentSelectedPlan.price.toFixed(2)}
                    </strong>
                    <span className="text-[10px] text-slate-500 block">
                      Inclui Taxa de Gestão (R$ 150) + Saldo de Mídia (R${' '}
                      {currentSelectedPlan.netMediaBudget.toFixed(2)})
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                    {currentSelectedPlan.badge}
                  </span>
                </div>

                {/* Dados do Lojista */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nome do Responsável
                    </label>
                    <input
                      type="text"
                      required
                      value={merchantName}
                      onChange={(e) => setMerchantName(e.target.value)}
                      placeholder="Ex: João da Silva"
                      className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#0B3D91] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nome da Loja / Empresa
                    </label>
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="Ex: Ótica Salvador Barra"
                      className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#0B3D91] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      WhatsApp Comercial (DDD + Número)
                    </label>
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="(71) 99999-0000"
                      className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#0B3D91] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Seleção do Método de Pagamento */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Forma de Pagamento
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        paymentMethod === 'pix'
                          ? 'border-[#0B3D91] bg-blue-50/80 text-[#0B3D91] font-bold shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <QrCode className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                      <span className="text-xs block">PIX Instantâneo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        paymentMethod === 'credit_card'
                          ? 'border-[#0B3D91] bg-blue-50/80 text-[#0B3D91] font-bold shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#0B3D91]" />
                      <span className="text-xs block">Cartão de Crédito</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('boleto')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        paymentMethod === 'boleto'
                          ? 'border-[#0B3D91] bg-blue-50/80 text-[#0B3D91] font-bold shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <FileText className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                      <span className="text-xs block">Boleto Bancário</span>
                    </button>
                  </div>
                </div>

                {/* Campos Específicos para Cartão */}
                {paymentMethod === 'credit_card' && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Número do Cartão
                      </label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Validade (MM/AA)
                        </label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          required
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="123"
                          className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#0B3D91] hover:bg-[#082a66] text-white font-heading font-black text-sm shadow-md active:scale-95 transition-all mt-4"
                >
                  Finalizar Contratação de R$ {currentSelectedPlan.price.toFixed(2)}
                </button>
              </form>
            ) : (
              /* Recibo de Sucesso */
              <div className="p-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="text-xl font-heading font-black text-slate-900">
                    Contratação Registrada com Sucesso!
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Plano <strong>{checkoutSuccess.planName}</strong> para a empresa{' '}
                    <strong>{checkoutSuccess.storeName}</strong>.
                  </p>
                </div>

                {checkoutSuccess.paymentMethod === 'pix' && checkoutSuccess.pixQrCode && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <img
                      src={checkoutSuccess.pixQrCode}
                      alt="QR Code PIX"
                      className="w-40 h-40 mx-auto rounded-xl border border-slate-300 shadow-xs"
                    />
                    <p className="text-[11px] text-slate-500">
                      Escaneie o QR Code no seu aplicativo bancário ou utilize o código Copia e Cola:
                    </p>
                    <button
                      onClick={() => {
                        if (checkoutSuccess.pixCopiaECola) {
                          navigator.clipboard.writeText(checkoutSuccess.pixCopiaECola);
                          alert('Código PIX Copia e Cola copiado com sucesso!');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
                    >
                      Copiar Código PIX
                    </button>
                  </div>
                )}

                <div className="flex gap-2 justify-center pt-2">
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setIsCreatingAd(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#0B3D91] text-white font-bold text-xs hover:bg-[#082a66]"
                  >
                    Criar Anúncio Agora
                  </button>
                  {onNavigateToAdmin && (
                    <button
                      onClick={() => {
                        setIsCheckoutOpen(false);
                        onNavigateToAdmin();
                      }}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                    >
                      Ver no Painel Admin
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Simulador do Leilão Fé Engine */}
      <SalvoFeAuctionSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />
    </div>
  );
};
