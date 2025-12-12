import { Stack } from "expo-router";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@theme/colors";
import { CustomButton } from "@components/index";
import { USER_ROLES } from "@constants/index";
import { router } from "expo-router";
import { useAuth } from "@contexts/index";

export default function ProjectLayout() {
  const user = useAuth();

  return (
    <Stack >
      <Stack.Screen name="index"         
        options={{
        title: "Projects",
        headerRight: () =>
          user?.role !== USER_ROLES.DEVELOPER && (
            <View style={{ flexDirection: "row", alignItems: "center", marginRight: 15 }}>
              <TouchableOpacity
                onPress={() => router.push("add")}
                style={{ marginRight: 10, padding: 4 }}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={24} color={colors.darkBlue} />
              </TouchableOpacity>
              <CustomButton
                title="Categories"
                style={{ height: 40, elevation: 0 }}
                onPress={() => router.push("categories")}
              />
            </View>
          ),
        }}
      />
      <Stack.Screen name="add" options={{ title: "New Project" }} />
      <Stack.Screen name="view/[id]" options={{ title: "Project Details" }} />
      <Stack.Screen name="edit/[id]" options={{ title: "Edit Project" }} />
      <Stack.Screen name="members/[id]" options={{ title: "Manage Project Members" }} />
      <Stack.Screen name="categories/index" options={{ title: "Categories" }} />
    </Stack>
  );
}
