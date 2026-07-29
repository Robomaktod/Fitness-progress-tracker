import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";

// Assuming your gradients constant is available
// import { gradients as appGradients } from '@/constants'; // Not used directly here unless passed as variant

interface SimpleProgressBarProps {
  progressPercent: number; // 0-100
  barHeightClassName?: string; // e.g., "h-2"
  trackColorClassName?: string; // e.g., "bg-gray-800"
  progressGradientColors?: readonly [string, string, ...string[]]; // Array of colors for the progress gradient
  // OR
  progressColorClassName?: string; // Single color class if not using gradient, e.g., "bg-green-500"
  roundedClassName?: string; // e.g., "rounded-full"
}

const SimpleProgressBar: React.FC<SimpleProgressBarProps> = ({
  progressPercent,
  barHeightClassName = "h-2",
  trackColorClassName = "bg-dark-100/50", // Using your dark theme color with opacity
  progressGradientColors, // Prioritized if provided
  progressColorClassName = "bg-green-500", // Fallback solid color
  roundedClassName = "rounded-full",
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progressPercent));

  return (
    <View
      className={`${barHeightClassName} ${trackColorClassName} ${roundedClassName} w-full overflow-hidden`}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Progress bar" // More specific label can be provided by parent
      accessibilityValue={{ min: 0, max: 100, now: clampedProgress }}
    >
      {progressGradientColors && progressGradientColors.length >= 2 ? (
        <LinearGradient
          colors={progressGradientColors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ width: `${clampedProgress}%`, height: "100%" }}
        />
      ) : (
        <View
          className={`${progressColorClassName}`}
          style={{ width: `${clampedProgress}%`, height: "100%" }}
        />
      )}
    </View>
  );
};

export default SimpleProgressBar;
