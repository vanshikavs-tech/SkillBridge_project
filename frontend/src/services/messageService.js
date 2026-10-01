import API from './api';

export const messageService = {
  getConversations: async () => {
    const response = await API.get('/conversations');
    return response.data;
  },

  getOrCreateConversation: async (targetUserId, projectId = null) => {
    const response = await API.post('/conversations', { targetUserId, projectId });
    return response.data;
  },

  getMessages: async (conversationId) => {
    const response = await API.get(`/conversations/${conversationId}/messages`);
    return response.data;
  },

  sendMessage: async (payload) => {
    const response = await API.post('/messages', payload);
    return response.data;
  },
};
