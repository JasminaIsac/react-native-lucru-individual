import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, router } from 'expo-router';
import { useProjects, useTasks } from '@contexts/index';
import { getProjectById, updateProject, deleteProject } from '@api/projects';
import { CustomInput, LabeledPicker, SelectDeadlineInput, CustomButton, CategoryModal } from '@components/index';
import { colors } from '@theme/colors';

// 1️⃣ Schema
const projectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category_id: z.number().int('Select a valid category'),
  deadline: z.string().optional(),
  status: z.enum(['new', 'in_progress', 'completed']).optional(),
});

export default function EditProjectScreen () {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { categories, updateProjectInContext, deleteProjectFromContext } = useProjects();
  const { tasks } = useTasks();

  const [editedProject, setEditedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);

  // 2️⃣ RHF Setup
  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      category_id: null,
      deadline: '',
      status: 'new',
    },
  });

  // 3️⃣ Load project
  useEffect(() => {
    if (!id) {
      Alert.alert('Error', 'Project ID is missing');
      router.back();
      return;
    }

    const loadProject = async () => {
      setLoading(true);
      try {
        const projectData = await getProjectById(id);
        setEditedProject(projectData);

        setValue('name', projectData.name);
        setValue('description', projectData.description);
        setValue('category_id', projectData.category_id);
        setValue('deadline', projectData.deadline || '');
        setValue('status', projectData.status);

      } catch (err) {
        Alert.alert('Error', 'Failed to load project');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  // 4️⃣ Check tasks before marking completed
  const checkCompleted = () => {
    const currentTasks = tasks.filter((t) => t.project_id === editedProject.id);
    return !currentTasks.some((t) => t.status !== 'completed');
  };

  const handleSave = async (data) => {
    if (data.status === 'completed' && !checkCompleted()) {
      Alert.alert(
        'Project not completed',
        'You cannot set the project as completed because some tasks are not completed.'
      );
      return;
    }

    try {
      const updatedProject = { ...editedProject, ...data, updated_at: new Date().toISOString() };
      await updateProject(updatedProject);

      updateProjectInContext(updatedProject);
      Alert.alert('Success', 'Project updated successfully');
      router.replace(`view/${editedProject.id}`);

    } catch (err) {
      Alert.alert('Error', 'Failed to update project');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProject(editedProject.id);
      deleteProjectFromContext(editedProject.id);
      Alert.alert('Success', 'Project deleted successfully');
      router.replace('../');
    } catch (err) {
      Alert.alert('Error', 'Failed to delete project');
    }
  };

  // Picker Items
  const pickerItems = useMemo(() => [
    { label: 'Add New Category', value: 'add_new' },
    ...categories.map(c => ({ label: c.title, value: c.id }))
  ], [categories]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading project...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* Name */}
      <CustomInput
        name="name"
        control={control}
        label="Name"
        placeholder="Project Name"
        error={errors.name?.message}
      />

      {/* Description */}
      <CustomInput
        name="description"
        control={control}
        label="Description"
        placeholder="Project Description"
        multiline
        error={errors.description?.message}
      />

      {/* Category */}
      <LabeledPicker
        name="category_id"
        control={control}
        label="Category"
        placeholder="Select Category"
        items={pickerItems}
        error={errors.category_id?.message}
        onValueChange={(val) => {
          if (val === 'add_new') setCategoryModalVisible(true);
          else setValue("category_id", val);
        }}
      />

      {/* Deadline */}
      <SelectDeadlineInput
        name="deadline"
        control={control}
      />

      {/* Buttons */}
      <CustomButton title="Save Changes" type="primary" onPress={handleSubmit(handleSave)} />
      <CustomButton title="Delete Project" type="delete" onPress={() =>
        Alert.alert('Confirm', 'Delete this project?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: handleDelete },
        ])
      } />

      <CategoryModal
        isVisible={isCategoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        onCategoryAddedOrUpdated={(cat) => setValue("category_id", cat.id)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'#fff',
    },
    contentContainer: {
      padding: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: colors.text.secondary,
    },
  });
