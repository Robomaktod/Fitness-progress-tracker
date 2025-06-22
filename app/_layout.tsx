// Fitness-progress-tracker1/app/_layout.tsx
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot, SplashScreen, Stack, useRouter } from "expo-router"; // Slot might be needed for initial auth check
import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // IMPORT THESE
import "./globals.css";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
  );
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Global default query options can go here
      // For example:
      // staleTime: 1000 * 60 * 5, // 5 minutes
      // gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1, // Retry failed requests once by default
    },
  },
});


// This component can handle the initial auth check and redirect logic
// function InitialLayout() {
//   const { isLoaded, isSignedIn } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!isLoaded) {
//       SplashScreen.preventAutoHideAsync(); // Keep splash screen visible
//       return;
//     }

//     SplashScreen.hideAsync(); // Hide splash screen once auth state is loaded

//     if (isSignedIn) {
//       router.replace("/(root)/(tabs)/home");
//     } else {
//       router.replace("/(auth)/welcome"); // Or directly to sign-in
//     }
//   }, [isLoaded, isSignedIn, router]);

//   if (!isLoaded) {
//     return null; // Or a custom loading screen, though splash handles this
//   }

//   // Slot will render the current child route (either (auth) or (root))
//   return <Slot />;
// }


export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <QueryClientProvider client={queryClient}>
        {/*
          Using Stack directly here as the top-level navigator
          is often simpler for managing auth flow vs. root.
          Your index.tsx handles the initial redirect logic.
        */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(root)" />
          <Stack.Screen name="(auth)" />
          {/* You can add other top-level modal screens here if needed */}
        </Stack>
      </QueryClientProvider>
    </ClerkProvider>
  );
}