import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, View, StatusBar, Text } from "react-native"; // Added Text for placeholders
import { SafeAreaView } from "react-native-safe-area-context";

import ActivityStatsSection from "@/components/ui/home/ActivityStatsSection";
import AppHeader from "@/components/ui/home/AppHeader";
import HeroSection from "@/components/ui/home/HeroSection";
// Import other section components as you build them:
// import WeeklyProgressSection from '@/components/ui/home/WeeklyProgressSection';
// import UpcomingWorkoutsSection from '@/components/ui/home/UpcomingWorkoutsSection';
// import ActiveChallengesSection from '@/components/ui/home/ActiveChallengesSection';
// import TodaysNutritionSection from '@/components/ui/home/TodaysNutritionSection';

const HomeScreen: React.FC = () => {
  return (
    <LinearGradient
      className="flex-1 transition-all duration-300"
      colors={["#111827", "#3b0764", "#172554"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView edges={["top"]} className="flex-1">
        <StatusBar barStyle="light-content" backgroundColor="#252525" />

        <AppHeader />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-6"
        >
          <HeroSection />

          <ActivityStatsSection />

          <View className="mt-2 px-4 py-3">
            <View className="mb-3 rounded-lg border border-gray-700 bg-dark-200 p-4">
              <Text className="mb-2 text-lg font-semibold text-white">
                Weekly Progress
              </Text>
              <Text className="text-gray-400">
                (Placeholder: Bar chart and summary would go here.)
              </Text>
            </View>

            <View className="mb-3 rounded-lg border border-gray-700 bg-dark-200 p-4">
              <Text className="mb-2 text-lg font-semibold text-white">
                Upcoming Workouts
              </Text>
              <Text className="text-gray-400">
                (Placeholder: List of workout cards.)
              </Text>
            </View>

            <View className="mb-3 rounded-lg border border-gray-700 bg-dark-200 p-4">
              <Text className="mb-2 text-lg font-semibold text-white">
                Active Challenges
              </Text>
              <Text className="text-gray-400">
                (Placeholder: Horizontal scroll list of challenge cards.)
              </Text>
            </View>

            <View className="rounded-lg border border-gray-700 bg-dark-200 p-4">
              <Text className="mb-2 text-lg font-semibold text-white">
                Today's Nutrition
              </Text>
              <Text className="text-gray-400">
                (Placeholder: Nutrition summary and meal logs.)
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomeScreen;
