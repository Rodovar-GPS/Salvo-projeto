import React, { useState, useMemo } from 'react';
import {
  runFeEngineAuction,
  getStoredFeCampaigns,
} from '../data/salvoFeDatabase';
import {
  Sparkles,
  MapPin,
  Tag,
  Zap,
  CheckCircle2,
  TrendingUp,
  Award,
  X,
  ExternalLink,
  ShieldCheck,
  Percent,
} from 'lucide-react';

interface SalvoFeAuctionSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SALVADOR_SAMPLE_NEIGHBORHOODS = [
  'Barra',
  'Graça',
  'Pituba',
  'Itaigara',
  'Rio Vermelho',
  'Ondina',
  'Costa Azul',
  'Brotas',
  'Imbuí',
  'Itapuã',
  'Vitória',
  'Cabula',
];

const SAMPLE_CATEGORIES = [
  'Geral',
  'Saúde, Farmácias & Bem-Estar',
  'Restaurantes & Gastronomia',
  'Moda, Roupas & Acessórios',
  'Esportes, Academias & Aventura',
  'Beleza, Barbearias & Estética',
];

export const SalvoFeAuctionSimulatorModal: React.FC<SalvoFeAuctionSimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Barra');
  const [selectedCategory, setSelectedCategory] = useState('Geral');

  const campaigns = useMemo(() => getStoredFeCampaigns(), [isOpen]);

  const auctionResult = useMemo(() => {
    return runFeEngineAuction(
      {
        userNeighborhood: selectedNeighborhood,
        userCategoryInterest: selectedCategory,
      },
      campaigns
    );
  }, [selectedNeighborhood, selectedCategory, campaigns]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#0B3D91] via-[#0E4DA4] to-[#1E3A8A] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Zap className="w-5 h-5 text-[#FFC72C]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-heading font-black text-white">
                  Simulador do Algoritmo Fé Engine
                </h3>
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-[#D97706] text-white">
                  Leilão 60/40
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                Cálculo em tempo real: <strong className="text-white">Pontuação = (Lance × 0.6) + (Relevância × 0.4)</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#0B3D91]" />
                Bairro Atual do Usuário em Salvador:
              </label>
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="w-full text-sm font-semibold border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0B3D91] focus:outline-none"
              >
                {SALVADOR_SAMPLE_NEIGHBORHOODS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-[#D97706]" />
                Interesse / Categoria Navegada:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-sm font-semibold border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0B3D91] focus:outline-none"
              >
                {SAMPLE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Winner Card */}
          {auctionResult.winner && auctionResult.winnerCampaign ? (
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-2xl p-5 text-white shadow-md border border-blue-800">
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#FFC72C] bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  <Award className="w-4 h-4" /> Vencedor do Leilão Fé Engine
                </span>
                <span className="text-xs text-blue-200">
                  Total de Anúncios Elegíveis:{' '}
                  <strong className="text-white">{auctionResult.totalEligible}</strong>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <img
                  src={auctionResult.winner.imageUrl}
                  alt={auctionResult.winner.title}
                  className="w-20 h-20 rounded-xl object-cover border border-white/20 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-blue-200 uppercase tracking-wide">
                    {auctionResult.winner.storeName} ({auctionResult.winnerCampaign.planName})
                  </div>
                  <h4 className="text-base font-bold text-white leading-snug">
                    {auctionResult.winner.title}
                  </h4>
                  <p className="text-xs text-blue-100 line-clamp-2 mt-1">
                    {auctionResult.winner.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                    <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
                      Lance CPC: R$ {auctionResult.winner.bidCpc.toFixed(2)}
                    </span>
                    <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-md border border-amber-500/30">
                      Saldo Restante: R$ {auctionResult.winnerCampaign.remainingBudget.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500 text-sm">
                Nenhum anúncio elegível com orçamento ativo no momento.
              </p>
            </div>
          )}

          {/* Ranking Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-heading font-bold text-slate-800 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#0B3D91]" />
                Tabela Completa de Classificação do Leilão
              </h4>
              <span className="text-xs text-slate-500">
                Ordenado por Pontuação Final Decrescente
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Posição</th>
                    <th className="px-4 py-3">Anúncio / Lojista</th>
                    <th className="px-4 py-3">Plano</th>
                    <th className="px-4 py-3">Lance (60%)</th>
                    <th className="px-4 py-3">Relevância (40%)</th>
                    <th className="px-4 py-3">Geo Match</th>
                    <th className="px-4 py-3 text-right">Score Final</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {auctionResult.allRankedScores.map((item, idx) => {
                    const isWinner = idx === 0;
                    return (
                      <tr
                        key={item.ad.id}
                        className={isWinner ? 'bg-amber-50/60 font-semibold' : 'hover:bg-slate-50/80'}
                      >
                        <td className="px-4 py-3">
                          {isWinner ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#D97706] text-white font-black text-[11px]">
                              1º
                            </span>
                          ) : (
                            <span className="text-slate-400 pl-2">{idx + 1}º</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900 line-clamp-1">
                            {item.ad.title}
                          </div>
                          <div className="text-[11px] text-slate-500">{item.ad.storeName}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.campaign.planId === 'premium'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.campaign.planId === 'plus'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {item.campaign.planName}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-slate-900 font-bold">
                            R$ {item.advertiserBid.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            (+{(item.advertiserBid * 0.6).toFixed(3)})
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-indigo-700 font-bold">
                            {Math.round(item.userRelevance * 100)}%
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            (+{(item.userRelevance * 0.4).toFixed(3)})
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.geoScore >= 0.9
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.geoScore >= 0.5
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.geoScore === 1.0
                              ? 'Exato'
                              : item.geoScore >= 0.7
                              ? 'Salvador'
                              : 'Secundário'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`font-mono text-sm font-black ${
                              isWinner ? 'text-[#0B3D91]' : 'text-slate-700'
                            }`}
                          >
                            {item.finalScore.toFixed(4)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Algoritmo Fé Engine rodando com pesos: <strong className="text-slate-800">60% Lance + 40% Relevância</strong>.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Fechar Simulador
          </button>
        </div>
      </div>
    </div>
  );
};
