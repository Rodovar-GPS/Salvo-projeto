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
          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#0B4F8A] text-white whitespace-nowrap shrink-0">
            Lojista
          </span>
        );
      case 'admin':
        return (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#E8552B] text-white whitespace-nowrap shrink-0">
            Admin
          </span>
        );
      case 'client':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#FFC72C] text-[#0B4F8A] whitespace-nowrap shrink-0">
            Grátis
          </span>
        );
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-white/98 backdrop-blur-md transition-all duration-200 ${
        isScrolled
          ? 'shadow-md border-b border-slate-200/90'
          : 'shadow-2xs border-b border-slate-200/70'
      }`}
    >
      {/* Fitinha do Bonfim Oficial (Header Stripe) */}
      <BonfimRibbon height="h-1.5" />

      {/* =========================================================
          DESKTOP & TABLET CONTAINER
      ========================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-17 flex items-center justify-between gap-2 lg:gap-4">
        {/* MOBILE TOP BAR (Left: Hamburger Toggle) */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 -ml-1 text-slate-700 hover:text-[#0B4F8A] hover:bg-slate-100/80 rounded-2xl active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#0B4F8A]/30"
            aria-label="Abrir Menu de Navegação"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-slate-800" /> : <Menu className="w-5 h-5 text-slate-800" />}
          </button>
        </div>

        {/* =========================================================
            1. BRAND LOGO (SALVÔ - Guia Oficial do Comércio Local)
        ========================================================= */}
        <div
          onClick={() => {
            setActiveTab('explore');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0 select-none mx-auto md:mx-0"
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
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-xl sm:text-2xl font-heading font-black tracking-tight text-[#0B4F8A] whitespace-nowrap">
                SALVÔ
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.5 bg-[#FFC72C] text-[#0B4F8A] rounded uppercase tracking-wider whitespace-nowrap shrink-0">
                SSA
              </span>
            </div>
            <span className="hidden sm:block text-[10px] font-bold text-slate-500 whitespace-nowrap mt-0.5 tracking-tight">
              Guia Oficial do Comércio Local de Salvador
            </span>
          </div>
        </div>

        {/* =========================================================
            2. DESKTOP / TABLET CENTER NAVIGATION
        ========================================================= */}
        <nav className="hidden md:flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shrink-0 gap-0.5 lg:gap-1 text-xs font-heading font-black tracking-wide">
          {/* Mapa & Lojas */}
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3 lg:px-3.5 py-1.5 lg:py-2 rounded-xl flex items-center gap-1.5 lg:gap-2 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-2 focus:ring-[#0B4F8A]/30 ${
              activeTab === 'explore'
                ? 'bg-[#0B4F8A] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0B4F8A] hover:bg-white/80'
            }`}
          >
            <Compass className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Mapa</span>
          </button>

          {/* Ofertas */}
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-3 lg:px-3.5 py-1.5 lg:py-2 rounded-xl flex items-center gap-1.5 lg:gap-2 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-2 focus:ring-[#0B4F8A]/30 ${
              activeTab === 'offers'
                ? 'bg-[#0B4F8A] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0B4F8A] hover:bg-white/80'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#FFC72C] shrink-0" />
            <span className="whitespace-nowrap">Ofertas</span>
            {activeOffersCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#E8552B] text-white text-[10px] rounded-full font-black whitespace-nowrap shrink-0">
                {activeOffersCount}
              </span>
            )}
          </button>

          {/* Para Mim (Rede Social & Descoberta Local) */}
          <button
            onClick={() => setActiveTab('for_you')}
            className={`px-3 lg:px-3.5 py-1.5 lg:py-2 rounded-xl flex items-center gap-1.5 lg:gap-2 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-2 focus:ring-[#0B4F8A]/30 ${
              activeTab === 'for_you'
                ? 'bg-[#0B4F8A] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0B4F8A] hover:bg-white/80'
            }`}
          >
            <Flame className="w-4 h-4 text-[#E8552B] shrink-0" />
            <span className="whitespace-nowrap">Para Mim</span>
            <span className="px-1.5 py-0.2 bg-gradient-to-r from-[#FFC72C] to-[#E8552B] text-slate-900 text-[9px] rounded-md font-black whitespace-nowrap shrink-0 uppercase">
              Novo
            </span>
          </button>

          {/* Chat */}
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 lg:px-3.5 py-1.5 lg:py-2 rounded-xl flex items-center gap-1.5 lg:gap-2 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-2 focus:ring-[#0B4F8A]/30 ${
              activeTab === 'chat'
                ? 'bg-[#0B4F8A] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0B4F8A] hover:bg-white/80'
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Chat</span>
            {totalUnread > 0 && (
              <span className="px-1.5 py-0.2 bg-[#2E9E5B] text-white text-[10px] rounded-full font-black whitespace-nowrap shrink-0">
                {totalUnread}
              </span>
            )}
          </button>

          {/* Eventos & Agenda */}
          <button
            onClick={() => setActiveTab('events')}
            className={`px-3 lg:px-3.5 py-1.5 lg:py-2 rounded-xl flex items-center gap-1.5 lg:gap-2 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-2 focus:ring-[#0B4F8A]/30 ${
              activeTab === 'events'
                ? 'bg-[#0B4F8A] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0B4F8A] hover:bg-white/80'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#FFC72C] shrink-0" />
            <span className="whitespace-nowrap">Eventos</span>
          </button>

          {/* Favoritos */}
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-3 lg:px-3.5 py-1.5 lg:py-2 rounded-xl flex items-center gap-1.5 lg:gap-2 transition-all whitespace-nowrap select-none focus:outline-none focus:ring-2 focus:ring-[#0B4F8A]/30 ${
              activeTab === 'favorites'
                ? 'bg-[#0B4F8A] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0B4F8A] hover:bg-white/80'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="whitespace-nowrap">Favoritos</span>
            {favoritesCount > 0 && (
              <span className="text-[10px] font-bold opacity-75 whitespace-nowrap ml-0.5">
                ({favoritesCount})
              </span>
            )}
          </button>

          {/* Conditional: Merchant Panel */}
          {currentUser.role === 'merchant' && (
            <button
              onClick={() => setActiveTab('merchant_dashboard')}
              className={`px-3 lg:px-3.5 py-1.5 lg:py-2 rounded-xl flex items-center gap-1.5 lg:gap-2 transition-all whitespace-nowrap select-none ${
                activeTab === 'merchant_dashboard'
                  ? 'bg-[#0B4F8A] text-white shadow-xs'
                  : 'text-[#0B4F8A] bg-blue-50/80 hover:bg-blue-100'
              }`}
            >
              <Store className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Meu Negócio</span>
            </button>
          )}

          {/* Conditional: Admin Panel */}
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin_dashboard')}
              className={`px-3 lg:px-3.5 py-1.5 lg:py-2 rounded-xl flex items-center gap-1.5 lg:gap-2 transition-all whitespace-nowrap select-none ${
                activeTab === 'admin_dashboard'
                  ? 'bg-[#E8552B] text-white shadow-xs'
                  : 'text-[#E8552B] bg-rose-50 hover:bg-rose-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Admin</span>
            </button>
          )}
        </nav>

        {/* =========================================================
            3. RIGHT ACTIONS (CTA & PROFILE SWITCHER / MOBILE SHORTCUT)
        ========================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Mobile Right: Bairros / Localização Quick Trigger */}
          <div className="flex md:hidden items-center gap-1">
            {onOpenNeighborhoodGuide && (
              <button
                onClick={onOpenNeighborhoodGuide}
                className="p-2.5 text-slate-700 hover:text-[#0B4F8A] hover:bg-slate-100/80 rounded-2xl active:scale-95 transition-all focus:outline-none"
                title="Explorar Bairros de Salvador"
                aria-label="Explorar Bairros"
              >
                <MapPin className="w-5 h-5 text-[#0B4F8A]" />
              </button>
            )}
          </div>

          {/* Cadastrar Loja CTA (AMARELO Principal) */}
          {currentUser.role === 'client' && (
            <button
              onClick={onOpenMerchantRegister}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 bg-[#FFC72C] hover:bg-[#F5BC20] text-[#0B4F8A] font-heading font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all active:scale-95 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FFC72C]/60 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#0B4F8A] shrink-0" />
              <span className="whitespace-nowrap">Cadastrar Loja</span>
              <span className="bg-[#0B4F8A] text-white text-[10px] px-1.5 py-0.5 rounded-md font-black tracking-normal whitespace-nowrap shrink-0">
                R$ 12/mês
              </span>
            </button>
          )}

          {/* User Profile / Demo Persona Switcher */}
          <div className="relative shrink-0">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 sm:gap-2 p-1 sm:px-2.5 sm:py-1.5 bg-slate-50 hover:bg-slate-100/90 rounded-2xl border border-slate-200/90 transition-all text-left whitespace-nowrap select-none focus:outline-none focus:ring-2 focus:ring-[#0B4F8A]/30 cursor-pointer"
              aria-label="Menu de Usuário"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#0B4F8A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
              )}

              <div className="hidden lg:flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[100px] whitespace-nowrap">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  {getRoleBadge()}
                </div>
                <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap mt-0.5">
                  Alternar Perfil
                </span>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-0.5 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {roleDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setRoleDropdownOpen(false)}
              >
                <div className="px-4 pb-2 border-b border-slate-100">
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    Modo Demonstração
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Alterne instantaneamente o papel de teste:
                  </p>
                </div>

                <div className="p-2 space-y-1">
                  {allUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        if (onSwitchUser) onSwitchUser(user.id);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-2xl text-left transition-all ${
                        currentUser.id === user.id
                          ? 'bg-blue-50/90 border border-[#0B4F8A]/20'
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
                            {user.email}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md whitespace-nowrap ${
                            user.role === 'merchant'
                              ? 'bg-[#0B4F8A] text-white'
                              : user.role === 'admin'
                              ? 'bg-[#E8552B] text-white'
                              : 'bg-[#2E9E5B] text-white'
                          }`}
                        >
                          {user.role === 'merchant'
                            ? 'Lojista'
                            : user.role === 'admin'
                            ? 'Admin'
                            : 'Cliente'}
                        </span>
                        {currentUser.id === user.id && (
                          <Check className="w-3.5 h-3.5 text-[#0B4F8A]" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-2 px-2 border-t border-slate-100 space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl whitespace-nowrap"
                  >
                    <UserIcon className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Ver Meu Perfil</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenAuth) onOpenAuth();
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#0B4F8A] hover:bg-blue-50 rounded-xl whitespace-nowrap"
                  >
                    <SlidersHorizontal className="w-4 h-4 shrink-0" />
                    <span>Cadastrar / Trocar Conta</span>
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
              className="text-xs font-bold text-[#0B4F8A] bg-blue-50 px-2.5 py-1 rounded-lg"
            >
              Trocar
            </button>
          </div>

          <button
            onClick={() => {
              setActiveTab('explore');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl font-heading font-bold text-xs whitespace-nowrap ${
              activeTab === 'explore'
                ? 'bg-[#0B4F8A] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Compass className="w-4 h-4 shrink-0" />
            <span>Mapa & Lojas de Salvador</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('offers');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl font-heading font-bold text-xs whitespace-nowrap ${
              activeTab === 'offers'
                ? 'bg-[#0B4F8A] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-[#FFC72C] shrink-0" />
              <span>Ofertas da Cidade</span>
            </div>
            {activeOffersCount > 0 && (
              <span className="px-2 py-0.5 bg-[#E8552B] text-white text-[10px] rounded-full font-black">
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
                ? 'bg-[#0B4F8A] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Flame className="w-4 h-4 text-[#E8552B] shrink-0" />
              <span>Para Mim (Social & Lojas)</span>
            </div>
            <span className="px-2 py-0.5 bg-gradient-to-r from-[#FFC72C] to-[#E8552B] text-slate-900 text-[9px] font-black rounded-md uppercase">
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
                ? 'bg-[#0B4F8A] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Mensagens / Chat</span>
            </div>
            {totalUnread > 0 && (
              <span className="px-2 py-0.5 bg-[#2E9E5B] text-white text-[10px] rounded-full font-black">
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
                ? 'bg-[#0B4F8A] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-[#FFC72C] shrink-0" />
              <span>Eventos & Agenda Cultural</span>
            </div>
            <span className="px-2 py-0.5 bg-blue-50 text-[#0B4F8A] text-[9px] font-black rounded-full uppercase">
              Salvador
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('favorites');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl font-heading font-bold text-xs whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'bg-[#0B4F8A] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Lojas Favoritas</span>
            </div>
            {favoritesCount > 0 && (
              <span className="text-xs font-bold text-slate-400">({favoritesCount})</span>
            )}
          </button>

          {currentUser.role === 'merchant' && (
            <button
              onClick={() => {
                setActiveTab('merchant_dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl font-heading font-bold text-xs bg-blue-50 text-[#0B4F8A] whitespace-nowrap"
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
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl font-heading font-bold text-xs bg-rose-50 text-[#E8552B] whitespace-nowrap"
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
              className="w-full py-2.5 bg-[#FFC72C] text-[#0B4F8A] font-heading font-black text-xs uppercase tracking-wider rounded-2xl shadow-xs flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
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
