// ==============================================================================
// 🌊 NAVBAR — 5 ABAS ESSENCIAIS DO SUPERAPP SALVÔ (A CIDADE DAS MARÉS)
// [ Início 🗺️ ]  [ Ofertas 🏷️ ]  [ Viajar 🧭 ]  [ Chat 💬 ]  [ Perfil 👤 ]
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { User, ActiveTab } from '../types';
import { BonfimRibbon } from './BonfimRibbon';
import {
  Map as MapIcon,
  Tag,
  Navigation,
  MessageSquare,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Store,
  Compass,
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
  const handleGoToProfile = (mode?: 'client' | 'merchant') => {
    setActiveTab('profile');
    if (mode && onOpenProfileMode) {
      onOpenProfileMode(mode);
    }
    setRoleDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  // Detect scroll
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
          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#0F4C81] text-white whitespace-nowrap shrink-0">
            Lojista
          </span>
        );
      case 'admin':
        return (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#E76F51] text-white whitespace-nowrap shrink-0">
            Admin
          </span>
        );
      case 'client':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#E89F3C] text-[#1A1A2E] whitespace-nowrap shrink-0">
            Cliente
          </span>
        );
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md transition-all duration-200 w-full ${
        isScrolled
          ? 'shadow-[0_4px_20px_-4px_rgba(15,76,129,0.12)] border-b border-slate-200 dark:border-slate-800'
          : 'border-b border-slate-200/80 dark:border-slate-800/80 shadow-none'
      }`}
    >
      {/* Fitinha do Bonfim / Faixa das Marés */}
      <BonfimRibbon height="h-1.5" />

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-[64px] sm:h-[68px] flex items-center justify-between gap-2 lg:gap-4 min-w-0">
        {/* MOBILE: Botão Menu Lateral */}
        <div className="flex md:hidden items-center shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-1 text-slate-700 dark:text-slate-200 hover:text-[#0F4C81] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl active:scale-95 transition-all focus:outline-none cursor-pointer"
            aria-label="Abrir Menu Principal"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* 1. BRAND LOGO */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            onClick={() => {
              setActiveTab('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0 select-none"
          >
            <img
              src="/salvo-logo.png"
              alt="SALVÔ"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl object-cover shadow-xs group-hover:scale-105 transition-transform shrink-0 border border-slate-100 dark:border-slate-800"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://iili.io/CDs6WS1.jpg';
              }}
            />
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-lg sm:text-xl font-heading font-black tracking-tight text-[#0F4C81] dark:text-cyan-400 whitespace-nowrap">
                  SALVÔ
                </span>
                <span className="text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 bg-[#E89F3C] text-[#1A1A2E] rounded-md uppercase tracking-wider whitespace-nowrap shrink-0 shadow-2xs">
                  SSA
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 tracking-tight hidden sm:block">
                A Cidade das Marés
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================
            2. AS 5 ABAS OFICIAIS (DESKTOP / TABLET)
            [ Início 🗺️ ]  [ Ofertas 🏷️ ]  [ Viajar 🧭 ]  [ Chat 💬 ]  [ Perfil 👤 ]
        ========================================================= */}
        <nav className="hidden md:flex items-center p-1.5 bg-slate-100/90 dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-2xs gap-1 select-none">
          {/* 1. Início 🗺️ */}
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-heading font-bold transition-all whitespace-nowrap select-none cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-[#0F4C81] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#0F4C81] hover:bg-white dark:hover:bg-slate-700/70'
            }`}
          >
            <Compass className="w-3.5 h-3.5 shrink-0" />
            <span>Início</span>
          </button>

          {/* 2. Ofertas 🏷️ */}
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-heading font-bold transition-all whitespace-nowrap select-none cursor-pointer ${
              activeTab === 'offers'
                ? 'bg-[#E89F3C] text-[#1A1A2E] shadow-xs font-black'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#E89F3C] hover:bg-white dark:hover:bg-slate-700/70'
            }`}
          >
            <Tag className="w-3.5 h-3.5 shrink-0" />
            <span>Ofertas</span>
            {activeOffersCount > 0 && (
              <span
                className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                  activeTab === 'offers'
                    ? 'bg-[#1A1A2E] text-white'
                    : 'bg-[#E76F51] text-white'
                }`}
              >
                {activeOffersCount}
              </span>
            )}
          </button>

          {/* 3. Viajar 🧭 */}
          <button
            onClick={() => setActiveTab('viajar')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-heading font-bold transition-all whitespace-nowrap select-none cursor-pointer ${
              activeTab === 'viajar'
                ? 'bg-[#2A9D8F] text-white shadow-xs font-black'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#2A9D8F] hover:bg-white dark:hover:bg-slate-700/70'
            }`}
          >
            <Navigation className="w-3.5 h-3.5 shrink-0" />
            <span>Viajar</span>
            <span className="text-[8px] bg-emerald-500 text-white font-black px-1 py-0.2 rounded uppercase">
              GPS
            </span>
          </button>

          {/* 4. Chat 💬 */}
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-heading font-bold transition-all whitespace-nowrap select-none cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-[#0F4C81] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#0F4C81] hover:bg-white dark:hover:bg-slate-700/70'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            <span>Chat</span>
            {totalUnread > 0 && (
              <span
                className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                  activeTab === 'chat' ? 'bg-white text-[#0F4C81]' : 'bg-[#E76F51] text-white'
                }`}
              >
                {totalUnread}
              </span>
            )}
          </button>

          {/* 5. Perfil 👤 */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-heading font-bold transition-all whitespace-nowrap select-none cursor-pointer ${
              activeTab === 'profile' || (activeTab as string) === 'merchant_dashboard'
                ? 'bg-[#0F4C81] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#0F4C81] hover:bg-white dark:hover:bg-slate-700/70'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5 shrink-0" />
            <span>Perfil</span>
          </button>
        </nav>

        {/* =========================================================
            3. DIREITA: USER PROFILE AVATAR & DROPDOWN RÁPIDO
        ========================================================= */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative shrink-0" id="user-profile-menu-container">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-2xs transition-all cursor-pointer ${
                roleDropdownOpen ? 'bg-slate-100 dark:bg-slate-700 border-slate-300' : ''
              }`}
              aria-expanded={roleDropdownOpen}
              aria-haspopup="true"
              aria-label="Menu de Perfil"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
              ) : (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#0F4C81] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
              )}

              <div className="hidden sm:flex flex-col text-left">
                <div className="flex items-center gap-1 leading-none">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[110px]">
                    {currentUser.role === 'merchant' ? 'Minha Loja' : currentUser.name.split(' ')[0]}
                  </span>
                  {getRoleBadge()}
                </div>
                <span className="text-[9px] text-[#0F4C81] dark:text-cyan-400 font-bold mt-0.5">
                  Salvador • BA
                </span>
              </div>

              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown */}
            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-[240px] bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                </div>

                <div className="py-1 space-y-0.5">
                  <button
                    onClick={() => handleGoToProfile('client')}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4 text-[#0F4C81]" />
                    <span>Ver Meu Perfil</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('offers');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    <Tag className="w-4 h-4 text-[#E89F3C]" />
                    <span>Minhas Ofertas Salvas</span>
                  </button>

                  {/* Alternar perfil demo para testes */}
                  {allUsers.length > 1 && (
                    <button
                      onClick={() => {
                        const otherUser = allUsers.find(u => u.id !== currentUser.id);
                        if (otherUser && onSwitchUser) {
                          onSwitchUser(otherUser.id);
                        }
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs font-semibold text-[#0F4C81] hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer border-t border-slate-100 dark:border-slate-700 mt-1"
                    >
                      <Store className="w-4 h-4 text-[#0F4C81]" />
                      <span>Alternar Usuário Demo</span>
                    </button>
                  )}

                  {onOpenAuth && (
                    <button
                      onClick={() => {
                        onOpenAuth();
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 cursor-pointer border-t border-slate-100 dark:border-slate-700 mt-1"
                    >
                      <span>Sair / Trocar Conta</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          4. MOBILE DRAWER — SOMENTE AS 5 ABAS
      ========================================================= */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 space-y-1.5 animate-in slide-in-from-top-4 duration-200 shadow-xl">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {currentUser.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  {getRoleBadge()}
                  <span className="text-[10px] text-slate-400">Salvador • BA</span>
                </div>
              </div>
            </div>
            {onOpenAuth && (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-bold text-[#0F4C81] dark:text-cyan-400 bg-blue-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg"
              >
                Trocar
              </button>
            )}
          </div>

          {/* 1. Início 🗺️ */}
          <button
            onClick={() => {
              setActiveTab('explore');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold ${
              activeTab === 'explore'
                ? 'bg-[#0F4C81] text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Compass className="w-4 h-4" />
              <span>Início (Mapa & Lojas)</span>
            </div>
            <span className="text-sm">🗺️</span>
          </button>

          {/* 2. Ofertas 🏷️ */}
          <button
            onClick={() => {
              setActiveTab('offers');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold ${
              activeTab === 'offers'
                ? 'bg-[#E89F3C] text-[#1A1A2E] shadow-xs'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Tag className="w-4 h-4" />
              <span>Ofertas da Cidade</span>
            </div>
            {activeOffersCount > 0 ? (
              <span className="bg-[#E76F51] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {activeOffersCount}
              </span>
            ) : (
              <span className="text-sm">🏷️</span>
            )}
          </button>

          {/* 3. Viajar 🧭 */}
          <button
            onClick={() => {
              setActiveTab('viajar');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold ${
              activeTab === 'viajar'
                ? 'bg-[#2A9D8F] text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Navigation className="w-4 h-4" />
              <span>Viajar (Navegação GPS)</span>
            </div>
            <span className="text-sm">🧭</span>
          </button>

          {/* 4. Chat 💬 */}
          <button
            onClick={() => {
              setActiveTab('chat');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold ${
              activeTab === 'chat'
                ? 'bg-[#0F4C81] text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4" />
              <span>Chat com Lojas</span>
            </div>
            {totalUnread > 0 ? (
              <span className="bg-[#E76F51] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {totalUnread}
              </span>
            ) : (
              <span className="text-sm">💬</span>
            )}
          </button>

          {/* 5. Perfil 👤 */}
          <button
            onClick={() => {
              setActiveTab('profile');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold ${
              activeTab === 'profile' || (activeTab as string) === 'merchant_dashboard'
                ? 'bg-[#0F4C81] text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <UserIcon className="w-4 h-4" />
              <span>Meu Perfil & Conquistas</span>
            </div>
            <span className="text-sm">👤</span>
          </button>
        </div>
      )}
    </header>
  );
};
