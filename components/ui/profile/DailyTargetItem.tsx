import React from "react";
import { View, Text } from "react-native";

import SimpleProgressBar from "@/components/ui/progress/SimpleProgressBar"; // Reusing from Progress

interface DailyTargetItemProps {
  label: string;
  value: string;
  unit?: string;
  valueClassName?: string;
  // Add progress props if these bars should show progress
  // progressPercent?: number;
  // progressGradient?: readonly [string, string, ...string[]];
}

const DailyTargetItem: React.FC<DailyTargetItemProps> = ({
  label,
  value,
  unit,
  valueClassName,
  // progressPercent = 0, // Example default if showing progress
  // progressGradient
}) => {
  return (
    <View>
      <View className="mb-1.5 flex-row justify-between text-sm">
        <Text className="text-gray-400">{label}</Text>
        <Text className={`font-semibold ${valueClassName || "text-white"}`}>
          {value}
          {unit && ` ${unit}`}
        </Text>
      </View>
      {/* The image shows empty tracks. If they can fill, use SimpleProgressBar */}
      <View className="h-2 rounded-full bg-dark-100/50" />
      {/* <SimpleProgressBar
        progressPercent={progressPercent}
        trackColorClassName="bg-dark-100/50" // Your dark theme
        progressGradientColors={progressGradient}
        barHeightClassName="h-1.5"
      /> */}
    </View>
  );
};

export default DailyTargetItem;
