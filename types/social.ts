import { IconNameFA5, IconNameIonicons, IconProvider } from "./health";

export interface FriendRequestData {
  id: string;
  name: string;
  avatarUrl?: string;
  mutualFriendsCount: number;
}

export interface FriendData {
  id: string;
  name: string;
  avatarUrl?: string;
  activitySummary: string; // e.g., "5 workouts this week"
  activityIconName: IconNameFA5 | IconNameIonicons; // Icon representing primary activity type
  activityIconProvider?: IconProvider;
  activityIconColorClassName?: string; // e.g., text-cyan-400
  achievementIconName?: IconNameFA5 | IconNameIonicons; // The icon on the far right (medal, chart, crown)
  achievementIconProvider?: IconProvider;
  achievementIconColorClassName?: string;
  achievementIconBgClassName?: string; // e.g., bg-cyan-500/20
}

export interface GiftedChartDataPoint {
  value: number;
  label?: string; // For X-axis label, often taken from the 'labels' prop or generated
  labelText?: string; // Alternative for X-axis label if needed
  date?: string; // Can be useful for time-series data
  dataPointText?: string; // Text to display on the data point itself
  // ... other props supported by react-native-gifted-charts data points
}

export interface ComparisonChartDataPoint {
  // Keep this for conceptual clarity or simplify
  label: string; // X-axis label (e.g., 'Mon', 'Week 1', 'Jan')
  userValue: number; // Y-axis value for the current user
  friendValue: number; // Y-axis value for the friend
}

export interface ComparisonStat {
  id: string;
  title: string;
  userValueDisplay: string;
  friendValueDisplay: string;
  unit?: string;
  // chartData will still hold the original comparison structure,
  // transformation will happen in the Chart component
  chartData?: ComparisonChartDataPoint[];
  // Props specific to how react-native-gifted-charts might need styling
  userLineColor?: string;
  friendLineColor?: string;
}























// --- START OF FILE Fitness-progress-tracker/components/ui/activity/ActivityTypeCard.tsx ---

// // components/ui/activity/ActivityTypeCard.tsx

// --- START OF FILE Fitness-progress-tracker/components/ui/activity/IntensitySelector.tsx ---

// // components/ui/activity/IntensitySelector.tsx

// --- START OF FILE Fitness-progress-tracker/components/ui/profile/DailyTargetItem.tsx ---

// // components/ui/profile/DailyTargetItem.tsx

// --- START OF FILE Fitness-progress-tracker/components/ui/profile/BodyMetricItem.tsx ---

// // components/ui/profile/BodyMetricItem.tsx

// --- START OF FILE Fitness-progress-tracker/components/ui/profile/ProfileDetailRow.tsx ---

// // components/ui/profile/ProfileDetailRow.tsx

// --- START OF FILE Fitness-progress-tracker/components/ui/profile/ProfileInfoSection.tsx ---

// // components/ui/profile/ProfileInfoSection.tsx

// --- START OF FILE Fitness-progress-tracker/components/ui/profile/ProfileHeader.tsx ---


// --- START OF FILE Fitness-progress-tracker/components/ui/nutrition/NutritionLogHeader.tsx ---

// // components/ui/nutrition/NutritionLogHeader.tsx

// --- START OF FILE Fitness-progress-tracker/components/ui/nutrition/DateNavigator.tsx ---

// // components/ui/nutrition/DateNavigator.tsx

// --- START OF FILE Fitness-progress-tracker/components/ui/nutrition/MealSectionCard.tsx ---

// // components/ui/nutrition/MealSectionCard.tsx

// --- START OF FILE Fitness-progress-tracker/components/ui/nutrition/MealTimeSelector.tsx ---

// // components/ui/nutrition/MealTimeSelector.tsx

// --- START OF FILE Fitness-progress-tracker/components/ui/social/SocialHeader.tsx ---

// // components/ui/social/SocialHeader.tsx

// --- START OF FILE Fitness-progress-tracker/components/ui/social/FriendRequestCard.tsx ---

// // components/ui/social/FriendRequestCard.tsx

// --- START OF FILE Fitness-progress-tracker/components/ui/social/FriendListItem.tsx ---

// // components/ui/social/FriendListItem.tsx

// --- START OF FILE Fitness-progress-tracker/components/ui/social/ComparisonStatChart.tsx ---

// // components/ui/social/ComparisonStatChart.tsx

// --- START OF FILE Fitness-progress-tracker/app/_layout.tsx ---

// import { ClerkProvider } from "@clerk/clerk-expo";
// import { tokenCache } from "@clerk/clerk-expo/token-cache";
// import { Stack } from "expo-router";
// import React from "react";
// import "./globals.css";

// export default function RootLayout() {
//   return (
//     <ClerkProvider tokenCache={tokenCache}>
//       <Stack>
//         <Stack.Screen name="index" options={{ headerShown: false }} />
//         <Stack.Screen name="(root)" options={{ headerShown: false }} />
//         <Stack.Screen name="(auth)" options={{ headerShown: false }} />
//       </Stack>
//     </ClerkProvider>
//   );
// }
// --- START OF FILE Fitness-progress-tracker/app/globals.css ---

// @tailwind base;
// @tailwind components;
// @tailwind utilities;

// @theme {
//   --animate-wiggle: wiggle 1s ease-in-out infinite;
//   @keyframes wiggle {
//     0%,
//     100% {
//       transform: rotate(-3deg);
//     }
//     50% {
//       transform: rotate(3deg);
//     }
//   }
// }--- START OF FILE Fitness-progress-tracker/app/(auth)/_layout.tsx ---


// --- START OF FILE Fitness-progress-tracker/app/(auth)/welcome.tsx ---


// --- START OF FILE Fitness-progress-tracker/app/(auth)/sign-in.tsx ---


// --- START OF FILE Fitness-progress-tracker/app/(auth)/sign-up.tsx ---


// --- START OF FILE Fitness-progress-tracker/app/(root)/(tabs)/_layout.tsx ---

// // app/(root)/(tabs)/_layout.tsx

// --- START OF FILE Fitness-progress-tracker/app/(root)/(tabs)/home.tsx ---


// --- START OF FILE Fitness-progress-tracker/app/(root)/(tabs)/profile.tsx ---


// --- START OF FILE Fitness-progress-tracker/app/(root)/(tabs)/progress.tsx ---

// // app/(root)/(tabs)/progress.tsx

// --- START OF FILE Fitness-progress-tracker/app/(root)/(tabs)/activity.tsx ---

// // app/(root)/(tabs)/activity.tsx

// --- START OF FILE Fitness-progress-tracker/app/(root)/(tabs)/nutrition.tsx ---

// // app/(root)/(tabs)/nutrition.tsx

// --- START OF FILE Fitness-progress-tracker/app/(root)/(tabs)/social.tsx ---


// --- START OF FILE Fitness-progress-tracker/app/(root)/add-activity.tsx ---


// --- START OF FILE Fitness-progress-tracker/app/(root)/add-food.tsx ---

// // components/ui/nutrition/AddFoodModal.tsx

// --- START OF FILE Fitness-progress-tracker/app/(root)/search-user.tsx ---
