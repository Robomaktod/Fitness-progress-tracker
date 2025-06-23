import React, { useState } from "react";
import { Modal, View, Text, TextInput, Pressable, FlatList } from "react-native";
import { useActivityAndExerciseCategories } from "@/api/useActivityLogs";

interface AddExerciseModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (exercise: { exerciseTypeId: string; sets: string; reps: string; date: string }) => void;
}

const AddExerciseModal: React.FC<AddExerciseModalProps> = ({ isVisible, onClose, onSave }) => {
  const { data, isLoading } = useActivityAndExerciseCategories();
  const exerciseTypes = Array.isArray(data && (data as any).exerciseTypes) ? (data as any).exerciseTypes : [];
  const [exerciseTypeId, setExerciseTypeId] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSave = () => {
    if (!exerciseTypeId || !sets || !reps || !date) {
      setError("All fields are required.");
      return;
    }
    setError("");
    onSave({ exerciseTypeId, sets, reps, date: date.toISOString().slice(0, 10) });
    setExerciseTypeId("");
    setSets("");
    setReps("");
    setDate(null);
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/60 px-8">
        <View className="rounded-2xl bg-dark-200 p-6 shadow-lg w-full max-w-md">
          <Text className="mb-3 text-lg font-bold text-purple-400 text-center">Add Exercise</Text>
          <View className="mb-2">
            <Text className="text-white mb-1">Exercise Type</Text>
            <Pressable
              className="bg-dark-100 rounded-lg px-4 py-2"
              onPress={() => setShowDropdown(true)}
              disabled={isLoading || exerciseTypes.length === 0}
            >
              <Text className="text-white">
                {exerciseTypes.find((ex: any) => ex.id === exerciseTypeId)?.name || (isLoading ? "Loading..." : exerciseTypes.length === 0 ? "No exercises available" : "Select Exercise")}
              </Text>
            </Pressable>
            <Modal visible={showDropdown} transparent animationType="fade">
              <Pressable
                style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
                onPress={() => setShowDropdown(false)}
              >
                <View style={{ marginTop: 150, marginHorizontal: 40, backgroundColor: "#22223b", borderRadius: 12, padding: 8 }}>
                  {exerciseTypes.length > 0 ? (
                    <FlatList
                      data={exerciseTypes}
                      keyExtractor={item => item.id}
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
                    <Text style={{ color: "#aaa", textAlign: "center", padding: 16 }}>No exercises available</Text>
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
            className="bg-dark-100 text-white px-4 py-2 rounded-lg mb-2"
            placeholderTextColor="#aaa"
          />
          <TextInput
            value={reps}
            onChangeText={setReps}
            placeholder="Reps per Set"
            keyboardType="numeric"
            className="bg-dark-100 text-white px-4 py-2 rounded-lg mb-2"
            placeholderTextColor="#aaa"
          />
          <TextInput
            value={date ? date.toISOString().slice(0, 10) : ""}
            onChangeText={text => {
              // Accept only YYYY-MM-DD format, set as date if valid, else null
              const isValid = /^\d{4}-\d{2}-\d{2}$/.test(text);
              if (isValid) {
                setDate(new Date(text + 'T00:00:00'));
              } else {
                setDate(null);
              }
            }}
            placeholder="Date (YYYY-MM-DD)"
            className="bg-dark-100 text-white px-4 py-2 rounded-lg mb-2"
            placeholderTextColor="#aaa"
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={10}
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

export default AddExerciseModal;
