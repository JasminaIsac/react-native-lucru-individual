import React, { useState, useMemo, useEffect, useCallback } from "react";
import { 
  View, Image, Text, TouchableOpacity, StyleSheet, Dimensions, Platform, Alert, ActionSheetIOS 
} from "react-native";
import { colors } from "@theme/index";
import CustomButton from "./CustomButton";
import { useAvatarPicker } from '@hooks/useAvatarPicker';
import { useAuth } from '@contexts/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const UserAvatar = ({ size = 140, uri, name = "" }) => {
  const { user, updateUserInContext } = useAuth();
  const { pickImage, takePhoto, uploadImage, loading } = useAvatarPicker(user?.id);

  const [expanded, setExpanded] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [choosedUri, setChoosedUri] = useState(uri || user?.avatar_url || null);

  const initial = name ? name.charAt(0).toUpperCase() : "?";

  const avatarSize = expanded ? SCREEN_WIDTH : size;
  const borderRadius = expanded ? 0 : size / 2;
  const marginV = expanded ? 0 : 15;

  const imageSource = useMemo(() => ({ uri: choosedUri }), [choosedUri]);

  useEffect(() => {
    setChoosedUri(user?.avatar_url || uri);
  }, [user?.avatar_url, uri]);

  const handleAvatarPress = useCallback(() => {
    if (!expanded) {
      setExpanded(true);
      setShowOverlay(false);
    } else {
      setShowOverlay(true);
    }
  }, [expanded]);

  const handleOverlayPress = useCallback(() => setShowOverlay(false), []);

  const handleChangeAvatar = useCallback (async () => {
    let uri = null;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) uri = await takePhoto();
          if (buttonIndex === 2) uri = await pickImage();

          if (uri) await handleUpload(uri);
        }
      );
    } else {
      Alert.alert(
        'Change Avatar',
        'Choose an option',
        [
          { text: 'Take Photo', 
            onPress: async () => { 
              uri = await takePhoto(); 
              if (uri) await handleUpload(uri); 
            } 
          },
          { text: 'Choose from Gallery', 
            onPress: async () => { 
              uri = await pickImage(); 
              if (uri) await handleUpload(uri)
            } 
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  }, [pickImage, takePhoto, handleUpload]);


  const handleUpload = async (uri) => {
    const data = await uploadImage(uri);
    if (data) {
      updateUserInContext({ avatar_url: data });
      setShowOverlay(false);
      setExpanded(true);
    }

    return data
  };

  return (
    <View style={{ alignItems: "center" }}>
      <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.8}>
        <View style={[styles.avatarContainer, { width: avatarSize, height: avatarSize, borderRadius, marginVertical: marginV }]}>
          {choosedUri ? (
            <Image
              source={imageSource}
              style={{ width: avatarSize, height: avatarSize, borderRadius, resizeMode: "cover" }}
            />
          ) : (
            <View style={[styles.placeholder, { width: avatarSize, height: avatarSize, borderRadius }]}>
              <Text style={{ fontSize: avatarSize * 0.4, color: colors.text.primary, fontWeight: "600" }}>
                {initial}
              </Text>
            </View>
          )}

          {expanded && showOverlay && (
            <>
              <TouchableOpacity style={styles.overlay} onPress={handleOverlayPress} activeOpacity={1} />
              <View style={styles.changeButtonContainer}>
                <CustomButton title={loading ? "Uploading..." : "Change Avatar"} type="primary" onPress={handleChangeAvatar} disabled={loading} />
                <CustomButton title="Close" type="outline" onPress={() => setExpanded(false)} />
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    overflow: "hidden",
    backgroundColor: colors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.lightOrange,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1,
  },
  changeButtonContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: SCREEN_WIDTH * 0.6,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateX: -SCREEN_WIDTH * 0.3 }, { translateY: -50 }],
    transition: "transform 0.3s ease-in-out",
    zIndex: 2,
  },
});

export default React.memo(UserAvatar);