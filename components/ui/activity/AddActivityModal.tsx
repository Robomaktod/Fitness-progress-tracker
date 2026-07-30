import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
} from "react-native";

import { ActivityCategory } from "@/api/useActivityTypes";

const todayInputValue = () => new Date().toISOString().slice(0, 10);

interface AddActivityModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (activity: {
    categoryId: string;
    duration: string;
    date: string;
  }) => void;
  categories: ActivityCategory[];
  isLoading?: boolean;
}

const AddActivityModal: React.FC<AddActivityModalProps> = ({
  isVisible,
  onClose,
  onSave,
  categories,
  isLoading = false,
}) => {
  const [categoryId, setCategoryId] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState(todayInputValue());
  const [error, setError] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const handleSave = () => {
    if (!categoryId || !duration || !date) {
      setError("All fields are required.");
      return;
    }
    setError("");
    onSave({ categoryId, duration, date });
    setCategoryId("");
    setDuration("");
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
            Add Activity
          </Text>
          <View className="mb-2">
            <Text className="mb-1 text-white">Activity Category</Text>
            <Pressable
              onPress={() =>
                !isLoading &&
                categories.length > 0 &&
                setShowCategoryModal(true)
              }
              className="mb-2 rounded-lg border border-purple-500/30 bg-dark-100 px-4 py-3"
              disabled={isLoading || categories.length === 0}
            >
              <Text className={categoryId ? "text-white" : "text-gray-400"}>
                {isLoading
                  ? "Loading..."
                  : !Array.isArray(categories) || categories.length === 0
                    ? "No categories available"
                    : categoryId
                      ? categories.find((cat) => cat.id === categoryId)?.name ||
                        "Select Category"
                      : "Select Category"}
              </Text>
            </Pressable>
            {/* Category selection modal */}
            <Modal
              visible={showCategoryModal}
              transparent
              animationType="fade"
              onRequestClose={() => setShowCategoryModal(false)}
            >
              <View className="flex-1 items-center justify-center bg-black/60 px-8">
                <View className="w-full max-w-md rounded-2xl bg-dark-200 p-4">
                  <Text className="mb-3 text-center text-lg font-bold text-purple-400">
                    Select Category
                  </Text>
                  {Array.isArray(categories) && categories.length > 0 ? (
                    <FlatList
                      data={categories}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <Pressable
                          onPress={() => {
                            setCategoryId(item.id);
                            setShowCategoryModal(false);
                          }}
                          className="border-b border-gray-700 px-4 py-3"
                        >
                          <Text className="text-base text-white">
                            {item.name}
                          </Text>
                        </Pressable>
                      )}
                      style={{ maxHeight: 300 }}
                    />
                  ) : (
                    <Text className="py-4 text-center text-gray-400">
                      No categories available
                    </Text>
                  )}
                  <Pressable
                    onPress={() => setShowCategoryModal(false)}
                    className="mt-4 rounded-lg bg-gray-500/80 px-6 py-2"
                  >
                    <Text className="text-center font-semibold text-white">
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>
          <TextInput
            value={duration}
            onChangeText={setDuration}
            placeholder="Duration (min)"
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

export default AddActivityModal;
