import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProjects, getUserProjects } from '@api/projects';
import { getCategories } from '@api/categories';

import { useAuth } from './AuthContext';

const ProjectsContext = createContext();

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useAuth();
  
  const userData = currentUser?.userData;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (userData?.role === 'developer' || userData?.role === 'manager') {
          const projectsData = await getUserProjects(userData.id);
          setProjects(projectsData);
        } else {
          const projectsData = await getProjects();
          setProjects(projectsData);
        }
  
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (userData && userData.id) {
      fetchData();
    }
  }, [userData]);
  

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
  
  return (
    <ProjectsContext.Provider
      value={{
        projects,
        categories,
        loading,
        setProjects,
        setCategories,
        updateProjectInContext,
        addProjectToContext,
        deleteProjectFromContext,
        addCategoryToContext,
        updateCategoryInContext,
        removeCategoryFromContext,
        getProjectById
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectsContext);
