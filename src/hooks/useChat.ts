// ==============================================================================
// 💬 USE CHAT HOOK — CONVERSAS 1-PARA-1 ENTRE CLIENTE E LOJISTAS COM AGENTES BAIANOS
// Vocabulário soteropolitano moderno, áudio, envio de localização e status
// ==============================================================================

import { useState, useCallback, useEffect } from 'react';
import { ChatConversation, ChatMessage, User } from '../types';
import { INITIAL_CONVERSATIONS } from '../data/mockData';
import { generateBaianoChatResponse } from '../services/baianoAgentsEngine';

export function useChat(currentUser: User) {
  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    try {
      const saved = localStorage.getItem('salvo_chat_conversations');
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    conversations[0]?.id || null
  );

  // Salvar no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('salvo_chat_conversations', JSON.stringify(conversations));
    } catch {}
  }, [conversations]);

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null;

  const totalUnreadCount = conversations.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);

  // Enviar mensagem de texto
  const sendMessage = useCallback(
    (text: string, storeId?: string) => {
      if (!text.trim()) return;

      const targetId = activeConversationId || (storeId ? `conv-${storeId}` : null);
      if (!targetId) return;

      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentUser.role,
        receiverId: activeConversation?.storeId || storeId || 'store',
        text: text.trim(),
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        read: false,
        type: 'text',
      };

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === targetId) {
            return {
              ...conv,
              lastMessage: text.trim(),
              lastMessageTime: newMsg.timestamp,
              messages: [...conv.messages, newMsg],
            };
          }
          return conv;
        })
      );

      // Resposta automática do Agente Baiano do Lojista
      const storeName = activeConversation?.storeName || 'Comerciante de Salvador';
      setTimeout(() => {
        const botResponse = generateBaianoChatResponse(text, { storeName });
        const botReply = botResponse.replyText;
        const replyMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          senderId: activeConversation?.storeId || 'store',
          senderName: storeName,
          senderRole: 'merchant',
          receiverId: currentUser.id,
          text: botReply,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          read: true,
          type: 'text',
          isAutomated: true,
        };

        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id === targetId) {
              return {
                ...conv,
                lastMessage: botReply,
                lastMessageTime: replyMsg.timestamp,
                messages: [...conv.messages, replyMsg],
              };
            }
            return conv;
          })
        );
      }, 1000);
    },
    [activeConversationId, activeConversation, currentUser]
  );

  // Enviar áudio ou localização
  const sendSpecialMessage = useCallback(
    (type: 'audio' | 'location', payload?: { audioDuration?: string; address?: string }) => {
      if (!activeConversationId) return;

      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentUser.role,
        receiverId: activeConversation?.storeId || 'store',
        text: type === 'audio' ? 'Mensagem de voz enviada' : `Localização: ${payload?.address || 'Salvador, BA'}`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        read: false,
        type,
        audioDuration: payload?.audioDuration || '0:14',
        locationDetails: type === 'location' ? {
          address: payload?.address || 'Barra, Salvador',
          neighborhood: 'Barra',
          name: 'Ponto do Usuário',
        } : undefined,
      };

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === activeConversationId) {
            return {
              ...conv,
              lastMessage: newMsg.text,
              lastMessageTime: newMsg.timestamp,
              messages: [...conv.messages, newMsg],
            };
          }
          return conv;
        })
      );
    },
    [activeConversationId, activeConversation, currentUser]
  );

  return {
    conversations,
    activeConversationId,
    setActiveConversationId,
    activeConversation,
    totalUnreadCount,
    sendMessage,
    sendSpecialMessage,
  };
}
