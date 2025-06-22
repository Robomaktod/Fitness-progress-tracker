import { FontAwesome5, Ionicons } from "@expo/vector-icons"; // Import both for flexibility
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import SectionCard from "@/components/ui/progress/SectionCard"; // Reuse SectionCard for consistent card styling
import { ActivityLogItemData, ActivityMetric } from "@/types/health";

interface ActivityLogCardProps {
  item: ActivityLogItemData;
  onMoreOptionsPress?: (itemId: string) => void;
}

const MetricDisplay: React.FC<{ metric: ActivityMetric }> = ({ metric }) => (
  <View className="flex-1 items-center px-1">
    <Text className="mb-0.5 text-xs capitalize text-gray-400">
      {metric.label}
    </Text>
    <Text className="text-lg font-bold text-white">
      {metric.value}
      {metric.unit && (
        <Text className="text-sm font-normal"> {metric.unit}</Text>
      )}
    </Text>
  </View>
);

const ActivityLogCard: React.FC<ActivityLogCardProps> = ({
  item,
  onMoreOptionsPress,
}) => {
  const IconComponent =
    item.iconProvider === "Ionicons" ? Ionicons : FontAwesome5;
  // Determine card's border/shadow color based on activity type or use a default
  const cardAccentColor = item.iconBgClassName?.includes("green")
    ? "#22C55E" // Example logic
    : item.iconBgClassName?.includes("blue")
      ? "#3B82F6"
      : item.iconBgClassName?.includes("purple")
        ? "#8B5CF6"
        : "#4B5563"; // Default gray-600

  return (
    // Reusing SectionCard but overriding background for a less transparent look like in image
    <SectionCard
      borderColorClassName={`border-[${cardAccentColor}]/30`}
      shadowColor={cardAccentColor}
      className="bg-dark-200/80" // Slightly less transparent than progress cards based on image
      aria-label={`Activity: ${item.activityName}`}
    >
      <View className="mb-3 flex-row items-start justify-between">
        <View className="flex-row items-center">
          <View
            className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${item.iconBgClassName || "bg-gray-700/50"}`}
          >
            <IconComponent
              name={item.iconName as any}
              size={18}
              className={
                item.iconBgClassName?.includes("green")
                  ? "text-green-400" // Match icon color to bg
                  : item.iconBgClassName?.includes("blue")
                    ? "text-blue-400"
                    : item.iconBgClassName?.includes("purple")
                      ? "text-purple-400"
                      : "text-gray-300"
              }
            />
          </View>
          <View>
            <Text className="text-lg font-semibold text-white">
              {item.activityName}
            </Text>
            <Text className="text-xs text-gray-400">
              {item.activityDetails}
            </Text>
          </View>
        </View>
        {onMoreOptionsPress && (
          <TouchableOpacity
            onPress={() => onMoreOptionsPress(item.id)}
            className="-mr-1.5 -mt-1.5 p-1.5" // Adjust hit slop
            accessibilityLabel="More options for this activity"
          >
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              className="text-gray-500"
            />
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-row items-center justify-around pt-2">
        {item.metrics.map((metric, index) => (
          <MetricDisplay key={`${metric.label}-${index}`} metric={metric} />
        ))}
      </View>
    </SectionCard>
  );
};

export default ActivityLogCard;