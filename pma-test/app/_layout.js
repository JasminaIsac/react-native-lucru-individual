import { Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { AuthProvider, useAuth, ProjectsProvider, UserProvider, TasksProvider } from "@contexts/index";

// if (__DEV__) {
//   const originalWarn = console.warn;
//   console.warn = (...args) => {
//     // Listează aici ce mesaje vrei să ignori
//     if (
//       typeof args[0] === 'string' &&
//       args[0].includes('createAnimatedPropAdapter')
//     ) {
//       return; // ignoră warning-ul
//     }
//     originalWarn(...args); // toate celelalte warning-uri se afișează normal
//   };
// }

function RootStack() {
  const [fontsLoaded] = useFonts({
    Baloo2_700Bold: require("@assets/fonts/Baloo2-VariableFont_wght.ttf"),
  });

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !fontsLoaded) return;

    if (user) {
      router.replace("(tabs)");
    } else {
      router.replace("../login");
    }
  }, [user, loading, fontsLoaded]);

  if (!fontsLoaded || loading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

// AuthProvider și alți providers în jurul întregului Stack
export default function RootLayout() {
  return (
    <AuthProvider>
      <UserProvider>
        <ProjectsProvider>
          <TasksProvider>
            <RootStack />
          </TasksProvider>
        </ProjectsProvider>
      </UserProvider>
    </AuthProvider>
  );
}
