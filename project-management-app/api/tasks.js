// api/tasks.js
import apiClient from './client';

// GET all tasks
export const getTasks = () => {
  return apiClient.get('/tasks');
};

// GET task by ID
export const getTaskById = (taskId) => {
  return apiClient.get(`/tasks/${taskId}`);
};

// GET tasks by project ID
export const getTasksByProjectId = (projectId) => {
  return apiClient.get(`/tasks/project/${projectId}`);
};

// GET tasks assigned to user
export const getTasksByUserId = (userId) => {
  return apiClient.get(`/tasks/user/${userId}`);
};

// GET tasks for a specific project AND a specific user
export const getTaskByProjectByUserId = (projectId, userId) => {
  return apiClient.get(`/tasks/project/${projectId}/user/${userId}`);
};

// GET count of tasks for that user in that project
export const getProjectTasksCountByUserId = (projectId, userId) => {
  return apiClient.get(`/tasks/project/${projectId}/user/${userId}/count`);
};

// ADD new task
export const addTask = (taskData) => {
  return apiClient.post('/tasks', taskData);
};

// DELETE task
export const deleteTask = (taskId) => {
  return apiClient.delete(`/tasks/${taskId}`);
};

// UPDATE task
export const updateTask = (updatedTask) => {
  return apiClient.patch(`/tasks/${updatedTask.id}`, updatedTask);
};

// UPDATE task status
export const updateTaskStatus = (taskId, newStatus) => {
  return apiClient.put(`/tasks/${taskId}/status`, { status: newStatus });
};
