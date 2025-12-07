import React, { useState, useMemo, useCallback, useLayoutEffect } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useProjects, useAuth } from '@contexts';
import { colors } from '@theme';
import { ProjectsList, TaskSort, FilterSelect, CategorySelect, CustomButton } from '@components';
import { sortTasks } from '@utils';

const AllProjectsScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { projects, categories } = useProjects();
  const { currentUser } = useAuth();
  const { userData } = currentUser;

  const [sortMethod, setSortMethod] = useState('status');
  const [filter, setFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Header buttons memoizate
  const HeaderRightButtons = useCallback(() => {
    if (userData?.role === 'developer') return null;

    return (
      <View style={styles.headerRight}>
        <TouchableOpacity 
          onPress={() => router.push('/(tabs)/(projects)/add')} 
          style={styles.addButton}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color={colors.darkBlue} />
        </TouchableOpacity>
        <CustomButton
          title="Categories"
          style={styles.categoriesButton}
          onPress={() => router.push('/(tabs)/(projects)/categories')}
        />
      </View>
    );
  }, [router, userData?.role]);

  // Setează header-ul
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: HeaderRightButtons,
    });
  }, [navigation, HeaderRightButtons]);

  // Filter + sort projects memoized
  const sortedProjects = useMemo(() => {
    let filtered = projects;

    // Filter by status
    if (filter && filter !== 'all') {
      filtered = filtered.filter(p => p.status?.toLowerCase() === filter.toLowerCase());
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category_id === selectedCategory);
    }

    // Sort
    return sortTasks(filtered, sortMethod);
  }, [projects, filter, selectedCategory, sortMethod]);

  // Memoized callbacks for children
  const handleSortChange = useCallback((value) => {
    setSortMethod(value);
  }, []);

  const handleFilterChange = useCallback((value) => {
    setFilter(value);
  }, []);

  const handleCategoryChange = useCallback((value) => {
    setSelectedCategory(value);
  }, []);

  return (
    <View style={styles.container}>
      {/* Filters Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersBar}
        contentContainerStyle={styles.filtersContent}
      >
        <TaskSort 
          type="project" 
          selectedSort={sortMethod} 
          onSortChange={handleSortChange} 
        />
        <CategorySelect
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        <FilterSelect 
          type="project" 
          selectedFilter={filter} 
          onFilterChange={handleFilterChange} 
        />
      </ScrollView>

      {/* Projects List */}
      <ProjectsList projects={sortedProjects} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  addButton: {
    marginRight: 10,
    padding: 4,
  },
  categoriesButton: {
    height: 40,
    elevation: 0,
  },
  filtersBar: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  filtersContent: {
    alignItems: 'center',
    gap: 8,
  },
});

export default AllProjectsScreen;