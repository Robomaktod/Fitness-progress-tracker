import React from "react";
import { View } from "react-native";

import GradientText from "@/components/shared/GradientText";

const foodLogTitleGradient: [string, string] = ["#22D3EE", "#3B82F6"]; 

const NutritionLogHeader = () => {
  return (
    <View className="flex-row items-center justify-between px-5 pb-2 pt-4">
      <GradientText
        colors={foodLogTitleGradient}
        className="text-2xl font-bold"
      >
        Food Log
      </GradientText>
    </View>
  );
};
export default NutritionLogHeader;