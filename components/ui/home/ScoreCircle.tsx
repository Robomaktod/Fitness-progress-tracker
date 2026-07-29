import React, { useEffect } from "react";
import { View, Platform, Text as RNText, StyleSheet } from "react-native"; // RNText for absolute positioning as an alternative
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  interpolateColor,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";

import { ScoreCircleProps } from "@/types/type";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ScoreCircle: React.FC<ScoreCircleProps> = ({
  scorePercentage,
  size = 64,
  strokeWidth = 5,
  progressColorFrom = "#1FD1ED",
  progressColorTo,
  trackColor = "#1F2937",
  textColor = "#FFFFFF",
  animationDuration = 1000,
  centerTextFontFamily,
  containerClassName,
  centerTextFontSize,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const halfSize = size / 2;

  const clampedPercentage = Math.min(100, Math.max(0, scorePercentage));

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(clampedPercentage, {
      duration: animationDuration,
      easing: Easing.out(Easing.quad),
    });
  }, [clampedPercentage, animationDuration, animatedProgress]);

  const progressCircleProps = useAnimatedProps(() => {
    const percentComplete = animatedProgress.value / 100;
    return {
      strokeDashoffset: circumference * (1 - percentComplete),
    };
  });

  const progressGradientId = "scoreCircleProgressGradient";
  const effectiveCenterTextFontSize = centerTextFontSize || size / 3.8; // Scale font size with circle size

  return (
    <View
      className={`items-center justify-center ${containerClassName ?? ""}`}
      style={{ width: size, height: size }}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Score: ${clampedPercentage}%`}
      accessibilityValue={{ min: 0, max: 100, now: clampedPercentage }}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {progressColorTo && (
          <Defs>
            <SvgLinearGradient
              id={progressGradientId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor={progressColorFrom} />
              <Stop offset="100%" stopColor={progressColorTo} />
            </SvgLinearGradient>
          </Defs>
        )}

        {/* Background Track Circle */}
        <Circle
          cx={halfSize}
          cy={halfSize}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          opacity={0.3} // As seen in the design (blue-500/30)
        />

        {/* Foreground Progress Circle */}
        <AnimatedCircle
          cx={halfSize}
          cy={halfSize}
          r={radius}
          stroke={
            progressColorTo ? `url(#${progressGradientId})` : progressColorFrom
          }
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          animatedProps={progressCircleProps}
          strokeLinecap="round"
          originX={halfSize}
          originY={halfSize}
          rotation={-90}
        />
      </Svg>

      <RNText
        style={[
          StyleSheet.absoluteFill,
          {
            fontSize: effectiveCenterTextFontSize,
            color: textColor,
            textAlign: "center",
            textAlignVertical: "center", // Works well on Android
            fontWeight: "bold",
            fontFamily: centerTextFontFamily,
            // For iOS, you might need fine-tuning with paddingTop or a wrapper View
            // if textAlignVertical doesn't center perfectly.
            // Include padding adjustments if necessary for iOS alignment
            ...(Platform.OS === "ios" && { lineHeight: size }), // Hacky way for iOS vertical centering
          },
        ]}
        accessible={false} // Text is part of the overall progressbar accessibility
      >
        {/* This Text will update based on clampedPercentage directly, not the animation frame by frame */}
        {/* If you want text to animate with circle, use Animated.Text and useDerivedValue with reanimated */}
        {`${Math.round(clampedPercentage)}%`}
      </RNText>
    </View>
  );
};

export default ScoreCircle;
