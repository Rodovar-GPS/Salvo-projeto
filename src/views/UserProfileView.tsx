import React, { useState, useMemo } from 'react';
import { User, Store, Friendship, UserFollow, SocialNotification, ActiveTab } from '../types';
import { WavesPattern, SalvadorSkylineSilhouette, GotaDeDendeBadge } from '../components/MaresPattern';
import { MaresGamificationPanel } from '../components/MaresGamificationPanel';
import { ClearableInput } from '../components/ClearableInput';
import { SocialConnectionsModal } from '../components/social/SocialConnectionsModal';
import { UserSearchModal } from '../components/social/UserSearchModal';
import { SocialNotificationsModal } from '../components/social/SocialNotificationsModal';
import {
  canDeleteComment,
  canDeletePost,
  canEditComment,
  blockUser,
  unblockUser,
  isUserBlocked,
  getBlockedUsers,
  BlockedUserInfo,
} from '../utils/socialModeration';
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
  ShieldAlert,
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
  Send,
  PlusCircle,
  SlidersHorizontal,
  Star,
  ShoppingBag,
  Handshake,
  Tag,
  MessageSquare,
  Ban,
  Trash2,
  Pencil,
  AlertTriangle,
} from 'lucide-react';

interface UserProfileViewProps {
  currentUser: User;
  targetUser?: User | null; // Optional: when viewing someone else's profile
  allUsers?: User[];
  allStores?: Store[];
  currentMerchantStore?: Store | null;
  initialProfileMode?: 'client' | 'merchant';
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
  onNavigateToTab?: (tab: ActiveTab) => void;
  onSwitchUser?: (userId: string) => void;
}

interface PostItem {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  image?: string;
  location: string;
  likesCount: number;
  commentsCount: number;
  wantsCount: number;
  isLiked?: boolean;
  isWanted?: boolean;
  createdAt: string;
  comments: {
    id: string;
    userName: string;
    userAvatar: string;
    text: string;
    time: string;
  }[];
}

// Curated mock posts
const INITIAL_CLIENT_POSTS: PostItem[] = [
  {
    id: 'post-1',
    authorId: 'user-1',
    authorName: 'João Silva',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    content:
      'Tarde de sol incrível no Porto da Barra! Depois passei no Açaí do Porto pra repor as energias com aquela tigela de cupuaçu perfeita. Salvador não tem igual! ☀️🥥',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    location: 'Porto da Barra • Salvador',
    likesCount: 38,
    commentsCount: 2,
    wantsCount: 14,
    isLiked: true,
    isWanted: false,
    createdAt: 'Há 2 horas',
    comments: [
      {
        id: 'c-1',
        userName: 'Mariana Costa',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        text: 'Aquele cupuaçu cremoso é surreal de bom! Super recomendo.',
        time: 'Há 1 hora',
      },
      {
        id: 'c-2',
        userName: 'Carlos Bahia',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        text: 'Peguei o desconto pelo SALVÔ semana passada lá. Vale muito a pena!',
        time: 'Há 30 min',
      },
    ],
  },
  {
    id: 'post-2',
    authorId: 'user-1',
    authorName: 'João Silva',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    content:
      'Dica gastronômica no Rio Vermelho: o acarajé com camarão sequinho e vatapá cremoso. Apoiem o comércio do nosso bairro! 🍤🔥',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    location: 'Rio Vermelho • Salvador',
    likesCount: 52,
    commentsCount: 1,
    wantsCount: 29,
    isLiked: false,
    isWanted: true,
    createdAt: 'Ontem',
    comments: [
      {
        id: 'c-3',
        userName: 'Dona Solange',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        text: 'Muito obrigada pelo carinho, querido! Estamos sempre de portas abertas!',
        time: 'Ontem',
      },
    ],
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
    title: 'Verão em Salvador 2026',
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    itemsCount: 18,
  },
  {
    id: 'alb-2',
    title: 'Melhores Acarajés & Quitutes',
    cover: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    itemsCount: 12,
  },
  {
    id: 'alb-3',
    title: 'Passeios Culturais & Pelô',
    cover: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
    itemsCount: 24,
  },
];

const SAMPLE_CLIENT_PLACES = [
  { id: 'pl-1', name: 'Farol da Barra', neighborhood: 'Barra', category: 'Ponto Turístico', tag: 'Favorito' },
  { id: 'pl-2', name: 'Largo de Santana (Dinha)', neighborhood: 'Rio Vermelho', category: 'Gastronomia', tag: 'Frequente' },
  { id: 'pl-3', name: 'Praça Castro Alves', neighborhood: 'Centro', category: 'Cultura & Vista', tag: 'Visitado' },
  { id: 'pl-4', name: 'Praia do Buracão', neighborhood: 'Rio Vermelho', category: 'Praia', tag: 'Favorito' },
];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
];

const PRESET_POST_PHOTOS = [
  { label: 'Farol da Barra', url: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80' },
  { label: 'Acarajé Baiano', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Porto da Barra', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Pelourinho Histórico', url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80' },
];

const SALVADOR_NEIGHBORHOODS = [
  'Barra',
  'Rio Vermelho',
  'Pelourinho',
  'Pituba',
  'Itapuã',
  'Graça',
  'Ondina',
  'Campo Grande',
  'Brotas',
  'Imbuí',
  'Stella Maris',
  'Ribeira',
  'Bonfim',
  'Cabula',
];

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  currentUser,
  targetUser,
  allUsers = [],
  allStores = [],
  currentMerchantStore,
  initialProfileMode = 'client',
  friendships = [],
  userFollows = [],
  socialNotifications = [],
  onUpdateUser,
  onLogout,
  onNavigateToMerchantRegister,
  onSendFriendRequest,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
  onRemoveFriend,
  onToggleFollowUser,
  onViewProfile,
  onBackToMyProfile,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  favoritesCount = 0,
  onSelectStore,
  onNavigateToTab,
  onSwitchUser,
}) => {
  // Determine if viewing own profile or target user
  const isOwnProfile = !targetUser || targetUser.id === currentUser.id;
  const activeProfile = isOwnProfile ? currentUser : targetUser;

  // DUAL-MODE PROFILE TOGGLE: 'client' (Social/Personal) vs 'merchant' (Comercial/Vitrine)
  const [profileMode, setProfileMode] = useState<'client' | 'merchant'>(
    initialProfileMode || (activeProfile.role === 'merchant' ? 'merchant' : 'client')
  );

  // Client Tab State: 'posts' | 'photos' | 'videos' | 'albums' | 'places'
  const [activeClientTab, setActiveClientTab] = useState<'posts' | 'photos' | 'videos' | 'albums' | 'places'>('posts');

  // Merchant Tab State: 'offers' | 'vitrine' | 'reviews' | 'partnerships' | 'followers'
  const [activeMerchantTab, setActiveMerchantTab] = useState<'offers' | 'vitrine' | 'reviews' | 'partnerships' | 'followers'>('offers');

  // Posts State (with initial sample posts)
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_CLIENT_POSTS);

  // Create Post Form State
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImageUrl, setNewPostImageUrl] = useState('');
  const [newPostNeighborhood, setNewPostNeighborhood] = useState('Barra');
  const [showPhotoUrlInput, setShowPhotoUrlInput] = useState(false);

  // Comment Box State per post (open drawer id)
  const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);
  const [commentInputText, setCommentInputText] = useState('');

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

  // Edit form state
  const [editName, setEditName] = useState(activeProfile.name);
  const [editUsername, setEditUsername] = useState(activeProfile.username || '');
  const [editBio, setEditBio] = useState(activeProfile.bio || '');
  const [editNeighborhood, setEditNeighborhood] = useState(activeProfile.neighborhood || 'Barra');
  const [editPhone, setEditPhone] = useState(activeProfile.phone || '');

  // Settings toggles
  const [isPrivateProfile, setIsPrivateProfile] = useState(false);
  const [allowDMs, setAllowDMs] = useState(true);
  const [notifyDeals, setNotifyDeals] = useState(true);

  // Notification / Toast Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Find Merchant Store for this profile (if merchant)
  const matchedStore = useMemo(() => {
    if (currentMerchantStore && isOwnProfile) return currentMerchantStore;
    const storeById = allStores.find((s) => s.id === activeProfile.storeId || s.ownerId === activeProfile.id);
    if (storeById) return storeById;
    // Fallback for demo merchant
    if (activeProfile.role === 'merchant') {
      return allStores[0] || null;
    }
    return null;
  }, [allStores, activeProfile, currentMerchantStore, isOwnProfile]);

  // Social stats calculations
  const statsFriends = useMemo(() => {
    return friendships.filter(
      (f) =>
        f.status === 'accepted' &&
        (f.requesterId === activeProfile.id || f.addresseeId === activeProfile.id)
    ).length;
  }, [friendships, activeProfile.id]);

  const statsFollowers = useMemo(() => {
    return userFollows.filter((uf) => uf.followingId === activeProfile.id).length;
  }, [userFollows, activeProfile.id]);

  const statsFollowing = useMemo(() => {
    return userFollows.filter((uf) => uf.followerId === activeProfile.id).length;
  }, [userFollows, activeProfile.id]);

  const statsPosts = posts.length;

  const unreadNotifsCount = useMemo(() => {
    return socialNotifications.filter((n) => !n.read).length;
  }, [socialNotifications]);

  // Relationship helpers between currentUser and targetUser
  const isFollowingTarget = useMemo(() => {
    if (isOwnProfile) return false;
    return userFollows.some(
      (uf) => uf.followerId === currentUser.id && uf.followingId === activeProfile.id
    );
  }, [userFollows, currentUser.id, activeProfile.id, isOwnProfile]);

  const friendshipStatusWithTarget = useMemo(() => {
    if (isOwnProfile) return null;
    const found = friendships.find(
      (f) =>
        (f.requesterId === currentUser.id && f.addresseeId === activeProfile.id) ||
        (f.requesterId === activeProfile.id && f.addresseeId === currentUser.id)
    );
    if (!found) return null;
    return {
      id: found.id,
      status: found.status,
      isSender: found.requesterId === currentUser.id,
    };
  }, [friendships, currentUser.id, activeProfile.id, isOwnProfile]);

  // Handle Publish New Post
  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) {
      showToast('Digite uma mensagem para publicar.');
      return;
    }

    const newPost: PostItem = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      content: newPostContent.trim(),
      image: newPostImageUrl.trim() || undefined,
      location: `${newPostNeighborhood} • Salvador`,
      likesCount: 1,
      commentsCount: 0,
      wantsCount: 1,
      isLiked: true,
      isWanted: false,
      createdAt: 'Agora mesmo',
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostImageUrl('');
    setShowPhotoUrlInput(false);
    showToast('✨ Publicação compartilhada com a comunidade de Salvador!');
  };

  // Handle Like Post
  const handleToggleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const wasLiked = p.isLiked;
          return {
            ...p,
            isLiked: !wasLiked,
            likesCount: wasLiked ? Math.max(0, p.likesCount - 1) : p.likesCount + 1,
          };
        }
        return p;
      })
    );
  };

  // Handle Want / Flame
  const handleToggleWantPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const wasWanted = p.isWanted;
          return {
            ...p,
            isWanted: !wasWanted,
            wantsCount: wasWanted ? Math.max(0, p.wantsCount - 1) : p.wantsCount + 1,
          };
        }
        return p;
      })
    );
  };

  // Handle Add Comment
  const handleAddComment = (postId: string) => {
    if (!commentInputText.trim()) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            userName: currentUser.name,
            userAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            text: commentInputText.trim(),
            time: 'Agora mesmo',
          };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );

    setCommentInputText('');
    showToast('Comentário enviado!');
  };

  // Delete Post (Strict Rule: Author of post OR Owner of Profile)
  const handleDeletePost = (postId: string, postAuthorId: string, postAuthorName: string) => {
    const allowed = canDeletePost(postAuthorId, postAuthorName, currentUser.id, currentUser.name, activeProfile.id);
    if (!allowed) {
      showToast('Você só pode excluir publicações criadas por você ou do seu próprio mural.');
      return;
    }
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    showToast('Publicação excluída com sucesso.');
  };

  // Delete Comment in Post (Strict Rule: Author of comment OR Owner of Profile)
  const handleDeleteCommentInPost = (postId: string, commentId: string, commentAuthorName: string) => {
    const allowed = canDeleteComment(undefined, commentAuthorName, currentUser.id, currentUser.name, activeProfile.id);
    if (!allowed) {
      showToast('Você só pode excluir comentários feitos por você ou na sua própria página.');
      return;
    }
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: Math.max(0, p.commentsCount - 1),
            comments: p.comments.filter((c) => c.id !== commentId),
          };
        }
        return p;
      })
    );
    showToast('Comentário excluído.');
  };

  // Blocking State & Handlers
  const [blockedUsers, setBlockedUsers] = useState<BlockedUserInfo[]>(() => getBlockedUsers(currentUser.id));
  const [confirmBlockUser, setConfirmBlockUser] = useState<{ id: string; name: string; avatar?: string } | null>(null);

  const isTargetBlocked = useMemo(() => {
    if (isOwnProfile) return false;
    return isUserBlocked(currentUser.id, activeProfile.id);
  }, [currentUser.id, activeProfile.id, isOwnProfile, blockedUsers]);

  const handleBlockUserAction = (userToBlock: { id: string; name: string; avatar?: string }) => {
    const updated = blockUser(currentUser.id, userToBlock);
    setBlockedUsers(updated);
    setConfirmBlockUser(null);
    showToast(`Usuário ${userToBlock.name} foi bloqueado.`);
  };

  const handleUnblockUserAction = (targetUserId: string, targetUserName: string) => {
    const updated = unblockUser(currentUser.id, targetUserId);
    setBlockedUsers(updated);
    showToast(`Usuário ${targetUserName} foi desbloqueado.`);
  };

  // Handle Save Profile Updates
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: editName,
      username: editUsername.replace('@', ''),
      bio: editBio,
      neighborhood: editNeighborhood,
      phone: editPhone,
    });
    setIsEditProfileModalOpen(false);
    showToast('Perfil atualizado com sucesso!');
  };

  // Handle Select Avatar Preset
  const handleSelectAvatar = (url: string) => {
    onUpdateUser({ avatar: url });
    setIsEditPhotoModalOpen(false);
    showToast('Foto de perfil atualizada!');
  };

  const displayHandle = activeProfile.username
    ? `@${activeProfile.username.replace('@', '')}`
    : `@${activeProfile.name.toLowerCase().replace(/\s+/g, '.')}`;

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#0B3D91] text-white px-4 py-3 rounded-2xl shadow-xl border border-blue-300/30 flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-[#FFC72C]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Target User Back Button */}
      {!isOwnProfile && (
        <div className="flex items-center justify-between bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs">
          <button
            onClick={onBackToMyProfile}
            className="flex items-center gap-2 text-xs font-bold text-[#0B3D91] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Meu Perfil</span>
          </button>
          <span className="text-[11px] text-slate-500 font-semibold">
            Visualizando perfil de <strong className="text-slate-800">{activeProfile.name}</strong>
          </span>
        </div>
      )}

      {/* =========================================================
          PROMINENT DUAL-MODE SELECTOR: CLIENTE vs LOJISTA
      ========================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 p-2 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-1">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {/* Mode 1: Perfil de Cliente */}
            <button
              onClick={() => setProfileMode('client')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-heading font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                profileMode === 'client'
                  ? 'bg-[#0B3D91] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Perfil Social (Cliente)</span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold ${
                  profileMode === 'client' ? 'bg-white text-[#0B3D91]' : 'bg-blue-100 text-[#0B3D91]'
                }`}
              >
                Amigos & Dicas
              </span>
            </button>

            {/* Mode 2: Perfil de Lojista */}
            <button
              onClick={() => setProfileMode('merchant')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-heading font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                profileMode === 'merchant'
                  ? 'bg-[#C1502E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <StoreIcon className="w-4 h-4" />
              <span>Perfil Comercial (Lojista)</span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold ${
                  profileMode === 'merchant' ? 'bg-white text-[#C1502E]' : 'bg-orange-100 text-[#C1502E]'
                }`}
              >
                {matchedStore ? 'Vitrine Ativa' : 'Simular Loja'}
              </span>
            </button>
          </div>

          {/* Role Quick Status Badge / Helper */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold px-2">
            <span className="hidden md:inline">Você está no modo:</span>
            <span
              className={`px-2.5 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider ${
                profileMode === 'client'
                  ? 'bg-blue-50 text-[#0B3D91] border border-blue-200'
                  : 'bg-orange-50 text-[#C1502E] border border-orange-200'
              }`}
            >
              {profileMode === 'client' ? 'Visão de Cliente' : 'Visão de Lojista'}
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================================
          MODE 1: PERFIL SOCIAL (CLIENTE)
      ========================================================================================= */}
      {profileMode === 'client' && (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
          {/* PROFILE HEADER CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Cover Banner */}
            <div className="h-36 sm:h-48 bg-gradient-to-r from-[#0F4C81] via-[#2A9D8F] to-[#E89F3C] relative overflow-hidden">
              <WavesPattern intensity="soft" />
              <SalvadorSkylineSilhouette className="opacity-30" />

              {/* Cover Top Badges */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider bg-white/95 text-[#0F4C81] backdrop-blur-md shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#E89F3C]" />
                  <span>A Cidade das Marés</span>
                </span>
              </div>
            </div>

            {/* Profile Avatar & Info Row */}
            <div className="px-4 sm:px-8 pb-6 sm:pb-8 pt-0">
              <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
                {/* Avatar with Camera Trigger & Official Verification Badge */}
                <div className="relative group">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-100 relative">
                    <img
                      src={
                        activeProfile.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                      }
                      alt={activeProfile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Official Verified Badge on Profile Photo */}
                  <div
                    className="absolute -top-1 -right-1 w-8 h-8 rounded-2xl bg-[#0B3D91] text-[#FFC72C] border-2 border-white shadow-md flex items-center justify-center"
                    title="Perfil Verificado Salvô Salvador"
                  >
                    <ShieldCheck className="w-5 h-5 fill-current" />
                  </div>

                  {isOwnProfile && (
                    <button
                      onClick={() => setIsEditPhotoModalOpen(true)}
                      className="absolute bottom-1 right-1 p-2 bg-[#0B3D91] hover:bg-[#082C69] text-white rounded-xl shadow-md border-2 border-white transition-transform group-hover:scale-110 cursor-pointer"
                      title="Alterar foto de perfil"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Profile Actions Toolbar */}
                <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
                  {isOwnProfile ? (
                    <>
                      {/* Search People in Salvador */}
                      <button
                        onClick={() => setIsSearchModalOpen(true)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl transition-all cursor-pointer"
                      >
                        <Search className="w-3.5 h-3.5 text-[#0B3D91]" />
                        <span>Buscar Pessoas</span>
                      </button>

                      {/* Social Notifications */}
                      <button
                        onClick={() => setIsNotificationsModalOpen(true)}
                        className="relative flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl transition-all cursor-pointer"
                      >
                        <Bell className="w-3.5 h-3.5 text-[#C1502E]" />
                        <span>Notificações</span>
                        {unreadNotifsCount > 0 && (
                          <span className="min-w-4 h-4 px-1 bg-[#C1502E] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                            {unreadNotifsCount}
                          </span>
                        )}
                      </button>

                      {/* Edit Profile */}
                      <button
                        onClick={() => setIsEditProfileModalOpen(true)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#0B3D91] hover:bg-[#082C69] text-white text-xs font-bold rounded-2xl shadow-xs transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar Perfil</span>
                      </button>

                      {/* Settings */}
                      <button
                        onClick={() => setIsSettingsModalOpen(true)}
                        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-2xl transition-colors cursor-pointer"
                        title="Configurações e Privacidade"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Relationship with Target User */}
                      {friendshipStatusWithTarget?.status === 'accepted' ? (
                        <button
                          onClick={() => onRemoveFriend && onRemoveFriend(activeProfile.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold rounded-2xl border border-slate-200 transition-colors cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Amigos</span>
                        </button>
                      ) : friendshipStatusWithTarget?.status === 'pending' ? (
                        friendshipStatusWithTarget.isSender ? (
                          <span className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 text-amber-700 text-xs font-bold rounded-2xl border border-amber-200">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Solicitação Enviada</span>
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() =>
                                onAcceptFriendRequest &&
                                onAcceptFriendRequest(friendshipStatusWithTarget.id)
                              }
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition-colors cursor-pointer"
                            >
                              Aceitar Amigo
                            </button>
                            <button
                              onClick={() =>
                                onDeclineFriendRequest &&
                                onDeclineFriendRequest(friendshipStatusWithTarget.id)
                              }
                              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-colors cursor-pointer"
                            >
                              Recusar
                            </button>
                          </div>
                        )
                      ) : (
                        <button
                          onClick={() => onSendFriendRequest && onSendFriendRequest(activeProfile.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#0B3D91] hover:bg-[#082C69] text-white text-xs font-bold rounded-2xl shadow-xs transition-colors cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Adicionar Amigo</span>
                        </button>
                      )}

                      {/* Follow Button */}
                      <button
                        onClick={() => onToggleFollowUser && onToggleFollowUser(activeProfile.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-2xl border transition-all cursor-pointer ${
                          isFollowingTarget
                            ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-600'
                            : 'bg-[#C1502E] text-white border-transparent hover:bg-[#A33F22]'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>{isFollowingTarget ? 'Seguindo' : 'Seguir'}</span>
                      </button>

                      {/* Block / Unblock User Action */}
                      {isTargetBlocked ? (
                        <button
                          onClick={() => handleUnblockUserAction(activeProfile.id, activeProfile.name)}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-200 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-bold rounded-2xl border border-slate-300 transition-all cursor-pointer shadow-2xs"
                          title="Desbloquear este usuário"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Desbloquear</span>
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            setConfirmBlockUser({
                              id: activeProfile.id,
                              name: activeProfile.name,
                              avatar: activeProfile.avatar,
                            })
                          }
                          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs font-bold rounded-2xl border border-slate-200 transition-all cursor-pointer"
                          title="Bloquear usuário"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Bloquear</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Bio & Details */}
              <div className="space-y-3 text-center sm:text-left">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 tracking-tight">
                      {activeProfile.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#FFC72C]/20 text-[#0B3D91] border border-[#FFC72C]/40 mx-auto sm:mx-0 w-fit">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      {activeProfile.isSubscriber ? 'Assinante VIP Salvador' : 'Cliente SALVÔ'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 mt-1 text-xs text-slate-500 font-semibold">
                    <span className="font-mono text-[#0B3D91] font-bold">{displayHandle}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-[#C1502E]" />
                      <span>
                        {activeProfile.neighborhood || 'Barra'}, {activeProfile.city || 'Salvador'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Bio Box */}
                <div className="bg-slate-50/80 rounded-2xl p-3 sm:p-4 border border-slate-100 text-left">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {activeProfile.bio ||
                      'Apaixonada por Salvador, praias da Barra, acarajé bem apimentado e o comércio criativo da nossa cidade! ☀️🌴'}
                  </p>
                </div>
              </div>

              {/* STATS BAR (CLICKABLE) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-6 pt-6 border-t border-slate-100">
                {/* Amigos */}
                <div
                  onClick={() => {
                    setConnectionsModalTab('friends');
                    setIsConnectionsModalOpen(true);
                  }}
                  className="bg-slate-50/80 hover:bg-blue-50/60 p-3 rounded-2xl border border-slate-200/70 hover:border-blue-200 text-center transition-all cursor-pointer group"
                >
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 group-hover:text-[#0B3D91] uppercase tracking-wider block mb-0.5">
                    Amigos
                  </span>
                  <p className="text-xl sm:text-2xl font-heading font-black text-[#0B3D91]">
                    {statsFriends}
                  </p>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium">
                    Ver amigos →
                  </span>
                </div>

                {/* Seguidores */}
                <div
                  onClick={() => {
                    setConnectionsModalTab('followers');
                    setIsConnectionsModalOpen(true);
                  }}
                  className="bg-slate-50/80 hover:bg-orange-50/60 p-3 rounded-2xl border border-slate-200/70 hover:border-orange-200 text-center transition-all cursor-pointer group"
                >
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 group-hover:text-[#C1502E] uppercase tracking-wider block mb-0.5">
                    Seguidores
                  </span>
                  <p className="text-xl sm:text-2xl font-heading font-black text-[#C1502E]">
                    {statsFollowers}
                  </p>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium">
                    Quem segue →
                  </span>
                </div>

                {/* Seguindo */}
                <div
                  onClick={() => {
                    setConnectionsModalTab('following');
                    setIsConnectionsModalOpen(true);
                  }}
                  className="bg-slate-50/80 hover:bg-amber-50/60 p-3 rounded-2xl border border-slate-200/70 hover:border-amber-200 text-center transition-all cursor-pointer group"
                >
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 group-hover:text-amber-700 uppercase tracking-wider block mb-0.5">
                    Seguindo
                  </span>
                  <p className="text-xl sm:text-2xl font-heading font-black text-amber-700">
                    {statsFollowing}
                  </p>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium">
                    Perfis seguidos →
                  </span>
                </div>

                {/* Publicações */}
                <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-200/60 text-center">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Publicações
                  </span>
                  <p className="text-xl sm:text-2xl font-heading font-black text-emerald-700">
                    {statsPosts}
                  </p>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium">
                    Fotos e dicas
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              PAINEL DE GAMIFICAÇÃO: MARÉS & CONCHAS
          ========================================================= */}
          <MaresGamificationPanel />

          {/* CLIENT SUB-TABS (PUBLICAÇÕES, FOTOS, VÍDEOS, ÁLBUNS, LUGARES) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-2 shadow-2xs">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveClientTab('posts')}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-heading font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeClientTab === 'posts'
                    ? 'bg-[#0B3D91] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Publicações ({posts.length})</span>
              </button>

              <button
                onClick={() => setActiveClientTab('photos')}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-heading font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeClientTab === 'photos'
                    ? 'bg-[#0B3D91] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Fotos ({SAMPLE_CLIENT_PHOTOS.length})</span>
              </button>

              <button
                onClick={() => setActiveClientTab('videos')}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-heading font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeClientTab === 'videos'
                    ? 'bg-[#0B3D91] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Vídeos ({SAMPLE_CLIENT_VIDEOS.length})</span>
              </button>

              <button
                onClick={() => setActiveClientTab('albums')}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-heading font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeClientTab === 'albums'
                    ? 'bg-[#0B3D91] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Folder className="w-3.5 h-3.5" />
                <span>Álbuns ({SAMPLE_CLIENT_ALBUMS.length})</span>
              </button>

              <button
                onClick={() => setActiveClientTab('places')}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-heading font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeClientTab === 'places'
                    ? 'bg-[#0B3D91] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Lugares Favoritos ({SAMPLE_CLIENT_PLACES.length})</span>
              </button>
            </div>
          </div>

          {/* TAB 1: PUBLICAÇÕES (WITH POST CREATOR) */}
          {activeClientTab === 'posts' && (
            <div className="space-y-4">
              {/* POST CREATOR BOX (IF OWN PROFILE) */}
              {isOwnProfile && (
                <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1">
                      <strong className="text-xs font-black text-slate-900 block">
                        Compartilhe com Salvador
                      </strong>
                      <span className="text-[11px] text-slate-500">
                        Indique comércios, pratos típicos ou momentos na cidade
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handlePublishPost} className="space-y-3 pt-2">
                    <textarea
                      rows={2}
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="O que você está aproveitando em Salvador hoje? Dica de loja, restaurante, praia..."
                      className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#0B3D91] focus:outline-hidden transition-all resize-none"
                    />

                    {/* Image URL input or presets */}
                    {showPhotoUrlInput && (
                      <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2">
                        <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                          Link da Foto / Imagem:
                        </label>
                        <input
                          type="url"
                          value={newPostImageUrl}
                          onChange={(e) => setNewPostImageUrl(e.target.value)}
                          placeholder="https://exemplo.com/foto.jpg"
                          className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0B3D91]"
                        />

                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-slate-400 font-bold">Sugestões:</span>
                          {PRESET_POST_PHOTOS.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setNewPostImageUrl(preset.url)}
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-[#0B3D91] border border-blue-200 hover:bg-blue-100 cursor-pointer"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Post actions bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        {/* Toggle photo input */}
                        <button
                          type="button"
                          onClick={() => setShowPhotoUrlInput(!showPhotoUrlInput)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            showPhotoUrlInput || newPostImageUrl
                              ? 'bg-blue-100 text-[#0B3D91]'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Foto</span>
                        </button>

                        {/* Neighborhood selector */}
                        <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-[#C1502E]" />
                          <select
                            value={newPostNeighborhood}
                            onChange={(e) => setNewPostNeighborhood(e.target.value)}
                            className="bg-transparent border-none text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
                          >
                            {SALVADOR_NEIGHBORHOODS.map((nh) => (
                              <option key={nh} value={nh}>
                                {nh}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Publish Button */}
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-5 py-2 bg-[#0B3D91] hover:bg-[#082C69] text-white text-xs font-heading font-black uppercase tracking-wider rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Publicar no SALVÔ</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* POSTS LIST */}
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-0"
                >
                  {/* Post Header */}
                  <div className="p-4 sm:p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-heading font-black text-xs sm:text-sm text-slate-900">
                          {post.authorName}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#C1502E]" />
                            {post.location}
                          </span>
                          <span>•</span>
                          <span>{post.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* Strict Post Deletion: Only Post Author OR Profile Owner */}
                    {canDeletePost(post.authorId, post.authorName, currentUser.id, currentUser.name, activeProfile.id) && (
                      <button
                        onClick={() => handleDeletePost(post.id, post.authorId, post.authorName)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Excluir esta publicação"
                        aria-label="Excluir esta publicação"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Post Content */}
                  <p className="px-5 pb-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {post.content}
                  </p>

                  {/* Post Photo */}
                  {post.image && (
                    <div className="relative aspect-video sm:aspect-21/9 overflow-hidden bg-slate-100">
                      <img
                        src={post.image}
                        alt="Foto da publicação"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Post Interaction Bar */}
                  <div className="p-3 sm:p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-bold">
                    <div className="flex items-center gap-3 sm:gap-5">
                      {/* Like */}
                      <button
                        onClick={() => handleToggleLikePost(post.id)}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                          post.isLiked ? 'text-rose-600' : 'hover:text-rose-500 text-slate-600'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${post.isLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                        />
                        <span>{post.likesCount} Gostei</span>
                      </button>

                      {/* Flame / Eu Quero */}
                      <button
                        onClick={() => handleToggleWantPost(post.id)}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                          post.isWanted ? 'text-[#C1502E]' : 'hover:text-[#C1502E] text-slate-600'
                        }`}
                      >
                        <Flame
                          className={`w-4 h-4 ${post.isWanted ? 'fill-[#C1502E] text-[#C1502E]' : ''}`}
                        />
                        <span>{post.wantsCount} Eu Quero</span>
                      </button>

                      {/* Comments toggle */}
                      <button
                        onClick={() =>
                          setOpenCommentPostId(openCommentPostId === post.id ? null : post.id)
                        }
                        className="flex items-center gap-1.5 hover:text-[#0B3D91] text-slate-600 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.commentsCount} Comentários</span>
                      </button>
                    </div>

                    {/* Share */}
                    <button
                      onClick={() => {
                        showToast('Link da publicação copiado!');
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                      title="Compartilhar publicação"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* COMMENTS DRAWER */}
                  {openCommentPostId === post.id && (
                    <div className="p-4 bg-slate-100/70 border-t border-slate-200/80 space-y-3 animate-in fade-in duration-150">
                      {/* Comments list */}
                      {post.comments.length > 0 ? (
                        <div className="space-y-2">
                          {post.comments.map((c) => {
                            const canDeleteThisComment = canDeleteComment(
                              undefined,
                              c.userName,
                              currentUser.id,
                              currentUser.name,
                              activeProfile.id
                            );

                            return (
                              <div key={c.id} className="flex items-start gap-2.5 text-xs">
                                <img
                                  src={c.userAvatar}
                                  alt={c.userName}
                                  className="w-7 h-7 rounded-xl object-cover border border-slate-200 shrink-0 mt-0.5"
                                />
                                <div className="bg-white p-2.5 rounded-2xl border border-slate-200/70 flex-1">
                                  <div className="flex items-center justify-between">
                                    <strong className="font-bold text-slate-900">{c.userName}</strong>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] text-slate-400">{c.time}</span>
                                      {canDeleteThisComment && (
                                        <button
                                          onClick={() =>
                                            handleDeleteCommentInPost(post.id, c.id, c.userName)
                                          }
                                          className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                                          title="Excluir comentário"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-slate-700 mt-0.5 font-medium">{c.text}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-center text-[11px] text-slate-400 py-1">
                          Nenhum comentário ainda. Seja o primeiro a comentar!
                        </p>
                      )}

                      {/* Add comment form */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={commentInputText}
                          onChange={(e) => setCommentInputText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment(post.id);
                          }}
                          placeholder="Escreva um comentário soteropolitano..."
                          className="flex-1 px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0B3D91]"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="px-3.5 py-2 bg-[#0B3D91] hover:bg-[#082C69] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Enviar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: FOTOS */}
          {activeClientTab === 'photos' && (
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
          {activeClientTab === 'videos' && (
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
                    <h4 className="font-heading font-black text-xs sm:text-sm text-slate-900 leading-snug group-hover:text-[#0B3D91] transition-colors">
                      {vid.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">{vid.views}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: ÁLBUNS */}
          {activeClientTab === 'albums' && (
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
                      {album.itemsCount} fotos
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-heading font-black text-xs sm:text-sm text-slate-900 group-hover:text-[#0B3D91] transition-colors">
                      {album.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: LUGARES FAVORITOS */}
          {activeClientTab === 'places' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {SAMPLE_CLIENT_PLACES.map((place) => (
                <div
                  key={place.id}
                  className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs hover:border-[#0B3D91]/30 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-100/60 text-[#C1502E] flex items-center justify-center shrink-0">
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
      )}

      {/* =========================================================================================
          MODE 2: PERFIL COMERCIAL (LOJISTA)
      ========================================================================================= */}
      {profileMode === 'merchant' && (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
          {matchedStore ? (
            /* ACTIVE STORE PROFILE */
            <div className="space-y-4 sm:space-y-6">
              {/* Store Hero Card */}
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                {/* Store Cover Banner */}
                <div className="h-40 sm:h-52 bg-slate-900 relative">
                  <img
                    src={
                      matchedStore.coverImage ||
                      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
                    }
                    alt={matchedStore.name}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <WavesPattern intensity="soft" />

                  {/* Open Status & Badges */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase rounded-xl shadow-xs">
                      Aberto Agora
                    </span>
                    <span className="px-3 py-1 bg-[#FFC72C] text-[#0B3D91] text-[10px] font-black uppercase rounded-xl shadow-xs">
                      Oficial SALVÔ
                    </span>
                  </div>
                </div>

                {/* Store Header Row */}
                <div className="px-4 sm:px-8 pb-6 sm:pb-8 pt-0">
                  <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-6">
                    {/* Store Logo */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white shrink-0">
                      <img
                        src={matchedStore.logo || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'}
                        alt={matchedStore.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
                      {isOwnProfile && (
                        <button
                          onClick={() => {
                            if (onNavigateToTab) onNavigateToTab('merchant_dashboard');
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#0B3D91] hover:bg-[#082C69] text-white text-xs font-bold rounded-2xl shadow-xs transition-all cursor-pointer"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          <span>Acessar Painel de Gestão</span>
                        </button>
                      )}

                      {onSelectStore && (
                        <button
                          onClick={() => onSelectStore(matchedStore)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#C1502E] hover:bg-[#A33F22] text-white text-xs font-bold rounded-2xl shadow-xs transition-all cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Ver Vitrine Pública</span>
                        </button>
                      )}

                      <a
                        href={`https://wa.me/55${matchedStore.whatsapp?.replace(/\D/g, '') || '71999999999'}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Store Info */}
                  <div className="space-y-3 text-center sm:text-left">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 tracking-tight">
                          {matchedStore.name}
                        </h1>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-100 text-[#C1502E] border border-orange-200 mx-auto sm:mx-0 w-fit">
                          {matchedStore.category}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 mt-1 text-xs text-slate-600 font-semibold">
                        <span className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span>{matchedStore.rating || '5.0'}</span>
                          <span className="text-slate-400 font-normal">
                            ({matchedStore.reviewCount || 48} avaliações)
                          </span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-[#C1502E]" />
                          <span>
                            {matchedStore.address || 'Rua da Paciência'}, {matchedStore.neighborhood} • Salvador
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Store Description */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left">
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                        {matchedStore.description ||
                          'Comércio tradicional de Salvador com o melhor atendimento da região. Venha nos visitar e saborear o autêntico sabor da Bahia com desconto exclusivo SALVÔ!'}
                      </p>
                    </div>
                  </div>

                  {/* Store Key Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
                    <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100 text-center">
                      <span className="text-[10px] font-bold text-[#0B3D91] uppercase tracking-wider block mb-0.5">
                        Plano Oficial
                      </span>
                      <p className="text-base sm:text-lg font-heading font-black text-[#0B3D91]">
                        R$ 12/mês
                      </p>
                      <span className="text-[10px] text-slate-500 font-medium">Ativo & Verificado</span>
                    </div>

                    <div className="bg-orange-50/70 p-3.5 rounded-2xl border border-orange-100 text-center">
                      <span className="text-[10px] font-bold text-[#C1502E] uppercase tracking-wider block mb-0.5">
                        Ofertas Ativas
                      </span>
                      <p className="text-xl sm:text-2xl font-heading font-black text-[#C1502E]">
                        {matchedStore.offers?.length || 2}
                      </p>
                      <span className="text-[10px] text-slate-500 font-medium">Cupons da loja</span>
                    </div>

                    <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 text-center">
                      <span className="text-[10px] font-bold text-[#1F6E43] uppercase tracking-wider block mb-0.5">
                        Seguidores
                      </span>
                      <p className="text-xl sm:text-2xl font-heading font-black text-[#1F6E43]">
                        {matchedStore.followersCount || 142}
                      </p>
                      <span className="text-[10px] text-slate-500 font-medium">Clientes de Salvador</span>
                    </div>

                    <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-100 text-center">
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-0.5">
                        Avaliação Média
                      </span>
                      <p className="text-xl sm:text-2xl font-heading font-black text-amber-700">
                        ⭐ 5.0
                      </p>
                      <span className="text-[10px] text-slate-500 font-medium">Excelente</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MERCHANT SUB-TABS */}
              <div className="bg-white rounded-3xl border border-slate-200 p-2 shadow-2xs">
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                  <button
                    onClick={() => setActiveMerchantTab('offers')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-heading font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      activeMerchantTab === 'offers'
                        ? 'bg-[#C1502E] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Ofertas & Cupons ({matchedStore.offers?.length || 2})</span>
                  </button>

                  <button
                    onClick={() => setActiveMerchantTab('vitrine')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-heading font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      activeMerchantTab === 'vitrine'
                        ? 'bg-[#C1502E] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Vitrine de Fotos</span>
                  </button>

                  <button
                    onClick={() => setActiveMerchantTab('reviews')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-heading font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      activeMerchantTab === 'reviews'
                        ? 'bg-[#C1502E] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>Avaliações dos Clientes</span>
                  </button>

                  <button
                    onClick={() => setActiveMerchantTab('partnerships')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-heading font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      activeMerchantTab === 'partnerships'
                        ? 'bg-[#C1502E] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Handshake className="w-3.5 h-3.5" />
                    <span>Parcerias Comerciais</span>
                  </button>
                </div>
              </div>

              {/* MERCHANT TAB 1: OFERTAS ATIVAS */}
              {activeMerchantTab === 'offers' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(matchedStore.offers || [
                    {
                      id: 'off-1',
                      title: 'Combo Salvador Especial: 2 Acarajés + Refrigerante',
                      description: 'Acarajé completo com camarão, vatapá, caruru e salada vinagrete com 15% OFF.',
                      discount: '15% OFF',
                      originalPrice: 38,
                      discountPrice: 32.3,
                      validUntil: '31/03/2026',
                    },
                    {
                      id: 'off-2',
                      title: 'Porção de Abará Tradicional em Dobro',
                      description: 'Peça uma porção de abará na folha de bananeira e ganhe a segunda pela metade do preço.',
                      discount: '50% na 2ª',
                      originalPrice: 45,
                      discountPrice: 33.75,
                      validUntil: '15/04/2026',
                    },
                  ]).map((offer, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-orange-200 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 bg-rose-500 text-white font-black text-[10px] rounded-xl uppercase tracking-wider">
                            {offer.discount || 'Desconto'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            Válido até {offer.validUntil}
                          </span>
                        </div>
                        <h4 className="font-heading font-black text-sm text-slate-900">
                          {offer.title}
                        </h4>
                        <p className="text-xs text-slate-600 font-medium">{offer.description}</p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                        {offer.originalPrice && offer.discountPrice ? (
                          <div>
                            <span className="text-xs text-slate-400 line-through mr-1.5 font-bold">
                              R$ {Number(offer.originalPrice).toFixed(2)}
                            </span>
                            <span className="text-base font-black text-emerald-600">
                              R$ {Number(offer.discountPrice).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-500">Cupom Especial</span>
                        )}

                        <button
                          onClick={() => showToast('Cupom resgatado com sucesso!')}
                          className="px-3.5 py-1.5 bg-[#C1502E] hover:bg-[#A33F22] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Pegar Cupom
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* MERCHANT TAB 2: VITRINE DE FOTOS */}
              {activeMerchantTab === 'vitrine' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
                  ].map((img, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs"
                    >
                      <img
                        src={img}
                        alt="Vitrine da loja"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* MERCHANT TAB 3: AVALIAÇÕES */}
              {activeMerchantTab === 'reviews' && (
                <div className="space-y-3">
                  {[
                    {
                      name: 'Mariana Costa',
                      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
                      rating: 5,
                      comment:
                        'O melhor tempero da cidade! O camarão é sempre fresquinho e o atendimento super rápido pelo WhatsApp.',
                      date: 'Há 2 dias',
                    },
                    {
                      name: 'Carlos Bahia',
                      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                      rating: 5,
                      comment:
                        'Excelente desconto pelo SALVÔ. Fui com a família no final de semana e fomos muito bem acolhidos!',
                      date: 'Há 1 semana',
                    },
                  ].map((rev, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.avatar}
                            alt={rev.name}
                            className="w-8 h-8 rounded-xl object-cover"
                          />
                          <div>
                            <strong className="text-xs font-bold text-slate-900 block">
                              {rev.name}
                            </strong>
                            <span className="text-[10px] text-slate-400">{rev.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 font-medium">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* MERCHANT TAB 4: PARCERIAS COMERCIAIS */}
              {activeMerchantTab === 'partnerships' && (
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <Handshake className="w-5 h-5 text-[#0B3D91]" />
                    <h3 className="font-heading font-black text-sm text-slate-900">
                      Rede de Parcerias do Comércio em Salvador
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Conecte sua loja com outros comércios do seu bairro para criar combos e promoções cruzadas.
                  </p>

                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                    <div>
                      <strong className="text-xs font-bold text-[#0B3D91] block">
                        Parceria Ativa: Açaí do Porto x Acarajé da Tia Solange
                      </strong>
                      <span className="text-[11px] text-slate-600">
                        Compre no Açaí e ganhe 10% de desconto no Acarajé.
                      </span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-xl">
                      Ativa
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* SIMULADOR DE PERFIL DE LOJISTA (FOR CLIENTS) */
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-center">
              <div className="max-w-xl mx-auto space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-orange-100 text-[#C1502E] flex items-center justify-center mx-auto shadow-xs">
                  <StoreIcon className="w-8 h-8" />
                </div>

                <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 tracking-tight">
                  Quer transformar seu perfil em Lojista no SALVÔ?
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  Por apenas <strong className="text-[#0B3D91] font-black">R$ 12/mês</strong>, seu comércio ganha vitrine oficial, cupons de desconto, visualização 360 no mapa de Salvador e conexão direta com milhares de clientes pelo WhatsApp!
                </p>
              </div>

              {/* Showcase highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-xs font-black text-[#0B3D91] block">📍 No Mapa de Salvador</span>
                  <span className="text-[11px] text-slate-600">Localização exata com rota e Street View</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-xs font-black text-[#C1502E] block">🏷️ Cupons de Ofertas</span>
                  <span className="text-[11px] text-slate-600">Divulgue promoções para atrair o bairro</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-xs font-black text-emerald-700 block">💬 WhatsApp Direto</span>
                  <span className="text-[11px] text-slate-600">Receba pedidos sem intermediários</span>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
                {/* Switch to demo merchant account */}
                {onSwitchUser && (
                  <button
                    onClick={() => {
                      const merchantUser = allUsers.find((u) => u.role === 'merchant');
                      if (merchantUser) {
                        onSwitchUser(merchantUser.id);
                        showToast('Alternado para conta de Lojista Demo!');
                      }
                    }}
                    className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl transition-all cursor-pointer"
                  >
                    ⚡ Testar Modo Lojista (Demo)
                  </button>
                )}

                {/* Open registration wizard */}
                <button
                  onClick={onNavigateToMerchantRegister}
                  className="w-full sm:w-auto px-6 py-3 bg-[#FFC72C] hover:bg-[#F0B719] text-[#0B3D91] font-heading font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  🚀 Cadastrar Minha Loja (R$ 12/mês)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================================
          MODALS
      ========================================================================================= */}

      {/* MODAL 1: SOCIAL CONNECTIONS */}
      <SocialConnectionsModal
        isOpen={isConnectionsModalOpen}
        onClose={() => setIsConnectionsModalOpen(false)}
        currentUser={currentUser}
        targetUser={activeProfile}
        allUsers={allUsers}
        friendships={friendships}
        userFollows={userFollows}
        initialTab={connectionsModalTab}
        onSendFriendRequest={onSendFriendRequest || (() => {})}
        onAcceptFriendRequest={onAcceptFriendRequest || (() => {})}
        onDeclineFriendRequest={onDeclineFriendRequest || (() => {})}
        onRemoveFriend={onRemoveFriend || (() => {})}
        onToggleFollowUser={onToggleFollowUser || (() => {})}
        onViewProfile={onViewProfile || (() => {})}
      />

      {/* MODAL 2: SEARCH USERS */}
      <UserSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        currentUser={currentUser}
        allUsers={allUsers}
        friendships={friendships}
        userFollows={userFollows}
        onSendFriendRequest={onSendFriendRequest || (() => {})}
        onAcceptFriendRequest={onAcceptFriendRequest || (() => {})}
        onDeclineFriendRequest={onDeclineFriendRequest || (() => {})}
        onRemoveFriend={onRemoveFriend || (() => {})}
        onToggleFollowUser={onToggleFollowUser || (() => {})}
        onViewProfile={onViewProfile || (() => {})}
      />

      {/* MODAL 3: SOCIAL NOTIFICATIONS */}
      <SocialNotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={socialNotifications}
        currentUser={currentUser}
        onAcceptFriendRequest={onAcceptFriendRequest || (() => {})}
        onDeclineFriendRequest={onDeclineFriendRequest || (() => {})}
        onMarkAsRead={onMarkNotificationAsRead || (() => {})}
        onMarkAllAsRead={onMarkAllNotificationsAsRead || (() => {})}
        onViewProfile={onViewProfile || (() => {})}
      />

      {/* MODAL 4: EDIT PROFILE */}
      {isEditProfileModalOpen && isOwnProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#0B3D91]" />
                <h3 className="font-heading font-black text-slate-900 text-base">
                  Editar Perfil do Cliente
                </h3>
              </div>
              <button
                onClick={() => setIsEditProfileModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
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
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-[#0B3D91] focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-2xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0B3D91] hover:bg-[#082C69] text-white text-xs font-heading font-black uppercase rounded-2xl shadow-xs transition-all cursor-pointer"
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
                <Camera className="w-5 h-5 text-[#0B3D91]" />
                <h3 className="font-heading font-black text-slate-900 text-base">
                  Alterar Foto de Perfil
                </h3>
              </div>
              <button
                onClick={() => setIsEditPhotoModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
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
                      ? 'border-[#0B3D91] shadow-md ring-2 ring-[#0B3D91]/30'
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
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
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
                <Settings className="w-5 h-5 text-[#0B3D91]" />
                <h3 className="font-heading font-black text-slate-900 text-base">
                  Configurações e Privacidade
                </h3>
              </div>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Merchant Upgrade Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-orange-50 border border-blue-200 flex items-center justify-between gap-3">
              <div>
                <strong className="text-xs font-heading font-black text-[#0B3D91] block">
                  Você tem um negócio em Salvador?
                </strong>
                <span className="text-[11px] text-slate-600">
                  Cadastre sua loja por R$ 12/mês no SALVÔ e alcance clientes do seu bairro.
                </span>
              </div>
              <button
                onClick={() => {
                  setIsSettingsModalOpen(false);
                  onNavigateToMerchantRegister();
                }}
                className="px-3.5 py-2 bg-[#0B3D91] hover:bg-[#082C69] text-white text-xs font-bold rounded-xl shrink-0 transition-colors cursor-pointer"
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
                  className="w-4 h-4 text-[#0B3D91] rounded accent-[#0B3D91] cursor-pointer"
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
                  className="w-4 h-4 text-[#0B3D91] rounded accent-[#0B3D91] cursor-pointer"
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
                  className="w-4 h-4 text-[#0B3D91] rounded accent-[#0B3D91] cursor-pointer"
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
                className="px-5 py-2.5 bg-[#0B3D91] hover:bg-[#082C69] text-white text-xs font-heading font-black uppercase rounded-2xl transition-all cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: CONFIRM BLOCK USER */}
      {confirmBlockUser && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
              <Ban className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-heading font-black text-slate-900">
                Bloquear {confirmBlockUser.name}?
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Ao bloquear este usuário, as publicações e comentários dele serão ocultados para você. Você poderá desbloqueá-lo a qualquer momento.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmBlockUser(null)}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleBlockUserAction(confirmBlockUser)}
                className="flex-1 py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
              >
                Sim, Bloquear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
