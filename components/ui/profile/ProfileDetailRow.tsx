import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { IconNameFA5, IconNameIonicons, IconProvider } from "@/types/health";

interface ProfileDetailRowProps {
  label: string;
  value: string;
  iconName: IconNameFA5 | IconNameIonicons;
  iconProvider?: IconProvider;
  iconClassName?: string;
  onPress?: () => void; // Make rows touchable if they lead to detail/edit screens
}

const ProfileDetailRow: React.FC<ProfileDetailRowProps> = ({
  label,
  value,
  iconName,
  iconProvider = "FontAwesome5",
  iconClassName = "text-purple-400", // Default icon color from "Fitness Goals"
  onPress,
}) => {
  const IconComponent = iconProvider === "Ionicons" ? Ionicons : FontAwesome5;
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      className="flex-row items-center justify-between rounded-xl bg-dark-100/60 p-3"
      // Using dark-100/60 - HTML used bg-gray-900/50
    >
      <View>
        <Text className="text-sm text-gray-400">{label}</Text>
        <Text className="text-base font-medium text-white">{value}</Text>
      </View>
      <IconComponent
        name={iconName as any}
        size={20}
        className={iconClassName}
      />
    </Wrapper>
  );
};

export default ProfileDetailRow;
