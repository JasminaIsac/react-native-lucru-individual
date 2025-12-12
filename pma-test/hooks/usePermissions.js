import { useCallback } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export function useCameraPermission() {
  const requestCamera = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    console.log(status);

    if (status !== 'granted') {
      Alert.alert(
        'Camera Permission Needed',
        'You need to allow camera access in settings.',
        [
          { text: 'Close', style: 'cancel' },
          { text: 'Go to Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }
    return true;
  }, []);

  return { requestCamera };
}

export function useMediaLibraryPermission() {
  const requestLibrary = useCallback(async () => {
    let status = 'granted';

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
      status = res.status;
    }
    console.log(status);
    if (status !== 'granted') {
      Alert.alert(
        'Gallery Permission Needed',
        'You need to allow gallery access in settings.',
        [
          { text: 'Close', style: 'cancel' },
          { text: 'Go to Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }

    return true;
  }, []);

  return { requestLibrary };
}
