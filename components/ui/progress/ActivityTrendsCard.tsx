import React from "react";
import { View, Text } from "react-native";

import SectionCard from "@/components/ui/progress/SectionCard";
import { ActivityTrendsData, ActivityTrendDay } from "@/types/health"; // From your types/health.ts

interface ActivityTrendsCardProps {
  data: ActivityTrendsData;
}

// Internal component for rendering a single day's bar in the activity trend chart
const ActivityDayBar: React.FC<{
  dayData: ActivityTrendDay;
  barColorClass?: string;
}> = ({
  dayData,
  barColorClass = "bg-cyan-500/60", // Default bar color (cyan with opacity)
}) => {
  // Bar height is a percentage of the container's height.
  // Clamp activePercent between 0 and 100.
  const barHeightPercent = Math.min(100, Math.max(0, dayData.activePercent));

  return (
    <View
      className="relative h-20 items-center justify-end overflow-hidden rounded-lg bg-dark-100/50"
      // Using dark-100 with opacity. The HTML uses bg-gray-800. Adjust if dark-100 is too light.
      aria-label={`${dayData.dayInitial}: ${dayData.activePercent}% active`}
    >
      {/* The colored bar representing activity level */}
      {!dayData.isFuture &&
        barHeightPercent > 0 && ( // Only render if not future and has activity
          <View
            className={`absolute bottom-0 w-full ${barColorClass}`}
            style={{ height: `${barHeightPercent}%` }}
            accessibilityValue={{
              min: 0,
              max: 100,
              now: dayData.activePercent,
            }}
          />
        )}
      {/* Day initial label at the bottom */}
      <Text className="relative z-10 pb-1 pt-0.5 text-[10px] text-gray-400">
        {/* z-10 to ensure text is above the bar if bar is 100% height */}
        {dayData.dayInitial}
      </Text>
    </View>
  );
};

const ActivityTrendsCard: React.FC<ActivityTrendsCardProps> = ({ data }) => {
  const {
    weeklyActiveDaysLabel,
    daysCompleted,
    totalDaysInWeek,
    dailyBreakdown,
  } = data;

  return (
    <SectionCard
      borderColorClassName="border-cyan-500/30" // Cyan border, 30% opacity
      shadowColor="#06B6D4" // Cyan shadow/glow tint (Tailwind cyan-500)
      aria-label="Activity Trends Section"
    >
      <Text className="mb-1 text-lg font-semibold text-gray-200">
        Activity Trends
      </Text>

      <View className="mb-3">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-sm text-gray-400">{weeklyActiveDaysLabel}</Text>
          <Text className="text-sm font-bold text-cyan-400">
            {daysCompleted}/{totalDaysInWeek}
          </Text>
        </View>

        {/* Bar Chart Representation */}
        <View className="grid grid-cols-7 gap-1.5">
          {/*
            NativeWind's `grid` and `grid-cols-7` are for web.
            In React Native, we need to use `flexDirection: 'row'` and manage item width.
            Alternatively, map items and give them flex-1 or specific width.
            Let's use flexbox for React Native.
          */}
          <View className="flex-row justify-between space-x-1">
            {dailyBreakdown.map((dayData, index) => (
              <View key={index} className="flex-1">
                {/* flex-1 makes each bar take equal width within the row */}
                <ActivityDayBar
                  dayData={dayData}
                  barColorClass="bg-cyan-500/70"
                />
              </View>
            ))}
          </View>
        </View>
      </View>
      {/* Add more trends if needed, e.g., "Total Steps This Week" */}
    </SectionCard>
  );
};

export default ActivityTrendsCard;