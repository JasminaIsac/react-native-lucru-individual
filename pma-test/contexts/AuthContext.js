import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { loginUser, getCurrentUser } from '@api/users'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); 
  const [loading, setLoading] = useState(true);

const loadUserData = async () => {
  try {
    const storedToken = await SecureStore.getItemAsync('authToken');
    if (!storedToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    setToken(storedToken);

    const userData = await getCurrentUser(); 
    setUser(userData);
  } catch (error) {
    console.error('Error loading user data:', error);
    setUser(null);
    setToken(null);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadUserData();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password); 
      if (!response?.token) throw new Error('No token returned');

      await SecureStore.setItemAsync('authToken', response.token);
      setToken(response.token);

      setUser(response.user);

      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Authentication failed');
    }
  };

  const updateUserInContext = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateToken = async (newToken) => {
    if (!newToken || newToken === token) return;
    await SecureStore.setItemAsync('authToken', newToken);
    setToken(newToken);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,

        loadUserData,
        login,
        updateUserInContext,
        logout,
        updateToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
