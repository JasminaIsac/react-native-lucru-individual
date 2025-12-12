import React, { useEffect, useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, StyleSheet, View, Text, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, useSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addTask } from '@api/tasks';
import { getProjectById } from '@api/projects';
import { useTasks } from '@contexts/index';
import { CustomInput, CustomButton, LabeledPicker, SelectDeadlineInput } from '@components/index';
import { colors, textPresets } from '@theme/index';

// --- Zod schema pentru task ---
const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low'], { required_error: 'Priority is required' }),
  assigned_to: z.string().min(1, 'Assigned developer is required'),
  deadline: z.string().optional(),
});

export default function AddTaskScreen() {
  const params = useLocalSearchParams(); // expo-router
  const projectId = params.projectId;
  const router = useRouter();

  const { addTaskToContext } = useTasks();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]); // Ar trebui să primești din params sau API

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      assigned_to: '',
      deadline: '',
    },
  });

  // --- Fetch project info ---
useEffect(() => {
  const fetchMembers = async () => {
    try {
      const proj = await getProjectById(projectId);
      let membersList = proj.members || [];

      if (!membersList || membersList.length === 0) {
        const fetchedMembers = await getProjectMembers(projectId);
        membersList = fetchedMembers || [];
      }

      setProject(proj);
      setMembers(membersList);
    } catch (error) {
      console.error('Error fetching project or members:', error);
    }
  };

  fetchMembers();
}, [projectId]);

  // --- Submit handler ---
  const onSubmit = async (data) => {
    try {
      let deadline = data.deadline?.trim();
      if (deadline && /^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
        deadline = `${deadline} 00:00:00`;
      }

      const taskData = { ...data, project_id: projectId, deadline };
      const addedTask = await addTask(taskData);
      addTaskToContext(addedTask);

      Alert.alert('Success', 'Task added successfully');
      reset(); 
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add task');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Task Title"
              value={value}
              onChangeText={onChange}
              placeholder="Task name..."
              error={errors.title?.message}
            />
          )}
        />

        {project && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Text style={textPresets.headerSmall}>Project:</Text>
            <Text style={[textPresets.bodyMediumBold, { color: colors.text.accentOrange }]}>
              {project.name}
            </Text>
          </View>
        )}

        {members.filter(m => m.user_role === 'developer').length === 0 ? (
          <Text style={[textPresets.noData, { color: colors.text.secondary, marginBottom: 10 }]}>
            No developers in this project.
          </Text>
        ) : (
          <Controller
            control={control}
            name="assigned_to"
            render={({ field: { onChange, value } }) => (
              <LabeledPicker
                label="Developer"
                selectedValue={value}
                placeholder="Select developer"
                onValueChange={onChange}
                items={members.filter(u => u.user_role === 'developer')
                  .map(u => ({ label: u.name, value: u.user_id }))}
                error={errors.assigned_to?.message}
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="priority"
          render={({ field: { onChange, value } }) => (
            <LabeledPicker
              label="Priority"
              selectedValue={value}
              placeholder="Select priority"
              onValueChange={onChange}
              items={[
                { label: 'High', value: 'high' },
                { label: 'Medium', value: 'medium' },
                { label: 'Low', value: 'low' },
              ]}
              error={errors.priority?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Description"
              value={value}
              onChangeText={onChange}
              placeholder="Task description..."
              multiline
            />
          )}
        />

        <Controller
          control={control}
          name="deadline"
          render={({ field: { onChange, value } }) => (
            <SelectDeadlineInput
              deadline={value}
              onChange={onChange}
              error={errors.deadline?.message}
            />
          )}
        />

        <CustomButton title="Create" onPress={handleSubmit(onSubmit)} />
        <CustomButton title="Cancel" onPress={() => router.back()} type="secondary" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background.primary,
  },
});
