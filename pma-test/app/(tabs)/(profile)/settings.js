import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Linking, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, textPresets } from '@theme/index';
import CustomButton from '@components/CustomButton';

export default function SettingsScreen() {
  const [cameraPermission, setCameraPermission] = useState('undetermined');
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState('undetermined');

  // const checkPermissions = async () => {
  //   // Camera
  //   const cameraStatus = await ImagePicker.getCameraPermissionsAsync();
  //   setCameraPermission(cameraStatus.status);

  //   // Media Library
  //   const libraryStatus = await ImagePicker.getMediaLibraryPermissionsAsync();
  //   setMediaLibraryPermission(libraryStatus.status);
  // };

  // useEffect(() => {
  //   checkPermissions();
  // }, []);

  const handleOpenSettings = () => {
    Alert.alert(
      'Permissions required',
      'You need to grant permissions in settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={textPresets.headerMedium}>Permissions</Text>
        <View style={styles.permissionItem}>
          <Text style={textPresets.headerSmall}>Camera Access:</Text>
          <Text style={textPresets.bodyMedium}>We need access to your camera to take photos.</Text>
          <Text style={[textPresets.bodyMediumBold,{ color: mediaLibraryPermission === 'granted' ? 'green' : 'red', fontStyle: 'italic' }]}>
            {cameraPermission}
          </Text>
          {cameraPermission !== 'granted' && (
            <CustomButton title="Go to Settings" onPress={handleOpenSettings} style={{ marginTop: 10 }}/>
          )}
        </View>

        <View style={styles.permissionItem}>
          <Text style={textPresets.headerSmall}>Media Library Access:</Text>
          <Text style={textPresets.bodyMedium}>We need access to your media library to select photos.</Text>
          <Text style={[textPresets.bodyMediumBold,{ color: mediaLibraryPermission === 'granted' ? 'green' : 'red', fontStyle: 'italic' }]}>
            {mediaLibraryPermission}
          </Text>
          {mediaLibraryPermission !== 'granted' && (
            <CustomButton title="Go to Settings" onPress={handleOpenSettings} style={{ marginTop: 10 }}/>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background.primary,
    flexGrow: 1,
  },
  title: {
    marginBottom: 20,
    color: colors.text.primary,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: colors.text.secondary,
  },
  permissionItem: {
    marginBottom: 30,
  },
});
