export type UserRole = 'client' | 'merchant' | 'admin' | 'guest';

export interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  city?: string;
  friendsCount?: number;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  favoriteStoreIds: string[];
  savedOfferIds: string[];
  createdAt: string;
  neighborhood?: string;
  street?: string;
  cep?: string;
  addressNumber?: string;
  address?: string;
  storeId?: string;
  isSubscriber?: boolean;
  subscriberPlan?: 'free' | 'vip' | 'merchant';
}

export type EventCategory =
  | 'Shows & Música'
  | 'Ensaios de Verão'
  | 'Gastronomia & Feiras'
  | 'Cultura & Teatro'
  | 'Religioso & Festas de Largo'
  | 'Esportes & Praia'
  | 'Negócios & Workshops';

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  description: string;
  date: string; // YYYY-MM-DD or formatted date
  time: string; // e.g. "19:00"
  venue: string; // e.g. "Concha Acústica do TCA"
  neighborhood: string;
  street: string;
  cep: string;
  addressNumber?: string;
  fullAddress?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  priceType: 'gratis' | 'pago';
  priceValue?: number | string;
  priceText?: string;
  flyerImage: string;
  organizerName: string;
  organizerContact?: string;
  ticketLink?: string;
  publisherId: string;
  publisherName: string;
  publisherRole: UserRole;
  isSubscriber: boolean;
  status: 'approved' | 'pending' | 'rejected';
  submittedAt: string;
  createdAt?: string;
  moderationNotes?: string;
  moderationNote?: string;
  approvedByAdmin?: boolean;
  isFeatured?: boolean;
}

export type StoreCategory =
  | 'Gastronomia & Açaí'
  | 'Moda & Praia'
  | 'Artesanato Baiano'
  | 'Beleza & Barbearia'
  | 'Mercadinhos & Empórios'
  | 'Esportes & Aventura'
  | 'Serviços & Reparos'
  | 'Saúde & Bem-Estar';

export type SalvadorNeighborhood =
  | string;


export interface OperatingHours {
  day: string;
  open: string;
  close: string;
  isClosed?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export type OfferStatus = 'ACTIVE' | 'SCHEDULED' | 'EXPIRED' | 'PAUSED' | 'DRAFT';

export interface Offer {
  id: string;
  storeId: string;
  title: string;
  discountBadge: string; // e.g. "20% OFF", "R$ 18 COMBO", "30% OFF", "FRETE GRÁTIS"
  originalPrice?: number;
  discountPrice?: number;
  priceText?: string;
  description: string;
  imageUrl?: string;
  startedAt?: string;
  expiresAt: string; // Data limite ou DD/MM/AAAA
  status?: OfferStatus;
  rules?: string[];
  isFeatured?: boolean;
  category: StoreCategory;
  viewsCount?: number;
  clicksCount?: number;
}

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  category?: string;
  isPopular?: boolean;
}

export interface StoreAmenities {
  wifi?: boolean;
  petFriendly?: boolean;
  airConditioning?: boolean;
  parking?: boolean;
  acceptsPix?: boolean;
  acceptsCredit?: boolean;
  delivery?: boolean;
  outdoorSeating?: boolean;
}

export interface NeighborhoodDetails {
  id: SalvadorNeighborhood;
  name: SalvadorNeighborhood;
  tagline: string;
  description: string;
  coverImage: string;
  famousFor: string[];
  vibe: 'Praiano' | 'Boêmio & Noturno' | 'Histórico & Cultural' | 'Comercial & Nobre' | 'Residencial';
  bestTimeToVisit: string;
  color: string;
}

export interface Store {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  category: StoreCategory;
  description: string;
  logo: string;
  coverImage: string;
  galleryImages: string[];
  address: string;
  neighborhood: SalvadorNeighborhood;
  mapLink?: string; // Link direto do Google Maps / GPS cadastrado pelo lojista
  googleMapsUrl?: string; // URL oficial de navegação do Google Maps
  coordinates: {
    lat: number;
    lng: number;
    mapX: number; // Percentage for SVG map (0-100)
    mapY: number; // Percentage for SVG map (0-100)
  };
  // Street View Parameters (Visão da Rua Real)
  street_view_enabled?: boolean;
  street_view_heading?: number; // 0 to 360 degrees
  street_view_pitch?: number; // -90 to 90 degrees
  street_view_zoom?: number; // 0 to 3
  street_view_pano_id?: string;
  streetViewViewsCount?: number;
  phone: string;
  whatsapp: string;
  instagram?: string;
  website?: string;
  isOpenNow: boolean;
  operatingHours: OperatingHours[];
  rating: number;
  reviewCount: number;
  reviews: Review[];
  offers: Offer[];
  products?: ProductItem[];
  amenities?: StoreAmenities;
  priceLevel?: '$' | '$$' | '$$$' | '$$$$';
  subscriptionStatus: 'active' | 'pending' | 'canceled' | 'trial';
  subscriptionPlan: {
    name: string;
    priceMonthly: number; // R$ 12,00
    nextBillingDate: string;
    startedAt: string;
  };
  approvalStatus: 'approved' | 'pending' | 'rejected';
  distanceKm?: number;
  isFeatured?: boolean;
  totalViews?: number;
  totalClicks?: number;
}

export interface ModeratorProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  roleTitle: string;
  badge: string;
  specialty: 'Antifraude & Pix' | 'Qualidade & Vendas' | 'Atendimento Turístico' | 'Auditoria Geral SSA';
  status: 'online' | 'em_atendimento' | 'offline';
  resolvedTicketsCount: number;
  rating: number;
  phoneContact: string;
  shift: string;
}

export interface ModerationAuditLog {
  id: string;
  moderatorName: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'approved' | 'warned' | 'blocked' | 'verified' | 'resolved';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
  type?: 'text' | 'pix' | 'offer' | 'coupon' | 'location' | 'product' | 'system' | 'moderation_notice' | 'audio' | 'image';
  audioDuration?: string;
  imageUrl?: string;
  imageCaption?: string;
  pixDetails?: {
    key: string;
    keyType: 'CNPJ' | 'Celular' | 'E-mail' | 'Chave Aleatória';
    receiverName: string;
    city: string;
    amount?: number;
    description?: string;
  };
  offerDetails?: {
    title: string;
    discountBadge: string;
    priceText?: string;
    originalPrice?: number;
    discountPrice?: number;
    description: string;
    expiresAt: string;
  };
  couponDetails?: {
    code: string;
    discountBadge: string;
    description: string;
    expiresAt: string;
  };
  locationDetails?: {
    address: string;
    neighborhood: string;
    name: string;
  };
  attachedOfferId?: string;
  isAutomated?: boolean;
}


export type ConversationTag =
  | 'Em Atendimento'
  | 'Aguardando PIX'
  | 'Pedido Confirmado'
  | 'Concluído'
  | 'Arquivado';

export interface ChatConversation {
  id: string;
  storeId: string;
  storeName: string;
  storeLogo: string;
  storeWhatsapp?: string;
  storePhone?: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  clientNeighborhood?: string;
  clientType?: 'Novo Cliente' | 'Cliente Frequente' | 'Turista VIP';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  statusTag?: ConversationTag;
  isBlocked?: boolean;
  isFlagged?: boolean;
  messages: ChatMessage[];
}

export type ActiveTab =
  | 'explore'
  | 'offers'
  | 'for_you'
  | 'events'
  | 'chat'
  | 'favorites'
  | 'profile'
  | 'merchant_dashboard'
  | 'admin'
  | 'admin_dashboard'
  | 'merchant_register';

export type AppView =
  | 'splash'
  | 'onboarding'
  | 'auth'
  | 'merchant_register'
  | 'main'
  | 'store_detail';

/* =========================================================================
   SALVÔ — ARQUITETURA DA REDE SOCIAL ("PARA MIM" & "LOJAS SEGUIDAS")
   ========================================================================= */

export type SocialProfileType = 'client' | 'merchant';

export interface SocialPrivacySettings {
  isPrivate: boolean;
  allowFriendRequests: boolean;
  allowDirectMessages: 'everyone' | 'friends' | 'none';
  showActivity: boolean;
}

export interface SocialProfile {
  id: string;
  type: SocialProfileType;
  userId?: string;
  storeId?: string;
  name: string;
  handle: string; // e.g. @carol.bahia, @acaidoporto.ba
  avatar: string;
  coverImage?: string;
  bio: string;
  city: string; // "Salvador"
  neighborhood: string;
  category?: StoreCategory;
  badges?: string[];
  friendsCount: number;
  followersCount: number;
  followingCount: number;
  followingStoresCount: number;
  postsCount: number;
  isVerified?: boolean;
  isOnline?: boolean;
  privacy: SocialPrivacySettings;
  createdAt: string;
}

// Relacionamento 1: CLIENTE -> CLIENTE (Amizade)
export type FriendshipStatus = 'pending' | 'accepted' | 'declined' | 'blocked';

export interface Friendship {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: FriendshipStatus;
  createdAt: string;
  updatedAt: string;
}

// Relacionamento: CLIENTE -> CLIENTE (Seguir Usuário)
export interface UserFollow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

// Relacionamento 2: CLIENTE -> LOJA (Seguir)
export interface StoreFollow {
  id: string;
  followerProfileId: string;
  storeId: string;
  createdAt: string;
  notificationsEnabled: boolean;
}

// Relacionamento 3: LOJA -> LOJA (Parceria)
export type StorePartnershipStatus = 'proposed' | 'active' | 'declined' | 'paused' | 'ended';
export type StorePartnershipType = 'cross_promo' | 'joint_event' | 'supply_partner' | 'combo_deal';

export interface StorePartnership {
  id: string;
  storeAId: string;
  storeBId: string;
  partnershipType: StorePartnershipType;
  title: string;
  description: string;
  status: StorePartnershipStatus;
  createdAt: string;
  updatedAt?: string;
}

// Publicações (Posts)
export type PostType =
  | 'text'
  | 'photo'
  | 'video'
  | 'external_link'
  | 'location'
  | 'offer'
  | 'live_stream';

export interface PostMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  aspectRatio?: '1:1' | '4:5' | '16:9' | '9:16';
  thumbnailUrl?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface PostLink {
  url: string;
  title?: string;
  description?: string;
  domain?: string;
  previewImage?: string;
}

// Reações Específicas por Papel
export type ClientReactionType = 'like' | 'want'; // Gostei | Eu Quero
export type MerchantReactionType = 'love' | 'buy'; // Amei | Eu Compro
export type SocialReactionType = ClientReactionType | MerchantReactionType;

export interface PostReaction {
  id: string;
  postId: string;
  profileId: string;
  profileType: SocialProfileType;
  reactionType: SocialReactionType;
  createdAt: string;
}

export interface PostComment {
  id: string;
  postId: string;
  authorProfileId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorType: SocialProfileType;
  content: string;
  createdAt: string;
  likesCount: number;
}

export interface PostShare {
  id: string;
  postId: string;
  sharedByProfileId: string;
  sharedTo: 'feed' | 'chat' | 'external';
  createdAt: string;
}

export interface SocialPost {
  id: string;
  authorProfileId: string;
  authorType: SocialProfileType;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorNeighborhood: string;
  storeId?: string;
  content: string;
  postType: PostType;
  media: PostMedia[];
  link?: PostLink;
  location?: {
    name: string;
    neighborhood: string;
    lat?: number;
    lng?: number;
  };
  offerRef?: {
    offerId: string;
    storeId: string;
    title: string;
    discountBadge: string;
    priceText?: string;
  };
  liveStreamRef?: {
    liveId: string;
    title: string;
    status: 'upcoming' | 'live' | 'ended';
    viewersCount?: number;
  };
  reactionsCount: {
    like: number; // Gostei (Cliente)
    want: number; // Eu Quero (Cliente)
    love: number; // Amei (Lojista)
    buy: number;  // Eu Compro (Lojista)
  };
  commentsCount: number;
  sharesCount: number;
  isPinned?: boolean;
  createdAt: string;
}

// Álbuns & Mídias
export interface SocialAlbum {
  id: string;
  ownerProfileId: string;
  title: string;
  description?: string;
  coverUrl?: string;
  mediaCount: number;
  createdAt: string;
}

export interface AlbumMedia {
  id: string;
  albumId: string;
  mediaUrl: string;
  type: 'image' | 'video';
  caption?: string;
  createdAt: string;
}

// Transmissões Ao Vivo (Live Streams)
export interface LiveStream {
  id: string;
  hostProfileId: string;
  hostType: SocialProfileType;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  status: 'scheduled' | 'live' | 'ended';
  startedAt?: string;
  endedAt?: string;
  viewersCount: number;
  relatedStoreId?: string;
  featuredOfferId?: string;
}

// Notificações Sociais
export type SocialNotificationType =
  | 'friend_request'
  | 'friend_accepted'
  | 'user_follow'
  | 'store_follow'
  | 'post_reaction'
  | 'post_comment'
  | 'post_share'
  | 'partnership_invite'
  | 'partnership_accepted'
  | 'partnership_declined'
  | 'live_started';

export interface SocialNotification {
  id: string;
  recipientProfileId: string;
  actorProfileId: string;
  actorName: string;
  actorAvatar: string;
  actorUsername?: string;
  type: SocialNotificationType;
  targetPostId?: string;
  friendshipId?: string;
  partnershipId?: string;
  targetStoreId?: string;
  status?: 'pending' | 'accepted' | 'declined';
  read: boolean;
  createdAt: string;
}

// Denúncias & Bloqueios
export interface SocialReport {
  id: string;
  reporterProfileId: string;
  targetType: 'post' | 'comment' | 'profile' | 'live';
  targetId: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'dismissed' | 'action_taken';
  createdAt: string;
}

export interface SocialBlock {
  id: string;
  blockerProfileId: string;
  blockedProfileId: string;
  createdAt: string;
}

// Paginação & Infinite Scroll
export interface PaginationMeta {
  cursor?: string;
  nextCursor?: string;
  hasMore: boolean;
  limit: number;
  total?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}
