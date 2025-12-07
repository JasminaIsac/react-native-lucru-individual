// api/projects.js
import apiClient from './client';

// PROJECTS

export const getProjects = () => {
  return apiClient.get('/projects');
};

export const getProjectById = (projectId) => {
  return apiClient.get(`/projects/${projectId}`);
};

export const getUserProjects = (userId) => {
  return apiClient.get(`/users/${userId}/projects`);
};

export const getProjectMembers = (projectId) => {
  return apiClient.get(`/projects/${projectId}/members`);
};

export const removeProjectMember = (projectId, userId) => {
  return apiClient.delete(`/projects/${projectId}/members/${userId}`);
};

export const addProjectMember = (projectId, userId, role) => {
  return apiClient.post(`/projects/${projectId}/members`, { 
    userId, 
    userRole: role 
  });
};

export const addProject = async (projectData) => {
  // 1. Creează proiectul
  const { data: newProject } = await apiClient.post('/projects', projectData);
  
  // 2. Adaugă automat managerul
  if (newProject?.id && projectData.manager_id) {
    await addProjectMember(newProject.id, projectData.manager_id, 'manager');
  }
  
  return newProject;
};

export const deleteProject = (projectId) => {
  return apiClient.delete(`/projects/${projectId}`);
};

export const updateProject = (projectData) => {
  return apiClient.put(`/projects/${projectData.id}`, projectData);
};

export const updateProjectStatus = (projectId, status) => {
  return apiClient.put(`/projects/${projectId}/status`, { status });
};
