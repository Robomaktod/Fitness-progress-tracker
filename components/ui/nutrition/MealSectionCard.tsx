import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, Pressable, FlatList } from "react-native";

import {
  FoodLogItemData,
  FoodLogMealSectionData,
  MealName,
} from "@/types/health";
import { BlurView } from 'expo-blur';
import FoodListItem from "./FoodListItem";
import { useAllNutritionLogs } from "@/api/UseNutritionQueries";

interface MealSectionCardProps {
  mealSection: FoodLogMealSectionData;
  onAddFoodToMeal?: (mealName: MealName) => void;
  onFoodItemPress?: (foodItem: FoodLogItemData) => void;
}

const MealSectionCard: React.FC<MealSectionCardProps> = ({
  mealSection,
  onAddFoodToMeal,
  onFoodItemPress,
}) => {
  const MealIcon =
    mealSection.iconProvider === "Ionicons" ? Ionicons : FontAwesome5;

  const { data: logs, isLoading, isError } = useAllNutritionLogs();

  const filteredLogs = (logs || []).filter(
    (log: any) => log.mealType === mealSection.mealName
  );

  // Transform logs to FoodLogItemData[] for FoodListItem
  const foodItems = filteredLogs.map((log: any) => ({
    id: String(log.nutritionLogId),
    name: log.food?.name || 'Unknown',
    calories: log.food?.calories || '0',
    macros: {
      protein: log.food?.proteinG || '0',
      fat: log.food?.fatG || '0',
      carbs: log.food?.carbsG || '0',
    },
    iconProvider: 'FontAwesome5', // or use logic if you want to vary
    iconName: 'utensils', // or use logic if you want to vary
    iconColorClassName: 'text-yellow-400', // or use logic if you want to vary
    iconBgClassName: 'bg-yellow-900', // or use logic if you want to vary
    // ...add any other fields needed by FoodLogItemData
    originalLog: log, // optional, for reference
  }));
  console.log(foodItems)

  return (
    <BlurView
      intensity={100}
      tint="dark"
      className={`mb-5 overflow-hidden rounded-2xl border ${mealSection.borderColorClassName || "border-gray-700/30"}`}
    >
      <View className="border-b border-gray-800 p-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-3">
            <MealIcon
              name={mealSection.iconName as any}
              size={20}
              className={mealSection.iconColorClassName}
              color="#E2DFD2"
            />
            <Text className="text-lg font-semibold text-gray-200 mx-2">
              {mealSection.mealName}
            </Text>
          </View>
          <Pressable onPress={() => onAddFoodToMeal?.(mealSection.mealName)}>
            <Text
              className={`${mealSection.iconColorClassName} text-base font-bold`}
            >
              {mealSection.totalCalories}
            </Text>
          </Pressable>
        </View>
      </View>
      <View className="p-2">
        {isLoading ? (
          <Text className="py-4 text-center text-sm text-gray-500">Loading...</Text>
        ) : isError ? (
          <Text className="py-4 text-center text-sm text-red-500">Error loading logs.</Text>
        ) : (
          <FlatList
            data={foodItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FoodListItem item={item} onItemPress={onFoodItemPress} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text className="py-4 text-center text-sm text-gray-500">
                No items logged for {mealSection.mealName.toLowerCase()}.
              </Text>
            }
          />
        )}
      </View>
    </BlurView>
  );
};

export default MealSectionCard;