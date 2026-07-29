import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { ActivityTypeOption } from "@/types/health";

interface ActivityTypeCardProps {
  option: ActivityTypeOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const ActivityTypeCard: React.FC<ActivityTypeCardProps> = ({
  option,
  isSelected,
  onSelect,
}) => {
  const IconComponent =
    option.iconProvider === "Ionicons" ? Ionicons : FontAwesome5;
  const baseCardClasses = "rounded-xl p-4 items-center justify-center w-[48%]"; // For two-column layout
  const selectedClasses = "bg-purple-600 border-purple-400 border-2";
  const unselectedClasses = "bg-dark-200/70 border-gray-700 border";

  return (
    <TouchableOpacity
      onPress={() => onSelect(option.id)}
      className={`${baseCardClasses} ${isSelected ? selectedClasses : unselectedClasses} ${option.cardClassName ?? ""}`}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected, checked: isSelected }} // 'checked' for radio-like behavior
      accessibilityLabel={`Select activity type: ${option.name}`}
    >
      <View
        className={`mb-2 h-12 w-12 items-center justify-center rounded-full ${isSelected ? "bg-white/20" : option.iconClassName?.includes("green") ? "bg-green-500/20" : "bg-purple-500/20"} `}
      >
        <IconComponent
          name={option.iconName as any}
          size={24}
          className={
            isSelected
              ? "text-white"
              : option.iconClassName || "text-purple-400"
          }
        />
      </View>
      <Text
        className={`font-semibold ${isSelected ? "text-white" : "text-gray-200"}`}
      >
        {option.name}
      </Text>
      <Text
        className={`mt-1 text-center text-xs ${isSelected ? "text-purple-200" : "text-gray-400"}`}
      >
        {option.description}
      </Text>
    </TouchableOpacity>
  );
};

export default ActivityTypeCard;
