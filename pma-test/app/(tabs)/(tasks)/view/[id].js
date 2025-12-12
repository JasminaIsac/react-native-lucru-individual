import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useSearchParams } from 'expo-router';

import { CustomButton, Tag } from '@components/index';
import { useAuth } from '@contexts/index';
import { getTaskById, updateTaskStatus } from '@api/tasks';
import { getUserById } from '@api/users';
import { getProjectById } from '@api/projects';
import { textPresets, colors } from '@theme/index';
import { getPriorityTagData, getStatusTagData } from '@utils/index';
import { STATUS_OPTIONS } from '@constants/index';

const ViewTaskScreen = () => {
  const router = useRouter();
  const params = useSearchParams();
  const taskId = params.id; // luam doar ID-ul din ruta

  const { currentUser } = useAuth();
  const { userData: user } = currentUser;

  const [task, setTask] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [assignedUser, setAssignedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTaskData = async () => {
    try {
      const fetchedTask = await getTaskById(taskId);
      setTask(fetchedTask);

      const project = await getProjectById(fetchedTask.project_id);
      setProjectName(project.name);

      if (fetchedTask.assigned_to) {
        const assigned = await getUserById(fetchedTask.assigned_to);
        setAssignedUser(assigned);
      }
    } catch (error) {
      console.error('Error fetching task data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskData();
  }, [taskId]);

  const handleTaskStatusChange = async (newStatus) => {
    try {
      await updateTaskStatus(task.id, newStatus);
      fetchTaskData();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  if (loading || !task) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const deadline = task.deadline ? new Date(task.deadline).toDateString().split(' ').slice(1, 3).join(', ') : 'Not set';
  const statusData = getStatusTagData(task.status);
  const priorityData = getPriorityTagData(task.priority);

  const formattedCreatedAt = task.created_at ? new Date(task.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not set';
  const formattedUpdatedAt = task.updated_at ? new Date(task.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not set';

  return (
    <LinearGradient 
      colors={colors.violetBlueGradient} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
        <View style={styles.taskDetails}>
          <View style={styles.taskDetailsLeft}>
            <Tag title={projectName} backgroundColor={colors.lightBlue} textColor={colors.darkBlue}/>
            <Text style={[textPresets.headerLarge, {color: colors.white, marginTop: 10}]}>{task.title}</Text>
            <View style={styles.tagsContainer}>
              <Tag title={statusData.label} backgroundColor={statusData.color} textColor={"#fff"}/>
              <Tag title={priorityData.title} backgroundColor={priorityData.color} textColor={"#fff"}/>
            </View>
            <View style={styles.membersContainer}>
              <Ionicons name="person" size={16} color={colors.lightOrange} />
              {assignedUser && <Text style={[textPresets.bodyMedium, {color:colors.lightOrange}]}>{assignedUser.name}</Text>}
            </View>
            <View style={{flexDirection: 'column', alignItems: 'flex-start', gap: 3}}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                <Ionicons name="time" size={14} color={colors.lightBlue} />
                <Text style={[textPresets.bodySmallBold, {color: colors.lightBlue}]}>Created: <Text style={textPresets.bodySmall}> {formattedCreatedAt}</Text></Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                <Ionicons name="time" size={14} color={colors.lightBlue} />
                <Text style={[textPresets.bodySmallBold, {color: colors.lightBlue}]}>Last Updated: <Text style={textPresets.bodySmall}> {formattedUpdatedAt}</Text></Text>
              </View>
            </View>
          </View>
          <View style={styles.taskDetailsRight}>
            <Ionicons name="time" size={42} color={colors.white} />
            <Text style={[textPresets.bodyLargeBold, {color: colors.white, textAlign: 'right'}]}>
              {deadline}
            </Text>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={textPresets.headerMedium}>Description</Text>
          {task.description ? <Text style={textPresets.bodyMedium}>{task.description}</Text> : <Text style={[textPresets.noData, {marginTop: 6, color: colors.text.secondary}]}>No description</Text>}
          {user.role === 'developer' && user.id === task.assigned_to && (
            <View style={{ flexDirection: 'column', width: '100%', marginTop: 20 }}>
              {task.status === 'completed' ? (
                <CustomButton
                  title="Completed"
                  type="disabled"
                  disabled={true}
                />
              ) : (
                STATUS_OPTIONS[task.status]?.map(({ title, status, color }) => (
                  <CustomButton
                    key={status}
                    title={title}
                    type="primary"
                    onPress={() => handleTaskStatusChange(status)}
                    style={{ backgroundColor: color }}
                  />
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  taskDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 20,
  },
  taskDetailsLeft: {
    flex: 3,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  membersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  descriptionContainer: {
    flex: 1,
    flexDirection: 'column', 
    alignItems: 'flex-start', 
    justifyContent: 'flex-start', 
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  taskDetailsRight: {
    flex: 1, 
    alignSelf: 'flex-end', 
    alignItems: 'center',
    flexDirection: 'column', 
    gap: 5,
  },
});

export default ViewTaskScreen;
