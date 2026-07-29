import { PressableProps, TextInputProps, TextProps } from "react-native";

import { GradientName } from "@/constants";

declare interface ButtonProps extends PressableProps {
  title: string;
  bgVariant?: GradientName;
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
  gradientStyles?: string;
  isGradientActive?: boolean;
}

declare interface InputFieldProps extends TextInputProps {
  label?: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
}

declare interface GradientTextProps extends TextProps {
  className?: string;
  bgVariant?: GradientName;
  colors?: readonly [string, string, ...string[]];
}

declare interface ScoreCircleProps {
  scorePercentage: number;
  size?: number;
  strokeWidth?: number;
  progressColorFrom?: string;
  progressColorTo?: string;
  trackColor?: string;
  textColor?: string;
  animationDuration?: number;
  centerTextFontFamily?: string;
  containerClassName?: string;
  centerTextFontSize?: number;
}
declare interface ActivityStatsSectionProps {
  dynamicStatsData?: Record<
    string,
    Partial<Omit<StatCardData, "id" | "title" | "iconName" | "iconProvider">>
  >;
  isLoading?: boolean;
  error?: string | null;
}
