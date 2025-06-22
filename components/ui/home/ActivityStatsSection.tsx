
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text } from "react-native";

import StatCard from "@/components/ui/home/StatCard";
import { STATIC_ACTIVITY_CARDS } from "@/constants";
import { StatCardData } from "@/types/health";
import { ActivityStatsSectionProps } from "@/types/type";

const ActivityStatsSection: React.FC<ActivityStatsSectionProps> = ({
  dynamicStatsData,
  isLoading,
  error,
}) => {
  if (error) {
    return (
      <View className="h-40 items-center justify-center rounded-lg bg-red-900/30 px-4 py-6">
        <Text className="text-red-400">
          Error loading activity data: {error}
        </Text>
      </View>
    );
  }

  const mergedStats: StatCardData[] = STATIC_ACTIVITY_CARDS.map(
    (staticCard) => {
      const dynamicData = dynamicStatsData?.[staticCard.id];
      return {
        id: staticCard.id,
        title: staticCard.title,
        iconName: staticCard.defaultIconName, // Use static icon
        iconProvider: staticCard.defaultIconProvider, // Use static provider
        iconClassName: staticCard.defaultIconClassName, // Use static class
        value: isLoading ? null : (dynamicData?.value ?? "--"), // Show loading or placeholder
        subValue: isLoading ? null : (dynamicData?.subValue ?? undefined),
        subValueClassName:
          dynamicData?.subValueClassName ||
          staticCard.defaultIconClassName?.replace("text-", "text-") ||
          "text-gray-400", // Example derived or default
        blurBgClassName:
          dynamicData?.blurBgClassName || staticCard.defaultBlurBgClassName,
      };
    },
  );

  return (
    <View className="px-4 py-6">
      <LinearGradient
        colors={["#0C0F3B", "#00071E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="relative overflow-hidden rounded-3xl border border-[#3D1C6D] p-5"
      >
        <View className="mb-4 flex-row items-center">
          <FontAwesome5 name="chart-line" size={18} className="text-blue-400" />
          <Text className="ml-2 text-xl font-bold text-white">
            Your Activity
          </Text>
        </View>
        <View className="flex-row flex-wrap justify-between gap-2">
          {mergedStats.map((stat) => (
            <StatCard
              key={stat.id}
              {...stat}
              // If value is explicitly null due to loading, StatCard can handle this
              value={stat.value === null ? "" : stat.value} // Pass empty string for loading, or let StatCard handle null
              // Optionally, StatCard can have its own internal loading state display for value
            />
          ))}
        </View>
      </LinearGradient>
    </View>
  );
};

export default ActivityStatsSection;