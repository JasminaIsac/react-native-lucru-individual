import React, { useEffect, useState, useMemo } from 'react';
import { Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { 
  addProjectMember, 
  removeProjectMember, 
  getProjectById, 
  getProjectMembers,
} from '@api/projects';
import { getProjectTasksCountByUserId } from '@api/tasks';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUsers } from '@contexts/index';
import { colors, textPresets } from '@theme/index';
import { CustomButton, LabeledPicker } from '@components/index';
import { MemberCard } from '@components/index';
import { USER_ROLES } from '@constants/index';

export default function ProjectMemberScreen() {
  const router = useRouter();
  const { id: projectId } = useLocalSearchParams();
  const { users } = useUsers();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');

  // Fetch project & members
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projData, membersData] = await Promise.all([
          getProjectById(projectId),
          getProjectMembers(projectId)
        ]);
        setProject(projData);
        setMembers(membersData);
        await refreshTaskCounts(membersData);
      } catch (err) {
        console.error('Failed to fetch project data:', err);
      }
    };
    fetchData();
  }, [projectId]);

  // Filter users who are not already members
  const filteredUsers = useMemo(() => 
    users.filter(user => !members.some(member => member.user_id === user.id)), 
    [users, members]
  );

  const refreshTaskCounts = async (membersList = members) => {
    const counts = {};
    await Promise.all(
      membersList.map(async (member) => {
        const { count } = await getProjectTasksCountByUserId(projectId, member.user_id);
        counts[member.user_id] = count;
      })
    );
    setTaskCounts(counts);
  };

  const getUserTaskCount = (userId) => taskCounts[userId] || 0;

  const refreshMembers = async () => {
    const data = await getProjectMembers(projectId);
    setMembers(data);
    await refreshTaskCounts(data);
  };

  const handleAdd = async () => {
    if (!selectedUser || !selectedRole) {
      setError('Please select both a user and a role.');
      return;
    }
    try {
      await addProjectMember(projectId, selectedUser, selectedRole);
      Alert.alert('Success', 'User added successfully');
      setSelectedUser(null);
      setSelectedRole('');
      setError('');
      await refreshMembers();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to add member.');
    }
  };

  const handleRemoveMember = (userId) => {
    if (!project) return;

    if (project.manager_id === userId) {
      Alert.alert('Error', 'You cannot remove the project manager.');
      return;
    }
    if (getUserTaskCount(userId) > 0) {
      Alert.alert('Error', 'You cannot remove a member with assigned tasks.');
      return;
    }

    Alert.alert('Confirm', 'Are you sure you want to remove this member?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', onPress: () => handleRemove(userId) },
    ]);
  };

  const handleRemove = async (userId) => {
    try {
      await removeProjectMember(projectId, userId);
      Alert.alert('Success', 'Member removed successfully');
      await refreshMembers();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to remove member.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LabeledPicker
        label="Select User"
        selectedValue={selectedUser}
        onValueChange={setSelectedUser}
        placeholder="Select User"
        items={filteredUsers.map(user => ({ label: user.name, value: user.id }))}
        error={error}
      />

      <LabeledPicker
        label="Select Role"
        selectedValue={selectedRole}
        onValueChange={setSelectedRole}
        placeholder="Select Role"
        items={[
          { label: 'Developer', value: USER_ROLES.DEVELOPER },
          { label: 'ProjectManager', value: USER_ROLES.MANAGER },
        ]}
        error={error}
      />

      <CustomButton onPress={handleAdd} title="Add Member" type="primary" />
      <CustomButton onPress={() => router.back()} title="Cancel" type="secondary" />

      <Text style={[styles.title, textPresets.headerMedium]}>Current Members</Text>
      {project && members
        .sort((a, b) => {
          const rolePriority = { admin: 0, manager: 1, developer: 2 };
          return (rolePriority[a.user_role] ?? 99) - (rolePriority[b.user_role] ?? 99);
        })
        .map(member => (
          <MemberCard
            key={member.user_id}
            member={member}
            onRemove={() => handleRemoveMember(member.user_id)}
            taskCount={getUserTaskCount(member.user_id)}
            isAdmin={project.manager_id === member.user_id}
          />
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background.primary,
    flexGrow: 1,
  },
  title: {
    marginTop: 30,
    textAlign: 'center',
  },
});
