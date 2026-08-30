import React, { useState, useEffect } from 'react';
import { User, ActiveTab } from '../types';
import { BonfimRibbon } from './BonfimRibbon';
import {
  Sparkles,
  MessageSquare,
  Heart,
  Store,
  ShieldCheck,
  User as UserIcon,
  PlusCircle,
  Menu,
  X,
  ChevronDown,
  SlidersHorizontal,
  Compass,
  Check,
  Calendar,
  MapPin,
  Map as MapIcon,
  Navigation,
  LogIn,
  Flame,
  Sun,
  Radio,
  Zap,
  BarChart3,
  FileText,
  Tag,
  Settings,
  LogOut,
  ExternalLink,
  Headphones,
  Music,
} from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAuth?: () => void;
  onOpenMerchantRegister?: () => void;
  onSwitchUser?: (userId: string) => void;
  onRoleChange?: (role: 'client' | 'merchant' | 'admin') => void;
  onOpenNeighborhoodGuide?: () => void;
  onOpenProfileMode?: (mode: 'client' | 'merchant') => void;
  allUsers?: User[];
  unreadMessagesCount?: number;
  activeOffersCount?: number;
  favoritesCount?: number;
  currentTab?: ActiveTab;
  setCurrentTab?: (tab: ActiveTab) => void;
  unreadChatCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab: rawActiveTab,
  setActiveTab: rawSetActiveTab,
  onOpenAuth,
  onOpenMerchantRegister,
  onSwitchUser,
  onOpenNeighborhoodGuide,
  onOpenProfileMode,
  allUsers = [],
  unreadMessagesCount = 0,
  activeOffersCount = 0,
  favoritesCount = 0,
  currentTab,
  setCurrentTab,
  unreadChatCount,
}) => {
  const activeTab = rawActiveTab || currentTab || 'explore';
  const setActiveTab = rawSetActiveTab || setCurrentTab || (() => {});
  const totalUnread = unreadChatCount !== undefined ? unreadChatCount : unreadMessagesCount;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [seloStatus, setSeloStatus] = useState<'ativo' | 'analise'>('ativo');

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#user-profile-menu-container')) {
        setRoleDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setRoleDropdownOpen(false);
      }
    };
    if (roleDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [roleDropdownOpen]);

  // Helper to open profile in chosen mode
  const handleGoToProfile = (mode: 'client' | 'merchant') => {
    setActiveTab('profile');
    if (onOpenProfileMode) {
      onOpenProfileMode(mode);
    }
    setRoleDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  // Detect scroll to apply subtle shadow & border elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getRoleBadge = () => {
    switch (currentUser.role) {
      case 'merchant':
        return (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#0B3D91] text-white whitespace-nowrap shrink-0">
            Lojista
          </span>
        );
      case 'admin':
        return (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#C1502E] text-white whitespace-nowrap shrink-0">
            Admin
          </span>
        );
      case 'client':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#FFC72C] text-[#0B3D91] whitespace-nowrap shrink-0">
            Cliente
          </span>
        );
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-white/98 backdrop-blur-md transition-all duration-200 w-full ${
        isScrolled
          ? 'shadow-[0_4px_20px_-4px_rgba(11,61,145,0.09)] border-b border-slate-200'
          : 'border-b border-slate-200/70 shadow-none'
      }`}
    >
      {/* Fitinha do Bonfim Oficial (Header Stripe) */}
      <BonfimRibbon height="h-1.5" />

      {/* =========================================================
          DESKTOP & TABLET CONTAINER (Responsive & Margined)
      ========================================================= */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-[68px] lg:h-[72px] flex items-center justify-between gap-2 lg:gap-4 min-w-0">
        {/* MOBILE TOP BAR (Left: Hamburger Toggle) */}
        <div className="flex md:hidden items-center shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-1 text-slate-700 hover:text-[#0B3D91] hover:bg-slate-100/80 rounded-2xl active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30 cursor-pointer"
            aria-label="Abrir Menu de Navegação"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-slate-800" /> : <Menu className="w-5 h-5 text-slate-800" />}
          </button>
        </div>

        {/* =========================================================
            1. BRAND LOGO & LEFT NAVIGATION (Grouped to the Left)
        ========================================================= */}
        <div className="flex items-center gap-2 lg:gap-3.5 min-w-0">
          {/* Logo */}
          <div
            onClick={() => {
              setActiveTab('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 cursor-pointer group shrink-0 select-none"
          >
            <img
              src="/salvo-logo.png"
              alt="SALVÔ"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl object-cover shadow-xs group-hover:scale-105 transition-transform shrink-0 border border-slate-100"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://iili.io/CDs6WS1.jpg';
              }}
            />
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1 leading-none">
                <span className="text-lg sm:text-xl font-heading font-black tracking-tight text-[#0B3D91] whitespace-nowrap">
                  SALVÔ
                </span>
                <span className="text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 bg-[#C1502E] text-white rounded-md uppercase tracking-wider whitespace-nowrap shrink-0 shadow-2xs">
                  SSA
                </span>
              </div>
            </div>
          </div>

          {/* =========================================================
              DESKTOP / TABLET UNIFIED DUAL-DECK MENU (Menu Duplo em 1 Só)
              Organização perfeita de 10 opções em 2 níveis harmoniosos
          ========================================================= */}
          <nav className="hidden md:flex flex-col p-1 bg-slate-100/90 hover:bg-slate-100 rounded-2xl border border-slate-200/90 shadow-2xs gap-0.5 select-none transition-all">
            {/* ANDAR 1: Guia da Cidade, Bairros, Eventos, AoVivo e Oficial */}
            <div className="flex items-center gap-0.5 lg:gap-1 text-[11px] font-heading font-bold tracking-wide">
              {/* Micro Tag Categoria Cidade */}
              <div className="hidden xl:flex items-center gap-1 px-1.5 py-0.5 text-[8.5px] font-black text-[#0B3D91] bg-blue-100/80 rounded-md uppercase tracking-wider shrink-0">
                <Compass className="w-2.5 h-2.5 text-[#0B3D91]" />
                <span>Cidade</span>
              </div>

              {/* 1. Mapa & Lojas */}
              <button
                onClick={() => setActiveTab('explore')}
                className={`px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-1 focus:ring-[#0B3D91]/30 cursor-pointer ${
                  activeTab === 'explore'
                    ? 'bg-[#0B3D91] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-[#0B3D91] hover:bg-white/90'
                }`}
                title="Mapa Interativo e Lojas de Salvador"
              >
                <Compass className="w-3 h-3 shrink-0" />
                <span className="whitespace-nowrap">Mapa</span>
              </button>

              {/* 1.5 VIAJAR (Navegação GPS Profissional Estilo Uber / 99) */}
              <button
                onClick={() => setActiveTab('viajar')}
                className={`px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-1 focus:ring-[#0B3D91]/30 cursor-pointer ${
                  activeTab === 'viajar'
                    ? 'bg-gradient-to-r from-[#0B4F8A] to-[#083a66] text-[#FFC72C] shadow-2xs font-black ring-1 ring-[#FFC72C]/40'
                    : 'text-[#0B4F8A] hover:bg-blue-50/90 font-bold bg-blue-50/50'
                }`}
                title="VIAJAR: Navegação GPS Profissional, Roteirização Offline e Assistente Inteligente de Salvador"
              >
                <Navigation className={`w-3 h-3 shrink-0 ${activeTab === 'viajar' ? 'text-[#FFC72C] fill-[#FFC72C]' : 'text-[#0B4F8A]'}`} />
                <span className="whitespace-nowrap font-black">VIAJAR</span>
                <span className="text-[8px] bg-emerald-500 text-white px-1 py-0 rounded font-black uppercase tracking-wider shadow-2xs">
                  GPS
                </span>
              </button>

              {/* 2. Explorar Bairros */}
              {onOpenNeighborhoodGuide && (
                <button
                  onClick={onOpenNeighborhoodGuide}
                  className="px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all whitespace-nowrap select-none text-slate-600 hover:text-[#0B3D91] hover:bg-white/90 focus:outline-none focus:ring-1 focus:ring-[#0B3D91]/30 cursor-pointer"
                  title="Explorar todos os Bairros de Salvador"
                >
                  <MapPin className="w-3 h-3 text-[#0B3D91] shrink-0" />
                  <span className="whitespace-nowrap">Bairros</span>
                </button>
              )}

              {/* 3. Eventos & Agenda */}
              <button
                onClick={() => setActiveTab('events')}
                className={`px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-1 focus:ring-[#0B3D91]/30 cursor-pointer ${
                  activeTab === 'events'
                    ? 'bg-[#0B3D91] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-[#0B3D91] hover:bg-white/90'
                }`}
                title="Agenda Cultural e Eventos de Salvador"
              >
                <Calendar className={`w-3 h-3 shrink-0 ${activeTab === 'events' ? 'text-[#FFC72C]' : 'text-slate-500'}`} />
                <span className="whitespace-nowrap">Eventos</span>
              </button>

              {/* 4. Salvador AoVivo (Clima, Rádios & Trânsito) */}
              <button
                onClick={() => setActiveTab('weather_traffic')}
                className={`px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-1 focus:ring-[#0B3D91]/30 cursor-pointer ${
                  activeTab === 'weather_traffic'
                    ? 'bg-[#0B3D91] text-white shadow-2xs font-black'
                    : 'text-slate-700 hover:text-[#0B3D91] hover:bg-white/90 font-bold'
                }`}
                title="AoVivo: Clima em tempo real, Rádios de Salvador e Trânsito"
              >
                <Radio className={`w-3 h-3 shrink-0 ${activeTab === 'weather_traffic' ? 'text-[#FFC72C]' : 'text-rose-500'} animate-pulse`} />
                <span className="whitespace-nowrap font-bold">AoVivo</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0"></span>
              </button>

              {/* 5. Estúdio Salvô (Rádios & Músicas) */}
              <button
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('salvo-open-player', {
                      detail: { mode: 'studio', tab: 'radios-nat' },
                    })
                  );
                }}
                className="px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all whitespace-nowrap select-none text-slate-700 hover:text-[#0B3D91] hover:bg-white/90 font-bold focus:outline-none focus:ring-1 focus:ring-[#0B3D91]/30 cursor-pointer group"
                title="Estúdio Salvô: Rádios Nacionais, YouTube HD e Player de Áudio"
              >
                <Headphones className="w-3 h-3 shrink-0 text-[#0B3D91] group-hover:text-amber-500 transition-colors" />
                <span className="whitespace-nowrap">Estúdio</span>
                <span className="text-[8px] bg-purple-100 text-purple-700 px-1 py-0 rounded font-black uppercase">
                  HD
                </span>
              </button>

              {/* 6. Salvô Oficial */}
              <button
                onClick={() => setActiveTab('salvo_official')}
                className={`px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-1 focus:ring-[#0B3D91]/30 cursor-pointer ${
                  activeTab === 'salvo_official'
                    ? 'bg-gradient-to-r from-[#0B3D91] to-[#082B66] text-[#FFC72C] shadow-2xs font-black'
                    : 'text-slate-700 hover:text-[#0B3D91] hover:bg-white/90 font-bold'
                }`}
                title="Salvô Oficial: Página Oficial Verificada, Selos e Canais"
              >
                <ShieldCheck className={`w-3 h-3 shrink-0 ${activeTab === 'salvo_official' ? 'text-[#FFC72C]' : 'text-[#0B3D91]'}`} />
                <span className="whitespace-nowrap">Oficial</span>
                <span className="text-[8px] bg-[#FFC72C] text-[#0B3D91] px-1 py-0 rounded font-black uppercase">
                  ✓
                </span>
              </button>
            </div>

            {/* Separador Sutil Entre os Dois Andares */}
            <div className="h-[1px] bg-slate-200/80 w-full"></div>

            {/* ANDAR 2: Social, Ofertas, Conversas, Tráfego Pago e Favoritos */}
            <div className="flex items-center gap-0.5 lg:gap-1 text-[11px] font-heading font-bold tracking-wide">
              {/* Micro Tag Categoria Conexão */}
              <div className="hidden xl:flex items-center gap-1 px-1.5 py-0.5 text-[8.5px] font-black text-[#C1502E] bg-orange-100/80 rounded-md uppercase tracking-wider shrink-0">
                <Sparkles className="w-2.5 h-2.5 text-[#C1502E]" />
                <span>Conectar</span>
              </div>

              {/* 6. Ofertas */}
              <button
                onClick={() => setActiveTab('offers')}
                className={`px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-1 focus:ring-[#0B3D91]/30 cursor-pointer ${
                  activeTab === 'offers'
                    ? 'bg-[#0B3D91] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-[#0B3D91] hover:bg-white/90'
                }`}
                title="Ofertas e Promoções dos Lojistas"
              >
                <Sparkles className={`w-3 h-3 shrink-0 ${activeTab === 'offers' ? 'text-[#FFC72C]' : 'text-[#C1502E]'}`} />
                <span className="whitespace-nowrap">Ofertas</span>
                {activeOffersCount > 0 && (
                  <span
                    className={`salvo-nav-pill text-[9px] px-1.5 py-0 leading-none ${
                      activeTab === 'offers' ? 'bg-white text-[#0B3D91]' : 'bg-[#C1502E] text-white'
                    }`}
                  >
                    {activeOffersCount}
                  </span>
                )}
              </button>

              {/* 7. Para Mim (Feed Social) */}
              <button
                onClick={() => setActiveTab('for_you')}
                className={`px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-1 focus:ring-[#0B3D91]/30 cursor-pointer ${
                  activeTab === 'for_you'
                    ? 'bg-[#0B3D91] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-[#0B3D91] hover:bg-white/90'
                }`}
                title="Feed Social Para Mim de Salvador"
              >
                <Flame className={`w-3 h-3 shrink-0 ${activeTab === 'for_you' ? 'text-[#FFC72C]' : 'text-[#C1502E]'}`} />
                <span className="whitespace-nowrap">Para Mim</span>
                <span
                  className={`salvo-nav-pill uppercase tracking-wider text-[8px] px-1 py-0 leading-none ${
                    activeTab === 'for_you' ? 'bg-white text-[#0B3D91]' : 'bg-[#C1502E] text-white'
                  }`}
                >
                  Novo
                </span>
              </button>

              {/* 8. Chat */}
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-1 focus:ring-[#0B3D91]/30 cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-[#0B3D91] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-[#0B3D91] hover:bg-white/90'
                }`}
                title="Mensagens e Conversas"
              >
                <MessageSquare className="w-3 h-3 shrink-0" />
                <span className="whitespace-nowrap">Chat</span>
                {totalUnread > 0 && (
                  <span
                    className={`salvo-nav-pill text-[9px] px-1.5 py-0 leading-none ${
                      activeTab === 'chat' ? 'bg-white text-[#0B3D91]' : 'bg-[#1F6E43] text-white'
                    }`}
                  >
                    {totalUnread}
                  </span>
                )}
              </button>

              {/* 9. SALVÔ ADS (Tráfego Pago & Anúncios) */}
              <button
                onClick={() => setActiveTab('salvo_fe')}
                className={`px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-1 focus:ring-[#0B3D91]/30 cursor-pointer ${
                  activeTab === 'salvo_fe' || activeTab === 'salvofe_admin'
                    ? 'bg-gradient-to-r from-[#0B3D91] via-[#0E4DA4] to-[#1E3A8A] text-[#FFC72C] shadow-2xs font-black ring-1 ring-[#FFC72C]/50'
                    : 'bg-amber-500/10 text-[#0B3D91] hover:bg-amber-500/20 font-bold border border-amber-300/40'
                }`}
                title="SALVÔ ADS: Tráfego Pago, Leilão Fé Engine e Planos para Lojistas"
              >
                <Zap className={`w-3 h-3 shrink-0 ${activeTab === 'salvo_fe' ? 'text-[#FFC72C]' : 'text-[#D97706]'}`} />
                <span className="whitespace-nowrap">SALVÔ ADS</span>
                <span className="text-[8px] bg-[#FFC72C] text-[#0B3D91] px-1 py-0 rounded font-black uppercase tracking-wider shadow-2xs">
                  Anúncios
                </span>
              </button>

              {/* 10. Favoritos */}
              <button
                onClick={() => setActiveTab('favorites')}
                className={`px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-1 focus:ring-[#0B3D91]/30 cursor-pointer ${
                  activeTab === 'favorites'
                    ? 'bg-[#0B3D91] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-[#0B3D91] hover:bg-white/90'
                }`}
                title="Favoritos Salvos"
              >
                <Heart className={`w-3 h-3 shrink-0 ${activeTab === 'favorites' ? 'fill-white text-white' : 'text-rose-500'}`} />
                <span className="whitespace-nowrap">Favoritos</span>
                {favoritesCount > 0 && (
                  <span
                    className={`salvo-nav-pill text-[9px] px-1.5 py-0 leading-none ${
                      activeTab === 'favorites' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {favoritesCount}
                  </span>
                )}
              </button>
            </div>
          </nav>
        </div>

        {/* =========================================================
            2. RIGHT ACTIONS & DEDICATED USER PROFILE (Clean & Spacious)
        ========================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* DESTAQUE: Anunciar / Cadastrar Loja */}
          {currentUser.role === 'client' && onOpenMerchantRegister && (
            <button
              onClick={onOpenMerchantRegister}
              className="hidden sm:flex px-2.5 lg:px-3 py-1.5 rounded-xl items-center gap-1.5 transition-all whitespace-nowrap select-none bg-gradient-to-r from-[#FFC72C] to-[#FF9100] hover:brightness-105 text-[#072559] font-heading font-black shadow-xs active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#FFC72C]/60 cursor-pointer"
              title="Cadastrar Loja no Guia Oficial por R$ 12/mês"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#072559] shrink-0" />
              <span className="whitespace-nowrap">Anunciar</span>
              <span className="bg-[#0B3D91] text-white text-[9px] px-1 py-0.2 rounded font-bold shrink-0">
                R$12
              </span>
            </button>
          )}

          {/* Conditional: Merchant Panel */}
          {currentUser.role === 'merchant' && (
            <button
              onClick={() => setActiveTab('merchant_dashboard')}
              className={`hidden sm:flex px-2.5 lg:px-3 py-1.5 rounded-xl items-center gap-1 transition-all whitespace-nowrap select-none cursor-pointer ${
                activeTab === 'merchant_dashboard'
                  ? 'bg-[#0B3D91] text-white shadow-xs'
                  : 'text-[#0B3D91] bg-blue-50/80 hover:bg-blue-100'
              }`}
            >
              <Store className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">Painel</span>
            </button>
          )}

          {/* Conditional: Admin Panel */}
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin_dashboard')}
              className={`hidden sm:flex px-2.5 lg:px-3 py-1.5 rounded-xl items-center gap-1 transition-all whitespace-nowrap select-none cursor-pointer ${
                activeTab === 'admin_dashboard'
                  ? 'bg-[#C1502E] text-white shadow-xs'
                  : 'text-[#C1502E] bg-rose-50 hover:bg-rose-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">Admin</span>
            </button>
          )}

          {/* Mobile Right: Bairros Quick Trigger */}
          <div className="flex md:hidden items-center">
            {onOpenNeighborhoodGuide && (
              <button
                onClick={onOpenNeighborhoodGuide}
                className="p-2 text-slate-700 hover:text-[#0B3D91] hover:bg-slate-100/80 rounded-2xl active:scale-95 transition-all focus:outline-none cursor-pointer"
                title="Explorar Bairros de Salvador"
                aria-label="Explorar Bairros"
              >
                <MapPin className="w-5 h-5 text-[#0B3D91]" />
              </button>
            )}
          </div>

          {/* User Profile & Role Switcher Button */}
          <div className="relative shrink-0" id="user-profile-menu-container">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`flex items-center gap-2 p-1 sm:px-3 sm:py-1.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200/90 shadow-xs transition-all text-left whitespace-nowrap select-none focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30 cursor-pointer ${
                roleDropdownOpen ? 'bg-slate-100 border-slate-300' : ''
              }`}
              aria-expanded={roleDropdownOpen}
              aria-haspopup="true"
              aria-label="Menu de Usuário e Perfil"
            >
              {currentUser.avatar ? (
                <div className="relative shrink-0">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <span
                    className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#0B3D91] text-[#FFC72C] rounded-full border border-white flex items-center justify-center shadow-xs"
                    title="Perfil Verificado Salvô"
                  >
                    <ShieldCheck className="w-2.5 h-2.5 fill-current" />
                  </span>
                </div>
              ) : (
                <div className="relative shrink-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#0B3D91] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span
                    className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#FFC72C] text-[#0B3D91] rounded-full border border-white flex items-center justify-center shadow-xs"
                    title="Perfil Verificado Salvô"
                  >
                    <ShieldCheck className="w-2.5 h-2.5 fill-current" />
                  </span>
                </div>
              )}

              <div className="hidden sm:flex flex-col">
                <div className="flex items-center gap-1 leading-none">
                  <span className="text-xs font-black text-slate-900 truncate max-w-[100px] lg:max-w-[125px] whitespace-nowrap">
                    {currentUser.role === 'merchant' ? 'Pau da Lima House' : currentUser.name.split(' ')[0]}
                  </span>
                  {getRoleBadge()}
                </div>
                <span className="text-[9px] text-[#0B3D91] font-bold whitespace-nowrap mt-0.5 flex items-center gap-0.5">
                  <UserIcon className="w-2.5 h-2.5" />
                  <span>{currentUser.role === 'merchant' ? 'Lojista ▾' : 'Perfil ▾'}</span>
                </span>
              </div>

              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:block transition-transform duration-200 ${roleDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {roleDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-[260px] bg-white rounded-[12px] shadow-[0_10px_25px_-5px_rgba(11,61,145,0.1),0_8px_10px_-6px_rgba(0,0,0,0.05)] border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 font-sans"
              >
                {currentUser.role === 'merchant' ? (
                  /* =========================================================
                     DROPDOWN EXCLUSIVO DO LOJISTA (Pau da Lima House)
                     ========================================================= */
                  <>
                    {/* GRUPO 1 — IDENTIDADE DA LOJA */}
                    <div className="flex items-center gap-3 px-3.5 py-2">
                      <img
                        src={currentUser.avatar || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&auto=format&fit=crop&q=80'}
                        alt="Pau da Lima House"
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#0B3D91] shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[13.5px] font-bold text-slate-900 truncate leading-tight">
                            Pau da Lima House
                          </p>
                        </div>
                        <div className="mt-0.5">
                          <span className="bg-[#0B3D91] text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded leading-none inline-block">
                            LOJISTA
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            handleGoToProfile('merchant');
                          }}
                          className="text-[11px] text-slate-500 hover:text-[#0B3D91] hover:underline text-left mt-0.5 transition-colors inline-flex items-center gap-0.5 cursor-pointer"
                        >
                          Ver loja pública →
                        </button>
                      </div>
                    </div>

                    {/* DIVISOR */}
                    <div className="h-px bg-slate-100 my-1.5" />

                    {/* GRUPO 2 — GESTÃO */}
                    <div className="space-y-0.5">
                      <button
                        onClick={() => {
                          setActiveTab('merchant_dashboard');
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-[12.5px] font-medium text-slate-700 hover:bg-[#F3F4F6] hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        <span className="text-sm shrink-0 w-[18px] flex items-center justify-center">📊</span>
                        <span className="flex-1 whitespace-nowrap">Dashboard / Estatísticas</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('merchant_dashboard');
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-[12.5px] font-medium text-slate-700 hover:bg-[#F3F4F6] hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        <span className="text-sm shrink-0 w-[18px] flex items-center justify-center">📝</span>
                        <span className="flex-1 whitespace-nowrap">Meus Anúncios</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('chat');
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3.5 py-2 text-left text-[12.5px] font-medium text-slate-700 hover:bg-[#F3F4F6] hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm shrink-0 w-[18px] flex items-center justify-center">💬</span>
                          <span className="whitespace-nowrap">Atendimento</span>
                        </div>
                        {totalUnread > 0 && (
                          <span className="bg-[#0B3D91] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                            {totalUnread}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* DIVISOR */}
                    <div className="h-px bg-slate-100 my-1.5" />

                    {/* GRUPO 3 — CREDENCIAMENTO E PAGAMENTO */}
                    <div className="space-y-0.5">
                      {/* Selo Salvô Oficial com Status Dinâmico */}
                      <button
                        onClick={() => {
                          // Alterna status do selo ao clicar para fácil demonstração / controle
                          setSeloStatus((prev) => (prev === 'ativo' ? 'analise' : 'ativo'));
                        }}
                        className={`w-full flex flex-col items-start px-3.5 py-2 text-left hover:bg-[#F3F4F6] transition-colors cursor-pointer ${
                          seloStatus === 'ativo' ? 'status-ativo' : 'status-analise'
                        }`}
                        title="Clique para alternar status do selo (Ativo / Em análise)"
                      >
                        <div className="flex items-center gap-2.5 text-[12.5px] font-semibold text-[#0B3D91]">
                          <span className="text-sm shrink-0 w-[18px] flex items-center justify-center font-bold">✓</span>
                          <span>Selo Salvô Oficial</span>
                        </div>
                        <div className="ml-[28px] mt-0.5 text-[11px] font-medium">
                          {seloStatus === 'ativo' ? (
                            <span className="text-emerald-600">Status: Ativo ✅</span>
                          ) : (
                            <span className="text-orange-600">Status: Em análise ⏳</span>
                          )}
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('salvo_fe');
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-[12.5px] font-medium text-slate-700 hover:bg-[#F3F4F6] hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        <span className="text-sm shrink-0 w-[18px] flex items-center justify-center">🏷️</span>
                        <span className="flex-1 whitespace-nowrap">Planos e Pagamentos</span>
                      </button>
                    </div>

                    {/* DIVISOR */}
                    <div className="h-px bg-slate-100 my-1.5" />

                    {/* GRUPO 4 — LOJA E SESSÃO */}
                    <div className="space-y-0.5">
                      <button
                        onClick={() => {
                          setActiveTab('merchant_dashboard');
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-[12.5px] font-medium text-slate-700 hover:bg-[#F3F4F6] hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        <span className="text-sm shrink-0 w-[18px] flex items-center justify-center">⚙️</span>
                        <span className="flex-1 whitespace-nowrap">Configurações da Loja</span>
                      </button>

                      <button
                        onClick={() => {
                          // Alternar para cliente ou deslogar
                          const clientUser = allUsers.find(u => u.role === 'client');
                          if (clientUser && onSwitchUser) {
                            onSwitchUser(clientUser.id);
                          }
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-[12.5px] font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                      >
                        <span className="text-sm shrink-0 w-[18px] flex items-center justify-center">🚪</span>
                        <span className="flex-1 whitespace-nowrap">Sair</span>
                      </button>
                    </div>

                    {/* Rodapé sutil com alternância de perfil demo se necessário */}
                    <div className="h-px bg-slate-100 my-1.5" />
                    <div className="px-3.5 py-1">
                      <button
                        onClick={() => {
                          const clientUser = allUsers.find(u => u.role === 'client');
                          if (clientUser && onSwitchUser) {
                            onSwitchUser(clientUser.id);
                          }
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full text-center text-[10px] text-slate-400 hover:text-[#0B3D91] transition-colors py-0.5"
                      >
                        Alternar para conta Cliente (Beatriz) ▾
                      </button>
                    </div>
                  </>
                ) : (
                  /* =========================================================
                     DROPDOWN DO CLIENTE / USUÁRIO PADRÃO
                     ========================================================= */
                  <>
                    {/* Identidade do Usuário */}
                    <div className="px-3.5 py-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-slate-900 truncate">{currentUser.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {getRoleBadge()}
                            <span className="text-[10px] text-slate-400 font-semibold">• Salvador</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100 my-1.5" />

                    <div className="space-y-0.5">
                      <button
                        onClick={() => handleGoToProfile('client')}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-[12.5px] font-medium text-slate-700 hover:bg-[#F3F4F6] transition-colors cursor-pointer"
                      >
                        <span className="text-sm shrink-0 w-[18px] flex items-center justify-center">👤</span>
                        <span>Meu Perfil</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('favorites');
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-[12.5px] font-medium text-slate-700 hover:bg-[#F3F4F6] transition-colors cursor-pointer"
                      >
                        <span className="text-sm shrink-0 w-[18px] flex items-center justify-center">❤️</span>
                        <span>Meus Favoritos</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('chat');
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-[12.5px] font-medium text-slate-700 hover:bg-[#F3F4F6] transition-colors cursor-pointer"
                      >
                        <span className="text-sm shrink-0 w-[18px] flex items-center justify-center">💬</span>
                        <span>Minhas Mensagens</span>
                      </button>

                      <button
                        onClick={() => {
                          window.dispatchEvent(
                            new CustomEvent('salvo-open-player', {
                              detail: { mode: 'studio', tab: 'radios-nat' },
                            })
                          );
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3.5 py-2 text-left text-[12.5px] font-medium text-slate-700 hover:bg-[#F3F4F6] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Headphones className="w-4 h-4 text-[#0B3D91] shrink-0" />
                          <span>Estúdio Salvô (Rádios)</span>
                        </div>
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                          HD
                        </span>
                      </button>
                    </div>

                    <div className="h-px bg-slate-100 my-1.5" />

                    {/* Trocar para Lojista Pau da Lima House */}
                    <div className="px-2 py-1">
                      <button
                        onClick={() => {
                          const merchantUser = allUsers.find(u => u.role === 'merchant');
                          if (merchantUser && onSwitchUser) {
                            onSwitchUser(merchantUser.id);
                          }
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-blue-50/70 hover:bg-blue-100/80 border border-blue-100 text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Store className="w-4 h-4 text-[#0B3D91] shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-bold text-[#0B3D91]">Pau da Lima House</p>
                            <p className="text-[10px] text-slate-500">Alternar para Lojista</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-[#0B3D91] bg-white px-2 py-0.5 rounded shadow-xs">
                          Acessar →
                        </span>
                      </button>
                    </div>

                    <div className="h-px bg-slate-100 my-1.5" />

                    <button
                      onClick={() => {
                        if (onOpenAuth) onOpenAuth();
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-[12.5px] font-medium text-slate-700 hover:bg-[#F3F4F6] transition-colors cursor-pointer"
                    >
                      <span className="text-sm shrink-0 w-[18px] flex items-center justify-center">🚪</span>
                      <span>Sair</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          4. MOBILE DRAWER NAVIGATION
      ========================================================= */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 animate-in slide-in-from-top-4 duration-200 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {getRoleBadge()}
                  <span className="text-[10px] text-slate-400">Salvador • BA</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                if (onOpenAuth) onOpenAuth();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-[#0B3D91] bg-blue-50 px-2.5 py-1 rounded-lg"
            >
              Trocar
            </button>
          </div>

          {/* 1. Meu Perfil de Cliente */}
          <button
            onClick={() => handleGoToProfile('client')}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl font-heading font-bold text-xs whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-[#0B3D91] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <UserIcon className="w-4 h-4 shrink-0 text-[#0B3D91]" />
              <span>Meu Perfil de Cliente</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#0B3D91]">
              Social
            </span>
          </button>

          {/* 2. Meu Perfil de Lojista */}
          <button
            onClick={() => handleGoToProfile('merchant')}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl font-heading font-bold text-xs whitespace-nowrap text-slate-700 hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <Store className="w-4 h-4 shrink-0 text-[#C1502E]" />
              <span>Meu Perfil de Lojista</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-50 text-[#C1502E]">
              {currentUser.role === 'merchant' ? 'Loja' : 'Vitrine'}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('explore');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl font-heading font-bold text-xs whitespace-nowrap ${
              activeTab === 'explore'
                ? 'bg-[#0B3D91] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Compass className="w-4 h-4 shrink-0" />
            <span>Mapa & Lojas de Salvador</span>
          </button>

          {/* VIAJAR GPS Módulo Mobile */}
          <button
            onClick={() => {
              setActiveTab('viajar');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl font-heading font-bold text-xs whitespace-nowrap ${
              activeTab === 'viajar'
                ? 'bg-[#0B4F8A] text-white shadow-xs'
                : 'text-[#0B4F8A] bg-blue-50/70 hover:bg-blue-100/70'
            }`}
          >
            <div className="flex items-center gap-3">
              <Navigation className={`w-4 h-4 shrink-0 ${activeTab === 'viajar' ? 'text-[#FFC72C] fill-[#FFC72C]' : 'text-[#0B4F8A]'}`} />
              <span className="font-black">VIAJAR (Navegação GPS)</span>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-500 text-white uppercase">
              GPS Uber Style
            </span>
          </button>

          {/* Explorar Bairros de Salvador */}
          {onOpenNeighborhoodGuide && (
            <button
              onClick={() => {
                onOpenNeighborhoodGuide();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl font-heading font-bold text-xs whitespace-nowrap text-slate-700 hover:bg-slate-50 hover:text-[#0B3D91] transition-colors"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#0B3D91] shrink-0" />
                <span>Explorar Bairros de Salvador</span>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 bg-blue-50 text-[#0B3D91] rounded-md uppercase tracking-wider">
                Guia
              </span>
            </button>
          )}

          <button
            onClick={() => {
              setActiveTab('offers');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl font-heading font-bold text-xs whitespace-nowrap ${
              activeTab === 'offers'
                ? 'bg-[#0B3D91] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles className={`w-4 h-4 shrink-0 ${activeTab === 'offers' ? 'text-[#FFC72C]' : 'text-[#C1502E]'}`} />
              <span>Ofertas da Cidade</span>
            </div>
            {activeOffersCount > 0 && (
              <span
                className={`salvo-nav-pill ${
                  activeTab === 'offers' ? 'bg-white text-[#0B3D91]' : 'bg-[#C1502E] text-white'
                }`}
              >
                {activeOffersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('for_you');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl font-heading font-bold text-xs whitespace-nowrap ${
              activeTab === 'for_you'
                ? 'bg-[#0B3D91] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Flame className={`w-4 h-4 shrink-0 ${activeTab === 'for_you' ? 'text-[#FFC72C]' : 'text-[#C1502E]'}`} />
              <span>Para Mim (Social & Lojas)</span>
            </div>
            <span
              className={`salvo-nav-pill uppercase tracking-wider ${
                activeTab === 'for_you' ? 'bg-white text-[#0B3D91]' : 'bg-[#C1502E] text-white'
              }`}
            >
              Novo
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('chat');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl font-heading font-bold text-xs whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-[#0B3D91] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Mensagens / Chat</span>
            </div>
            {totalUnread > 0 && (
              <span
                className={`salvo-nav-pill ${
                  activeTab === 'chat' ? 'bg-white text-[#0B3D91]' : 'bg-[#1F6E43] text-white'
                }`}
              >
                {totalUnread}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('events');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl font-heading font-bold text-xs whitespace-nowrap ${
              activeTab === 'events'
                ? 'bg-[#0B3D91] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Calendar className={`w-4 h-4 shrink-0 ${activeTab === 'events' ? 'text-[#FFC72C]' : 'text-slate-500'}`} />
              <span>Eventos & Agenda Cultural</span>
            </div>
            <span className="px-2 py-0.5 bg-blue-50 text-[#0B3D91] text-[9px] font-bold rounded-full uppercase">
              Salvador
            </span>
          </button>

          {/* Salvador AoVivo (Clima, Rádios & Trânsito) */}
          <button
            onClick={() => {
              setActiveTab('weather_traffic');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl font-heading font-bold text-xs whitespace-nowrap ${
              activeTab === 'weather_traffic'
                ? 'bg-[#0B3D91] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Radio className={`w-4 h-4 shrink-0 ${activeTab === 'weather_traffic' ? 'text-[#FFC72C]' : 'text-rose-500'} animate-pulse`} />
              <span>AoVivo (Clima, Rádios & Trânsito)</span>
            </div>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black rounded-full uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Ao Vivo
            </span>
          </button>

          {/* Estúdio Salvô (Rádios Nacionais & Músicas) */}
          <button
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent('salvo-open-player', {
                  detail: { mode: 'studio', tab: 'radios-nat' },
                })
              );
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl font-heading font-bold text-xs text-slate-700 hover:bg-purple-50 whitespace-nowrap"
          >
            <div className="flex items-center gap-3">
              <Headphones className="w-4 h-4 shrink-0 text-[#0B3D91]" />
              <span>Estúdio Salvô (Rádios & Som)</span>
            </div>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[9px] font-black rounded-full uppercase">
              HD Pro
            </span>
          </button>

          {/* Salvô Oficial */}
          <button
            onClick={() => {
              setActiveTab('salvo_official');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl font-heading font-bold text-xs whitespace-nowrap ${
              activeTab === 'salvo_official'
                ? 'bg-gradient-to-r from-[#0B3D91] to-[#082B66] text-[#FFC72C] shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className={`w-4 h-4 shrink-0 ${activeTab === 'salvo_official' ? 'text-[#FFC72C]' : 'text-[#0B3D91]'}`} />
              <span className="font-black">Salvô Oficial (Página Verificada)</span>
            </div>
            <span className="px-2 py-0.5 bg-[#FFC72C] text-[#0B3D91] text-[9px] font-black rounded-full uppercase">
              Oficial ✓
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('favorites');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl font-heading font-bold text-xs whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'bg-[#0B3D91] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Heart className={`w-4 h-4 shrink-0 ${activeTab === 'favorites' ? 'fill-white text-white' : 'text-rose-500'}`} />
              <span>Lojas Favoritas</span>
            </div>
            {favoritesCount > 0 && (
              <span
                className={`salvo-nav-pill ${
                  activeTab === 'favorites' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {favoritesCount}
              </span>
            )}
          </button>

          {currentUser.role === 'merchant' && (
            <button
              onClick={() => {
                setActiveTab('merchant_dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl font-heading font-bold text-xs bg-blue-50 text-[#0B3D91] whitespace-nowrap"
            >
              <Store className="w-4 h-4 shrink-0" />
              <span>Painel do Lojista (R$ 12/mês)</span>
            </button>
          )}

          {currentUser.role === 'admin' && (
            <button
              onClick={() => {
                setActiveTab('admin_dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl font-heading font-bold text-xs bg-rose-50 text-[#C1502E] whitespace-nowrap"
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Painel Administrativo</span>
            </button>
          )}

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                if (onOpenMerchantRegister) onOpenMerchantRegister();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-[#FFC72C] text-[#0B3D91] font-heading font-black text-xs uppercase tracking-wider rounded-2xl shadow-xs flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>Cadastrar Minha Loja (R$ 12/mês)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
