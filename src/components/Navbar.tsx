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
  LogIn,
  Flame,
  Sun,
  Radio,
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
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-16 sm:h-17 flex items-center justify-between gap-2 lg:gap-4 min-w-0">
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
              className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl sm:rounded-2xl object-cover shadow-xs group-hover:scale-105 transition-transform shrink-0 border border-slate-100"
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

          {/* DESKTOP / TABLET NAVIGATION (Shifted to Left White Space) */}
          <nav className="hidden md:flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 gap-0.5 lg:gap-1 text-[11px] lg:text-xs font-heading font-bold tracking-wide overflow-x-auto scrollbar-none">
            {/* Mapa & Lojas */}
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-2 py-1.5 rounded-xl flex items-center gap-1 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30 cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-[#0B3D91] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0B3D91] hover:bg-white/80'
              }`}
            >
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">Mapa</span>
            </button>

            {/* Explorar Bairros */}
            {onOpenNeighborhoodGuide && (
              <button
                onClick={onOpenNeighborhoodGuide}
                className="px-2 py-1.5 rounded-xl flex items-center gap-1 transition-all whitespace-nowrap select-none text-slate-600 hover:text-[#0B3D91] hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30 cursor-pointer"
                title="Explorar todos os Bairros de Salvador"
              >
                <MapPin className="w-3.5 h-3.5 text-[#0B3D91] shrink-0" />
                <span className="whitespace-nowrap">Bairros</span>
              </button>
            )}

            {/* Ofertas */}
            <button
              onClick={() => setActiveTab('offers')}
              className={`px-2 py-1.5 rounded-xl flex items-center gap-1 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30 cursor-pointer ${
                activeTab === 'offers'
                  ? 'bg-[#0B3D91] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0B3D91] hover:bg-white/80'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'offers' ? 'text-[#FFC72C]' : 'text-[#C1502E]'}`} />
              <span className="whitespace-nowrap">Ofertas</span>
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

            {/* Para Mim (Feed Social) */}
            <button
              onClick={() => setActiveTab('for_you')}
              className={`px-2 py-1.5 rounded-xl flex items-center gap-1 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30 cursor-pointer ${
                activeTab === 'for_you'
                  ? 'bg-[#0B3D91] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0B3D91] hover:bg-white/80'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'for_you' ? 'text-[#FFC72C]' : 'text-[#C1502E]'}`} />
              <span className="whitespace-nowrap">Para Mim</span>
              <span
                className={`salvo-nav-pill uppercase tracking-wider text-[9px] ${
                  activeTab === 'for_you' ? 'bg-white text-[#0B3D91]' : 'bg-[#C1502E] text-white'
                }`}
              >
                Novo
              </span>
            </button>

            {/* Chat */}
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-2 py-1.5 rounded-xl flex items-center gap-1 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30 cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-[#0B3D91] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0B3D91] hover:bg-white/80'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">Chat</span>
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

            {/* Eventos & Agenda */}
            <button
              onClick={() => setActiveTab('events')}
              className={`px-2 py-1.5 rounded-xl flex items-center gap-1 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30 cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-[#0B3D91] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0B3D91] hover:bg-white/80'
              }`}
            >
              <Calendar className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'events' ? 'text-[#FFC72C]' : 'text-slate-500'}`} />
              <span className="whitespace-nowrap">Eventos</span>
            </button>

            {/* Salvador AoVivo (Clima, Rádios & Trânsito) */}
            <button
              onClick={() => setActiveTab('weather_traffic')}
              className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30 cursor-pointer ${
                activeTab === 'weather_traffic'
                  ? 'bg-[#0B3D91] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0B3D91] hover:bg-white/80'
              }`}
              title="AoVivo: Clima em tempo real, Rádios de Salvador e Trânsito"
            >
              <Radio className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'weather_traffic' ? 'text-[#FFC72C]' : 'text-rose-500'} animate-pulse`} />
              <span className="whitespace-nowrap font-bold">AoVivo</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0"></span>
            </button>

            {/* Página Oficial: Salvô Oficial */}
            <button
              onClick={() => setActiveTab('salvo_official')}
              className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30 cursor-pointer ${
                activeTab === 'salvo_official'
                  ? 'bg-gradient-to-r from-[#0B3D91] to-[#082B66] text-[#FFC72C] shadow-xs font-black'
                  : 'text-slate-700 hover:text-[#0B3D91] hover:bg-white/80 font-bold'
              }`}
              title="Salvô Oficial: Página Oficial Verificada, Selos e Canais"
            >
              <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'salvo_official' ? 'text-[#FFC72C]' : 'text-[#0B3D91]'}`} />
              <span className="whitespace-nowrap">Salvô Oficial</span>
              <span className="text-[9px] bg-[#FFC72C] text-[#0B3D91] px-1 py-0.2 rounded font-black uppercase">
                ✓
              </span>
            </button>

            {/* Favoritos */}
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-2 py-1.5 rounded-xl flex items-center gap-1 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30 cursor-pointer ${
                activeTab === 'favorites'
                  ? 'bg-[#0B3D91] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0B3D91] hover:bg-white/80'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'favorites' ? 'fill-white text-white' : 'text-rose-500'}`} />
              <span className="whitespace-nowrap hidden lg:inline">Favoritos</span>
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

          {/* User Profile & Role Switcher Button (Highlighted & Spacious) */}
          <div className="relative shrink-0">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 p-1 sm:px-3 sm:py-1.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200/90 shadow-xs transition-all text-left whitespace-nowrap select-none focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30 cursor-pointer"
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
                  <span className="text-xs font-black text-slate-900 truncate max-w-[90px] lg:max-w-[110px] whitespace-nowrap">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  {getRoleBadge()}
                </div>
                <span className="text-[9px] text-[#0B3D91] font-bold whitespace-nowrap mt-0.5 flex items-center gap-0.5">
                  <UserIcon className="w-2.5 h-2.5" />
                  <span>Perfil ▾</span>
                </span>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu (Comprehensive Client/Merchant Choice) */}
            {roleDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setRoleDropdownOpen(false)}
              >
                {/* Active User Header */}
                <div className="px-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium truncate">{currentUser.email}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {getRoleBadge()}
                        <span className="text-[10px] text-slate-400 font-semibold">• Salvador, BA</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Profile Actions (Client vs Merchant Views) */}
                <div className="p-2 space-y-1 border-b border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 block pt-1">
                    Visualizar Meu Perfil
                  </span>

                  {/* 0. Salvô Oficial */}
                  <button
                    onClick={() => {
                      setActiveTab('salvo_official');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-2xl text-left bg-amber-50/50 hover:bg-amber-100/70 border border-amber-200/60 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0B3D91] to-[#C1502E] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                        <ShieldCheck className="w-4 h-4 text-[#FFC72C]" />
                      </div>
                      <div>
                        <strong className="text-xs font-bold text-slate-900 block group-hover:text-[#0B3D91] flex items-center gap-1">
                          <span>Salvô Oficial</span>
                          <span className="text-[9px] px-1 py-0.2 bg-[#0B3D91] text-[#FFC72C] rounded font-black uppercase">Oficial</span>
                        </strong>
                        <span className="text-[10px] text-slate-500 font-medium">
                          Página oficial, selo verificado e canais
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-[#0B3D91] bg-white px-2 py-0.5 rounded-lg border border-amber-200 shadow-xs">
                      Ver →
                    </span>
                  </button>

                  {/* 1. Meu Perfil de Cliente */}
                  <button
                    onClick={() => handleGoToProfile('client')}
                    className="w-full flex items-center justify-between p-2.5 rounded-2xl text-left hover:bg-blue-50/80 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0B3D91] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-xs font-bold text-slate-800 block group-hover:text-[#0B3D91]">
                          Meu Perfil de Cliente
                        </strong>
                        <span className="text-[10px] text-slate-500 font-medium">
                          Amigos, fotos, posts e favoritos
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#0B3D91] bg-blue-50 px-2 py-0.5 rounded-lg">
                      Ver →
                    </span>
                  </button>

                  {/* 2. Meu Perfil de Lojista */}
                  <button
                    onClick={() => handleGoToProfile('merchant')}
                    className="w-full flex items-center justify-between p-2.5 rounded-2xl text-left hover:bg-orange-50/80 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#C1502E] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-xs font-bold text-slate-800 block group-hover:text-[#C1502E]">
                          Meu Perfil de Lojista
                        </strong>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {currentUser.role === 'merchant'
                            ? 'Vitrine, ofertas, avaliações e parcerias'
                            : 'Ver como sua loja apareceria no SALVÔ'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#C1502E] bg-orange-50 px-2 py-0.5 rounded-lg">
                      {currentUser.role === 'merchant' ? 'Loja →' : 'Simular →'}
                    </span>
                  </button>

                  {/* 3. Painel do Lojista (se for lojista) */}
                  {currentUser.role === 'merchant' && (
                    <button
                      onClick={() => {
                        setActiveTab('merchant_dashboard');
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-2xl text-left hover:bg-emerald-50/80 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#1F6E43] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <SlidersHorizontal className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-slate-800 block group-hover:text-[#1F6E43]">
                            Painel de Gestão (Meu Negócio)
                          </strong>
                          <span className="text-[10px] text-slate-500 font-medium">
                            Editar ofertas, fotos e parcerias
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#1F6E43] bg-emerald-50 px-2 py-0.5 rounded-lg">
                        Abrir
                      </span>
                    </button>
                  )}

                  {/* 4. Painel de Admin (se for admin) */}
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        setActiveTab('admin_dashboard');
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-2xl text-left hover:bg-rose-50/80 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-rose-100 text-[#C1502E] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-slate-800 block group-hover:text-[#C1502E]">
                            Painel de Administração
                          </strong>
                          <span className="text-[10px] text-slate-500 font-medium">
                            Moderar lojas e eventos de Salvador
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#C1502E] bg-rose-50 px-2 py-0.5 rounded-lg">
                        Admin
                      </span>
                    </button>
                  )}
                </div>

                {/* Instant Role Switching (Demo Accounts) */}
                <div className="p-2 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 block pt-1">
                    Alternar Conta Demo
                  </span>

                  {allUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        if (onSwitchUser) onSwitchUser(user.id);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-2xl text-left transition-all cursor-pointer ${
                        currentUser.id === user.id
                          ? 'bg-blue-50/90 border border-[#0B3D91]/20'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-7 h-7 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="truncate min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate whitespace-nowrap">
                            {user.name}
                          </p>
                          <span className="text-[10px] text-slate-400 truncate block whitespace-nowrap">
                            {user.role === 'merchant'
                              ? 'Lojista • Salvador'
                              : user.role === 'admin'
                              ? 'Administrador'
                              : 'Cliente • Salvador'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md whitespace-nowrap ${
                            user.role === 'merchant'
                              ? 'bg-[#0B3D91] text-white'
                              : user.role === 'admin'
                              ? 'bg-[#C1502E] text-white'
                              : 'bg-[#1F6E43] text-white'
                          }`}
                        >
                          {user.role === 'merchant'
                            ? 'Lojista'
                            : user.role === 'admin'
                            ? 'Admin'
                            : 'Cliente'}
                        </span>
                        {currentUser.id === user.id && (
                          <Check className="w-3.5 h-3.5 text-[#0B3D91]" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-2 px-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      if (onOpenAuth) onOpenAuth();
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-[#0B3D91] hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 shrink-0" />
                    <span>Entrar ou Criar Nova Conta</span>
                  </button>
                </div>
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
