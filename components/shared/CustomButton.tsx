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
  disabled,
  ...props
}: ButtonProps) => {
  const isDisabled = Boolean(disabled);

  const InnerButtonContent = () => (
    <>
      {IconLeft && <IconLeft />}
      <Text
        className={`text-center text-lg font-bold ${getTextVariantStyle(textVariant)}`}
      >
        {title}
      </Text>
      {IconRight && <IconRight />}
    </>
  );
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityState={{ disabled: isDisabled }}
      className={`flex w-full items-center justify-center overflow-hidden rounded-xl ${isDisabled ? "opacity-50" : ""} ${className ?? ""}`}
      {...props}
    >
      {isGradientActive ? (
        <LinearGradient
          className={`flex w-full items-center justify-center px-4 py-3 ${gradientStyles ?? ""}`}
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
