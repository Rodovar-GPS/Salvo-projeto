import React, { useState } from 'react';
import { Store, User, EventItem, TheftIncident } from '../types';
import { THEFT_TYPE_LABELS } from '../data/mockSafetyData';
import { ClearableInput } from '../components/ClearableInput';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Store as StoreIcon,
  Search,
  DollarSign,
  Users,
  Eye,
  Trash2,
  Sparkles,
  Calendar,
  MapPin,
  Tag,
  ExternalLink,
  ShieldCheck,
  Check,
  Crown,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Video,
  Image as ImageIcon,
} from 'lucide-react';

interface AdminDashboardViewProps {
  stores: Store[];
  events: EventItem[];
  theftIncidents?: TheftIncident[];
  onApproveStore: (storeId: string) => void;
  onRejectStore: (storeId: string) => void;
  onDeleteStore: (storeId: string) => void;
  onSelectStore: (store: Store) => void;
  onApproveEvent: (eventId: string) => void;
  onRejectEvent: (eventId: string, note?: string) => void;
  onToggleFeatureEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onApproveTheftIncident?: (incidentId: string) => void;
  onRejectTheftIncident?: (incidentId: string) => void;
  onDeleteTheftIncident?: (incidentId: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  stores,
  events,
  theftIncidents = [],
  onApproveStore,
  onRejectStore,
  onDeleteStore,
  onSelectStore,
  onApproveEvent,
  onRejectEvent,
  onToggleFeatureEvent,
  onDeleteEvent,
  onApproveTheftIncident,
  onRejectTheftIncident,
  onDeleteTheftIncident,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'stores' | 'events' | 'thefts'>('stores');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPreviewEvent, setSelectedPreviewEvent] = useState<EventItem | null>(null);
  const [selectedPreviewTheft, setSelectedPreviewTheft] = useState<TheftIncident | null>(null);

  // Store filtering
  const filteredStores = stores.filter((s) => {
    if (filterStatus !== 'all' && s.approvalStatus !== filterStatus) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.neighborhood.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Event filtering
  const filteredEvents = events.filter((ev) => {
    if (filterStatus !== 'all' && ev.status !== filterStatus) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        ev.title.toLowerCase().includes(q) ||
        ev.venue.toLowerCase().includes(q) ||
        ev.neighborhood.toLowerCase().includes(q) ||
        ev.category.toLowerCase().includes(q) ||
        ev.organizerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Theft filtering
  const filteredThefts = theftIncidents.filter((th) => {
    if (filterStatus !== 'all' && th.status !== filterStatus) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const addr = (th.address || th.street || th.referencePoint || '').toLowerCase();
      return (
        th.title.toLowerCase().includes(q) ||
        th.neighborhood.toLowerCase().includes(q) ||
        addr.includes(q) ||
        th.description.toLowerCase().includes(q) ||
        (th.reporterName && th.reporterName.toLowerCase().includes(q))
      );
    }
    return true;
  });


  const totalActiveStores = stores.filter((s) => s.approvalStatus === 'approved').length;
  const totalPendingStores = stores.filter((s) => s.approvalStatus === 'pending').length;

  const totalActiveEvents = events.filter((e) => e.status === 'approved').length;
  const totalPendingEvents = events.filter((e) => e.status === 'pending').length;

  const totalPendingThefts = theftIncidents.filter((t) => t.status === 'pending').length;
  const totalActiveThefts = theftIncidents.filter((t) => t.status === 'approved').length;

  const estimatedRevenue = totalActiveStores * 12; // R$ 12/mês per store


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-red-500 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
              Painel Administrativo
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              Moderação do SALVÔ
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl">
            Gestão, Lojas & Divulgação de Eventos
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Aprove cadastros comerciais, modere pedidos de divulgação de eventos de clientes assinantes e garanta a autenticidade das informações.
          </p>
        </div>

        {/* Financial KPI */}
        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-left md:text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-300 block">
            Faturamento Mensal Estimado
          </span>
          <p className="text-2xl font-heading font-black text-[#FFC72C]">
            R$ {estimatedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-[#2E9E5B] font-bold">
            {totalActiveStores} assinaturas ativas @ R$ 12,00/mês
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total de Lojas
          </span>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-heading font-black text-slate-900">{stores.length}</p>
            {totalPendingStores > 0 && (
              <span className="text-[10px] font-black px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">
                +{totalPendingStores} pendentes
              </span>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Eventos na Agenda
          </span>
          <p className="text-2xl font-heading font-black text-[#2E9E5B]">{totalActiveEvents}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Eventos Pendentes
          </span>
          <p className="text-2xl font-heading font-black text-amber-500">{totalPendingEvents}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Ofertas Ativas
          </span>
          <p className="text-2xl font-heading font-black text-[#E8552B]">
            {stores.reduce((acc, s) => acc + (s.offers?.length || 0), 0)}
          </p>
        </div>
      </div>

      {/* Section Tabs: Lojas vs Eventos */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => {
            setActiveAdminTab('stores');
            setFilterStatus('all');
          }}
          className={`px-5 py-2.5 rounded-2xl font-heading font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeAdminTab === 'stores'
              ? 'bg-[#0B4F8A] text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <StoreIcon className="w-4 h-4" />
          <span>Moderação de Lojas ({stores.length})</span>
          {totalPendingStores > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-400 text-slate-900 rounded-full text-[10px] font-black">
              {totalPendingStores}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveAdminTab('events');
            setFilterStatus('all');
          }}
          className={`px-5 py-2.5 rounded-2xl font-heading font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeAdminTab === 'events'
              ? 'bg-[#0B4F8A] text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#FFC72C]" />
          <span>Divulgação de Eventos ({events.length})</span>
          {totalPendingEvents > 0 && (
            <span className="px-1.5 py-0.2 bg-[#E8552B] text-white rounded-full text-[10px] font-black animate-pulse">
              {totalPendingEvents}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveAdminTab('thefts');
            setFilterStatus('all');
          }}
          className={`px-5 py-2.5 rounded-2xl font-heading font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeAdminTab === 'thefts'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-300" />
          <span>Alertas de Furto & Segurança ({theftIncidents.length})</span>
          {totalPendingThefts > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-400 text-slate-900 rounded-full text-[10px] font-black animate-pulse">
              {totalPendingThefts} pendentes
            </span>
          )}
        </button>
      </div>


      {/* Controls Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <ClearableInput
            placeholder={
              activeAdminTab === 'stores'
                ? 'Buscar loja por nome, bairro ou categoria...'
                : 'Buscar evento por título, local, bairro ou organizador...'
            }
            value={searchTerm}
            onValueChange={setSearchTerm}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            className="h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A]"
          />
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold shrink-0">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-2 rounded-xl transition-all ${
              filterStatus === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Todos ({activeAdminTab === 'stores' ? stores.length : events.length})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-2 rounded-xl transition-all ${
              filterStatus === 'approved' ? 'bg-[#2E9E5B] text-white' : 'text-slate-600'
            }`}
          >
            Aprovados
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-2 rounded-xl transition-all ${
              filterStatus === 'pending' ? 'bg-amber-500 text-white' : 'text-slate-600'
            }`}
          >
            Pendentes (
            {activeAdminTab === 'stores' ? totalPendingStores : totalPendingEvents})
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-3 py-2 rounded-xl transition-all ${
              filterStatus === 'rejected' ? 'bg-rose-500 text-white' : 'text-slate-600'
            }`}
          >
            Rejeitados
          </button>
        </div>
      </div>

      {/* TAB 1: STORES TABLE */}
      {activeAdminTab === 'stores' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-4">Estabelecimento</th>
                  <th className="p-4">Bairro / Categoria</th>
                  <th className="p-4">Assinatura</th>
                  <th className="p-4">Status Moderação</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredStores.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      Nenhuma loja encontrada com esses filtros.
                    </td>
                  </tr>
                ) : (
                  filteredStores.map((store) => (
                    <tr key={store.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={store.logo}
                            alt={store.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-heading font-bold text-xs text-slate-900">
                              {store.name}
                            </p>
                            <p className="text-[11px] text-slate-400">{store.whatsapp}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <p className="font-semibold text-slate-800">{store.neighborhood}</p>
                        <span className="text-[10px] text-slate-400">{store.category}</span>
                      </td>

                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-blue-50 text-[#0B4F8A] rounded font-bold text-[10px]">
                          R$ 12/mês (Ativo)
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            store.approvalStatus === 'approved'
                              ? 'bg-green-100 text-[#2E9E5B]'
                              : store.approvalStatus === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {store.approvalStatus === 'approved' && '● Aprovada'}
                          {store.approvalStatus === 'pending' && '⏳ Aguardando'}
                          {store.approvalStatus === 'rejected' && '✕ Rejeitada'}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectStore(store)}
                            className="p-1.5 text-slate-500 hover:text-[#0B4F8A] hover:bg-slate-100 rounded-lg transition-all"
                            title="Visualizar Perfil"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {store.approvalStatus !== 'approved' && (
                            <button
                              onClick={() => onApproveStore(store.id)}
                              className="px-2.5 py-1 bg-[#2E9E5B] hover:bg-emerald-600 text-white font-bold rounded-lg text-[10px] transition-all cursor-pointer"
                            >
                              Aprovar
                            </button>
                          )}

                          {store.approvalStatus === 'approved' && (
                            <button
                              onClick={() => onRejectStore(store.id)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-[10px] transition-all cursor-pointer"
                            >
                              Pausar
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (confirm(`Excluir ${store.name} permanentemente?`)) {
                                onDeleteStore(store.id);
                              }
                            }}
                            className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: EVENTS MODERATION TABLE */}
      {activeAdminTab === 'events' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-4">Evento / Flyer</th>
                    <th className="p-4">Data / Local</th>
                    <th className="p-4">Divulgado Por</th>
                    <th className="p-4">Preço</th>
                    <th className="p-4">Status Moderação</th>
                    <th className="p-4 text-right">Ações do Moderador</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredEvents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        Nenhum pedido de divulgação encontrado com esses filtros.
                      </td>
                    </tr>
                  ) : (
                    filteredEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Event Title & Flyer */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={event.flyerImage}
                              alt={event.title}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                            />
                            <div className="min-w-0 max-w-xs">
                              <p className="font-heading font-bold text-xs text-slate-900 truncate">
                                {event.title}
                              </p>
                              <span className="text-[10px] text-blue-800 bg-blue-50 px-1.5 py-0.2 rounded font-bold">
                                {event.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Date & Salvador Venue */}
                        <td className="p-4">
                          <p className="font-bold text-slate-800">{event.date} às {event.time}</p>
                          <p className="text-[11px] text-slate-500 truncate max-w-xs">
                            📍 {event.venue} ({event.neighborhood})
                          </p>
                        </td>

                        {/* Publisher Status */}
                        <td className="p-4">
                          <p className="font-semibold text-slate-900">{event.publisherName}</p>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                            <Crown className="w-3 h-3 text-[#FFC72C]" />
                            Assinante Verificado
                          </span>
                        </td>

                        {/* Price */}
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              event.priceType === 'gratis'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-orange-100 text-orange-900'
                            }`}
                          >
                            {event.priceText || (event.priceType === 'gratis' ? 'Grátis' : `R$ ${event.priceValue}`)}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              event.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : event.status === 'pending'
                                ? 'bg-amber-100 text-amber-800 animate-pulse'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {event.status === 'approved' && '● Aprovado'}
                            {event.status === 'pending' && '⏳ Aguardando Moderação'}
                            {event.status === 'rejected' && '✕ Rejeitado'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedPreviewEvent(event)}
                              className="p-1.5 text-slate-500 hover:text-[#0B4F8A] hover:bg-slate-100 rounded-lg transition-all"
                              title="Visualizar Detalhes"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {event.status !== 'approved' && (
                              <button
                                onClick={() => onApproveEvent(event.id)}
                                className="px-3 py-1 bg-[#2E9E5B] hover:bg-emerald-600 text-white font-heading font-black rounded-xl text-[11px] transition-all flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                                title="Aprovar Divulgação"
                              >
                                <ThumbsUp className="w-3.5 h-3.5" />
                                <span>Aprovar</span>
                              </button>
                            )}

                            {event.status !== 'rejected' && (
                              <button
                                onClick={() => {
                                  const reason = prompt('Motivo da rejeição/pausa (opcional):', 'Endereço ou dados incompletos');
                                  onRejectEvent(event.id, reason || undefined);
                                }}
                                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-[10px] transition-all flex items-center gap-1 cursor-pointer"
                                title="Rejeitar / Solicitar Ajustes"
                              >
                                <ThumbsDown className="w-3.5 h-3.5" />
                                <span>Recusar</span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                if (confirm(`Excluir permanentemente a divulgação de "${event.title}"?`)) {
                                  onDeleteEvent(event.id);
                                }
                              }}
                              className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: THEFTS & SAFETY INCIDENTS MODERATION */}
      {activeAdminTab === 'thefts' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-base text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  <span>Sinalizações de Furto & Alertas de Segurança Comunitária</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Moderação obrigatória: Ocorrências sinalizadas por usuários só são liberadas para visualização no mapa após aprovação do administrador.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {filteredThefts.length} de {theftIncidents.length} ocorrências
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <th className="p-4">Ocorrência / Tipo</th>
                    <th className="p-4">Bairro & Local</th>
                    <th className="p-4">Data & Horário</th>
                    <th className="p-4">Mídias (Fotos/Vídeo)</th>
                    <th className="p-4">Denunciante</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Ações de Moderação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredThefts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        Nenhuma ocorrência de furto encontrada com os filtros atuais.
                      </td>
                    </tr>
                  ) : (
                    filteredThefts.map((incident) => {
                      const typeInfo = THEFT_TYPE_LABELS[incident.type] || THEFT_TYPE_LABELS['furto_celular'];
                      const hasPhotos = incident.images && incident.images.length > 0;
                      const hasVideo = Boolean(incident.videoUrl);

                      return (
                        <tr key={incident.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Incident Title & Type */}
                          <td className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center text-lg shrink-0 border border-red-200 shadow-2xs">
                                {typeInfo.icon}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-heading font-black text-slate-900 truncate max-w-xs">
                                  {incident.title}
                                </h4>
                                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                                  {typeInfo.label}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Neighborhood & Address */}
                          <td className="p-4">
                            <div className="font-bold text-slate-900">{incident.neighborhood}</div>
                            <div className="text-[11px] text-slate-500 truncate max-w-xs">{incident.address || incident.street || incident.referencePoint || 'Salvador'}</div>
                          </td>

                          {/* Date & Time */}
                          <td className="p-4">
                            <div className="font-bold text-slate-900">{incident.occurredAtDate || incident.date}</div>
                            <div className="text-[11px] text-slate-500">às {incident.occurredAtTime || incident.time}</div>
                          </td>

                          {/* Media Attached */}
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              {hasPhotos && (
                                <span className="px-2 py-1 bg-sky-50 text-[#0B3D91] border border-sky-200 rounded-lg text-[10px] font-bold flex items-center gap-1">
                                  <ImageIcon className="w-3 h-3" />
                                  <span>{incident.images.length} foto(s)</span>
                                </span>
                              )}
                              {hasVideo && (
                                <span className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-[10px] font-bold flex items-center gap-1">
                                  <Video className="w-3 h-3" />
                                  <span>Vídeo</span>
                                </span>
                              )}
                              {!hasPhotos && !hasVideo && (
                                <span className="text-[11px] text-slate-400">Sem anexos</span>
                              )}
                            </div>
                          </td>

                          {/* Reporter */}
                          <td className="p-4">
                            <div className="font-bold text-slate-800">{incident.reporterName || 'Cidadão Anônimo'}</div>
                            <div className="text-[10px] text-slate-500">{incident.reporterContact || 'Sem contato'}</div>
                          </td>


                          {/* Status */}
                          <td className="p-4 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                                incident.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : incident.status === 'pending'
                                  ? 'bg-amber-100 text-amber-900 animate-pulse'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {incident.status === 'approved' && '● No Mapa'}
                              {incident.status === 'pending' && '⏳ Aguarda Aprovação'}
                              {incident.status === 'rejected' && '✕ Rejeitado'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedPreviewTheft(incident)}
                                className="p-1.5 text-slate-500 hover:text-[#0B3D91] hover:bg-slate-100 rounded-lg transition-all"
                                title="Ver Detalhes, Fotos e Vídeo"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {incident.status !== 'approved' && (
                                <button
                                  onClick={() => {
                                    if (onApproveTheftIncident) onApproveTheftIncident(incident.id);
                                  }}
                                  className="px-3 py-1 bg-[#2E9E5B] hover:bg-emerald-600 text-white font-heading font-black rounded-xl text-[11px] transition-all flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                                  title="Aprovar e Publicar no Mapa do Salvador"
                                >
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                  <span>Liberar no Mapa</span>
                                </button>
                              )}

                              {incident.status !== 'rejected' && (
                                <button
                                  onClick={() => {
                                    if (onRejectTheftIncident) onRejectTheftIncident(incident.id);
                                  }}
                                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-[10px] transition-all flex items-center gap-1 cursor-pointer"
                                  title="Rejeitar Ocorrência"
                                >
                                  <ThumbsDown className="w-3.5 h-3.5" />
                                  <span>Recusar</span>
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  if (confirm(`Excluir permanentemente a ocorrência "${incident.title}"?`)) {
                                    if (onDeleteTheftIncident) onDeleteTheftIncident(incident.id);
                                  }
                                }}
                                className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                                title="Excluir Definitivamente"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Event Preview for Admin */}
      {selectedPreviewEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="px-2.5 py-0.5 bg-blue-50 text-[#0B4F8A] rounded-full text-[10px] font-black uppercase tracking-wider">
                  {selectedPreviewEvent.category}
                </span>
                <h3 className="font-heading font-black text-xl text-slate-900 mt-1">
                  {selectedPreviewEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPreviewEvent(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <img
              src={selectedPreviewEvent.flyerImage}
              alt={selectedPreviewEvent.title}
              referrerPolicy="no-referrer"
              className="w-full h-44 object-cover rounded-2xl mb-4"
            />

            <div className="space-y-3 text-xs text-slate-600 mb-6">
              <p><strong>Data & Horário:</strong> {selectedPreviewEvent.date} às {selectedPreviewEvent.time}</p>
              <p><strong>Local:</strong> {selectedPreviewEvent.venue} - {selectedPreviewEvent.fullAddress}</p>
              <p><strong>CEP Salvador:</strong> {selectedPreviewEvent.cep}</p>
              <p><strong>Organizador:</strong> {selectedPreviewEvent.organizerName} ({selectedPreviewEvent.organizerContact || 'Sem contato'})</p>
              <p><strong>Descrição:</strong> {selectedPreviewEvent.description}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              {selectedPreviewEvent.status !== 'approved' && (
                <button
                  onClick={() => {
                    onApproveEvent(selectedPreviewEvent.id);
                    setSelectedPreviewEvent(null);
                  }}
                  className="px-4 py-2 bg-[#2E9E5B] text-white font-heading font-black rounded-xl text-xs"
                >
                  Aprovar Divulgação
                </button>
              )}
              {selectedPreviewEvent.status !== 'rejected' && (
                <button
                  onClick={() => {
                    onRejectEvent(selectedPreviewEvent.id);
                    setSelectedPreviewEvent(null);
                  }}
                  className="px-4 py-2 bg-amber-500 text-white font-bold rounded-xl text-xs"
                >
                  Rejeitar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Theft Incident Preview for Admin */}
      {selectedPreviewTheft && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="px-2.5 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 w-fit">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {THEFT_TYPE_LABELS[selectedPreviewTheft.type]?.label || 'Furto'}
                </span>
                <h3 className="font-heading font-black text-xl text-slate-900 mt-1">
                  {selectedPreviewTheft.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPreviewTheft(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Images */}
            {selectedPreviewTheft.images && selectedPreviewTheft.images.length > 0 && (
              <div className="space-y-2 mb-4">
                <div className="text-[11px] font-black uppercase text-slate-400">Fotos Anexadas</div>
                <div className="grid grid-cols-2 gap-2">
                  {selectedPreviewTheft.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Foto ${i + 1}`}
                      className="w-full h-32 object-cover rounded-xl border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Video */}
            {selectedPreviewTheft.videoUrl && (
              <div className="mb-4">
                <div className="text-[11px] font-black uppercase text-slate-400 mb-1">Vídeo Anexado</div>
                <a
                  href={selectedPreviewTheft.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-xs font-bold flex items-center justify-between border border-red-200"
                >
                  <span className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    <span>Abrir link do vídeo enviado</span>
                  </span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            <div className="space-y-3 text-xs text-slate-700 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <p><strong>Bairro:</strong> {selectedPreviewTheft.neighborhood}</p>
              <p><strong>Endereço / Referência:</strong> {selectedPreviewTheft.address || selectedPreviewTheft.street || selectedPreviewTheft.referencePoint || 'Salvador'}</p>
              <p><strong>Data & Horário:</strong> {selectedPreviewTheft.occurredAtDate || selectedPreviewTheft.date} às {selectedPreviewTheft.occurredAtTime || selectedPreviewTheft.time}</p>
              <p><strong>Denunciante:</strong> {selectedPreviewTheft.reporterName || 'Anônimo'} ({selectedPreviewTheft.reporterContact || 'Sem contato'})</p>
              <p><strong>Descrição dos Fatos:</strong> {selectedPreviewTheft.description}</p>
            </div>


            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              {selectedPreviewTheft.status !== 'approved' && (
                <button
                  onClick={() => {
                    if (onApproveTheftIncident) onApproveTheftIncident(selectedPreviewTheft.id);
                    setSelectedPreviewTheft(null);
                  }}
                  className="px-4 py-2 bg-[#2E9E5B] text-white font-heading font-black rounded-xl text-xs flex items-center gap-1.5"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Liberar no Mapa</span>
                </button>
              )}
              {selectedPreviewTheft.status !== 'rejected' && (
                <button
                  onClick={() => {
                    if (onRejectTheftIncident) onRejectTheftIncident(selectedPreviewTheft.id);
                    setSelectedPreviewTheft(null);
                  }}
                  className="px-4 py-2 bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>Rejeitar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
