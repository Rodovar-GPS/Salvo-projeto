import React, { useState, useEffect } from 'react';
import {
  User,
  Store,
  Offer,
  StoreCategory,
  SalvadorNeighborhood,
  ChatConversation,
  ChatMessage,
  Review,
  ActiveTab,
  EventItem,
  Friendship,
  UserFollow,
  SocialNotification,
  StoreFollow,
  StorePartnership,
  StorePartnershipType,
} from './types';
import { SALVADOR_NEIGHBORHOOD_GEO_MAP } from './utils/salvadorGeoDatabase';
import { detectSalvadorNeighborhood } from './utils/geolocation';
import {
  INITIAL_STORES,
  INITIAL_USERS,
  MOCK_USERS,
  INITIAL_CONVERSATIONS,
  INITIAL_FRIENDSHIPS,
  INITIAL_USER_FOLLOWS,
  INITIAL_SOCIAL_NOTIFICATIONS,
  INITIAL_STORE_FOLLOWS,
  INITIAL_STORE_PARTNERSHIPS,
} from './data/mockData';
import { INITIAL_EVENTS } from './data/eventsData';
import { BonfimRibbon } from './components/BonfimRibbon';
import { generateBaianoChatResponse } from './services/baianoAgentsEngine';

import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { NeighborhoodGuideModal } from './components/NeighborhoodGuideModal';
import { FloatingRadioPlayer } from './components/FloatingRadioPlayer';

// Views
import { SplashView } from './views/SplashView';
import { OnboardingView } from './views/OnboardingView';
import { AuthView } from './views/AuthView';
import { HomeExploreView } from './views/HomeExploreView';
import { OffersView } from './views/OffersView';
import { StoreProfileView } from './views/StoreProfileView';
import { ChatView } from './views/ChatView';
import { FavoritesView } from './views/FavoritesView';
import { UserProfileView } from './views/UserProfileView';
import { MerchantDashboardView } from './views/MerchantDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { MerchantRegisterView } from './views/MerchantRegisterView';
import { EventsView } from './views/EventsView';
import { ForYouSocialView } from './views/ForYouSocialView';
import { SalvadorLiveView } from './views/SalvadorLiveView';
import { SalvoOfficialView } from './views/SalvoOfficialView';
import { SalvoFePlansView } from './views/SalvoFePlansView';
import { SalvoFeAdminDashboardView } from './views/SalvoFeAdminDashboardView';
import { ViajarNavView } from './views/ViajarNavView';
import { StreetViewExperience } from './components/StreetViewExperience';

export default function App() {
  // App Phase: 'splash' | 'onboarding' | 'auth' | 'app'
  const [appPhase, setAppPhase] = useState<'splash' | 'onboarding' | 'auth' | 'app'>('splash');

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<ActiveTab>('explore');

  // Active Store for Profile Detail
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  // Active Store for Street View 360 Experience
  const [activeStreetViewStore, setActiveStreetViewStore] = useState<Store | null>(null);

  // Active Chat conversation target
  const [activeChatTargetStoreId, setActiveChatTargetStoreId] = useState<string | null>(null);

  // Viewing other user's profile
  const [viewingProfileUserId, setViewingProfileUserId] = useState<string | null>(null);

  // Users Directory (with localStorage persistence)
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('guia_salvador_users_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_USERS;
  });

  // Current Logged-in User
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('guia_salvador_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.name) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_USERS[0];
  });

  // Friendships State (Client -> Client Relationships)
  const [friendships, setFriendships] = useState<Friendship[]>(() => {
    try {
      const saved = localStorage.getItem('guia_salvador_friendships');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_FRIENDSHIPS;
  });

  // User Follows State (Client -> User Follows)
  const [userFollows, setUserFollows] = useState<UserFollow[]>(() => {
    try {
      const saved = localStorage.getItem('guia_salvador_user_follows');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_USER_FOLLOWS;
  });

  // Store Follows State (Client -> Store Follows)
  const [storeFollows, setStoreFollows] = useState<StoreFollow[]>(() => {
    try {
      const saved = localStorage.getItem('guia_salvador_store_follows');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_STORE_FOLLOWS;
  });

  // Store Partnerships State (Store -> Store B2B Relationships)
  const [storePartnerships, setStorePartnerships] = useState<StorePartnership[]>(() => {
    try {
      const saved = localStorage.getItem('guia_salvador_store_partnerships');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_STORE_PARTNERSHIPS;
  });

  // Social Notifications State
  const [socialNotifications, setSocialNotifications] = useState<SocialNotification[]>(() => {
    try {
      const saved = localStorage.getItem('guia_salvador_social_notifs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_SOCIAL_NOTIFICATIONS;
  });

  // Stores State
  const [stores, setStores] = useState<Store[]>(() => {
    try {
      const saved = localStorage.getItem('guia_salvador_stores');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_STORES;
  });

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('guia_salvador_favs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return ['store-1', 'store-3'];
  });

  // Conversations
  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    try {
      const saved = localStorage.getItem('guia_salvador_convs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_CONVERSATIONS;
  });

  // Events State
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem('guia_salvador_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_EVENTS;
  });

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<StoreCategory | 'Todas'>('Todas');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<SalvadorNeighborhood | 'Todos os Bairros'>('Todos os Bairros');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNeighborhoodGuideOpen, setIsNeighborhoodGuideOpen] = useState(false);
  const [profileInitialMode, setProfileInitialMode] = useState<'client' | 'merchant'>('client');

  // Geolocation state: real GPS or user-selected neighborhood location
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
    neighborhood?: string;
    isManual?: boolean;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('salvo_user_location');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });
  const [isLocating, setIsLocating] = useState(false);

  // Handle manual neighborhood selection (e.g. Pau da Lima, Brotas, Barra, etc.)
  const handleSetManualNeighborhood = (neighborhoodName: string) => {
    const geo = SALVADOR_NEIGHBORHOOD_GEO_MAP[neighborhoodName];
    if (geo) {
      const newLoc = {
        lat: geo.lat,
        lng: geo.lng,
        accuracy: 15,
        neighborhood: neighborhoodName,
        isManual: true,
      };
      setUserLocation(newLoc);
      localStorage.setItem('salvo_user_location', JSON.stringify(newLoc));
    }
  };

  // Handle Geolocation - Obter coordenadas reais do GPS do navegador com detecção precisa
  const handleUseLocation = () => {
    setIsLocating(true);
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const detected = detectSalvadorNeighborhood(lat, lng);
          const newLoc = {
            lat,
            lng,
            accuracy: pos.coords.accuracy,
            neighborhood: detected.neighborhood,
            isManual: false,
          };
          setUserLocation(newLoc);
          localStorage.setItem('salvo_user_location', JSON.stringify(newLoc));
          setIsLocating(false);
        },
        (error) => {
          console.warn('GPS permission denied or unavailable, using Pau da Lima / Salvador reference coordinates:', error);
          // Default to Pau da Lima if user location cannot be determined
          const pauDaLimaGeo = SALVADOR_NEIGHBORHOOD_GEO_MAP['Pau da Lima'] || { lat: -12.9290, lng: -38.4280 };
          const fallbackLoc = {
            lat: pauDaLimaGeo.lat,
            lng: pauDaLimaGeo.lng,
            accuracy: 100,
            neighborhood: 'Pau da Lima',
            isManual: true,
          };
          setUserLocation(fallbackLoc);
          localStorage.setItem('salvo_user_location', JSON.stringify(fallbackLoc));
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      const pauDaLimaGeo = SALVADOR_NEIGHBORHOOD_GEO_MAP['Pau da Lima'] || { lat: -12.9290, lng: -38.4280 };
      const fallbackLoc = {
        lat: pauDaLimaGeo.lat,
        lng: pauDaLimaGeo.lng,
        accuracy: 100,
        neighborhood: 'Pau da Lima',
        isManual: true,
      };
      setUserLocation(fallbackLoc);
      localStorage.setItem('salvo_user_location', JSON.stringify(fallbackLoc));
      setIsLocating(false);
    }
  };

  // Toggle favorite
  const handleToggleFavorite = (storeId: string) => {
    setFavorites((prev) =>
      prev.includes(storeId) ? prev.filter((id) => id !== storeId) : [...prev, storeId]
    );
  };

  // Social Action Handlers (Client -> Client friendships and follows)
  const handleSendFriendRequest = (targetUserId: string) => {
    if (targetUserId === currentUser.id) return;

    // Check if friendship already exists
    const existing = friendships.find(
      (f) =>
        (f.requesterId === currentUser.id && f.addresseeId === targetUserId) ||
        (f.requesterId === targetUserId && f.addresseeId === currentUser.id)
    );

    if (existing) {
      if (existing.status === 'declined') {
        // Re-open request
        setFriendships((prev) =>
          prev.map((f) =>
            f.id === existing.id
              ? {
                  ...f,
                  requesterId: currentUser.id,
                  addresseeId: targetUserId,
                  status: 'pending',
                  updatedAt: new Date().toISOString(),
                }
              : f
          )
        );
      }
      return;
    }

    const newFriendshipId = `friendship-${Date.now()}`;
    const newFriendship: Friendship = {
      id: newFriendshipId,
      requesterId: currentUser.id,
      addresseeId: targetUserId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setFriendships((prev) => [newFriendship, ...prev]);

    // Create notification for target user
    const newNotification: SocialNotification = {
      id: `notif-${Date.now()}`,
      recipientProfileId: targetUserId,
      actorProfileId: currentUser.id,
      actorName: currentUser.name,
      actorUsername: currentUser.username,
      actorAvatar: currentUser.avatar,
      type: 'friend_request',
      friendshipId: newFriendshipId,
      status: 'pending',
      read: false,
      createdAt: 'Agora mesmo',
    };

    setSocialNotifications((prev) => [newNotification, ...prev]);
  };

  const handleAcceptFriendRequest = (friendshipId: string) => {
    let acceptedRequesterId = '';
    setFriendships((prev) =>
      prev.map((f) => {
        if (f.id === friendshipId) {
          acceptedRequesterId = f.requesterId;
          return { ...f, status: 'accepted', updatedAt: new Date().toISOString() };
        }
        return f;
      })
    );

    // Update the notification status to accepted
    setSocialNotifications((prev) =>
      prev.map((n) =>
        n.friendshipId === friendshipId ? { ...n, status: 'accepted', read: true } : n
      )
    );

    // Create a notification for the requester that their request was accepted
    if (acceptedRequesterId) {
      const acceptNotif: SocialNotification = {
        id: `notif-${Date.now()}`,
        recipientProfileId: acceptedRequesterId,
        actorProfileId: currentUser.id,
        actorName: currentUser.name,
        actorUsername: currentUser.username,
        actorAvatar: currentUser.avatar,
        type: 'friend_accepted',
        read: false,
        createdAt: 'Agora mesmo',
      };
      setSocialNotifications((prev) => [acceptNotif, ...prev]);
    }
  };

  const handleDeclineFriendRequest = (friendshipId: string) => {
    setFriendships((prev) =>
      prev.map((f) =>
        f.id === friendshipId ? { ...f, status: 'declined', updatedAt: new Date().toISOString() } : f
      )
    );

    // Update notification status
    setSocialNotifications((prev) =>
      prev.map((n) =>
        n.friendshipId === friendshipId ? { ...n, status: 'declined', read: true } : n
      )
    );
  };

  const handleRemoveFriend = (targetUserId: string) => {
    setFriendships((prev) =>
      prev.filter(
        (f) =>
          !(
            (f.requesterId === currentUser.id && f.addresseeId === targetUserId) ||
            (f.requesterId === targetUserId && f.addresseeId === currentUser.id)
          )
      )
    );
  };

  const handleToggleFollowUser = (targetUserId: string) => {
    if (targetUserId === currentUser.id) return;

    const isFollowing = userFollows.some(
      (f) => f.followerId === currentUser.id && f.followingId === targetUserId
    );

    if (isFollowing) {
      setUserFollows((prev) =>
        prev.filter((f) => !(f.followerId === currentUser.id && f.followingId === targetUserId))
      );
    } else {
      const newFollow: UserFollow = {
        id: `follow-${Date.now()}`,
        followerId: currentUser.id,
        followingId: targetUserId,
        createdAt: new Date().toISOString(),
      };
      setUserFollows((prev) => [newFollow, ...prev]);

      // Create notification for followed user
      const followNotif: SocialNotification = {
        id: `notif-${Date.now()}`,
        recipientProfileId: targetUserId,
        actorProfileId: currentUser.id,
        actorName: currentUser.name,
        actorUsername: currentUser.username,
        actorAvatar: currentUser.avatar,
        type: 'user_follow',
        read: false,
        createdAt: 'Agora mesmo',
      };
      setSocialNotifications((prev) => [followNotif, ...prev]);
    }
  };

  // Toggle Follow Store (Customer -> Store)
  const handleToggleFollowStore = (storeId: string) => {
    const isFollowing = storeFollows.some(
      (f) => f.followerProfileId === currentUser.id && f.storeId === storeId
    );

    if (isFollowing) {
      setStoreFollows((prev) =>
        prev.filter((f) => !(f.followerProfileId === currentUser.id && f.storeId === storeId))
      );
    } else {
      const newFollow: StoreFollow = {
        id: `sf-${Date.now()}`,
        followerProfileId: currentUser.id,
        storeId,
        createdAt: new Date().toISOString(),
        notificationsEnabled: true,
      };
      setStoreFollows((prev) => [newFollow, ...prev]);

      // Notify store owner if user exists
      const targetStore = stores.find((s) => s.id === storeId);
      if (targetStore?.ownerId) {
        const notif: SocialNotification = {
          id: `notif-sf-${Date.now()}`,
          recipientProfileId: targetStore.ownerId,
          actorProfileId: currentUser.id,
          actorName: currentUser.name,
          actorUsername: currentUser.username,
          actorAvatar: currentUser.avatar,
          type: 'store_follow',
          storeId,
          storeName: targetStore.name,
          read: false,
          createdAt: 'Agora mesmo',
        };
        setSocialNotifications((prev) => [notif, ...prev]);
      }
    }
  };

  // Propose Store Partnership (Store A -> Store B)
  const handleProposeStorePartnership = (
    storeAId: string,
    storeBId: string,
    type: StorePartnershipType,
    title: string,
    description: string
  ) => {
    const newPartnership: StorePartnership = {
      id: `part-${Date.now()}`,
      storeAId,
      storeBId,
      type,
      title,
      description,
      status: 'proposed',
      proposedByProfileId: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setStorePartnerships((prev) => [newPartnership, ...prev]);

    // Notify target store owner
    const storeA = stores.find((s) => s.id === storeAId);
    const storeB = stores.find((s) => s.id === storeBId);
    if (storeB?.ownerId) {
      const notif: SocialNotification = {
        id: `notif-part-${Date.now()}`,
        recipientProfileId: storeB.ownerId,
        actorProfileId: currentUser.id,
        actorName: storeA?.name || currentUser.name,
        actorAvatar: storeA?.logo || currentUser.avatar,
        type: 'partnership_proposed',
        partnershipId: newPartnership.id,
        partnershipTitle: title,
        storeId: storeAId,
        storeName: storeA?.name,
        status: 'pending',
        read: false,
        createdAt: 'Agora mesmo',
      };
      setSocialNotifications((prev) => [notif, ...prev]);
    }
  };

  // Accept Store Partnership
  const handleAcceptStorePartnership = (partnershipId: string) => {
    setStorePartnerships((prev) =>
      prev.map((p) =>
        p.id === partnershipId
          ? { ...p, status: 'active', updatedAt: new Date().toISOString() }
          : p
      )
    );

    // Update notifications
    setSocialNotifications((prev) =>
      prev.map((n) =>
        n.partnershipId === partnershipId ? { ...n, status: 'accepted', read: true } : n
      )
    );
  };

  // Decline Store Partnership
  const handleDeclineStorePartnership = (partnershipId: string) => {
    setStorePartnerships((prev) =>
      prev.map((p) =>
        p.id === partnershipId
          ? { ...p, status: 'declined', updatedAt: new Date().toISOString() }
          : p
      )
    );

    setSocialNotifications((prev) =>
      prev.map((n) =>
        n.partnershipId === partnershipId ? { ...n, status: 'declined', read: true } : n
      )
    );
  };

  // End / Dissolve Store Partnership
  const handleEndStorePartnership = (partnershipId: string) => {
    setStorePartnerships((prev) =>
      prev.map((p) =>
        p.id === partnershipId
          ? { ...p, status: 'ended', updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const handleViewUserProfile = (userId: string) => {
    setViewingProfileUserId(userId);
    setSelectedStoreId(null);
    setActiveStreetViewStore(null);
    setCurrentTab('profile');
  };

  const handleBackToMyProfile = () => {
    setViewingProfileUserId(null);
  };

  const handleMarkNotificationAsRead = (notifId: string) => {
    setSocialNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setSocialNotifications((prev) =>
      prev.map((n) => (n.recipientProfileId === currentUser.id ? { ...n, read: true } : n))
    );
  };

  // Switch role quickly
  const handleRoleChange = (role: 'client' | 'merchant' | 'admin') => {
    const targetUser = MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[0];
    setCurrentUser(targetUser);

    if (role === 'merchant') {
      setCurrentTab('merchant_dashboard');
    } else if (role === 'admin') {
      setCurrentTab('admin');
    } else {
      setCurrentTab('explore');
    }
    setSelectedStoreId(null);
  };

  // Open chat directly with a store
  const handleOpenChatWithStore = (store: Store, context?: Offer | string) => {
    let existingConv = conversations.find(
      (c) => c.storeId === store.id && c.clientId === currentUser.id
    );

    let initialMessage = '';
    if (typeof context === 'string') {
      initialMessage = context;
    } else if (context && typeof context === 'object' && 'title' in context) {
      initialMessage = `Olá! Gostaria de saber mais sobre a oferta "${context.title}" (${context.discountBadge || context.priceText || ''}).`;
    }

    if (!existingConv) {
      const messages: ChatMessage[] = [
        {
          id: `msg-${Date.now()}`,
          senderId: 'system',
          senderName: 'Atendimento SALVÔ',
          senderRole: 'merchant',
          receiverId: currentUser.id,
          text: `Olá! Bem-vindo ao atendimento da ${store.name} pelo SALVÔ. Como podemos ajudar?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: true,
        },
      ];

      if (initialMessage) {
        messages.push({
          id: `msg-${Date.now() + 1}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderRole: currentUser.role,
          receiverId: store.id,
          text: initialMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: true,
        });
      }

      const newConv: ChatConversation = {
        id: `conv-${Date.now()}`,
        storeId: store.id,
        storeName: store.name,
        storeLogo: store.logo,
        clientId: currentUser.id,
        clientName: currentUser.name,
        clientAvatar: currentUser.avatar,
        lastMessage: initialMessage || 'Iniciou uma conversa com a loja.',
        lastMessageTime: 'Agora',
        unreadCount: 0,
        messages,
      };
      setConversations((prev) => [newConv, ...prev]);
      existingConv = newConv;
    } else if (initialMessage) {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentUser.role,
        receiverId: store.id,
        text: initialMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true,
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === existingConv!.id
            ? {
                ...c,
                lastMessage: initialMessage,
                lastMessageTime: 'Agora',
                messages: [...c.messages, newMsg],
              }
            : c
        )
      );
    }

    setActiveChatTargetStoreId(store.id);
    setSelectedStoreId(null);
    setCurrentTab('chat');
  };

  // Send message in Chat
  const handleSendMessage = (
    conversationId: string,
    text: string,
    extraOptions?: Partial<ChatMessage>
  ) => {
    const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const conv = conversations.find((c) => c.id === conversationId);
    const receiverId =
      currentUser.role === 'merchant'
        ? conv?.clientId || 'client'
        : conv?.storeId || 'store';

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      receiverId,
      text,
      timestamp: currentTime,
      read: true,
      ...extraOptions,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: currentTime,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    // Auto simulate store / Baiano client reply after 1.2s
    setTimeout(() => {
      const { replyText, agent } = generateBaianoChatResponse(text, {
        storeName: conv?.storeName,
      });

      const replySenderName =
        currentUser.role === 'client'
          ? conv?.storeName || `${agent.name} (${agent.neighborhood})`
          : `${agent.name} (${agent.neighborhood})`;

      const replyMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        senderId: currentUser.role === 'client' ? 'store-auto' : agent.id,
        senderName: replySenderName,
        senderRole: currentUser.role === 'client' ? 'merchant' : 'client',
        receiverId: currentUser.id,
        text: replyText,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        read: true,
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId) {
            return {
              ...c,
              lastMessage: replyText,
              lastMessageTime: 'Agora',
              messages: [...c.messages, replyMsg],
            };
          }
          return c;
        })
      );
    }, 1200);
  };

  // Add Review
  const handleAddReview = (storeId: string, review: Review) => {
    setStores((prev) =>
      prev.map((s) => {
        if (s.id === storeId) {
          const updatedReviews = [review, ...s.reviews];
          const avgRating =
            updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length;
          return {
            ...s,
            reviews: updatedReviews,
            rating: Number(avgRating.toFixed(1)),
            reviewCount: updatedReviews.length,
          };
        }
        return s;
      })
    );
  };

  // Edit Review (Alterar avaliação)
  const handleEditReview = (storeId: string, updatedReview: Review) => {
    setStores((prev) =>
      prev.map((s) => {
        if (s.id === storeId) {
          const updatedReviews = s.reviews.map((r) =>
            r.id === updatedReview.id ? { ...updatedReview, edited: true } : r
          );
          const avgRating =
            updatedReviews.length > 0
              ? updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length
              : 5.0;
          return {
            ...s,
            reviews: updatedReviews,
            rating: Number(avgRating.toFixed(1)),
            reviewCount: updatedReviews.length,
          };
        }
        return s;
      })
    );
  };

  // Delete Review (Apagar / Excluir avaliação)
  const handleDeleteReview = (storeId: string, reviewId: string) => {
    setStores((prev) =>
      prev.map((s) => {
        if (s.id === storeId) {
          const updatedReviews = s.reviews.filter((r) => r.id !== reviewId);
          const avgRating =
            updatedReviews.length > 0
              ? updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length
              : 0;
          return {
            ...s,
            reviews: updatedReviews,
            rating: updatedReviews.length > 0 ? Number(avgRating.toFixed(1)) : 0,
            reviewCount: updatedReviews.length,
          };
        }
        return s;
      })
    );
  };

  // Register New Merchant Store
  const handleRegisterStore = (newStoreData: Partial<Store>) => {
    const newStoreId = `store-${Date.now()}`;
    const newStore: Store = {
      id: newStoreId,
      ownerId: currentUser.id,
      name: newStoreData.name || 'Nova Loja Salvador',
      slug: newStoreData.slug || 'nova-loja',
      category: newStoreData.category || 'Gastronomia & Açaí',
      description: newStoreData.description || '',
      logo: newStoreData.logo || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
      coverImage: newStoreData.coverImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      galleryImages: newStoreData.galleryImages || [],
      address: newStoreData.address || 'Salvador, Bahia',
      neighborhood: newStoreData.neighborhood || 'Barra',
      coordinates: newStoreData.coordinates || { lat: -13.0039, lng: -38.5326, mapX: 50, mapY: 55 },
      phone: newStoreData.phone || '',
      whatsapp: newStoreData.whatsapp || '',
      instagram: newStoreData.instagram || '',
      isOpenNow: true,
      operatingHours: newStoreData.operatingHours || [],
      rating: 5.0,
      reviewCount: 1,
      offers: newStoreData.offers || [],
      reviews: newStoreData.reviews || [],
      subscriptionStatus: 'active',
      subscriptionPlan: {
        name: 'Plano Lojista Salvador',
        priceMonthly: 12.0,
        nextBillingDate: '2026-09-24',
        startedAt: '2026-08-24',
      },
      approvalStatus: 'approved',
    };

    setStores((prev) => [newStore, ...prev]);

    // Switch user to merchant with newly created store
    const merchantUser: User = {
      id: `user-merchant-${Date.now()}`,
      name: `Lojista (${newStore.name})`,
      email: 'contato@lojistasalvador.com.br',
      role: 'merchant',
      favoriteStoreIds: [],
      savedOfferIds: [],
      storeId: newStore.id,
      createdAt: '2026-08-24',
    };
    setCurrentUser(merchantUser);
    setCurrentTab('merchant_dashboard');
  };

  // Update existing store (Merchant Panel)
  const handleUpdateStore = (updatedStore: Store) => {
    setStores((prev) => prev.map((s) => (s.id === updatedStore.id ? updatedStore : s)));
  };

  // Admin store moderation actions
  const handleApproveStore = (storeId: string) => {
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, approvalStatus: 'approved' } : s))
    );
  };

  const handleRejectStore = (storeId: string) => {
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, approvalStatus: 'rejected' } : s))
    );
  };

  const handleDeleteStore = (storeId: string) => {
    setStores((prev) => prev.filter((s) => s.id !== storeId));
  };

  // Event actions & moderation
  const handleCreateEvent = (newEventData: any) => {
    const newEvent: EventItem = {
      ...newEventData,
      id: `ev-${Date.now()}`,
      status: 'pending', // All user submissions go to admin moderation
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleApproveEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status: 'approved', approvedByAdmin: true } : e))
    );
  };

  const handleRejectEvent = (eventId: string, note?: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status: 'rejected', moderationNote: note } : e))
    );
  };

  const handleToggleFeatureEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, isFeatured: !e.isFeatured } : e))
    );
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  // 1. Initial Splash Screen
  if (appPhase === 'splash') {
    return (
      <SplashView
        onStart={() => {
          setAppPhase('app');
          setCurrentTab('explore');
        }}
        onOpenOnboarding={() => setAppPhase('onboarding')}
        onOpenAuth={() => setAppPhase('auth')}
      />
    );
  }

  // 2. Onboarding Carousel / Tutorial
  if (appPhase === 'onboarding') {
    return (
      <OnboardingView
        onComplete={() => {
          setAppPhase('app');
          setCurrentTab('explore');
        }}
        onOpenAuth={() => setAppPhase('auth')}
      />
    );
  }

  // 3. Auth View (Client free vs Merchant R$12 vs Admin)
  if (appPhase === 'auth') {
    return (
      <AuthView
        allUsers={MOCK_USERS}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'merchant') {
            setCurrentTab('merchant_dashboard');
          } else if (user.role === 'admin') {
            setCurrentTab('admin');
          } else {
            setCurrentTab('explore');
          }
          setAppPhase('app');
        }}
        onNavigateToMerchantRegister={() => {
          setAppPhase('app');
          setCurrentTab('merchant_register');
        }}
        onBackToExplore={() => {
          setAppPhase('app');
          setCurrentTab('explore');
        }}
        onRegisterClient={(clientData) => {
          const newClientUser: User = {
            id: `user-client-${Date.now()}`,
            name: clientData.name,
            email: clientData.email,
            phone: clientData.phone,
            role: 'client',
            favoriteStoreIds: [],
            savedOfferIds: [],
            neighborhood: clientData.neighborhood || 'Barra',
            createdAt: '2026-08-24',
          };
          setCurrentUser(newClientUser);
          setAppPhase('app');
          setCurrentTab('explore');
        }}
      />
    );
  }

  // Find active store for profile view
  const activeSelectedStore = stores.find((s) => s.id === selectedStoreId);
  // Find current user's merchant store if role is merchant
  const currentMerchantStore = stores.find((s) => s.id === currentUser.storeId) || stores[0] || INITIAL_STORES[0];
  // Favorite stores list
  const favoriteStores = stores.filter((s) => favorites.includes(s.id));

  // Target user if viewing someone else's profile
  const activeViewingUser = viewingProfileUserId
    ? users.find((u) => u.id === viewingProfileUserId) || null
    : null;

  const isForYouFullExperience = currentTab === 'for_you' && !selectedStoreId && !activeStreetViewStore;

  return (
    <div
      className={`${
        isForYouFullExperience
          ? 'h-[100dvh] max-h-[100dvh] overflow-hidden bg-black md:bg-[#F8FAFC]'
          : 'min-h-screen bg-[#F8FAFC]'
      } text-slate-800 flex flex-col justify-between font-sans selection:bg-[#FFC72C] selection:text-[#0B4F8A]`}
    >
      {/* Main Navbar with embedded Bonfim Ribbon (hidden when in ForYou full 3-column experience) */}
      {!isForYouFullExperience && (
        <Navbar
          currentUser={currentUser}
          activeTab={currentTab}
          setActiveTab={(tab) => {
            setSelectedStoreId(null);
            setActiveStreetViewStore(null);
            if (tab !== 'profile') {
              setViewingProfileUserId(null);
            }
            setCurrentTab(tab);
          }}
          allUsers={users}
          onSwitchUser={(userId) => {
            const u = users.find((x) => x.id === userId);
            if (u) {
              setCurrentUser(u);
              setViewingProfileUserId(null);
              if (u.role === 'merchant') setCurrentTab('merchant_dashboard');
              else if (u.role === 'admin') setCurrentTab('admin');
              else setCurrentTab('explore');
              setSelectedStoreId(null);
              setActiveStreetViewStore(null);
            }
          }}
          onRoleChange={handleRoleChange}
          onOpenAuth={() => setAppPhase('auth')}
          onOpenMerchantRegister={() => {
            setSelectedStoreId(null);
            setActiveStreetViewStore(null);
            setViewingProfileUserId(null);
            setCurrentTab('merchant_register');
          }}
          onOpenNeighborhoodGuide={() => {
            setIsNeighborhoodGuideOpen(true);
          }}
          onOpenProfileMode={(mode) => {
            setProfileInitialMode(mode);
            setViewingProfileUserId(null);
            setCurrentTab('profile');
          }}
          unreadMessagesCount={conversations.reduce((acc, c) => acc + c.unreadCount, 0)}
          activeOffersCount={stores.reduce((acc, s) => acc + (s.offers ? s.offers.length : 0), 0)}
          favoritesCount={favorites.length}
        />
      )}

      {/* Main Content Area */}
      <main
        className={`w-full overflow-x-hidden ${
          isForYouFullExperience ? 'flex-1 h-full min-h-0 flex flex-col overflow-hidden pb-0' : 'flex-1 pb-24 md:pb-8'
        }`}
      >
        {/* If viewing Street View 360° Experience */}
        {activeStreetViewStore ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <StreetViewExperience
              store={activeStreetViewStore}
              onBackToMap={() => setActiveStreetViewStore(null)}
              onOpenChat={(st) => {
                setActiveStreetViewStore(null);
                handleOpenChatWithStore(st);
              }}
              onSelectStore={(st) => {
                setActiveStreetViewStore(null);
                setSelectedStoreId(st.id);
              }}
            />
          </div>
        ) : selectedStoreId && activeSelectedStore ? (
          <StoreProfileView
            store={activeSelectedStore}
            currentUser={currentUser}
            isFavorite={favorites.includes(activeSelectedStore.id)}
            onToggleFavorite={handleToggleFavorite}
            onBack={() => setSelectedStoreId(null)}
            onOpenChat={handleOpenChatWithStore}
            onOpenStreetView={(st) => setActiveStreetViewStore(st)}
            onAddReview={handleAddReview}
            onEditReview={handleEditReview}
            onDeleteReview={handleDeleteReview}
            allStores={stores}
            allUsers={users}
            storeFollows={storeFollows}
            storePartnerships={storePartnerships}
            onToggleFollowStore={handleToggleFollowStore}
            onProposePartnership={handleProposeStorePartnership}
            onAcceptPartnership={handleAcceptStorePartnership}
            onDeclinePartnership={handleDeclineStorePartnership}
            onSelectStore={(sId) => setSelectedStoreId(sId)}
            onViewUserProfile={handleViewUserProfile}
            userLocation={userLocation}
          />
        ) : currentTab === 'explore' ? (
          <HomeExploreView
            stores={stores}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectStore={(st) => setSelectedStoreId(st.id)}
            onOpenChat={handleOpenChatWithStore}
            onOpenStreetView={(st) => setActiveStreetViewStore(st)}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedNeighborhood={selectedNeighborhood}
            setSelectedNeighborhood={setSelectedNeighborhood}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            userLocation={userLocation}
            onUseLocation={handleUseLocation}
            onSetManualNeighborhood={handleSetManualNeighborhood}
            isLocating={isLocating}
            onOpenAuth={() => setAppPhase('auth')}
            onOpenOffers={() => setCurrentTab('offers')}
            onOpenNeighborhoodGuide={() => setIsNeighborhoodGuideOpen(true)}
            onOpenChatDemo={() => {
              if (stores.length > 0) {
                handleOpenChatWithStore(stores[0]);
              } else {
                setCurrentTab('chat');
              }
            }}
          />
        ) : currentTab === 'viajar' ? (
          <ViajarNavView
            userLocation={userLocation}
            onOpenChatWithStore={handleOpenChatWithStore}
            onNavigateToTab={(tab) => setCurrentTab(tab as ActiveTab)}
          />
        ) : currentTab === 'offers' ? (

          <OffersView
            stores={stores}
            onSelectStore={(st) => setSelectedStoreId(st.id)}
            onOpenChat={handleOpenChatWithStore}
            onOpenStreetView={(st) => setActiveStreetViewStore(st)}
          />
        ) : currentTab === 'for_you' ? (
          <ForYouSocialView
            currentUser={currentUser}
            stores={stores}
            events={events}
            onSelectStore={(st) => setSelectedStoreId(st.id)}
            onOpenChat={handleOpenChatWithStore}
            onNavigateTab={(tab) => {
              setSelectedStoreId(null);
              setActiveStreetViewStore(null);
              if (tab !== 'profile') {
                setViewingProfileUserId(null);
              }
              setCurrentTab(tab);
            }}
            onOpenAuth={() => setAppPhase('auth')}
            onOpenMerchantRegister={() => {
              setSelectedStoreId(null);
              setActiveStreetViewStore(null);
              setViewingProfileUserId(null);
              setCurrentTab('merchant_register');
            }}
            onRoleChange={handleRoleChange}
            favoriteStoreIds={favorites}
            onToggleFavoriteStore={handleToggleFavorite}
            unreadMessagesCount={conversations.reduce((acc, c) => acc + c.unreadCount, 0)}
            activeOffersCount={stores.reduce((acc, s) => acc + (s.offers ? s.offers.length : 0), 0)}
            favoritesCount={favorites.length}
          />
        ) : currentTab === 'chat' ? (
          <ChatView
            conversations={conversations}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onSelectStoreProfile={(sId) => setSelectedStoreId(sId)}
            allStores={stores}
            activeConversationId={
              activeChatTargetStoreId
                ? conversations.find((c) => c.storeId === activeChatTargetStoreId)?.id
                : undefined
            }
          />
        ) : currentTab === 'favorites' ? (
          <FavoritesView
            favoriteStores={favoriteStores}
            onToggleFavorite={handleToggleFavorite}
            onSelectStore={(st) => setSelectedStoreId(st.id)}
            onOpenChat={handleOpenChatWithStore}
            onOpenStreetView={(st) => setActiveStreetViewStore(st)}
            onExploreClick={() => setCurrentTab('explore')}
          />
        ) : currentTab === 'profile' ? (
          <UserProfileView
            currentUser={currentUser}
            targetUser={activeViewingUser}
            allUsers={users}
            allStores={stores}
            currentMerchantStore={currentMerchantStore}
            initialProfileMode={profileInitialMode}
            friendships={friendships}
            userFollows={userFollows}
            socialNotifications={socialNotifications}
            onUpdateUser={(updated) => {
              setCurrentUser((prev) => ({ ...prev, ...updated }));
              setUsers((prev) =>
                prev.map((u) => (u.id === currentUser.id ? { ...u, ...updated } : u))
              );
            }}
            onLogout={() => {
              setViewingProfileUserId(null);
              setAppPhase('auth');
            }}
            onNavigateToMerchantRegister={() => {
              setViewingProfileUserId(null);
              setCurrentTab('merchant_register');
            }}
            onSendFriendRequest={handleSendFriendRequest}
            onAcceptFriendRequest={handleAcceptFriendRequest}
            onDeclineFriendRequest={handleDeclineFriendRequest}
            onRemoveFriend={handleRemoveFriend}
            onToggleFollowUser={handleToggleFollowUser}
            onViewProfile={handleViewUserProfile}
            onBackToMyProfile={handleBackToMyProfile}
            onMarkNotificationAsRead={handleMarkNotificationAsRead}
            onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
            favoritesCount={favorites.length}
            onSelectStore={(st) => {
              setSelectedStoreId(st.id);
              setCurrentTab('explore');
            }}
            onNavigateToTab={(t) => setCurrentTab(t)}
            onSwitchUser={(userId) => {
              const u = users.find((x) => x.id === userId);
              if (u) {
                setCurrentUser(u);
                setViewingProfileUserId(null);
              }
            }}
          />
        ) : currentTab === 'events' ? (
          <EventsView
            events={events}
            currentUser={currentUser}
            onCreateEvent={handleCreateEvent}
            onUpdateUser={(updated) => setCurrentUser((prev) => ({ ...prev, ...updated }))}
            onOpenAuth={() => setAppPhase('auth')}
          />
        ) : currentTab === 'weather_traffic' ? (
          <SalvadorLiveView
            onNavigateToTab={(t) => setCurrentTab(t)}
            onSelectStore={(st) => {
              setSelectedStoreId(st.id);
              setCurrentTab('explore');
            }}
            allStores={stores}
          />
        ) : currentTab === 'salvo_official' || (currentTab as string) === 'salvooficial' ? (
          <SalvoOfficialView
            currentUser={currentUser}
            onNavigateToTab={(t) => setCurrentTab(t)}
          />
        ) : currentTab === 'salvo_fe' ? (
          <SalvoFePlansView
            currentUser={currentUser}
            onNavigateToAdmin={() => setCurrentTab('salvofe_admin')}
            onAdCreatedSuccess={() => {}}
          />
        ) : currentTab === 'salvofe_admin' ? (
          <SalvoFeAdminDashboardView
            onBackToPlans={() => setCurrentTab('salvo_fe')}
          />
        ) : currentTab === 'merchant_dashboard' ? (
          <MerchantDashboardView
            store={currentMerchantStore}
            onUpdateStore={handleUpdateStore}
            conversations={conversations}
            onSendMessage={handleSendMessage}
            currentUser={currentUser}
            allStores={stores}
            allUsers={users}
            storeFollows={storeFollows}
            storePartnerships={storePartnerships}
            onProposePartnership={handleProposeStorePartnership}
            onAcceptPartnership={handleAcceptStorePartnership}
            onDeclinePartnership={handleDeclineStorePartnership}
            onEndPartnership={handleEndStorePartnership}
            onSelectStore={(sId) => {
              setSelectedStoreId(sId);
              setCurrentTab('explore');
            }}
            onViewUserProfile={handleViewUserProfile}
          />
        ) : currentTab === 'admin' || currentTab === 'admin_dashboard' ? (
          <AdminDashboardView
            stores={stores}
            events={events}
            onApproveStore={handleApproveStore}
            onRejectStore={handleRejectStore}
            onDeleteStore={handleDeleteStore}
            onSelectStore={(st) => setSelectedStoreId(st.id)}
            onApproveEvent={handleApproveEvent}
            onRejectEvent={handleRejectEvent}
            onToggleFeatureEvent={handleToggleFeatureEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        ) : currentTab === 'merchant_register' ? (

          <MerchantRegisterView
            onRegisterStore={handleRegisterStore}
            onBack={() => setCurrentTab('explore')}
          />
        ) : null}
      </main>

      {/* Mobile Bottom Navigation (hidden in Para Mim 3-column experience) */}
      {!isForYouFullExperience && (
        <BottomNav
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            setSelectedStoreId(null);
            setActiveStreetViewStore(null);
            setCurrentTab(tab);
          }}
          unreadChatCount={conversations.reduce((acc, c) => acc + c.unreadCount, 0)}
          favoritesCount={favorites.length}
          userRole={currentUser.role}
        />
      )}

      {/* Footer (hidden in Para Mim 3-column experience) */}
      {!isForYouFullExperience && (
        <footer className="hidden md:block bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/salvo-logo.png"
                alt="SALVÔ"
                className="w-6 h-6 rounded-lg object-cover border border-slate-100"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://iili.io/CDs6WS1.jpg';
                }}
              />
              <span className="font-heading font-black text-[#0B4F8A] text-sm">SALVÔ</span>
              <span className="text-slate-400 font-medium">• Guia Oficial do Comércio Local de Salvador. Conectando pessoas ao comércio local.</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-600">
              <span>Cliente: 100% Grátis</span>
              <span>•</span>
              <span>Lojista: R$ 12,00/mês (Simulado)</span>
              <span>•</span>
              <button
                onClick={() => handleRoleChange('admin')}
                className="text-[#0B4F8A] hover:underline"
              >
                Acesso Master / Moderação
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* Global Salvador Neighborhood Cultural Guide Modal */}
      <NeighborhoodGuideModal
        isOpen={isNeighborhoodGuideOpen}
        onClose={() => setIsNeighborhoodGuideOpen(false)}
        onSelectNeighborhood={(n) => {
          setSelectedNeighborhood(n);
          setSelectedStoreId(null);
          setActiveStreetViewStore(null);
          setCurrentTab('explore');
          setIsNeighborhoodGuideOpen(false);
        }}
        stores={stores}
      />

      {/* Floating Smart Radio Player of Salvador & Bahia */}
      <FloatingRadioPlayer />
    </div>
  );
}
