import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProjects, getUserProjects } from '@api/projects';
import { getCategories } from '@api/categories';

import { useAuth } from './AuthContext';

const ProjectsContext = createContext(null);

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (user?.role === 'developer' || user?.role === 'project manager') {
          const projectsData = await getUserProjects(user.id);
          setProjects(projectsData);
        } else {
          const projectsData = await getProjects();
          setProjects(projectsData);
        }
  
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to fetch projects');
        // Setează valori default chiar dacă fetch eșuează
        setProjects([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
  
    if (user && user.id) {
      fetchData();
    }
  }, [user]);
  

  const updateProjectInContext = (updatedProject) => {
    setProjects((prevProjects) =>
      prevProjects.map((proj) =>
        proj.id === updatedProject.id ? updatedProject : proj
      )
    );
  };

  const addProjectToContext = (newProject) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };
  

  const deleteProjectFromContext = (projectId) => {
    setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));
    console.log("Deleted:", projectId);
  };


  const addCategoryToContext = (newCategory) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  const updateCategoryInContext = (id, updatedData) => {
    console.log('Updating category with ID:', id, 'and data:', updatedData);
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.id === id ? { ...cat, ...updatedData } : cat
      )
    );
  };  

  const removeCategoryFromContext = (categoryId) => {
    setCategories((prevCategories) => prevCategories.filter((category) => category.id !== categoryId));
  };

  const getProjectById = (projectId) => projects.find((project) => project.id === projectId);
  
  const value = {
    projects: projects || [],
    categories: categories || [],
    loading,
    error,
    setProjects,
    setCategories,
    updateProjectInContext,
    addProjectToContext,
    deleteProjectFromContext,
    addCategoryToContext,
    updateCategoryInContext,
    removeCategoryFromContext,
    getProjectById
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  
  if (context === null) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  
  return context || {
    projects: [],
    categories: [],
    loading: false,
    error: null,
    setProjects: () => {},
    setCategories: () => {},
    updateProjectInContext: () => {},
    addProjectToContext: () => {},
    deleteProjectFromContext: () => {},
    addCategoryToContext: () => {},
    updateCategoryInContext: () => {},
    removeCategoryFromContext: () => {},
    getProjectById: () => null
  };
};
