import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getUserById } from '@api/users';
import { getUserProjects } from '@api/projects';
import { ProjectsList, UserDetails } from '@components/index';
import { colors, textPresets } from '@theme/index';

const ViewUserScreen = () => {
  const router = useRouter();
  const params = useSearchParams();
  const userId = params.id; // id-ul user-ului din cale

  const [user, setUser] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserAndProjects = async () => {
    try {
      setLoading(true);
      const freshUser = await getUserById(userId);
      setUser(freshUser);

      const projects = await getUserProjects(userId);
      setUserProjects(projects);
    } catch (error) {
      console.error('Error fetching user or projects:', error);
      Alert.alert('Error', 'Failed to load user data');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndProjects();
  }, [userId]);

  // Header Right pentru editare
  useEffect(() => {
    if (!user) return;

    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          name="pencil"
          size={24}
          color={colors.darkBlue}
          style={{ marginRight: 15 }}
          onPress={() => router.push(`edit/${user.id}`)}
        />
      ),
    });
  }, [user, navigation, router]);

  if (loading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.darkBlue }}>
        <ActivityIndicator size="large" color={colors.lightBlue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UserDetails user={user} textColor={colors.lightBlue} style={{ padding: 20 }} />

      <View style={styles.projectsContainer}>
        <Text style={[textPresets.headerMedium, { color: colors.primary, marginBottom: 10 }]}>
          Projects Involved In
        </Text>
        <View style={{ marginBottom: 100 }}>
          <ProjectsList projects={userProjects} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBlue,
  },
  projectsContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 160,
  },
});

export default ViewUserScreen;
