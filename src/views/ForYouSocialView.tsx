import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { User, Store, Offer, EventItem, ActiveTab } from '../types';
import { isValidPublicStore } from '../utils/storeValidation';
import { BonfimRibbon } from '../components/BonfimRibbon';
import {
  canDeleteComment,
  canEditComment,
  blockUser,
  unblockUser,
  isUserBlocked,
  getBlockedUsers,
  BlockedUserInfo,
} from '../utils/socialModeration';
import {
  Sparkles,
  MapPin,
  Flame,
  Calendar,
  Heart,
  MessageCircle,
  MessageSquare,
  Share2,
  Store as StoreIcon,
  PlusCircle,
  Search,
  Download,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  Check,
  Copy,
  Compass,
  X,
  Send,
  ExternalLink,
  User as UserIcon,
  UploadCloud,
  CheckCircle2,
  Phone,
  QrCode,
  Smartphone,
  Layers,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Pencil,
  Trash2,
  AlertTriangle,
  Ban,
  UserX,
} from 'lucide-react';

export interface ForYouSocialViewProps {
  currentUser: User;
  stores: Store[];
  events: EventItem[];
  onSelectStore: (store: Store) => void;
  onOpenChat: (store: Store, initialMessage?: string) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenAuth?: () => void;
  onOpenMerchantRegister?: () => void;
  onRoleChange?: (role: 'client' | 'merchant' | 'admin') => void;
  favoriteStoreIds?: string[];
  onToggleFavoriteStore?: (storeId: string) => void;
  unreadMessagesCount?: number;
  activeOffersCount?: number;
  favoritesCount?: number;
}

export interface MediaFeedItem {
  id: string;
  store: Store;
  offer?: Offer;
  type: 'video' | 'image';
  mediaUrl: string;
  posterUrl?: string;
  caption: string;
  likesCount: number;
  initialLiked?: boolean;
  sharesCount: number;
  wantsCount: number;
  commentsCount: number;
  badge?: string;
  tags?: string[];
  comments: FeedComment[];
}

export interface FeedComment {
  id: string;
  userId?: string;
  userName: string;
  userAvatar: string;
  userNeighborhood?: string;
  text: string;
  timestamp: string;
  likes: number;
  edited?: boolean;
}

// Curated high quality vertical/horizontal video clips themed for Salvador's authentic commerce
const MOCK_STORE_VIDEOS: Record<string, { videoUrl: string; caption: string; tags: string[]; initialComments: FeedComment[] }> = {
  'store-1': {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-serving-an-acai-bowl-with-fresh-fruits-43180-large.mp4',
    caption: 'Açaí puro batido na hora com banana, cupuaçu cremoso e granola crocante com vista pro mar do Porto da Barra! 🍨🌊',
    tags: ['PortoDaBarra', 'AcaiPuro', 'Salvador'],
    initialComments: [
      {
        id: 'c1-1',
        userName: 'Mariana Costa',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        userNeighborhood: 'Graça',
        text: 'O melhor açaí pós-praia de Salvador! O creme de cupuaçu é surreal de bom.',
        timestamp: 'há 20 min',
        likes: 14,
      },
      {
        id: 'c1-2',
        userName: 'Thiago Bahia',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        userNeighborhood: 'Barra',
        text: 'Atendimento impecável! O desconto pelo SALVÔ funcionou na hora.',
        timestamp: 'há 1 hora',
        likes: 8,
      },
    ],
  },
  'store-2': {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-waves-crashing-on-a-tropical-beach-42998-large.mp4',
    caption: 'Coleção Verão 2026 de biquínis e saídas de linho com proteção UV50+ inspirada nas cores do litoral baiano! 👙🌴',
    tags: ['ModaPraia', 'FarolDaBarra', 'VeraoSsa'],
    initialComments: [
      {
        id: 'c2-1',
        userName: 'Camila Menezes',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        userNeighborhood: 'Ondina',
        text: 'As peças de linho têm um caimento perfeito! Comprei ontem.',
        timestamp: 'há 2 horas',
        likes: 19,
      },
    ],
  },
  'store-3': {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-artisan-working-on-a-ceramic-pottery-piece-43261-large.mp4',
    caption: 'Fitinhas do Bonfim bordadas, berimbaus mirins e cerâmicas artesanais moldadas no coração do Pelourinho! 🏺✨',
    tags: ['Pelourinho', 'ArtesanatoBaiano', 'Axé'],
    initialComments: [
      {
        id: 'c3-1',
        userName: 'Rodrigo Santoro',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        userNeighborhood: 'Santo Antônio',
        text: 'Valorização pura da nossa cultura e dos artesãos locais. Axé!',
        timestamp: 'há 3 horas',
        likes: 27,
      },
    ],
  },
  'store-4': {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-barber-styling-a-clients-hair-with-scissors-43283-large.mp4',
    caption: 'Degradê na navalha, barboterapia com toalha quente e chopp artesanal cortesia na Pituba! 💈✂️',
    tags: ['Barbearia', 'Pituba', 'EstiloSSA'],
    initialComments: [
      {
        id: 'c4-1',
        userName: 'Lucas Azevedo',
        userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
        userNeighborhood: 'Itaigara',
        text: 'Corte na régua e chopp trincando de gelado! Recomendo muito.',
        timestamp: 'há 4 horas',
        likes: 12,
      },
    ],
  },
  'store-6': {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-traditional-dish-in-a-pan-43094-large.mp4',
    caption: 'Acarajé frito no azeite de dendê puro com vatapá bem temperado, caruru e camarão graúdo no Rio Vermelho! 🍤🔥',
    tags: ['Acaraje', 'RioVermelho', 'DendePuro'],
    initialComments: [
      {
        id: 'c6-1',
        userName: 'Dandara Reis',
        userAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150',
        userNeighborhood: 'Rio Vermelho',
        text: 'Massa crocante e o vatapá é o mais aveludado da cidade!',
        timestamp: 'há 30 min',
        likes: 35,
      },
    ],
  },
  'store-8': {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-surfer-riding-a-wave-in-the-ocean-43088-large.mp4',
    caption: 'Aluguel de pranchas e aulas de surf com instrutores credenciados nas melhores ondas de Stella Maris! 🏄‍♂️🌊',
    tags: ['SurfSalvador', 'StellaMaris', 'Praia'],
    initialComments: [
      {
        id: 'c8-1',
        userName: 'Felipe Santana',
        userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
        userNeighborhood: 'Flamengo',
        text: 'Instrutor super paciente, peguei minhas primeiras ondas na primeira aula!',
        timestamp: 'há 5 horas',
        likes: 22,
      },
    ],
  },
};

export const ForYouSocialView: React.FC<ForYouSocialViewProps> = ({
  currentUser,
  stores,
  events,
  onSelectStore,
  onOpenChat,
  onNavigateTab,
  onOpenAuth,
  onOpenMerchantRegister,
  onRoleChange,
  favoriteStoreIds = [],
  onToggleFavoriteStore,
  unreadMessagesCount = 0,
  activeOffersCount = 0,
  favoritesCount = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [expandedCaptionIndex, setExpandedCaptionIndex] = useState<number | null>(null);

  // Search input state inside sidebar/top bar
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Likes, wants, follow maps
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likeCountMap, setLikeCountMap] = useState<Record<string, number>>({});
  const [wantCountMap, setWantCountMap] = useState<Record<string, number>>({});
  const [followedMap, setFollowedMap] = useState<Record<string, boolean>>({});

  // Dynamic comments state map
  const [commentsMap, setCommentsMap] = useState<Record<string, FeedComment[]>>({});
  const [activeCommentsItem, setActiveCommentsItem] = useState<MediaFeedItem | null>(null);
  const [newCommentText, setNewCommentText] = useState<string>('');

  // Double tap heart burst
  const [heartBurst, setHeartBurst] = useState<{ id: string; x: number; y: number } | null>(null);
  const lastTapRef = useRef<number>(0);

  // Video progress map (0 to 100)
  const [progressMap, setProgressMap] = useState<Record<number, number>>({});

  // Share modal state
  const [shareModalItem, setShareModalItem] = useState<MediaFeedItem | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Download App Modal
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);

  // Merchant Post Modal
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);
  const [postTitle, setPostTitle] = useState<string>('');
  const [postCaption, setPostCaption] = useState<string>('');
  const [postNeighborhood, setPostNeighborhood] = useState<string>('Rio Vermelho');
  const [postType, setPostType] = useState<'video' | 'image'>('video');
  const [postSuccessToast, setPostSuccessToast] = useState<boolean>(false);

  // Interest feedback toast
  const [interestToast, setInterestToast] = useState<string | null>(null);

  // Comments management states (Alterar, Apagar e Excluir)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState<string>('');
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [commentToast, setCommentToast] = useState<{ message: string; type: 'success' | 'danger' | 'info' } | null>(null);

  // User Blocking state
  const [blockedUsers, setBlockedUsers] = useState<BlockedUserInfo[]>(() => getBlockedUsers(currentUser.id));
  const [confirmBlockUser, setConfirmBlockUser] = useState<{ id: string; name: string; avatar?: string } | null>(null);

  useEffect(() => {
    setBlockedUsers(getBlockedUsers(currentUser.id));
  }, [currentUser.id]);

  const handleBlockUserAction = (userToBlock: { id: string; name: string; avatar?: string }) => {
    const updated = blockUser(currentUser.id, userToBlock);
    setBlockedUsers(updated);
    setConfirmBlockUser(null);
    showCommentToast(`Usuário ${userToBlock.name} foi bloqueado com sucesso.`, 'info');
  };

  const handleUnblockUserAction = (targetUserId: string, targetUserName: string) => {
    const updated = unblockUser(currentUser.id, targetUserId);
    setBlockedUsers(updated);
    showCommentToast(`Usuário ${targetUserName} foi desbloqueado.`, 'success');
  };

  const isMerchant = currentUser.role === 'merchant';
  const userHandle = `@${currentUser.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  // Initialize follow map from favoriteStoreIds
  useEffect(() => {
    const map: Record<string, boolean> = {};
    favoriteStoreIds.forEach((id) => {
      map[id] = true;
    });
    setFollowedMap(map);
  }, [favoriteStoreIds]);

  // Build feed items from valid stores
  const feedItems: MediaFeedItem[] = useMemo(() => {
    const valid = stores.filter(isValidPublicStore);
    if (valid.length === 0) return [];

    let filtered = valid;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = valid.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.neighborhood.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) filtered = valid;

    const items: MediaFeedItem[] = [];

    filtered.forEach((store) => {
      const bestOffer = store.offers && store.offers.length > 0 ? store.offers[0] : undefined;
      const videoConfig = MOCK_STORE_VIDEOS[store.id];

      const initialComments = videoConfig?.initialComments || [
        {
          id: `c-default-${store.id}`,
          userName: 'Morador de Salvador',
          userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          userNeighborhood: store.neighborhood,
          text: `Adoro o atendimento da ${store.name}! Super recomendado.`,
          timestamp: 'há 1 hora',
          likes: 5,
        },
      ];

      if (videoConfig) {
        items.push({
          id: `feed-${store.id}-video`,
          store,
          offer: bestOffer,
          type: 'video',
          mediaUrl: videoConfig.videoUrl,
          posterUrl: store.coverImage || store.logo,
          caption: videoConfig.caption || store.description,
          likesCount: (store.reviewCount || 10) * 4 + 18,
          sharesCount: Math.floor((store.reviewCount || 5) * 1.5) + 3,
          wantsCount: Math.floor((store.reviewCount || 5) * 2.2) + 7,
          commentsCount: initialComments.length + 4,
          badge: bestOffer ? bestOffer.discountBadge : undefined,
          tags: videoConfig.tags,
          comments: initialComments,
        });
      } else {
        const img = store.coverImage || (store.galleryImages && store.galleryImages[0]) || store.logo;
        items.push({
          id: `feed-${store.id}-img`,
          store,
          offer: bestOffer,
          type: 'image',
          mediaUrl: img,
          caption: store.description,
          likesCount: (store.reviewCount || 6) * 3 + 12,
          sharesCount: Math.floor((store.reviewCount || 4) * 1.2) + 2,
          wantsCount: Math.floor((store.reviewCount || 4) * 1.8) + 5,
          commentsCount: initialComments.length + 2,
          badge: bestOffer ? bestOffer.discountBadge : undefined,
          tags: [store.category.replace(/[^a-zA-Z0-9]/g, ''), store.neighborhood.replace(/[^a-zA-Z0-9]/g, '')],
          comments: initialComments,
        });
      }
    });

    return items;
  }, [stores, searchQuery]);

  // Scroll to index helper
  const scrollToIndex = useCallback((index: number) => {
    if (!containerRef.current) return;
    const target = containerRef.current.children[index] as HTMLElement;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing in input, don't hijack keys
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (activeIndex < feedItems.length - 1) {
          const next = activeIndex + 1;
          setActiveIndex(next);
          scrollToIndex(next);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activeIndex > 0) {
          const prev = activeIndex - 1;
          setActiveIndex(prev);
          scrollToIndex(prev);
        }
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'm') {
        e.preventDefault();
        setIsMuted((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, feedItems.length, scrollToIndex]);

  // Intersection observer to track active slide
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) {
              setActiveIndex(index);
              setIsPlaying(true);
              setExpandedCaptionIndex(null);
            }
          }
        });
      },
      { root: container, threshold: 0.6 }
    );

    Array.from(container.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [feedItems]);

  // Handle Like
  const handleToggleLike = (item: MediaFeedItem) => {
    const isLiked = likedMap[item.id] || false;
    setLikedMap((prev) => ({ ...prev, [item.id]: !isLiked }));
    setLikeCountMap((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] ?? item.likesCount) + (isLiked ? -1 : 1),
    }));
  };

  // Double tap to like
  const handleMediaTap = (e: React.MouseEvent<HTMLDivElement>, item: MediaFeedItem) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setHeartBurst({ id: `${item.id}-${now}`, x, y });
      setTimeout(() => setHeartBurst(null), 900);

      if (!likedMap[item.id]) {
        setLikedMap((prev) => ({ ...prev, [item.id]: true }));
        setLikeCountMap((prev) => ({
          ...prev,
          [item.id]: (prev[item.id] ?? item.likesCount) + 1,
        }));
      }
    } else {
      setIsPlaying((prev) => !prev);
    }
    lastTapRef.current = now;
  };

  // Handle "Eu Quero" action
  const handleEuQuero = (item: MediaFeedItem) => {
    setWantCountMap((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] ?? item.wantsCount) + 1,
    }));

    const offerTitle = item.offer ? ` "${item.offer.title}" (${item.offer.discountBadge})` : '';
    const initialMsg = `Olá! Vi a publicação de vocês no SALVÔ Para Mim e tenho muito interesse na oferta${offerTitle}!`;

    setInterestToast(`Interesse registrado em ${item.store.name}! Abrindo atendimento no Chat...`);
    setTimeout(() => {
      setInterestToast(null);
      onOpenChat(item.store, initialMsg);
    }, 1200);
  };

  // Handle Follow store
  const handleToggleFollow = (storeId: string) => {
    const isFollowed = followedMap[storeId] || false;
    setFollowedMap((prev) => ({ ...prev, [storeId]: !isFollowed }));
    if (onToggleFavoriteStore) {
      onToggleFavoriteStore(storeId);
    }
  };

  // Handle Share
  const handleShare = async (item: MediaFeedItem) => {
    const shareData = {
      title: `${item.store.name} no SALVÔ`,
      text: `${item.store.name} em Salvador: ${item.caption}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Dismissed
      }
    } else {
      setShareModalItem(item);
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const showCommentToast = (message: string, type: 'success' | 'danger' | 'info' = 'success') => {
    setCommentToast({ message, type });
    setTimeout(() => {
      setCommentToast(null);
    }, 3000);
  };

  // Start editing a comment
  const handleStartEditComment = (comment: FeedComment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.text);
    setDeletingCommentId(null);
  };

  // Cancel comment edit
  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  // Save edited comment
  const handleSaveEditComment = (commentId: string) => {
    if (!activeCommentsItem || !editingCommentText.trim()) return;

    setCommentsMap((prev) => {
      const currentList = prev[activeCommentsItem.id] || activeCommentsItem.comments;
      return {
        ...prev,
        [activeCommentsItem.id]: currentList.map((c) =>
          c.id === commentId
            ? { ...c, text: editingCommentText.trim(), edited: true }
            : c
        ),
      };
    });

    setEditingCommentId(null);
    setEditingCommentText('');
    showCommentToast('Comentário alterado com sucesso!', 'success');
  };

  // Delete / Excluir comment
  const handleDeleteComment = (commentId: string) => {
    if (!activeCommentsItem) return;

    setCommentsMap((prev) => {
      const currentList = prev[activeCommentsItem.id] || activeCommentsItem.comments;
      return {
        ...prev,
        [activeCommentsItem.id]: currentList.filter((c) => c.id !== commentId),
      };
    });

    setDeletingCommentId(null);
    if (editingCommentId === commentId) {
      setEditingCommentId(null);
    }
    showCommentToast('Comentário apagado com sucesso!', 'danger');
  };

  // Handle Comments Submit
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCommentsItem || !newCommentText.trim()) return;

    const newComment: FeedComment = {
      id: `comment-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name || 'Você',
      userAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      userNeighborhood: currentUser.neighborhood || 'Salvador',
      text: newCommentText.trim(),
      timestamp: 'Agora',
      likes: 0,
    };

    setCommentsMap((prev) => {
      const currentList = prev[activeCommentsItem.id] || activeCommentsItem.comments;
      return {
        ...prev,
        [activeCommentsItem.id]: [newComment, ...currentList],
      };
    });

    setNewCommentText('');
    showCommentToast('Comentário publicado!', 'success');
  };

  // Handle Merchant Post Publish simulation
  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPostModalOpen(false);
    setPostSuccessToast(true);
    setTimeout(() => setPostSuccessToast(false), 3500);
  };

  const currentItem = feedItems[activeIndex] || feedItems[0];
  const currentComments = activeCommentsItem
    ? commentsMap[activeCommentsItem.id] || activeCommentsItem.comments
    : [];

  return (
    <div
      id="salvo-for-you-tiktok-layout"
      className="h-full w-full bg-black md:bg-white text-slate-900 flex flex-col font-sans overflow-hidden selection:bg-[#FFC72C] selection:text-[#0B3D91]"
    >
      {/* =========================================================
          BARRA SUPERIOR (FORA DAS 3 COLUNAS)
      ========================================================= */}
      <header className="shrink-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <BonfimRibbon height="h-1" />
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 h-13 sm:h-15 flex items-center justify-between gap-3 sm:gap-4">
          {/* Top Left: Logo SALVÔ */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => onNavigateTab('explore')}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
              title="Voltar ao início"
            >
              <div className="relative">
                <img
                  src="/salvo-logo.png"
                  alt="SALVÔ"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover border border-slate-200 shadow-xs group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://iili.io/CDs6WS1.jpg';
                  }}
                />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-heading font-black text-[#0B3D91] tracking-tight flex items-center gap-1">
                  SALVÔ
                  <span className="text-[#C1502E] font-serif text-xs sm:text-sm font-normal italic">Social</span>
                </span>
              </div>
            </div>

            {/* Salvador Active Badge */}
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F6E43]" />
              Salvador • BA
            </span>
          </div>

          {/* Top Center: Search Bar (Visible on desktop & tablet) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Pesquisar lojas, pratos, ofertas em Salvador..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-full bg-slate-100/90 border border-slate-200/90 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#0B3D91] focus:ring-2 focus:ring-[#0B3D91]/15 focus:outline-none transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Top Right: "Baixar app" (outline) + "Perfil/Entrar" (primary) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-heading font-bold text-xs transition-all active:scale-95 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#0B3D91]" />
              <span>Baixar app</span>
            </button>

            {currentUser.id ? (
              <button
                onClick={() => onNavigateTab('profile')}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-[#0B3D91] hover:bg-[#082e6d] text-white font-heading font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                title="Meu Perfil"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover border border-white/40"
                />
                <span className="hidden sm:inline truncate max-w-[100px]">{currentUser.name}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#0B3D91] hover:bg-[#082e6d] text-white font-heading font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================
          CORPO PRINCIPAL (3 COLUNAS EM TELA CHEIA - DESKTOP)
      ========================================================= */}
      <div className="flex-1 min-h-0 max-w-[1600px] w-full mx-auto flex overflow-hidden relative">
        {/* =========================================================
            1. SIDEBAR ESQUERDA (FIXA, FUNDO BRANCO, ~250px)
        ========================================================= */}
        <aside
          id="salvo-sidebar-left"
          className="hidden md:flex flex-col justify-between w-60 lg:w-68 shrink-0 bg-white border-r border-slate-200/90 h-full p-4 overflow-y-auto select-none"
        >
          <div className="space-y-4">
            {/* Search Input for Sidebar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#0B3D91] focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Navigation List */}
            <nav className="space-y-1.5" aria-label="Navegação Para Mim">
              {/* Para Mim (Active) */}
              <button
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#0B3D91]/10 text-[#0B3D91] font-heading font-black text-xs transition-all shadow-2xs cursor-default"
                aria-current="page"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#0B3D91] text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-4 h-4 fill-white" />
                  </div>
                  <span className="text-sm">Para Mim</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#C1502E] animate-pulse" />
              </button>

              {/* Mapa */}
              <button
                onClick={() => onNavigateTab('explore')}
                className="w-full flex items-center justify-between p-3 rounded-2xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-heading font-bold text-xs transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-sm">Mapa</span>
                </div>
              </button>

              {/* Ofertas */}
              <button
                onClick={() => onNavigateTab('offers')}
                className="w-full flex items-center justify-between p-3 rounded-2xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-heading font-bold text-xs transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#C1502E] flex items-center justify-center">
                    <Flame className="w-4 h-4 fill-[#C1502E]" />
                  </div>
                  <span className="text-sm">Ofertas</span>
                </div>
                {activeOffersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#C1502E] text-white shadow-2xs">
                    {activeOffersCount}
                  </span>
                )}
              </button>

              {/* Eventos */}
              <button
                onClick={() => onNavigateTab('events')}
                className="w-full flex items-center justify-between p-3 rounded-2xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-heading font-bold text-xs transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-sm">Eventos</span>
                </div>
              </button>

              {/* Favoritos */}
              <button
                onClick={() => onNavigateTab('favorites')}
                className="w-full flex items-center justify-between p-3 rounded-2xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-heading font-bold text-xs transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                  <span className="text-sm">Favoritos</span>
                </div>
                {favoritesCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-2xs">
                    {favoritesCount}
                  </span>
                )}
              </button>

              {/* Chat */}
              <button
                onClick={() => onNavigateTab('chat')}
                className="w-full flex items-center justify-between p-3 rounded-2xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-heading font-bold text-xs transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0B3D91] flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="text-sm">Chat</span>
                </div>
                {unreadMessagesCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#0B3D91] text-white animate-pulse">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>

              {/* Meu Negócio (se lojista) */}
              {isMerchant && (
                <button
                  onClick={() => onNavigateTab('merchant_dashboard')}
                  className="w-full flex items-center justify-between p-3 rounded-2xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-heading font-bold text-xs transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1F6E43] flex items-center justify-center">
                      <StoreIcon className="w-4 h-4" />
                    </div>
                    <span className="text-sm">Meu Negócio</span>
                  </div>
                </button>
              )}

              {/* Publicar (Atalho para Lojista ou Criador) */}
              {isMerchant && (
                <button
                  onClick={() => setIsPostModalOpen(true)}
                  className="w-full mt-2 flex items-center justify-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-[#C1502E] to-[#E5A000] text-white font-heading font-black text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publicar Foto/Vídeo</span>
                </button>
              )}
            </nav>
          </div>

          {/* Bottom Sidebar: User Profile & Institutional Footer */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            {currentUser.id ? (
              <div
                onClick={() => onNavigateTab('profile')}
                className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer group"
                role="button"
                tabIndex={0}
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 group-hover:border-[#0B3D91]"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#1F6E43] border border-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-heading font-black text-slate-900 truncate">
                    {currentUser.name}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium truncate block">
                    {isMerchant ? '🏪 Lojista Salvador' : currentUser.role === 'admin' ? '🛡️ Moderação' : '🌴 Cliente'}
                  </span>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="w-full py-2.5 rounded-xl bg-[#0B3D91] text-white font-heading font-black text-xs text-center shadow-xs hover:bg-[#082e6d] transition-all cursor-pointer"
              >
                Entrar no SALVÔ
              </button>
            )}

            {/* Small Institutional Footer */}
            <div className="text-[11px] text-slate-400 space-y-1">
              <div className="flex flex-wrap gap-x-2 gap-y-1 font-medium">
                <a href="#sobre" onClick={(e) => { e.preventDefault(); alert('SALVÔ — Guia Oficial do Comércio de Salvador'); }} className="hover:underline">Sobre</a>
                <span>•</span>
                <a href="#termos" onClick={(e) => { e.preventDefault(); alert('Termos de Uso do SALVÔ Salvador'); }} className="hover:underline">Termos</a>
                <span>•</span>
                <a href="#privacidade" onClick={(e) => { e.preventDefault(); alert('Política de Privacidade SALVÔ'); }} className="hover:underline">Privacidade</a>
              </div>
              <p className="text-[10px] text-slate-400">© 2026 SALVÔ Salvador</p>
            </div>
          </div>
        </aside>

        {/* =========================================================
            2. COLUNA CENTRAL (FEED VERTICAL 9:16 CENTRALIZADO)
            & 3. COLUNA DIREITA (AÇÕES FORA DO VÍDEO NO DESKTOP)
        ========================================================= */}
        <main className="flex-1 min-h-0 flex items-stretch md:items-center justify-center p-0 md:p-4 lg:p-6 relative overflow-hidden bg-black md:bg-[#F8FAFC]">
          {/* Feed Container Wrapper: Frame 9:16 + Right Action Bar */}
          <div className="flex items-end justify-center gap-4 lg:gap-6 w-full max-w-2xl h-full max-h-none md:max-h-[820px]">
            {/* 2. CENTRAL 9:16 FRAME */}
            <div className="relative w-full h-full max-w-full md:max-w-[380px] md:h-[calc(100vh-110px)] md:max-h-[760px] aspect-auto md:aspect-[9/16] rounded-none md:rounded-3xl overflow-hidden shadow-none md:shadow-2xl bg-black border-0 md:border md:border-slate-300 select-none flex flex-col justify-between">
              {/* Floating Vertical Navigation Arrows (Top & Bottom inside frame for quick switching) */}
              <button
                onClick={() => {
                  if (activeIndex > 0) {
                    const prev = activeIndex - 1;
                    setActiveIndex(prev);
                    scrollToIndex(prev);
                  }
                }}
                disabled={activeIndex === 0}
                className={`absolute top-12 right-3 z-30 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer ${
                  activeIndex === 0
                    ? 'bg-black/20 text-white/20 border-transparent cursor-not-allowed'
                    : 'bg-black/50 hover:bg-black/80 text-white border-white/20 hover:scale-105 active:scale-95 shadow-md'
                }`}
                title="Vídeo anterior (Seta cima)"
                aria-label="Vídeo anterior"
              >
                <ChevronUp className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (activeIndex < feedItems.length - 1) {
                    const next = activeIndex + 1;
                    setActiveIndex(next);
                    scrollToIndex(next);
                  }
                }}
                disabled={activeIndex === feedItems.length - 1}
                className={`absolute bottom-20 md:bottom-20 right-3 z-30 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer ${
                  activeIndex === feedItems.length - 1
                    ? 'bg-black/20 text-white/20 border-transparent cursor-not-allowed'
                    : 'bg-black/50 hover:bg-black/80 text-white border-white/20 hover:scale-105 active:scale-95 shadow-md'
                }`}
                title="Próximo vídeo (Seta baixo)"
                aria-label="Próximo vídeo"
              >
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Stories-style Progress Bars at the top */}
              <div className="absolute top-0 inset-x-0 z-30 pt-2 pb-2.5 px-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
                <div className="flex items-center gap-1.5 w-full mb-1.5">
                  {feedItems.map((_, idx) => {
                    const isPast = idx < activeIndex;
                    const isCurrent = idx === activeIndex;
                    const currentProgress = progressMap[idx] || 0;

                    return (
                      <div
                        key={idx}
                        className="h-1 flex-1 bg-white/25 rounded-full overflow-hidden backdrop-blur-xs cursor-pointer"
                        onClick={() => {
                          setActiveIndex(idx);
                          scrollToIndex(idx);
                        }}
                      >
                        <div
                          className="h-full bg-white transition-all duration-150 rounded-full"
                          style={{
                            width: isPast ? '100%' : isCurrent ? `${currentProgress}%` : '0%',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Sound & Mode indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C1502E] animate-pulse" />
                    <span className="text-[10px] font-heading font-black text-white uppercase tracking-wider">
                      Para Mim • Salvador
                    </span>
                  </div>

                  <button
                    onClick={() => setIsMuted((prev) => !prev)}
                    className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-transform active:scale-90 cursor-pointer"
                    title={isMuted ? 'Ativar som' : 'Desativar som'}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white/80" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
                  </button>
                </div>
              </div>

              {/* Vertical Snap Scroll Container */}
              <div
                ref={containerRef}
                className="w-full h-full overflow-y-scroll scrollbar-none select-none"
                style={{
                  scrollSnapType: 'y mandatory',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {feedItems.map((item, idx) => {
                  const isActive = idx === activeIndex;
                  const isFollowed = followedMap[item.store.id] ?? false;
                  const isCaptionExpanded = expandedCaptionIndex === idx;

                  return (
                    <div
                      key={item.id}
                      data-index={idx}
                      className="w-full h-full flex-shrink-0 relative overflow-hidden flex flex-col justify-between"
                      style={{
                        scrollSnapAlign: 'start',
                        scrollSnapStop: 'always',
                      }}
                    >
                      {/* MEDIA PLAYER / IMAGE COMPONENT */}
                      <div
                        className="absolute inset-0 z-0 bg-slate-950 cursor-pointer"
                        onClick={(e) => handleMediaTap(e, item)}
                      >
                        {item.type === 'video' ? (
                          <FeedVideoPlayer
                            videoUrl={item.mediaUrl}
                            posterUrl={item.posterUrl}
                            isActive={isActive}
                            isPlaying={isPlaying}
                            isMuted={isMuted}
                            onProgress={(prog) => {
                              setProgressMap((prev) => ({ ...prev, [idx]: prog }));
                            }}
                          />
                        ) : (
                          <FeedImagePlayer
                            imageUrl={item.mediaUrl}
                            isActive={isActive}
                            isPlaying={isPlaying}
                            onProgress={(prog) => {
                              setProgressMap((prev) => ({ ...prev, [idx]: prog }));
                            }}
                          />
                        )}

                        {/* Play/Pause Transient Icon Overlay */}
                        {!isPlaying && isActive && (
                          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/30 pointer-events-none">
                            <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-2xl">
                              <Play className="w-7 h-7 fill-white translate-x-0.5" />
                            </div>
                          </div>
                        )}

                        {/* Double Tap Flying Heart Particle */}
                        {heartBurst && heartBurst.id.startsWith(item.id) && (
                          <div
                            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-ping"
                            style={{ left: heartBurst.x, top: heartBurst.y }}
                          >
                            <Heart className="w-20 h-20 text-red-500 fill-red-500 drop-shadow-2xl" />
                          </div>
                        )}
                      </div>

                      {/* DARK GRADIENT OVERLAY (Bottom 45% for text legibility) */}
                      <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-10" />

                      {/* OVERLAY INFERIOR (Dados da Loja, Seguir, Legenda, Tags, Oferta) */}
                      <div className="relative z-20 w-full h-full flex flex-col justify-end p-3 sm:p-4 pb-3 md:pb-6 pointer-events-none">
                        <div className="pointer-events-auto space-y-1.5 sm:space-y-2 max-w-[82%] sm:max-w-[85%] md:max-w-full">
                          {/* Store Avatar + Name + Seguir */}
                          <div className="flex items-center gap-2">
                            <div
                              onClick={() => onSelectStore(item.store)}
                              className="flex items-center gap-2 group cursor-pointer"
                              role="button"
                              tabIndex={0}
                            >
                              <img
                                src={item.store.logo}
                                alt={item.store.name}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
                              />
                              <div className="min-w-0">
                                <h3 className="text-xs font-heading font-black text-white leading-tight drop-shadow-md truncate group-hover:text-amber-300">
                                  {item.store.name}
                                </h3>
                                <span className="text-[10px] text-slate-200 font-medium flex items-center gap-1 drop-shadow-xs">
                                  <MapPin className="w-2.5 h-2.5 text-[#E5A000] shrink-0" />
                                  <span className="truncate">{item.store.neighborhood} • Salvador</span>
                                </span>
                              </div>
                            </div>

                            {/* Follow Button */}
                            <button
                              onClick={() => handleToggleFollow(item.store.id)}
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-heading font-black transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1 shrink-0 ${
                                isFollowed
                                  ? 'bg-white/20 text-white border border-white/30'
                                  : 'bg-[#C1502E] hover:bg-[#a84324] text-white border border-white/20'
                              }`}
                            >
                              {isFollowed ? (
                                <>
                                  <Check className="w-2.5 h-2.5" />
                                  <span>Seguindo</span>
                                </>
                              ) : (
                                <span>Seguir</span>
                              )}
                            </button>
                          </div>

                          {/* Active Offer Pill Banner */}
                          {item.offer && (
                            <div
                              onClick={() => handleEuQuero(item)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#C1502E] via-amber-600 to-[#0B3D91] text-white text-[11px] font-black shadow-lg border border-white/30 cursor-pointer hover:brightness-110 active:scale-95 transition-all max-w-full"
                            >
                              <Flame className="w-3 h-3 text-amber-200 animate-pulse" />
                              <span className="truncate">{item.offer.discountBadge}</span>
                              <span className="text-white/80 font-normal text-[10px] hidden sm:inline truncate">
                                • {item.offer.title}
                              </span>
                            </div>
                          )}

                          {/* Caption */}
                          <div>
                            <p
                              className={`text-[11px] text-white/95 leading-relaxed font-normal drop-shadow-md ${
                                isCaptionExpanded ? '' : 'line-clamp-2'
                              }`}
                            >
                              {item.caption}
                            </p>
                            {item.caption && item.caption.length > 80 && (
                              <button
                                onClick={() =>
                                  setExpandedCaptionIndex((prev) => (prev === idx ? null : idx))
                                }
                                className="text-[10px] font-bold text-amber-300 hover:text-white mt-0.5 cursor-pointer underline"
                              >
                                {isCaptionExpanded ? 'ver menos' : 'ver mais'}
                              </button>
                            )}
                          </div>

                          {/* Chips */}
                          <div className="flex flex-wrap items-center gap-1 pt-0.5">
                            <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[9px] font-bold text-white border border-white/15">
                              {item.store.category}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md text-[9px] font-bold text-slate-200 border border-white/10">
                              📍 {item.store.neighborhood}
                            </span>
                            {item.tags?.map((t, tIdx) => (
                              <span key={tIdx} className="text-[9px] text-sky-200 font-medium">
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* MOBILE ONLY FLOATING OVERLAID ACTIONS (On right edge of video) */}
                        <div className="md:hidden absolute right-2 bottom-3 z-30 flex flex-col items-center gap-2.5 pointer-events-auto">
                          {/* Store Avatar */}
                          <div
                            onClick={() => onSelectStore(item.store)}
                            className="relative cursor-pointer"
                          >
                            <img
                              src={item.store.logo}
                              alt={item.store.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-lg"
                            />
                            {!isFollowed && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleFollow(item.store.id);
                                }}
                                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#C1502E] text-white flex items-center justify-center text-[10px] font-black border border-white shadow-md"
                              >
                                +
                              </button>
                            )}
                          </div>

                          {/* Like */}
                          <button
                            onClick={() => handleToggleLike(item)}
                            className="flex flex-col items-center"
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border ${
                                likedMap[item.id]
                                  ? 'bg-red-500/20 border-red-400 text-red-500'
                                  : 'bg-black/50 border-white/20 text-white'
                              }`}
                            >
                              <Heart
                                className={`w-5 h-5 ${
                                  likedMap[item.id] ? 'fill-red-500 text-red-500' : 'text-white'
                                }`}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-white drop-shadow-md mt-0.5">
                              {likeCountMap[item.id] ?? item.likesCount}
                            </span>
                          </button>

                          {/* Eu Quero */}
                          <button
                            onClick={() => handleEuQuero(item)}
                            className="flex flex-col items-center"
                          >
                            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#C1502E] to-[#E5A000] text-white flex items-center justify-center shadow-lg border border-white/40">
                              <Flame className="w-5 h-5 fill-white" />
                            </div>
                            <span className="text-[9px] font-black text-amber-300 drop-shadow-md mt-0.5">
                              Eu Quero
                            </span>
                          </button>

                          {/* Comentar */}
                          <button
                            onClick={() => setActiveCommentsItem(item)}
                            className="flex flex-col items-center"
                          >
                            <div className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md border border-white/20">
                              <MessageCircle className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold text-white drop-shadow-md mt-0.5">
                              {item.commentsCount}
                            </span>
                          </button>

                          {/* Compartilhar */}
                          <button
                            onClick={() => handleShare(item)}
                            className="flex flex-col items-center"
                          >
                            <div className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md border border-white/20">
                              <Share2 className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-[10px] font-bold text-white drop-shadow-md mt-0.5">
                              {item.sharesCount}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* =========================================================
                3. COLUNA DIREITA — AÇÕES NO DESKTOP (FORA DO VÍDEO SOBRE FUNDO BRANCO)
            ========================================================= */}
            <div
              id="salvo-desktop-actions-column"
              className="hidden md:flex flex-col items-center justify-end pb-4 gap-4 shrink-0"
            >
              {/* 1. Avatar da Loja com "+" de Seguir sobreposto */}
              <div className="flex flex-col items-center mb-1">
                <div
                  onClick={() => onSelectStore(currentItem.store)}
                  className="relative group cursor-pointer"
                  title={`Ver perfil de ${currentItem.store.name}`}
                >
                  <img
                    src={currentItem.store.logo}
                    alt={currentItem.store.name}
                    className="w-13 h-13 rounded-full object-cover border-2 border-slate-300 group-hover:border-[#0B3D91] shadow-md transition-all group-hover:scale-105"
                  />
                  {!followedMap[currentItem.store.id] ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFollow(currentItem.store.id);
                      }}
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#C1502E] hover:bg-[#a84324] text-white flex items-center justify-center text-xs font-black shadow-md border-2 border-white transition-transform hover:scale-115 active:scale-90 cursor-pointer"
                      title="Seguir loja"
                    >
                      +
                    </button>
                  ) : (
                    <div
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#1F6E43] text-white flex items-center justify-center text-[10px] font-black border-2 border-white"
                      title="Seguindo"
                    >
                      ✓
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Curtir (Coração) */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleToggleLike(currentItem)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-xs border cursor-pointer ${
                    likedMap[currentItem.id]
                      ? 'bg-rose-50 border-rose-200 text-[#C1502E]'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-200/80 text-slate-700'
                  }`}
                  title={likedMap[currentItem.id] ? 'Descurtir' : 'Curtir'}
                  aria-label="Curtir"
                >
                  <Heart
                    className={`w-6 h-6 transition-transform ${
                      likedMap[currentItem.id]
                        ? 'fill-[#C1502E] text-[#C1502E] scale-110'
                        : 'text-slate-700 stroke-[2]'
                    }`}
                  />
                </button>
                <span className="text-xs font-bold text-slate-700 mt-1">
                  {likeCountMap[currentItem.id] ?? currentItem.likesCount}
                </span>
              </div>

              {/* 3. "Eu Quero" (Visualmente destacado - Botão CTA Preenchido) */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleEuQuero(currentItem)}
                  className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#C1502E] via-amber-600 to-[#E5A000] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all border-2 border-white cursor-pointer"
                  title="Eu Quero! Falar diretamente com o estabelecimento"
                  aria-label="Eu Quero"
                >
                  <Flame className="w-7 h-7 fill-white text-white animate-pulse" />
                </button>
                <span className="text-[11px] font-heading font-black text-[#C1502E] tracking-tight mt-1">
                  Eu Quero
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  {wantCountMap[currentItem.id] ?? currentItem.wantsCount}
                </span>
              </div>

              {/* 4. Comentar (Balão) */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setActiveCommentsItem(currentItem)}
                  className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-700 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xs cursor-pointer"
                  title="Ver e adicionar comentários"
                  aria-label="Comentar"
                >
                  <MessageCircle className="w-6 h-6 stroke-[2]" />
                </button>
                <span className="text-xs font-bold text-slate-700 mt-1">
                  {(commentsMap[currentItem.id] || currentItem.comments).length}
                </span>
              </div>

              {/* 5. Compartilhar (Seta) */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleShare(currentItem)}
                  className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-700 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xs cursor-pointer"
                  title="Compartilhar publicação"
                  aria-label="Compartilhar"
                >
                  <Share2 className="w-5 h-5 stroke-[2]" />
                </button>
                <span className="text-xs font-bold text-slate-700 mt-1">
                  {currentItem.sharesCount}
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* =========================================================
          MOBILE BOTTOM TAB BAR (FIXA PARA DISPOSITIVOS MÓVEIS)
      ========================================================= */}
      <nav
        id="salvo-mobile-bottom-nav"
        className="md:hidden shrink-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-lg"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 4px)' }}
        aria-label="Navegação Mobile"
      >
        <div className="max-w-md mx-auto px-2 h-14 flex items-center justify-around">
          {/* Para Mim (Active) */}
          <button
            className="flex-1 flex flex-col items-center justify-center py-1 text-[#0B3D91]"
            aria-current="page"
          >
            <Sparkles className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[10px] font-heading font-black">Para Mim</span>
          </button>

          {/* Mapa */}
          <button
            onClick={() => onNavigateTab('explore')}
            className="flex-1 flex flex-col items-center justify-center py-1 text-slate-500 hover:text-slate-900"
          >
            <MapPin className="w-5 h-5 stroke-[1.75]" />
            <span className="text-[10px] font-medium">Mapa</span>
          </button>

          {/* Ofertas */}
          <button
            onClick={() => onNavigateTab('offers')}
            className="flex-1 flex flex-col items-center justify-center py-1 text-slate-500 hover:text-[#C1502E]"
          >
            <Flame className="w-5 h-5 stroke-[1.75]" />
            <span className="text-[10px] font-medium">Ofertas</span>
          </button>

          {/* Chat */}
          <button
            onClick={() => onNavigateTab('chat')}
            className="flex-1 flex flex-col items-center justify-center py-1 text-slate-500 hover:text-[#0B3D91] relative"
          >
            <MessageSquare className="w-5 h-5 stroke-[1.75]" />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-0 right-4 w-2 h-2 rounded-full bg-[#C1502E]" />
            )}
            <span className="text-[10px] font-medium">Chat</span>
          </button>

          {/* Perfil */}
          <button
            onClick={() => (currentUser.id ? onNavigateTab('profile') : onOpenAuth?.())}
            className="flex-1 flex flex-col items-center justify-center py-1 text-slate-500 hover:text-slate-900"
          >
            <UserIcon className="w-5 h-5 stroke-[1.75]" />
            <span className="text-[10px] font-medium">Perfil</span>
          </button>
        </div>
      </nav>

      {/* =========================================================
          MODAL / DRAWER DE COMENTÁRIOS
      ========================================================= */}
      {activeCommentsItem && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
          onClick={() => setActiveCommentsItem(null)}
        >
          <div
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[80vh] h-[520px] animate-scaleUp overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#0B3D91]" />
                <h3 className="font-heading font-black text-sm text-slate-900">
                  Comentários ({currentComments.length})
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveCommentsItem(null);
                  setEditingCommentId(null);
                  setDeletingCommentId(null);
                }}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Toast inside modal */}
            {commentToast && (
              <div
                className={`mx-4 mt-3 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between animate-fadeIn ${
                  commentToast.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : commentToast.type === 'danger'
                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {commentToast.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{commentToast.message}</span>
                </div>
                <button
                  onClick={() => setCommentToast(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {currentComments.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                  <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
                </div>
              ) : (
                currentComments.map((c) => {
                  const isEditing = editingCommentId === c.id;
                  const isDeleting = deletingCommentId === c.id;
                  const isBlocked = blockedUsers.some((u) => u.id === c.userId || u.name === c.userName);

                  // Permissões estritas:
                  // 1. Apenas o autor pode editar
                  const canEdit = canEditComment(c.userId, c.userName, currentUser.id, currentUser.name);
                  // 2. Apenas o autor OU o dono da loja/post pode deletar
                  const canDelete = canDeleteComment(
                    c.userId,
                    c.userName,
                    currentUser.id,
                    currentUser.name,
                    activeCommentsItem?.store?.id
                  );
                  // 3. Pode bloquear se não for o próprio usuário
                  const canBlock = !canEdit && (Boolean(c.userId) || Boolean(c.userName));

                  if (isBlocked) {
                    return (
                      <div
                        key={c.id}
                        className="p-3 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-slate-500"
                      >
                        <div className="flex items-center gap-2">
                          <Ban className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>
                            Comentário de <strong>{c.userName}</strong> (bloqueado)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleUnblockUserAction(c.userId || c.userName, c.userName)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg border border-slate-300 transition-all cursor-pointer shadow-2xs"
                        >
                          Desbloquear
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div key={c.id} className="flex items-start gap-3 group">
                      <img
                        src={c.userAvatar}
                        alt={c.userName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0 bg-slate-50 hover:bg-slate-100/80 transition-colors p-3 rounded-2xl border border-slate-100">
                        {/* Header: User details + Edit / Delete / Block Actions */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-bold text-xs text-slate-900 truncate">
                              {c.userName}
                            </span>
                            {c.edited && (
                              <span className="text-[10px] text-amber-600 font-medium italic shrink-0">
                                (editado)
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[10px] text-slate-400 mr-1">{c.timestamp}</span>

                            {/* Option: Alterar (Apenas o autor) */}
                            {canEdit && (
                              <button
                                onClick={() => handleStartEditComment(c)}
                                className="p-1 rounded-lg text-slate-400 hover:text-[#0B3D91] hover:bg-blue-50 transition-colors cursor-pointer"
                                title="Alterar meu comentário"
                                aria-label="Alterar meu comentário"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Option: Apagar / Excluir (Autor OU Dono da Loja) */}
                            {canDelete && (
                              <button
                                onClick={() => {
                                  setDeletingCommentId(c.id);
                                  if (isEditing) setEditingCommentId(null);
                                }}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title={
                                  canEdit
                                    ? 'Excluir meu comentário'
                                    : 'Excluir comentário da minha loja/post'
                                }
                                aria-label="Excluir comentário"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Option: Bloquear Usuário */}
                            {canBlock && (
                              <button
                                onClick={() =>
                                  setConfirmBlockUser({
                                    id: c.userId || c.userName,
                                    name: c.userName,
                                    avatar: c.userAvatar,
                                  })
                                }
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                                title={`Bloquear ${c.userName}`}
                                aria-label={`Bloquear ${c.userName}`}
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {c.userNeighborhood && (
                          <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                            📍 {c.userNeighborhood}
                          </span>
                        )}

                        {/* Comment Text or Inline Edit Form */}
                        {isEditing ? (
                          <div className="mt-2.5 space-y-2">
                            <textarea
                              value={editingCommentText}
                              onChange={(e) => setEditingCommentText(e.target.value)}
                              rows={2}
                              className="w-full p-2.5 rounded-xl bg-white border border-[#0B3D91] text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0B3D91] resize-none"
                              placeholder="Edite seu comentário..."
                              autoFocus
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={handleCancelEditComment}
                                className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                              >
                                Cancelar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEditComment(c.id)}
                                disabled={!editingCommentText.trim()}
                                className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                                  editingCommentText.trim()
                                    ? 'bg-[#0B3D91] hover:bg-[#082e6d] text-white shadow-xs'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                              >
                                <Check className="w-3 h-3" />
                                <span>Salvar Alteração</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-700 mt-1 leading-relaxed break-words">
                            {c.text}
                          </p>
                        )}

                        {/* Inline Delete Confirmation Alert */}
                        {isDeleting && (
                          <div className="mt-2.5 p-2.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2 animate-fadeIn">
                            <p className="text-[11px] text-rose-800 font-semibold flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                              <span>
                                {canEdit
                                  ? 'Deseja realmente apagar seu comentário?'
                                  : 'Deseja apagar este comentário feito na sua publicação?'}
                              </span>
                            </p>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setDeletingCommentId(null)}
                                className="px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                              >
                                Cancelar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteComment(c.id)}
                                className="px-2.5 py-0.5 text-[11px] font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-md flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Sim, Excluir</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="p-3 border-t border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Adicione um comentário..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 h-10 px-4 rounded-full bg-white border border-slate-200 text-xs font-medium focus:border-[#0B3D91] focus:ring-1 focus:ring-[#0B3D91] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    newCommentText.trim()
                      ? 'bg-[#0B3D91] text-white hover:bg-[#082e6d] shadow-sm active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL DE COMPARTILHAMENTO
      ========================================================= */}
      {shareModalItem && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShareModalItem(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-base font-heading font-black text-slate-900 flex items-center gap-2">
                <Share2 className="w-4.5 h-4.5 text-[#0B3D91]" />
                <span>Compartilhar Conteúdo</span>
              </h4>
              <button
                onClick={() => setShareModalItem(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <img
                  src={shareModalItem.store.logo}
                  alt={shareModalItem.store.name}
                  className="w-10 h-10 rounded-xl object-cover border"
                />
                <div className="min-w-0">
                  <span className="font-bold text-xs text-slate-900 truncate block">
                    {shareModalItem.store.name}
                  </span>
                  <span className="text-[11px] text-slate-500 truncate block">
                    {shareModalItem.store.neighborhood} • Salvador
                  </span>
                </div>
              </div>

              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Confira ${shareModalItem.store.name} no SALVÔ: ${shareModalItem.caption} ${window.location.href}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full h-11 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-heading font-black text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4.5 h-4.5" />
                <span>Enviar pelo WhatsApp</span>
              </a>

              {/* Copy Link */}
              <button
                onClick={handleCopyShareLink}
                className="w-full h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-heading font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-black">Link Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-600" />
                    <span>Copiar Link da Publicação</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL "BAIXAR APP" (PWA / QR CODE)
      ========================================================= */}
      {isDownloadModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsDownloadModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 animate-scaleUp text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <button
                onClick={() => setIsDownloadModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-[#0B3D91]/10 text-[#0B3D91] flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-7 h-7" />
            </div>

            <h3 className="font-heading font-black text-lg text-slate-900">
              Tenha o SALVÔ no seu celular
            </h3>
            <p className="text-xs text-slate-600 mt-1 mb-5">
              Instale o aplicativo direto no seu navegador sem ocupar espaço na memória.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-5 flex flex-col items-center">
              <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-xs border flex items-center justify-center">
                <QrCode className="w-32 h-32 text-slate-800" />
              </div>
              <span className="text-[11px] font-bold text-slate-500 mt-2">
                Aponte a câmera do seu smartphone
              </span>
            </div>

            <button
              onClick={() => {
                alert('Para instalar: abra o menu do seu navegador e clique em "Adicionar à Tela de Início"');
                setIsDownloadModalOpen(false);
              }}
              className="w-full py-3 rounded-2xl bg-[#0B3D91] hover:bg-[#082e6d] text-white font-heading font-black text-xs shadow-md transition-all active:scale-95"
            >
              Adicionar à Tela Inicial
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL "PUBLICAR FOTO/VÍDEO" (LOJISTA)
      ========================================================= */}
      {isPostModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsPostModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-black text-base text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#C1502E]" />
                <span>Publicar no SALVÔ Social</span>
              </h3>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishPost} className="py-4 space-y-3.5">
              {/* Type Switch */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPostType('video')}
                  className={`py-1.5 rounded-lg text-xs font-heading font-black transition-all ${
                    postType === 'video' ? 'bg-white text-[#0B3D91] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  🎬 Vídeo Vertical
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('image')}
                  className={`py-1.5 rounded-lg text-xs font-heading font-black transition-all ${
                    postType === 'image' ? 'bg-white text-[#0B3D91] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  📸 Foto / Galeria
                </button>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-300 hover:border-[#0B3D91] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/70">
                <UploadCloud className="w-8 h-8 text-[#0B3D91] mx-auto mb-1.5" />
                <span className="text-xs font-bold text-slate-800 block">
                  Selecione ou arraste seu {postType === 'video' ? 'vídeo vertical' : 'foto'}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Proporção recomendada: 9:16 (Stories/Reels)
                </span>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Legenda da publicação
                </label>
                <textarea
                  rows={3}
                  placeholder="Conte o que há de especial no seu prato, produto ou promoção..."
                  value={postCaption}
                  onChange={(e) => setPostCaption(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:border-[#0B3D91] focus:outline-none"
                  required
                />
              </div>

              {/* Neighborhood */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bairro</label>
                <select
                  value={postNeighborhood}
                  onChange={(e) => setPostNeighborhood(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:border-[#0B3D91] focus:outline-none"
                >
                  <option value="Rio Vermelho">Rio Vermelho</option>
                  <option value="Barra">Barra / Porto da Barra</option>
                  <option value="Pelourinho">Pelourinho / Centro Histórico</option>
                  <option value="Pituba">Pituba</option>
                  <option value="Itapuã">Itapuã</option>
                  <option value="Stella Maris">Stella Maris</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#C1502E] hover:bg-[#a84324] text-white font-heading font-black text-xs shadow-md transition-all active:scale-95"
              >
                Publicar Agora
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Block User Modal */}
      {confirmBlockUser && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
              <Ban className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-heading font-black text-slate-900">
                Bloquear {confirmBlockUser.name}?
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Ao bloquear este usuário, os comentários e publicações dele não aparecerão mais para você no feed. Você pode desbloqueá-lo a qualquer momento.
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

      {/* Post Success Toast */}
      {postSuccessToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-60 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl border border-white/20 backdrop-blur-md flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4.5 h-4.5" />
          <span>Publicação enviada com sucesso para o feed Para Mim!</span>
        </div>
      )}

      {/* Interest Confirmation Toast */}
      {interestToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-60 px-5 py-3 rounded-2xl bg-slate-900/95 text-white font-bold text-xs shadow-2xl border border-white/20 backdrop-blur-md flex items-center gap-2 animate-bounce">
          <Flame className="w-4.5 h-4.5 text-[#E5A000]" />
          <span>{interestToast}</span>
        </div>
      )}
    </div>
  );
};

// Internal Video Sub-component
interface FeedVideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  isActive: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  onProgress: (percent: number) => void;
}

const FeedVideoPlayer: React.FC<FeedVideoPlayerProps> = ({
  videoUrl,
  posterUrl,
  isActive,
  isPlaying,
  isMuted,
  onProgress,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive && isPlaying) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      video.pause();
    }
  }, [isActive, isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
  }, [isMuted]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const percent = (video.currentTime / video.duration) * 100;
    onProgress(percent);
  };

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      poster={posterUrl}
      playsInline
      loop
      muted={isMuted}
      preload="auto"
      onTimeUpdate={handleTimeUpdate}
      className="w-full h-full object-cover"
    />
  );
};

// Internal Image Sub-component
interface FeedImagePlayerProps {
  imageUrl: string;
  isActive: boolean;
  isPlaying: boolean;
  onProgress: (percent: number) => void;
}

const FeedImagePlayer: React.FC<FeedImagePlayerProps> = ({
  imageUrl,
  isActive,
  isPlaying,
  onProgress,
}) => {
  useEffect(() => {
    if (!isActive || !isPlaying) return;

    const DURATION = 6000;
    const INTERVAL = 100;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += INTERVAL;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      onProgress(pct);
      if (elapsed >= DURATION) {
        elapsed = 0;
      }
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [isActive, isPlaying, onProgress]);

  return (
    <img
      src={imageUrl}
      alt="Conteúdo SALVÔ"
      className="w-full h-full object-cover"
      loading="eager"
    />
  );
};
