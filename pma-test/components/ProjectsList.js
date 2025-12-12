import React from 'react';
import { FlatList, Text, StyleSheet, View } from 'react-native';
import ProjectCard from './ProjectCard';
import { colors, textPresets } from '@theme/index';
import { useProjects } from '@contexts/index';
import { useRouter } from 'expo-router';

const ProjectsList = ({ style, projects }) => {
  const { categories } = useProjects();

  const router = useRouter();

  const handleProjectClick = (projectId) => {
    router.push(`/(tabs)/(projects)/view/${projectId}`);
  };

  return (
    <FlatList
      style={style}
      showsVerticalScrollIndicator={false}
      data={projects}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ flexDirection: 'column', justifyContent: 'flex-start' }}
      renderItem={({ item }) => (
        <ProjectCard
          key={item.id}
          item={item}
          onPress={() => handleProjectClick(item.id)}
          categories={categories}
        />
      )}
      ListEmptyComponent={<Text style={[textPresets.noData, styles.noProjects]}>No projects found.</Text>}
      ListFooterComponent={<View style={{ height: 30 }} />}
    />
  );
};

const styles = StyleSheet.create({
  noProjects: {
    color: colors.text.secondary,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default ProjectsList;
