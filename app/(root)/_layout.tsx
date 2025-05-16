import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";

const Layout = () => {
  return (
    <Stack>
      <StatusBar hidden={true} />
      {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="activity" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
