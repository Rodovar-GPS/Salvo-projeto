import React from 'react';
import { ActiveTab, User } from '../types';
import { Home, Compass, MapPin, Sparkles, MessageSquare, Heart, Store, User as UserIcon, Calendar, Map as MapIcon } from 'lucide-react';

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
  favoritesCount = 0,
}) => {
  const activeTab = rawActiveTab || currentTab || 'explore';
  const setActiveTab = rawSetActiveTab || setCurrentTab || (() => {});
  const unreadCount = unreadChatCount !== undefined ? unreadChatCount : (rawUnreadCount || 0);
  const role = currentUser?.role || userRole || 'client';

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
      aria-label="Navegação Principal Mobile"
    >
      <div className="max-w-md mx-auto px-2 h-16 flex items-center justify-around">
        {/* 1. Início */}
        <button
          onClick={() => {
            setActiveTab('explore');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all select-none min-h-[48px] ${
            activeTab === 'explore'
              ? 'text-[#0B4F8A]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Início"
        >
          <div className="relative">
            <Home
              className={`w-5 h-5 transition-transform ${
                activeTab === 'explore' ? 'stroke-[2.5] scale-110' : 'stroke-[1.75]'
              }`}
            />
          </div>
          <span
            className={`text-[10px] mt-1 leading-none tracking-tight ${
              activeTab === 'explore' ? 'font-black text-[#0B4F8A]' : 'font-semibold text-slate-500'
            }`}
          >
            Início
          </span>
          {activeTab === 'explore' && (
            <span className="w-1 h-1 rounded-full bg-[#FFC72C] mt-0.5" />
          )}
        </button>

        {/* 2. Mapa */}
        <button
          onClick={() => {
            setActiveTab('explore');
            // Can scroll to map section
            const el = document.getElementById('salvador-interactive-map');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all select-none min-h-[48px] ${
            activeTab === 'explore'
              ? 'text-slate-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Mapa de Salvador"
        >
          <div className="relative">
            <Compass
              className="w-5 h-5 stroke-[1.75] text-[#0B4F8A]"
            />
          </div>
          <span className="text-[10px] font-semibold text-slate-600 mt-1 leading-none tracking-tight">
            Mapa
          </span>
        </button>

        {/* 3. Ofertas */}
        <button
          onClick={() => {
            setActiveTab('offers');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all select-none min-h-[48px] ${
            activeTab === 'offers'
              ? 'text-[#0B4F8A]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Ofertas"
        >
          <div className="relative">
            <Sparkles
              className={`w-5 h-5 transition-transform ${
                activeTab === 'offers'
                  ? 'text-[#E8552B] stroke-[2.5] scale-110'
                  : 'text-[#E8552B] stroke-[1.75]'
              }`}
            />
          </div>
          <span
            className={`text-[10px] mt-1 leading-none tracking-tight ${
              activeTab === 'offers' ? 'font-black text-[#0B4F8A]' : 'font-semibold text-slate-500'
            }`}
          >
            Ofertas
          </span>
          {activeTab === 'offers' && (
            <span className="w-1 h-1 rounded-full bg-[#FFC72C] mt-0.5" />
          )}
        </button>

        {/* 4. Chat */}
        <button
          onClick={() => {
            setActiveTab('chat');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all select-none min-h-[48px] ${
            activeTab === 'chat'
              ? 'text-[#0B4F8A]'
              : 'text-slate-500 hover:text-slate-800'
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
              <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 bg-[#2E9E5B] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </div>
          <span
            className={`text-[10px] mt-1 leading-none tracking-tight ${
              activeTab === 'chat' ? 'font-black text-[#0B4F8A]' : 'font-semibold text-slate-500'
            }`}
          >
            Chat
          </span>
          {activeTab === 'chat' && (
            <span className="w-1 h-1 rounded-full bg-[#FFC72C] mt-0.5" />
          )}
        </button>

        {/* 5. Favoritos */}
        <button
          onClick={() => {
            setActiveTab('favorites');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all select-none min-h-[48px] ${
            activeTab === 'favorites'
              ? 'text-[#0B4F8A]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Lojas Favoritas"
        >
          <div className="relative">
            <Heart
              className={`w-5 h-5 transition-transform ${
                activeTab === 'favorites'
                  ? 'text-rose-500 fill-rose-500 scale-110'
                  : 'text-slate-500 stroke-[1.75]'
              }`}
            />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </div>
          <span
            className={`text-[10px] mt-1 leading-none tracking-tight ${
              activeTab === 'favorites' ? 'font-black text-[#0B4F8A]' : 'font-semibold text-slate-500'
            }`}
          >
            Favoritos
          </span>
          {activeTab === 'favorites' && (
            <span className="w-1 h-1 rounded-full bg-[#FFC72C] mt-0.5" />
          )}
        </button>
      </div>
    </nav>
  );
};
