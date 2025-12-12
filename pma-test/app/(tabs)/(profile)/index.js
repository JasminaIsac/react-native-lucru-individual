import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet,  TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '@contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { textPresets, colors } from '@theme/index';
import { CustomButton, UserDetails, UserAvatar } from '@components/index';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const navigation = useNavigation();
  const router = useRouter();

  React.useLayoutEffect(() => {
    if (user) {
      navigation.setOptions({
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
            <TouchableOpacity onPress={() => router.push('/edit')}>
              <Ionicons
                name="pencil"
                size={22}
                color="black"
                style={{ marginRight: 15 }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/settings')}>
              <Ionicons
                name="settings-outline"
                size={22}
                color="black"
                style={{ marginRight: 15 }}
              />
            </TouchableOpacity>
          </View>
        ),
      });
    }
  }, [user]);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
        try {
          await logout();
        } catch (error) {
          console.error('Error logging out:', error);
        }
      } },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={[textPresets.noData, { color: colors.text.error }]}>No user is logged in.</Text>
      </View>
    );
  }
  
  return (
    <>
    <View style={styles.container}>
      <UserAvatar
        uri={user.avatarUrl}
        name={user.name}
      />
      <UserDetails user={user} />
      <CustomButton title="Logout" type="delete" onPress={handleLogout} style={styles.logoutButton} />
    </View>
    </>
  );
};
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 20,
    paddingTop: 0,
    backgroundColor: colors.background.secondary,
  },
  logoutButton: {
    marginTop: 20,
  },
});
  
  export default ProfileScreen;