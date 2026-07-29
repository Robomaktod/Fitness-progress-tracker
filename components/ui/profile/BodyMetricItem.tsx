import React from "react";
import { View, Text } from "react-native";

interface BodyMetricItemProps {
  label: string;
  value: string;
  unit?: string;
  valueClassName?: string;
}

const BodyMetricItem: React.FC<BodyMetricItemProps> = ({
  label,
  value,
  unit,
  valueClassName,
}) => {
  return (
    <View className="flex-1 items-start rounded-xl bg-dark-100/60 p-3">
      {/* Using dark-100/60. HTML uses bg-gray-900/50. Adjust for desired darkness */}
      <Text className="text-sm text-gray-400">{label}</Text>
      <Text className={`text-xl font-bold ${valueClassName || "text-white"}`}>
        {value}
        {unit && <Text className="text-base font-normal"> {unit}</Text>}
      </Text>
    </View>
  );
};
export default BodyMetricItem;
