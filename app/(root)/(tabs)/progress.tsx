import { useAuth } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  View,
  StatusBar,
  Text,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  useWeightProgress,
  useActivityTrends,
  useCalorieTrends,
  useAddWeight,
} from "@/api/useProgressQueries";
import ActivityTrendsCard from "@/components/ui/progress/ActivityTrendsCard";
import CalorieTrendsCard from "@/components/ui/progress/CalorieTrendsCard";
import ProgressHeader from "@/components/ui/progress/ProgressHeader";
import WeightProgressCard from "@/components/ui/progress/WeightProgressCard";
import {
  WeightProgressData,
  ActivityTrendsData,
  CalorieTrendItemData,
} from "@/types/health";

const screenBackgroundGradient: [string, string, ...string[]] = [
  "#111827",
  "#172554",
  "#301934",
];

const ProgressScreen: React.FC = () => {
  const router = useRouter();
  const { userId } = useAuth();

  const {
    data: weightData,
    isLoading: isLoadingWeight,
    refetch: refetchWeight,
  } = useWeightProgress(userId ?? "");
  const {
    data: activityData,
    isLoading: isLoadingActivity,
    refetch: refetchActivity,
  } = useActivityTrends(userId ?? "");
  const {
    data: calorieData,
    isLoading: isLoadingCalories,
    refetch: refetchCalories,
  } = useCalorieTrends(userId ?? "");

  const [showWeightInfo, setShowWeightInfo] = useState(false);
  const [showAddWeightModal, setShowAddWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [addWeightError, setAddWeightError] = useState<string | null>(null);

  // Fix: Use isPending for TanStack Query v5, fallback to false if not available
  const { mutate: addWeight, isPending } = useAddWeight(userId ?? "", {
    onSuccess: () => {
      setShowAddWeightModal(false);
      setNewWeight("");
      setAddWeightError(null);
      refetchWeight();
    },
    onError: (error: any) => {
      setAddWeightError(error?.message || "Failed to add weight. Try again.");
    },
  });
  const isAddingWeight = typeof isPending !== "undefined" ? isPending : false;

  // Show info popup if duplicate date detected in weightData
  React.useEffect(() => {
    if (weightData && weightData.history) {
      const dateCounts = weightData.history.reduce(
        (acc: Record<string, number>, entry: { date: string }) => {
          acc[entry.date] = (acc[entry.date] || 0) + 1;
          return acc;
        },
        {},
      );
      if (Object.values(dateCounts).some((count) => (count as number) > 1)) {
        setShowWeightInfo(true);
      }
    }
  }, [weightData]);

  // Refetch all on focus
  useFocusEffect(
    useCallback(() => {
      refetchWeight();
      refetchActivity();
      refetchCalories();
    }, [refetchWeight, refetchActivity, refetchCalories]),
  );

  const handleAddWeight = () => {
    setShowAddWeightModal(true);
  };

  // Blank data for empty charts/sliders
  const blankWeightData: WeightProgressData = {
    currentWeight: 0,
    weightUnit: "kg",
    change: 0,
    goalWeight: 0,
    history: [],
  };
  const blankActivityData: ActivityTrendsData = {
    weeklyActiveDaysLabel: "",
    daysCompleted: 0,
    totalDaysInWeek: 7,
    dailyBreakdown: [],
  };
  const blankCalorieData: CalorieTrendItemData[] = [];

  if (isLoadingWeight || isLoadingActivity || isLoadingCalories) {
    return (
      <LinearGradient
        colors={screenBackgroundGradient}
        className="flex-1 items-center justify-center"
      >
        <SafeAreaView edges={["top"]} className="w-full flex-1">
          <StatusBar
            barStyle="light-content"
            backgroundColor={screenBackgroundGradient[0]}
          />
          <View className="flex-1 items-center justify-center">
            <Text className="text-white">Loading Progress...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Add missing handleChartIconPress stub
  const handleChartIconPress = () => {};

  return (
    <LinearGradient colors={screenBackgroundGradient} className="flex-1">
      <SafeAreaView edges={["top"]} className="flex-1">
        <StatusBar
          barStyle="light-content"
          backgroundColor={screenBackgroundGradient[0]}
        />
        <ProgressHeader onChartIconPress={handleChartIconPress} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-4 pb-6"
        >
          <WeightProgressCard
            data={weightData || blankWeightData}
            onAddWeightPress={handleAddWeight}
          />
          <ActivityTrendsCard data={activityData || blankActivityData} />
          <CalorieTrendsCard trends={calorieData || blankCalorieData} />
        </ScrollView>
        {/* Info Modal for duplicate weight entries */}
        <Modal
          visible={showWeightInfo}
          transparent
          animationType="fade"
          onRequestClose={() => setShowWeightInfo(false)}
        >
          <View className="flex-1 items-center justify-center bg-black/60 px-8">
            <View className="rounded-2xl bg-dark-200 p-6 shadow-lg">
              <Text className="mb-3 text-center text-lg font-bold text-purple-400">
                Weight Already Entered Today
              </Text>
              <Text className="mb-4 text-center text-base text-gray-200">
                You have already entered your weight for today. You can only add
                one weight entry per day.
              </Text>
              <Pressable
                onPress={() => setShowWeightInfo(false)}
                className="mt-2 rounded-lg bg-purple-500/80 px-6 py-2"
              >
                <Text className="text-center font-semibold text-white">OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        {/* Add Weight Modal */}
        <Modal
          visible={showAddWeightModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAddWeightModal(false)}
        >
          <View className="flex-1 items-center justify-center bg-black/60 px-8">
            <View className="w-full max-w-md rounded-2xl bg-dark-200 p-6 shadow-lg">
              <Text className="mb-3 text-center text-lg font-bold text-purple-400">
                Add New Weight
              </Text>
              <Text className="mb-2 text-center text-base text-gray-200">
                Enter your current weight:
              </Text>
              <View className="mb-4 flex-row items-center justify-center">
                <TextInput
                  value={newWeight}
                  onChangeText={setNewWeight}
                  placeholder="e.g. 70.5"
                  keyboardType="decimal-pad"
                  className="w-32 rounded-lg bg-dark-100 px-4 py-2 text-center text-white"
                />
                <Text className="ml-2 text-gray-300">
                  {weightData?.weightUnit || "kg"}
                </Text>
              </View>
              {addWeightError && (
                <Text className="mb-2 text-center text-red-400">
                  {addWeightError}
                </Text>
              )}
              <View className="flex-row justify-center space-x-4">
                <Pressable
                  onPress={() => setShowAddWeightModal(false)}
                  className="rounded-lg bg-gray-500/80 px-6 py-2"
                  disabled={isAddingWeight}
                >
                  <Text className="text-center font-semibold text-white">
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    const weightNum = parseFloat(newWeight);
                    if (isNaN(weightNum) || weightNum <= 0) {
                      setAddWeightError("Please enter a valid weight.");
                      return;
                    }
                    // Restrict to one entry per day
                    const today = new Date().toISOString().slice(0, 10);
                    const alreadyEnteredToday = weightData?.history?.some(
                      (entry: any) => entry.date === today,
                    );
                    if (alreadyEnteredToday) {
                      setShowAddWeightModal(false);
                      setShowWeightInfo(true);
                      return;
                    }
                    addWeight({ weight: weightNum });
                  }}
                  className="rounded-lg bg-purple-500/80 px-6 py-2"
                  disabled={isAddingWeight}
                >
                  <Text className="text-center font-semibold text-white">
                    {isAddingWeight ? "Adding..." : "Add"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ProgressScreen;
