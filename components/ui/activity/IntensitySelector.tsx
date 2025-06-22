import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { ActivityIntensity } from "@/types/health";

interface IntensitySelectorProps {
  selectedIntensity: ActivityIntensity | null;
  onSelectIntensity: (intensity: ActivityIntensity) => void;
}

const INTENSITIES: ActivityIntensity[] = ["Light", "Moderate", "Intense"];

const IntensitySelector: React.FC<IntensitySelectorProps> = ({
  selectedIntensity,
  onSelectIntensity,
}) => {
  const getIntensityColor = (
    intensity: ActivityIntensity,
    isSelected: boolean,
  ) => {
    if (isSelected) return "bg-orange-500 border-orange-400"; // Active color like in image
    return "bg-dark-200/60 border-gray-700";
  };

  const getTextColor = (isSelected: boolean) => {
    return isSelected ? "text-white" : "text-gray-300";
  };

  return (
    <View className="flex-row justify-between space-x-2">
      {INTENSITIES.map((intensity) => {
        const isSelected = selectedIntensity === intensity;
        return (
          <TouchableOpacity
            key={intensity}
            onPress={() => onSelectIntensity(intensity)}
            className={`flex-1 items-center justify-center rounded-lg border py-3 ${getIntensityColor(intensity, isSelected)}`}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected, checked: isSelected }}
            accessibilityLabel={`Select intensity: ${intensity}`}
          >
            <Text className={`font-medium ${getTextColor(isSelected)}`}>
              {intensity}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default IntensitySelector;