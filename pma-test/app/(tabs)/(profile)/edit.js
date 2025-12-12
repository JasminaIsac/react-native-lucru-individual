import React, { useEffect } from 'react';
import { View, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { updateUser } from '@api/users';
import { CustomInput, CustomButton, ChangePasswordModal } from '@components/index';
import { useAuth } from '@contexts/index';
import { colors } from '@theme/index';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { router } from 'expo-router';
import { z } from "zod";

export const editProfileSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  location: z.string().min(2, "Location is too short"),
  tel: z
    .string()
    .min(6, "Phone number too short")
    .regex(/^[0-9+\-\s]+$/, "Invalid phone number"),
});

export default function EditProfile() {
  const { user, updateUserInContext } = useAuth();

  const { 
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: "",
      location: "",
      tel: "",
    },
  });

  // Preîncarcă datele utilizatorului
  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("location", user.location);
      setValue("tel", user.tel);
    }
  }, [user]);

  const [isPasswordModalVisible, setPasswordModalVisible] = React.useState(false);

  const onSubmit = async (formData) => {
    try {
      const updatedUser = { 
        ...user,
        ...formData,
        updated_at: new Date().toISOString(),
      };

      const response = await updateUser(updatedUser);
      updateUserInContext(updatedUser);

      Alert.alert("Success", response?.message || "Profile updated!");

      router.back();
      
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong while updating profile.");
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <CustomInput
        name={"name"}
        control={control}
        label="Name"       
        placeholder="Enter your name"
        error={errors.name}
      />

      <CustomInput
        name={"location"}
        control={control}
        label="Location"
        placeholder="Enter your location"
        error={errors.location}
      />

      <CustomInput
        name={"tel"}
        control={control}
        label="Phone Number"
        keyboardType="phone-pad"
      />

      <CustomButton title="Save Changes" onPress={handleSubmit(onSubmit)} />
      <CustomButton 
        title="Change Password"
        type="delete"
        onPress={() => setPasswordModalVisible(true)}
      />

      <ChangePasswordModal
        visible={isPasswordModalVisible}
        userId={user?.id}
        onClose={() => setPasswordModalVisible(false)}
      />
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
