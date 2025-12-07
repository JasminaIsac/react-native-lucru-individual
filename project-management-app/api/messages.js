// api/messages.js
import apiClient from './client';

// GET messages for a task
export const getMessagesByTaskId = (taskId) => {
  return apiClient.get(`/messages/${taskId}`);
};

// SEND a new message
export const sendMessage = (messageData) => {
  return apiClient.post('/messages', messageData);
};
