import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, router } from 'expo-router';
import { useProjects, useTasks } from '@contexts';
import { getProjectById, updateProject, deleteProject } from '@api/projects';
import { CustomInput, LabeledPicker, SelectDeadlineInput, CustomButton, CategoryModal } from '@components';
import { colors } from '@theme';

// 1️⃣ Definirea schemei Zod
const projectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category_id: z.number().int('Select a valid category'),
  deadline: z.string().optional(),
  status: z.enum(['new', 'in_progress', 'completed']).optional(),
});

const EditProjectScreen = () => {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { categories, addCategoryToContext, updateProjectInContext, deleteProjectFromContext } = useProjects();
  const { tasks } = useTasks();

  const [editedProject, setEditedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);

  // 2️⃣ React Hook Form setup
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      category_id: null,
      deadline: '',
      status: 'new',
    },
  });

  // 3️⃣ Încarcă proiectul
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

        // Setăm valorile în form
        setValue('name', projectData.name);
        setValue('description', projectData.description);
        setValue('category_id', projectData.category_id);
        setValue('deadline', projectData.deadline || '');
        setValue('status', projectData.status);

      } catch (error) {
        console.error('Error loading project:', error);
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
    const currentTasks = tasks.filter((task) => task.project_id === editedProject.id);
    const incompleteTask = currentTasks.some((task) => task.status !== 'completed');

    if (incompleteTask) {
      Alert.alert(
        'Project not completed',
        'Project status cannot be set to completed because there are incomplete tasks in this project.'
      );
      return false;
    }

    return true;
  };

  const handleSave = async (data) => {
    try {
      if (data.status === 'completed' && !checkCompleted()) return;

      const updatedProject = { ...editedProject, ...data, updated_at: new Date().toISOString() };
      await updateProject(updatedProject);

      updateProjectInContext(updatedProject);
      Alert.alert('Success', 'Project updated successfully');
      router.replace({ pathname: `/view/${editedProject.id}` });

    } catch (error) {
      console.error('Error updating project:', error);
      Alert.alert('Error', 'Failed to update project');
    }
  };

  const confirmDelete = () => {
    Alert.alert('Are you sure?', 
      'All project data including tasks will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: handleDelete },
      ]
    );
  };

  const handleDelete = async () => {
    try {
      await deleteProject(editedProject.id);
      deleteProjectFromContext(editedProject.id);
      Alert.alert('Success', 'Project deleted successfully');
      router.replace('/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      Alert.alert('Error', 'Failed to delete project');
    }
  };

  // --- Picker items memorate ---
  const pickerItems = useMemo(() => [
    { label: 'Add New Category', value: 'add_new' },
    ...categories.map(cat => ({ label: cat.title, value: cat.id }))
  ], [categories]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading project...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Name */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <CustomInput
            label="Name"
            value={value}
            onChangeText={onChange}
            placeholder="Project Name"
            error={errors.name?.message}
          />
        )}
      />

      {/* Description */}
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <CustomInput
            label="Description"
            value={value}
            onChangeText={onChange}
            placeholder="Project Description"
            multiline
            error={errors.description?.message}
          />
        )}
      />

      {/* --- Category --- */}
      <Controller
        control={control}
        name="category_id"
        render={({ field: { onChange, value } }) => (
          <LabeledPicker
            label="Category"
            selectedValue={value}
            onValueChange={(val) => val === 'add_new'
              ? setCategoryModalVisible(true)
              : onChange(val)
            }
            items={pickerItems}
            placeholder="Select Category"
            error={errors.category_id?.message}
          />
        )}
      />

      {/* Deadline */}
      <Controller
        control={control}
        name="deadline"
        render={({ field: { onChange, value } }) => (
          <SelectDeadlineInput
            deadline={value || ''}
            onChange={onChange}
          />
        )}
      />

      {/* Save/Delete buttons */}
      <CustomButton title="Save Changes" type="primary" onPress={handleSubmit(handleSave)} />
      <CustomButton title="Delete Project" type="delete" onPress={confirmDelete} />

      {/* Add Category Modal */}
      <CategoryModal
        isVisible={isCategoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        onCategoryAddedOrUpdated={(category) => setValue('category_id', category.id)}
      />
    </ScrollView>
  );
};

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

export default EditProjectScreen;