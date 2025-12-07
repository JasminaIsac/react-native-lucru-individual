// api/categories.js
import apiClient from './client';

// GET ALL
export const getCategories = () => {
  return apiClient.get('/categories');
};

// ADD
export const addCategory = (category) => {
  return apiClient.post('/categories', category);
};

// UPDATE
export const updateCategory = (id, categoryData) => {
  return apiClient.put(`/categories/${id}`, categoryData);
};

// DELETE
export const deleteCategory = (id) => {
  return apiClient.delete(`/categories/${id}`);
};
