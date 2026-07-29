import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { View, Text } from "react-native";

import AddFoodModal from "@/app/(root)/add-food";
import CustomButton from "@/components/shared/CustomButton";
import GradientText from "@/components/shared/GradientText";
import ScoreCircle from "@/components/ui/home/ScoreCircle";

const HeroSection: React.FC = () => {
  const todayScore = 100;
  const todayMaxScore = 100;
  const [isAddFoodModalVisible, setIsAddFoodModalVisible] = useState(false);

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
              onPress={() => setIsAddFoodModalVisible(true)}
              bgVariant="default"
              textVariant="default"
              className="w-full"
              gradientStyles="py-3"
              accessibilityLabel="Add food"
            />
          </View>
        </View>
      </LinearGradient>
      {isAddFoodModalVisible && (
        <AddFoodModal
          isVisible={isAddFoodModalVisible}
          onClose={() => setIsAddFoodModalVisible(false)}
          onSaveFood={() => setIsAddFoodModalVisible(false)}
          targetMealName={null}
        />
      )}
    </View>
  );
};

export default HeroSection;
