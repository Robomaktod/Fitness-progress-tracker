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
import { useAuth } from "@clerk/clerk-expo";

interface MealSectionCardProps {
  mealSection: FoodLogMealSectionData;
  date: Date; // Add date prop
  onAddFoodToMeal?: (mealName: MealName) => void;
  onFoodItemPress?: (foodItem: FoodLogItemData) => void;
}

const MealSectionCard: React.FC<MealSectionCardProps> = ({
  mealSection,
  date,
  onAddFoodToMeal,
  onFoodItemPress,
}) => {
  const MealIcon =
    mealSection.iconProvider === "Ionicons" ? Ionicons : FontAwesome5;

  const { userId } = useAuth();
  const { data: logs, isLoading, isError } = useAllNutritionLogs(userId ?? "Error", date);

  const filteredLogs = (logs || []).filter(
    (log: any) => log.mealType === mealSection.mealName
  );

  const foodItems = filteredLogs.map((log: any) => ({
    id: String(log.nutritionLogId),
    name: log.food?.name || 'Unknown',
    calories: log.food?.calories || '0',
    macros: {
      protein: log.food?.proteinG || '0',
      fat: log.food?.fatG || '0',
      carbs: log.food?.carbsG || '0',
    },
    iconProvider: "FontAwesome5" as const,
    iconName: 'utensils', 
    iconColorClassName: 'text-yellow-400', 
    iconBgClassName: 'bg-yellow-900', 
    originalLog: log,
  }));

  const totalCalories = filteredLogs.reduce((sum: number, log: any) => {
    const calories = Number(log.food?.calories) || 0;
    const quantity = Number(log.quantityConsumed) || 1;
    return sum + (calories * quantity) / 100;
  }, 0);

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
              {Math.round(totalCalories)}
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