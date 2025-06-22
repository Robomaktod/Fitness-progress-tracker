import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { format, addDays, subDays, isValid as isValidDate } from 'date-fns';
import {
  ScrollView,
  View,
  StatusBar,
  Text,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AddFoodModal from "@/app/(root)/add-food";
import DateNavigator from "@/components/ui/nutrition/DateNavigator";
import MealSectionCard from "@/components/ui/nutrition/MealSectionCard";
import NutritionLogHeader from "@/components/ui/nutrition/NutritionLogHeader";
import CustomButton from "@/components/shared/CustomButton";
import { FoodLogMealSectionData, MealName, FoodLogItemData } from "@/types/health";
import { useAllFood } from "@/api/useFoodQueries";

const screenBackgroundGradient: readonly [string, string, string] = [
  "#111827",
  "#172554",
  "#3B0764",
];

const NutritionLogScreen: React.FC = () => {
  const router = useRouter();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddFoodModalVisible, setIsAddFoodModalVisible] = useState(false);
  const [mealToAddTo, setMealToAddTo] = useState<MealName | null>(null);

  const formattedDateForAPI = format(currentDate, 'yyyy-MM-dd');


  const handleAddFoodToMeal = (mealName: MealName) => {
    setMealToAddTo(mealName);
    setIsAddFoodModalVisible(true);
  };

  const handleFoodItemPress = (foodItem: FoodLogItemData) => {
    Alert.alert("Edit Food (TBD)", `Editing ${foodItem.name}. Backend integration needed.`);
  };

  const formattedDisplayDate = isValidDate(currentDate) ? format(currentDate, 'MMMM d, yyyy') : "Invalid Date";
  const handleDateChange = (newDate: Date) => {
    if (isValidDate(newDate)) setCurrentDate(newDate);
  };

  const {
    data: allFoods = [],
    isLoading: isLoadingFoodLog,
    isError: fetchFoodLogError,
    refetch: refetchFoodLog,
    isRefetching: isRefetchingFoodLog,
    error: fetchFoodLogErrorMessage,
  } = useAllFood();

  const mealNames: MealName[] = ["Breakfast", "Lunch", "Dinner", "Snacks"];
  const mealSections: FoodLogMealSectionData[] = mealNames.map((mealName) => {
    const foodItems = allFoods.filter((item: any) => item.mealName === mealName);
    const totalCalories = foodItems.reduce((sum: number, item: any) => {
      const cal = parseInt(item.calories);
      return sum + (isNaN(cal) ? 0 : cal);
    }, 0);
    return {
      mealName,
      totalCalories: totalCalories ? `${totalCalories} cal` : "0 cal",
      iconName: foodItems[0]?.iconName || "utensils",
      iconProvider: foodItems[0]?.iconProvider || "FontAwesome5",
      iconColorClassName: foodItems[0]?.iconColorClassName || "text-cyan-400",
      borderColorClassName: foodItems[0]?.borderColorClassName || "border-cyan-500/30",
      shadowColor: foodItems[0]?.shadowColor,
      foodItems: foodItems.length ? foodItems : [],
    };
  });

  const handleSaveFood = (food: any) => {
    setIsAddFoodModalVisible(false);
    setMealToAddTo(null);
    refetchFoodLog();
  };

  return (
    <LinearGradient colors={screenBackgroundGradient} className="flex-1">
      <SafeAreaView edges={["top"]} className="flex-1">
        <StatusBar barStyle="light-content" backgroundColor={screenBackgroundGradient[0]} />
        <NutritionLogHeader />
        <DateNavigator
          currentDate={formattedDisplayDate}
          selectedDateObject={currentDate}
          onPreviousDate={() => handleDateChange(subDays(currentDate, 1))}
          onNextDate={() => handleDateChange(addDays(currentDate, 1))}
          onDateChange={handleDateChange}
        />
        {isLoadingFoodLog ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text className="mt-2 text-gray-300">Loading food log...</Text>
          </View>
        ) : fetchFoodLogError ? (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-lg text-red-400 text-center">{typeof fetchFoodLogError === 'string' ? fetchFoodLogError : 'Failed to load food log.'}</Text>
            <CustomButton title="Retry" onPress={() => refetchFoodLog()} className="mt-4 w-1/2" />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerClassName="px-4 pb-20"
            refreshControl={
              <RefreshControl
                refreshing={isRefetchingFoodLog}
                onRefresh={refetchFoodLog}
                tintColor="#FFFFFF"
                colors={["#FFFFFF"]}
              />
            }
          >
            {mealSections.map((item) => (
              <MealSectionCard
                key={item.mealName}
                mealSection={item}
                onAddFoodToMeal={handleAddFoodToMeal}
                onFoodItemPress={handleFoodItemPress}
              />
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
      {isAddFoodModalVisible && (
        <AddFoodModal
          isVisible={isAddFoodModalVisible}
          onClose={() => {
            setIsAddFoodModalVisible(false);
            setMealToAddTo(null);
          }}
          onSaveFood={handleSaveFood}
          targetMealName={mealToAddTo}
        />
      )}
    </LinearGradient>
  );
};

export default NutritionLogScreen;