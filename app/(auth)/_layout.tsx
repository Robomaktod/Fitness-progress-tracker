import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";

const Layout = () => {
  return (
    <Stack>
      <StatusBar hidden={true} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
