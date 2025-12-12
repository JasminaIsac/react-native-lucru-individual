import { useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadAvatar } from '@api/users';
import { useCameraPermission, useMediaLibraryPermission } from '@hooks/usePermissions';
import { z } from 'zod';

// Validare tip imagine cu Zod
const imageSchema = z.string().refine((uri) => {
  const ext = uri.split('.').pop()?.toLowerCase();
  return ext === 'jpg' || ext === 'jpeg' || ext === 'png';
}, {
  message: 'Only JPG, JPEG or PNG images are allowed'
});

export function useAvatarPicker(userId) {
  const [loading, setLoading] = useState(false);

  const { requestCamera } = useCameraPermission();
  const { requestLibrary } = useMediaLibraryPermission();

  const pickImage = async () => {
    const hasPermission = await requestLibrary();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return null;
    const uri = result.assets[0].uri;

    // Validare cu Zod
    try {
      imageSchema.parse(uri);
      return uri;
    } catch (err) {
      Alert.alert('Invalid file type', err.errors[0].message);
      return null;
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestCamera();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return null;
    const uri = result.assets[0].uri;

    // Validare cu Zod
    try {
      imageSchema.parse(uri);
      return uri;
    } catch (err) {
      Alert.alert('Invalid file type', err.errors[0].message);
      return null;
    }
  };

  const uploadImage = async (uri) => {
    try {
      setLoading(true);
      const data = await uploadAvatar(userId, uri);
      return data;
    } catch (err) {
      Alert.alert('Upload failed', 'Could not upload image.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    pickImage,
    takePhoto,
    uploadImage,
  };
}
