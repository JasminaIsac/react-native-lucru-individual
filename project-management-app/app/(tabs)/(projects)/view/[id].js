import React, { useState, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useProjects, useTasks, useAuth } from '@contexts';
import { getProjectMembers, updateProjectStatus, getProjectById } from '@api/projects';
import { colors } from '@theme';
import { LinearGradient } from 'expo-linear-gradient';
import { sortTasks, getCategoryName, sortProjectMembers } from '@utils';
import { ProjectDetails, ProjectTasks } from '@components';

const ViewProjectScreen = ({ route }) => {
  const { projectId } = route.params;
  const navigation = useNavigation();
  
  const [members, setMembers] = useState([]);
  const [sortMethod, setSortMethod] = useState('default');
  const [isLoading, setIsLoading] = useState(true);

  // Contexts
  const { projects, categories, updateProjectInContext } = useProjects();
  const { tasks, fetchTasksByProjectId } = useTasks();
  const { currentUser } = useAuth();
  const { userData: user } = currentUser;

  // Găsește proiectul din context (nu API call)
  const project = useMemo(
    () => projects.find(p => p.id === projectId),
    [projects, projectId]
  );

  // Filtrează task-urile pentru acest proiect din context
  const projectTasks = useMemo(
    () => tasks.filter(task => task.project_id === projectId),
    [tasks, projectId]
  );

  // Sortează task-urile
  const sortedTasks = useMemo(
    () => sortTasks(projectTasks, sortMethod),
    [projectTasks, sortMethod]
  );

  // Numele categoriei
  const categoryName = useMemo(
    () => getCategoryName(categories, project?.category_id),
    [categories, project?.category_id]
  );

  // Load project data
  const loadProjectData = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      // Fetch tasks și members în paralel
      const [tasksData, membersData] = await Promise.all([
        fetchTasksByProjectId(projectId),
        getProjectMembers(projectId),
      ]);

      // Sortează membrii (manager primul)
      setMembers(sortProjectMembers(membersData, project?.manager_id));
    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, project?.manager_id, fetchTasksByProjectId]);

  // Load data când componenta se montează
  useEffect(() => {
    loadProjectData();
  }, [loadProjectData]);

  // Refresh data când ecranul devine focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProjectData();
    });
    return unsubscribe;
  }, [navigation, loadProjectData]);

  // Auto-update project status based on task completion
  useEffect(() => {
    if (!project || isLoading) return;

    const completedCount = projectTasks.filter(t => t.status === 'completed').length;
    const totalTasks = projectTasks.length;
    
    let newStatus = 'new';
    
    if (totalTasks === 0) {
      newStatus = 'new';
    } else if (completedCount === totalTasks) {
      newStatus = 'completed';
    } else if (completedCount > 0) {
      newStatus = 'in progress';
    }

    // Update pe server ȘI în context dacă statusul s-a schimbat
    if (project.status !== newStatus) {
      const updatedProject = { ...project, status: newStatus };
      
      // 1. Update pe server prin API
      updateProjectStatus(projectId, newStatus)
        .then(() => {
          // 2. Update în context pentru UI instant
          updateProjectInContext(updatedProject);
        })
        .catch(error => {
          console.error('Error updating project status:', error);
        });
    }
  }, [project?.status, projectTasks, projectId, updateProjectInContext, isLoading]);

  // Callback pentru refresh după task update
  const handleTaskUpdate = useCallback(() => {
    loadProjectData();
  }, [loadProjectData]);

  // Header buttons (doar pentru admin/manager)
  useLayoutEffect(() => {
    if (user?.role === 'developer') return;

    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Edit Project', { project })}
            style={styles.headerButton}
          >
            <Ionicons name="pencil" size={22} color={colors.darkBlue} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Add User to Project', { 
              projectId: project?.id, 
              currentMembers: members, 
              tasks: projectTasks 
            })}
            style={styles.headerButton}
          >
            <Ionicons name="person-add" size={22} color={colors.darkBlue} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, project, user?.role, members, projectTasks]);

  // Loading state
  if (isLoading || !project) {
    return (
      <LinearGradient 
        colors={colors.violetBlueGradient} 
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient 
      colors={colors.violetBlueGradient} 
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProjectDetails 
          project={project} 
          members={members} 
          categoryName={categoryName} 
        />
        <ProjectTasks 
          tasks={sortedTasks}
          project={project}
          members={members}
          user={user}
          sortMethod={sortMethod}
          setSortMethod={setSortMethod}
          onTaskUpdate={handleTaskUpdate}
        />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    marginRight: 15,
  },
  headerButton: {
    marginLeft: 15,
  },
});

export default ViewProjectScreen;