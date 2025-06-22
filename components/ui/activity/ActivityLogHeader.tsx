import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { View, Pressable } from "react-native";

import GradientText from "@/components/shared/GradientText";

interface ActivityLogHeaderProps {
  onFilterPress?: () => void;
}

const ActivityLogHeader: React.FC<ActivityLogHeaderProps> = ({
  onFilterPress,
}) => {
  return (
    <View className="flex-row items-center justify-between bg-transparent px-5 pb-3 pt-4">
      <GradientText bgVariant="default" className="text-2xl font-bold">
        Activity Log
      </GradientText>
      <Pressable
        onPress={onFilterPress}
        className="p-2"
        accessibilityLabel="Filter activity log"
        accessibilityRole="button"
      >
        <FontAwesome5 name="sliders-h" size={20} className="text-gray-400" />
      </Pressable>
    </View>
  );
};

export default ActivityLogHeader;