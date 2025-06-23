import { FontAwesome5 } from "@expo/vector-icons"; // For the '+' icon in the button
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { Dimensions } from "react-native";

import SectionCard from "@/components/ui/progress/SectionCard";
import { WeightProgressData } from "@/types/health"; // Assuming types are in types/health.ts

interface WeightProgressCardProps {
  data: WeightProgressData;
  onAddWeightPress: () => void;
}

const WeightStatDisplay: React.FC<{
  label: string;
  value: string;
  unit: string;
  valueClassName?: string;
}> = ({
  label,
  value,
  unit,
  valueClassName = "text-white", // Default color
}) => (
  <View className="items-center">
    <Text className="mb-0.5 text-xs text-gray-400">{label}</Text>
    <Text className={`text-2xl font-bold ${valueClassName}`}>
      {value}
      <Text className="ml-1 text-sm font-normal">{unit}</Text>
    </Text>
  </View>
);

const WeightProgressCard: React.FC<WeightProgressCardProps> = ({
  data,
  onAddWeightPress,
}) => {
  const { currentWeight, weightUnit, change, goalWeight, history } = data;

  // Prepare chart data for react-native-gifted-charts
  const chartData = history.map((entry) => ({
    value: entry.weight,
    label: entry.date.slice(5),
    dataPointText: entry.weight.toString(),
  }));
  const screenWidth = Dimensions.get("window").width;

  return (
    <SectionCard
      borderColorClassName="border-purple-500/30"
      shadowColor="#8B5CF6"
      aria-label="Weight Progress Section"
    >
      {/* Header: Title and Add Weight Button */}
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-gray-200">
          Weight Progress
        </Text>
        <TouchableOpacity
          onPress={onAddWeightPress}
          className="flex-row items-center rounded-full border border-purple-500/50 bg-purple-500/20 px-3 py-1.5"
          // bg-purple-500/20: 20% opacity purple background
          // border-purple-500/50: 50% opacity purple border
          activeOpacity={0.7}
          accessibilityLabel="Add new weight entry"
          accessibilityRole="button"
        >
          <FontAwesome5
            name="plus"
            size={10}
            className="mr-1.5 text-purple-400"
          />
          <Text className="text-sm font-medium text-purple-400">
            Add Weight
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats: Current, Change, Goal */}
      <View className="mb-6 flex-row items-center justify-between">
        <WeightStatDisplay
          label="Current"
          value={currentWeight.toFixed(1)}
          unit={weightUnit}
          valueClassName="text-purple-400" // Matching image style
        />
        <WeightStatDisplay
          label="Change"
          value={`${change >= 0 ? "+" : ""}${change.toFixed(1)}`} 
          unit={weightUnit}
          valueClassName={change < 0 ? "text-green-400" : "text-red-400"} // Green for loss, Red for gain (or vice-versa)
        />
        <WeightStatDisplay
          label="Goal"
          value={goalWeight.toFixed(1)}
          unit={weightUnit}
          valueClassName="text-gray-300" // Neutral color for goal
        />
      </View>

      {/* Chart Placeholder */}
      <View className="relative mb-2 h-[200px] items-center justify-center rounded-md bg-dark-100/30">
        {chartData.length > 0 ? (
          <LineChart
            isAnimated
            animationDuration={800}
            data={chartData}         
            height={180}
            width={screenWidth - 64}
            color="#8B5CF6"
            textColor1="#8B5CF6"
            dataPointsColor1="#8B5CF6"
            dataPointsRadius={3}
            xAxisLabelTexts={chartData.map((d) => d.label)}
            xAxisLabelTextStyle={{ color: "#9CA3AF", fontSize: 10, width: 40 }}
            xAxisColor={"#4B5563"}
            yAxisColor={"#4B5563"}
            yAxisTextStyle={{ color: "#9CA3AF", fontSize: 10 }}
            // yAxisLabelWidth={40}
            noOfSections={4}
            maxValue={Math.max(...chartData.map((d) => d.value), 0) + 10}
            mostNegativeValue={0}
            rulesColor={"#4B5563"}
            rulesType="dashed"
          />
        ) : (
          <>
            <Text className="text-gray-500">No weight data to display.</Text>
            <Text className="mt-1 text-xs text-gray-600">
              (Add a weight entry to see your progress chart)
            </Text>
          </>
        )}
      </View>

      {/* X-axis Labels (Placeholder) */}
      {/* <View className="flex-row justify-between px-1">
        {[...new Set(history.map((entry) => entry.date))].slice(0, 5).map(
          (date) => (
            <Text key={date} className="text-xs text-gray-400">
              {date.slice(5)}
            </Text>
          ),
        )}
      </View> */}
    </SectionCard>
  );
};

export default WeightProgressCard;