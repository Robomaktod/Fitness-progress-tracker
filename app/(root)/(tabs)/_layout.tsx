import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

import { gradients } from "@/constants";

const ACTIVE_TINT_COLOR = "#1ED2EE"; // Your cyan
const INACTIVE_TINT_COLOR = "#9CA3AF"; // A neutral gray (Tailwind gray-400)
const TAB_BAR_BACKGROUND_COLOR = "#252525"; // Your dark-100
const FAB_ICON_COLOR = "#FFFFFF";

export default function TabLayout() {
  const router = useRouter();

  const renderTabBarIconAdd = () => (
    <View className="items-center justify-center">
      <LinearGradient
        colors={gradients.default}
        className="-mt-7 h-14 w-14 items-center justify-center rounded-full shadow-lg"
      >
        <FontAwesome5 name="plus" size={22} color={FAB_ICON_COLOR} />
      </LinearGradient>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ACTIVE_TINT_COLOR,
        tabBarInactiveTintColor: INACTIVE_TINT_COLOR,
        tabBarStyle: {
          backgroundColor: TAB_BAR_BACKGROUND_COLOR,
          borderTopWidth: 1,
          borderTopColor: "#374151", // Tailwind gray-700 (a bit darker for subtle border)
          height: 65, // Slightly increased height for better touchability with FAB
          paddingTop: 5, // Added paddingTop for icon spacing
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600", // semibold
          marginBottom: 5, // Spacing between icon and label
        },
        headerShown: false, // Each tab screen will manage its own header (e.g., AppHeader)
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "stats-chart" : "stats-chart-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* Central Floating Action Button Placeholder Tab */}
      <Tabs.Screen
        name="add-placeholder" // Dummy name
        options={{
          title: "",
          tabBarIcon: renderTabBarIconAdd, // Use the function directly
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            // Decide which modal to open, or open a menu (like your WheelMenu)
            // For simplicity, let's assume it defaults to add-activity for now,
            // or you could present your WheelMenu here.
            console.log(
              "Central Add button pressed - opening WheelMenu or default add screen",
            );
            // Example: Show WheelMenu if you have it as a modal, or push to a selection screen
            router.push("/add-activity"); // Or trigger your WheelMenu
          },
        }}
      />

      <Tabs.Screen
        name="activity" // Renamed for consistency if it's about logging activity
        options={{
          title: "Activity", // Or "Workouts"
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5
              name={focused ? "running" : "walking"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      {/*
        To add Nutrition and Social as tabs:
        <Tabs.Screen
            name="nutrition"
            options={{
            title: 'Nutrition',
            tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'restaurant' : 'restaurant-outline'} size={26} color={color} />
            ),
            }}
        />
        <Tabs.Screen
            name="social"
            options={{
            title: 'Social',
            tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'people' : 'people-outline'} size={26} color={color} />
            ),
            }}
        />
      */}
    </Tabs>
  );
}