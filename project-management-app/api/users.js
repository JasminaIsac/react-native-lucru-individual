import apiClient from './client';

// USERS

export const fetchUsers = () => {
  return apiClient.get('/users').then(res => res.data);
};

export const getUserById = (userId) => {
  return apiClient.get(`/users/${userId}`).then(res => res.data);
};

export const addUser = (user) => {
  return apiClient.post('/users', user).then(res => res.data);
};

export const deleteUser = (userId) => {
  return apiClient.delete(`/users/${userId}`).then(res => res.data);
};

export const updateUser = (updatedUser) => {
  return apiClient.patch(`/users/${updatedUser.id}`, updatedUser).then(res => res.data);
};

export const loginUser = async (email, password) => {
  try {
    const { data } = await apiClient.post('/login', { email, password });
    return data;
  } catch (err) {
    throw err.response?.data?.message || "Authentication failed";
  }
};

export const changePassword = async (userId, oldPassword, newPassword, confirmPassword) => {
  if (newPassword.length < 8) {
    return { success: false, message: "Password must be at least 8 characters long." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: "New password and confirmation do not match." };
  }

  try {
    const { data } = await apiClient.post('/change-password', {
      userId,
      oldPassword,
      newPassword,
    });

    return data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong"
    };
  }
};
