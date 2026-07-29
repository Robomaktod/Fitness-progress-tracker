import { FontAwesome5 } from "@expo/vector-icons"; // Or your preferred icon library
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable, // Added TouchableOpacity for icon
} from "react-native";

import GradientText from "@/components/shared/GradientText"; // Your GradientText component

// Define the gradient colors for the "Progress" title, as seen in the image

interface ProgressHeaderProps {
  onChartIconPress?: () => void;
}

const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  onChartIconPress,
}) => {
  return (
    <View className="flex-row items-center justify-between bg-transparent px-5 pb-3 pt-4">
      {/* Left side: Title and Subtitle */}
      <View>
        <GradientText
          colors={["#A78BFA", "#F472B6"]} // Using the defined gradient array
          // If you add this as a variant to your constants/index.ts gradients, e.g., 'progressTitle'
          // you could use: bgVariant="progressTitle"
          className="text-2xl font-bold"
          accessible
          accessibilityRole="header"
          accessibilityLabel="Progress screen title"
        >
          Progress
        </GradientText>
        <Text className="text-sm text-gray-400">Track your journey</Text>
      </View>

      {/* Right side: Chart Icon Button */}
      <Pressable
        onPress={onChartIconPress}
        disabled={!onChartIconPress} // Disable if no handler is provided
        className="h-10 w-10 items-center justify-center rounded-full border border-purple-500/50 bg-dark-200/70 shadow-md"
        // Using dark-200 with opacity from your Tailwind config for background.
        // Shadow-md for a subtle shadow. True "glow" is harder.
        // shadowColor: '#8B5CF6', // For violet glow (iOS only for color)
        // shadowOpacity: 0.3,
        // shadowRadius: 5,
        // elevation: 5, // Android shadow
        accessibilityLabel="View charts or data options"
        accessibilityRole="button"
      >
        <FontAwesome5 name="chart-line" size={18} className="text-purple-400" />
      </Pressable>
    </View>
  );
};

export default ProgressHeader;
