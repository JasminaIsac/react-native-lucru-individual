import { Stack } from "expo-router";
import { useFonts } from "@expo-google-fonts/raleway/useFonts";
import {
  Raleway_300Light,
  Raleway_400Regular,
  Raleway_500Medium,
  Raleway_600SemiBold,
  Raleway_700Bold,
  Raleway_800ExtraBold,
  Raleway_900Black,
} from "@expo-google-fonts/raleway";
import {
  EncodeSans_100Thin,
  EncodeSans_200ExtraLight,
  EncodeSans_300Light,
  EncodeSans_400Regular,
  EncodeSans_500Medium,
  EncodeSans_600SemiBold,
  EncodeSans_700Bold,
} from "@expo-google-fonts/encode-sans";
import { Baloo2_700Bold } from "@expo-google-fonts/baloo-2";

import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { AuthProvider, UserProvider, ProjectsProvider, TasksProvider } from "@contexts";
import { useAuth } from "@contexts/AuthContext";

const RootLayoutInner = () => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!currentUser?.userData) {
        router.replace('/login');
      } else {
        router.replace('/(tabs)/index');
      }
    }
  }, [currentUser, loading]);

  if (loading || !currentUser) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
    </Stack>
  );
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Raleway_300Light,
    Raleway_400Regular,
    Raleway_500Medium,
    Raleway_600SemiBold,
    Raleway_700Bold,
    Raleway_800ExtraBold,
    Raleway_900Black,
    Baloo2_700Bold,
    EncodeSans_100Thin,
    EncodeSans_200ExtraLight,
    EncodeSans_300Light,
    EncodeSans_400Regular,
    EncodeSans_500Medium,
    EncodeSans_600SemiBold,
    EncodeSans_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <UserProvider>
        <ProjectsProvider>
          <TasksProvider>
            <RootLayoutInner />
          </TasksProvider>
        </ProjectsProvider>
      </UserProvider>
    </AuthProvider>
  );
}
