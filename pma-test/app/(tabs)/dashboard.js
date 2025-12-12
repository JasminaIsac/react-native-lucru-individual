import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useProjects } from '@contexts/index';
import { colors, textPresets } from '@theme/index';
import { ProjectsList, TodayProgress } from '@components/index';
import { formatDateWithSuffix } from '@utils/index';

export default function Dashboard() {
  const { projects, loading } = useProjects(); 
  
  const safeProjects = projects || [];
  
  const [inProgressProjects, setInProgressProjects] = useState([]);
  const navigation = useNavigation();
  const today = formatDateWithSuffix(new Date());

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.headerRight}>
          <Text style={[textPresets.bodyMediumBold, { color: colors.text.accentOrange, marginRight: 8 }]}>
            {today}
          </Text>
          <Ionicons name="calendar-outline" size={24} color={colors.mediumOrange} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, today]);

  useEffect(() => {
    const filtered = safeProjects
      .filter((project) => project.status === 'in progress')
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 4);
    setInProgressProjects(filtered);
  }, [safeProjects]);

  if (loading) {
    return (
      <View style={styles.fullScreenCenter}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10 }}>Loading data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TodayProgress />
      <Text style={[textPresets.headerLarge, { paddingLeft: 8 }]}>
        Continue with your projects:
      </Text>
      <ProjectsList projects={inProgressProjects} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 20, 
    backgroundColor: colors.background.secondary,
    paddingBottom: 0,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
});