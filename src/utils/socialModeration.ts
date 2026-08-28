/**
 * Salvador Social Moderation & User Blocking System (SALVÔ)
 * 
 * Regras estritas de moderação:
 * 1. O cliente ou lojista só pode deletar postagem ou comentário deles mesmos.
 * 2. EXCEÇÃO: O dono da página (perfil) ou da loja pode deletar postagens/comentários
 *    escritos por terceiros na sua própria página/loja.
 * 3. Opção de Bloquear e Desbloquear usuários em tempo real com persistência local.
 */

export interface BlockedUserInfo {
  id: string;
  name: string;
  avatar?: string;
  blockedAt: string;
  reason?: string;
}

const STORAGE_PREFIX = 'salvo_blocked_users_';

/**
 * Obter a lista de usuários bloqueados pelo usuário atual
 */
export function getBlockedUsers(currentUserId: string = 'current'): BlockedUserInfo[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${currentUserId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading blocked users from storage', err);
  }
  return [];
}

/**
 * Bloquear um usuário
 */
export function blockUser(
  currentUserId: string = 'current',
  targetUser: { id: string; name: string; avatar?: string; reason?: string }
): BlockedUserInfo[] {
  if (!targetUser.id || targetUser.id === currentUserId) return getBlockedUsers(currentUserId);

  const existing = getBlockedUsers(currentUserId);
  const alreadyBlocked = existing.some((u) => u.id === targetUser.id);
  if (alreadyBlocked) return existing;

  const updated: BlockedUserInfo[] = [
    ...existing,
    {
      id: targetUser.id,
      name: targetUser.name || 'Usuário',
      avatar: targetUser.avatar,
      blockedAt: new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      reason: targetUser.reason,
    },
  ];

  try {
    localStorage.setItem(`${STORAGE_PREFIX}${currentUserId}`, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving blocked user to storage', err);
  }

  return updated;
}

/**
 * Desbloquear um usuário
 */
export function unblockUser(currentUserId: string = 'current', targetUserId: string): BlockedUserInfo[] {
  const existing = getBlockedUsers(currentUserId);
  const updated = existing.filter((u) => u.id !== targetUserId);

  try {
    localStorage.setItem(`${STORAGE_PREFIX}${currentUserId}`, JSON.stringify(updated));
  } catch (err) {
    console.error('Error removing blocked user from storage', err);
  }

  return updated;
}

/**
 * Verificar se um usuário específico está bloqueado
 */
export function isUserBlocked(currentUserId: string = 'current', targetUserId?: string): boolean {
  if (!targetUserId) return false;
  const blockedList = getBlockedUsers(currentUserId);
  return blockedList.some((u) => u.id === targetUserId);
}

/**
 * Verificar se o usuário atual tem permissão para DELETAR um comentário
 * 
 * Regra:
 * - O autor do comentário pode deletar seu próprio comentário.
 * - OU o dono da página/perfil/loja onde o comentário foi escrito pode deletar comentários de terceiros.
 */
export function canDeleteComment(
  commentUserId?: string,
  commentUserName?: string,
  currentUserId?: string,
  currentUserName?: string,
  pageOrStoreOwnerId?: string
): boolean {
  if (!currentUserId && !currentUserName) return false;

  // 1. O próprio autor do comentário
  const isAuthor =
    (Boolean(commentUserId) && Boolean(currentUserId) && commentUserId === currentUserId) ||
    (Boolean(commentUserName) && Boolean(currentUserName) && commentUserName === currentUserName);

  if (isAuthor) return true;

  // 2. O dono da página/perfil ou da loja onde o comentário foi postado
  if (pageOrStoreOwnerId && currentUserId && pageOrStoreOwnerId === currentUserId) {
    return true;
  }

  return false;
}

/**
 * Verificar se o usuário atual tem permissão para EDITAR um comentário
 * (Apenas o autor pode editar)
 */
export function canEditComment(
  commentUserId?: string,
  commentUserName?: string,
  currentUserId?: string,
  currentUserName?: string
): boolean {
  if (!currentUserId && !currentUserName) return false;

  return (
    (Boolean(commentUserId) && Boolean(currentUserId) && commentUserId === currentUserId) ||
    (Boolean(commentUserName) && Boolean(currentUserName) && commentUserName === currentUserName)
  );
}

/**
 * Verificar se o usuário atual tem permissão para DELETAR uma postagem
 * 
 * Regra:
 * - O autor da postagem pode deletar sua própria postagem.
 * - OU o dono da página/perfil onde a postagem foi feita pode deletar.
 */
export function canDeletePost(
  postAuthorId?: string,
  postAuthorName?: string,
  currentUserId?: string,
  currentUserName?: string,
  pageOwnerId?: string
): boolean {
  if (!currentUserId && !currentUserName) return false;

  // 1. Autor do post
  const isAuthor =
    (Boolean(postAuthorId) && Boolean(currentUserId) && postAuthorId === currentUserId) ||
    (Boolean(postAuthorName) && Boolean(currentUserName) && postAuthorName === currentUserName);

  if (isAuthor) return true;

  // 2. Dono da página/perfil onde o post foi publicado
  if (pageOwnerId && currentUserId && pageOwnerId === currentUserId) {
    return true;
  }

  return false;
}
