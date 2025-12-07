import React, { useState } from 'react';
import { StyleSheet, Alert, ScrollView, Text, View } from 'react-native';
import { colors, textPresets } from '@theme';
import { useProjects, useAuth } from '@contexts';
import { addCategory, updateCategory, deleteCategory } from '@api/categories';
import { CustomButton, CategoryModal, CategoryCard } from '@components';

const CategoriesScreen = () => {
  const {
    categories,
    projects,
    addCategoryToContext,
    updateCategoryInContext,
    removeCategoryFromContext
  } = useProjects();

  const { currentUser } = useAuth();
  const { userData: { role: currentUserRole } } = currentUser;

  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // --- Unified handler for add/edit ---
  const handleSaveCategory = async (category) => {
    try {
      if (selectedCategory) {
        // Editing
        await updateCategory(category.id, { title: category.title });
        updateCategoryInContext(category.id, { title: category.title });
        Alert.alert('Success', 'Category updated successfully');
      } else {
        // Adding
        const newCategory = await addCategory({ title: category.title });
        addCategoryToContext(newCategory);
        Alert.alert('Success', 'Category added successfully');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', selectedCategory ? 'Failed to update category' : 'Failed to add category');
    } finally {
      setIsCategoryModalVisible(false);
      setSelectedCategory(null);
    }
  };

  const handleRemoveCategory = (category) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => confirmDelete(category.id) },
      ]
    );
  };

  const confirmDelete = async (id) => {
    try {
      await deleteCategory(id);
      removeCategoryFromContext(id);
      Alert.alert('Success', 'Category deleted successfully');
    } catch (error) {
      if (error.response?.status === 404) {
        Alert.alert('Error', 'Category not found');
      } else if (error.response?.status === 400) {
        Alert.alert('Cannot delete category', 'Category is associated with projects');
      } else {
        console.error('Unexpected error:', error);
        Alert.alert('Error', 'Failed to delete category');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={textPresets.headerLarge}>All Categories</Text>

      <View style={styles.categoryList}>
        {categories?.map((category) => {
          const projectCount = projects.filter(
            (project) => project.category_id === category.id
          ).length;

          return (
            <CategoryCard
              key={category.id}
              category={category}
              projectCount={projectCount}
              onRemove={() => handleRemoveCategory(category)}
              onEdit={() => {
                setSelectedCategory(category);
                setIsCategoryModalVisible(true);
              }}
              currentUserRole={currentUserRole}
            />
          );
        })}
      </View>

      {/* --- Add/Edit Category Modal --- */}
      <CategoryModal
        isVisible={isCategoryModalVisible}
        onClose={() => {
          setIsCategoryModalVisible(false);
          setSelectedCategory(null);
        }}
        onCategoryAddedOrUpdated={handleSaveCategory}
        initialCategoryName={selectedCategory?.title || ''}
        isEditing={!!selectedCategory}
      />

      <CustomButton
        title="Add Category"
        type="primary"
        onPress={() => {
          setSelectedCategory(null);
          setIsCategoryModalVisible(true);
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background.primary,
    flexGrow: 1,
  },
  categoryList: {
    marginTop: 10,
    marginBottom: 20,
  },
});

export default CategoriesScreen;