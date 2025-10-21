// messagesAPI.js
import API from './api';

export const messagesAPI = {
  // Create or get one-to-one conversation with target user
  createOrGetConversation: async (userId) => {
    const res = await API.post('/messages/conversations', { userId });
    return res.data;
  },

  // List my conversations
  getConversations: async () => {
    const res = await API.get('/messages/conversations');
    return res.data;
  },

  // List messages in a conversation
  getMessages: async (conversationId) => {
    const res = await API.get(`/messages/conversations/${conversationId}/messages`);
    return res.data;
  },

  // Send message
  sendMessage: async (conversationId, content) => {
    const res = await API.post(`/messages/conversations/${conversationId}/messages`, { content });
    return res.data;
  },
};
