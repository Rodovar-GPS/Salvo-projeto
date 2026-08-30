import { BAIANO_AGENTS, BaianoAgentProfile } from '../data/baianoAgents';
import { FeedComment, MediaFeedItem } from '../views/ForYouSocialView';
import { ChatMessage, SocialNotification } from '../types';

export interface BaianoLiveActivity {
  id: string;
  agent: BaianoAgentProfile;
  type: 'like' | 'comment' | 'share' | 'want' | 'follow' | 'chat';
  targetTitle: string;
  targetId: string;
  message?: string;
  timestamp: string;
  neighborhood: string;
}

// Memory of active events
const RECENT_ACTIVITIES: BaianoLiveActivity[] = [];

/**
 * Returns a random agent from the 20 Baiano agents
 */
export function getRandomBaianoAgent(excludeId?: string): BaianoAgentProfile {
  const filtered = excludeId ? BAIANO_AGENTS.filter((a) => a.id !== excludeId) : BAIANO_AGENTS;
  const index = Math.floor(Math.random() * filtered.length);
  return filtered[index] || BAIANO_AGENTS[0];
}

/**
 * Generates an authentic Baiano comment tailored for a specific feed/store item
 */
export function generateBaianoComment(
  item: MediaFeedItem,
  existingComments: FeedComment[] = []
): { comment: FeedComment; agent: BaianoAgentProfile } {
  // Pick an agent who hasn't commented on this item recently
  const commentedUserNames = new Set(existingComments.map((c) => c.userName));
  const availableAgents = BAIANO_AGENTS.filter((a) => !commentedUserNames.has(a.name));
  const agent = availableAgents.length > 0
    ? availableAgents[Math.floor(Math.random() * availableAgents.length)]
    : getRandomBaianoAgent();

  const captionLower = (item.caption || '').toLowerCase();
  const tagsStr = (item.tags || []).join(' ').toLowerCase();
  const categoryLower = (item.store?.category || '').toLowerCase();

  let categoryKey: keyof BaianoAgentProfile['commentStyles'] = 'general';

  if (
    captionLower.includes('açaí') ||
    captionLower.includes('acarajé') ||
    captionLower.includes('moqueca') ||
    captionLower.includes('camarão') ||
    captionLower.includes('restaurante') ||
    captionLower.includes('gastronomia') ||
    captionLower.includes('prato') ||
    captionLower.includes('sabor') ||
    categoryLower.includes('restaurante') ||
    categoryLower.includes('gastronomia')
  ) {
    categoryKey = 'food';
  } else if (
    captionLower.includes('praia') ||
    captionLower.includes('mar') ||
    captionLower.includes('surf') ||
    captionLower.includes('onda') ||
    captionLower.includes('sol') ||
    tagsStr.includes('praia') ||
    tagsStr.includes('surf')
  ) {
    categoryKey = 'beach';
  } else if (
    captionLower.includes('moda') ||
    captionLower.includes('biquíni') ||
    captionLower.includes('linho') ||
    captionLower.includes('roupa') ||
    categoryLower.includes('moda')
  ) {
    categoryKey = 'fashion';
  } else if (
    captionLower.includes('barbearia') ||
    captionLower.includes('corte') ||
    captionLower.includes('degradê') ||
    captionLower.includes('cabelo') ||
    categoryLower.includes('barbearia')
  ) {
    categoryKey = 'barber';
  } else if (
    captionLower.includes('artesanato') ||
    captionLower.includes('pelourinho') ||
    captionLower.includes('cultura') ||
    captionLower.includes('bonfim') ||
    captionLower.includes('cerâmica') ||
    categoryLower.includes('artesanato') ||
    categoryLower.includes('cultura')
  ) {
    categoryKey = 'culture';
  } else if (
    captionLower.includes('café') ||
    captionLower.includes('padaria') ||
    captionLower.includes('bolo') ||
    categoryLower.includes('café')
  ) {
    categoryKey = 'coffee';
  }

  const pool = agent.commentStyles[categoryKey] || agent.commentStyles.general;
  const chosenText = pool[Math.floor(Math.random() * pool.length)] || agent.commentStyles.general[0];

  const comment: FeedComment = {
    id: `baiano-comm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId: agent.id,
    userName: agent.name,
    userAvatar: agent.avatar,
    userNeighborhood: agent.neighborhood,
    text: chosenText,
    timestamp: 'Agora mesmo',
    likes: Math.floor(Math.random() * 8) + 1,
  };

  return { comment, agent };
}

/**
 * Generates an immediate Baiano reply to a comment posted by the user
 */
export function generateBaianoReplyToUser(
  userCommentText: string,
  userName: string,
  item?: MediaFeedItem
): { replyComment: FeedComment; agent: BaianoAgentProfile } {
  const agent = getRandomBaianoAgent();
  const firstName = userName.split(' ')[0] || 'amigo';

  const replyTemplates = [
    `@${userName} Brocou no comentário, ${firstName}! Concordo 100% contigo! 👏🔥`,
    `@${userName} Oxe, falou tudo ${firstName}! Passei lá essa semana e a experiência foi exatamente essa!`,
    `@${userName} Com certeza pai! Salvador tem os melhores cantinhos e o atendimento lá é nota 10!`,
    `@${userName} É isso aí ${firstName}! Já dei meu like no seu comentário! Tamo junto na torcida pelos nossos comércios! ✨`,
    `@${userName} Disse tudo! A qualidade lá não tem igual aqui na Bahia! 🥥🌴`,
    `@${userName} Assino embaixo ${firstName}! Valeu pela indicação, vou colar lá também!`,
  ];

  const chosenReply = replyTemplates[Math.floor(Math.random() * replyTemplates.length)];

  const replyComment: FeedComment = {
    id: `baiano-reply-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId: agent.id,
    userName: agent.name,
    userAvatar: agent.avatar,
    userNeighborhood: agent.neighborhood,
    text: chosenReply,
    timestamp: 'Agora mesmo',
    likes: Math.floor(Math.random() * 5) + 1,
  };

  return { replyComment, agent };
}

/**
 * Generates a realistic Baiano chat response when the user speaks in chat
 */
export function generateBaianoChatResponse(
  userText: string,
  targetContext: { storeName?: string; agentName?: string; neighborhood?: string }
): { replyText: string; agent: BaianoAgentProfile } {
  const agent = getRandomBaianoAgent();
  const textLower = userText.toLowerCase();

  let replyText = '';

  if (textLower.includes('preço') || textLower.includes('quanto') || textLower.includes('valor')) {
    replyText = `Opa! Tudo na paz? O preço deles pelo SALVÔ tá com desconto exclusivo muito bom! Pode ir que é garantia de economia e qualidade pai! 🏷️✨`;
  } else if (textLower.includes('onde') || textLower.includes('endereço') || textLower.includes('local')) {
    replyText = `Fica fácil de achar! É bem localizado aqui em ${targetContext.neighborhood || 'Salvador'}, pertinho de tudo. Recomendo demais a visita! 📍`;
  } else if (textLower.includes('horário') || textLower.includes('funciona') || textLower.includes('aberto')) {
    replyText = `Eles tão funcionando a todo vapor hoje! Costuma abrir cedo e vai até a noite. Dá uma conferida no perfil aqui no SALVÔ que tem tudo certinho! ⏰`;
  } else if (textLower.includes('olá') || textLower.includes('oi') || textLower.includes('boa')) {
    const intros = agent.chatIntro || [
      'Fala meu parceiro! Beleza? Esse lugar é diferenciado demais aqui em Salvador!',
    ];
    replyText = intros[Math.floor(Math.random() * intros.length)];
  } else {
    const genericReplies = [
      `Qual foi pivete! Esse serviço aqui é barril dobrado de bom! Super recomendo pra qualquer um! 👍`,
      `Massa demais! O atendimento deles é de primeira, já comprei/frequentei e aprovei com louvor! 🌟`,
      `Oxe, com certeza! A energia da galera daqui é sem comparação, Salvador respira coisas boas!`,
      `Pode confiar de olhos fechados, serviço com padrão e acolhimento baiano de verdade! 🙏`,
    ];
    replyText = genericReplies[Math.floor(Math.random() * genericReplies.length)];
  }

  return { replyText, agent };
}

/**
 * Generates a periodic autonomous client activity in Salvador (like, comment, want, share)
 * NOTE: As per user instructions, agents do NOT make purchases, but do all social actions!
 */
export function triggerAutonomousSocialAction(feedItems: MediaFeedItem[]): BaianoLiveActivity | null {
  if (feedItems.length === 0) return null;

  const agent = getRandomBaianoAgent();
  const targetItem = feedItems[Math.floor(Math.random() * feedItems.length)];
  const actionTypes: ('like' | 'comment' | 'share' | 'want' | 'follow')[] = [
    'like',
    'like',
    'comment',
    'want',
    'share',
    'follow',
  ];
  const type = actionTypes[Math.floor(Math.random() * actionTypes.length)];

  let message = '';
  if (type === 'like') {
    message = `curtiu a publicação de ${targetItem.store.name}`;
  } else if (type === 'want') {
    message = `clicou em 'Eu Quero' na oferta de ${targetItem.store.name}`;
  } else if (type === 'share') {
    message = `compartilhou o vídeo com amigos de ${agent.neighborhood}`;
  } else if (type === 'follow') {
    message = `começou a seguir ${targetItem.store.name}`;
  } else if (type === 'comment') {
    const { comment } = generateBaianoComment(targetItem);
    message = `comentou: "${comment.text.slice(0, 45)}..."`;
  }

  const activity: BaianoLiveActivity = {
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    agent,
    type,
    targetTitle: targetItem.store.name,
    targetId: targetItem.id,
    message,
    timestamp: 'Agora',
    neighborhood: agent.neighborhood,
  };

  RECENT_ACTIVITIES.unshift(activity);
  if (RECENT_ACTIVITIES.length > 50) RECENT_ACTIVITIES.pop();

  // Dispatch custom event for real-time reactivity in views
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('salvo-baiano-live-activity', {
        detail: activity,
      })
    );
  }

  return activity;
}

export function getRecentBaianoActivities(): BaianoLiveActivity[] {
  return [...RECENT_ACTIVITIES];
}
