import React from "react";
import { View, Text } from "react-native";

import SectionCard from "@/components/ui/progress/SectionCard";
import SimpleProgressBar from "@/components/ui/progress/SimpleProgressBar";
import { CalorieTrendItemData } from "@/types/health"; // From your types/health.ts

// eslint-disable-next-line import/no-unresolved

interface CalorieTrendsCardProps {
  trends: CalorieTrendItemData[];
}

const CalorieTrendRow: React.FC<{ item: CalorieTrendItemData }> = ({
  item,
}) => {
  // Default gradient colors from the image (green-500 to emerald-400)
  const defaultGradient: readonly [string, string] = ["#22C55E", "#10B981"]; // Tailwind green-500, emerald-500 (or green-600)

  return (
    <View
      className="rounded-xl bg-dark-100/60 p-3" // Using dark-100 with opacity. HTML used bg-gray-900/50.
      aria-label={`${item.label}: ${item.value}, ${item.progressPercent}% of target`}
    >
      <View className="mb-1.5 flex-row items-center justify-between">
        <Text className="text-sm text-gray-300">{item.label}</Text>
        <Text
          className={`text-sm font-bold ${item.progressPercent >= 100 ? "text-green-400" : "text-green-400"}`}
        >
          {/* Color could change if over/under target */}
          {item.value}
        </Text>
      </View>
      <SimpleProgressBar
        progressPercent={item.progressPercent}
        progressGradientColors={defaultGradient} // Using the defined green gradient
        trackColorClassName="bg-gray-700" // Matching HTML's bg-gray-800 for track
        barHeightClassName="h-1.5" // Slightly thinner bar like in image
      />
    </View>
  );
};

const CalorieTrendsCard: React.FC<CalorieTrendsCardProps> = ({ trends }) => {
  return (
    <SectionCard
      borderColorClassName="border-green-500/30" // Green border, 30% opacity
      shadowColor="#22C55E" // Green shadow/glow tint (Tailwind green-500)
      aria-label="Calorie Trends Section"
    >
      <Text className="mb-3 text-lg font-semibold text-gray-200">
        Calorie Trends
      </Text>

      <View className="space-y-2.5">
        {trends.map((trendItem) => (
          <CalorieTrendRow key={trendItem.id} item={trendItem} />
        ))}
      </View>
    </SectionCard>
  );
};

export default CalorieTrendsCard;
