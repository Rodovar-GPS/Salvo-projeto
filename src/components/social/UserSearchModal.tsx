import React, { useState, useMemo } from 'react';
import { User, Friendship, UserFollow } from '../../types';
import {
  Search,
  X,
  UserPlus,
  UserCheck,
  Clock,
  MapPin,
  Sparkles,
  Users,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import { ClearableInput } from '../ClearableInput';

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  allUsers: User[];
  friendships: Friendship[];
  userFollows: UserFollow[];
  onSendFriendRequest: (targetUserId: string) => void;
  onAcceptFriendRequest: (friendshipId: string) => void;
  onDeclineFriendRequest: (friendshipId: string) => void;
  onRemoveFriend: (targetUserId: string) => void;
  onToggleFollowUser: (targetUserId: string) => void;
  onViewProfile: (userId: string) => void;
}

export const UserSearchModal: React.FC<UserSearchModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  friendships,
  userFollows,
  onSendFriendRequest,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
  onRemoveFriend,
  onToggleFollowUser,
  onViewProfile,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('Todos');

  if (!isOpen) return null;

  // Extract distinct neighborhoods for fast chips
  const neighborhoods = useMemo(() => {
    const set = new Set<string>();
    allUsers.forEach((u) => {
      if (u.neighborhood) set.add(u.neighborhood);
    });
    return Array.from(set).slice(0, 8);
  }, [allUsers]);

  // Dynamic search logic:
  // - Excludes currentUser
  // - Does not load all users simultaneously: If no query, shows recommended Salvador contacts (max 4). When searching, filters by name or @username (max 10)
  const searchResults = useMemo(() => {
    const otherUsers = allUsers.filter((u) => u.id !== currentUser.id && u.role === 'client');

    let filtered = otherUsers;

    if (selectedNeighborhood !== 'Todos') {
      filtered = filtered.filter((u) => u.neighborhood === selectedNeighborhood);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim().replace(/^@/, '');
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          (u.username && u.username.toLowerCase().includes(q)) ||
          (u.neighborhood && u.neighborhood.toLowerCase().includes(q))
      );
      // Limit to 10 results at a time to prevent heavy DOM rendering
      return filtered.slice(0, 10);
    }

    // Default: suggestions (up to 5 users)
    return filtered.slice(0, 5);
  }, [allUsers, currentUser.id, searchTerm, selectedNeighborhood]);

  // Relationship inspector helper
  const getRelationship = (otherUserId: string) => {
    const friendship = friendships.find(
      (f) =>
        (f.requesterId === currentUser.id && f.addresseeId === otherUserId) ||
        (f.requesterId === otherUserId && f.addresseeId === currentUser.id)
    );

    const isFollowing = userFollows.some(
      (uf) => uf.followerId === currentUser.id && uf.followingId === otherUserId
    );

    if (friendship?.status === 'accepted') {
      return { status: 'friends', friendshipId: friendship.id, isFollowing };
    }
    if (friendship?.status === 'pending') {
      if (friendship.requesterId === currentUser.id) {
        return { status: 'pending_sent', friendshipId: friendship.id, isFollowing };
      } else {
        return { status: 'pending_received', friendshipId: friendship.id, isFollowing };
      }
    }

    return { status: 'none', isFollowing };
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-orange-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0B4F8A] text-white flex items-center justify-center shadow-xs">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-slate-900 text-sm sm:text-base leading-tight">
                Encontrar Pessoas em Salvador
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Busque por nome ou @username na rede local
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

        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 bg-white space-y-3">
          <ClearableInput
            value={searchTerm}
            onValueChange={setSearchTerm}
            placeholder="Buscar por nome ou @username (ex: Carol, @tiagoverao)..."
            leftIcon={<Search className="w-4 h-4 text-[#0B4F8A]" />}
            className="h-11 text-xs sm:text-sm bg-slate-50 border-slate-200"
            autoFocus
          />

          {/* Neighborhood chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedNeighborhood('Todos')}
              className={`px-3 py-1 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedNeighborhood === 'Todos'
                  ? 'bg-[#0B4F8A] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos os Bairros
            </button>
            {neighborhoods.map((bairro) => (
              <button
                key={bairro}
                onClick={() => setSelectedNeighborhood(bairro)}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedNeighborhood === bairro
                    ? 'bg-[#0B4F8A] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {bairro}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
            <span>
              {searchTerm.trim() ? `Resultados (${searchResults.length})` : 'Sugestões de Salvador'}
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              Salvador/BA • Comunidade Ativa
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Users className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
              <p className="text-xs font-bold text-slate-600">Nenhum morador encontrado</p>
              <p className="text-[11px] text-slate-400">
                Tente buscar com outro nome, @username ou selecione outro bairro.
              </p>
            </div>
          ) : (
            searchResults.map((user) => {
              const rel = getRelationship(user.id);

              return (
                <div
                  key={user.id}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  {/* User identity */}
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
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-heading font-black text-xs sm:text-sm text-slate-900 truncate">
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
                      {user.neighborhood && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 font-medium mt-0.5">
                          <MapPin className="w-3 h-3 text-[#E8552B]" />
                          {user.neighborhood}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Relationship controls */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* AMIZADE BUTTON */}
                    {rel.status === 'friends' ? (
                      <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Amigos
                      </span>
                    ) : rel.status === 'pending_sent' ? (
                      <button
                        onClick={() => rel.friendshipId && onDeclineFriendRequest(rel.friendshipId)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                        title="Clique para cancelar solicitação"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        Pendente (Cancelar)
                      </button>
                    ) : rel.status === 'pending_received' ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => rel.friendshipId && onAcceptFriendRequest(rel.friendshipId)}
                          className="px-3 py-1.5 bg-[#0B4F8A] hover:bg-[#083a66] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                        >
                          Aceitar
                        </button>
                        <button
                          onClick={() => rel.friendshipId && onDeclineFriendRequest(rel.friendshipId)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold"
                        >
                          Recusar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onSendFriendRequest(user.id)}
                        className="px-3 py-1.5 bg-[#E8552B] hover:bg-[#cf4720] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all shadow-xs active:scale-95 cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        Adicionar
                      </button>
                    )}

                    {/* SEGUIR BUTTON */}
                    <button
                      onClick={() => onToggleFollowUser(user.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        rel.isFollowing
                          ? 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {rel.isFollowing ? 'Seguindo' : 'Seguir'}
                    </button>

                    {/* PROFILE LINK */}
                    <button
                      onClick={() => {
                        onViewProfile(user.id);
                        onClose();
                      }}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                      title="Ver perfil completo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
