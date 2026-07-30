import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { View, TouchableOpacity, Image, Alert } from "react-native";

import GradientText from "@/components/shared/GradientText";

const userAvatar = require("@/assets/images/icon.png");

const AppHeader: React.FC = () => {
  const router = useRouter();

  const handleNotificationPress = () => {
    Alert.alert("Notifications", "Notifications are not available yet.");
  };

  const handleProfilePress = () => {
    router.push("/(root)/(tabs)/profile");
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <View className="flex-row items-center space-x-2">
        <FontAwesome5 name="heartbeat" size={22} className="text-purple-500" />
        <GradientText
          bgVariant="default"
          className="text-lg font-bold"
          accessible
          accessibilityLabel="NeonPulse Fit app title"
        >
          NeonPulse Fit
        </GradientText>
      </View>

      <View className="flex-row items-center space-x-3">
        <TouchableOpacity
          onPress={handleNotificationPress}
          className="rounded-full bg-dark-200 p-2"
          accessibilityLabel="View notifications"
          accessibilityRole="button"
          activeOpacity={0.7}
        >
          <FontAwesome5 name="bell" size={18} className="text-blue-400" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleProfilePress}
          accessibilityLabel="View profile"
          accessibilityRole="button"
          activeOpacity={0.7}
        >
          <View className="h-8 w-8 overflow-hidden rounded-full border-2 border-purple-500">
            <Image
              source={userAvatar}
              className="h-full w-full"
              resizeMode="cover"
              accessibilityLabel="User profile picture"
              accessible={true}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppHeader;
