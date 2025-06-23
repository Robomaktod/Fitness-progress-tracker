import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  useLocalSearchParams,
  useRouter,
  Stack,
  useNavigation,
} from "expo-router";
import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Image as RNImage,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ComparisonStatChart from "@/components/ui/social/ComparisonStatChart";
import { ComparisonStat } from "@/types/social";
import { useAuth } from "@clerk/clerk-expo";
import { useFriendDetails, useFriendComparison } from "@/api/useFriendComparison";

const screenBackgroundGradient: readonly [string, string, string] = [
  "#1F2937",
  "#111827",
  "#301934",
];

const FriendComparisonScreen: React.FC = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { friendId } = useLocalSearchParams<{ friendId?: string }>();
  const { userId } = useAuth();

  // Use real API hooks
  const {
    data: friend,
    isLoading: isFriendLoading,
    error: friendError,
  } = useFriendDetails(friendId || "");

  const {
    data: comparisonStats,
    isLoading: isComparisonLoading,
    error: comparisonError,
  } = useFriendComparison(userId ?? "", friendId || "");

  const isLoading = isFriendLoading || isComparisonLoading;
  const error = friendError?.message || comparisonError?.message || null;

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
  }, [navigation, friend, error, router]);

  if (isLoading) {
    return (
      <LinearGradient
        colors={screenBackgroundGradient}
        className="flex-1 items-center justify-center"
      >
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

          {(comparisonStats as ComparisonStat[] | undefined)?.map((stat) => (
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