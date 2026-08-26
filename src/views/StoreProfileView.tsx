import React, { useState } from 'react';
import { Store, User, Review, StoreFollow, StorePartnership, StorePartnershipType } from '../types';
import { ClearableInput, ClearableTextarea } from '../components/ClearableInput';
import {
  ArrowLeft,
  Heart,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Navigation,
  Sparkles,
  Share2,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Calendar,
  Send,
  Eye,
  Flame,
  Users,
  Handshake,
  Check,
  Plus,
  UserCheck,
  ShieldCheck,
  X,
  Building2,
} from 'lucide-react';

interface StoreProfileViewProps {
  store: Store;
  currentUser: User;
  isFavorite: boolean;
  onToggleFavorite: (storeId: string) => void;
  onBack: () => void;
  onOpenChat: (store: Store) => void;
  onOpenStreetView?: (store: Store) => void;
  onAddReview: (storeId: string, review: Review) => void;
  allStores?: Store[];
  allUsers?: User[];
  storeFollows?: StoreFollow[];
  storePartnerships?: StorePartnership[];
  onToggleFollowStore?: (storeId: string) => void;
  onProposePartnership?: (
    storeAId: string,
    storeBId: string,
    type: StorePartnershipType,
    title: string,
    description: string
  ) => void;
  onAcceptPartnership?: (partnershipId: string) => void;
  onDeclinePartnership?: (partnershipId: string) => void;
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

export const StoreProfileView: React.FC<StoreProfileViewProps> = ({
  store,
  currentUser,
  isFavorite,
  onToggleFavorite,
  onBack,
  onOpenChat,
  onOpenStreetView,
  onAddReview,
  allStores = [],
  allUsers = [],
  storeFollows = [],
  storePartnerships = [],
  onToggleFollowStore,
  onProposePartnership,
  onAcceptPartnership,
  onDeclinePartnership,
  onSelectStore,
  onViewUserProfile,
}) => {
  const [shareToast, setShareToast] = useState(false);
  const [partnershipToast, setPartnershipToast] = useState<string | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [routeMode, setRouteMode] = useState<'car' | 'transit' | 'walk'>('car');

  // Modals for Social Relationships
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showPartnersModal, setShowPartnersModal] = useState(false);
  const [showProposeModal, setShowProposeModal] = useState(false);

  // Proposal Form state
  const [propType, setPropType] = useState<StorePartnershipType>('cross_promo');
  const [propTitle, setPropTitle] = useState('');
  const [propDescription, setPropDescription] = useState('');

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const photos = [store.coverImage, ...(store.galleryImages || [])].filter(Boolean);

  // Social calculations
  const isFollowing = storeFollows.some(
    (f) => f.followerProfileId === currentUser.id && f.storeId === store.id
  );

  const followersList = storeFollows.filter((f) => f.storeId === store.id);
  const followerUsers = followersList
    .map((f) => ({
      follow: f,
      user: allUsers.find((u) => u.id === f.followerProfileId),
    }))
    .filter((item): item is { follow: StoreFollow; user: User } => !!item.user);

  // Active partnerships for this store
  const activePartnerships = storePartnerships.filter(
    (p) => p.status === 'active' && (p.storeAId === store.id || p.storeBId === store.id)
  );

  // Partner stores objects
  const partnerStores = allStores.filter((s) =>
    activePartnerships.some(
      (p) =>
        (p.storeAId === s.id && p.storeBId === store.id) ||
        (p.storeBId === s.id && p.storeAId === store.id)
    )
  );

  // Check if current logged-in user is a merchant representing another store
  const userMerchantStore = allStores.find(
    (s) => s.id === currentUser.storeId || s.ownerId === currentUser.id
  );
  const isMyOwnStore =
    userMerchantStore?.id === store.id || store.ownerId === currentUser.id;

  // Check relationship between current merchant store and viewed store
  const existingPartnershipWithUser = userMerchantStore
    ? storePartnerships.find(
        (p) =>
          (p.storeAId === userMerchantStore.id && p.storeBId === store.id) ||
          (p.storeAId === store.id && p.storeBId === userMerchantStore.id)
      )
    : null;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating: newRating,
      comment: newComment.trim(),
      date: 'Agora mesmo',
    };

    onAddReview(store.id, newRev);
    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: store.name,
          text: `Conheça ${store.name} no SALVÔ!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    }
  };

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMerchantStore) return;
    if (!propTitle.trim()) return;

    onProposePartnership?.(
      userMerchantStore.id,
      store.id,
      propType,
      propTitle.trim(),
      propDescription.trim() ||
        `Parceria comercial proposta por ${userMerchantStore.name} para ${store.name}.`
    );

    setShowProposeModal(false);
    setPropTitle('');
    setPropDescription('');
    setPartnershipToast(`Solicitação de parceria enviada para ${store.name}!`);
    setTimeout(() => setPartnershipToast(null), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative">
      {/* Floating Share Toast Notification */}
      {shareToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#0B4F8A] text-white px-4 py-3 rounded-2xl shadow-xl border border-white/20 flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#FFC72C]" />
          <span className="text-xs font-bold">Link da loja copiado com sucesso!</span>
        </div>
      )}

      {/* Floating Partnership Toast Notification */}
      {partnershipToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#2E9E5B] text-white px-4 py-3 rounded-2xl shadow-xl border border-white/20 flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Handshake className="w-4 h-4 text-[#FFC72C]" />
          <span className="text-xs font-bold">{partnershipToast}</span>
        </div>
      )}

      {/* Top Nav Back & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl border border-slate-200 text-xs font-bold shadow-2xs transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Mapa</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-2xl border border-slate-200 shadow-2xs transition-all"
            title="Compartilhar Loja"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToggleFavorite(store.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold shadow-2xs transition-all active:scale-95 ${
              isFavorite
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200 text-slate-700 hover:text-rose-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isFavorite ? 'Salvo nos Favoritos' : 'Favoritar'}</span>
          </button>
        </div>
      </div>

      {/* Main Cover & Gallery Header */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Large Cover Photo */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full bg-slate-900">
          <img
            src={photos[selectedPhotoIndex] || store.coverImage}
            alt={store.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          {/* Open/Closed Badge on Top */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-md ${
                store.isOpenNow
                  ? 'bg-[#2E9E5B] text-white'
                  : 'bg-slate-800 text-white/90'
              }`}
            >
              {store.isOpenNow ? '● Aberto Agora' : 'Fechado no Momento'}
            </span>

            <span className="px-3 py-1 rounded-xl bg-black/50 backdrop-blur-md text-white text-xs font-bold">
              {store.category}
            </span>
          </div>

          {/* Bottom Title & Neighborhood on Cover */}
          <div className="absolute bottom-4 left-4 right-4 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#FFC72C] mb-1">
                <MapPin className="w-4 h-4 fill-current" />
                <span>{store.neighborhood} • Salvador, BA</span>
              </div>
              <h1 className="font-heading font-black text-2xl sm:text-4xl leading-tight">
                {store.name}
              </h1>
            </div>

            {/* Action Buttons in Hero */}
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              {onOpenStreetView && (
                <button
                  onClick={() => onOpenStreetView(store)}
                  className="px-3.5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all backdrop-blur-md"
                >
                  <Eye className="w-4 h-4" />
                  <span>Visão da Rua 360°</span>
                </button>
              )}

              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <div>
                  <span className="text-sm font-black text-white">{store.rating.toFixed(1)}</span>
                  <span className="text-[11px] text-white/70 ml-1 font-medium">
                    ({store.reviewCount} avaliações)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector */}
        {photos.length > 1 && (
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
            {photos.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPhotoIndex(idx)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                  selectedPhotoIndex === idx
                    ? 'border-[#0B4F8A] ring-2 ring-[#0B4F8A]/30 scale-105'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ================================================== */}
      {/* SOCIAL RELATIONSHIPS & COMMUNITY STATS BAR */}
      {/* ================================================== */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Metric Counters (Seguidores, Seguindo, Parceiros) */}
        <div className="flex items-center gap-6 sm:gap-8 divide-x divide-slate-100">
          <button
            onClick={() => setShowFollowersModal(true)}
            className="text-left group transition-all"
          >
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-0.5">
              <Users className="w-3.5 h-3.5 text-[#0B4F8A]" />
              <span>Seguidores</span>
            </div>
            <p className="text-lg sm:text-xl font-heading font-black text-slate-900 group-hover:text-[#0B4F8A] transition-colors">
              {followersList.length}
            </p>
          </button>

          <div className="pl-6 sm:pl-8 text-left">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-0.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Seguindo</span>
            </div>
            <p className="text-lg sm:text-xl font-heading font-black text-slate-900">
              {Math.max(activePartnerships.length, 1)}
            </p>
          </div>

          <button
            onClick={() => setShowPartnersModal(true)}
            className="pl-6 sm:pl-8 text-left group transition-all"
          >
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-0.5">
              <Handshake className="w-3.5 h-3.5 text-[#E8552B]" />
              <span>Parceiros</span>
            </div>
            <div className="flex items-center gap-1.5">
              <p className="text-lg sm:text-xl font-heading font-black text-[#0B4F8A] group-hover:text-[#E8552B] transition-colors">
                {activePartnerships.length}
              </p>
              {activePartnerships.length > 0 && (
                <span className="px-2 py-0.5 bg-[#FFC72C]/20 border border-amber-300 text-[#0B4F8A] text-[10px] font-black rounded-lg uppercase">
                  🤝 PARCEIROS
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Action Controls: Follow / Partnership Request */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
          {/* Client -> Store Follow Button */}
          {onToggleFollowStore && (
            <button
              onClick={() => onToggleFollowStore(store.id)}
              className={`h-11 px-5 rounded-2xl font-heading font-bold text-xs flex items-center gap-2 transition-all shadow-2xs active:scale-95 ${
                isFollowing
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300'
                  : 'bg-[#0B4F8A] hover:bg-[#083a66] text-white'
              }`}
            >
              {isFollowing ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Seguindo</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-[#FFC72C]" />
                  <span>Seguir Loja</span>
                </>
              )}
            </button>
          )}

          {/* Merchant -> Store Partnership Button (Only for other registered merchants) */}
          {currentUser.role === 'merchant' && userMerchantStore && !isMyOwnStore && (
            <>
              {existingPartnershipWithUser?.status === 'active' ? (
                <div className="h-11 px-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-2xs">
                  <Handshake className="w-4 h-4 text-emerald-600" />
                  <span>🤝 PARCEIROS</span>
                </div>
              ) : existingPartnershipWithUser?.status === 'proposed' ? (
                existingPartnershipWithUser.storeAId === userMerchantStore.id ? (
                  <div className="h-11 px-4 bg-amber-50 border border-amber-300 text-amber-800 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-2xs">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>⏳ Parceria Solicitada</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onAcceptPartnership?.(existingPartnershipWithUser.id)}
                    className="h-11 px-4 bg-[#FFC72C] hover:bg-amber-400 text-[#0B4F8A] rounded-2xl flex items-center gap-2 text-xs font-black shadow-2xs active:scale-95 transition-all"
                  >
                    <Handshake className="w-4 h-4" />
                    <span>Aceitar Proposta de Parceria</span>
                  </button>
                )
              ) : (
                <button
                  onClick={() => setShowProposeModal(true)}
                  className="h-11 px-4 bg-gradient-to-r from-orange-500 to-[#E8552B] hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl flex items-center gap-2 text-xs font-black shadow-sm active:scale-95 transition-all"
                >
                  <Handshake className="w-4 h-4 text-[#FFC72C]" />
                  <span>Solicitar Parceria 🤝</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Info Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Description, Active Offers, Commercial Partners, Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h2 className="font-heading font-bold text-lg text-slate-900">
              Sobre a Loja
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {store.description}
            </p>

            {/* Amenities Badges */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">
                Comodidades & Estrutura
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  📶 Wi-Fi Grátis
                </span>
                <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  🐾 Pet Friendly
                </span>
                <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  ❄️ Ar Condicionado
                </span>
                <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  ⚡ Aceita PIX
                </span>
                <span className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-[#0B4F8A] flex items-center gap-1.5">
                  💳 Cartões de Crédito/Débito
                </span>
              </div>
            </div>
          </div>

          {/* ================================================== */}
          {/* COMMERCIAL PARTNERS SECTION (PARCERIAS ENTRE LOJAS) */}
          {/* ================================================== */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#E8552B] flex items-center justify-center border border-orange-100">
                  <Handshake className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-lg text-slate-900">
                    Rede de Parceiros Comerciais
                  </h2>
                  <p className="text-xs text-slate-500">
                    Negócios e estabelecimentos conveniados em Salvador
                  </p>
                </div>
              </div>

              {activePartnerships.length > 0 && (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black rounded-full uppercase flex items-center gap-1">
                  <span>🤝</span>
                  <span>{activePartnerships.length} Ativo(s)</span>
                </span>
              )}
            </div>

            {partnerStores.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {partnerStores.map((partner) => {
                  const partnershipInfo = activePartnerships.find(
                    (p) =>
                      (p.storeAId === partner.id && p.storeBId === store.id) ||
                      (p.storeBId === partner.id && p.storeAId === store.id)
                  );

                  return (
                    <div
                      key={partner.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3 hover:border-[#0B4F8A] hover:bg-blue-50/20 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={partner.logo || partner.coverImage}
                          alt={partner.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[9px] font-black uppercase">
                              🤝 PARCEIROS
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold">
                              {partner.neighborhood}
                            </span>
                          </div>
                          <h4 className="font-heading font-bold text-sm text-slate-900 group-hover:text-[#0B4F8A] transition-colors truncate">
                            {partner.name}
                          </h4>
                          <p className="text-xs text-slate-500 truncate">
                            {partner.category}
                          </p>
                        </div>
                      </div>

                      {partnershipInfo?.description && (
                        <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100 line-clamp-2">
                          {partnershipInfo.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {store.name} 🤝 {partner.name}
                        </span>
                        {onSelectStore && (
                          <button
                            onClick={() => onSelectStore(partner.id)}
                            className="px-3 py-1 bg-white hover:bg-[#0B4F8A] hover:text-white text-[#0B4F8A] font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-all"
                          >
                            Ver Loja
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
                <Handshake className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="font-heading font-bold text-sm text-slate-700">
                  Nenhuma parceria ativa no momento
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Lojistas de Salvador podem solicitar parcerias para criar ações colaborativas e fortalecer a comunidade comercial da cidade.
                </p>
                {currentUser.role === 'merchant' && userMerchantStore && !isMyOwnStore && (
                  <button
                    onClick={() => setShowProposeModal(true)}
                    className="mt-2 px-4 py-2 bg-[#0B4F8A] hover:bg-[#083a66] text-white font-bold text-xs rounded-xl shadow-2xs transition-all"
                  >
                    Propor Primeira Parceria 🤝
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Highlights & Catalog Section */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading font-bold text-lg text-slate-900">
                  Destaques do Cardápio & Catálogo
                </h2>
                <p className="text-xs text-slate-500">
                  Principais produtos e serviços oferecidos
                </p>
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                Preços em R$
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2 hover:border-[#0B4F8A] transition-all">
                <div>
                  <span className="px-2 py-0.5 bg-[#0B4F8A]/10 text-[#0B4F8A] rounded-md text-[9px] font-black uppercase">
                    Mais Pedido
                  </span>
                  <h4 className="font-heading font-bold text-sm text-slate-900 mt-1">
                    Especialidade da Casa
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Preparado com ingredientes e produtos selecionados de Salvador.
                  </p>
                  <p className="text-sm font-heading font-black text-[#2E9E5B] mt-2">
                    A partir de R$ 28,00
                  </p>
                </div>
                <button
                  onClick={() => onOpenChat(store)}
                  className="px-3 py-1.5 bg-white hover:bg-[#0B4F8A] hover:text-white text-[#0B4F8A] font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-all shrink-0 mt-1"
                >
                  Consultar
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2 hover:border-[#0B4F8A] transition-all">
                <div>
                  <span className="px-2 py-0.5 bg-[#FFC72C]/20 text-[#0B4F8A] rounded-md text-[9px] font-black uppercase">
                    Destaque Salvador
                  </span>
                  <h4 className="font-heading font-bold text-sm text-slate-900 mt-1">
                    Opção Tradicional Baiana
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tradição e qualidade reconhecida no bairro de {store.neighborhood}.
                  </p>
                  <p className="text-sm font-heading font-black text-[#2E9E5B] mt-2">
                    A partir de R$ 45,00
                  </p>
                </div>
                <button
                  onClick={() => onOpenChat(store)}
                  className="px-3 py-1.5 bg-white hover:bg-[#0B4F8A] hover:text-white text-[#0B4F8A] font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-all shrink-0 mt-1"
                >
                  Consultar
                </button>
              </div>
            </div>
          </div>

          {/* Active Offers Section */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#E8552B] flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-lg text-slate-900">
                    Ofertas Ativas
                  </h2>
                  <p className="text-xs text-slate-500">
                    Aproveite as ofertas exclusivas no SALVÔ
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-[#E8552B] text-white text-xs font-black uppercase rounded-full">
                {store.offers.length} Disponível(is)
              </span>
            </div>

            {store.offers && store.offers.length > 0 ? (
              <div className="space-y-3">
                {store.offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="p-4 rounded-2xl bg-gradient-to-r from-orange-50/80 via-amber-50/60 to-white border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 bg-[#FFC72C] text-[#0B4F8A] text-[10px] font-black uppercase rounded-lg border border-amber-300 flex items-center gap-1">
                          <span>🔥</span>
                          <span>{offer.discountBadge}</span>
                        </span>
                        <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          Válido até {formatBrazilianDate(offer.expiresAt)}
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-sm text-slate-900">
                        {offer.title}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {offer.description}
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-sm font-heading font-black text-emerald-700">
                          {offer.discountPrice
                            ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(offer.discountPrice)
                            : offer.priceText || offer.discountBadge}
                        </span>
                        {offer.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(offer.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onOpenChat(store)}
                        className="px-3.5 py-2 bg-[#0B4F8A] hover:bg-[#083a66] text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chamar no Chat</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Nenhuma oferta ativa no momento. Chame a loja no chat para conferir as novidades do dia!
              </p>
            )}
          </div>

          {/* Customer Reviews Section */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading font-bold text-lg text-slate-900">
                  Avaliações dos Clientes
                </h2>
                <p className="text-xs text-slate-500">
                  Experiências reais de quem frequenta a loja
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-black text-sm text-slate-900">{store.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-500">/ 5.0</span>
              </div>
            </div>

            {/* Leave a review form */}
            <form
              onSubmit={handleSubmitReview}
              className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Deixe sua avaliação:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 text-lg text-amber-400 hover:scale-125 transition-transform"
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-600 ml-1">({newRating} estrelas)</span>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <ClearableInput
                    placeholder="Compartilhe como foi seu atendimento ou experiência..."
                    value={newComment}
                    onValueChange={setNewComment}
                    className="h-10 bg-white border border-slate-200 focus:border-[#0B4F8A]"
                  />
                </div>
                <button
                  type="submit"
                  className="h-10 px-4 bg-[#0B4F8A] hover:bg-[#083a66] text-white font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publicar</span>
                </button>
              </div>

              {reviewSubmitted && (
                <p className="text-xs font-bold text-[#2E9E5B] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Obrigado! Sua avaliação foi registrada com sucesso.
                </p>
              )}
            </form>

            {/* List of reviews */}
            <div className="space-y-3">
              {store.reviews && store.reviews.length > 0 ? (
                store.reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-2xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {rev.userAvatar ? (
                          <img
                            src={rev.userAvatar}
                            alt={rev.userName}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0B4F8A] font-bold text-xs flex items-center justify-center">
                            {rev.userName.charAt(0)}
                          </div>
                        )}
                        <span className="font-bold text-xs text-slate-800">{rev.userName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center text-amber-400 text-xs mb-1">
                      {'★'.repeat(rev.rating)}
                      <span className="text-slate-300">{'★'.repeat(5 - rev.rating)}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Seja o primeiro a avaliar esta loja em Salvador!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Contact, Address, Hours, Route */}
        <div className="space-y-6">
          {/* Quick Contact & Action Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Fale com a Loja
            </h3>

            <div className="space-y-2.5">
              <button
                onClick={() => onOpenChat(store)}
                className="w-full h-12 bg-[#0B4F8A] hover:bg-[#083a66] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat no SALVÔ</span>
              </button>

              {store.whatsapp && (
                <a
                  href={`https://wa.me/${store.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1%2C%20vi%20sua%20loja%20no%20SALV%C3%94!`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full h-12 bg-[#2E9E5B] hover:bg-emerald-600 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chamar no WhatsApp</span>
                </a>
              )}
            </div>

            {/* Address & Traçar Rota */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Endereço
                </span>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                  {store.address}
                </p>
                <span className="inline-block mt-1 text-[11px] font-black text-[#0B4F8A] bg-blue-50 px-2 py-0.5 rounded-md">
                  Bairro: {store.neighborhood}
                </span>
              </div>

              <button
                onClick={() => setShowRouteModal(true)}
                className="w-full h-10 bg-[#FFC72C] hover:bg-amber-400 text-[#0B4F8A] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs"
              >
                <Navigation className="w-4 h-4" />
                <span>Traçar Rota no Mapa</span>
              </button>
            </div>

            {/* Operating Hours Table */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Horários de Funcionamento</span>
              </span>

              <div className="space-y-1.5 text-xs">
                {store.operatingHours.map((h, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="font-medium text-slate-600">{h.day}</span>
                    <span className={`font-bold ${h.isClosed ? 'text-rose-500' : 'text-slate-900'}`}>
                      {h.isClosed ? 'Fechado' : `${h.open} - ${h.close}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* MODAL: FOLLOWERS LIST */}
      {/* ================================================== */}
      {showFollowersModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0B4F8A] flex items-center justify-center border border-blue-100">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-slate-900">
                    Clientes Seguidores
                  </h3>
                  <p className="text-xs text-slate-500">
                    {followersList.length} pessoa(s) acompanham {store.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFollowersModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-sm transition-all"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {followerUsers.length > 0 ? (
                followerUsers.map(({ follow, user }) => (
                  <div
                    key={follow.id}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-3 hover:border-[#0B4F8A] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{user.name}</h4>
                        {user.username && (
                          <p className="text-[11px] text-slate-400">@{user.username}</p>
                        )}
                        <span className="inline-block text-[10px] text-[#0B4F8A] font-semibold">
                          📍 {user.neighborhood || 'Salvador, BA'}
                        </span>
                      </div>
                    </div>

                    {onViewUserProfile && (
                      <button
                        onClick={() => {
                          setShowFollowersModal(false);
                          onViewUserProfile(user.id);
                        }}
                        className="px-3 py-1.5 bg-white hover:bg-[#0B4F8A] hover:text-white text-[#0B4F8A] rounded-xl text-xs font-bold border border-slate-200 shadow-2xs transition-all shrink-0"
                      >
                        Ver Perfil
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-8 text-center space-y-2">
                  <Users className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-400">Esta loja ainda não possui seguidores.</p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowFollowersModal(false)}
                className="w-full h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* MODAL: ALL PARTNERS LIST */}
      {/* ================================================== */}
      {showPartnersModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#E8552B] flex items-center justify-center border border-orange-100">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-slate-900">
                    Lojas Parceiras
                  </h3>
                  <p className="text-xs text-slate-500">
                    {activePartnerships.length} parcerias ativas com {store.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPartnersModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-sm transition-all"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {partnerStores.length > 0 ? (
                partnerStores.map((partner) => {
                  const pInfo = activePartnerships.find(
                    (p) =>
                      (p.storeAId === partner.id && p.storeBId === store.id) ||
                      (p.storeBId === partner.id && p.storeAId === store.id)
                  );

                  return (
                    <div
                      key={partner.id}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 hover:border-[#0B4F8A] transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={partner.logo || partner.coverImage}
                            alt={partner.name}
                            className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[9px] font-black uppercase inline-block mb-0.5">
                              🤝 PARCEIROS
                            </span>
                            <h4 className="font-bold text-xs text-slate-900">{partner.name}</h4>
                            <p className="text-[11px] text-slate-500">
                              {partner.category} • {partner.neighborhood}
                            </p>
                          </div>
                        </div>

                        {onSelectStore && (
                          <button
                            onClick={() => {
                              setShowPartnersModal(false);
                              onSelectStore(partner.id);
                            }}
                            className="px-3.5 py-1.5 bg-[#0B4F8A] hover:bg-[#083a66] text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
                          >
                            Visitar Loja
                          </button>
                        )}
                      </div>

                      {pInfo?.title && (
                        <div className="bg-white p-2.5 rounded-xl border border-slate-100 text-xs">
                          <span className="font-bold text-slate-800">{pInfo.title}</span>
                          {pInfo.description && (
                            <p className="text-slate-500 text-[11px] mt-0.5">
                              {pInfo.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center space-y-2">
                  <Handshake className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-400">Nenhuma parceria ativa no momento.</p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowPartnersModal(false)}
                className="w-full h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* MODAL: PROPOSE COMMERCIAL PARTNERSHIP */}
      {/* ================================================== */}
      {showProposeModal && userMerchantStore && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#E8552B] flex items-center justify-center border border-orange-100">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-slate-900">
                    Solicitar Parceria Comercial
                  </h3>
                  <p className="text-xs text-slate-500">
                    {userMerchantStore.name} 🤝 {store.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowProposeModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-sm transition-all"
              >
                ✕
              </button>
            </div>

            {/* Visual Partnership Bridge */}
            <div className="p-3 bg-gradient-to-r from-blue-50 via-amber-50 to-orange-50 rounded-2xl border border-amber-200 flex items-center justify-around gap-2 text-center">
              <div className="flex-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Sua Loja</p>
                <p className="text-xs font-heading font-bold text-[#0B4F8A] truncate">{userMerchantStore.name}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-base">
                🤝
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Loja Parceira</p>
                <p className="text-xs font-heading font-bold text-[#E8552B] truncate">{store.name}</p>
              </div>
            </div>

            <form onSubmit={handleSendProposal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tipo de Parceria:
                </label>
                <select
                  value={propType}
                  onChange={(e) => setPropType(e.target.value as StorePartnershipType)}
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:border-[#0B4F8A] outline-none"
                >
                  <option value="cross_promo">Promoção Cruzada & Descontos Mútuos</option>
                  <option value="combo_deal">Combo Colaborativo de Produtos/Serviços</option>
                  <option value="joint_event">Evento Conjunto ou Ação Especial em Salvador</option>
                  <option value="supply_partner">Fornecedor / Insumo Parceiro Oficial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título da Parceria:
                </label>
                <ClearableInput
                  placeholder="Ex: Parceria Sabores da Barra & Pituba"
                  value={propTitle}
                  onValueChange={setPropTitle}
                  className="h-11 bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Proposta / Mensagem para o Lojista:
                </label>
                <ClearableTextarea
                  placeholder="Explique como essa parceria beneficiará ambos os negócios e clientes de Salvador..."
                  value={propDescription}
                  onValueChange={setPropDescription}
                  className="h-24 bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProposeModal(false)}
                  className="flex-1 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!propTitle.trim()}
                  className="flex-1 h-11 bg-[#0B4F8A] hover:bg-[#083a66] text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <Handshake className="w-4 h-4 text-[#FFC72C]" />
                  <span>Enviar Solicitação</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Traçar Rota Modal Simulation */}
      {showRouteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 border border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0B4F8A] border border-blue-200 flex items-center justify-center">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-slate-900 leading-tight">
                    Como Chegar em {store.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">{store.neighborhood} • Salvador, Bahia</p>
                </div>
              </div>
              <button
                onClick={() => setShowRouteModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-sm transition-all"
              >
                ✕
              </button>
            </div>

            {/* Travel Mode Pills */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl text-xs font-bold gap-1">
              <button
                onClick={() => setRouteMode('car')}
                className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  routeMode === 'car'
                    ? 'bg-[#0B4F8A] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>🚗 Carro</span>
                <span className="text-[11px] opacity-90">(~{store.distanceKm ? Math.round(store.distanceKm * 4 + 6) : '12'} min)</span>
              </button>
              <button
                onClick={() => setRouteMode('transit')}
                className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  routeMode === 'transit'
                    ? 'bg-[#0B4F8A] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>🚌 Ônibus / Metrô</span>
              </button>
              <button
                onClick={() => setRouteMode('walk')}
                className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  routeMode === 'walk'
                    ? 'bg-[#0B4F8A] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>🚶 A pé</span>
              </button>
            </div>

            {/* Dynamic Route Instructions for Salvador */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3 text-slate-700">
              {routeMode === 'car' && (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#0B4F8A] text-white flex items-center justify-center text-[10px] font-black shrink-0">1</span>
                    <p>Partindo da sua localização em Salvador via <strong>Av. Oceânica / Av. ACM / Orla Marítima</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#0B4F8A] text-white flex items-center justify-center text-[10px] font-black shrink-0">2</span>
                    <p>Siga em direção ao bairro <strong>{store.neighborhood}</strong> e acesse a via <strong>{store.address}</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#2E9E5B] text-white flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                    <p>Destino à direita com vagas de estacionamento próximas e zona azul disponível.</p>
                  </div>
                </>
              )}

              {routeMode === 'transit' && (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#0B4F8A] text-white flex items-center justify-center text-[10px] font-black shrink-0">1</span>
                    <p>Utilize as linhas do <strong>Integra Salvador</strong> ou <strong>CCR Metrô Bahia (Linha 1 ou 2)</strong> com integração tarifária.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#0B4F8A] text-white flex items-center justify-center text-[10px] font-black shrink-0">2</span>
                    <p>Desembarque no ponto mais próximo em <strong>{store.neighborhood}</strong> (cerca de 3 min de caminhada até a loja).</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#2E9E5B] text-white flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                    <p>Chegada em <strong>{store.name}</strong> ({store.address}).</p>
                  </div>
                </>
              )}

              {routeMode === 'walk' && (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#0B4F8A] text-white flex items-center justify-center text-[10px] font-black shrink-0">1</span>
                    <p>Siga pelo calçadão iluminado da Orla ou vias principais de <strong>{store.neighborhood}</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#0B4F8A] text-white flex items-center justify-center text-[10px] font-black shrink-0">2</span>
                    <p>Atravesse na faixa de pedestres em frente a <strong>{store.address}</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#2E9E5B] text-white flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                    <p>Acesso fácil ao nível da rua com acessibilidade.</p>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={
                    store.googleMapsUrl ||
                    store.mapLink ||
                    (store.coordinates?.lat && store.coordinates?.lng
                      ? `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.lat},${store.coordinates.lng}`
                      : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                          `${store.name}, ${store.address}, Salvador - BA`
                        )}`)
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="h-11 bg-[#0B4F8A] hover:bg-[#083a66] text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <span>Google Maps GPS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={
                    store.coordinates?.lat && store.coordinates?.lng
                      ? `https://waze.com/ul?ll=${store.coordinates.lat},${store.coordinates.lng}&navigate=yes`
                      : `https://waze.com/ul?q=${encodeURIComponent(
                          `${store.name}, ${store.address}, Salvador - BA`
                        )}&navigate=yes`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="h-11 bg-[#2E9E5B] hover:bg-[#25824b] text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <span>Waze GPS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${store.name} - ${store.address}, ${store.neighborhood}, Salvador - BA`);
                    setShareToast(true);
                    setTimeout(() => setShareToast(false), 3000);
                  }}
                  className="flex-1 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copiar Endereço Completo</span>
                </button>

                <button
                  onClick={() => setShowRouteModal(false)}
                  className="px-5 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

