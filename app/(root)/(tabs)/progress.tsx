import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router"; // useFocusEffect for re-fetching data on tab focus
import React, { useState, useCallback } from "react";
import { ScrollView, View, StatusBar, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import progress-specific UI components
import ActivityTrendsCard from "@/components/ui/progress/ActivityTrendsCard";
import CalorieTrendsCard from "@/components/ui/progress/CalorieTrendsCard";
import ProgressHeader from "@/components/ui/progress/ProgressHeader";
// eslint-disable-next-line import/order
import WeightProgressCard from "@/components/ui/progress/WeightProgressCard";

import {
  WeightProgressData,
  ActivityTrendsData,
  CalorieTrendItemData,
} from "@/types/health";

// Mock data - In a real app, this would come from API, database, or state management
const getMockWeightProgressData = (): WeightProgressData => ({
  currentWeight: 75.5,
  weightUnit: "kg",
  change: -2.3,
  goalWeight: 70.0,
  history: [
    { date: "Apr 6", weight: 78.0 },
    { date: "Apr 13", weight: 77.5 },
    { date: "Apr 20", weight: 76.8 },
    { date: "Apr 27", weight: 76.0 },
    { date: "May 6", weight: 75.5 },
  ],
});

const getMockActivityTrendsData = (): ActivityTrendsData => ({
  weeklyActiveDaysLabel: "Weekly Active Days",
  daysCompleted: 5,
  totalDaysInWeek: 7,
  dailyBreakdown: [
    { dayInitial: "M", activePercent: 80 },
    { dayInitial: "T", activePercent: 60 },
    { dayInitial: "W", activePercent: 90 },
    { dayInitial: "Th", activePercent: 70 },
    { dayInitial: "F", activePercent: 85 },
    { dayInitial: "S", activePercent: 0, isFuture: false }, // Example: Rest day
    { dayInitial: "Su", activePercent: 0, isFuture: true }, // Example: Future day
  ],
});

const getMockCalorieTrendsData = (): CalorieTrendItemData[] => [
  {
    id: "dailyAvg",
    label: "Daily Average",
    value: "2,180 cal",
    progressPercent: 85, // Assuming 85% of a hypothetical daily goal
  },
  {
    id: "weeklyTarget",
    label: "Weekly Target",
    value: "15,400 cal",
    progressPercent: 90, // Assuming 90% of weekly target met
  },
];
// Gradient for the overall screen background, matching the image
// from-gray-900 via-blue-950 to-purple-950
const screenBackgroundGradient: [string, string, ...string[]] = [
  "#111827",
  "#172554",
  "#301934",
]; // Tailwind gray-900, blue-950 (approx), custom dark purple

const ProgressScreen: React.FC = () => {
  const router = useRouter();

  // State for the data - initialized with mock data
  const [weightData, setWeightData] = useState<WeightProgressData>(
    getMockWeightProgressData(),
  );
  const [activityData, setActivityData] = useState<ActivityTrendsData>(
    getMockActivityTrendsData(),
  );
  const [calorieData, setCalorieData] = useState<CalorieTrendItemData[]>(
    getMockCalorieTrendsData(),
  );
  const [isLoading, setIsLoading] = useState(false); // For loading indicators if fetching data

  // Function to fetch/refresh data
  const fetchData = async () => {
    setIsLoading(true);
    // console.log("Fetching progress data...");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setWeightData(getMockWeightProgressData()); // Re-fetch or update mock data
    setActivityData(getMockActivityTrendsData());
    setCalorieData(getMockCalorieTrendsData());
    setIsLoading(false);
    // console.log("Progress data updated.");
  };

  // Fetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchData();
      // Return a cleanup function if needed, e.g., to cancel subscriptions
      return () => {
        /* console.log("Progress screen unfocused"); */
      };
    }, []),
  );

  const handleAddWeight = () => {
    console.log("Navigate to Add Weight Modal/Screen");
    // Example: router.push('/add-weight-modal'); // You would need to create this screen/modal
    // Ensure 'add-weight-modal' is defined in your app/(root)/_layout.tsx if it's a modal
    router.push({
      pathname: "/(root)/(tabs)/home", // Replace with a valid route from your app's route types
      params: { currentWeight: weightData.currentWeight },
    });
  };

  const handleChartIconPress = () => {
    console.log("Chart icon pressed - open filter/options");
    // Implement logic for chart options, e.g., show a modal to select date range
  };

  // If loading, you can show a spinner or skeleton loaders for each card
  if (isLoading && (!weightData || !activityData || !calorieData)) {
    // Initial load
    return (
      <LinearGradient
        colors={["#111827", "#172554", "#301934"]}
        className="flex-1 items-center justify-center"
      >
        <SafeAreaView edges={["top"]} className="w-full flex-1">
          <StatusBar
            barStyle="light-content"
            backgroundColor={screenBackgroundGradient[0]}
          />
          {/* You could put a global loading spinner here */}
          <View className="flex-1 items-center justify-center">
            {/* <ActivityIndicator size="large" color="#FFFFFF" /> */}
            <Text className="text-white">Loading Progress...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={screenBackgroundGradient} className="flex-1">
      <SafeAreaView edges={["top"]} className="flex-1">
        <StatusBar
          barStyle="light-content"
          backgroundColor={
            screenBackgroundGradient[0]
          }
        />
        <ProgressHeader onChartIconPress={handleChartIconPress} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-4 pb-6" // Horizontal padding for scroll content area
        >
          {/*
            If isLoading is true for a refresh, you might overlay spinners on cards
            or show skeleton versions. For simplicity, not implemented here.
          */}
          <WeightProgressCard
            data={weightData}
            onAddWeightPress={handleAddWeight}
          />
          <ActivityTrendsCard data={activityData} />
          <CalorieTrendsCard trends={calorieData} />

          {/* Optional: Add a "Load More" or "View History" button if applicable */}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ProgressScreen;