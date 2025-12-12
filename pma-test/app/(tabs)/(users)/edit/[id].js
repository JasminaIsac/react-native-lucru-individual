import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';
import { useUsers } from '@contexts/index';
import { getUserById, updateUser, deleteUser } from '@api/users';
import { getUserProjects } from '@api/projects';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { CustomButton, CustomInput, LabeledPicker } from '@components/index';
import { colors } from '@theme/index';

// Zod schema pentru validare user
const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  tel: z.string().optional(),
  location: z.string().optional(),
  role: z.enum(['admin', 'project manager', 'developer'], 'Role is required'),
  status: z.enum(['active', 'inactive', 'blocked'], 'Status is required'),
});

const EditUserScreen = () => {
  const router = useRouter();
  const params = useSearchParams();
  const userId = params?.id; // id-ul user-ului trecut în router
  const { updateUserInContext, deleteUserFromContext } = useUsers();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
  });

  // Obține user-ul din API
  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const fetchedUser = await getUserById(userId);
        setUser(fetchedUser);
        reset({
          name: fetchedUser.name,
          tel: fetchedUser.tel,
          location: fetchedUser.location,
          role: fetchedUser.role,
          status: fetchedUser.status,
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        Alert.alert('Error', 'Failed to load user');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const onSave = async (data) => {
    if (!user) return;

    try {
      setLoading(true);
      const updatedUser = { ...user, ...data, updated_at: new Date().toISOString() };
      await updateUser(updatedUser);
      updateUserInContext(updatedUser);
      Alert.alert('Success', 'User updated successfully');
      router.back();
    } catch (error) {
      console.error('Error updating user:', error);
      Alert.alert('Error', 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!user) return;

    try {
      const projects = await getUserProjects(user.id);
      if (projects.length > 0) {
        Alert.alert('Error', 'User is involved in projects and cannot be deleted');
        return;
      }

      Alert.alert('Confirm', 'Are you sure you want to delete this user?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await deleteUser(user.id);
            deleteUserFromContext(user.id);
            Alert.alert('Success', 'User deleted successfully');
            router.push('/tabs/users');
          } catch (err) {
            console.error('Error deleting user:', err);
            Alert.alert('Error', 'Failed to delete user');
          }
        }}
      ]);
    } catch (error) {
      console.error('Error checking user projects:', error);
      Alert.alert('Error', 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.primary }}>
        <ActivityIndicator size="large" color={colors.text.primary} />
      </View>
    );
  }


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >   
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <CustomInput
                label="Name"
                placeholder="Name"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="tel"
            render={({ field }) => (
              <CustomInput
                label="Tel"
                placeholder="Tel"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.tel?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <LabeledPicker
                label="Role"
                selectedValue={field.value}
                placeholder="Role"
                onValueChange={field.onChange}
                items={[
                  { label: 'Admin', value: 'admin' },
                  { label: 'Project Manager', value: 'project manager' },
                  { label: 'Developer', value: 'developer' },
                ]}
                error={errors.role?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="location"
            render={({ field }) => (
              <CustomInput
                label="Location"
                placeholder="Location"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.location?.message}
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
                placeholder="Status"
                onValueChange={field.onChange}
                items={[
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                  { label: 'Blocked', value: 'blocked' },
                ]}
                error={errors.status?.message}
              />
            )}
          />

          <CustomButton
            title="Save Changes"
            onPress={handleSubmit(onSave)}
            disabled={loading}
          />

          <CustomButton
            title="Delete User"
            onPress={onDelete}
            type="delete"
            disabled={loading}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: colors.background.primary,
  },
});

export default EditUserScreen;
