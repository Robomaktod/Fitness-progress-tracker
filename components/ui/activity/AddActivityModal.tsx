import React, { useState } from "react";
import { Modal, View, Text, TextInput, Pressable, FlatList } from "react-native";
import { useActivityCategories } from "@/api/useActivityLogs";

interface AddActivityModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (activity: { categoryId: string; duration: string; date: string }) => void;
}

const AddActivityModal: React.FC<AddActivityModalProps> = ({ isVisible, onClose, onSave }) => {
  const { data, isLoading } = useActivityCategories();
  const categories = Array.isArray(data) ? data : [];
  const [categoryId, setCategoryId] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
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
    setDate("");
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/60 px-8">
        <View className="rounded-2xl bg-dark-200 p-6 shadow-lg w-full max-w-md">
          <Text className="mb-3 text-lg font-bold text-purple-400 text-center">Add Activity</Text>
          <View className="mb-2">
            <Text className="text-white mb-1">Activity Category</Text>
            <Pressable
              onPress={() => !isLoading && categories.length > 0 && setShowCategoryModal(true)}
              className="bg-dark-100 px-4 py-2 rounded-lg mb-2"
              disabled={isLoading || categories.length === 0}
            >
              <Text className={categoryId ? "text-white" : "text-gray-400"}>
                {isLoading
                  ? 'Loading...'
                  : !Array.isArray(categories) || categories.length === 0
                    ? 'No categories available'
                    : categoryId
                      ? categories.find((cat: any) => cat.id === categoryId)?.name || 'Select Category'
                      : 'Select Category'}
              </Text>
            </Pressable>
            {/* Category selection modal */}
            <Modal visible={showCategoryModal} transparent animationType="fade" onRequestClose={() => setShowCategoryModal(false)}>
              <View className="flex-1 items-center justify-center bg-black/60 px-8">
                <View className="rounded-2xl bg-dark-200 p-4 w-full max-w-md">
                  <Text className="mb-3 text-lg font-bold text-purple-400 text-center">Select Category</Text>
                  {Array.isArray(categories) && categories.length > 0 ? (
                    <FlatList
                      data={categories}
                      keyExtractor={item => item.id}
                      renderItem={({ item }) => (
                        <Pressable
                          onPress={() => {
                            setCategoryId(item.id);
                            setShowCategoryModal(false);
                          }}
                          className="px-4 py-3 border-b border-gray-700"
                        >
                          <Text className="text-white text-base">{item.name}</Text>
                        </Pressable>
                      )}
                      style={{ maxHeight: 300 }}
                    />
                  ) : (
                    <Text className="text-gray-400 text-center py-4">No categories available</Text>
                  )}
                  <Pressable onPress={() => setShowCategoryModal(false)} className="mt-4 rounded-lg bg-gray-500/80 px-6 py-2">
                    <Text className="text-center text-white font-semibold">Cancel</Text>
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
            className="bg-dark-100 text-white px-4 py-2 rounded-lg mb-2"
            placeholderTextColor="#aaa"
          />
          <TextInput
            value={date}
            onChangeText={setDate}
            placeholder="Date (YYYY-MM-DD)"
            className="bg-dark-100 text-white px-4 py-2 rounded-lg mb-2"
            placeholderTextColor="#aaa"
          />
          {error ? <Text className="text-red-400 text-center mb-2">{error}</Text> : null}
          <View className="flex-row justify-center space-x-4 mt-2">
            <Pressable onPress={onClose} className="rounded-lg bg-gray-500/80 px-6 py-2">
              <Text className="text-center text-white font-semibold">Cancel</Text>
            </Pressable>
            <Pressable onPress={handleSave} className="rounded-lg bg-purple-500/80 px-6 py-2">
              <Text className="text-center text-white font-semibold">Add</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddActivityModal;
