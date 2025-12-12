import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "All Users" }} />
      <Stack.Screen name="add" options={{ title: "New User" }} />
      <Stack.Screen name="view/[id]" options={{ title: "User Details" }} />
      <Stack.Screen name="edit/[id]" options={{ title: "Edit User" }} />
    </Stack>
  );
}
