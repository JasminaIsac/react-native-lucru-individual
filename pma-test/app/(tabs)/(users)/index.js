import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useUsers } from '@contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { UserCard } from '@components/index';
import { colors, textPresets } from '@theme/index';
import { sortUsersByRole } from '@utils/index';

const AllUsersScreen = () => {
  const router = useRouter();
  const { users } = useUsers();
  const sortedUsers = sortUsersByRole(users);

  const handleUserClick = (user) => {
    // Navighează la pagina View User cu parametrii userului
    router.push({ pathname: '/users/view', params: { userId: user.id } });
  };

  const handleAddUser = () => {
    router.push('/users/add');
  };

  return (
    <View style={styles.layout}>
      <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
        <Ionicons name="add" size={24} color="white" />
        <Text style={{ color: 'white', marginLeft: 5 }}>Add User</Text>
      </TouchableOpacity>

      {sortedUsers.length > 0 ? (
        <FlatList
          data={sortedUsers}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <UserCard
              user={item}
              onPress={() => handleUserClick(item)}
            />
          )}
        />
      ) : (
        <Text style={[textPresets.noData, { color: colors.text.secondary, marginTop: 50 }]}>
          No users
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background.secondary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkBlue,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
});

export default AllUsersScreen;
