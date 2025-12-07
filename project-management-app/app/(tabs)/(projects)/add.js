import React, { useState, useMemo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProjects, useAuth } from '@contexts';
import { CustomButton, CustomInput, LabeledPicker, SelectDeadlineInput, CategoryModal } from '@components';
import { colors } from '@theme';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addProject } from '@api/projects';

// --- SCHEMA ZOD ---
const projectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().optional(),
  category_id: z.number({ invalid_type_error: 'Category is required' }),
  deadline: z.string().optional(),
});

export default function AddProjectForm() {
  const router = useRouter();
  const { categories, addProjectToContext, loading } = useProjects();
  const { currentUser } = useAuth();
  const { userData } = currentUser;

  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);

  // RHF + Zod
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      category_id: '',
      deadline: '',
    },
    resolver: zodResolver(projectSchema),
  });

  // Restricție rol
  if (userData.role !== 'admin' && userData.role !== 'root') {
    router.back();
  }

  // --- MEMOIZED PICKER ITEMS ---
  const pickerItems = useMemo(() => [
    { label: 'Add New Category', value: 'add_new' },
    ...categories.map(cat => ({ label: cat.title, value: cat.id }))
  ], [categories]);

  // --- SUBMIT FORM ---
  const onSubmit = async (data) => {
    if (loading) return;

    // format deadline
    let deadline = data.deadline?.trim();
    if (deadline && /^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
      deadline = `${deadline} 00:00:00`;
    }

    try {
      const projectData = {
        ...data,
        manager_id: userData.id,
        deadline,
      };

      const addedProject = await addProject(projectData);
      addProjectToContext(addedProject);

      router.push(`/(tabs)/(projects)/view/${addedProject.id}`);
    } catch (error) {
      console.error('Error adding project:', error);
      Alert.alert('Error', 'Failed to add project');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 15 }}>
          {/* --- Project Name --- */}
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <CustomInput
                value={value}
                label="Project Title"
                placeholder="Project name..."
                onChangeText={onChange}
                error={errors.name?.message}
              />
            )}
          />

          {/* --- Category Picker --- */}
          {loading ? (
            <ActivityIndicator size="large" color={colors.darkBlue} />
          ) : (
            <Controller
              control={control}
              name="category_id"
              render={({ field: { value, onChange } }) => (
                <LabeledPicker
                  label="Category"
                  selectedValue={value}
                  onValueChange={(val) => {
                    if (val === 'add_new') {
                      setCategoryModalVisible(true);
                    } else {
                      onChange(val);
                    }
                  }}
                  items={pickerItems}
                  placeholder="Select category"
                  error={errors.category_id?.message}
                />
              )}
            />
          )}

          {/* --- Project Description --- */}
          <Controller
            control={control}
            name="description"
            render={({ field: { value, onChange } }) => (
              <CustomInput
                value={value}
                label="Project Description"
                placeholder="Project description..."
                multiline
                onChangeText={onChange}
                error={errors.description?.message}
              />
            )}
          />

          {/* --- Deadline --- */}
          <Controller
            control={control}
            name="deadline"
            render={({ field: { value, onChange } }) => (
              <SelectDeadlineInput
                deadline={value}
                onChange={onChange}
                error={errors.deadline?.message}
              />
            )}
          />

          {/* --- Submit Button --- */}
          <CustomButton
            title="Create"
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          />

          {/* --- Add Category Modal --- */}
          <CategoryModal
            isVisible={isCategoryModalVisible}
            onClose={() => setCategoryModalVisible(false)}
            onCategoryAddedOrUpdated={(category) => setValue('category_id', category.id)}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background.primary,
  },
});
