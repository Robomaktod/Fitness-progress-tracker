import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  useLocalSearchParams,
  useRouter,
  Stack,
  useNavigation,
} from "expo-router"; // Added useNavigation
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Image as RNImage,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ComparisonStatChart from "@/components/ui/social/ComparisonStatChart";
import {
  FriendData,
  ComparisonStat,
  ComparisonChartDataPoint,
} from "@/types/social";

// Mock data fetching functions (ensure chartData within ComparisonStat matches ComparisonChartDataPoint structure)
const fetchFriendDetailsAPI = async (
  friendId: string,
): Promise<FriendData | null> => {
  console.log("Fetching details for friend:", friendId);
  await new Promise((r) => setTimeout(r, 300));
  const mockFriends: FriendData[] = [
    {
      id: "f1",
      name: "Emma Wilson",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
      activitySummary: "",
      activityIconName: "fire",
    },
    {
      id: "f2",
      name: "Alex Chen",
      avatarUrl: "https://i.pravatar.cc/150?img=4",
      activitySummary: "",
      activityIconName: "dumbbell",
    },
    {
      id: "f3",
      name: "Lisa Thompson",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
      activitySummary: "",
      activityIconName: "person-running",
    },
  ];
  return mockFriends.find((f) => f.id === friendId) || null;
};

const fetchComparisonStatsAPI = async (
  userId: string,
  friendId: string,
): Promise<ComparisonStat[]> => {
  console.log(`Fetching comparison between ${userId} and ${friendId}`);
  await new Promise((r) => setTimeout(r, 500));
  const weeklyWorkoutsChartData: ComparisonChartDataPoint[] = [
    { label: "Wk1", userValue: 5, friendValue: 4 },
    { label: "Wk2", userValue: 3, friendValue: 5 },
    { label: "Wk3", userValue: 6, friendValue: 3 },
    { label: "Wk4", userValue: 4, friendValue: 4 },
    { label: "Wk5", userValue: 5, friendValue: 6 },
  ];
  const dailyStepsChartData: ComparisonChartDataPoint[] = [
    { label: "M", userValue: 10, friendValue: 8.5 },
    { label: "Tu", userValue: 12.3, friendValue: 9.2 },
    { label: "W", userValue: 8, friendValue: 11 },
    { label: "Th", userValue: 11.5, friendValue: 7.5 },
    { label: "F", userValue: 13, friendValue: 10 },
    { label: "Sa", userValue: 15, friendValue: 14 },
    { label: "Su", userValue: 7, friendValue: 6 },
  ];

  return [
    {
      id: "weeklyWorkouts",
      title: "Weekly Workouts",
      userValueDisplay: "Avg 5",
      friendValueDisplay: "Avg 4",
      unit: "qty",
      chartData: weeklyWorkoutsChartData,
      userLineColor: "#8B5CF6",
      friendLineColor: "#EC4899",
    },
    {
      id: "avgSteps",
      title: "Average Steps/Day (Last 7 days)",
      userValueDisplay: "10.2k",
      friendValueDisplay: "8.5k",
      unit: "k steps",
      chartData: dailyStepsChartData,
      userLineColor: "#3B82F6",
      friendLineColor: "#10B981",
    },
    {
      id: "activeMinutes",
      title: "Active Minutes/Week",
      userValueDisplay: "320 min",
      friendValueDisplay: "280 min",
      unit: "min",
    },
    {
      id: "challengesCompleted",
      title: "Challenges Completed (Month)",
      userValueDisplay: "3",
      friendValueDisplay: "5",
      unit: "qty",
    },
  ];
};

const screenBackgroundGradient: readonly [string, string, string] = [
  "#1F2937",
  "#111827",
  "#301934",
];

const FriendComparisonScreen: React.FC = () => {
  const router = useRouter();
  const navigation = useNavigation(); // For setting options dynamically
  const { friendId } = useLocalSearchParams<{ friendId?: string }>();
  const [friend, setFriend] = useState<FriendData | null>(null);
  const [comparisonStats, setComparisonStats] = useState<ComparisonStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllData = useCallback(async () => {
    if (!friendId) {
      setError("Friend ID missing.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [friendData, statsData] = await Promise.all([
        fetchFriendDetailsAPI(friendId),
        fetchComparisonStatsAPI("currentUser", friendId),
      ]);

      if (!friendData) {
        throw new Error("Friend not found.");
      }
      setFriend(friendData);
      setComparisonStats(statsData);
    } catch (err) {
      console.error("Failed to load comparison data:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [friendId]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Update header options once friend data is available
  useEffect(() => {
    if (friend) {
      navigation.setOptions({
        title: `You vs. ${friend.name}`,
        headerShown: true,
        headerTintColor: "#FFFFFF",
        headerStyle: { backgroundColor: screenBackgroundGradient[0] },
        headerTitleStyle: { color: "#FFFFFF", fontSize: 18 },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            className="ml-[-5px] p-2"
          >
            <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        ),
      });
    } else if (error) {
      navigation.setOptions({
        title: "Error",
        headerShown: true,
        headerTintColor: "#FFFFFF",
        headerStyle: { backgroundColor: screenBackgroundGradient[0] },
        headerTitleStyle: { color: "#FFFFFF", fontSize: 18 },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            className="ml-[-5px] p-2"
          >
            <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, friend, error, router, screenBackgroundGradient]);

  if (isLoading) {
    return (
      <LinearGradient
        colors={screenBackgroundGradient}
        className="flex-1 items-center justify-center"
      >
        {/* Explicitly render Stack.Screen for header to show while loading if desired */}
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Loading Comparison...",
            headerStyle: { backgroundColor: screenBackgroundGradient[0] },
            headerTintColor: "#FFF",
          }}
        />
        <StatusBar
          barStyle="light-content"
          backgroundColor={screenBackgroundGradient[0]}
        />
        <ActivityIndicator size="large" color="#FFFFFF" />
      </LinearGradient>
    );
  }

  if (error || !friend) {
    return (
      <LinearGradient colors={screenBackgroundGradient} className="flex-1">
        <SafeAreaView edges={["top"]} className="w-full flex-1">
          <StatusBar
            barStyle="light-content"
            backgroundColor={screenBackgroundGradient[0]}
          />
          {/* Error/Not Found State header handled by useEffect updating navigation.setOptions */}
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-center text-base text-red-400">
              {error || "Could not load friend details."}
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="mt-4 rounded-lg bg-indigo-500/50 px-4 py-2"
            >
              <Text className="text-white">Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Main content render when data is loaded and friend is not null
  return (
    <LinearGradient colors={screenBackgroundGradient} className="flex-1">
      <SafeAreaView edges={["top"]} className="flex-1">
        <StatusBar
          barStyle="light-content"
          backgroundColor={screenBackgroundGradient[0]}
        />
        {/* Header is now set by useEffect and navigation.setOptions */}
        {/* No <Stack.Screen /> needed here for options if dynamically set */}

        <ScrollView contentContainerClassName="p-4">
          <View className="mb-6 flex-row items-center rounded-lg border border-indigo-500/30 bg-dark-200/50 p-4">
            <View className="flex-1 items-center">
              <RNImage
                source={require("@/assets/images/icon.png")}
                className="mb-1 h-16 w-16 rounded-full border-2 border-blue-400"
              />
              <Text className="font-semibold text-white">You</Text>
            </View>
            <Text className="mx-3 text-2xl font-bold text-indigo-300">VS</Text>
            <View className="flex-1 items-center">
              <RNImage
                source={
                  friend.avatarUrl
                    ? { uri: friend.avatarUrl }
                    : require("@/assets/images/icon.png")
                }
                className="mb-1 h-16 w-16 rounded-full border-2 border-purple-400"
              />
              <Text className="font-semibold text-white">
                {friend.name.split(" ")[0]}
              </Text>
            </View>
          </View>

          {comparisonStats.map((stat) => (
            <View
              key={stat.id}
              className="mb-4 rounded-lg border border-gray-700/50 bg-dark-200/60 p-4"
            >
              <Text className="mb-2 text-lg font-semibold text-indigo-300">
                {stat.title}
              </Text>
              <View className="mb-3 flex-row justify-around">
                <View className="items-center">
                  <Text className="text-sm text-gray-400">You</Text>
                  <Text className="text-2xl font-bold text-blue-400">
                    {stat.userValueDisplay}
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-sm text-gray-400">
                    {friend.name.split(" ")[0]}
                  </Text>
                  <Text className="text-2xl font-bold text-purple-400">
                    {stat.friendValueDisplay}
                  </Text>
                </View>
              </View>
              {stat.chartData && stat.chartData.length > 0 && (
                <ComparisonStatChart
                  chartDataPoints={stat.chartData}
                  yAxisSuffix={stat.unit || ""}
                  userLineColor={stat.userLineColor || "#3B82F6"}
                  friendLineColor={stat.friendLineColor || "#A78BFA"}
                  xAxisLabelWidth={35}
                />
              )}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};
export default FriendComparisonScreen;