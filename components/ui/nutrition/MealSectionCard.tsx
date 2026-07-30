import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import { View, Text, Pressable } from "react-native";

import {
  FoodLogItemData,
  FoodLogMealSectionData,
  MealName,
} from "@/types/health";

import FoodListItem from "./FoodListItem";

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
  const foodItems = mealSection.foodItems;

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
            <Text className="mx-2 text-lg font-semibold text-gray-200">
              {mealSection.mealName}
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <Text
              className={`${mealSection.iconColorClassName} text-base font-bold`}
            >
              {mealSection.totalCalories}
            </Text>
            <Pressable
              onPress={() => onAddFoodToMeal?.(mealSection.mealName)}
              className="h-9 w-9 items-center justify-center rounded-lg border border-purple-500/40 bg-purple-600/30"
              accessibilityLabel={`Add food to ${mealSection.mealName}`}
              accessibilityRole="button"
            >
              <FontAwesome5 name="plus" size={14} color="#E9D5FF" />
            </Pressable>
          </View>
        </View>
      </View>
      <View className="p-2">
        {foodItems.length > 0 ? (
          foodItems.map((item) => (
            <FoodListItem
              key={item.id}
              item={item}
              onItemPress={onFoodItemPress}
            />
          ))
        ) : (
          <Text className="py-4 text-center text-sm text-gray-500">
            No items logged for {mealSection.mealName.toLowerCase()}.
          </Text>
        )}
      </View>
    </BlurView>
  );
};

export default MealSectionCard;
