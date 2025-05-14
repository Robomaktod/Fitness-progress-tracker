import { Stack, Tabs } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";

const Layout = () => {
  return (
    <Tabs
      // initialRouteName="index"
      // screenOptions={{ tabBarActiveTintColor: "white" }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default Layout;
