import React, { useState, useRef, useEffect } from 'react';
import { ClearableInput, ClearableTextarea } from '../components/ClearableInput';
import { ModeratorListCard } from '../components/ModeratorListCard';
import { AudioMessagePlayer } from '../components/AudioMessagePlayer';
import {
  ChatConversation,
  ChatMessage,
  User,
  Store,
  ConversationTag,
  ModeratorProfile,
  ModerationAuditLog,
} from '../types';
import { MODERATOR_PROFILES, INITIAL_AUDIT_LOGS, CANNED_RESPONSES } from '../data/mockData';
import {
  MessageSquare,
  Send,
  QrCode,
  Tag,
  Flame,
  MapPin,
  Clock,
  ShieldCheck,
  Flag,
  Check,
  CheckCheck,
  Copy,
  Search,
  Filter,
  ArrowLeft,
  Store as StoreIcon,
  Sparkles,
  Phone,
  HelpCircle,
  AlertTriangle,
  FileCheck2,
  Trash2,
  CheckCircle2,
  Lock,
  UserX,
  VolumeX,
  ExternalLink,
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight,
  RefreshCw,
  X,
  Mic,
  Users,
  History,
  BookOpen,
  MessageCircle,
  Paperclip,
} from 'lucide-react';

interface ChatViewProps {
  conversations: ChatConversation[];
  currentUser: User;
  onSendMessage: (conversationId: string, text: string, extraOptions?: Partial<ChatMessage>) => void;
  onSelectStoreProfile: (storeId: string) => void;
  allStores: Store[];
  activeConversationId?: string;
}

interface ModerationTicket {
  id: string;
  conversationId: string;
  targetName: string;
  reportedBy: string;
  reason: string;
  details: string;
  severity: 'alta' | 'media' | 'baixa';
  status: 'pendente' | 'em_analise' | 'resolvido';
  timestamp: string;
  assignedModerator?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({
  conversations,
  currentUser,
  onSendMessage,
  onSelectStoreProfile,
  allStores,
  activeConversationId,
}) => {
  // Navigation tabs: 'chat' | 'moderators' | 'audit'
  const [activeTabMode, setActiveTabMode] = useState<'chat' | 'moderators' | 'audit'>('chat');

  // Selected conversation
  const [selectedConvId, setSelectedConvId] = useState<string | null>(
    activeConversationId || (conversations.length > 0 ? conversations[0].id : null)
  );

  // Input & Filter States
  const [inputText, setInputText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [moderatorSearch, setModeratorSearch] = useState('');
  const [moderatorFilterSpecialty, setModeratorFilterSpecialty] = useState<string>('all');
  const [showCannedDrawer, setShowCannedDrawer] = useState(false);

  // Modals
  const [showPixModal, setShowPixModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showModWarningModal, setShowModWarningModal] = useState(false);
  const [selectedModeratorContact, setSelectedModeratorContact] = useState<ModeratorProfile | null>(null);

  // Form states in modals
  const [pixAmountInput, setPixAmountInput] = useState('');
  const [pixDescInput, setPixDescInput] = useState('');
  const [reportReason, setReportReason] = useState('Tentativa de Golpe / Pix Suspeito');
  const [reportDetails, setReportDetails] = useState('');
  const [warningMessageText, setWarningMessageText] = useState(
    'Aviso Oficial de Moderação: Por favor, mantenha a negociação transparente e conforme as diretrizes do SALVÔ.'
  );

  // UX Feedback states
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Moderation Audit Logs State
  const [auditLogs, setAuditLogs] = useState<ModerationAuditLog[]>(INITIAL_AUDIT_LOGS);

  // Moderator Tickets State
  const [moderationTickets, setModerationTickets] = useState<ModerationTicket[]>([
    {
      id: 'MOD-1042',
      conversationId: conversations[0]?.id || 'conv-1',
      targetName: 'Açaí do Porto Barra',
      reportedBy: 'Carolina Bahia (Cliente)',
      reason: 'Solicitação de conferência de chave Pix CNPJ',
      details: 'Cliente pediu verificação da titularidade da conta antes de transferir sinal de R$ 45,00.',
      severity: 'baixa',
      status: 'pendente',
      timestamp: 'Há 12 min',
      assignedModerator: 'Mariana Cerqueira',
    },
    {
      id: 'MOD-1043',
      conversationId: conversations[1]?.id || 'conv-2',
      targetName: 'Artesanato Pelourinho Raízes',
      reportedBy: 'Turista Salvador',
      reason: 'Dúvida sobre valor de oferta promocional',
      details: 'Cliente solicitou confirmação de preço promocional anunciado no SALVÔ.',
      severity: 'media',
      status: 'em_analise',
      timestamp: 'Há 35 min',
      assignedModerator: 'Rodrigo Santana',
    },
    {
      id: 'MOD-1044',
      conversationId: conversations[0]?.id || 'conv-1',
      targetName: 'Usuário Não Verificado',
      reportedBy: 'Sistema Anti-Fraude SSA',
      reason: 'Auditoria de link externo suspeito',
      details: 'Tentativa de envio de link externo bloqueada automaticamente pela proteção da plataforma.',
      severity: 'alta',
      status: 'pendente',
      timestamp: 'Hoje, 09:15',
      assignedModerator: 'Everaldo Queiroz',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync active conversation
  useEffect(() => {
    if (activeConversationId) {
      setSelectedConvId(activeConversationId);
    }
  }, [activeConversationId]);

  // Scroll to bottom
  useEffect(() => {
    if (selectedConvId && activeTabMode === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConvId, conversations, activeTabMode]);

  const activeConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];
  const associatedStore = allStores.find((s) => s.id === activeConv?.storeId);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleCopy = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    showToast(`${label} copiado com sucesso!`);
    setTimeout(() => {
      setCopiedKeyId(null);
    }, 2500);
  };

  const handleSend = (textToSend?: string, extraOptions?: Partial<ChatMessage>) => {
    const text = textToSend !== undefined ? textToSend : inputText;
    if (!text.trim() || !activeConv) return;

    // Security keyword filter
    const lower = text.toLowerCase();
    const bannedWords = ['senha123', 'cvv', 'cartao clonado', 'fake link'];
    if (bannedWords.some((w) => lower.includes(w))) {
      showToast('⚠️ Mensagem bloqueada pelo filtro de segurança do SALVÔ.');
      return;
    }

    onSendMessage(activeConv.id, text.trim(), extraOptions);
    if (textToSend === undefined) setInputText('');

    // Simulate merchant auto-reply
    if (currentUser.role !== 'merchant') {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 1400);
    }
  };

  const handleSendVoiceNote = () => {
    if (!activeConv) return;
    onSendMessage(
      activeConv.id,
      '🎙️ Áudio gravado: "Olá! Obrigado pelo contato no SALVÔ. Nosso pedido já está separado!"',
      {
        type: 'audio',
        audioDuration: '0:28',
      }
    );
    showToast('Mensagem de voz enviada com sucesso!');
  };

  const handleSendCustomPix = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConv) return;
    const amountNum = parseFloat(pixAmountInput.replace(',', '.'));
    const storeName = associatedStore?.name || activeConv.storeName;

    onSendMessage(
      activeConv.id,
      `Segue a nossa chave Pix oficial para confirmação do seu pedido no valor de ${
        isNaN(amountNum) || amountNum <= 0
          ? 'negociação livre'
          : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amountNum)
      }. Titular: ${storeName}.`,
      {
        type: 'pix',
        pixDetails: {
          key: '12.345.678/0001-90',
          keyType: 'CNPJ',
          receiverName: storeName,
          city: 'Salvador - BA',
          amount: isNaN(amountNum) ? undefined : amountNum,
          description: pixDescInput || 'Pagamento Seguro SALVÔ',
        },
      }
    );

    setShowPixModal(false);
    setPixAmountInput('');
    setPixDescInput('');
    showToast('Chave Pix enviada no chat com sucesso!');
  };

  const handleSendOffer = (title: string, discount: string, desc: string, priceText?: string) => {
    if (!activeConv) return;
    onSendMessage(
      activeConv.id,
      `🔥 Compartilhamos uma oferta especial com você: *${title}* (${discount})! ${desc}`,
      {
        type: 'offer',
        offerDetails: {
          title,
          discountBadge: discount,
          priceText: priceText || discount,
          description: desc,
          expiresAt: '31/12/2026',
        },
      }
    );
    setShowOfferModal(false);
    showToast('Oferta enviada ao cliente com sucesso!');
  };

  const handleSendLocation = () => {
    if (!activeConv || !associatedStore) return;
    onSendMessage(
      activeConv.id,
      `📍 Nosso endereço em Salvador: ${associatedStore.address} (${associatedStore.neighborhood}). Venha nos visitar!`,
      {
        type: 'location',
        locationDetails: {
          address: associatedStore.address,
          neighborhood: associatedStore.neighborhood,
          name: associatedStore.name,
        },
      }
    );
    showToast('Localização enviada no chat!');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket: ModerationTicket = {
      id: `MOD-${Math.floor(1000 + Math.random() * 9000)}`,
      conversationId: activeConv?.id || 'conv-custom',
      targetName: activeConv?.storeName || 'Estabelecimento',
      reportedBy: `${currentUser.name} (${currentUser.role === 'client' ? 'Cliente' : 'Lojista'})`,
      reason: reportReason,
      details: reportDetails || 'Denúncia registrada diretamente pelo chat.',
      severity: 'alta',
      status: 'pendente',
      timestamp: 'Agora',
      assignedModerator: 'Mariana Cerqueira',
    };

    setModerationTickets((prev) => [newTicket, ...prev]);

    // Add audit log
    const newLog: ModerationAuditLog = {
      id: `log-${Date.now()}`,
      moderatorName: 'Sistema de Segurança SSA',
      action: `Nova denúncia registrada: ${reportReason}`,
      target: newTicket.targetName,
      timestamp: 'Agora',
      type: 'warned',
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    setShowReportModal(false);
    setReportDetails('');
    showToast('🛡️ Denúncia registrada! A equipe de moderação de Salvador foi acionada.');
  };

  const handleSendModWarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConv) return;
    onSendMessage(
      activeConv.id,
      `🛡️ [COMUNICADO OFICIAL DA MODERAÇÃO SALVADOR] ${warningMessageText}`,
      {
        type: 'moderation_notice',
      }
    );
    setShowModWarningModal(false);
    showToast('Aviso oficial de moderação publicado na conversa!');
  };

  const handleResolveTicket = (ticketId: string) => {
    setModerationTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'resolvido' } : t))
    );
    const resolvedTicket = moderationTickets.find((t) => t.id === ticketId);
    if (resolvedTicket) {
      const newLog: ModerationAuditLog = {
        id: `log-${Date.now()}`,
        moderatorName: resolvedTicket.assignedModerator || 'Mariana Cerqueira',
        action: `Auditoria concluída e encerrada (${resolvedTicket.reason})`,
        target: resolvedTicket.targetName,
        timestamp: 'Agora',
        type: 'resolved',
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    }
    showToast(`Ocorrência #${ticketId} marcada como resolvida com sucesso.`);
  };

  const filteredConversations = conversations.filter((c) => {
    const targetName = currentUser.role === 'merchant' ? c.clientName : c.storeName;
    const matchesSearch =
      targetName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesTag = filterTag === 'all' || c.statusTag === filterTag;
    return matchesSearch && matchesTag;
  });

  const filteredModerators = MODERATOR_PROFILES.filter((mod) => {
    if (moderatorSearch.trim()) {
      const q = moderatorSearch.toLowerCase();
      const matchName = mod.name.toLowerCase().includes(q);
      const matchSpec = mod.specialty.toLowerCase().includes(q);
      const matchRole = mod.roleTitle.toLowerCase().includes(q);
      if (!matchName && !matchSpec && !matchRole) return false;
    }
    if (moderatorFilterSpecialty !== 'all' && mod.specialty !== moderatorFilterSpecialty) {
      return false;
    }
    return true;
  });

  const pendingTicketsCount = moderationTickets.filter((t) => t.status !== 'resolvido').length;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5">
      {/* Floating System Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0B4F8A] text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#FFC72C] shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[780px]">
        {/* Top Header Mode Bar: Alternar entre Chat, Lista de Moderadores e Central de Auditoria */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#FFC72C] text-[#0B4F8A] flex items-center justify-center font-black text-sm shadow-sm">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-sm sm:text-base text-white tracking-tight">
                  Sistema Profissional de Atendimento & Moderação Salvador
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-black uppercase">
                  Ao Vivo
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {currentUser.role === 'merchant'
                  ? 'Painel do Lojista: Atendimento oficial, áudio, Pix CNPJ e ofertas'
                  : currentUser.role === 'admin'
                  ? 'Supervisão Geral: Moderação em tempo real, auditoria e plantão oficial'
                  : 'Canal verificado de negociação direta com os estabelecimentos de Salvador'}
              </p>
            </div>
          </div>

          {/* Three Mode Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
            <button
              onClick={() => setActiveTabMode('chat')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTabMode === 'chat'
                  ? 'bg-[#0B4F8A] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Mensagens</span>
              <span className="px-1.5 py-0.2 bg-[#FFC72C] text-[#0B4F8A] rounded-full text-[10px] font-black">
                {conversations.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTabMode('moderators')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTabMode === 'moderators'
                  ? 'bg-[#0B4F8A] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#FFC72C]" />
              <span>Lista de Moderadores</span>
              <span className="px-1.5 py-0.2 bg-emerald-500 text-white rounded-full text-[10px] font-black">
                {MODERATOR_PROFILES.filter((m) => m.status === 'online').length} online
              </span>
            </button>

            <button
              onClick={() => setActiveTabMode('audit')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTabMode === 'audit'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Auditoria & Casos</span>
              {pendingTicketsCount > 0 && (
                <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-black animate-pulse">
                  {pendingTicketsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* =========================================================
            VIEW 1: LISTA DE MODERADORES OFICIAIS
        ========================================================= */}
        {activeTabMode === 'moderators' && (
          <div className="flex-1 bg-slate-50 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#0B4F8A] to-[#105a9c] rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-[#FFC72C] text-[#0B4F8A] text-[10px] font-black uppercase rounded-md shadow-2xs">
                    Equipe de Segurança & Suporte SSA
                  </span>
                  <span className="text-xs font-bold text-sky-200">Garantia Oficial do SALVÔ</span>
                </div>
                <h2 className="font-heading font-black text-2xl tracking-tight">
                  Quadro de Moderadores de Plantão
                </h2>
                <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-xl">
                  Profissionais treinados e certificados para garantir negociações transparentes,
                  prevenção contra fraudes no Pix e atendimento aos lojistas de Salvador.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center shrink-0">
                <span className="text-[10px] uppercase font-bold text-sky-200 block">Tempo Médio de Resposta</span>
                <span className="text-2xl font-heading font-black text-[#FFC72C]">8 minutos</span>
                <span className="text-[10px] text-emerald-300 font-bold block mt-0.5">Plantão 24h Ativo</span>
              </div>
            </div>

            {/* Filter and Search Bar for Moderators */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full">
                <ClearableInput
                  placeholder="Buscar moderador por nome, especialidade (Pix, Vendas, Turismo)..."
                  value={moderatorSearch}
                  onValueChange={setModeratorSearch}
                  leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                  className="h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A]"
                />
              </div>

              <div className="w-full sm:w-64">
                <select
                  value={moderatorFilterSpecialty}
                  onChange={(e) => setModeratorFilterSpecialty(e.target.value)}
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none cursor-pointer"
                >
                  <option value="all">⭐ Todas as Especialidades</option>
                  <option value="Antifraude & Pix">🔒 Antifraude & Pix</option>
                  <option value="Qualidade & Vendas">🛍️ Qualidade & Vendas</option>
                  <option value="Atendimento Turístico">🌴 Atendimento Turístico</option>
                  <option value="Auditoria Geral SSA">🛡️ Auditoria Geral SSA</option>
                </select>
              </div>
            </div>

            {/* Moderators Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredModerators.map((mod) => (
                <ModeratorListCard
                  key={mod.id}
                  moderator={mod}
                  onContactModerator={(m) => {
                    setSelectedModeratorContact(m);
                  }}
                  onAssignTicket={(m) => {
                    showToast(`Casos pendentes atribuídos ao moderador ${m.name}!`);
                  }}
                />
              ))}
            </div>

            {/* Direct Escalation Support Banner */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-sm text-slate-900">
                    Precisa de Auditoria Imediata em uma Negociação?
                  </h3>
                  <p className="text-xs text-slate-500">
                    Nossos moderadores auditam comprovantes Pix, contratos verbais no chat e endereço físico de qualquer loja de Salvador.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTabMode('audit');
                  showToast('Redirecionado para a fila de auditoria e denúncias.');
                }}
                className="px-4 py-2.5 bg-[#0B4F8A] hover:bg-[#083a66] text-white text-xs font-heading font-black uppercase tracking-wider rounded-xl shadow-sm shrink-0 transition-all"
              >
                Abrir Fila de Auditoria
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            VIEW 2: CENTRAL DE AUDITORIA & CASOS
        ========================================================= */}
        {activeTabMode === 'audit' && (
          <div className="flex-1 bg-slate-50 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Moderator Top Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Denúncias Ativas
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-heading font-black text-rose-600">
                    {pendingTicketsCount}
                  </span>
                  <span className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                    <ShieldAlert className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Tempo Médio de Análise
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-heading font-black text-[#0B4F8A]">
                    8 min
                  </span>
                  <span className="p-2 bg-blue-50 text-[#0B4F8A] rounded-xl">
                    <Clock className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Auditorias Pix Verificadas
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-heading font-black text-emerald-600">
                    100%
                  </span>
                  <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Segurança Salvador
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-heading font-black text-amber-500">
                    Blindada
                  </span>
                  <span className="p-2 bg-amber-50 text-amber-500 rounded-xl">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>

            {/* Moderation Queue List */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#0B4F8A]" />
                    <span>Fila de Moderação & Auditoria de Atendimentos</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Supervisão de conduta, prevenção contra fraudes Pix e suporte aos lojistas de
                    Salvador.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const sampleTicket: ModerationTicket = {
                        id: `MOD-${Math.floor(1000 + Math.random() * 9000)}`,
                        conversationId: activeConv?.id || 'conv-1',
                        targetName: 'Lojista em Verificação',
                        reportedBy: 'Auditoria de Segurança SSA',
                        reason: 'Verificação periódica de CNPJ e dados do estabelecimento',
                        details: 'Auditoria periódica de conformidade com as diretrizes do SALVÔ.',
                        severity: 'baixa',
                        status: 'pendente',
                        timestamp: 'Agora',
                        assignedModerator: 'Rodrigo Santana',
                      };
                      setModerationTickets((prev) => [sampleTicket, ...prev]);
                      showToast('Nova auditoria adicionada à fila do moderador!');
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Simular Nova Auditoria</span>
                  </button>
                </div>
              </div>

              {/* Tickets Cards */}
              <div className="space-y-3">
                {moderationTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      ticket.status === 'resolvido'
                        ? 'bg-slate-50/60 border-slate-200 opacity-70'
                        : ticket.severity === 'alta'
                        ? 'bg-rose-50/50 border-rose-200'
                        : 'bg-amber-50/40 border-amber-200'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-black text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {ticket.id}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            ticket.severity === 'alta'
                              ? 'bg-rose-500 text-white'
                              : ticket.severity === 'media'
                              ? 'bg-amber-500 text-white'
                              : 'bg-blue-500 text-white'
                          }`}
                        >
                          Severidade {ticket.severity}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ticket.status === 'resolvido'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ticket.status === 'resolvido' ? '✓ Resolvido' : '⏳ Pendente'}
                        </span>
                        {ticket.assignedModerator && (
                          <span className="text-[10px] font-bold bg-blue-50 text-[#0B4F8A] px-2 py-0.5 rounded-md border border-blue-200">
                            👤 Resp: {ticket.assignedModerator}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">• {ticket.timestamp}</span>
                      </div>

                      <h3 className="font-heading font-bold text-sm text-slate-900">
                        {ticket.targetName}{' '}
                        <span className="font-normal text-xs text-slate-500">
                          (Reportado por: {ticket.reportedBy})
                        </span>
                      </h3>

                      <p className="text-xs text-slate-700">
                        <strong>Motivo:</strong> {ticket.reason}
                      </p>
                      <p className="text-xs text-slate-500 bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
                        {ticket.details}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-row sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          setSelectedConvId(ticket.conversationId);
                          setActiveTabMode('chat');
                        }}
                        className="flex-1 sm:flex-none px-3.5 py-2 bg-[#0B4F8A] hover:bg-[#083a66] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Abrir Chat</span>
                      </button>

                      {ticket.status !== 'resolvido' ? (
                        <button
                          onClick={() => handleResolveTicket(ticket.id)}
                          className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Homologar & Encerrar</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-bold text-center py-1">
                          Auditoria Concluída
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit History Log */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-heading font-black text-sm text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-[#0B4F8A]" />
                <span>Histórico Recente de Ações da Moderação</span>
              </h3>

              <div className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <div key={log.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          log.type === 'resolved' || log.type === 'verified'
                            ? 'bg-emerald-500'
                            : log.type === 'blocked'
                            ? 'bg-rose-500'
                            : 'bg-amber-500'
                        }`}
                      />
                      <span className="font-bold text-slate-800">{log.moderatorName}:</span>
                      <span className="text-slate-600">{log.action}</span>
                      <span className="font-semibold text-[#0B4F8A]">({log.target})</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono shrink-0">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            VIEW 3: CHAT INTERFACE (2-COLUMN RESPONSIVE LAYOUT)
        ========================================================= */}
        {activeTabMode === 'chat' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* ---------------------------------------------------------
                LEFT COLUMN: Lista de Conversas
            --------------------------------------------------------- */}
            <div
              className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50 ${
                selectedConvId ? 'hidden md:flex' : 'flex'
              }`}
            >
              {/* Search Bar with Clear Button */}
              <div className="p-3.5 border-b border-slate-200 bg-white space-y-2.5">
                <ClearableInput
                  placeholder="Buscar conversa, loja ou mensagem..."
                  value={searchFilter}
                  onValueChange={setSearchFilter}
                  leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                  className="h-10 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A]"
                />

                {/* Filter tags */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'all', label: 'Todas' },
                    { id: 'Em Atendimento', label: 'Em Atendimento' },
                    { id: 'Aguardando PIX', label: 'Aguardando Pix' },
                    { id: 'Concluído', label: 'Concluídas' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setFilterTag(tab.id)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                        filterTag === tab.id
                          ? 'bg-[#0B4F8A] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conv) => {
                    const isSelected = selectedConvId === conv.id;
                    const displayName =
                      currentUser.role === 'merchant' ? conv.clientName : conv.storeName;
                    const displayAvatar =
                      currentUser.role === 'merchant'
                        ? conv.clientAvatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                        : conv.storeLogo;

                    return (
                      <div
                        key={conv.id}
                        onClick={() => setSelectedConvId(conv.id)}
                        className={`p-3.5 cursor-pointer transition-all flex items-start gap-3 relative ${
                          isSelected
                            ? 'bg-blue-50/80 border-l-4 border-l-[#0B4F8A]'
                            : 'hover:bg-slate-100/70 bg-white'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={displayAvatar}
                            alt={displayName}
                            className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                          />
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#2E9E5B] border-2 border-white rounded-full"></span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-heading font-bold text-xs text-slate-900 truncate">
                              {displayName}
                            </h3>
                            <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                              {conv.lastMessageTime}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 truncate leading-snug">
                            {conv.lastMessage}
                          </p>

                          <div className="flex items-center gap-1.5 mt-1.5">
                            {conv.statusTag && (
                              <span
                                className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                                  conv.statusTag === 'Aguardando PIX'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : conv.statusTag === 'Concluído'
                                    ? 'bg-slate-200 text-slate-700'
                                    : 'bg-blue-100 text-[#0B4F8A]'
                                }`}
                              >
                                {conv.statusTag}
                              </span>
                            )}
                            {conv.unreadCount > 0 && (
                              <span className="px-1.5 py-0.5 bg-[#FFC72C] text-[#0B4F8A] font-black text-[10px] rounded-full ml-auto">
                                {conv.unreadCount} nova
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-slate-400 space-y-2">
                    <MessageSquare className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
                    <p className="text-xs font-semibold">Nenhuma conversa encontrada</p>
                  </div>
                )}
              </div>
            </div>

            {/* ---------------------------------------------------------
                RIGHT COLUMN: Janela de Chat Ativa
            --------------------------------------------------------- */}
            {activeConv ? (
              <div className="flex-1 flex flex-col bg-slate-50/30 overflow-hidden">
                {/* Chat Top Header */}
                <div className="p-3.5 sm:p-4 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => setSelectedConvId(null)}
                      className="md:hidden p-2 text-slate-500 hover:text-slate-800 -ml-1"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    <img
                      src={
                        currentUser.role === 'merchant'
                          ? activeConv.clientAvatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                          : activeConv.storeLogo
                      }
                      alt="Avatar"
                      className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h2 className="font-heading font-black text-sm text-slate-900 truncate">
                          {currentUser.role === 'merchant'
                            ? activeConv.clientName
                            : activeConv.storeName}
                        </h2>
                        <span className="px-1.5 py-0.5 bg-emerald-50 text-[#2E9E5B] border border-emerald-200 rounded text-[9px] font-black uppercase flex items-center gap-0.5 shrink-0">
                          <Check className="w-2.5 h-2.5" />
                          Verificado
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#0B4F8A]" />
                        <span>{associatedStore?.neighborhood || 'Salvador, Bahia'}</span>
                        <span>• Resposta imediata</span>
                      </p>
                    </div>
                  </div>

                  {/* Header Actions */}
                  <div className="flex items-center gap-1.5">
                    {associatedStore && (
                      <button
                        onClick={() => onSelectStoreProfile(associatedStore.id)}
                        className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                        title="Ver Perfil Completo da Loja"
                      >
                        <StoreIcon className="w-3.5 h-3.5 text-[#0B4F8A]" />
                        <span>Ver Loja</span>
                      </button>
                    )}

                    {/* Report Button */}
                    <button
                      onClick={() => setShowReportModal(true)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      title="Denunciar atendimento à moderação de Salvador"
                    >
                      <Flag className="w-4 h-4" />
                    </button>

                    {/* Admin/Moderator Action */}
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => setShowModWarningModal(true)}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                        title="Emitir Comunicado Oficial de Moderação"
                      >
                        <ShieldAlert className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Security Guarantee Notice */}
                <div className="bg-gradient-to-r from-blue-900 to-[#0B4F8A] text-white px-4 py-2 text-[11px] font-medium flex items-center justify-between gap-2 shadow-inner">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#FFC72C] shrink-0" />
                    <span>
                      <strong>Proteção Oficial Salvador:</strong> Seus pagamentos Pix e dados cadastrais
                      são monitorados pelos moderadores oficiais.
                    </span>
                  </div>
                  <span className="text-[10px] text-sky-200 shrink-0 font-mono">ID #{activeConv.id}</span>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {activeConv.messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    const isModNotice = msg.type === 'moderation_notice';

                    if (isModNotice) {
                      return (
                        <div
                          key={msg.id}
                          className="my-3 p-3.5 bg-amber-50 border-2 border-amber-300 rounded-2xl text-amber-950 text-xs shadow-sm flex items-start gap-3"
                        >
                          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <strong className="block font-heading font-black text-amber-900 mb-0.5">
                              COMUNICADO OFICIAL DA MODERAÇÃO
                            </strong>
                            <p className="leading-relaxed">{msg.text}</p>
                            <span className="text-[10px] text-amber-700 block mt-1">
                              {msg.timestamp} • Auditoria do SALVÔ
                            </span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 shadow-sm relative ${
                            isMe
                              ? 'bg-[#0B4F8A] text-white rounded-br-xs'
                              : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                          }`}
                        >
                          {/* Sender name for context */}
                          <div
                            className={`text-[10px] font-black uppercase tracking-wider mb-1 ${
                              isMe ? 'text-sky-200' : 'text-[#0B4F8A]'
                            }`}
                          >
                            {msg.senderName}
                          </div>

                          {/* Voice Message Player */}
                          {msg.type === 'audio' ? (
                            <div className="space-y-2">
                              <AudioMessagePlayer
                                duration={msg.audioDuration || '0:24'}
                                isMe={isMe}
                                senderName={msg.senderName}
                              />
                              <p className="text-xs italic opacity-90">{msg.text}</p>
                            </div>
                          ) : (
                            /* Regular Message Text */
                            <p className="text-xs sm:text-sm font-medium leading-relaxed break-words">
                              {msg.text}
                            </p>
                          )}

                          {/* Interactive Pix Card */}
                          {msg.type === 'pix' && msg.pixDetails && (
                            <div
                              className={`mt-3 p-3.5 rounded-2xl border text-xs space-y-2.5 ${
                                isMe
                                  ? 'bg-white/10 border-white/20 text-white'
                                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 font-bold">
                                  <QrCode className="w-4 h-4 text-[#FFC72C]" />
                                  <span className="font-heading">Chave Pix Oficial</span>
                                </div>
                                <span className="text-[10px] font-black px-2 py-0.5 bg-[#FFC72C] text-[#0B4F8A] rounded-full">
                                  {msg.pixDetails.keyType}
                                </span>
                              </div>

                              {msg.pixDetails.amount && (
                                <div className="text-sm font-heading font-black">
                                  Valor a transferir:{' '}
                                  {new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  }).format(msg.pixDetails.amount)}
                                </div>
                              )}

                              <div className="p-2.5 bg-black/10 rounded-xl font-mono text-[11px] break-all select-all flex items-center justify-between gap-2">
                                <span>{msg.pixDetails.key}</span>
                                <button
                                  onClick={() =>
                                    handleCopy(
                                      msg.pixDetails!.key,
                                      `pix-${msg.id}`,
                                      'Chave Pix'
                                    )
                                  }
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0 transition-all ${
                                    copiedKeyId === `pix-${msg.id}`
                                      ? 'bg-[#2E9E5B] text-white'
                                      : 'bg-white text-slate-900 hover:bg-slate-100 shadow-2xs'
                                  }`}
                                >
                                  {copiedKeyId === `pix-${msg.id}` ? (
                                    <>
                                      <Check className="w-3 h-3 stroke-[3]" />
                                      <span>Copiado!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copiar Pix</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              <p className="text-[10px] opacity-85">
                                Titular: <strong>{msg.pixDetails.receiverName}</strong> (
                                {msg.pixDetails.city})
                              </p>
                            </div>
                          )}

                          {/* Interactive Offer Card */}
                          {(msg.type === 'offer' || msg.type === 'coupon') && (msg.offerDetails || msg.couponDetails) && (
                            <div
                              className={`mt-3 p-3.5 rounded-2xl border text-xs space-y-2 ${
                                isMe
                                  ? 'bg-white/10 border-white/20 text-white'
                                  : 'bg-amber-50 border-amber-200 text-amber-950'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 font-bold">
                                  <Flame className="w-4 h-4 text-[#FFC72C] fill-[#FFC72C]" />
                                  <span className="font-heading">
                                    {msg.offerDetails?.title || 'Oferta Especial'}
                                  </span>
                                </div>
                                <span className="px-2 py-0.5 bg-[#FFC72C] text-[#0B4F8A] text-[10px] font-black rounded-full shadow-2xs">
                                  {msg.offerDetails?.discountBadge || msg.couponDetails?.discountBadge}
                                </span>
                              </div>

                              <p className="text-xs">
                                {msg.offerDetails?.description || msg.couponDetails?.description}
                              </p>

                              {msg.offerDetails?.priceText && (
                                <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 font-bold text-emerald-700 text-xs">
                                  {msg.offerDetails.priceText}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Interactive Location Card */}
                          {msg.type === 'location' && msg.locationDetails && (
                            <div
                              className={`mt-3 p-3 rounded-2xl border text-xs space-y-1.5 ${
                                isMe
                                  ? 'bg-white/10 border-white/20 text-white'
                                  : 'bg-blue-50 border-blue-200 text-blue-950'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 font-bold">
                                <MapPin className="w-4 h-4 text-[#0B4F8A]" />
                                <span>{msg.locationDetails.name}</span>
                              </div>
                              <p className="text-[11px] opacity-85">
                                {msg.locationDetails.address}
                              </p>
                            </div>
                          )}

                          {/* Timestamp & Checks */}
                          <div
                            className={`flex items-center justify-end gap-1 text-[10px] mt-1.5 ${
                              isMe ? 'text-sky-200' : 'text-slate-400'
                            }`}
                          >
                            <span>{msg.timestamp}</span>
                            {isMe && <CheckCheck className="w-3.5 h-3.5 text-[#FFC72C]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-ping"></span>
                      </div>
                      <span>Digitando resposta...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Canned Drawer Toggle */}
                {showCannedDrawer && (
                  <div className="p-3 bg-white border-t border-slate-200 space-y-2 animate-in slide-in-from-bottom-2 duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-[#0B4F8A]" />
                        <span>Banco de Respostas Rápidas Profissionais:</span>
                      </span>
                      <button
                        onClick={() => setShowCannedDrawer(false)}
                        className="text-xs font-bold text-slate-400 hover:text-slate-700"
                      >
                        Fechar ✕
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {CANNED_RESPONSES.map((cr) => (
                        <div
                          key={cr.id}
                          onClick={() => {
                            setInputText(cr.text);
                            setShowCannedDrawer(false);
                          }}
                          className="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#0B4F8A] rounded-xl cursor-pointer transition-all text-left"
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-heading font-bold text-xs text-slate-900 truncate">
                              {cr.title}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">{cr.shortcut}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{cr.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Bar for Merchant or Client */}
                <div className="px-4 py-2 bg-slate-100/90 border-t border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <span className="text-[10px] font-black uppercase text-[#0B4F8A] shrink-0 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFC72C]" />
                    {currentUser.role === 'merchant' ? 'Ferramentas do Lojista:' : 'Sugestões Rápidas:'}
                  </span>

                  {currentUser.role === 'merchant' ? (
                    <>
                      <button
                        onClick={() => setShowPixModal(true)}
                        className="px-3 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-[11px] font-bold whitespace-nowrap shadow-2xs transition-all flex items-center gap-1"
                      >
                        <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Cobrar com Pix</span>
                      </button>
                      <button
                        onClick={() => setShowOfferModal(true)}
                        className="px-3 py-1 bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-[11px] font-bold whitespace-nowrap shadow-2xs transition-all flex items-center gap-1"
                      >
                        <Flame className="w-3.5 h-3.5 text-[#E8552B]" />
                        <span>Enviar Oferta</span>
                      </button>
                      <button
                        onClick={handleSendLocation}
                        className="px-3 py-1 bg-white hover:bg-blue-50 text-[#0B4F8A] border border-blue-200 rounded-xl text-[11px] font-bold whitespace-nowrap shadow-2xs transition-all flex items-center gap-1"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Enviar Endereço</span>
                      </button>
                      <button
                        onClick={handleSendVoiceNote}
                        className="px-3 py-1 bg-white hover:bg-purple-50 text-purple-800 border border-purple-200 rounded-xl text-[11px] font-bold whitespace-nowrap shadow-2xs transition-all flex items-center gap-1"
                      >
                        <Mic className="w-3.5 h-3.5 text-purple-600" />
                        <span>Enviar Áudio</span>
                      </button>
                      <button
                        onClick={() => setShowCannedDrawer(!showCannedDrawer)}
                        className="px-3 py-1 bg-[#FFC72C]/20 hover:bg-[#FFC72C]/30 text-[#0B4F8A] border border-[#FFC72C]/40 rounded-xl text-[11px] font-bold whitespace-nowrap shadow-2xs transition-all flex items-center gap-1"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Respostas Rápidas</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleSend('Olá! Vocês estão com entregas abertas hoje?')}
                        className="px-3 py-1 bg-white hover:bg-blue-50 text-slate-700 border border-slate-200 rounded-xl text-[11px] font-medium whitespace-nowrap shadow-2xs transition-all"
                      >
                        Está aberto para entrega?
                      </button>
                      <button
                        onClick={() => handleSend('Poderia me enviar a chave Pix para pagamento?')}
                        className="px-3 py-1 bg-white hover:bg-blue-50 text-slate-700 border border-slate-200 rounded-xl text-[11px] font-medium whitespace-nowrap shadow-2xs transition-all"
                      >
                        Pagar via Pix
                      </button>
                      <button
                        onClick={() => handleSend('Vocês têm alguma oferta especial disponível hoje?')}
                        className="px-3 py-1 bg-white hover:bg-blue-50 text-slate-700 border border-slate-200 rounded-xl text-[11px] font-medium whitespace-nowrap shadow-2xs transition-all"
                      >
                        Quais são as ofertas?
                      </button>
                      <button
                        onClick={handleSendVoiceNote}
                        className="px-3 py-1 bg-white hover:bg-purple-50 text-purple-800 border border-purple-200 rounded-xl text-[11px] font-bold whitespace-nowrap shadow-2xs transition-all flex items-center gap-1"
                      >
                        <Mic className="w-3.5 h-3.5 text-purple-600" />
                        <span>Mensagem de Voz</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Input Bar with ClearableInput */}
                <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
                  <div className="flex-1">
                    <ClearableInput
                      placeholder={
                        currentUser.role === 'merchant'
                          ? 'Digite sua resposta profissional para o cliente (ou clique no ✕ para apagar)...'
                          : 'Digite sua mensagem para a loja em Salvador (ou clique no ✕ para apagar)...'
                      }
                      value={inputText}
                      onValueChange={setInputText}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSend();
                      }}
                      className="h-12 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A] text-xs sm:text-sm font-semibold"
                    />
                  </div>

                  <button
                    onClick={() => handleSend()}
                    disabled={!inputText.trim()}
                    className={`h-12 px-5 font-heading font-black text-xs uppercase tracking-wider rounded-2xl shadow-md flex items-center justify-center gap-1.5 transition-all ${
                      inputText.trim()
                        ? 'bg-[#0B4F8A] hover:bg-[#083a66] text-white active:scale-95 cursor-pointer'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Enviar</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <MessageSquare className="w-12 h-12 mb-2 stroke-1 text-slate-300" />
                <p className="text-sm font-bold text-slate-700">Selecione uma conversa</p>
                <p className="text-xs text-slate-400 mt-1">
                  Atendimento direto e seguro com os estabelecimentos de Salvador.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* =========================================================
          MODAL: CONTATO DIRETO COM O MODERADOR
      ========================================================= */}
      {selectedModeratorContact && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={selectedModeratorContact.avatar}
                  alt={selectedModeratorContact.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    {selectedModeratorContact.name}
                  </h3>
                  <p className="text-xs text-[#0B4F8A] font-semibold">{selectedModeratorContact.roleTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedModeratorContact(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Especialidade:</span>
                <span className="font-bold text-slate-800">{selectedModeratorContact.specialty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Turno / Plantão:</span>
                <span className="font-bold text-slate-800">{selectedModeratorContact.shift}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Telefone / WhatsApp:</span>
                <span className="font-mono font-bold text-emerald-700">{selectedModeratorContact.phoneContact}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">E-mail Institucional:</span>
                <span className="font-mono text-slate-600">{selectedModeratorContact.email}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              O moderador pode ser acionado para intermediar pagamentos de alto valor, revisar ofertas ou realizar auditoria cadastral da loja.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedModeratorContact(null);
                  setActiveTabMode('chat');
                  showToast(`Solicitação de mediação enviada para ${selectedModeratorContact.name}!`);
                }}
                className="flex-1 h-12 bg-[#0B4F8A] hover:bg-[#083a66] text-white font-heading font-black text-xs uppercase tracking-wider rounded-2xl shadow-md flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Solicitar Mediação no Chat</span>
              </button>
              <button
                onClick={() => setSelectedModeratorContact(null)}
                className="px-4 h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: ENVIAR PIX (Painel Lojista)
      ========================================================= */}
      {showPixModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#2E9E5B] flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    Enviar Chave Pix da Loja
                  </h3>
                  <p className="text-xs text-slate-500">
                    {associatedStore?.name || activeConv?.storeName} • Salvador
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPixModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendCustomPix} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Chave Pix Cadastrada (CNPJ Oficial)
                </label>
                <input
                  type="text"
                  disabled
                  value="12.345.678/0001-90 (Açaí do Porto Barra LTDA)"
                  className="w-full h-11 px-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Valor do Pedido / Serviço (em R$)
                </label>
                <ClearableInput
                  placeholder="Ex: 35,00"
                  value={pixAmountInput}
                  onValueChange={setPixAmountInput}
                  leftIcon={<span className="font-bold text-slate-400">R$</span>}
                  className="h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Descrição do Pedido / Observação
                </label>
                <ClearableInput
                  placeholder="Ex: 1x Tigela 500ml + Frutas (Oferta Aplicada)"
                  value={pixDescInput}
                  onValueChange={setPixDescInput}
                  className="h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A]"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-800">
                🔒 O cliente receberá um card interativo com o botão <strong>"Copiar Pix"</strong> e
                todos os dados de segurança.
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 h-12 bg-[#2E9E5B] hover:bg-[#25824b] text-white font-heading font-black text-xs uppercase tracking-wider rounded-2xl shadow-md flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Pix ao Cliente</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPixModal(false)}
                  className="px-4 h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: ENVIAR OFERTA ESPECIAL
      ========================================================= */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#0B4F8A] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-[#E8552B] fill-[#E8552B]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    Enviar Oferta Especial
                  </h3>
                  <p className="text-xs text-slate-500">Compartilhe uma oferta exclusiva com este cliente</p>
                </div>
              </div>
              <button
                onClick={() => setShowOfferModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {associatedStore?.offers && associatedStore.offers.length > 0 ? (
                associatedStore.offers.map((off) => (
                  <div
                    key={off.id}
                    className="p-3.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-[#FFC72C] rounded-2xl flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#FFC72C] text-[#0B4F8A] font-black text-[10px] rounded-full">
                          {off.discountBadge}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900">{off.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{off.description}</p>
                    </div>

                    <button
                      onClick={() => handleSendOffer(off.title, off.discountBadge, off.description, off.priceText)}
                      className="px-3.5 py-2 bg-[#0B4F8A] hover:bg-[#083a66] text-white text-xs font-bold rounded-xl shadow-2xs shrink-0"
                    >
                      Enviar
                    </button>
                  </div>
                ))
              ) : (
                [
                  {
                    title: 'Desconto de Fidelidade',
                    discount: '10% OFF',
                    desc: 'Válido para compras e pedidos confirmados hoje',
                  },
                  {
                    title: 'Desconto Salvador Especial',
                    discount: 'R$ 15 OFF',
                    desc: 'Desconto imediato em compras no balcão',
                  },
                  {
                    title: 'Entrega Gratuita no Bairro',
                    discount: 'FRETE GRÁTIS',
                    desc: 'Entrega cortesia para bairros vizinhos em Salvador',
                  },
                ].map((c, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-[#FFC72C] rounded-2xl flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#FFC72C] text-[#0B4F8A] font-black text-[10px] rounded-full">
                          {c.discount}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900">{c.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{c.desc}</p>
                    </div>

                    <button
                      onClick={() => handleSendOffer(c.title, c.discount, c.desc)}
                      className="px-3.5 py-2 bg-[#0B4F8A] hover:bg-[#083a66] text-white text-xs font-bold rounded-xl shadow-2xs shrink-0"
                    >
                      Enviar
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: DENUNCIAR / AUDITORIA DE MODERAÇÃO
      ========================================================= */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Flag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    Denunciar Atendimento à Moderação
                  </h3>
                  <p className="text-xs text-slate-500">Supervisão de Segurança SALVÔ</p>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Motivo da Denúncia</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 outline-none"
                >
                  <option value="Tentativa de Golpe / Pix Suspeito">
                    Tentativa de Golpe / Pix com titular divergente
                  </option>
                  <option value="Preço divergente do anunciado">
                    Preço ou oferta divergente do anunciado no mapa
                  </option>
                  <option value="Conteúdo inadequado ou ofensivo">
                    Linguagem imprópria ou desrespeito
                  </option>
                  <option value="Spam comercial abusivo">Spam ou mensagens repetitivas</option>
                  <option value="Estabelecimento não existe mais">
                    Estabelecimento encerrado ou endereço incorreto
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Detalhes da Ocorrência (Com opção de apagar com 1 clique)
                </label>
                <ClearableTextarea
                  rows={3}
                  value={reportDetails}
                  onValueChange={setReportDetails}
                  placeholder="Descreva o ocorrido para que os moderadores possam auditar a conversa..."
                  className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A]"
                />
              </div>

              <div className="p-3 bg-slate-100 rounded-2xl text-[11px] text-slate-600">
                🛡️ Sua solicitação será encaminhada para a <strong>Lista de Moderação</strong> com
                resposta garantida em até 8 minutos.
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white font-heading font-black text-xs uppercase tracking-wider rounded-2xl shadow-md"
                >
                  Encaminhar para Moderação
                </button>
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: EMITIR AVISO DE MODERAÇÃO NO CHAT
      ========================================================= */}
      {showModWarningModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    Emitir Aviso Oficial de Moderação
                  </h3>
                  <p className="text-xs text-slate-500">
                    Publica uma tarja administrativa visível a ambas as partes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModWarningModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendModWarning} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Texto do Comunicado de Moderação
                </label>
                <ClearableTextarea
                  rows={3}
                  value={warningMessageText}
                  onValueChange={setWarningMessageText}
                  className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A]"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 h-12 bg-amber-600 hover:bg-amber-700 text-white font-heading font-black text-xs uppercase tracking-wider rounded-2xl shadow-md flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Publicar no Chat</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowModWarningModal(false)}
                  className="px-4 h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
