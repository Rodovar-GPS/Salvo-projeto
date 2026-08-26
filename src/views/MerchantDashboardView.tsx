import React, { useState, useMemo } from 'react';
import {
  Store,
  Offer,
  ChatConversation,
  User,
  StoreFollow,
  StorePartnership,
  StorePartnershipType,
} from '../types';
import { PixPaymentModal } from '../components/PixPaymentModal';
import { ClearableInput, ClearableTextarea } from '../components/ClearableInput';
import {
  parseGoogleMapsUrlOrGps,
  calculateSalvadorMapPercent,
  ParsedGpsLocation,
} from '../utils/salvadorGeoDatabase';
import {
  Store as StoreIcon,
  Sparkles,
  MessageSquare,
  CreditCard,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  Send,
  Eye,
  QrCode,
  Download,
  Share2,
  ExternalLink,
  LocateFixed,
  Navigation,
  Compass,
  Handshake,
  Users,
  Check,
  X,
  ShieldAlert,
  ShieldCheck,
  Building2,
  UserCheck,
  Search,
} from 'lucide-react';

interface MerchantDashboardViewProps {
  store: Store;
  onUpdateStore: (updatedStore: Store) => void;
  conversations: ChatConversation[];
  onSendMessage: (conversationId: string, text: string) => void;
  currentUser: User;
  allStores?: Store[];
  allUsers?: User[];
  storeFollows?: StoreFollow[];
  storePartnerships?: StorePartnership[];
  onProposePartnership?: (
    storeAId: string,
    storeBId: string,
    type: StorePartnershipType,
    title: string,
    description: string
  ) => void;
  onAcceptPartnership?: (partnershipId: string) => void;
  onDeclinePartnership?: (partnershipId: string) => void;
  onEndPartnership?: (partnershipId: string) => void;
  onSelectStore?: (storeId: string) => void;
  onViewUserProfile?: (userId: string) => void;
}

function formatBrazilianDate(dateStr?: string): string {
  if (!dateStr) return '';
  if (dateStr.includes('/')) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export const MerchantDashboardView: React.FC<MerchantDashboardViewProps> = ({
  store,
  onUpdateStore,
  conversations,
  onSendMessage,
  currentUser,
  allStores = [],
  allUsers = [],
  storeFollows = [],
  storePartnerships = [],
  onProposePartnership,
  onAcceptPartnership,
  onDeclinePartnership,
  onEndPartnership,
  onSelectStore,
  onViewUserProfile,
}) => {
  // Tabs: 'my_store' | 'offers' | 'partnerships' | 'messages' | 'subscription'
  const [activeTab, setActiveTab] = useState<
    'my_store' | 'offers' | 'partnerships' | 'messages' | 'subscription'
  >('my_store');

  // Security Check: Authorized merchant or admin
  const isAuthorized =
    currentUser.role === 'admin' ||
    currentUser.storeId === store.id ||
    store.ownerId === currentUser.id;

  // Edit store form state
  const [name, setName] = useState(store.name);
  const [description, setDescription] = useState(store.description);
  const [address, setAddress] = useState(store.address);
  const [whatsapp, setWhatsapp] = useState(store.whatsapp);
  const [isOpenNow, setIsOpenNow] = useState(store.isOpenNow);
  const [mapLink, setMapLink] = useState(store.mapLink || store.googleMapsUrl || '');
  const [streetViewEnabled, setStreetViewEnabled] = useState(store.street_view_enabled !== false);
  const [streetViewHeading, setStreetViewHeading] = useState(store.street_view_heading ?? 45);
  const [streetViewPitch, setStreetViewPitch] = useState(store.street_view_pitch ?? 0);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsDetectedMessage, setGpsDetectedMessage] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Partnership Proposal Modal state
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [proposeTargetStoreId, setProposeTargetStoreId] = useState('');
  const [proposeType, setProposeType] = useState<StorePartnershipType>('cross_promo');
  const [proposeTitle, setProposeTitle] = useState('');
  const [proposeDesc, setProposeDesc] = useState('');
  const [storeSearchQuery, setStoreSearchQuery] = useState('');
  const [partnershipToast, setPartnershipToast] = useState<string | null>(null);

  // Partnership & Follower calculations
  const followersList = storeFollows.filter((f) => f.storeId === store.id);
  const followerUsers = followersList
    .map((f) => ({
      follow: f,
      user: allUsers.find((u) => u.id === f.followerProfileId),
    }))
    .filter((item): item is { follow: StoreFollow; user: User } => !!item.user);

  const activePartnerships = storePartnerships.filter(
    (p) => p.status === 'active' && (p.storeAId === store.id || p.storeBId === store.id)
  );

  const pendingReceived = storePartnerships.filter(
    (p) => p.status === 'proposed' && p.storeBId === store.id
  );

  const pendingSent = storePartnerships.filter(
    (p) => p.status === 'proposed' && p.storeAId === store.id
  );

  // Available stores for partnership (excluding current store)
  const availablePartnerStores = useMemo(() => {
    return allStores
      .filter((s) => s.id !== store.id)
      .filter((s) => {
        if (!storeSearchQuery.trim()) return true;
        const q = storeSearchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.neighborhood.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
        );
      });
  }, [allStores, store.id, storeSearchQuery]);

  // Live parsed location from Google Maps Link / GPS input
  const parsedGpsResult: ParsedGpsLocation = useMemo(() => {
    return parseGoogleMapsUrlOrGps(mapLink, store.neighborhood);
  }, [mapLink, store.neighborhood]);

  // Handle GPS location capture
  const handleCaptureLiveGps = () => {
    if (!navigator.geolocation) {
      setGpsDetectedMessage('⚠️ Geolocalização não suportada no seu navegador.');
      return;
    }
    setIsDetectingGps(true);
    setGpsDetectedMessage('📡 Obtendo coordenadas GPS do dispositivo...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingGps(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMapLink(`https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lng.toFixed(6)}`);
        setGpsDetectedMessage(`✅ GPS detectado: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        setTimeout(() => setGpsDetectedMessage(null), 6000);
      },
      () => {
        setIsDetectingGps(false);
        setGpsDetectedMessage('⚠️ Não foi possível obter o sinal GPS automaticamente.');
        setTimeout(() => setGpsDetectedMessage(null), 6000);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Offers state (100% coupon-free)
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferBadge, setNewOfferBadge] = useState('20% OFF');
  const [newOfferPrice, setNewOfferPrice] = useState('');
  const [newOfferOriginalPrice, setNewOfferOriginalPrice] = useState('');
  const [newOfferDesc, setNewOfferDesc] = useState('');
  const [newOfferExpiry, setNewOfferExpiry] = useState('2026-10-30');

  // Subscription state
  const [subStatus, setSubStatus] = useState<'active' | 'pending' | 'canceled'>(
    store.subscriptionStatus === 'canceled' ? 'canceled' : 'active'
  );
  const [showPixModal, setShowPixModal] = useState(false);

  // Chat in merchant panel
  const merchantConversations = conversations.filter((c) => c.storeId === store.id);
  const [activeChatId, setActiveChatId] = useState(merchantConversations[0]?.id || '');
  const [chatReplyText, setChatReplyText] = useState('');

  const activeChat = merchantConversations.find((c) => c.id === activeChatId) || merchantConversations[0];

  const handleSaveStoreDetails = (e: React.FormEvent) => {
    e.preventDefault();

    const lat = parsedGpsResult.lat;
    const lng = parsedGpsResult.lng;
    const { mapX, mapY } = calculateSalvadorMapPercent(lat, lng);

    const updated: Store = {
      ...store,
      name,
      description,
      address,
      whatsapp,
      isOpenNow,
      mapLink: mapLink.trim() || undefined,
      googleMapsUrl: parsedGpsResult.googleMapsUrl,
      street_view_enabled: streetViewEnabled,
      street_view_heading: Number(streetViewHeading),
      street_view_pitch: Number(streetViewPitch),
      coordinates: {
        lat,
        lng,
        mapX,
        mapY,
      },
    };
    onUpdateStore(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferTitle.trim()) return;

    const discPrice = newOfferPrice ? parseFloat(newOfferPrice.replace(',', '.')) : undefined;
    const origPrice = newOfferOriginalPrice ? parseFloat(newOfferOriginalPrice.replace(',', '.')) : undefined;

    const newOffer: Offer = {
      id: `off-${Date.now()}`,
      storeId: store.id,
      title: newOfferTitle.trim(),
      discountBadge: newOfferBadge.trim(),
      discountPrice: discPrice,
      originalPrice: origPrice,
      priceText: discPrice ? `R$ ${discPrice.toFixed(2).replace('.', ',')}` : newOfferBadge.trim(),
      description: newOfferDesc.trim(),
      expiresAt: newOfferExpiry,
      category: store.category,
      status: 'ACTIVE',
    };

    const updated: Store = {
      ...store,
      offers: [newOffer, ...store.offers],
    };

    onUpdateStore(updated);
    setShowAddOfferModal(false);
    setNewOfferTitle('');
    setNewOfferDesc('');
    setNewOfferPrice('');
    setNewOfferOriginalPrice('');
  };

  const handleDeleteOffer = (offerId: string) => {
    const updated: Store = {
      ...store,
      offers: store.offers.filter((o) => o.id !== offerId),
    };
    onUpdateStore(updated);
  };

  const handleSendMerchantReply = () => {
    if (!chatReplyText.trim() || !activeChat) return;
    onSendMessage(activeChat.id, chatReplyText.trim());
    setChatReplyText('');
  };

  const handleSendProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorized) {
      setPartnershipToast('⚠️ Você não tem permissão para administrar relacionamentos desta loja.');
      return;
    }
    if (!proposeTargetStoreId) {
      setPartnershipToast('Selecione a loja parceira de Salvador.');
      return;
    }
    if (!proposeTitle.trim()) {
      setPartnershipToast('Informe o título da parceria.');
      return;
    }

    onProposePartnership?.(
      store.id,
      proposeTargetStoreId,
      proposeType,
      proposeTitle.trim(),
      proposeDesc.trim()
    );

    setShowProposeModal(false);
    setProposeTargetStoreId('');
    setProposeTitle('');
    setProposeDesc('');
    setPartnershipToast('✅ Proposta de parceria enviada com sucesso ao lojista!');
    setTimeout(() => setPartnershipToast(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Toast Feedback */}
      {partnershipToast && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-[#FFC72C]" />
          <span>{partnershipToast}</span>
        </div>
      )}

      {/* Security Warning if not authorized */}
      {!isAuthorized && (
        <div className="bg-amber-50 border border-amber-300 rounded-3xl p-4 sm:p-5 flex items-start gap-3 text-amber-900 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-sm text-amber-950">Aviso de Permissões de Lojista</h4>
            <p>
              Você está visualizando o painel de <strong>{store.name}</strong> em modo de consulta. Somente o proprietário oficial da loja ou administradores com credenciais validadas podem aprovar novas parcerias comerciais.
            </p>
          </div>
        </div>
      )}

      {/* Top Banner (Bold Typography design theme) */}
      <div className="bg-[#0B4F8A] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={store.logo}
            alt={store.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 bg-white"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-[#FFC72C] text-[#0B4F8A] rounded-md text-[10px] font-black uppercase">
                Painel do Lojista
              </span>
              <span className="text-xs text-sky-200">{store.neighborhood} • Salvador</span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
              {store.name}
            </h1>
            <p className="text-xs text-sky-100 mt-0.5">
              Gerencie dados, ofertas, relacionamentos comerciais com outros lojistas e atendimento.
            </p>
          </div>
        </div>

        {/* Subscription & Quick Stats */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 text-left shrink-0">
            <span className="text-[10px] uppercase font-bold text-sky-200 block">Comunidade</span>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#FFC72C]" />
                {followersList.length} <span className="text-[10px] font-normal text-sky-200">seguidores</span>
              </span>
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <Handshake className="w-3.5 h-3.5 text-emerald-400" />
                {activePartnerships.length} <span className="text-[10px] font-normal text-sky-200">parceiros</span>
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 text-left md:text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-sky-200 block">Plano Salvador</span>
            <p className="text-lg font-heading font-black text-[#FFC72C]">
              R$ 12,00 <span className="text-xs font-normal text-white">/ mês</span>
            </p>
            <span
              className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                subStatus === 'active'
                  ? 'bg-[#2E9E5B] text-white'
                  : 'bg-rose-500 text-white'
              }`}
            >
              {subStatus === 'active' ? '● Assinatura Ativa' : 'Pausada'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation (5 abas: Minha Loja, Ofertas, Parcerias, Mensagens, Assinatura) */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto no-scrollbar gap-1">
        <button
          onClick={() => setActiveTab('my_store')}
          className={`flex-1 min-w-[120px] py-3 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            activeTab === 'my_store'
              ? 'bg-[#0B4F8A] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <StoreIcon className="w-4 h-4" />
          <span>Minha Loja</span>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`flex-1 min-w-[120px] py-3 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            activeTab === 'offers'
              ? 'bg-[#0B4F8A] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#FFC72C]" />
          <span>Ofertas ({store.offers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('partnerships')}
          className={`flex-1 min-w-[150px] py-3 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-2 transition-all relative ${
            activeTab === 'partnerships'
              ? 'bg-[#0B4F8A] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Handshake className="w-4 h-4 text-[#FFC72C]" />
          <span>Parcerias ({activePartnerships.length})</span>
          {pendingReceived.length > 0 && (
            <span className="px-1.5 py-0.2 text-[9px] font-black rounded-full bg-rose-500 text-white animate-pulse">
              {pendingReceived.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`flex-1 min-w-[130px] py-3 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            activeTab === 'messages'
              ? 'bg-[#0B4F8A] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Mensagens ({merchantConversations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subscription')}
          className={`flex-1 min-w-[130px] py-3 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            activeTab === 'subscription'
              ? 'bg-[#0B4F8A] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Assinatura (R$ 12/mês)</span>
        </button>
      </div>

      {/* TAB 1: Minha Loja (Editar Dados) */}
      {activeTab === 'my_store' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading font-bold text-xl text-slate-900">
                Informações do Estabelecimento
              </h2>
              <p className="text-xs text-slate-500">
                Mantenha seus dados atualizados para atrair mais clientes em Salvador.
              </p>
            </div>

            {/* Aberto / Fechado Switch */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700 px-2">Status da Loja:</span>
              <button
                type="button"
                onClick={() => setIsOpenNow(!isOpenNow)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all ${
                  isOpenNow
                    ? 'bg-[#2E9E5B] text-white shadow-sm'
                    : 'bg-slate-300 text-slate-700'
                }`}
              >
                {isOpenNow ? '● Aberto Agora' : 'Fechado'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveStoreDetails} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome da Loja
                </label>
                <ClearableInput
                  value={name}
                  onValueChange={setName}
                  className="h-11 bg-slate-50 border border-slate-200 focus:border-[#0B4F8A] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp para Contato
                </label>
                <ClearableInput
                  value={whatsapp}
                  onValueChange={setWhatsapp}
                  className="h-11 bg-slate-50 border border-slate-200 focus:border-[#0B4F8A] focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Endereço em Salvador
                </label>
                <ClearableInput
                  value={address}
                  onValueChange={setAddress}
                  className="h-11 bg-slate-50 border border-slate-200 focus:border-[#0B4F8A] focus:bg-white"
                />
              </div>

              {/* Localização Exata / Link do Google Maps & GPS da Loja */}
              <div className="sm:col-span-2 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white rounded-2xl p-4 border border-blue-100/80 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#0B4F8A] text-white flex items-center justify-center shadow-xs">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-900 leading-tight">
                        Link do Google Maps / Coordenadas GPS da Loja
                      </label>
                      <span className="text-[11px] text-slate-500">
                        Fixa a localização exata do seu comércio no mapa interativo de Salvador.
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCaptureLiveGps}
                    disabled={isDetectingGps}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-[#0B4F8A] border border-blue-200 text-xs font-bold transition-all shadow-2xs hover:shadow-xs disabled:opacity-50"
                  >
                    <LocateFixed className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin text-amber-500' : ''}`} />
                    {isDetectingGps ? 'Detectando GPS...' : 'Usar meu GPS Atual'}
                  </button>
                </div>

                {gpsDetectedMessage && (
                  <div className="mb-2.5 px-3 py-2 rounded-xl bg-white border border-blue-200 text-xs font-medium text-slate-700 animate-fadeIn">
                    {gpsDetectedMessage}
                  </div>
                )}

                <div className="relative mb-2">
                  <ClearableInput
                    placeholder="Cole aqui o link do Google Maps (ex: https://maps.app.goo.gl/... ou coordenadas -13.0039, -38.5326)"
                    value={mapLink}
                    onValueChange={setMapLink}
                    leftIcon={<Navigation className="w-4 h-4 text-[#0B4F8A]" />}
                    className="h-11 bg-white border border-slate-200 focus:border-[#0B4F8A] text-xs font-mono"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-blue-100/60 text-[11px]">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Compass className="w-3.5 h-3.5 text-[#0B4F8A]" />
                    <span>
                      Posição no mapa: <strong>{parsedGpsResult.formattedDisplay}</strong>
                    </span>
                    {parsedGpsResult.sourceType === 'neighborhood_fallback' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100/80 text-blue-800 font-semibold">
                        Bairro: {store.neighborhood}
                      </span>
                    )}
                    {parsedGpsResult.sourceType !== 'neighborhood_fallback' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                        GPS Personalizado ✅
                      </span>
                    )}
                  </div>

                  {parsedGpsResult.googleMapsUrl && (
                    <a
                      href={parsedGpsResult.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[#0B4F8A] hover:underline font-bold"
                    >
                      Ver no Google Maps <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Street View 360° da Fachada */}
              <div className="sm:col-span-2 bg-gradient-to-br from-amber-50/60 via-orange-50/30 to-white rounded-2xl p-4 border border-amber-200/80 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#0B4F8A] text-[#FFC72C] flex items-center justify-center shadow-xs font-black text-xs">
                      360°
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-900 leading-tight">
                        Experiência Imersiva: Visão da Rua (Google Street View)
                      </label>
                      <span className="text-[11px] text-slate-500">
                        Permita que os clientes explorem a fachada do seu estabelecimento em 360° antes de visitar.
                      </span>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={streetViewEnabled}
                      onChange={(e) => setStreetViewEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0B4F8A]"></div>
                    <span className="ml-2 text-xs font-bold text-slate-700">
                      {streetViewEnabled ? 'Ativo' : 'Desativado'}
                    </span>
                  </label>
                </div>

                {streetViewEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-100">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Ângulo da Fachada (Heading): {streetViewHeading}°</span>
                        <span className="text-[10px] text-slate-400">0° a 360°</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={streetViewHeading}
                        onChange={(e) => setStreetViewHeading(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0B4F8A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Inclinação Vertical (Pitch): {streetViewPitch}°</span>
                        <span className="text-[10px] text-slate-400">-90° a 90°</span>
                      </label>
                      <input
                        type="range"
                        min="-45"
                        max="45"
                        value={streetViewPitch}
                        onChange={(e) => setStreetViewPitch(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0B4F8A]"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descrição / Bio da Vitrine
                </label>
                <ClearableTextarea
                  rows={3}
                  value={description}
                  onValueChange={setDescription}
                  className="bg-slate-50 border border-slate-200 focus:border-[#0B4F8A] focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {saveSuccess ? (
                <span className="text-xs font-bold text-[#2E9E5B] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Dados atualizados com sucesso no SALVÔ!
                </span>
              ) : (
                <span />
              )}

              <button
                type="submit"
                className="px-6 h-12 bg-[#0B4F8A] hover:bg-[#083a66] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all active:scale-98"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: Ofertas (Criar, Editar, Excluir com data de validade) */}
      {activeTab === 'offers' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading font-bold text-xl text-slate-900">
                Minhas Ofertas Ativas
              </h2>
              <p className="text-xs text-slate-500">
                Crie promoções com data de validade. As ofertas aparecem no mapa e na busca da cidade.
              </p>
            </div>

            <button
              onClick={() => setShowAddOfferModal(true)}
              className="px-4 py-2.5 bg-[#E8552B] hover:bg-orange-600 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Nova Oferta</span>
            </button>
          </div>

          {/* Modal / Form Criar Oferta */}
          {showAddOfferModal && (
            <div className="bg-orange-50/70 border border-orange-200 rounded-3xl p-6 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E8552B]" />
                  <span>Cadastrar Nova Promoção</span>
                </h3>
                <button
                  onClick={() => setShowAddOfferModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-xs font-bold"
                >
                  Cancelar ✕
                </button>
              </div>

              <form onSubmit={handleCreateOffer} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Título da Oferta *
                    </label>
                    <ClearableInput
                      required
                      placeholder="Ex: 20% OFF na Casadinha 500ml"
                      value={newOfferTitle}
                      onValueChange={setNewOfferTitle}
                      className="h-11 bg-white border border-slate-200 focus:border-[#0B4F8A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Selo de Destaque (Badge) *
                    </label>
                    <ClearableInput
                      required
                      placeholder="Ex: 20% OFF, COMBO R$ 25, 2 POR 1"
                      value={newOfferBadge}
                      onValueChange={setNewOfferBadge}
                      className="h-11 bg-white border border-slate-200 focus:border-[#0B4F8A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Preço com Desconto (R$)
                    </label>
                    <ClearableInput
                      placeholder="Ex: 22.40"
                      value={newOfferPrice}
                      onValueChange={setNewOfferPrice}
                      className="h-11 bg-white border border-slate-200 focus:border-[#0B4F8A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Preço Original (R$) (Opcional - Riscado)
                    </label>
                    <ClearableInput
                      placeholder="Ex: 28.00"
                      value={newOfferOriginalPrice}
                      onValueChange={setNewOfferOriginalPrice}
                      className="h-11 bg-white border border-slate-200 focus:border-[#0B4F8A]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Data de Validade *
                    </label>
                    <ClearableInput
                      type="date"
                      required
                      value={newOfferExpiry}
                      onValueChange={setNewOfferExpiry}
                      className="h-11 bg-white border border-slate-200 focus:border-[#0B4F8A]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Descrição Detalhada / Regras da Oferta
                    </label>
                    <ClearableTextarea
                      rows={2}
                      placeholder="Descreva o que está incluso na oferta para os clientes..."
                      value={newOfferDesc}
                      onValueChange={setNewOfferDesc}
                      className="bg-white border border-slate-200 focus:border-[#0B4F8A]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddOfferModal(false)}
                    className="px-4 py-2 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#E8552B] hover:bg-orange-600 text-white font-bold text-xs rounded-2xl shadow-md"
                  >
                    Publicar Oferta
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of Offers */}
          <div className="space-y-3">
            {store.offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-[#E8552B] text-white text-[10px] font-black uppercase rounded-md flex items-center gap-1">
                      <span>🔥</span>
                      <span>{offer.discountBadge}</span>
                    </span>
                    <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Válido até {formatBrazilianDate(offer.expiresAt)}
                    </span>
                    {offer.discountPrice && (
                      <span className="font-heading font-black text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(offer.discountPrice)}
                      </span>
                    )}
                  </div>
                  <h4 className="font-heading font-bold text-base text-slate-900">
                    {offer.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{offer.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDeleteOffer(offer.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    title="Excluir oferta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Parcerias Comerciais & Seguidores (NOVO - ETAPA SOCIAL 4) */}
      {activeTab === 'partnerships' && (
        <div className="space-y-6">
          {/* Header & Quick Action */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-sky-100 text-[#0B4F8A] rounded-md text-[10px] font-black uppercase">
                  B2B Salvador
                </span>
                <span className="text-xs text-slate-400 font-medium">Rede Colaborativa Local</span>
              </div>
              <h3 className="font-heading font-black text-xl text-slate-900">
                Parcerias Comerciais e Seguidores
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Conecte seu estabelecimento com outras lojas de Salvador para ações conjuntas e acompanhe sua base de seguidores.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (!isAuthorized) {
                    setPartnershipToast('⚠️ Apenas o lojista titular pode criar parcerias.');
                    return;
                  }
                  setShowProposeModal(true);
                }}
                className="px-5 py-2.5 bg-[#0B4F8A] hover:bg-sky-900 text-white font-heading font-bold text-xs rounded-2xl shadow-md flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4 text-[#FFC72C]" />
                <span>Solicitar Nova Parceria</span>
              </button>
            </div>
          </div>

          {/* Metrics summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                <Handshake className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block">Parceiros Oficiais</span>
                <span className="font-heading font-black text-2xl text-slate-900">
                  {activePartnerships.length}
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block">Solicitações Pendentes</span>
                <span className="font-heading font-black text-2xl text-slate-900">
                  {pendingReceived.length}
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0B4F8A] flex items-center justify-center font-black">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block">Clientes Seguidores</span>
                <span className="font-heading font-black text-2xl text-slate-900">
                  {followersList.length}
                </span>
              </div>
            </div>
          </div>

          {/* Pending Received Partnerships Section */}
          {pendingReceived.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                  <h4 className="font-heading font-black text-sm text-amber-950">
                    Solicitações de Parceria Recebidas ({pendingReceived.length})
                  </h4>
                </div>
                <span className="text-[11px] font-bold text-amber-700">Aguardando sua aprovação</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingReceived.map((req) => {
                  const proposingStore = allStores.find((s) => s.id === req.storeAId);
                  return (
                    <div
                      key={req.id}
                      className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={proposingStore?.logo || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120'}
                          alt={proposingStore?.name || 'Loja'}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-heading font-bold text-sm text-slate-900">
                              {proposingStore?.name || 'Loja Solicitante'}
                            </h5>
                            <span className="px-2 py-0.5 bg-blue-50 text-[#0B4F8A] text-[10px] font-bold rounded-md">
                              {proposingStore?.neighborhood}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-[#0B4F8A] mt-1">
                            {req.title}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                            {req.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            if (!isAuthorized) {
                              setPartnershipToast('⚠️ Você não tem permissão para gerenciar esta loja.');
                              return;
                            }
                            onDeclinePartnership?.(req.id);
                            setPartnershipToast('Proposta de parceria recusada.');
                            setTimeout(() => setPartnershipToast(null), 3000);
                          }}
                          className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5 text-rose-500" />
                          <span>Recusar</span>
                        </button>

                        <button
                          onClick={() => {
                            if (!isAuthorized) {
                              setPartnershipToast('⚠️ Você não tem permissão para gerenciar esta loja.');
                              return;
                            }
                            onAcceptPartnership?.(req.id);
                            setPartnershipToast('🎉 Parceria comercial aprovada com sucesso!');
                            setTimeout(() => setPartnershipToast(null), 4000);
                          }}
                          className="px-4 py-1.5 rounded-xl bg-[#2E9E5B] hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Aceitar Parceria</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pending Sent Proposals */}
          {pendingSent.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-3">
              <h4 className="font-heading font-bold text-xs text-slate-700 uppercase tracking-wider">
                Propostas Enviadas por Você ({pendingSent.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {pendingSent.map((req) => {
                  const targetStore = allStores.find((s) => s.id === req.storeBId);
                  return (
                    <div
                      key={req.id}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs flex items-center gap-3"
                    >
                      <img
                        src={targetStore?.logo || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120'}
                        alt={targetStore?.name || 'Loja'}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-heading font-bold text-xs text-slate-900 truncate">
                          {targetStore?.name}
                        </h5>
                        <p className="text-[11px] text-slate-500 truncate">{req.title}</p>
                        <span className="inline-block mt-0.5 px-2 py-0.2 bg-amber-50 text-amber-700 text-[9px] font-black uppercase rounded">
                          Aguardando resposta
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Partners List */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-heading font-black text-base text-slate-900 flex items-center gap-2">
                  <Handshake className="w-5 h-5 text-emerald-600" />
                  Lojas Parceiras Oficiais ({activePartnerships.length})
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Estabelecimentos com vínculo ativo no SALVÔ para ações promocionais cruzadas.
                </p>
              </div>
            </div>

            {activePartnerships.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h5 className="font-heading font-bold text-sm text-slate-700">
                  Nenhuma parceria ativa no momento
                </h5>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
                  Fortaleça seu comércio convidando outras lojas parceiras de Salvador para trocar indicações e ofertas.
                </p>
                <button
                  onClick={() => {
                    if (!isAuthorized) {
                      setPartnershipToast('⚠️ Apenas o lojista titular pode criar parcerias.');
                      return;
                    }
                    setShowProposeModal(true);
                  }}
                  className="px-4 py-2 bg-[#0B4F8A] text-white rounded-xl text-xs font-bold hover:bg-sky-900 transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-[#FFC72C]" />
                  <span>Procurar Lojas de Salvador</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activePartnerships.map((partnership) => {
                  const isStoreA = partnership.storeAId === store.id;
                  const otherStoreId = isStoreA ? partnership.storeBId : partnership.storeAId;
                  const partnerStore = allStores.find((s) => s.id === otherStoreId);

                  return (
                    <div
                      key={partnership.id}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between gap-3 bg-gradient-to-br from-white to-slate-50/50"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={partnerStore?.logo || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120'}
                          alt={partnerStore?.name || 'Parceiro'}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-heading font-bold text-sm text-slate-900">
                              {partnerStore?.name || 'Loja Parceira'}
                            </h5>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-md flex items-center gap-1">
                              <Check className="w-3 h-3" /> PARCEIRO
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {partnerStore?.neighborhood} • {partnerStore?.category}
                          </p>
                          <div className="mt-2 bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                            <span className="font-bold text-[#0B4F8A] block">
                              {partnership.title}
                            </span>
                            <p className="text-slate-600 text-[11px] mt-0.5">
                              {partnership.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="text-[10px] text-slate-400 font-medium">
                          Desde {new Date(partnership.createdAt).toLocaleDateString('pt-BR')}
                        </span>

                        <div className="flex items-center gap-2">
                          {partnerStore && onSelectStore && (
                            <button
                              onClick={() => onSelectStore(partnerStore.id)}
                              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Ver Perfil</span>
                            </button>
                          )}

                          {isAuthorized && onEndPartnership && (
                            <button
                              onClick={() => {
                                if (window.confirm('Deseja encerrar esta parceria comercial?')) {
                                  onEndPartnership(partnership.id);
                                  setPartnershipToast('Parceria comercial encerrada.');
                                  setTimeout(() => setPartnershipToast(null), 3000);
                                }
                              }}
                              className="px-2.5 py-1 text-rose-500 hover:bg-rose-50 rounded-lg text-xs font-bold"
                              title="Encerrar parceria"
                            >
                              Encerrar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Followers List Section */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-heading font-black text-base text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#0B4F8A]" />
                  Clientes que Seguem sua Loja ({followerUsers.length})
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Consumidores soteropolitanos que recebem novidades e ofertas do seu estabelecimento no SALVÔ.
                </p>
              </div>
            </div>

            {followerUsers.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h5 className="font-heading font-bold text-sm text-slate-700">
                  Nenhum seguidor registrado ainda
                </h5>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  Divulgue o link da sua loja ou o QR Code SALVÔ para seus clientes no balcão e no WhatsApp.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {followerUsers.map(({ follow, user }) => (
                  <div
                    key={follow.id}
                    className="p-3.5 bg-slate-50 hover:bg-blue-50/50 rounded-2xl border border-slate-200 flex items-center gap-3 transition-all"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={user.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-heading font-bold text-xs text-slate-900 truncate">
                        {user.name}
                      </h5>
                      <span className="text-[11px] text-slate-400 block truncate">
                        @{user.username || 'cliente'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium truncate block">
                        {user.neighborhood || 'Salvador'}
                      </span>
                    </div>
                    {onViewUserProfile && (
                      <button
                        onClick={() => onViewUserProfile(user.id)}
                        className="p-1.5 text-slate-400 hover:text-[#0B4F8A] hover:bg-white rounded-lg transition-all"
                        title="Ver perfil do cliente"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Mensagens (Atendimento com Clientes) */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-[560px]">
          {/* Conversation List */}
          <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50">
            <div className="p-4 border-b border-slate-200 bg-white">
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Atendimento aos Clientes
              </h3>
              <span className="text-[11px] text-slate-400">
                {merchantConversations.length} conversas com clientes
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {merchantConversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setActiveChatId(c.id)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-all ${
                    activeChat?.id === c.id
                      ? 'bg-blue-50 border-l-4 border-[#0B4F8A]'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <img
                    src={c.clientAvatar}
                    alt={c.clientName}
                    className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="font-heading font-bold text-xs text-slate-900 truncate">
                        {c.clientName}
                      </h4>
                      <span className="text-[10px] text-slate-400">{c.lastMessageTime}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{c.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Chat Conversation */}
          {activeChat ? (
            <div className="flex-1 flex flex-col bg-white">
              <div className="p-4 border-b border-slate-200 flex items-center gap-3">
                <img
                  src={activeChat.clientAvatar}
                  alt={activeChat.clientName}
                  className="w-9 h-9 rounded-xl object-cover border"
                />
                <div>
                  <h4 className="font-heading font-bold text-xs text-slate-900">
                    {activeChat.clientName}
                  </h4>
                  <span className="text-[10px] text-slate-400">Cliente de Salvador</span>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAFC]">
                {activeChat.messages.map((m) => {
                  const isStore = m.senderRole === 'merchant';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isStore ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`p-3 rounded-2xl max-w-[80%] text-xs ${
                          isStore
                            ? 'bg-[#0B4F8A] text-white rounded-br-xs'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                        }`}
                      >
                        <p>{m.text}</p>
                        <span
                          className={`text-[9px] block text-right mt-1 ${
                            isStore ? 'text-sky-200' : 'text-slate-400'
                          }`}
                        >
                          {m.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 border-t border-slate-200 flex items-center gap-2">
                <div className="flex-1">
                  <ClearableInput
                    placeholder="Responder ao cliente..."
                    value={chatReplyText}
                    onValueChange={setChatReplyText}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMerchantReply();
                    }}
                    className="h-10 bg-slate-50 border border-slate-200 focus:border-[#0B4F8A]"
                  />
                </div>
                <button
                  onClick={handleSendMerchantReply}
                  className="px-4 h-10 bg-[#0B4F8A] hover:bg-[#083a66] text-white font-bold text-xs rounded-xl flex items-center gap-1 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Responder</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-slate-400 text-xs">
              Nenhuma mensagem selecionada.
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Assinatura (Status do Plano R$ 12,00 / mês) */}
      {activeTab === 'subscription' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 bg-blue-100 text-[#0B4F8A] rounded-md text-[10px] font-black uppercase">
                Faturamento da Loja
              </span>
              <h2 className="font-heading font-black text-2xl text-slate-900 mt-1">
                Plano Lojista Salvador
              </h2>
              <p className="text-xs text-slate-500">
                Divulgação contínua no mapa, criação de ofertas ilimitadas e chat direto.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowPixModal(true)}
                className="px-4 py-2.5 bg-[#2E9E5B] hover:bg-emerald-600 text-white rounded-2xl text-xs font-heading font-black shadow-md flex items-center gap-2 transition-all active:scale-95"
              >
                <QrCode className="w-4 h-4" />
                <span>Pagar / Renovar via PIX (R$ 12,00)</span>
              </button>

              <button
                onClick={() => setSubStatus(subStatus === 'active' ? 'canceled' : 'active')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                  subStatus === 'active'
                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                    : 'bg-[#0B4F8A] text-white hover:bg-[#083a66]'
                }`}
              >
                {subStatus === 'active' ? 'Pausar Assinatura' : 'Reativar Plano R$ 12/mês'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Status Atual
              </span>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                  subStatus === 'active'
                    ? 'bg-green-100 text-[#2E9E5B]'
                    : 'bg-rose-100 text-rose-600'
                }`}
              >
                {subStatus === 'active' ? 'Ativa (Simulado)' : 'Cancelada'}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Valor Mensal
              </span>
              <p className="text-2xl font-heading font-black text-[#0B4F8A]">
                R$ 12,00 <span className="text-xs font-normal text-slate-500">/ mês</span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Próxima Renovação
              </span>
              <p className="text-base font-bold text-slate-800">
                {subStatus === 'active' ? store.subscriptionPlan.nextBillingDate : '—'}
              </p>
            </div>
          </div>

          {/* Counter Plaque Section */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="px-2.5 py-0.5 bg-[#0B4F8A] text-white rounded-md text-[10px] font-black uppercase">
                Material de Ponto de Venda
              </span>
              <h3 className="font-heading font-black text-xl text-slate-900">
                Placa de Balcão com QR Code Oficial
              </h3>
              <p className="text-xs text-slate-600 max-w-lg">
                Coloque o QR Code oficial da sua loja no balcão do seu comércio em Salvador para que clientes vejam suas ofertas do dia e avaliem seu atendimento.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md text-center shrink-0">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://guiasalvador.ba/loja/${store.slug}`}
                alt="QR Code Loja"
                className="w-28 h-28 mx-auto rounded-lg"
              />
              <span className="text-[10px] font-bold text-slate-500 block mt-2">
                guiasalvador.ba/loja/{store.slug}
              </span>
            </div>
          </div>

          {/* Histórico Simulado de Faturas */}
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-900 mb-3">
              Histórico Simulado de Pagamentos
            </h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
              <div className="p-3 bg-slate-50 flex justify-between font-bold text-slate-500 uppercase text-[10px]">
                <span>Data</span>
                <span>Descrição</span>
                <span>Valor</span>
                <span>Status</span>
              </div>
              <div className="p-3.5 flex justify-between items-center bg-white">
                <span className="font-medium text-slate-600">15/08/2026</span>
                <span className="font-semibold text-slate-800">Mensalidade SALVÔ</span>
                <span className="font-bold text-[#0B4F8A]">R$ 12,00</span>
                <span className="px-2 py-0.5 bg-green-100 text-[#2E9E5B] rounded text-[10px] font-bold">
                  Pago (Simulado)
                </span>
              </div>
              <div className="p-3.5 flex justify-between items-center bg-white">
                <span className="font-medium text-slate-600">15/07/2026</span>
                <span className="font-semibold text-slate-800">Mensalidade SALVÔ</span>
                <span className="font-bold text-[#0B4F8A]">R$ 12,00</span>
                <span className="px-2 py-0.5 bg-green-100 text-[#2E9E5B] rounded text-[10px] font-bold">
                  Pago (Simulado)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partnership Proposal Modal */}
      {showProposeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-0.5 bg-[#FFC72C] text-[#0B4F8A] rounded-md text-[10px] font-black uppercase">
                  Parcerias B2B Salvador
                </span>
                <h3 className="font-heading font-black text-xl text-slate-900 mt-1">
                  Solicitar Parceria Comercial
                </h3>
                <p className="text-xs text-slate-500">
                  Proponha uma ação colaborativa com outro estabelecimento de Salvador.
                </p>
              </div>
              <button
                onClick={() => setShowProposeModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendProposalSubmit} className="space-y-4">
              {/* Select Partner Store */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Escolha o Estabelecimento Parceiro em Salvador *
                </label>
                <div className="relative mb-2">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filtrar por nome, bairro ou categoria..."
                    value={storeSearchQuery}
                    onChange={(e) => setStoreSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#0B4F8A] outline-none"
                  />
                </div>

                <div className="max-h-44 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
                  {availablePartnerStores.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      Nenhuma outra loja encontrada com esse termo.
                    </div>
                  ) : (
                    availablePartnerStores.map((s) => {
                      const isSelected = proposeTargetStoreId === s.id;
                      return (
                        <div
                          key={s.id}
                          onClick={() => setProposeTargetStoreId(s.id)}
                          className={`p-2.5 flex items-center gap-3 cursor-pointer transition-all ${
                            isSelected ? 'bg-blue-50/80 border-l-4 border-[#0B4F8A]' : 'hover:bg-slate-50'
                          }`}
                        >
                          <img
                            src={s.logo}
                            alt={s.name}
                            className="w-9 h-9 rounded-lg object-cover border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-heading font-bold text-xs text-slate-900 truncate">
                              {s.name}
                            </h5>
                            <span className="text-[10px] text-slate-500">
                              {s.neighborhood} • {s.category}
                            </span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#0B4F8A]" />}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Partnership Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tipo de Ação / Parceria *
                </label>
                <select
                  value={proposeType}
                  onChange={(e) => setProposeType(e.target.value as StorePartnershipType)}
                  className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:border-[#0B4F8A] outline-none"
                >
                  <option value="cross_promo">Divulgação Cruzada (Cross-Promoção)</option>
                  <option value="shared_discount">Desconto Compartilhado para Clientes</option>
                  <option value="collective_event">Ação ou Evento Conjunto em Salvador</option>
                  <option value="combo_service">Combo de Serviços Integrados</option>
                  <option value="supplier">Fornecedor / Insumo Local</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título da Parceria *
                </label>
                <ClearableInput
                  required
                  placeholder="Ex: 10% de desconto cruzado para clientes mútuos"
                  value={proposeTitle}
                  onValueChange={setProposeTitle}
                  className="h-11 bg-white border border-slate-200 focus:border-[#0B4F8A]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Como funcionará a parceria para ambos os lojistas?
                </label>
                <ClearableTextarea
                  rows={3}
                  placeholder="Explique os benefícios mútuos, como validação no balcão, posts conjuntos, etc..."
                  value={proposeDesc}
                  onValueChange={setProposeDesc}
                  className="bg-white border border-slate-200 focus:border-[#0B4F8A]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProposeModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!proposeTargetStoreId || !proposeTitle.trim()}
                  className="px-6 py-2.5 bg-[#0B4F8A] hover:bg-sky-900 disabled:opacity-50 text-white font-heading font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
                >
                  <Handshake className="w-4 h-4 text-[#FFC72C]" />
                  <span>Enviar Solicitação de Parceria</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PIX Payment Modal */}
      <PixPaymentModal
        isOpen={showPixModal}
        onClose={() => setShowPixModal(false)}
        store={store}
        onPaymentConfirmed={() => {
          setSubStatus('active');
          const updated: Store = {
            ...store,
            subscriptionStatus: 'active',
          };
          onUpdateStore(updated);
        }}
      />
    </div>
  );
};
