import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, TouchableOpacity, Image as RNImage } from "react-native";

// import { Image as ExpoImage } from 'expo-image';
import { FriendData } from "@/types/social";

interface FriendListItemProps {
  friend: FriendData;
  onPress: (friendId: string) => void; // For navigating to profile or comparison
}

const FriendListItem: React.FC<FriendListItemProps> = ({ friend, onPress }) => {
  const ActivityIcon =
    friend.activityIconProvider === "Ionicons" ? Ionicons : FontAwesome5;
  const AchievementIcon =
    friend.achievementIconProvider === "Ionicons" ? Ionicons : FontAwesome5;

  return (
    <TouchableOpacity
      onPress={() => onPress(friend.id)}
      className="mb-3 flex-row items-center rounded-xl bg-dark-100/60 p-3"
      activeOpacity={0.7}
    >
      <RNImage
        source={
          friend.avatarUrl
            ? { uri: friend.avatarUrl }
            : require("@/assets/images/icon.png")
        }
        className="h-12 w-12 rounded-full"
      />
      <View className="ml-3 flex-1">
        <Text className="text-base font-medium text-white">{friend.name}</Text>
        <View className="mt-0.5 flex-row items-center">
          <ActivityIcon
            name={friend.activityIconName as any}
            size={12}
            className={`${friend.activityIconColorClassName || "text-gray-400"} mr-1.5`}
          />
          <Text
            className={`text-xs ${friend.activityIconColorClassName || "text-gray-400"}`}
          >
            {friend.activitySummary}
          </Text>
        </View>
      </View>
      {friend.achievementIconName && (
        <View
          className={`h-8 w-8 items-center justify-center rounded-full ${friend.achievementIconBgClassName || "bg-gray-700/50"}`}
        >
          <AchievementIcon
            name={friend.achievementIconName as any}
            size={14}
            className={friend.achievementIconColorClassName || "text-gray-300"}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};
export default FriendListItem;