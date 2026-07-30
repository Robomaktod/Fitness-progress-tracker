import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
} from "react-native";

import { ExerciseType } from "@/api/useActivityTypes";

const todayInputValue = () => new Date().toISOString().slice(0, 10);

interface AddExerciseModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (exercise: {
    exerciseTypeId: string;
    sets: string;
    reps: string;
    date: string;
  }) => void;
  exerciseTypes: ExerciseType[];
  isLoading?: boolean;
}

const AddExerciseModal: React.FC<AddExerciseModalProps> = ({
  isVisible,
  onClose,
  onSave,
  exerciseTypes,
  isLoading = false,
}) => {
  const [exerciseTypeId, setExerciseTypeId] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [date, setDate] = useState(todayInputValue());
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSave = () => {
    const parsedDate = new Date(`${date}T00:00:00`);

    if (
      !exerciseTypeId ||
      !sets ||
      !reps ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(parsedDate.getTime())
    ) {
      setError("All fields are required.");
      return;
    }
    setError("");
    onSave({
      exerciseTypeId,
      sets,
      reps,
      date,
    });
    setExerciseTypeId("");
    setSets("");
    setReps("");
    setDate(todayInputValue());
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/60 px-8">
        <View className="w-full max-w-md rounded-2xl bg-dark-200 p-6 shadow-lg">
          <Text className="mb-3 text-center text-lg font-bold text-purple-400">
            Add Exercise
          </Text>
          <View className="mb-2">
            <Text className="mb-1 text-white">Exercise Type</Text>
            <Pressable
              className="rounded-lg border border-purple-500/30 bg-dark-100 px-4 py-3"
              onPress={() => setShowDropdown(true)}
              disabled={isLoading || exerciseTypes.length === 0}
            >
              <Text className="text-white">
                {exerciseTypes.find((ex) => ex.id === exerciseTypeId)?.name ||
                  (isLoading
                    ? "Loading..."
                    : exerciseTypes.length === 0
                      ? "No exercises available"
                      : "Select Exercise")}
              </Text>
            </Pressable>
            <Modal visible={showDropdown} transparent animationType="fade">
              <Pressable
                style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
                onPress={() => setShowDropdown(false)}
              >
                <View
                  style={{
                    marginTop: 150,
                    marginHorizontal: 40,
                    backgroundColor: "#22223b",
                    borderRadius: 12,
                    padding: 8,
                  }}
                >
                  {exerciseTypes.length > 0 ? (
                    <FlatList
                      data={exerciseTypes}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <Pressable
                          onPress={() => {
                            setExerciseTypeId(item.id);
                            setShowDropdown(false);
                          }}
                          style={{ padding: 12 }}
                        >
                          <Text style={{ color: "#fff" }}>{item.name}</Text>
                        </Pressable>
                      )}
                    />
                  ) : (
                    <Text
                      style={{
                        color: "#aaa",
                        textAlign: "center",
                        padding: 16,
                      }}
                    >
                      No exercises available
                    </Text>
                  )}
                </View>
              </Pressable>
            </Modal>
          </View>
          <TextInput
            value={sets}
            onChangeText={setSets}
            placeholder="Sets"
            keyboardType="numeric"
            className="mb-2 rounded-lg border border-purple-500/30 bg-dark-100 px-4 py-3 text-white"
            placeholderTextColor="#aaa"
          />
          <TextInput
            value={reps}
            onChangeText={setReps}
            placeholder="Reps per Set"
            keyboardType="numeric"
            className="mb-2 rounded-lg border border-purple-500/30 bg-dark-100 px-4 py-3 text-white"
            placeholderTextColor="#aaa"
          />
          <TextInput
            value={date}
            onChangeText={setDate}
            placeholder="Date (YYYY-MM-DD)"
            className="mb-2 rounded-lg border border-purple-500/30 bg-dark-100 px-4 py-3 text-white"
            placeholderTextColor="#aaa"
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={10}
          />
          {error ? (
            <Text className="mb-2 text-center text-red-400">{error}</Text>
          ) : null}
          <View className="mt-2 flex-row justify-center space-x-4">
            <Pressable
              onPress={onClose}
              className="rounded-lg bg-gray-500/80 px-6 py-2"
            >
              <Text className="text-center font-semibold text-white">
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              className="rounded-lg bg-purple-500/80 px-6 py-2"
            >
              <Text className="text-center font-semibold text-white">Add</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddExerciseModal;
