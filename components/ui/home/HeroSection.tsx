import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text } from "react-native";

import CustomButton from "@/components/shared/CustomButton"; // Your CustomButton
import GradientText from "@/components/shared/GradientText"; // Your GradientText

// eslint-disable-next-line import/no-unresolved
import ScoreCircle from "@/components/ui/home/ScoreCircle";

// Assuming you might want specific gradients for this section from your constants
// If not, you can use 'default' or define inline
// For example, if you add 'heroBackground' or 'healthScoreText' to your constants.gradients

const HeroSection: React.FC = () => {
  const userName = "Alex"; // This would typically come from auth state/context
  const todayScore = 100;
  const todayMaxScore = 100;

  const handleStartWorkout = () => {
    console.log("Start Today's Workout pressed");
    // Navigate to workout screen or start workout flow
    // Example: router.push('/start-workout');
  };

  return (
    <View className="px-4 pb-6 pt-5">
      <LinearGradient
        colors={["#0C0F3B", "#00071E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="relative overflow-hidden rounded-3xl border border-[#1B2551] p-5"
      >
        <View className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/10" />
        <View className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-purple-500/10" />

        <Text
          className="mb-1 text-2xl font-bold text-white"
          accessible
          accessibilityRole="header"
        >
          Calorie Progress
        </Text>

        <View className="mb-6 flex-row items-center justify-between p-4">
          <ScoreCircle size={100} scorePercentage={todayScore} />
          <View className="">
            <Text className="text-sm text-gray-400">Today's Score</Text>
            <GradientText bgVariant="default" className="text-2xl font-bold">
              {todayScore}
              <Text className="text-base text-blue-400">/{todayMaxScore}</Text>
            </GradientText>
            <CustomButton
              title="Add food"
              onPress={handleStartWorkout}
              bgVariant="default" // Use 'default' or a specific variant like 'primaryAction' from your gradients
              textVariant="default" // As per your CustomButton, 'default' is likely white text
              className="w-full" // Ensure it takes full width if needed
              gradientStyles="py-3" // Padding inside the gradient, adjust as needed
              accessibilityLabel="Start Today's Workout session"
            />
          </View>
        </View>

        {/* Action Button */}
      </LinearGradient>
    </View>
  );
};

export default HeroSection;