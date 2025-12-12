import { Stack } from "expo-router";

export default function ProjectLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "All Tasks" }} />
      <Stack.Screen name="add" options={{ title: "New Task" }} />
      <Stack.Screen name="view/[id]" options={{ title: "Task Details" }} />
      <Stack.Screen name="edit/[id]" options={{ title: "Edit Task" }} />
      <Stack.Screen name="messages/[id]" options={{ title: "Task Messages" }} />
    </Stack>
  );
}
