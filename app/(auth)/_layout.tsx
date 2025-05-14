import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";

const Layout = () => {
  return (
    <Stack>
      <StatusBar hidden={true} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
