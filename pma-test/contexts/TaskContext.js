import React, { createContext, useState, useContext, useEffect } from 'react';
import { getTasks, getTasksByProjectId } from '@api/tasks';

const TasksContext = createContext(null);

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const tasksData = await getTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError(error.message || 'Failed to fetch tasks');
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchTasksByProjectId = async (projectId) => {
    setLoading(true);
    try {
      const tasksData = await getTasksByProjectId(projectId);
      return tasksData;
    } catch (error) {
      console.error('Error fetching tasks by project ID:', error);
      setError(error.message || 'Failed to fetch tasks');
      return [];
    } finally {
      setLoading(false);
    }
  };
  

  const addTaskToContext = (task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const deleteTaskFromContext = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const updateTaskInContext = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };


  return (
    <TasksContext.Provider value={{ 
      tasks: tasks || [], 
      loading, 
      error,
      addTaskToContext, 
      deleteTaskFromContext, 
      updateTaskInContext, 
      fetchTasksByProjectId 
    }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  
  if (context === null) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  
  return context || {
    tasks: [],
    loading: false,
    error: null,
    addTaskToContext: () => {},
    deleteTaskFromContext: () => {},
    updateTaskInContext: () => {},
    fetchTasksByProjectId: async () => []
  };
};
