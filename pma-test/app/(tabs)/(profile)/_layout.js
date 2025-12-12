import React from "react";
import { TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@contexts/AuthContext";

export default function TabsLayout() {
  const user = useAuth();
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push(`/edit`)}>
              <Ionicons
                name="pencil"
                size={22}
                color="black"
                style={{ marginRight: 15 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: "Edit Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Stack>
  );
}
