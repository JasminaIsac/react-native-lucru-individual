// api/client.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:5000';

// Creează instanța axios
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR - Adaugă token-ul automat la fiecare request
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Obține token-ul din SecureStore
      const token = await SecureStore.getItemAsync('authToken');
      
      if (token) {
        // Adaugă token-ul în header automat
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      console.error('Error adding token to request:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - Gestionează erorile automat
apiClient.interceptors.response.use(
  (response) => {
    // Request successful, returnează doar data
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Dacă primești 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Aici poți implementa refresh token logic
      try {
        // const newToken = await refreshAuthToken();
        // await SecureStore.setItemAsync('authToken', newToken);
        // originalRequest.headers.Authorization = `Bearer ${newToken}`;
        // return apiClient(originalRequest);
        
        // Sau redirect la login
        console.log('Unauthorized - redirect to login');
        router.replace('/login')
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    // Alte erori
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', errorMessage);
    
    return Promise.reject(error);
  }
);

export default apiClient;