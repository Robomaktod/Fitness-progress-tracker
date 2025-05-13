import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, Pressable } from "react-native";

import { gradients } from "@/constants";
import { ButtonProps } from "@/types/type";

const getTextVariantStyle = (variant: ButtonProps["textVariant"]) => {
  switch (variant) {
    case "primary":
      return "text-black";
    case "secondary":
      return "text-gray-100";
    case "danger":
      return "text-red-100";
    case "success":
      return "text-green-100";
    default:
      return "text-white";
  }
};

const CustomButton = ({
  onPress,
  title,
  bgVariant = "default",
  textVariant = "default",
  IconLeft,
  IconRight,
  className,
  gradientStyles,
  isGradientActive = true,
  ...props
}: ButtonProps) => {
  const InnerButtonContent = () => (
    <>
      {IconLeft && <IconLeft />}
      <Text className={`text-lg font-bold ${getTextVariantStyle(textVariant)}`}>
        {title}
      </Text>
      {IconRight && <IconRight />}
    </>
  );
  return (
    <Pressable
      onPress={onPress}
      className={`w-full flex justify-center items-center rounded-xl transition-all duration-300 hover:scale-[0.98] active:scale-[0.95] overflow-hidden ${className}`}
      {...props}
    >
      {isGradientActive ? (
        <LinearGradient
          className={`w-full py-3 px-4 flex justify-center items-center ${gradientStyles}`}
          colors={gradients[bgVariant]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <InnerButtonContent />
        </LinearGradient>
      ) : (
        <InnerButtonContent />
      )}
    </Pressable>
  );
};

export default CustomButton;

//bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold  transition-all duration-300 transform hover:scale-[0.98] active:scale-[0.95] shadow-[0_0_15px_rgba(80,200,255,0.4)]
