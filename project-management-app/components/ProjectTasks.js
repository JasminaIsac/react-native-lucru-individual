import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TaskList, TaskSort } from '@components';
import { colors, textPresets } from '@theme';
import { USER_ROLES } from '@constants/index';

const ProjectTasks = ({ 
  tasks, 
  project, 
  user, 
  sortMethod, 
  setSortMethod, 
  members,
  onTaskUpdate 
}) => {
  const router = useRouter();

  // Handler pentru add task
  const handleAddTask = useCallback(() => {
    router.push({
      pathname: '/(tabs)/(tasks)/add',
      params: { 
        projectId: project.id, 
        members: JSON.stringify(members)
      }
    });
  }, [router, project.id, members]);

  // Verifică dacă user-ul poate adăuga task-uri
  const canAddTasks = useMemo(() => 
    user?.role !== USER_ROLES.DEVELOPER,
    [user?.role]
  );

  return (
    <View style={styles.tasksContainer}>
      <View style={styles.tasksHeader}>
        <Text style={textPresets.headerLarge}>Tasks:</Text>
        
        <View style={styles.headerActions}>
          <TaskSort 
            type="tasks" 
            selectedSort={sortMethod} 
            onSortChange={setSortMethod} 
          />
          
          {canAddTasks && (
            <TouchableOpacity
              onPress={handleAddTask}
              style={styles.addButton}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <TaskList 
        tasks={tasks} 
        projectId={project.id}
        onTaskUpdate={onTaskUpdate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tasksContainer: {
    padding: 12,
    paddingTop: 20,
    backgroundColor: colors.background.primary,
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addButton: {
    padding: 4,
  },
});

export default React.memo(ProjectTasks);