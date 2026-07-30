import { useAuth } from "@clerk/clerk-expo";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { View, Text, ScrollView, Alert, Pressable } from "react-native";
import Modal from "react-native-modal";

import { useAddFood, useFoodByName } from "@/api/useFoodQueries";
import { useCreateNutritionLog } from "@/api/useNutritionQueries";
import CustomButton from "@/components/shared/CustomButton";
import Divider from "@/components/shared/Divider";
import InputField from "@/components/shared/InputField";
import Header from "@/components/ui/add-food/Header";
import MealTimeSelector from "@/components/ui/nutrition/MealTimeSelector";
import { MEAL_TIME_OPTIONS } from "@/constants";
import { MealName } from "@/types/health";

const modalBackgroundGradient: readonly [string, string, string] = [
  "#18132F",
  "#1E1B4B",
  "#301934",
];

interface AddFoodModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSaveFood: (foodDetails: {
    foodName: string;
    calories: string;
    servingSize: string;
    protein: string;
    carbs: string;
    fat: string;
    mealTime: MealName | null;
  }) => void;
  targetMealName?: MealName | null;
}

const AddFoodModal: React.FC<AddFoodModalProps> = ({
  isVisible,
  onClose,
  onSaveFood,
  targetMealName,
}) => {
  const { userId } = useAuth();
  const [foodData, setFoodData] = useState<any>({
    foodId: "",
    foodName: "",
    calories: "",
    servingSize: "",
    protein: "",
    carbs: "",
    fat: "",
  });
  const [selectedMealTime, setSelectedMealTime] = useState<MealName | null>(
    targetMealName || null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTouched, setSearchTouched] = useState(false);
  const [weight, setWeight] = useState("100");

  const {
    data: searchResultsRaw,
    isLoading: isSearching,
    isError: searchError,
  } = useFoodByName(searchTerm);

  const addFoodMutation = useAddFood();
  const addNutritionMutation = useCreateNutritionLog();
  const isSaving =
    addFoodMutation.status === "pending" ||
    addNutritionMutation.status === "pending";

  const searchResults = Array.isArray(searchResultsRaw)
    ? searchResultsRaw.filter(Boolean)
    : searchResultsRaw && typeof searchResultsRaw === "object"
      ? Object.values(searchResultsRaw).filter(Boolean)
      : [];

  React.useEffect(() => {
    if (targetMealName) {
      setSelectedMealTime(targetMealName);
    }
  }, [targetMealName, isVisible]);

  const calcByWeight = (val: string | number | undefined) => {
    const w = parseFloat(weight) || 0;
    const v = parseFloat(val as string) || 0;
    return w && v ? ((v * w) / 100).toFixed(1) : "";
  };

  const resetForm = () => {
    setFoodData({
      foodId: "",
      foodName: "",
      calories: "",
      servingSize: "",
      protein: "",
      carbs: "",
      fat: "",
    });
    setWeight("100");
    setSearchTerm("");
    setSearchTouched(false);
  };

  const handleSave = async () => {
    if (!userId) {
      Alert.alert("Not Signed In", "Please sign in before logging food.");
      return;
    }

    if (!foodData.foodName || !foodData.calories || !selectedMealTime) {
      Alert.alert(
        "Missing Fields",
        "Please fill in food name, calories, and select a meal time.",
      );
      return;
    }

    const quantityConsumed = Number(weight);

    if (!Number.isFinite(quantityConsumed) || quantityConsumed <= 0) {
      Alert.alert("Invalid Weight", "Please enter a valid weight in grams.");
      return;
    }

    try {
      const savedFood = foodData.foodId
        ? foodData
        : await addFoodMutation.mutateAsync({
            userId,
            name: foodData.foodName,
            calories: foodData.calories,
            proteinG: foodData.protein || 0,
            carbsG: foodData.carbs || 0,
            fatG: foodData.fat || 0,
          });

      const foodId = savedFood.foodId || savedFood.id;

      if (!foodId) {
        throw new Error("Food was saved without an id.");
      }

      await addNutritionMutation.mutateAsync({
        userId,
        foodId,
        quantityConsumed,
        mealType: selectedMealTime,
        loggedAt: new Date().toISOString(),
      });

      onSaveFood({
        foodName: foodData.foodName,
        calories: foodData.calories,
        servingSize: foodData.servingSize,
        protein: foodData.protein,
        carbs: foodData.carbs,
        fat: foodData.fat,
        mealTime: selectedMealTime,
      });
      resetForm();
      onClose();
    } catch (err: any) {
      Alert.alert("Add Food Failed", err.message || "Could not log food.");
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onSwipeComplete={onClose}
      swipeDirection={["down"]}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={{ justifyContent: "flex-end", margin: 0, height: "100%" }}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
    >
      <LinearGradient
        colors={modalBackgroundGradient}
        className="max-h-[90vh] rounded-t-2xl"
      >
        <View className="relative z-10 rounded-t-2xl bg-transparent p-1">
          <Header onClose={onClose} />

          <ScrollView className="px-5 pt-4" keyboardShouldPersistTaps="handled">
            <View className="relative mb-4">
              <InputField
                placeholder="Search food items..."
                placeholderTextColor="#9AA6B2"
                value={searchTerm}
                onChangeText={(text) => {
                  setSearchTerm(text);
                  setSearchTouched(true);
                }}
                containerStyle="border-purple-600/60 bg-dark-200/70"
                inputStyle="pl-4"
              />

              {searchTerm.length > 0 && searchTouched && (
                <ScrollView
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 56,
                    zIndex: 100,
                    backgroundColor: "#18132F",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#a78bfa",
                    maxHeight: 280,
                    overflow: "scroll",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 10,
                  }}
                >
                  {isSearching ? (
                    <Text className="p-4 text-center text-gray-400">
                      Searching...
                    </Text>
                  ) : searchError ? (
                    <Text className="p-4 text-center text-red-400">
                      Error searching foods
                    </Text>
                  ) : searchResults.length === 0 ? (
                    <Text className="p-4 text-center text-gray-400">
                      No results found
                    </Text>
                  ) : (
                    searchResults.slice(0, 10).map((item: any, idx: number) => (
                      <Pressable
                        key={item.foodId || item.id || idx}
                        className="border-b border-gray-700 p-3"
                        onPress={() => {
                          setFoodData((prev: any) => ({
                            ...prev,
                            foodId: item.foodId || item.id,
                            foodName: item.product_name || "Unnamed food",
                            calories: calcByWeight(item.energy_kcal_100g),
                            protein: calcByWeight(item.proteins_100g),
                            carbs: calcByWeight(item.carbohydrates_100g),
                            fat: calcByWeight(item.fat_100g),
                          }));
                          setSearchTerm("");
                          setSearchTouched(false);
                        }}
                      >
                        <Text className="font-medium text-white">
                          {item.product_name}
                        </Text>
                        <Text className="text-xs text-gray-400">
                          {item.energy_kcal_100g
                            ? `${item.energy_kcal_100g} kcal/100g`
                            : "No kcal info"}
                        </Text>
                        <Text className="text-xs text-gray-400">
                          P: {item.proteins_100g ?? "-"}g | C:{" "}
                          {item.carbohydrates_100g ?? "-"}g | F:{" "}
                          {item.fat_100g ?? "-"}g
                        </Text>
                      </Pressable>
                    ))
                  )}
                </ScrollView>
              )}
            </View>
            <Divider />
            <InputField
              label="Food Name"
              value={foodData.foodName}
              onChangeText={(text) =>
                setFoodData((prev: any) => ({ ...prev, foodName: text }))
              }
              placeholder="e.g., Apple"
              placeholderTextColor="#9AA6B2"
              className="mb-4"
            />

            <View className="mb-4 flex-row justify-between space-x-3">
              <View className="mx-1 flex-1">
                <InputField
                  label="Calories"
                  value={foodData.calories}
                  onChangeText={(text) =>
                    setFoodData((prev: any) => ({ ...prev, calories: text }))
                  }
                  placeholder="e.g., 95"
                  placeholderTextColor="#9AA6B2"
                  keyboardType="numeric"
                />
              </View>
              <View className="mx-1 flex-1">
                <InputField
                  label="Weight (g)"
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="e.g., 150"
                  placeholderTextColor="#9AA6B2"
                  keyboardType="numeric"
                  className="mb-4"
                />
              </View>
            </View>

            <Text className="text-base font-medium text-gray-300">
              Macronutrients
            </Text>
            <View className="mb-4 flex-row justify-between gap-2">
              <View className="mx-1 flex-1">
                <InputField
                  value={foodData.protein}
                  onChangeText={(text) =>
                    setFoodData((prev: any) => ({ ...prev, protein: text }))
                  }
                  placeholder="Protein (g)"
                  placeholderTextColor="#9AA6B2"
                  keyboardType="numeric"
                  inputStyle="text-center"
                />
              </View>
              <View className="mx-1 flex-1">
                <InputField
                  value={foodData.carbs}
                  onChangeText={(text) =>
                    setFoodData((prev: any) => ({ ...prev, carbs: text }))
                  }
                  placeholder="Carbs (g)"
                  placeholderTextColor="#9AA6B2"
                  keyboardType="numeric"
                  inputStyle="text-center"
                />
              </View>
              <View className="mx-1 flex-1">
                <InputField
                  value={foodData.fat}
                  onChangeText={(text) =>
                    setFoodData((prev: any) => ({ ...prev, fat: text }))
                  }
                  placeholder="Fat (g)"
                  placeholderTextColor="#9AA6B2"
                  keyboardType="numeric"
                  inputStyle="text-center"
                />
              </View>
            </View>

            <Text className="mb-2 text-base font-medium text-gray-300">
              Meal Time
            </Text>
            <MealTimeSelector
              options={MEAL_TIME_OPTIONS}
              selectedMealTime={selectedMealTime}
              onSelectMealTime={setSelectedMealTime}
            />

            <CustomButton
              title={isSaving ? "Adding..." : "Add Food Entry"}
              onPress={handleSave}
              disabled={isSaving}
              bgVariant="default"
              className="mb-28 mt-8"
            />
          </ScrollView>
        </View>
      </LinearGradient>
    </Modal>
  );
};
export default AddFoodModal;
