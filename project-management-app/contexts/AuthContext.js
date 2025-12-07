// import React, { createContext, useState, useContext, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { loginUser } from '@api/users';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
  
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const loadUserData = async () => {
//     try {
//       const savedUserData = await AsyncStorage.getItem('userData');
//       if (savedUserData) {
//         const parsed = JSON.parse(savedUserData);
//         console.log('Saved user data:', parsed);
//         setCurrentUser(parsed);
//       }
//     } catch (error) {
//       console.error('Error loading user from AsyncStorage', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadUserData();
//   }, []);

  

//   const login = async (email, password) => {
//     try {
//       const response = await loginUser(email, password);
//       const { token, ...userData } = response;
//       setCurrentUser(userData);
//       await AsyncStorage.setItem('userData', JSON.stringify({ ...userData, token }));
//       console.log('User logged in successfully: ', userData);
//     } catch (error) {
//       throw error;
//     }
//   };

//   const updateUserInContext = async (updatedUser) => {  
//     try {
//       const newUserData = { ...currentUser, ...updatedUser };
//       setCurrentUser(newUserData);
//       await AsyncStorage.setItem('userData', JSON.stringify(newUserData));
//     } catch (error) {
//       console.error('Error updating user in AsyncStorage', error);
//     }
//   };
  

//   const logout = async () => {
//     setCurrentUser(null);
//     await AsyncStorage.removeItem('userData');
//   };

//   if (loading) {
//     return null;
//   }

//   return (
//     <AuthContext.Provider value={{ currentUser, login, logout, updateUserInContext, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { loginUser } from '@api/users';

const AuthContext = createContext(null);

// Keys pentru storage
const USER_DATA_KEY = 'userData';
const AUTH_TOKEN_KEY = 'authToken';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user data from storage
  const loadUserData = useCallback(async () => {
    try {
      // Încarcă user data din AsyncStorage
      const savedUserData = await AsyncStorage.getItem(USER_DATA_KEY);
      
      // Încarcă token din SecureStore
      const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      
      if (savedUserData && token) {
        const userData = JSON.parse(savedUserData);
        console.log('Loaded user data from storage');
        
        // Setează user cu token din SecureStore
        setCurrentUser({ ...userData, token });
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      // Cleanup dacă există erori
      await logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      const response = await loginUser(email, password);
      
      // IMPORTANT: Creează obiecte noi pentru a evita read-only issues
      const { token, ...userData } = response;
      
      // Salvează token în SecureStore (encrypted)
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
      
      // Salvează user data (fără token) în AsyncStorage
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      
      // Setează user în state cu token
      const newUserData = { ...userData, token };
      setCurrentUser(newUserData);
      
      console.log('User logged in successfully');
      return newUserData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  // Update user in context and storage
  const updateUserInContext = useCallback(async (updatedUser) => {
    try {
      if (!currentUser) {
        console.warn('No current user to update');
        return;
      }

      // Extrage token-ul din currentUser
      const { token, ...userDataWithoutToken } = currentUser;
      
      // Merge updated data (fără token)
      const newUserData = { 
        ...userDataWithoutToken, 
        ...updatedUser 
      };
      
      // Salvează doar user data (fără token) în AsyncStorage
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(newUserData));
      
      // Setează în state cu token
      setCurrentUser({ ...newUserData, token });
      
      console.log('User updated successfully');
    } catch (error) {
      console.error('Error updating user in storage:', error);
      throw error;
    }
  }, [currentUser]);

  // Update token (dacă se refreshează)
  const updateToken = useCallback(async (newToken) => {
    try {
      if (!currentUser) {
        console.warn('No current user');
        return;
      }

      // Salvează noul token în SecureStore
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, newToken);
      
      // Update state
      setCurrentUser({ ...currentUser, token: newToken });
      
      console.log('Token updated successfully');
    } catch (error) {
      console.error('Error updating token:', error);
      throw error;
    }
  }, [currentUser]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Șterge token din SecureStore
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      
      // Șterge user data din AsyncStorage
      await AsyncStorage.removeItem(USER_DATA_KEY);
      
      // Clear state
      setCurrentUser(null);
      
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Force clear state chiar dacă storage cleanup eșuează
      setCurrentUser(null);
    }
  }, []);

  // Get token (helper function)
  const getToken = useCallback(async () => {
    try {
      return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }, []);

  // Context value
  const value = {
    currentUser,
    login,
    logout,
    updateUserInContext,
    updateToken,
    getToken,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;