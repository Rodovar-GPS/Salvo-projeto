import React, { useState } from 'react';
import { User, Store, Friendship, UserFollow, SocialNotification } from '../types';
import { BonfimRibbon } from '../components/BonfimRibbon';
import { ClearableInput } from '../components/ClearableInput';
import { SocialConnectionsModal } from '../components/social/SocialConnectionsModal';
import { UserSearchModal } from '../components/social/UserSearchModal';
import { SocialNotificationsModal } from '../components/social/SocialNotificationsModal';
import {
  User as UserIcon,
  Camera,
  Edit3,
  Settings,
  Share2,
  UserPlus,
  UserCheck,
  UserMinus,
  Heart,
  MapPin,
  Grid,
  Image as ImageIcon,
  Film,
  Folder,
  Bookmark,
  Lock,
  Globe,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  LogOut,
  X,
  ShieldCheck,
  ChevronRight,
  Phone,
  Mail,
  Flame,
  Award,
  Bell,
  Check,
  ExternalLink,
  Store as StoreIcon,
  Search,
  Users,
  ArrowLeft,
  Clock,
} from 'lucide-react';

interface UserProfileViewProps {
  currentUser: User;
  targetUser?: User | null; // Optional: when viewing someone else's profile
  allUsers?: User[];
  friendships?: Friendship[];
  userFollows?: UserFollow[];
  socialNotifications?: SocialNotification[];
  onUpdateUser: (updated: Partial<User>) => void;
  onLogout: () => void;
  onNavigateToMerchantRegister: () => void;
  onSendFriendRequest?: (targetUserId: string) => void;
  onAcceptFriendRequest?: (friendshipId: string) => void;
  onDeclineFriendRequest?: (friendshipId: string) => void;
  onRemoveFriend?: (targetUserId: string) => void;
  onToggleFollowUser?: (targetUserId: string) => void;
  onViewProfile?: (userId: string) => void;
  onBackToMyProfile?: () => void;
  onMarkNotificationAsRead?: (notifId: string) => void;
  onMarkAllNotificationsAsRead?: () => void;
  favoritesCount?: number;
  onSelectStore?: (store: Store) => void;
}

// Sample mock curated content for user tabs when populated
const SAMPLE_CLIENT_POSTS = [
  {
    id: 'post-1',
    content: 'Tarde de sol incrível no Porto da Barra! Depois passei no Açaí do Porto pra repor as energias com aquela tigela de cupuaçu perfeita. Salvador não tem igual! ☀️🥥',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    location: 'Porto da Barra • Salvador',
    likesCount: 38,
    commentsCount: 9,
    wantsCount: 14,
    createdAt: 'Há 2 horas',
  },
  {
    id: 'post-2',
    content: 'Dica gastronômica no Rio Vermelho: o acarajé com camarão sequinho e vatapá cremoso. Apoiem o comércio do nosso bairro! 🍤🔥',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    location: 'Rio Vermelho • Salvador',
    likesCount: 52,
    commentsCount: 12,
    wantsCount: 29,
    createdAt: 'Ontem',
  },
];

const SAMPLE_CLIENT_PHOTOS = [
  { id: 'ph-1', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', caption: 'Porto da Barra' },
  { id: 'ph-2', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', caption: 'Gastronomia Baiana' },
  { id: 'ph-3', url: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=600&q=80', caption: 'Farol da Barra' },
  { id: 'ph-4', url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80', caption: 'Pelourinho Centro Histórico' },
  { id: 'ph-5', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80', caption: 'Orla de Salvador' },
  { id: 'ph-6', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', caption: 'Pôr do Sol no Farol' },
];

const SAMPLE_CLIENT_VIDEOS = [
  {
    id: 'vd-1',
    thumbnail: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=600&q=80',
    title: 'Pôr do Sol Mágico no Farol da Barra',
    duration: '0:45',
    views: '1.4k visualizações',
  },
  {
    id: 'vd-2',
    thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    title: 'Tour Gastronômico pelas feiras de Salvador',
    duration: '1:20',
    views: '890 visualizações',
  },
];

const SAMPLE_CLIENT_ALBUMS = [
  {
    id: 'alb-1',
    title: 'Verão em Salvador & Praias',
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    itemsCount: 14,
  },
  {
    id: 'alb-2',
    title: 'Comércio & Gastronomia Favoritos',
    cover: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    itemsCount: 8,
  },
  {
    id: 'alb-3',
    title: 'Cultura & Festas de Largo',
    cover: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
    itemsCount: 22,
  },
];

const SAMPLE_CLIENT_PLACES = [
  {
    id: 'plc-1',
    name: 'Farol da Barra',
    neighborhood: 'Barra',
    category: 'Ponto Turístico & Histórico',
    tag: 'Mais Visitado',
  },
  {
    id: 'plc-2',
    name: 'Largo de Santana (Dinha)',
    neighborhood: 'Rio Vermelho',
    category: 'Gastronomia & Vida Noturna',
    tag: 'Boemia Baiana',
  },
  {
    id: 'plc-3',
    name: 'Largo do Pelourinho',
    neighborhood: 'Centro Histórico',
    category: 'Cultura & Música',
    tag: 'Patrimônio Mundial',
  },
  {
    id: 'plc-4',
    name: 'Orla da Ribeira & Enseada',
    neighborhood: 'Ribeira',
    category: 'Sorvetes & Beira-Mar',
    tag: 'Pôr do Sol',
  },
];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=350&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=350&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=350&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=350&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=350&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=350&q=80',
];

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  currentUser,
  targetUser,
  allUsers = [],
  friendships = [],
  userFollows = [],
  socialNotifications = [],
  onUpdateUser,
  onLogout,
  onNavigateToMerchantRegister,
  onSendFriendRequest = () => {},
  onAcceptFriendRequest = () => {},
  onDeclineFriendRequest = () => {},
  onRemoveFriend = () => {},
  onToggleFollowUser = () => {},
  onViewProfile = () => {},
  onBackToMyProfile,
  onMarkNotificationAsRead = () => {},
  onMarkAllNotificationsAsRead = () => {},
  favoritesCount = 0,
}) => {
  // Determine if viewing own profile or another client
  const activeProfile = targetUser || currentUser;
  const isOwnProfile = !targetUser || targetUser.id === currentUser.id;

  // Active Tab state
  type TabKey = 'posts' | 'photos' | 'videos' | 'albums' | 'places';
  const [activeTab, setActiveTab] = useState<TabKey>('posts');

  // Modals state
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isEditPhotoModalOpen, setIsEditPhotoModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isConnectionsModalOpen, setIsConnectionsModalOpen] = useState(false);
  const [connectionsModalTab, setConnectionsModalTab] = useState<
    'friends' | 'followers' | 'following' | 'requests'
  >('friends');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

  // Edit profile form state
  const [editName, setEditName] = useState(activeProfile.name);
  const [editUsername, setEditUsername] = useState(
    activeProfile.username || activeProfile.name.toLowerCase().replace(/[^a-z0-9]/g, '')
  );
  const [editBio, setEditBio] = useState(
    activeProfile.bio || 'Morador apaixonado por Salvador e pelo comércio local! ☀️'
  );
  const [editNeighborhood, setEditNeighborhood] = useState(
    activeProfile.neighborhood || 'Barra'
  );
  const [editPhone, setEditPhone] = useState(activeProfile.phone || '');
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [shareFeedback, setShareFeedback] = useState(false);

  // Privacy settings state in settings modal
  const [isPrivateProfile, setIsPrivateProfile] = useState(false);
  const [allowDMs, setAllowDMs] = useState(true);
  const [notifyDeals, setNotifyDeals] = useState(true);

  // Handlers
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwnProfile) return;

    onUpdateUser({
      name: editName,
      username: editUsername,
      bio: editBio,
      neighborhood: editNeighborhood,
      phone: editPhone,
    });

    setIsEditProfileModalOpen(false);
    showToast('Perfil atualizado com sucesso!');
  };

  const handleSelectAvatar = (url: string) => {
    if (!isOwnProfile) return;
    onUpdateUser({ avatar: url });
    setIsEditPhotoModalOpen(false);
    showToast('Foto de perfil atualizada!');
  };

  const handleShareProfile = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareFeedback(true);
    setTimeout(() => setShareFeedback(false), 2500);
  };

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // 1. DYNAMIC SOCIAL RELATIONSHIP CALCULATION FOR ACTIVE PROFILE
  const userFriendships = friendships.filter(
    (f) =>
      f.status === 'accepted' &&
      (f.requesterId === activeProfile.id || f.addresseeId === activeProfile.id)
  );
  const userFollowers = userFollows.filter((uf) => uf.followingId === activeProfile.id);
  const userFollowing = userFollows.filter((uf) => uf.followerId === activeProfile.id);

  // Dynamic counts: use calculated relationships or fallback to preset baseline count
  const statsFriends = userFriendships.length > 0 ? userFriendships.length : (activeProfile.friendsCount ?? 0);
  const statsFollowers = userFollowers.length > 0 ? userFollowers.length : (activeProfile.followersCount ?? 0);
  const statsFollowing = userFollowing.length > 0 ? userFollowing.length : (activeProfile.followingCount ?? 0);
  const statsPosts = activeProfile.postsCount ?? 24;

  // 2. RELATIONSHIP BETWEEN CURRENT USER AND TARGET USER (when viewing another client)
  const friendshipWithActive = !isOwnProfile
    ? friendships.find(
        (f) =>
          (f.requesterId === currentUser.id && f.addresseeId === activeProfile.id) ||
          (f.requesterId === activeProfile.id && f.addresseeId === currentUser.id)
      )
    : null;

  const isFollowingActive = !isOwnProfile
    ? userFollows.some(
        (uf) => uf.followerId === currentUser.id && uf.followingId === activeProfile.id
      )
    : false;

  // Pending requests for current user (for notification badge)
  const pendingRequestsCount = friendships.filter(
    (f) => f.status === 'pending' && f.addresseeId === currentUser.id
  ).length;

  const unreadNotifsCount = socialNotifications.filter(
    (n) => n.recipientProfileId === currentUser.id && !n.read
  ).length;

  const displayHandle = activeProfile.username
    ? `@${activeProfile.username}`
    : `@${activeProfile.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-20 right-4 z-50 bg-[#0B4F8A] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4 border border-white/20">
          <CheckCircle2 className="w-4 h-4 text-[#FFC72C]" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Ribbon Banner */}
      <div className="bg-white border-b border-slate-200">
        <BonfimRibbon height="h-1.5" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-5">
        {/* Return Button if viewing another client */}
        {!isOwnProfile && onBackToMyProfile && (
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToMyProfile}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-heading font-black text-xs uppercase tracking-wider rounded-2xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#0B4F8A]" />
              <span>Voltar ao Meu Perfil</span>
            </button>

            <span className="text-xs text-slate-500 font-semibold">
              Visualizando perfil de membro
            </span>
          </div>
        )}

        {/* =========================================================
            1. MODERN CLIENT PROFILE CARD (HEADER)
        ========================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Cover gradient & texture */}
          <div className="h-32 sm:h-44 bg-gradient-to-r from-[#0B4F8A] via-[#083863] to-[#E8552B] relative">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
            
            {/* Top Right Badges */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[11px] font-black uppercase tracking-wider border border-white/30">
                {activeProfile.city || 'Salvador'} • BA
              </span>
            </div>

            {/* Quick Actions in Cover for Own Profile */}
            {isOwnProfile && (
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <button
                  onClick={() => setIsSearchModalOpen(true)}
                  className="h-8 px-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white text-xs font-bold flex items-center gap-1.5 border border-white/30 transition-all cursor-pointer"
                  title="Encontrar Amigos em Salvador"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Buscar Pessoas</span>
                </button>

                <button
                  onClick={() => setIsNotificationsModalOpen(true)}
                  className="h-8 px-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white text-xs font-bold flex items-center gap-1.5 border border-white/30 transition-all relative cursor-pointer"
                  title="Notificações Sociais"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Notificações</span>
                  {unreadNotifsCount > 0 && (
                    <span className="w-2.5 h-2.5 bg-[#E8552B] rounded-full border border-white" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Profile Details Container */}
          <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-5">
              {/* Avatar with Edit Badge */}
              <div className="relative group">
                <img
                  src={
                    activeProfile.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=350&q=80'
                  }
                  alt={activeProfile.name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
                />

                {isOwnProfile ? (
                  <button
                    onClick={() => setIsEditPhotoModalOpen(true)}
                    className="absolute bottom-1 right-1 p-2.5 bg-[#0B4F8A] text-white hover:bg-[#E8552B] rounded-2xl shadow-lg transition-all border-2 border-white focus:outline-hidden hover:scale-105 active:scale-95 cursor-pointer"
                    title="Editar foto de perfil"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                ) : null}
              </div>

              {/* Action Buttons Header */}
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 w-full sm:w-auto">
                {isOwnProfile ? (
                  <>
                    <button
                      onClick={() => setIsSearchModalOpen(true)}
                      className="h-10 px-4 bg-[#E8552B] hover:bg-[#cf4720] text-white font-heading font-black text-xs uppercase tracking-wider rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Adicionar Amigos</span>
                    </button>

                    <button
                      onClick={() => setIsEditProfileModalOpen(true)}
                      className="h-10 px-4 bg-[#0B4F8A] hover:bg-[#083a66] text-white font-heading font-black text-xs uppercase tracking-wider rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar Perfil</span>
                    </button>

                    <button
                      onClick={() => setIsSettingsModalOpen(true)}
                      className="h-10 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Configurações e Privacidade"
                    >
                      <Settings className="w-4 h-4 text-slate-600" />
                      <span className="hidden sm:inline">Configurações</span>
                    </button>

                    <button
                      onClick={handleShareProfile}
                      className="h-10 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Compartilhar perfil"
                    >
                      <Share2 className="w-4 h-4 text-slate-600" />
                      <span className="hidden sm:inline">
                        {shareFeedback ? 'Copiado!' : 'Compartilhar'}
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* CLIENT → CLIENT RELATIONSHIP BUTTONS */}
                    {friendshipWithActive?.status === 'accepted' ? (
                      <button
                        onClick={() => {
                          onRemoveFriend(activeProfile.id);
                          showToast('Amizade desfeita.');
                        }}
                        className="flex-1 sm:flex-initial h-10 px-4 bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 font-heading font-black text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer group"
                        title="Clique para desfazer amizade"
                      >
                        <UserCheck className="w-4 h-4 group-hover:hidden text-emerald-600" />
                        <UserMinus className="w-4 h-4 hidden group-hover:inline text-rose-600" />
                        <span className="group-hover:hidden">Amigos ✓</span>
                        <span className="hidden group-hover:inline">Desfazer Amizade</span>
                      </button>
                    ) : friendshipWithActive?.status === 'pending' &&
                      friendshipWithActive.requesterId === currentUser.id ? (
                      <button
                        onClick={() => {
                          onDeclineFriendRequest(friendshipWithActive.id);
                          showToast('Solicitação de amizade cancelada.');
                        }}
                        className="flex-1 sm:flex-initial h-10 px-4 bg-amber-50 border border-amber-300 text-amber-800 hover:bg-rose-50 hover:text-rose-700 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Clique para cancelar solicitação"
                      >
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Solicitação Enviada (Cancelar)</span>
                      </button>
                    ) : friendshipWithActive?.status === 'pending' &&
                      friendshipWithActive.addresseeId === currentUser.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onAcceptFriendRequest(friendshipWithActive.id);
                            showToast('Solicitação de amizade aceita! Agora são amigos.');
                          }}
                          className="h-10 px-4 bg-[#0B4F8A] hover:bg-[#083a66] text-white font-heading font-black text-xs uppercase tracking-wider rounded-2xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Aceitar Amizade</span>
                        </button>
                        <button
                          onClick={() => {
                            onDeclineFriendRequest(friendshipWithActive.id);
                            showToast('Solicitação recusada.');
                          }}
                          className="h-10 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-all cursor-pointer"
                        >
                          Recusar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          onSendFriendRequest(activeProfile.id);
                          showToast('Solicitação de amizade enviada com sucesso!');
                        }}
                        className="flex-1 sm:flex-initial h-10 px-5 bg-[#E8552B] hover:bg-[#cf4720] text-white font-heading font-black text-xs uppercase tracking-wider rounded-2xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Adicionar Amigo</span>
                      </button>
                    )}

                    {/* SEGUIR / DEIXAR DE SEGUIR BUTTON */}
                    <button
                      onClick={() => {
                        onToggleFollowUser(activeProfile.id);
                        showToast(
                          isFollowingActive
                            ? 'Você deixou de seguir este usuário.'
                            : 'Você começou a seguir este usuário!'
                        );
                      }}
                      className={`h-10 px-4 font-bold text-xs rounded-2xl transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                        isFollowingActive
                          ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                          : 'bg-white border-[#0B4F8A] text-[#0B4F8A] hover:bg-blue-50'
                      }`}
                    >
                      <span>{isFollowingActive ? 'Seguindo' : 'Seguir'}</span>
                    </button>

                    <button
                      onClick={handleShareProfile}
                      className="h-10 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-all cursor-pointer"
                      title="Compartilhar perfil"
                    >
                      <Share2 className="w-4 h-4 text-slate-600" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* User Bio & Meta info */}
            <div className="space-y-3 text-center sm:text-left">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 tracking-tight">
                    {activeProfile.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#FFC72C]/20 text-[#0B4F8A] border border-[#FFC72C]/40 mx-auto sm:mx-0 w-fit">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    {activeProfile.isSubscriber ? 'Assinante VIP Salvador' : 'Cliente SALVÔ'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 mt-1 text-xs text-slate-500 font-semibold">
                  <span className="font-mono text-[#0B4F8A] font-bold">{displayHandle}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-[#E8552B]" />
                    <span>
                      {activeProfile.neighborhood || 'Barra'}, {activeProfile.city || 'Salvador'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Bio Box */}
              <div className="bg-slate-50/80 rounded-2xl p-3 sm:p-4 border border-slate-100">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {activeProfile.bio ||
                    'Apaixonada por Salvador, praias da Barra, acarajé bem apimentado e o comércio criativo da nossa cidade! ☀️🌴'}
                </p>
                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditProfileModalOpen(true)}
                    className="mt-2 text-[11px] font-bold text-[#0B4F8A] hover:underline flex items-center gap-1 mx-auto sm:mx-0 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Editar bio</span>
                  </button>
                )}
              </div>
            </div>

            {/* =========================================================
                2. STATS BAR (AMIGOS / SEGUIDORES / SEGUINDO / PUBLICAÇÕES)
                CLICKABLE TO OPEN SOCIAL CONNECTIONS LISTS
            ========================================================= */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
              {/* Amigos card */}
              <div
                onClick={() => {
                  setConnectionsModalTab('friends');
                  setIsConnectionsModalOpen(true);
                }}
                className="bg-slate-50/80 hover:bg-blue-50/50 p-3.5 rounded-2xl border border-slate-200/70 hover:border-blue-200 text-center transition-all cursor-pointer group shadow-2xs"
              >
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-[#0B4F8A] uppercase tracking-wider block mb-0.5 transition-colors">
                  Amigos
                </span>
                <p className="text-xl sm:text-2xl font-heading font-black text-[#0B4F8A]">
                  {statsFriends}
                </p>
                <span className="text-[10px] text-slate-500 font-medium group-hover:text-slate-700">
                  Ver lista de amigos →
                </span>
              </div>

              {/* Seguidores card */}
              <div
                onClick={() => {
                  setConnectionsModalTab('followers');
                  setIsConnectionsModalOpen(true);
                }}
                className="bg-slate-50/80 hover:bg-orange-50/50 p-3.5 rounded-2xl border border-slate-200/70 hover:border-orange-200 text-center transition-all cursor-pointer group shadow-2xs"
              >
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-[#E8552B] uppercase tracking-wider block mb-0.5 transition-colors">
                  Seguidores
                </span>
                <p className="text-xl sm:text-2xl font-heading font-black text-[#E8552B]">
                  {statsFollowers}
                </p>
                <span className="text-[10px] text-slate-500 font-medium group-hover:text-slate-700">
                  Quem acompanha →
                </span>
              </div>

              {/* Seguindo card */}
              <div
                onClick={() => {
                  setConnectionsModalTab('following');
                  setIsConnectionsModalOpen(true);
                }}
                className="bg-slate-50/80 hover:bg-amber-50/50 p-3.5 rounded-2xl border border-slate-200/70 hover:border-amber-200 text-center transition-all cursor-pointer group shadow-2xs"
              >
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-amber-700 uppercase tracking-wider block mb-0.5 transition-colors">
                  Seguindo
                </span>
                <p className="text-xl sm:text-2xl font-heading font-black text-amber-700">
                  {statsFollowing}
                </p>
                <span className="text-[10px] text-slate-500 font-medium group-hover:text-slate-700">
                  Perfis seguidos →
                </span>
              </div>

              {/* Publicações card */}
              <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/60 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  Publicações
                </span>
                <p className="text-xl sm:text-2xl font-heading font-black text-emerald-700">
                  {statsPosts}
                </p>
                <span className="text-[10px] text-slate-500 font-medium">Fotos e dicas</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            3. TAB NAVIGATION (PUBLICAÇÕES / FOTOS / VÍDEOS / ÁLBUNS / LUGARES)
        ========================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 p-2 shadow-2xs">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-heading font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'posts'
                  ? 'bg-[#0B4F8A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Publicações</span>
            </button>

            <button
              onClick={() => setActiveTab('photos')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-heading font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'photos'
                  ? 'bg-[#0B4F8A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Fotos</span>
            </button>

            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-heading font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'videos'
                  ? 'bg-[#0B4F8A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Vídeos</span>
            </button>

            <button
              onClick={() => setActiveTab('albums')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-heading font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'albums'
                  ? 'bg-[#0B4F8A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>Álbuns</span>
            </button>

            <button
              onClick={() => setActiveTab('places')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-heading font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'places'
                  ? 'bg-[#0B4F8A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Lugares & Bairros</span>
            </button>
          </div>
        </div>

        {/* =========================================================
            4. TAB CONTENT AREA
        ========================================================= */}
        <div className="space-y-4">
          {/* TAB 1: PUBLICAÇÕES */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {SAMPLE_CLIENT_POSTS.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm"
                >
                  <div className="p-4 sm:p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={activeProfile.avatar}
                        alt={activeProfile.name}
                        className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-heading font-black text-xs sm:text-sm text-slate-900">
                          {activeProfile.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#E8552B]" />
                            {post.location}
                          </span>
                          <span>•</span>
                          <span>{post.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="px-5 pb-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {post.content}
                  </p>

                  {post.image && (
                    <div className="relative aspect-video sm:aspect-21/9 overflow-hidden bg-slate-100">
                      <img
                        src={post.image}
                        alt="Foto da publicação"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-3 sm:p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-bold">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 hover:text-[#0B4F8A]">
                        <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                        <span>{post.likesCount} Gostei</span>
                      </span>
                      <span className="flex items-center gap-1.5 hover:text-[#0B4F8A]">
                        <Flame className="w-4 h-4 text-[#E8552B]" />
                        <span>{post.wantsCount} Eu Quero</span>
                      </span>
                    </div>

                    <span className="flex items-center gap-1.5 text-slate-500">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.commentsCount} comentários</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: FOTOS */}
          {activeTab === 'photos' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {SAMPLE_CLIENT_PHOTOS.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs cursor-pointer"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3.5">
                    <span className="text-xs font-bold text-white leading-tight">
                      {photo.caption}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: VÍDEOS */}
          {activeTab === 'videos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SAMPLE_CLIENT_VIDEOS.map((vid) => (
                <div
                  key={vid.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs group cursor-pointer"
                >
                  <div className="relative aspect-video bg-slate-900">
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono font-bold rounded-md">
                      {vid.duration}
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-heading font-black text-xs sm:text-sm text-slate-900 leading-snug group-hover:text-[#0B4F8A] transition-colors">
                      {vid.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">{vid.views}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: ÁLBUNS */}
          {activeTab === 'albums' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SAMPLE_CLIENT_ALBUMS.map((album) => (
                <div
                  key={album.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs group cursor-pointer"
                >
                  <div className="relative aspect-4/3 bg-slate-100">
                    <img
                      src={album.cover}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-xl text-slate-900 text-[10px] font-black uppercase tracking-wider shadow-xs">
                      {album.itemsCount} itens
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-heading font-black text-xs sm:text-sm text-slate-900 group-hover:text-[#0B4F8A] transition-colors">
                      {album.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: LUGARES & BAIRROS */}
          {activeTab === 'places' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {SAMPLE_CLIENT_PLACES.map((place) => (
                <div
                  key={place.id}
                  className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs hover:border-[#0B4F8A]/30 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-100/60 text-[#E8552B] flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-xs sm:text-sm text-slate-900">
                        {place.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {place.neighborhood} • {place.category}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-xl shrink-0">
                    {place.tag}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          5. MODALS
      ========================================================= */}

      {/* MODAL 1: SOCIAL CONNECTIONS (AMIGOS, SEGUIDORES, SEGUINDO, SOLICITAÇÕES) */}
      <SocialConnectionsModal
        isOpen={isConnectionsModalOpen}
        onClose={() => setIsConnectionsModalOpen(false)}
        currentUser={currentUser}
        targetUser={activeProfile}
        allUsers={allUsers}
        friendships={friendships}
        userFollows={userFollows}
        initialTab={connectionsModalTab}
        onSendFriendRequest={onSendFriendRequest}
        onAcceptFriendRequest={onAcceptFriendRequest}
        onDeclineFriendRequest={onDeclineFriendRequest}
        onRemoveFriend={onRemoveFriend}
        onToggleFollowUser={onToggleFollowUser}
        onViewProfile={onViewProfile}
      />

      {/* MODAL 2: PESQUISA DE USUÁRIOS DE SALVADOR */}
      <UserSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        currentUser={currentUser}
        allUsers={allUsers}
        friendships={friendships}
        userFollows={userFollows}
        onSendFriendRequest={onSendFriendRequest}
        onAcceptFriendRequest={onAcceptFriendRequest}
        onDeclineFriendRequest={onDeclineFriendRequest}
        onRemoveFriend={onRemoveFriend}
        onToggleFollowUser={onToggleFollowUser}
        onViewProfile={onViewProfile}
      />

      {/* MODAL 3: NOTIFICAÇÕES SOCIAIS */}
      <SocialNotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={socialNotifications}
        currentUser={currentUser}
        onAcceptFriendRequest={onAcceptFriendRequest}
        onDeclineFriendRequest={onDeclineFriendRequest}
        onMarkAsRead={onMarkNotificationAsRead}
        onMarkAllAsRead={onMarkAllNotificationsAsRead}
        onViewProfile={onViewProfile}
      />

      {/* MODAL 4: EDIT PROFILE */}
      {isEditProfileModalOpen && isOwnProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#0B4F8A]" />
                <h3 className="font-heading font-black text-slate-900 text-base">
                  Editar Perfil do Cliente
                </h3>
              </div>
              <button
                onClick={() => setIsEditProfileModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nome Completo
                </label>
                <ClearableInput
                  value={editName}
                  onValueChange={setEditName}
                  placeholder="Seu nome completo"
                  className="h-11"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nome de Usuário (@handle)
                </label>
                <ClearableInput
                  value={editUsername}
                  onValueChange={setEditUsername}
                  placeholder="ex: carol.bahia"
                  leftIcon={<span className="text-xs font-bold text-slate-400">@</span>}
                  className="h-11 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bairro em Salvador
                </label>
                <ClearableInput
                  value={editNeighborhood}
                  onValueChange={setEditNeighborhood}
                  placeholder="ex: Barra, Rio Vermelho, Pituba"
                  leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
                  className="h-11"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Telefone / WhatsApp
                </label>
                <ClearableInput
                  value={editPhone}
                  onValueChange={setEditPhone}
                  placeholder="(71) 99999-9999"
                  leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                  className="h-11"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bio / Apresentação
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Conte um pouco sobre sua relação com Salvador..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-[#0B4F8A] focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-2xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0B4F8A] hover:bg-[#083a66] text-white text-xs font-heading font-black uppercase rounded-2xl shadow-xs transition-all cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: EDIT PHOTO */}
      {isEditPhotoModalOpen && isOwnProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#0B4F8A]" />
                <h3 className="font-heading font-black text-slate-900 text-base">
                  Alterar Foto de Perfil
                </h3>
              </div>
              <button
                onClick={() => setIsEditPhotoModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4 font-medium">
              Escolha um avatar representativo da nossa comunidade em Salvador:
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {AVATAR_PRESETS.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAvatar(url)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all hover:scale-105 cursor-pointer ${
                    activeProfile.avatar === url
                      ? 'border-[#0B4F8A] shadow-md ring-2 ring-[#0B4F8A]/30'
                      : 'border-slate-200'
                  }`}
                >
                  <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsEditPhotoModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: SETTINGS */}
      {isSettingsModalOpen && isOwnProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#0B4F8A]" />
                <h3 className="font-heading font-black text-slate-900 text-base">
                  Configurações e Privacidade
                </h3>
              </div>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Merchant Upgrade Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-orange-50 border border-blue-200 flex items-center justify-between gap-3">
              <div>
                <strong className="text-xs font-heading font-black text-[#0B4F8A] block">
                  Você tem um negócio em Salvador?
                </strong>
                <span className="text-[11px] text-slate-600">
                  Cadastre sua loja gratuitamente no SALVÔ e alcance clientes do seu bairro.
                </span>
              </div>
              <button
                onClick={() => {
                  setIsSettingsModalOpen(false);
                  onNavigateToMerchantRegister();
                }}
                className="px-3.5 py-2 bg-[#0B4F8A] hover:bg-[#083a66] text-white text-xs font-bold rounded-xl shrink-0 transition-colors cursor-pointer"
              >
                Cadastrar Loja
              </button>
            </div>

            {/* Privacy Controls */}
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Privacidade da Conta
              </span>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-slate-600" />
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">Perfil Privado</strong>
                    <span className="text-[11px] text-slate-500">
                      Apenas amigos podem ver suas publicações
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isPrivateProfile}
                  onChange={(e) => setIsPrivateProfile(e.target.checked)}
                  className="w-4 h-4 text-[#0B4F8A] rounded accent-[#0B4F8A] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-slate-600" />
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">
                      Mensagens Diretas
                    </strong>
                    <span className="text-[11px] text-slate-500">
                      Permitir que estabelecimentos e amigos conversem com você
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={allowDMs}
                  onChange={(e) => setAllowDMs(e.target.checked)}
                  className="w-4 h-4 text-[#0B4F8A] rounded accent-[#0B4F8A] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-slate-600" />
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">
                      Notificações de Ofertas
                    </strong>
                    <span className="text-[11px] text-slate-500">
                      Receber alertas de descontos dos seus bairros favoritos
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyDeals}
                  onChange={(e) => setNotifyDeals(e.target.checked)}
                  className="w-4 h-4 text-[#0B4F8A] rounded accent-[#0B4F8A] cursor-pointer"
                />
              </div>
            </div>

            {/* Logout button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl text-xs font-bold transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair da Conta</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSettingsModalOpen(false);
                  showToast('Configurações salvas!');
                }}
                className="px-5 py-2.5 bg-[#0B4F8A] hover:bg-[#083a66] text-white text-xs font-heading font-black uppercase rounded-2xl transition-all cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
