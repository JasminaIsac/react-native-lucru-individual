import React from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, Platform, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUsers } from '@contexts/index';
import { addUser } from '@api/users';
import { colors, textPresets } from '@theme/index';
import { CustomInput, CustomButton, LabeledPicker } from '@components/index';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { USER_ROLES } from '@constants/index';

// Define schema Zod
const roles = [
  { label: 'Project Manager', value: USER_ROLES.MANAGER },
  { label: 'Developer', value: USER_ROLES.DEVELOPER },
  { label: 'Admin', value: USER_ROLES.ADMIN },
];


const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  tel: z.string().min(1, 'Telephone is required'),
  role: z.enum(['project manager', 'developer', 'admin'], 'Select a role'),
  location: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm Password is required')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const AddUserScreen = () => {
  const router = useRouter();
  const { addUserToContext } = useUsers();

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      tel: '',
      role: 'developer',
      location: '',
      status: 'active',
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...userData } = data; // Remove confirmPassword before sending
      const addedUser = await addUser(userData);
      addUserToContext(addedUser);
      reset();
      Alert.alert('Success', 'User added successfully');
      router.back();
    } catch (error) {
      console.error('Error adding user:', error);
      Alert.alert('Error', 'Failed to add user');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="always">
        
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Name"
              placeholder="Name"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Email"
              placeholder="Email"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="tel"
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Tel"
              placeholder="Tel"
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChange}
              error={errors.tel?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="role"
          render={({ field: { onChange, value } }) => (
            <LabeledPicker
              label="Role"
              selectedValue={value}
              placeholder="Select Role"
              onValueChange={onChange}
              items={roles}
              error={errors.role?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="location"
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Location"
              placeholder="Location"
              value={value}
              onChangeText={onChange}
              error={errors.location?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Password"
              placeholder="Password"
              value={value}
              isPassword
              onChangeText={onChange}
              error={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Confirm Password"
              placeholder="Confirm Password"
              value={value}
              isPassword
              onChangeText={onChange}
              error={errors.confirmPassword?.message}
            />
          )}
        />

        <CustomButton title="Add User" onPress={handleSubmit(onSubmit)} />
        <CustomButton title="Cancel" onPress={() => router.back()} type="secondary" />

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.background.primary,
  },
});

export default AddUserScreen;
