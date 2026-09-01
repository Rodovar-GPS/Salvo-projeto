// ==============================================================================
// 🗺️ BOTTOM NAV — 5 ABAS FIXAS DO SUPERAPP SALVÔ (A CIDADE DAS MARÉS)
// [ Início 🗺️ ]  [ Ofertas 🏷️ ]  [ Viajar 🧭 ]  [ Chat 💬 ]  [ Perfil 👤 ]
// ==============================================================================

import React from 'react';
import { ActiveTab, User } from '../types';
import { Compass, Tag, Navigation, MessageSquare, User as UserIcon } from 'lucide-react';

interface BottomNavProps {
  activeTab?: ActiveTab;
  setActiveTab?: (tab: ActiveTab) => void;
  currentTab?: ActiveTab;
  setCurrentTab?: (tab: ActiveTab) => void;
  currentUser?: User;
  userRole?: User['role'];
  unreadCount?: number;
  unreadChatCount?: number;
  favoritesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab: rawActiveTab,
  setActiveTab: rawSetActiveTab,
  currentTab,
  setCurrentTab,
  currentUser,
  userRole,
  unreadCount: rawUnreadCount,
  unreadChatCount,
}) => {
  const activeTab = rawActiveTab || currentTab || 'explore';
  const setActiveTab = rawSetActiveTab || setCurrentTab || (() => {});
  const unreadCount = unreadChatCount !== undefined ? unreadChatCount : (rawUnreadCount || 0);

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
      aria-label="Navegação Principal do SuperApp"
    >
      <div className="max-w-md mx-auto px-2 h-16 flex items-center justify-around">
        {/* 1. Início 🗺️ */}
        <button
          onClick={() => {
            setActiveTab('explore');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all select-none min-h-[48px] cursor-pointer ${
            activeTab === 'explore'
              ? 'text-[#0F4C81] dark:text-cyan-400'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          aria-label="Início"
        >
          <div className="relative">
            <Compass
              className={`w-5 h-5 transition-transform ${
                activeTab === 'explore' ? 'stroke-[2.5] scale-110' : 'stroke-[1.75]'
              }`}
            />
          </div>
          <span
            className={`text-[10px] mt-1 leading-none tracking-tight ${
              activeTab === 'explore'
                ? 'font-black text-[#0F4C81] dark:text-cyan-400'
                : 'font-semibold text-slate-500'
            }`}
          >
            Início
          </span>
          {activeTab === 'explore' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C81] dark:bg-cyan-400 mt-0.5" />
          )}
        </button>

        {/* 2. Ofertas 🏷️ */}
        <button
          onClick={() => {
            setActiveTab('offers');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all select-none min-h-[48px] cursor-pointer ${
            activeTab === 'offers'
              ? 'text-[#E89F3C] dark:text-amber-400'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          aria-label="Ofertas"
        >
          <div className="relative">
            <Tag
              className={`w-5 h-5 transition-transform ${
                activeTab === 'offers'
                  ? 'text-[#E89F3C] dark:text-amber-400 stroke-[2.5] scale-110'
                  : 'stroke-[1.75]'
              }`}
            />
            <span className="absolute -top-1 -right-2 bg-gradient-to-r from-[#E89F3C] to-[#E76F51] text-white text-[7px] font-black px-1 rounded-full animate-pulse">
              %
            </span>
          </div>
          <span
            className={`text-[10px] mt-1 leading-none tracking-tight ${
              activeTab === 'offers'
                ? 'font-black text-[#E89F3C] dark:text-amber-400'
                : 'font-semibold text-slate-500'
            }`}
          >
            Ofertas
          </span>
          {activeTab === 'offers' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#E89F3C] dark:bg-amber-400 mt-0.5" />
          )}
        </button>

        {/* 3. Viajar 🧭 */}
        <button
          onClick={() => {
            setActiveTab('viajar');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all select-none min-h-[48px] cursor-pointer ${
            activeTab === 'viajar'
              ? 'text-[#2A9D8F] dark:text-teal-400'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          aria-label="Viajar GPS"
        >
          <div className="relative">
            <Navigation
              className={`w-5 h-5 transition-transform ${
                activeTab === 'viajar'
                  ? 'text-[#2A9D8F] dark:text-teal-400 fill-[#2A9D8F]/20 stroke-[2.5] scale-110'
                  : 'stroke-[1.75]'
              }`}
            />
            <span className="absolute -top-1 -right-2 bg-[#2A9D8F] text-white text-[7px] font-black px-1 rounded-full">
              GPS
            </span>
          </div>
          <span
            className={`text-[10px] mt-1 leading-none tracking-tight ${
              activeTab === 'viajar'
                ? 'font-black text-[#2A9D8F] dark:text-teal-400'
                : 'font-semibold text-slate-500'
            }`}
          >
            Viajar
          </span>
          {activeTab === 'viajar' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F] dark:bg-teal-400 mt-0.5" />
          )}
        </button>

        {/* 4. Chat 💬 */}
        <button
          onClick={() => {
            setActiveTab('chat');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all select-none min-h-[48px] cursor-pointer ${
            activeTab === 'chat'
              ? 'text-[#0F4C81] dark:text-cyan-400'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          aria-label="Chat com Lojas"
        >
          <div className="relative">
            <MessageSquare
              className={`w-5 h-5 transition-transform ${
                activeTab === 'chat' ? 'stroke-[2.5] scale-110' : 'stroke-[1.75]'
              }`}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 bg-[#E76F51] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </div>
          <span
            className={`text-[10px] mt-1 leading-none tracking-tight ${
              activeTab === 'chat'
                ? 'font-black text-[#0F4C81] dark:text-cyan-400'
                : 'font-semibold text-slate-500'
            }`}
          >
            Chat
          </span>
          {activeTab === 'chat' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C81] dark:bg-cyan-400 mt-0.5" />
          )}
        </button>

        {/* 5. Perfil 👤 */}
        <button
          onClick={() => {
            setActiveTab('profile');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all select-none min-h-[48px] cursor-pointer ${
            activeTab === 'profile' || (activeTab as string) === 'merchant_dashboard'
              ? 'text-[#0F4C81] dark:text-cyan-400'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          aria-label="Perfil"
        >
          <div className="relative">
            <UserIcon
              className={`w-5 h-5 transition-transform ${
                activeTab === 'profile' || (activeTab as string) === 'merchant_dashboard'
                  ? 'stroke-[2.5] scale-110'
                  : 'stroke-[1.75]'
              }`}
            />
          </div>
          <span
            className={`text-[10px] mt-1 leading-none tracking-tight ${
              activeTab === 'profile' || (activeTab as string) === 'merchant_dashboard'
                ? 'font-black text-[#0F4C81] dark:text-cyan-400'
                : 'font-semibold text-slate-500'
            }`}
          >
            Perfil
          </span>
          {(activeTab === 'profile' || (activeTab as string) === 'merchant_dashboard') && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C81] dark:bg-cyan-400 mt-0.5" />
          )}
        </button>
      </div>
    </nav>
  );
};
