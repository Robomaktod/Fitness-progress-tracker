import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";

import { gradients } from "@/constants";
import { GradientTextProps } from "@/types/type";

const GradientText = ({
  className,
  bgVariant = "default",
  ...props
}: GradientTextProps) => {
  return (
    <View className="flex self-center">
      <MaskedView maskElement={<Text {...props} />}>
        <LinearGradient
          colors={gradients[bgVariant]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text {...props} className={`text-transparent ${className}`} />
        </LinearGradient>
      </MaskedView>
    </View>
  );
};

export default GradientText;
