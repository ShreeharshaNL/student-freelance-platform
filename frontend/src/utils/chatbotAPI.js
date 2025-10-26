// utils/chatbotAPI.js
import API from './api';

export const chatbotAPI = {
    sendMessage: async (message, conversationHistory, userRole) => {
        try {
            const response = await API.post('/chatbot/message', {
                message,
                conversationHistory,
                userRole
            });
            return response.data;
        } catch (error) {
            console.error('Chatbot API error:', error);
            throw error;
        }
    }
};