import { Stack } from "expo-router";

export default function ProjectLayout() {
  return (
    <Stack>
      <Stack.Screen name="add" options={{ title: "New Project" }} />
      <Stack.Screen name="view/[id]" options={{ title: "Project Details" }} />
      <Stack.Screen name="edit/[id]" options={{ title: "Edit Project" }} />
      <Stack.Screen name="members/[id]" options={{ title: "Manage Project Members" }} />
      <Stack.Screen name="categories" options={{ title: "Categories" }} />
      <Stack.Screen name="categories/add" options={{ title: "New Category" }} />
    </Stack>
  );
}
