import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, Pressable } from "react-native";

interface HeaderProps {
  onClose: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClose }) => {
  return (
    <View className="flex-row items-center justify-between border-b border-gray-700/50 px-4 py-3">
      {/* Non-interactive spacer so the title stays centered against the close button */}
      <View className="p-2 opacity-0">
        <Ionicons name="arrow-back" size={24} className="text-gray-400" />
      </View>
      <Text className="text-xl font-semibold text-white">Add Food</Text>
      <Pressable onPress={onClose} className="p-2">
        <Ionicons name="close" size={28} className="text-gray-400" />
      </Pressable>
    </View>
  );
};

export default Header;
