import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUsers } from '@api/users';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Pornește starea de încărcare
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.message || 'Failed to fetch users');
        setUsers([]);
      } finally {
        setLoading(false); // Oprește încărcarea
      }
    };

    fetchData();
  }, []);

  const addUserToContext = async (newUser) => {
      setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  const updateUserInContext = async (updatedUser) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
  };

  const deleteUserFromContext = async (userId) => {
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );
  };


  return (
    <UserContext.Provider
      value={{
        users: users || [],
        loading,
        error,
        addUserToContext,
        updateUserInContext,
        deleteUserFromContext,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  
  if (context === null) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  
  return context || {
    users: [],
    loading: false,
    error: null,
    addUserToContext: () => {},
    updateUserInContext: () => {},
    deleteUserFromContext: () => {},
  };
};
