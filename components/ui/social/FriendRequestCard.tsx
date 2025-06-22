import React from "react";
import { View, Text, TouchableOpacity, Image as RNImage } from "react-native";

// import { Image as ExpoImage } from 'expo-image';
import { FriendRequestData } from "@/types/social";

interface FriendRequestCardProps {
  request: FriendRequestData;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  request,
  onAccept,
  onReject,
}) => {
  return (
    <View className="mb-3 flex-row items-center rounded-xl bg-dark-100/60 p-3">
      {/* Replace RNImage with ExpoImage for better performance/caching */}
      <RNImage
        source={
          request.avatarUrl
            ? { uri: request.avatarUrl }
            : require("@/assets/images/icon.png")
        } // Fallback
        className="h-12 w-12 rounded-full"
      />
      <View className="ml-3 flex-1">
        <Text className="text-base font-medium text-white">{request.name}</Text>
        <Text className="text-xs text-gray-400">
          {request.mutualFriendsCount} mutual friends
        </Text>
      </View>
      <View className="flex-row space-x-2">
        <TouchableOpacity
          onPress={() => onAccept(request.id)}
          className="rounded-lg border border-green-500/50 bg-green-500/20 px-4 py-1.5"
          activeOpacity={0.7}
        >
          <Text className="text-sm font-medium text-green-400">Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onReject(request.id)}
          className="rounded-lg border border-red-500/50 bg-red-500/20 px-4 py-1.5"
          activeOpacity={0.7}
        >
          <Text className="text-sm font-medium text-red-400">Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default FriendRequestCard;