import React, { useState, useMemo } from 'react';
import {
  getStoredFeCampaigns,
  saveStoredFeCampaigns,
  getStoredFePayments,
  saveStoredFePayments,
  MONTHLY_REVENUE_HISTORY,
  FE_MANAGEMENT_FEE_MONTHLY,
} from '../data/salvoFeDatabase';
import {
  FeCampaign,
  FePaymentRecord,
  FeAdCreative,
  FeAdStatus,
  FePaymentStatus,
} from '../types';
import { SalvoFeAuctionSimulatorModal } from '../components/SalvoFeAuctionSimulatorModal';
import {
  ShieldCheck,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Eye,
  MousePointerClick,
  Sparkles,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
  Award,
} from 'lucide-react';

interface SalvoFeAdminDashboardViewProps {
  onBackToPlans?: () => void;
}

export const SalvoFeAdminDashboardView: React.FC<SalvoFeAdminDashboardViewProps> = ({
  onBackToPlans,
}) => {
  const [campaigns, setCampaigns] = useState<FeCampaign[]>(() => getStoredFeCampaigns());
  const [payments, setPayments] = useState<FePaymentRecord[]>(() => getStoredFePayments());
  const [activeTab, setActiveTab] = useState<'moderation' | 'merchants' | 'revenue' | 'telemetry'>('moderation');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [rejectionModalAd, setRejectionModalAd] = useState<FeAdCreative | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Texto ou imagem necessita de adequação.');

  // Métricas Consolidadas
  const paidPayments = useMemo(() => payments.filter((p) => p.status === 'paid'), [payments]);
  const totalRevenue = useMemo(() => paidPayments.reduce((acc, p) => acc + p.amount, 0), [paidPayments]);
  const totalManagementFees = useMemo(() => paidPayments.reduce((acc, p) => acc + p.managementFee, 0), [paidPayments]);
  const totalMediaBudget = useMemo(() => paidPayments.reduce((acc, p) => acc + p.mediaAmount, 0), [paidPayments]);

  const allAds = useMemo(() => {
    const list: { ad: FeAdCreative; campaign: FeCampaign }[] = [];
    campaigns.forEach((camp) => {
      camp.ads.forEach((ad) => {
        list.push({ ad, campaign: camp });
      });
    });
    return list;
  }, [campaigns]);

  const pendingAds = useMemo(() => allAds.filter((item) => item.ad.status === 'pending'), [allAds]);
  const totalImpressions = useMemo(() => allAds.reduce((acc, item) => acc + item.ad.impressions, 0), [allAds]);
  const totalClicks = useMemo(() => allAds.reduce((acc, item) => acc + item.ad.clicks, 0), [allAds]);
  const overallCtr = totalImpressions > 0 ? Number(((totalClicks / totalImpressions) * 100).toFixed(2)) : 0;

  // Moderação de Anúncio
  const handleModerateAd = (adId: string, newStatus: FeAdStatus, notes?: string) => {
    const updated = campaigns.map((camp) => {
      const adIndex = camp.ads.findIndex((a) => a.id === adId);
      if (adIndex >= 0) {
        const ad = camp.ads[adIndex];
        const newAds = [...camp.ads];
        newAds[adIndex] = {
          ...ad,
          status: newStatus,
          moderationNotes: notes || (newStatus === 'approved' ? 'Anúncio aprovado pela equipe de moderação.' : 'Necessita ajustes.'),
          reviewedBy: 'Admin SALVÓ Fé',
          reviewedAt: new Date().toISOString(),
        };
        return { ...camp, ads: newAds };
      }
      return camp;
    });

    setCampaigns(updated);
    saveStoredFeCampaigns(updated);
    setRejectionModalAd(null);
  };

  // Atualização de Status de Pagamento (Simulação Webhook Stripe / PagSeguro / PIX)
  const handleUpdatePaymentStatus = (paymentId: string, status: FePaymentStatus) => {
    const updatedPayments = payments.map((p) => {
      if (p.id === paymentId) {
        return {
          ...p,
          status,
          paidAt: status === 'paid' ? new Date().toISOString() : undefined,
        };
      }
      return p;
    });

    setPayments(updatedPayments);
    saveStoredFePayments(updatedPayments);

    // Atualiza campanha
    const targetPayment = payments.find((p) => p.id === paymentId);
    if (targetPayment) {
      const updatedCampaigns = campaigns.map((camp) => {
        if (camp.merchantId === targetPayment.merchantId || camp.storeName === targetPayment.storeName) {
          return {
            ...camp,
            paymentStatus: status,
            status: status === 'paid' ? ('active' as const) : ('pending_payment' as const),
          };
        }
        return camp;
      });
      setCampaigns(updatedCampaigns);
      saveStoredFeCampaigns(updatedCampaigns);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header Admin */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#D97706] text-white flex items-center justify-center font-black shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-heading font-black text-white">
                  Painel de Controle • SALVÔ ADS
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Operação Ativa
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Gestão de Recebimentos, Moderação de Tráfego e Algoritmo Fé Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSimulatorOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 text-[#FFC72C]" />
              Testar Fé Engine
            </button>

            {onBackToPlans && (
              <button
                onClick={onBackToPlans}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
              >
                Página de Planos
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* =========================================================================
            CARDS DE MÉTRICAS FINANCEIRAS E DE ENTREGA
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Faturamento Total</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
              R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {paidPayments.length} pagamentos aprovados no período
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Taxas de Gestão Retidas</span>
              <TrendingUp className="w-4 h-4 text-[#D97706]" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-black text-[#D97706]">
              R$ {totalManagementFees.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              R$ {FE_MANAGEMENT_FEE_MONTHLY.toFixed(2)} fixos por plano contratado
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Saldo de Mídia em Execução</span>
              <Zap className="w-4 h-4 text-[#0B3D91]" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-black text-[#0B3D91]">
              R$ {totalMediaBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Distribuído nas campanhas dos lojistas
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Anúncios para Aprovar</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-black text-slate-900 flex items-center gap-2">
              {pendingAds.length}
              {pendingAds.length > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Ação Necessária
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {allAds.length} criativos totais cadastrados
            </p>
          </div>
        </div>

        {/* =========================================================================
            ABAS DE NAVEGAÇÃO DO PAINEL ADMIN
            ========================================================================= */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'moderation'
                ? 'bg-[#0B3D91] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Moderação de Anúncios ({pendingAds.length})
          </button>

          <button
            onClick={() => setActiveTab('merchants')}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'merchants'
                ? 'bg-[#0B3D91] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Users className="w-4 h-4" />
            Lojistas & Pagamentos ({payments.length})
          </button>

          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'revenue'
                ? 'bg-[#0B3D91] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Faturamento Mensal
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'telemetry'
                ? 'bg-[#0B3D91] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Zap className="w-4 h-4" />
            Métricas de Entrega (CTR: {overallCtr}%)
          </button>
        </div>

        {/* =========================================================================
            CONTEÚDO DA ABA: MODERAÇÃO DE ANÚNCIOS
            ========================================================================= */}
        {activeTab === 'moderation' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading font-black text-slate-900 text-lg">
                    Fila de Aprovação de Anúncios SALVÔ ADS
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Avalie os criativos antes de serem liberados para o algoritmo Fé Engine.
                  </p>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filtrar por loja ou título..."
                    className="text-xs pl-9 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
                  />
                </div>
              </div>

              {allAds.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  Nenhum anúncio cadastrado no momento.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {allAds
                    .filter((item) => {
                      if (!searchTerm) return true;
                      const q = searchTerm.toLowerCase();
                      return (
                        item.ad.title.toLowerCase().includes(q) ||
                        item.ad.storeName.toLowerCase().includes(q)
                      );
                    })
                    .map(({ ad, campaign }) => (
                      <div key={ad.id} className="p-5 sm:p-6 hover:bg-slate-50/80 transition-colors">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                          {/* Banner & Text */}
                          <div className="flex items-start gap-4 min-w-0 flex-1">
                            <img
                              src={ad.imageUrl}
                              alt={ad.title}
                              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                            />
                            <div className="min-w-0 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-slate-900 text-sm">
                                  {ad.storeName}
                                </span>
                                <span
                                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                    ad.status === 'approved'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : ad.status === 'pending'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {ad.status === 'approved'
                                    ? 'Aprovado'
                                    : ad.status === 'pending'
                                    ? 'Pendente'
                                    : 'Rejeitado'}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  Plano: <strong>{campaign.planName}</strong>
                                </span>
                              </div>

                              <h4 className="font-bold text-slate-900 text-base">{ad.title}</h4>
                              <p className="text-xs text-slate-600 line-clamp-2">{ad.description}</p>

                              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
                                <span>
                                  Lance: <strong className="text-slate-800">R$ {ad.bidCpc.toFixed(2)}</strong>
                                </span>
                                <span>•</span>
                                <span>
                                  Bairros:{' '}
                                  <strong className="text-slate-800">
                                    {ad.targetNeighborhoods.join(', ')}
                                  </strong>
                                </span>
                                <span>•</span>
                                <span>
                                  Link:{' '}
                                  <a
                                    href={ad.destinationUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 underline"
                                  >
                                    Ver Destino
                                  </a>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 justify-end">
                            {ad.status !== 'approved' && (
                              <button
                                onClick={() => handleModerateAd(ad.id, 'approved')}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
                              >
                                <Check className="w-4 h-4" />
                                Aprovar Anúncio
                              </button>
                            )}

                            {ad.status !== 'rejected' && (
                              <button
                                onClick={() => setRejectionModalAd(ad)}
                                className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all flex items-center gap-1.5"
                              >
                                <X className="w-4 h-4" />
                                Rejeitar / Ajustar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            CONTEÚDO DA ABA: LOJISTAS & STATUS DE PAGAMENTO
            ========================================================================= */}
        {activeTab === 'merchants' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-slate-900 text-lg">
                  Gestão de Lojistas & Pagamentos
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Status de cobrança, confirmação de gateway e liberação de saldo de tráfego.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-4">Empresa / Lojista</th>
                    <th className="px-5 py-4">Plano</th>
                    <th className="px-5 py-4">Valor Total</th>
                    <th className="px-5 py-4">Taxa Gestão</th>
                    <th className="px-5 py-4">Saldo Mídia</th>
                    <th className="px-5 py-4">Método</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Ação de Gateway</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900">{p.storeName}</div>
                        <div className="text-[11px] text-slate-500">{p.merchantName}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-md bg-blue-50 text-[#0B3D91] font-bold text-[11px]">
                          {p.planName}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-slate-900">
                        R$ {p.amount.toFixed(2)}
                      </td>
                      <td className="px-5 py-4 font-mono text-[#D97706]">
                        R$ {p.managementFee.toFixed(2)}
                      </td>
                      <td className="px-5 py-4 font-mono text-emerald-700 font-bold">
                        R$ {p.mediaAmount.toFixed(2)}
                      </td>
                      <td className="px-5 py-4 uppercase font-semibold text-[10px]">
                        {p.paymentMethod}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            p.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {p.status === 'paid' ? 'Pago' : p.status === 'pending' ? 'Pendente' : 'Em Análise'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {p.status !== 'paid' ? (
                          <button
                            onClick={() => handleUpdatePaymentStatus(p.id, 'paid')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs"
                          >
                            Simular Pagamento (Webhook)
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmado
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            CONTEÚDO DA ABA: FATURAMENTO MENSAL E HISTÓRICO
            ========================================================================= */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="font-heading font-black text-slate-900 text-lg mb-1">
                Evolução do Faturamento SALVÔ ADS (2026)
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Crescimento da receita bruta e taxa de retenção operacional mês a mês.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {MONTHLY_REVENUE_HISTORY.map((m) => (
                  <div key={m.month} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-xs font-bold text-slate-500 uppercase">{m.month}</span>
                    <div className="text-base font-heading font-black text-slate-900 mt-1">
                      R$ {m.totalRevenue.toLocaleString('pt-BR')}
                    </div>
                    <span className="text-[10px] text-[#D97706] font-semibold block mt-1">
                      Taxa: R$ {m.managementFees.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {m.activeMerchants} lojistas
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            CONTEÚDO DA ABA: MÉTRICAS DE TELEMETRIA
            ========================================================================= */}
        {activeTab === 'telemetry' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="font-heading font-black text-slate-900 text-lg">
                Desempenho Geral de Mídia & Entrega
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Total de impressões, cliques e conversões registradas pelo motor de leilão Fé Engine.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200">
                <span className="text-xs font-bold uppercase text-blue-800">Total de Impressões</span>
                <div className="text-3xl font-black text-[#0B3D91] mt-1">
                  {totalImpressions.toLocaleString('pt-BR')}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200">
                <span className="text-xs font-bold uppercase text-amber-800">Total de Cliques</span>
                <div className="text-3xl font-black text-[#D97706] mt-1">
                  {totalClicks.toLocaleString('pt-BR')}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-xs font-bold uppercase text-emerald-800">CTR Médio</span>
                <div className="text-3xl font-black text-emerald-700 mt-1">
                  {overallCtr}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Rejeição de Anúncio */}
      {rejectionModalAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <h4 className="font-heading font-black text-slate-900 text-lg">
              Rejeitar Anúncio / Solicitar Ajuste
            </h4>
            <p className="text-xs text-slate-600">
              Informe ao lojista de <strong>{rejectionModalAd.storeName}</strong> o motivo do ajuste necessário:
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectionModalAd(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleModerateAd(rejectionModalAd.id, 'rejected', rejectionReason)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                Confirmar Rejeição
              </button>
            </div>
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
