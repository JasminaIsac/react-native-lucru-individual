import apiClient from './client';

// USERS

export const getCurrentUser = () => apiClient.get('/profile');

export const fetchUsers = () => {
  return apiClient.get('/users'); // apiClient already returns res.data
};

export const getUserById = (userId) => {
  return apiClient.get(`/users/${userId}`);
};

export const addUser = (user) => {
  return apiClient.post('/users', user);
};

export const deleteUser = (userId) => {
  return apiClient.delete(`/users/${userId}`);
};

export const updateUser = (updatedUser) => {
  return apiClient.patch(`/users/${updatedUser.id}`, updatedUser);
};

export const loginUser = async (email, password) => {
  try {
    const userData = await apiClient.post('/login', { email, password });
    console.log('Login response:', userData);
    return userData; // already response.data
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
    return await apiClient.post('/change-password', {
      userId,
      oldPassword,
      newPassword,
    });
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong"
    };
  }
};

export const uploadAvatar = async (userId, uri) => {
  try {
    // optional: resize/compress
    // const manipResult = await ImageManipulator.manipulateAsync(
    //   uri,
    //   [{ resize: { width: 500, height: 500 } }],
    //   { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    // );

    const name = uri.split('/').pop() || 'avatar.jpg';
    const ext = name.split('.').pop()?.toLowerCase();
    let type = 'image/jpeg';
    if (ext === 'png') type = 'image/png';

    const formData = new FormData();
    formData.append('avatar', {
      uri: uri,
      name,
      type,
    });

    const response = await apiClient.post(`/users/${userId}/upload-avatar`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return response.avatarUrl; // { avatarUrl, message }
  } catch (err) {
    console.error('Upload failed', err);
    throw err;
  }
};