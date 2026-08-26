import React from 'react';
import { SocialNotification, User } from '../../types';
import {
  Bell,
  X,
  UserPlus,
  UserCheck,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface SocialNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SocialNotification[];
  currentUser: User;
  onAcceptFriendRequest: (friendshipId: string) => void;
  onDeclineFriendRequest: (friendshipId: string) => void;
  onMarkAsRead: (notifId: string) => void;
  onMarkAllAsRead: () => void;
  onViewProfile: (userId: string) => void;
}

export const SocialNotificationsModal: React.FC<SocialNotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  currentUser,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewProfile,
}) => {
  if (!isOpen) return null;

  const userNotifications = notifications.filter(
    (n) => n.recipientProfileId === currentUser.id
  );

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8552B]/10 text-[#E8552B] flex items-center justify-center relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#E8552B] border-2 border-white rounded-full" />
              )}
            </div>
            <div>
              <h3 className="font-heading font-black text-slate-900 text-sm sm:text-base leading-tight">
                Notificações Sociais
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {unreadCount > 0 ? `${unreadCount} não lida(s)` : 'Tudo em dia'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-[11px] font-bold text-[#0B4F8A] hover:underline px-2 py-1"
              >
                Marcar lidas
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List of notifications */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {userNotifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Bell className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
              <p className="text-xs font-bold text-slate-600">Nenhuma notificação recente</p>
              <p className="text-[11px] text-slate-400">
                Você será avisado quando receber pedidos de amizade ou novos seguidores.
              </p>
            </div>
          ) : (
            userNotifications.map((notif) => {
              return (
                <div
                  key={notif.id}
                  onClick={() => onMarkAsRead(notif.id)}
                  className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    notif.read
                      ? 'bg-slate-50/60 border-slate-200/60'
                      : 'bg-blue-50/40 border-blue-200 shadow-2xs'
                  }`}
                >
                  <div
                    onClick={() => {
                      onViewProfile(notif.actorProfileId);
                      onClose();
                    }}
                    className="flex items-start gap-3 cursor-pointer min-w-0 flex-1"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={
                          notif.actorAvatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                        }
                        alt={notif.actorName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white border-2 border-white ${
                          notif.type === 'friend_request'
                            ? 'bg-[#E8552B]'
                            : notif.type === 'friend_accepted'
                            ? 'bg-emerald-600'
                            : 'bg-[#0B4F8A]'
                        }`}
                      >
                        {notif.type === 'friend_request' ? (
                          <UserPlus className="w-2.5 h-2.5" />
                        ) : notif.type === 'friend_accepted' ? (
                          <UserCheck className="w-2.5 h-2.5" />
                        ) : (
                          <Users className="w-2.5 h-2.5" />
                        )}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-slate-800 leading-snug">
                        <strong className="font-heading font-black text-slate-900">
                          {notif.actorName}
                        </strong>{' '}
                        {notif.type === 'friend_request' && 'enviou uma solicitação de amizade.'}
                        {notif.type === 'friend_accepted' && 'aceitou sua solicitação de amizade! 🎉'}
                        {notif.type === 'user_follow' && 'começou a seguir você em Salvador.'}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                        {notif.createdAt}
                      </p>

                      {/* Inline Actions for friend requests */}
                      {notif.type === 'friend_request' && notif.friendshipId && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 mt-2.5"
                        >
                          <button
                            onClick={() => {
                              onAcceptFriendRequest(notif.friendshipId!);
                              onMarkAsRead(notif.id);
                            }}
                            className="px-3 py-1.5 bg-[#0B4F8A] hover:bg-[#083a66] text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all"
                          >
                            Aceitar
                          </button>
                          <button
                            onClick={() => {
                              onDeclineFriendRequest(notif.friendshipId!);
                              onMarkAsRead(notif.id);
                            }}
                            className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-[11px] font-bold"
                          >
                            Recusar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-[#0B4F8A] shrink-0 mt-1" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
