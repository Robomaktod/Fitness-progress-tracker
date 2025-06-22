import { Text, TextProps, View } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

const gradients = {
  default: ["#6EE7B7", "#3B82F6"],
  // Add more gradient variants as needed
};

type GradientTextProps = TextProps & {
  bgVariant?: keyof typeof gradients;
  colors?: [string, string];
};

const GradientText = ({
  className,
  bgVariant = "default",
  colors,
  ...props
}: GradientTextProps) => {
  return (
    <View className="flex self-center">
      <MaskedView maskElement={<Text {...props} />}>
        <LinearGradient
          colors={colors ?? gradients[bgVariant]}
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