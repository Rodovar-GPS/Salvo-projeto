import React, { useState } from 'react';
import { User, Friendship, UserFollow } from '../../types';
import {
  Users,
  UserCheck,
  UserMinus,
  UserX,
  UserPlus,
  Search,
  X,
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { ClearableInput } from '../ClearableInput';

interface SocialConnectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  targetUser: User;
  allUsers: User[];
  friendships: Friendship[];
  userFollows: UserFollow[];
  initialTab?: 'friends' | 'followers' | 'following' | 'requests';
  onSendFriendRequest: (targetUserId: string) => void;
  onAcceptFriendRequest: (friendshipId: string) => void;
  onDeclineFriendRequest: (friendshipId: string) => void;
  onRemoveFriend: (targetUserId: string) => void;
  onToggleFollowUser: (targetUserId: string) => void;
  onViewProfile: (userId: string) => void;
}

export const SocialConnectionsModal: React.FC<SocialConnectionsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  targetUser,
  allUsers,
  friendships,
  userFollows,
  initialTab = 'friends',
  onSendFriendRequest,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
  onRemoveFriend,
  onToggleFollowUser,
  onViewProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'followers' | 'following' | 'requests'>(
    initialTab
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmRemoveUserId, setConfirmRemoveUserId] = useState<string | null>(null);

  if (!isOpen) return null;

  const isOwnProfile = targetUser.id === currentUser.id;

  // 1. Get Friends of targetUser (accepted friendships where targetUser is requester or addressee)
  const acceptedFriendships = friendships.filter(
    (f) =>
      f.status === 'accepted' &&
      (f.requesterId === targetUser.id || f.addresseeId === targetUser.id)
  );

  const friendsList: User[] = acceptedFriendships
    .map((f) => {
      const friendId = f.requesterId === targetUser.id ? f.addresseeId : f.requesterId;
      return allUsers.find((u) => u.id === friendId);
    })
    .filter((u): u is User => Boolean(u));

  // 2. Get Followers of targetUser (people who follow targetUser)
  const followersList: User[] = userFollows
    .filter((uf) => uf.followingId === targetUser.id)
    .map((uf) => allUsers.find((u) => u.id === uf.followerId))
    .filter((u): u is User => Boolean(u));

  // 3. Get Following of targetUser (people targetUser follows)
  const followingList: User[] = userFollows
    .filter((uf) => uf.followerId === targetUser.id)
    .map((uf) => allUsers.find((u) => u.id === uf.followingId))
    .filter((u): u is User => Boolean(u));

  // 4. Get Pending Requests (received by currentUser and sent by currentUser)
  const pendingReceived = friendships.filter(
    (f) => f.status === 'pending' && f.addresseeId === currentUser.id
  );
  const pendingSent = friendships.filter(
    (f) => f.status === 'pending' && f.requesterId === currentUser.id
  );

  // Helper to check relationship status between currentUser and any other user
  const getRelationshipWithCurrentUser = (otherUserId: string) => {
    if (otherUserId === currentUser.id) return { isSelf: true };

    const friendship = friendships.find(
      (f) =>
        (f.requesterId === currentUser.id && f.addresseeId === otherUserId) ||
        (f.requesterId === otherUserId && f.addresseeId === currentUser.id)
    );

    const isFollowing = userFollows.some(
      (uf) => uf.followerId === currentUser.id && uf.followingId === otherUserId
    );

    if (friendship?.status === 'accepted') {
      return { isFriend: true, isFollowing, friendshipId: friendship.id };
    }
    if (friendship?.status === 'pending') {
      const isSentByMe = friendship.requesterId === currentUser.id;
      return {
        isPending: true,
        isPendingSent: isSentByMe,
        isPendingReceived: !isSentByMe,
        isFollowing,
        friendshipId: friendship.id,
      };
    }

    return { isFriend: false, isPending: false, isFollowing };
  };

  // Filter list by search query
  const filterUsers = (list: User[]) => {
    if (!searchTerm.trim()) return list;
    const q = searchTerm.toLowerCase();
    return list.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        (u.username && u.username.toLowerCase().includes(q)) ||
        (u.neighborhood && u.neighborhood.toLowerCase().includes(q))
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0B4F8A]/10 text-[#0B4F8A] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-slate-900 text-sm sm:text-base leading-tight">
                Conexões Sociais
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isOwnProfile ? 'Suas amizades e seguidores' : `Perfil de ${targetUser.name}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-white px-2 sm:px-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              setActiveTab('friends');
              setSearchTerm('');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-3 font-heading font-black text-xs border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'friends'
                ? 'border-[#0B4F8A] text-[#0B4F8A] bg-blue-50/30'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Amigos</span>
            <span className="px-1.5 py-0.2 bg-[#0B4F8A]/10 text-[#0B4F8A] rounded-full text-[10px] font-bold">
              {friendsList.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('followers');
              setSearchTerm('');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-3 font-heading font-black text-xs border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'followers'
                ? 'border-[#0B4F8A] text-[#0B4F8A] bg-blue-50/30'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Seguidores</span>
            <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold">
              {followersList.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('following');
              setSearchTerm('');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-3 font-heading font-black text-xs border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'following'
                ? 'border-[#0B4F8A] text-[#0B4F8A] bg-blue-50/30'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Seguindo</span>
            <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold">
              {followingList.length}
            </span>
          </button>

          {isOwnProfile && (
            <button
              onClick={() => {
                setActiveTab('requests');
                setSearchTerm('');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-3 font-heading font-black text-xs border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'requests'
                  ? 'border-[#E8552B] text-[#E8552B] bg-orange-50/30'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Solicitações</span>
              {pendingReceived.length > 0 && (
                <span className="px-1.5 py-0.2 bg-[#E8552B] text-white rounded-full text-[10px] font-black">
                  {pendingReceived.length}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Search input in list (for friends/followers/following) */}
        {activeTab !== 'requests' && (
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <ClearableInput
              value={searchTerm}
              onValueChange={setSearchTerm}
              placeholder={`Filtrar ${
                activeTab === 'friends'
                  ? 'amigos'
                  : activeTab === 'followers'
                  ? 'seguidores'
                  : 'seguindo'
              }...`}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              className="h-10 text-xs bg-white"
            />
          </div>
        )}

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {/* TAB 1: AMIGOS */}
          {activeTab === 'friends' && (
            <>
              {filterUsers(friendsList).length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <UserCheck className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                  <p className="text-xs font-bold text-slate-600">Nenhum amigo encontrado</p>
                  <p className="text-[11px] text-slate-400">
                    Conecte-se com clientes e moradores de Salvador adicionando amigos.
                  </p>
                </div>
              ) : (
                filterUsers(friendsList).map((user) => {
                  const rel = getRelationshipWithCurrentUser(user.id);
                  const isConfirming = confirmRemoveUserId === user.id;

                  return (
                    <div
                      key={user.id}
                      className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <div
                        onClick={() => {
                          onViewProfile(user.id);
                          onClose();
                        }}
                        className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                      >
                        <img
                          src={
                            user.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                          }
                          alt={user.name}
                          className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-heading font-black text-xs text-slate-900 truncate">
                              {user.name}
                            </h4>
                            {user.isSubscriber && (
                              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 text-[9px] font-black rounded-md shrink-0">
                                VIP
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono truncate">
                            @{user.username || user.name.toLowerCase().replace(/[^a-z0-9]/g, '')}
                          </p>
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-600 font-medium mt-0.5">
                            <MapPin className="w-3 h-3 text-[#E8552B]" />
                            {user.neighborhood || 'Salvador'}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isOwnProfile && (
                          <>
                            {isConfirming ? (
                              <div className="flex items-center gap-1.5 animate-in fade-in">
                                <button
                                  onClick={() => {
                                    onRemoveFriend(user.id);
                                    setConfirmRemoveUserId(null);
                                  }}
                                  className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-black uppercase transition-colors"
                                >
                                  Confirmar
                                </button>
                                <button
                                  onClick={() => setConfirmRemoveUserId(null)}
                                  className="px-2 py-1.5 bg-slate-200 text-slate-700 rounded-xl text-[10px] font-bold"
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmRemoveUserId(user.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                title="Desfazer amizade"
                              >
                                <UserMinus className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}

                        <button
                          onClick={() => {
                            onViewProfile(user.id);
                            onClose();
                          }}
                          className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-[#0B4F8A] hover:border-[#0B4F8A] text-xs font-bold rounded-xl transition-all shadow-2xs"
                        >
                          Ver Perfil
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {/* TAB 2: SEGUIDORES */}
          {activeTab === 'followers' && (
            <>
              {filterUsers(followersList).length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Users className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                  <p className="text-xs font-bold text-slate-600">Nenhum seguidor no momento</p>
                  <p className="text-[11px] text-slate-400">
                    Compartilhe seu perfil do SALVÔ para que outras pessoas te acompanhem.
                  </p>
                </div>
              ) : (
                filterUsers(followersList).map((user) => {
                  const rel = getRelationshipWithCurrentUser(user.id);

                  return (
                    <div
                      key={user.id}
                      className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <div
                        onClick={() => {
                          onViewProfile(user.id);
                          onClose();
                        }}
                        className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                      >
                        <img
                          src={
                            user.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                          }
                          alt={user.name}
                          className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-heading font-black text-xs text-slate-900 truncate">
                              {user.name}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono truncate">
                            @{user.username || user.name.toLowerCase().replace(/[^a-z0-9]/g, '')}
                          </p>
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-600 font-medium">
                            <MapPin className="w-3 h-3 text-[#E8552B]" />
                            {user.neighborhood || 'Salvador'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {!rel.isSelf && (
                          <button
                            onClick={() => onToggleFollowUser(user.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              rel.isFollowing
                                ? 'bg-slate-100 text-slate-700 border border-slate-300'
                                : 'bg-[#0B4F8A] text-white hover:bg-[#083a66]'
                            }`}
                          >
                            {rel.isFollowing ? 'Seguindo' : 'Seguir de Volta'}
                          </button>
                        )}

                        <button
                          onClick={() => {
                            onViewProfile(user.id);
                            onClose();
                          }}
                          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
                          title="Ver perfil"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {/* TAB 3: SEGUINDO */}
          {activeTab === 'following' && (
            <>
              {filterUsers(followingList).length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <UserPlus className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                  <p className="text-xs font-bold text-slate-600">Não está seguindo ninguém</p>
                  <p className="text-[11px] text-slate-400">
                    Use a busca para encontrar amigos e moradores dos bairros de Salvador.
                  </p>
                </div>
              ) : (
                filterUsers(followingList).map((user) => {
                  const rel = getRelationshipWithCurrentUser(user.id);

                  return (
                    <div
                      key={user.id}
                      className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <div
                        onClick={() => {
                          onViewProfile(user.id);
                          onClose();
                        }}
                        className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                      >
                        <img
                          src={
                            user.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                          }
                          alt={user.name}
                          className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-heading font-black text-xs text-slate-900 truncate">
                            {user.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-mono truncate">
                            @{user.username || user.name.toLowerCase().replace(/[^a-z0-9]/g, '')}
                          </p>
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-600 font-medium">
                            <MapPin className="w-3 h-3 text-[#E8552B]" />
                            {user.neighborhood || 'Salvador'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isOwnProfile && (
                          <button
                            onClick={() => onToggleFollowUser(user.id)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-xl text-xs font-bold transition-all border border-slate-200"
                          >
                            Deixar de Seguir
                          </button>
                        )}

                        <button
                          onClick={() => {
                            onViewProfile(user.id);
                            onClose();
                          }}
                          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
                          title="Ver perfil"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {/* TAB 4: SOLICITAÇÕES DE AMIZADE */}
          {activeTab === 'requests' && isOwnProfile && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-heading font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#E8552B]" />
                  <span>Solicitações Recebidas ({pendingReceived.length})</span>
                </h4>

                {pendingReceived.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-semibold">Nenhuma solicitação de amizade pendente</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pendingReceived.map((req) => {
                      const requester = allUsers.find((u) => u.id === req.requesterId);
                      if (!requester) return null;

                      return (
                        <div
                          key={req.id}
                          className="p-3.5 bg-blue-50/40 rounded-2xl border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div
                            onClick={() => {
                              onViewProfile(requester.id);
                              onClose();
                            }}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <img
                              src={
                                requester.avatar ||
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                              }
                              alt={requester.name}
                              className="w-11 h-11 rounded-2xl object-cover border border-white shadow-2xs shrink-0"
                            />
                            <div>
                              <h5 className="font-heading font-black text-xs text-slate-900">
                                {requester.name}
                              </h5>
                              <p className="text-[11px] text-slate-500 font-mono">
                                @{requester.username || 'usuario'}
                              </p>
                              <span className="text-[10px] text-slate-500 font-medium">
                                Enviado em {req.createdAt}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onAcceptFriendRequest(req.id)}
                              className="flex-1 sm:flex-initial px-4 py-2 bg-[#0B4F8A] hover:bg-[#083a66] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-xs transition-all active:scale-95"
                            >
                              Aceitar
                            </button>
                            <button
                              onClick={() => onDeclineFriendRequest(req.id)}
                              className="flex-1 sm:flex-initial px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                            >
                              Recusar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Solicitações Enviadas Pendentes */}
              {pendingSent.length > 0 && (
                <div className="pt-3 border-t border-slate-200">
                  <h4 className="text-xs font-heading font-black text-slate-700 uppercase tracking-wider mb-2">
                    Solicitações Enviadas por Você ({pendingSent.length})
                  </h4>
                  <div className="space-y-2">
                    {pendingSent.map((req) => {
                      const addressee = allUsers.find((u) => u.id === req.addresseeId);
                      if (!addressee) return null;

                      return (
                        <div
                          key={req.id}
                          className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={addressee.avatar}
                              alt={addressee.name}
                              className="w-9 h-9 rounded-xl object-cover"
                            />
                            <div>
                              <p className="text-xs font-bold text-slate-900">{addressee.name}</p>
                              <span className="text-[10px] text-slate-500">Aguardando resposta</span>
                            </div>
                          </div>

                          <button
                            onClick={() => onDeclineFriendRequest(req.id)}
                            className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-rose-600 font-bold hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            Cancelar Pedido
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
