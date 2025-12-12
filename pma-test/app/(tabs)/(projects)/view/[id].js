import React, { useState, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProjects, useTasks, useAuth } from '@contexts/index';
import { getProjectMembers, updateProjectStatus, getProjectById } from '@api/projects';
import { colors } from '@theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { sortTasks, getCategoryName, sortProjectMembers } from '@utils/index';
import { ProjectDetails, ProjectTasks } from '@components/index';
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';

const ViewProjectScreen = () => {
  const { id: projectId } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [sortMethod, setSortMethod] = useState('default');
  const [isLoading, setIsLoading] = useState(true);

  const { categories, updateProjectInContext } = useProjects();
  const { tasks, fetchTasksByProjectId } = useTasks();
  const { user } = useAuth();

  // Task-urile din context pentru acest proiect
  const projectTasks = useMemo(() => {
    return tasks.filter(t => String(t.project_id) === String(projectId));
  }, [tasks, projectId]);

  const sortedTasks = useMemo(
    () => sortTasks(projectTasks, sortMethod),
    [projectTasks, sortMethod]
  );

  const categoryName = useMemo(
    () => getCategoryName(categories, project?.category_id),
    [categories, project?.category_id]
  );

  // 1. loadProjectData (stabil)
  const loadProjectData = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      const p = await getProjectById(projectId);
      setProject(p);

      await fetchTasksByProjectId(projectId);

      const membersData = await getProjectMembers(projectId);
      setMembers(sortProjectMembers(membersData, p.manager_id));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  // 2. LOAD ONLY ON FOCUS
  useFocusEffect(
    useCallback(() => {
      loadProjectData();
    }, [loadProjectData])
  );

  // 3. Auto-update status (stabil)
  useEffect(() => {
    if (isLoading || !project) return;

    const completed = projectTasks.filter(t => t.status === 'completed').length;
    const total = projectTasks.length;

    let newStatus =
      total === 0 ? 'new' :
      completed === total ? 'completed' :
      completed > 0 ? 'in progress' : 'new';

    if (newStatus !== project.status) {
      updateProjectStatus(projectId, newStatus)
        .then(() => updateProjectInContext({ ...project, status: newStatus }))
        .catch(err => console.error(err));
    }
  }, [project, projectTasks, isLoading]);



  const handleTaskUpdate = () => loadProjectData();

  // Set header buttons - stabilizat cu useLayoutEffect
  useLayoutEffect(() => {
    if (!project || user?.role === 'developer') return;

    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => router.push(`/(tabs)/(projects)/edit/${project.id}`)}
            style={styles.headerButton}
          >
            <Ionicons name="pencil" size={22} color={colors.darkBlue} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push(`/(tabs)/(projects)/members/${project.id}`)}
            style={styles.headerButton}
          >
            <Ionicons name="person-add" size={22} color={colors.darkBlue} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, project?.id, user?.role]);


  if (isLoading || !project) {
    return (
      <LinearGradient colors={colors.violetBlueGradient} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={colors.violetBlueGradient} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProjectDetails project={project} members={members} categoryName={categoryName} />
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
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerRight: { flexDirection: 'row', marginRight: 15 },
  headerButton: { marginLeft: 15 },
});

export default ViewProjectScreen;
