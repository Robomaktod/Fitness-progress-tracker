import { useAuth } from "@clerk/clerk-expo";
import { format, addDays, subDays, isValid as isValidDate } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  View,
  StatusBar,
  Text,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAllNutritionLogs } from "@/api/useNutritionQueries";
import AddFoodModal from "@/app/(root)/add-food";
import CustomButton from "@/components/shared/CustomButton";
import DateNavigator from "@/components/ui/nutrition/DateNavigator";
import MealSectionCard from "@/components/ui/nutrition/MealSectionCard";
import NutritionLogHeader from "@/components/ui/nutrition/NutritionLogHeader";
import {
  FoodLogMealSectionData,
  MealName,
  FoodLogItemData,
} from "@/types/health";

const screenBackgroundGradient: readonly [string, string, string] = [
  "#111827",
  "#172554",
  "#3B0764",
];

const MEAL_NAMES: MealName[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

const mealMeta: Record<
  string,
  Pick<
    FoodLogMealSectionData,
    "iconName" | "iconProvider" | "iconColorClassName" | "borderColorClassName"
  >
> = {
  Breakfast: {
    iconName: "egg",
    iconProvider: "FontAwesome5",
    iconColorClassName: "text-cyan-400",
    borderColorClassName: "border-cyan-500/30",
  },
  Lunch: {
    iconName: "hamburger",
    iconProvider: "FontAwesome5",
    iconColorClassName: "text-violet-300",
    borderColorClassName: "border-violet-500/30",
  },
  Dinner: {
    iconName: "utensils",
    iconProvider: "FontAwesome5",
    iconColorClassName: "text-blue-300",
    borderColorClassName: "border-blue-500/30",
  },
  Snack: {
    iconName: "cookie",
    iconProvider: "FontAwesome5",
    iconColorClassName: "text-fuchsia-300",
    borderColorClassName: "border-fuchsia-500/30",
  },
};

const formatMacro = (
  value: string | number | null | undefined,
  quantity: number,
) => {
  const perHundredGrams = Number(value) || 0;
  return `${((perHundredGrams * quantity) / 100).toFixed(1)}g`;
};

const NutritionLogScreen: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddFoodModalVisible, setIsAddFoodModalVisible] = useState(false);
  const [mealToAddTo, setMealToAddTo] = useState<MealName | null>(null);

  const handleAddFoodToMeal = (mealName: MealName) => {
    setMealToAddTo(mealName);
    setIsAddFoodModalVisible(true);
  };

  const handleFoodItemPress = (foodItem: FoodLogItemData) => {
    Alert.alert(
      "Edit Food (TBD)",
      `Editing ${foodItem.name}. Backend integration needed.`,
    );
  };

  const formattedDisplayDate = isValidDate(currentDate)
    ? format(currentDate, "MMMM d, yyyy")
    : "Invalid Date";
  const handleDateChange = (newDate: Date) => {
    if (isValidDate(newDate)) setCurrentDate(newDate);
  };

  const { userId } = useAuth();
  const {
    data: allLogs = [],
    isLoading: isLoadingLogs,
    isError: fetchLogsError,
    refetch: refetchLogs,
    isRefetching: isRefetchingLogs,
    error: fetchLogsErrorMessage,
  } = useAllNutritionLogs(userId ?? "", currentDate);

  const mealSections: FoodLogMealSectionData[] = useMemo(
    () =>
      MEAL_NAMES.map((mealName) => {
        const logsForMeal = Array.isArray(allLogs)
          ? allLogs.filter((log: any) => log.mealType === mealName)
          : [];
        const meta = mealMeta[mealName] ?? mealMeta.Snack;
        const totalCalories = logsForMeal.reduce((sum: number, log: any) => {
          const calories = Number(log.food?.calories) || 0;
          const quantity = Number(log.quantityConsumed) || 0;
          return sum + (calories * quantity) / 100;
        }, 0);
        const foodItems: FoodLogItemData[] = logsForMeal.map((log: any) => {
          const quantity = Number(log.quantityConsumed) || 0;
          const calories = Number(log.food?.calories) || 0;

          return {
            id: String(log.nutritionLogId),
            name: log.food?.name || "Unknown food",
            calories: `${Math.round((calories * quantity) / 100)} cal`,
            macros: {
              protein: formatMacro(log.food?.proteinG, quantity),
              fat: formatMacro(log.food?.fatG, quantity),
              carbs: formatMacro(log.food?.carbsG, quantity),
            },
            iconProvider: "FontAwesome5",
            iconName: "utensils",
            iconColorClassName: meta.iconColorClassName,
            iconBgClassName: "bg-dark-200",
          };
        });

        return {
          mealName,
          totalCalories: `${Math.round(totalCalories)} cal`,
          shadowColor: undefined,
          foodItems,
          ...meta,
        };
      }),
    [allLogs],
  );

  const handleSaveFood = () => {
    setIsAddFoodModalVisible(false);
    setMealToAddTo(null);
    refetchLogs();
  };

  return (
    <LinearGradient colors={screenBackgroundGradient} className="flex-1">
      <SafeAreaView edges={["top"]} className="flex-1">
        <StatusBar
          barStyle="light-content"
          backgroundColor={screenBackgroundGradient[0]}
        />
        <NutritionLogHeader />
        <DateNavigator
          currentDate={formattedDisplayDate}
          selectedDateObject={currentDate}
          onPreviousDate={() => handleDateChange(subDays(currentDate, 1))}
          onNextDate={() => handleDateChange(addDays(currentDate, 1))}
          onDateChange={handleDateChange}
        />
        {isLoadingLogs ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text className="mt-2 text-gray-300">Loading food log...</Text>
          </View>
        ) : fetchLogsError ? (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-center text-lg text-red-400">
              {(fetchLogsErrorMessage as Error)?.message ||
                "Failed to load food log."}
            </Text>
            <CustomButton
              title="Retry"
              onPress={() => refetchLogs()}
              className="mt-4 w-1/2"
            />
          </View>
        ) : (
          // Use FlatList instead of ScrollView to avoid nested VirtualizedLists
          <FlatList
            data={mealSections}
            keyExtractor={(item) => item.mealName}
            renderItem={({ item }) => (
              <MealSectionCard
                mealSection={item}
                onAddFoodToMeal={handleAddFoodToMeal}
                onFoodItemPress={handleFoodItemPress}
              />
            )}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefetchingLogs}
                onRefresh={refetchLogs}
                tintColor="#FFFFFF"
                colors={["#FFFFFF"]}
              />
            }
          />
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
