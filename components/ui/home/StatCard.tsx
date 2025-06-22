import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, ActivityIndicator } from "react-native"; // Added ActivityIndicator

import { StatCardData } from "@/types/health";

const StatCard: React.FC<StatCardData> = ({
  iconName,
  iconProvider = "FontAwesome5",
  iconClassName,
  title,
  value,
  subValue,
  subValueClassName,
  blurBgClassName,
}) => {
  const IconComponent = iconProvider === "Ionicons" ? Ionicons : FontAwesome5;

  return (
    <View
      className="relative grow basis-[48%] overflow-hidden rounded-xl border border-gray-700 bg-[#04132E] p-4"
      accessible
      accessibilityLabel={`${title}: ${value === null ? "Loading" : value || "Not available"}. ${subValue || ""}`}
    >
      {blurBgClassName && (
        <View
          className={`absolute right-0 top-0 h-16 w-16 rounded-full ${blurBgClassName}`}
        />
      )}

      <IconComponent
        name={iconName as any}
        size={20}
        className={`${iconClassName || "text-gray-400"} mb-2`}
      />
      <Text className="text-sm text-gray-400">{title}</Text>
      {value === null ? ( // If value is explicitly null (our loading state from merge)
        <View className="h-[28px] justify-center">
          <ActivityIndicator
            size="small"
            color={
              iconClassName?.includes("text-")
                ? iconClassName.split("text-")[1].split("-")[0] || "gray"
                : "gray"
            }
          />
        </View>
      ) : (
        <Text className="text-xl font-bold text-white">{value || "--"}</Text>
      )}
      {subValue && (
        <Text className={`text-xs ${subValueClassName || "text-gray-300"}`}>
          {subValue}
        </Text>
      )}
    </View>
  );
};

export default StatCard;