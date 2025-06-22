import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { MealTimeOption, MealName } from "@/types/health";

interface MealTimeSelectorProps {
  options: MealTimeOption[];
  selectedMealTime: MealName | null;
  onSelectMealTime: (mealTime: MealName) => void;
}

const MealTimeSelector: React.FC<MealTimeSelectorProps> = ({
  options,
  selectedMealTime,
  onSelectMealTime,
}) => {
  return (
    <View className="flex-row flex-wrap justify-between">
      {options.map((option) => {
        const isSelected = selectedMealTime === option.id;
        const IconComponent =
          option.iconProvider === "Ionicons" ? Ionicons : FontAwesome5;
        return (
          <TouchableOpacity
            key={option.id}
            onPress={() => onSelectMealTime(option.id)}
            className={`mb-2.5 w-[48%] flex-row items-center justify-center space-x-2 rounded-lg border p-3 ${isSelected ? "border-purple-400 bg-purple-600" : "border-gray-700 bg-dark-200/60"} `}
            activeOpacity={0.7}
            accessibilityState={{ selected: isSelected, checked: isSelected }}
          >
            <IconComponent
              name={option.iconName as any}
              size={16}
              className={isSelected ? "text-white" : "text-gray-400"}
            />
            <Text
              className={`font-medium ${isSelected ? "text-white" : "text-gray-300"}`}
            >
              {option.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default MealTimeSelector;