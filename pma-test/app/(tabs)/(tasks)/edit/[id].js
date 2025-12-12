import React, { useEffect, useState } from "react";
import { StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform, View, ActivityIndicator } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";

import { colors } from "@theme/colors";
import { CustomInput, SelectDeadlineInput, CustomButton, LabeledPicker } from "@components/index";
import { getProjectMembers } from "@api/projects";
import { getTaskById, updateTask, deleteTask } from "@api/tasks";
import { useTasks } from "@contexts/index";
import { useRouter, useSearchParams } from "expo-router";

// Zod schema pentru task
const taskSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["returned", "completed"]),
  assigned_to: z.string().min(1, "Select a developer"),
  priority: z.enum(["high", "medium", "low"]),
  deadline: z.string().optional(),
});

const EditTaskScreen = () => {
  const router = useRouter();
  const params = useSearchParams();
  const taskId = params.id; // luam doar ID-ul din ruta
  const { updateTaskInContext, deleteTaskFromContext } = useTasks();

  const [task, setTask] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { control, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: {},
    resolver: zodResolver(taskSchema),
  });

  // Fetch task si membri proiect
  useEffect(() => {
    const loadTaskAndMembers = async () => {
      try {
        const fetchedTask = await getTaskById(taskId);
        setTask(fetchedTask);

        reset({
          title: fetchedTask.title,
          description: fetchedTask.description,
          status: fetchedTask.status,
          assigned_to: fetchedTask.assigned_to,
          priority: fetchedTask.priority,
          deadline: fetchedTask.deadline || "",
        });

        const membersData = await getProjectMembers(fetchedTask.project_id);
        setDevelopers(membersData.filter(m => m.user_role === "developer"));
      } catch (error) {
        console.error("Error loading task or members:", error);
        Alert.alert("Error", "Failed to load task data");
      } finally {
        setLoading(false);
      }
    };

    loadTaskAndMembers();
  }, [taskId]);

  const onSave = async (data) => {
    try {
      const updatedTask = { ...task, ...data, updated_at: new Date().toISOString() };
      await updateTask(updatedTask);
      updateTaskInContext(updatedTask);
      Alert.alert("Success", "Task updated successfully");
      router.back();
    } catch (error) {
      console.error("Error updating task:", error);
      Alert.alert("Error", "Failed to update task");
    }
  };

  const onDelete = async () => {
    Alert.alert("Confirm", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try {
          await deleteTask(task.id);
          deleteTaskFromContext(task.id);
          Alert.alert("Success", "Task deleted successfully");
          router.push(`/projects/view/${task.project_id}`);
        } catch (error) {
          console.error("Error deleting task:", error);
          Alert.alert("Error", "Failed to delete task");
        }
      }}
    ]);
  };

  if (loading || !task) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <CustomInput
              label="Title"
              placeholder="Task Name"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.title?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <CustomInput
              label="Description"
              placeholder="Task Description"
              value={field.value}
              onChangeText={field.onChange}
              multiline
              error={errors.description?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <LabeledPicker
              label="Status"
              selectedValue={field.value}
              onValueChange={field.onChange}
              placeholder="Select status"
              items={[
                { label: "Returned", value: "returned" },
                { label: "Completed", value: "completed" },
              ]}
              error={errors.status?.message}
            />
          )}
        />

        {developers.length > 0 && (
          <Controller
            control={control}
            name="assigned_to"
            render={({ field }) => (
              <LabeledPicker
                label="Assigned to"
                selectedValue={field.value}
                onValueChange={field.onChange}
                placeholder="Select developer"
                items={developers.map((member) => ({ label: member.name, value: member.user_id }))}
                error={errors.assigned_to?.message}
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="priority"
          render={({ field }) => (
            <LabeledPicker
              label="Priority"
              selectedValue={field.value}
              onValueChange={field.onChange}
              placeholder="Select priority"
              items={[
                { label: "High", value: "high" },
                { label: "Medium", value: "medium" },
                { label: "Low", value: "low" },
              ]}
              error={errors.priority?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="deadline"
          render={({ field }) => (
            <SelectDeadlineInput
              deadline={field.value}
              onChange={field.onChange}
              placeholder="Deadline"
              error={errors.deadline?.message}
            />
          )}
        />

        <View style={{ flexDirection: "row", gap: 10 }}>
          <CustomButton title="Delete" type="delete" onPress={onDelete} style={{ flex: 1 }} />
          <CustomButton title="Save" onPress={handleSubmit(onSave)} style={{ flex: 1 }} />
        </View>

        <CustomButton title="Cancel" type="secondary" onPress={() => router.back()} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  contentContainer: { padding: 20, paddingBottom: 15 },
});

export default EditTaskScreen;
