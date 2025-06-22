import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { View, TouchableOpacity } from "react-native";

import GradientText from "@/components/shared/GradientText";

// Gradient from image: from-purple-400 to-fuchsia-500
const profileTitleGradient: [string, string] = ["#A78BFA", "#E879F9"]; // Tailwind purple-400 to fuchsia-400 (approx)

interface ProfileHeaderProps {
  onActionPress?: () => void; // For the right-hand icon (e.g., settings or initial logout)
  actionIconName?: React.ComponentProps<typeof FontAwesome5>["name"];
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onActionPress,
  actionIconName = "sign-out-alt", // Default icon
}) => {
  return (
    <View className="flex-row items-center justify-between bg-transparent px-5 pb-3 pt-4">
      <GradientText
        colors={profileTitleGradient}
        className="text-2xl font-bold"
      >
        Profile
      </GradientText>
      {onActionPress && (
        <TouchableOpacity
          onPress={onActionPress}
          className="h-10 w-10 items-center justify-center rounded-full border border-red-500/50 bg-dark-200/60 shadow-md"
          accessibilityLabel="Profile action"
          accessibilityRole="button"
        >
          {/* The image shows a "sign-out-alt" like icon, which is red-themed */}
          <FontAwesome5
            name={actionIconName}
            size={18}
            className="text-red-400"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProfileHeader;