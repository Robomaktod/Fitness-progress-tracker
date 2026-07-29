import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { View, TouchableOpacity, Image } from "react-native";

import GradientText from "@/components/shared/GradientText";

const userAvatar = require("@/assets/images/icon.png");

const AppHeader: React.FC = () => {
  const handleNotificationPress = () => {
    console.log("Notification pressed");
  };

  const handleProfilePress = () => {
    console.log("Profile pressed");
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <View className="flex-row items-center space-x-2">
        <FontAwesome5 name="heartbeat" size={22} className="text-purple-500" />
        <GradientText
          bgVariant="default" // Choose a suitable gradient from your constants
          className="text-lg font-bold"
          accessible
          accessibilityLabel="HealthTracker app title"
        >
          HealthTracker
        </GradientText>
      </View>

      {/* Action Icons */}
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
              source={userAvatar} // Update path if needed
              className="h-full w-full"
              resizeMode="cover"
              accessibilityLabel="User profile picture" // More specific label if user name is available
              accessible={true}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppHeader;
