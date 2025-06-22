import { FontAwesome5 } from "@expo/vector-icons"; // For the '+' icon in the button
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import SectionCard from "@/components/ui/progress/SectionCard";
import { WeightProgressData } from "@/types/health"; // Assuming types are in types/health.ts

// Charting Library Placeholder:
// import { LineChart } from 'react-native-chart-kit'; // Example if using this library
// import { Dimensions } from 'react-native';
// const screenWidth = Dimensions.get('window').width;

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

  // Placeholder for chart data transformation if using a library
  // const chartData = {
  //   labels: history.map(entry => entry.date),
  //   datasets: [
  //     {
  //       data: history.map(entry => entry.weight),
  //       color: (opacity = 1) => `rgba(167, 139, 250, ${opacity})`, // purple-400
  //       strokeWidth: 2,
  //     },
  //   ],
  //   legend: ["Weight"],
  // };

  // Chart config for react-native-chart-kit (example)
  // const chartConfig = {
  //   backgroundColor: 'transparent',
  //   backgroundGradientFromOpacity: 0,
  //   backgroundGradientToOpacity: 0,
  //   decimalPlaces: 1,
  //   color: (opacity = 1) => `rgba(224, 224, 224, ${opacity})`, // Light gray for labels/grid
  //   labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`, // gray-400
  //   style: {
  //     borderRadius: 16,
  //   },
  //   propsForDots: {
  //     r: '4',
  //     strokeWidth: '2',
  //     stroke: '#A78BFA', // purple-400
  //   },
  //   withVerticalLines: false,
  //   withHorizontalLines: true,
  //   propsForBackgroundLines: {
  //     strokeDasharray: '', // Solid lines
  //     stroke: '#4B5563', // gray-600 for grid lines
  //     strokeOpacity: 0.5,
  //   },
  // };

  return (
    <SectionCard
      borderColorClassName="border-purple-500/30" // Violet border, 30% opacity
      shadowColor="#8B5CF6" // Violet shadow/glow tint
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
          value={`${change >= 0 ? "+" : ""}${change.toFixed(1)}`} // Add '+' for positive change
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
        {/*
        // Example of using react-native-chart-kit:
        <LineChart
          data={chartData}
          width={screenWidth - 64} // (screenWidth - paddingHorizontalOfCard*2 - internalPadding*2)
          height={200}
          chartConfig={chartConfig}
          bezier // For smooth lines
          style={{ marginVertical: 8, borderRadius: 16 }}
          yAxisSuffix={` ${weightUnit}`}
          withShadow={false} // Turn off default shadow if using SectionCard's shadow
        />
        */}
        <Text className="text-gray-500">Weight Chart Placeholder</Text>
        <Text className="mt-1 text-xs text-gray-600">
          (Line chart will be rendered here)
        </Text>
        {/* X-axis and Y-axis line placeholders from HTML */}
        <View className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-700/50" />
        <View className="absolute bottom-0 left-0 top-0 w-[1px] bg-gray-700/50" />
      </View>

      {/* X-axis Labels (Placeholder) */}
      <View className="flex-row justify-between px-1">
        {history.slice(0, 5).map(
          (
            entry, // Display up to 5 labels
          ) => (
            <Text key={entry.date} className="text-xs text-gray-400">
              {entry.date}
            </Text>
          ),
        )}
      </View>
    </SectionCard>
  );
};

export default WeightProgressCard;