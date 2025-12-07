  // screens/AddProjectMemberScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { getAllUsers, addProjectMember } from '@api';

const AddUserToProject = ({ navigation, route }) => {
  const { projectId } = route.params;

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const [taskCounts, setTaskCounts] = useState({});

  useEffect(() => {
    getAllUsers()
      .then(data => setUsers(data.map(user => ({ label: user.name, value: user.id }))))
      .catch(console.error);
  }, []);

  const handleAdd = async () => {
    try {
      if (!selectedUser || !selectedRole) {
        alert('Please select both a user and a role.');
        return;
      }

      await addProjectMember({
        projectId,
        userId: selectedUser,
        role: selectedRole,
      });

      navigation.goBack();
    } catch (err) {
      console.error(err);
      alert('Failed to add member.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Member to Project</Text>

      <DropDownPicker
        open={userDropdownOpen}
        setOpen={setUserDropdownOpen}
        items={users}
        value={selectedUser}
        setValue={setSelectedUser}
        placeholder="Select User"
        style={styles.dropdown}
      />

      <DropDownPicker
        open={roleDropdownOpen}
        setOpen={setRoleDropdownOpen}
        items={[
          { label: 'Developer', value: 'developer' },
          { label: 'Manager', value: 'manager' },
        ]}
        value={selectedRole}
        setValue={setSelectedRole}
        placeholder="Select Role"
        style={styles.dropdown}
      />

      <Button title="Add Member" onPress={handleAdd} />
      <Button title="Cancel" onPress={() => navigation.goBack()} color="gray" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  dropdown: { marginBottom: 20, zIndex: 1000 },
});

export default AddUserToProject;
