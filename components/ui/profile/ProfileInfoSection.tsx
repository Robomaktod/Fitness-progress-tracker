import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { View, Text, TouchableOpacity, Image as RNImage } from "react-native";
// import { Image as ExpoImage } from 'expo-image'; // Preferred for caching, placeholders

// const placeholderImage = require('@/assets/images/default-avatar.png'); // Add a default avatar

interface ProfileInfoSectionProps {
  name: string;
  memberSince: string;
  avatarUrl?: string;
  onEditAvatarPress?: () => void;
}

const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({
  name,
  memberSince,
  avatarUrl, // = placeholderImage for ExpoImage
  onEditAvatarPress,
}) => {
  return (
    <View className="mb-6 items-center text-center">
      <View className="relative inline-block">
        <View className="mb-3 h-24 w-24 rounded-full border-2 border-fuchsia-500 p-1 shadow-[0_0_15px_rgba(192,38,211,0.5)]">
          {/* Replace RNImage with ExpoImage for better performance and caching */}
          <RNImage
            source={
              avatarUrl
                ? { uri: avatarUrl }
                : require("@/assets/images/icon.png")
            } // Fallback to local placeholder
            className="h-full w-full rounded-full object-cover"
            // For ExpoImage: placeholder={placeholderImage} contentFit="cover" transition={200}
          />
        </View>
        {onEditAvatarPress && (
          <TouchableOpacity
            onPress={onEditAvatarPress}
            className="absolute bottom-2 right-0 h-8 w-8 items-center justify-center rounded-full bg-fuchsia-500 shadow-lg"
            accessibilityLabel="Edit profile picture"
          >
            <FontAwesome5 name="camera" size={12} className="text-white" />
          </TouchableOpacity>
        )}
      </View>
      <Text className="text-xl font-bold text-white">{name}</Text>
      <Text className="text-sm text-gray-400">
        Active Member since {memberSince}
      </Text>
    </View>
  );
};

export default ProfileInfoSection;