import React, { useState, useMemo, useCallback, useLayoutEffect } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import { useProjects, useAuth } from '@contexts/index';
import { colors } from '@theme/colors';
import { ProjectsList, TaskSort, FilterSelect, CategorySelect, CustomButton } from '@components/index';
import { sortTasks } from '@utils/index';
import { USER_ROLES } from '@constants/index';

const AllProjectsScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { projects, categories } = useProjects();
  const { user } = useAuth();
  const [sortMethod, setSortMethod] = useState('status');
  const [filter, setFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // // Set header buttons
  // useLayoutEffect(() => {
  //   if (user?.role === USER_ROLES.DEVELOPER) return;

  //   navigation.setOptions({
  //     headerRight: () => (
  //       <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
  //         <TouchableOpacity 
  //           onPress={() => router.push('add')} 
  //           style={{ marginRight: 10, padding: 4 }}
  //           activeOpacity={0.7}
  //         >
  //           <Ionicons name="add" size={24} color={colors.darkBlue} />
  //         </TouchableOpacity>
  //         <CustomButton
  //           title="Categories"
  //           style={{ height: 40, elevation: 0 }}
  //           onPress={() => router.push('categories')}
  //         />
  //       </View>
  //     ),
  //   });
  // }, [navigation, user?.role, router]);

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
    paddingHorizontal: 16,
    paddingTop: 20,
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
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
});

export default AllProjectsScreen;