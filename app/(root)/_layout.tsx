import { useFonts } from "expo-font";
import { Stack, SplashScreen } from "expo-router";
import React from "react";


export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "SpaceMono-Regular": require("@/assets/fonts/SpaceMono-Regular.ttf"), // Using path alias
    // Add other custom fonts here
  });

  React.useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="add-food"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="search-user"
        options={{
          headerShown: true, 
          title: "Find Friends",
          animation: "slide_from_right",
        }}
      />

    </Stack>
  );
}