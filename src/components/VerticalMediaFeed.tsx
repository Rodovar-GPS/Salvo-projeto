import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Store, User, Offer } from '../types';
import { isValidPublicStore } from '../utils/storeValidation';
import {
  X,
  Heart,
  Flame,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  Check,
  Copy,
  MessageCircle,
  Sparkles,
  MapPin,
  ExternalLink,
  Store as StoreIcon,
  Video as VideoIcon,
  ShoppingBag,
} from 'lucide-react';

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
  badge?: string;
  tags?: string[];
}

interface VerticalMediaFeedProps {
  isOpen: boolean;
  onClose: () => void;
  stores: Store[];
  currentUser?: User;
  onSelectStore: (store: Store) => void;
  onOpenChat: (store: Store, initialMessage?: string) => void;
  favoriteStoreIds?: string[];
  onToggleFavorite?: (storeId: string) => void;
  initialStoreId?: string;
}

// Curated high quality vertical/horizontal video clips themed for Salvador's authentic commerce
const MOCK_STORE_VIDEOS: Record<string, { videoUrl: string; caption: string; tags: string[] }> = {
  'store-1': {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-serving-an-acai-bowl-with-fresh-fruits-43180-large.mp4',
    caption: 'Açaí puro batido na hora com banana, cupuaçu cremoso e granola crocante com vista pro mar do Porto da Barra! 🍨🌊',
    tags: ['PortoDaBarra', 'AcaiPuro', 'Salvador'],
  },
  'store-2': {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-waves-crashing-on-a-tropical-beach-42998-large.mp4',
    caption: 'Coleção Verão 2026 de biquínis e saídas de linho com proteção UV50+ inspirada nas cores do litoral baiano! 👙🌴',
    tags: ['ModaPraia', 'FarolDaBarra', 'VeraoSsa'],
  },
  'store-3': {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-artisan-working-on-a-ceramic-pottery-piece-43261-large.mp4',
    caption: 'Fitinhas do Bonfim bordadas, berimbaus mirins e cerâmicas artesanais moldadas no coração do Pelourinho! 🏺✨',
    tags: ['Pelourinho', 'ArtesanatoBaiano', 'Axé'],
  },
  'store-4': {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-barber-styling-a-clients-hair-with-scissors-43283-large.mp4',
    caption: 'Degradê na navalha, barboterapia com toalha quente e chopp artesanal cortesia na Pituba! 💈✂️',
    tags: ['Barbearia', 'Pituba', 'EstiloSSA'],
  },
  'store-6': {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-traditional-dish-in-a-pan-43094-large.mp4',
    caption: 'Acarajé frito no azeite de dendê puro com vatapá bem temperado, caruru e camarão graúdo no Rio Vermelho! 🍤🔥',
    tags: ['Acaraje', 'RioVermelho', 'DendePuro'],
  },
  'store-8': {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-surfer-riding-a-wave-in-the-ocean-43088-large.mp4',
    caption: 'Aluguel de pranchas e aulas de surf com instrutores credenciados nas melhores ondas de Stella Maris! 🏄‍♂️🌊',
    tags: ['SurfSalvador', 'StellaMaris', 'Praia'],
  },
};

export const VerticalMediaFeed: React.FC<VerticalMediaFeedProps> = ({
  isOpen,
  onClose,
  stores,
  currentUser,
  onSelectStore,
  onOpenChat,
  favoriteStoreIds = [],
  onToggleFavorite,
  initialStoreId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [expandedCaptionIndex, setExpandedCaptionIndex] = useState<number | null>(null);

  // Likes and Wants local state tracking
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likeCountMap, setLikeCountMap] = useState<Record<string, number>>({});
  const [wantCountMap, setWantCountMap] = useState<Record<string, number>>({});
  const [followedMap, setFollowedMap] = useState<Record<string, boolean>>({});

  // Floating heart animation for double tap
  const [heartBurst, setHeartBurst] = useState<{ id: string; x: number; y: number } | null>(null);
  const lastTapRef = useRef<number>(0);

  // Video progress map (percentage 0 to 100)
  const [progressMap, setProgressMap] = useState<Record<number, number>>({});

  // Share modal state
  const [shareModalItem, setShareModalItem] = useState<MediaFeedItem | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Interest feedback toast
  const [interestToast, setInterestToast] = useState<string | null>(null);

  // Build feed items from valid stores & offers
  const feedItems: MediaFeedItem[] = useMemo(() => {
    const valid = stores.filter(isValidPublicStore);
    if (valid.length === 0) return [];

    const items: MediaFeedItem[] = [];

    valid.forEach((store) => {
      const bestOffer = store.offers && store.offers.length > 0 ? store.offers[0] : undefined;
      const videoConfig = MOCK_STORE_VIDEOS[store.id];

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
          badge: bestOffer ? bestOffer.discountBadge : undefined,
          tags: videoConfig.tags,
        });
      } else {
        // High quality static image item
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
          badge: bestOffer ? bestOffer.discountBadge : undefined,
          tags: [store.category.replace(/[^a-zA-Z0-9]/g, ''), store.neighborhood.replace(/[^a-zA-Z0-9]/g, '')],
        });
      }
    });

    return items;
  }, [stores]);

  // Jump to initial store if specified
  useEffect(() => {
    if (isOpen && initialStoreId && feedItems.length > 0) {
      const idx = feedItems.findIndex((item) => item.store.id === initialStoreId);
      if (idx !== -1) {
        setActiveIndex(idx);
        scrollToIndex(idx);
      }
    }
  }, [isOpen, initialStoreId, feedItems]);

  // Initialize follow map from favoriteStoreIds
  useEffect(() => {
    const map: Record<string, boolean> = {};
    favoriteStoreIds.forEach((id) => {
      map[id] = true;
    });
    setFollowedMap(map);
  }, [favoriteStoreIds]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Scroll to index helper
  const scrollToIndex = useCallback((index: number) => {
    if (!containerRef.current) return;
    const target = containerRef.current.children[index] as HTMLElement;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Keyboard navigation (Escape, Up, Down, Space, M)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
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
  }, [isOpen, activeIndex, feedItems.length, onClose, scrollToIndex]);

  // Handle scroll events with IntersectionObserver to accurately track the active slide
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

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
      {
        root: container,
        threshold: 0.6,
      }
    );

    Array.from(container.children).forEach((child) => observer.observe(child));

    return () => {
      observer.disconnect();
    };
  }, [isOpen, feedItems]);

  // Handle like toggle
  const handleToggleLike = (item: MediaFeedItem) => {
    const isLiked = likedMap[item.id] || false;
    setLikedMap((prev) => ({ ...prev, [item.id]: !isLiked }));
    setLikeCountMap((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] ?? item.likesCount) + (isLiked ? -1 : 1),
    }));
  };

  // Handle double tap anywhere on media to like with heart animation
  const handleMediaTap = (e: React.MouseEvent<HTMLDivElement>, item: MediaFeedItem) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected!
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
      // Single tap -> toggle Play/Pause
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
    const initialMsg = `Olá! Vi a publicação de vocês no Fotos & Vídeos do SALVÔ e tenho interesse na oferta${offerTitle}!`;

    setInterestToast(`Interesse registrado em ${item.store.name}! Abrindo atendimento...`);
    setTimeout(() => {
      setInterestToast(null);
      onClose();
      onOpenChat(item.store, initialMsg);
    }, 1200);
  };

  // Handle Follow store
  const handleToggleFollow = (storeId: string) => {
    const isFollowed = followedMap[storeId] || false;
    setFollowedMap((prev) => ({ ...prev, [storeId]: !isFollowed }));
    if (onToggleFavorite) {
      onToggleFavorite(storeId);
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
        // User dismissed share
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

  if (!isOpen || feedItems.length === 0) return null;

  const currentItem = feedItems[activeIndex] || feedItems[0];

  return (
    <div
      id="salvo-vertical-feed-root"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl transition-opacity animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Feed de Fotos e Vídeos do SALVÔ"
    >
      {/* Desktop External Close Button */}
      <button
        onClick={onClose}
        className="hidden md:flex absolute top-6 right-6 z-50 items-center justify-center w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 transition-all shadow-xl cursor-pointer hover:scale-105 active:scale-95"
        title="Fechar feed (Esc)"
        aria-label="Fechar feed"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Desktop Navigation Floating Arrows (Left/Right beside phone frame) */}
      <div className="hidden md:flex flex-col gap-3 absolute right-12 bottom-1/2 translate-y-1/2 z-50">
        <button
          onClick={() => {
            if (activeIndex > 0) {
              const prev = activeIndex - 1;
              setActiveIndex(prev);
              scrollToIndex(prev);
            }
          }}
          disabled={activeIndex === 0}
          className={`w-12 h-12 rounded-full flex items-center justify-center border backdrop-blur-md transition-all shadow-lg cursor-pointer ${
            activeIndex === 0
              ? 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
              : 'bg-white/15 border-white/25 text-white hover:bg-white/25 hover:scale-110 active:scale-95'
          }`}
          title="Vídeo anterior (Seta para cima)"
        >
          <ChevronUp className="w-6 h-6" />
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
          className={`w-12 h-12 rounded-full flex items-center justify-center border backdrop-blur-md transition-all shadow-lg cursor-pointer ${
            activeIndex === feedItems.length - 1
              ? 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
              : 'bg-white/15 border-white/25 text-white hover:bg-white/25 hover:scale-110 active:scale-95'
          }`}
          title="Próximo vídeo (Seta para baixo)"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile 100% Viewport / Desktop 9:16 Phone Mockup Container */}
      <div
        className="w-full h-full md:w-[410px] md:h-[840px] md:max-h-[92vh] md:aspect-[9/16] md:rounded-[44px] md:border-[10px] md:border-slate-800 md:shadow-2xl md:ring-1 md:ring-white/20 bg-black relative flex flex-col overflow-hidden"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Desktop Phone Top Bezel / Dynamic Notch */}
        <div className="hidden md:flex absolute top-2 left-1/2 -translate-x-1/2 z-40 w-32 h-4.5 bg-slate-900 rounded-full items-center justify-center border border-white/10">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-700/80 mr-3" />
          <div className="w-10 h-1 bg-slate-800 rounded-full" />
        </div>

        {/* Global Floating Header (Overlaid on active media) */}
        <div className="absolute top-0 inset-x-0 z-30 pt-3 pb-4 px-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
          {/* Stories-style Progress Bars at the very top */}
          <div className="flex items-center gap-1.5 w-full mb-3">
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

          {/* Top Bar Controls */}
          <div className="flex items-center justify-between">
            {/* Top Left: Close (X) + Brand / Mode Label */}
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="w-8.5 h-8.5 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-transform active:scale-90 cursor-pointer"
                title="Voltar para Para Mim"
                aria-label="Voltar para Para Mim"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15">
                <span className="w-2 h-2 rounded-full bg-[#C1502E] animate-pulse" />
                <span className="text-[11px] font-heading font-black text-white tracking-wide uppercase">
                  Fotos & Vídeos
                </span>
              </div>
            </div>

            {/* Top Right: Sound Toggle + Item Index Badge */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted((prev) => !prev)}
                className="w-8.5 h-8.5 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-transform active:scale-90 cursor-pointer"
                title={isMuted ? 'Ativar som' : 'Desativar som'}
                aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
              >
                {isMuted ? <VolumeX className="w-4.5 h-4.5 text-white/80" /> : <Volume2 className="w-4.5 h-4.5 text-white" />}
              </button>

              <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white/90">
                {activeIndex + 1}/{feedItems.length}
              </span>
            </div>
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
            const isLiked = likedMap[item.id] ?? item.initialLiked ?? false;
            const currentLikes = likeCountMap[item.id] ?? item.likesCount;
            const currentWants = wantCountMap[item.id] ?? item.wantsCount;
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
                {/* 1. MEDIA PLAYER / IMAGE COMPONENT */}
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
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/25 pointer-events-none">
                      <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-2xl">
                        <Play className="w-8 h-8 fill-white translate-x-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Double Tap Flying Heart Particle */}
                  {heartBurst && heartBurst.id.startsWith(item.id) && (
                    <div
                      className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-ping"
                      style={{ left: heartBurst.x, top: heartBurst.y }}
                    >
                      <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-2xl" />
                    </div>
                  )}
                </div>

                {/* 2. GRADIENT OVERLAY (Bottom 40% for guaranteed text legibility) */}
                <div
                  className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-10"
                />

                {/* 3. FOREGROUND CONTENT & CONTROLS */}
                <div className="relative z-20 w-full h-full flex flex-col justify-end p-4 pb-6 sm:pb-8 pointer-events-none">
                  <div className="flex items-end justify-between gap-3 w-full">
                    {/* BOTTOM-LEFT: Store Info, Follow, Caption, Tags */}
                    <div className="flex-1 min-w-0 pr-2 pointer-events-auto space-y-2.5">
                      {/* Store Header Row: Avatar + Name + Follow Button */}
                      <div className="flex items-center gap-2.5">
                        <div
                          onClick={() => {
                            onClose();
                            onSelectStore(item.store);
                          }}
                          className="flex items-center gap-2.5 group cursor-pointer"
                          role="button"
                          tabIndex={0}
                          title={`Ver perfil de ${item.store.name}`}
                        >
                          <div className="relative">
                            <img
                              src={item.store.logo}
                              alt={item.store.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
                            />
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#1F6E43] border border-white" />
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-sm font-heading font-black text-white leading-tight drop-shadow-md truncate group-hover:text-amber-300 transition-colors">
                              {item.store.name}
                            </h3>
                            <span className="text-[11px] text-slate-200/90 font-medium flex items-center gap-1 drop-shadow-xs">
                              <MapPin className="w-3 h-3 text-[#E5A000] shrink-0" />
                              <span className="truncate">{item.store.neighborhood} • Salvador</span>
                            </span>
                          </div>
                        </div>

                        {/* Follow Button */}
                        <button
                          onClick={() => handleToggleFollow(item.store.id)}
                          className={`px-3 py-1 rounded-full text-xs font-heading font-black transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1 shrink-0 ${
                            isFollowed
                              ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                              : 'bg-[#C1502E] hover:bg-[#a84324] text-white border border-white/20'
                          }`}
                          title={isFollowed ? 'Seguindo' : 'Seguir loja'}
                        >
                          {isFollowed ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Seguindo</span>
                            </>
                          ) : (
                            <span>Seguir</span>
                          )}
                        </button>
                      </div>

                      {/* Active Offer Banner Pill (if available) */}
                      {item.offer && (
                        <div
                          onClick={() => handleEuQuero(item)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#C1502E] via-amber-600 to-[#0B3D91] text-white text-xs font-black shadow-lg border border-white/30 cursor-pointer hover:brightness-110 active:scale-95 transition-all max-w-full"
                          title="Aproveitar esta oferta"
                        >
                          <Flame className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                          <span className="truncate">{item.offer.discountBadge}</span>
                          <span className="text-white/80 font-normal text-[11px] hidden sm:inline truncate">
                            • {item.offer.title}
                          </span>
                        </div>
                      )}

                      {/* Caption (Limited to 2 lines with "ver mais" toggle) */}
                      <div>
                        <p
                          className={`text-xs text-white/95 leading-relaxed font-normal drop-shadow-md ${
                            isCaptionExpanded ? '' : 'line-clamp-2'
                          }`}
                        >
                          {item.caption}
                        </p>
                        {item.caption && item.caption.length > 90 && (
                          <button
                            onClick={() =>
                              setExpandedCaptionIndex((prev) => (prev === idx ? null : idx))
                            }
                            className="text-[11px] font-bold text-amber-300 hover:text-white mt-0.5 cursor-pointer underline underline-offset-2"
                          >
                            {isCaptionExpanded ? 'ver menos' : 'ver mais'}
                          </button>
                        )}
                      </div>

                      {/* Category & Neighborhood Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="px-2 py-0.5 rounded-lg bg-white/20 backdrop-blur-md text-[10px] font-bold text-white border border-white/15">
                          {item.store.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-black/40 backdrop-blur-md text-[10px] font-bold text-slate-200 border border-white/10">
                          📍 {item.store.neighborhood}
                        </span>
                        {item.tags?.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] text-sky-200/90 font-medium"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* RIGHT SIDE VERTICAL ACTION BAR */}
                    <div className="flex flex-col items-center gap-4 pointer-events-auto shrink-0 pb-1">
                      {/* 1. Curtir (Heart) */}
                      <button
                        onClick={() => handleToggleLike(item)}
                        className="flex flex-col items-center group cursor-pointer"
                        title={isLiked ? 'Descurtir' : 'Curtir'}
                        aria-label="Curtir publicação"
                      >
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 group-hover:scale-110 active:scale-90 ${
                            isLiked
                              ? 'bg-red-500/20 border-red-400 text-red-500'
                              : 'bg-black/40 hover:bg-black/60 border-white/20 text-white'
                          }`}
                        >
                          <Heart
                            className={`w-6 h-6 transition-transform ${
                              isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-white'
                            }`}
                          />
                        </div>
                        <span className="text-[11px] font-black text-white drop-shadow-md mt-1">
                          {currentLikes}
                        </span>
                      </button>

                      {/* 2. "Eu Quero" Highlighted CTA Button */}
                      <button
                        onClick={() => handleEuQuero(item)}
                        className="flex flex-col items-center group cursor-pointer"
                        title="Eu Quero! Falar com o estabelecimento"
                        aria-label="Eu Quero"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#C1502E] to-[#E5A000] text-white flex items-center justify-center shadow-lg border-2 border-white/40 group-hover:scale-115 active:scale-95 transition-all">
                          <Flame className="w-6 h-6 fill-white text-white animate-bounce" />
                        </div>
                        <span className="text-[10px] font-heading font-black text-amber-300 drop-shadow-md mt-1 tracking-tight">
                          Eu Quero
                        </span>
                      </button>

                      {/* 3. Compartilhar */}
                      <button
                        onClick={() => handleShare(item)}
                        className="flex flex-col items-center group cursor-pointer"
                        title="Compartilhar publicação"
                        aria-label="Compartilhar"
                      >
                        <div className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:scale-110 active:scale-90 transition-all">
                          <Share2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[11px] font-black text-white drop-shadow-md mt-1">
                          {item.sharesCount}
                        </span>
                      </button>

                      {/* 4. Store Avatar Shortcut */}
                      <button
                        onClick={() => {
                          onClose();
                          onSelectStore(item.store);
                        }}
                        className="flex flex-col items-center group cursor-pointer"
                        title={`Abrir perfil de ${item.store.name}`}
                        aria-label="Perfil da loja"
                      >
                        <div className="relative">
                          <img
                            src={item.store.logo}
                            alt={item.store.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-[#0B3D91] shadow-lg group-hover:scale-110 active:scale-95 transition-transform"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0B3D91] text-white flex items-center justify-center text-[9px] font-black border border-white">
                            🏪
                          </div>
                        </div>
                        <span className="text-[9px] font-bold text-slate-300 drop-shadow-md mt-1">
                          Perfil
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Share Modal Fallback */}
      {shareModalItem && (
        <div
          className="fixed inset-0 z-60 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
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

              {/* WhatsApp Share Button */}
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

              {/* Copy Link Button */}
              <button
                onClick={handleCopyShareLink}
                className="w-full h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-heading font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Link Copiado!</span>
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

      {/* Interest Confirmation Toast */}
      {interestToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-60 px-5 py-3 rounded-2xl bg-slate-900/95 text-white font-bold text-xs shadow-2xl border border-white/20 backdrop-blur-md flex items-center gap-2 animate-bounce">
          <Flame className="w-4.5 h-4.5 text-[#E5A000]" />
          <span>{interestToast}</span>
        </div>
      )}
    </div>
  );
};

// Internal Video Sub-component with viewport lifecycle & progress tracking
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

  // Play / Pause depending on active index & isPlaying state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive && isPlaying) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay blocked by browser policy until user interaction
        });
      }
    } else {
      video.pause();
    }
  }, [isActive, isPlaying]);

  // Update sound state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
  }, [isMuted]);

  // Track progress on timeupdate
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

// Internal Image Sub-component with timed progress bar simulation
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
    if (!isActive || !isPlaying) {
      return;
    }

    const DURATION = 6000; // 6 seconds per static slide
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
