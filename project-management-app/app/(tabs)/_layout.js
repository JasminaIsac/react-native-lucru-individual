import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@contexts";
import { USER_ROLES } from "@constants";
import { colors } from "@theme";
import { View, TouchableOpacity } from "react-native";
import CustomButton from "@components/CustomButton";
import { useRouter } from "expo-router";

export default function TabsLayout() {
  const { currentUser } = useAuth();
  const router = useRouter();

  const userData = currentUser?.userData;

  const canViewUsersTab =
    userData?.role === USER_ROLES.ROOT ||
    userData?.role === USER_ROLES.ADMIN;

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="projects"
        options={{
          title: "Projects",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
          headerRight: () => (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {userData?.role !== USER_ROLES.DEVELOPER && (
                <>
                  <TouchableOpacity onPress={() => router.push('projects/add')} style={{marginRight: 10}}>
                    <Ionicons name="add" size={24} color={colors.darkBlue} style={{ marginRight: 15 }} />
                  </TouchableOpacity>
                  <CustomButton title="Categories" style={{height: 40, marginRight: 15, elevation: 0}} onPress={() => router.push('projects/categories')} />
                </>
              )}
            </View>
          ),
        }}
      />

      {/* {canViewUsersTab && (
        <Tabs.Screen
          name="users"
          options={{
            title: "Team",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        />
      )}

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      /> */}
    </Tabs>
  );
}
