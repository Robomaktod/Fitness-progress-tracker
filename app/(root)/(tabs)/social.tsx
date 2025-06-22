import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  StatusBar,
  Text,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SectionCard from "@/components/ui/progress/SectionCard"; // Re-using for general card structure
import FriendListItem from "@/components/ui/social/FriendListItem";
import FriendRequestCard from "@/components/ui/social/FriendRequestCard";
import SocialHeader from "@/components/ui/social/SocialHeader";
import { FriendRequestData, FriendData } from "@/types/social";

const screenBackgroundGradient: readonly [string, string, string] = [
  "#111827",
  "#1E1B4B",
  "#4A044E",
]; // gray-900, deep-blue/indigo, deep-purple

const getMockFriendRequests = (): FriendRequestData[] => [
  {
    id: "req1",
    name: "Sarah Cooper",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    mutualFriendsCount: 3,
  },
  {
    id: "req2",
    name: "Mike Johnson",
    avatarUrl: "https://i.pravatar.cc/150?img=2",
    mutualFriendsCount: 5,
  },
];

const getMockFriends = (): FriendData[] => [
  {
    id: "f1",
    name: "Emma Wilson",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    activitySummary: "5 workouts this week",
    activityIconName: "fire",
    activityIconProvider: "FontAwesome5",
    activityIconColorClassName: "text-cyan-400",
    achievementIconName: "medal",
    achievementIconColorClassName: "text-cyan-400",
    achievementIconBgClassName: "bg-cyan-500/20",
  },
  {
    id: "f2",
    name: "Alex Chen",
    avatarUrl: "https://i.pravatar.cc/150?img=4",
    activitySummary: "3 workouts this week",
    activityIconName: "dumbbell",
    activityIconProvider: "FontAwesome5",
    activityIconColorClassName: "text-purple-400",
    achievementIconName: "chart-line",
    achievementIconProvider: "FontAwesome5",
    achievementIconColorClassName: "text-purple-400",
    achievementIconBgClassName: "bg-purple-500/20",
  },
  {
    id: "f3",
    name: "Lisa Thompson",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    activitySummary: "7 workouts this week",
    activityIconName: "person-running",
    activityIconProvider: "FontAwesome5",
    activityIconColorClassName: "text-green-400",
    achievementIconName: "crown",
    achievementIconProvider: "FontAwesome5",
    achievementIconColorClassName: "text-green-400",
    achievementIconBgClassName: "bg-green-500/20",
  },
];

const SocialScreen: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [friendRequests, setFriendRequests] = useState<FriendRequestData[]>([]);
  const [myFriends, setMyFriends] = useState<FriendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    // Simulate API calls
    await new Promise((resolve) => setTimeout(resolve, 500));
    setFriendRequests(getMockFriendRequests());
    setMyFriends(getMockFriends());
    setIsLoading(false);
  }, []);

  useFocusEffect(fetchData);

  const handleAcceptRequest = (id: string) =>
    Alert.alert("Request Accepted", `Accepted friend request from ID: ${id}`);
  const handleRejectRequest = (id: string) =>
    Alert.alert("Request Rejected", `Rejected friend request from ID: ${id}`);
  const handleFriendPress = (friendId: string) => {
    console.log("View friend:", friendId);
    // Navigate to a friend's profile or the comparison screen
    router.push({
      pathname: "/(root)/friend-comparison",
      params: { friendId },
    });
  };
  const handleSearchSubmit = () => {
    // router.push({ pathname: '/search-user', params: { query: searchTerm }}) // Navigate to existing search user page
    Alert.alert(
      "Search Submitted",
      `Searching for: ${searchTerm}. Navigating to search page TBD.`,
    );
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={screenBackgroundGradient}
        className="flex-1 items-center justify-center"
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={screenBackgroundGradient[0]}
        />
        <ActivityIndicator size="large" color="#FFFFFF" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={screenBackgroundGradient} className="flex-1">
      <SafeAreaView edges={["top"]} className="flex-1">
        <StatusBar
          barStyle="light-content"
          backgroundColor={screenBackgroundGradient[0]}
        />
        <SocialHeader
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-4 pb-6"
        >
          {/* Friend Requests Section */}
          {friendRequests.length > 0 && (
            <SectionCard
              borderColorClassName="border-green-500/30"
              shadowColor="#22C55E" // Green
              className="bg-dark-200/70" // Match card background style from image
            >
              <Text className="mb-4 text-lg font-semibold text-gray-200">
                Friend Requests
              </Text>
              <View className="space-y-3">
                {friendRequests.map((req) => (
                  <FriendRequestCard
                    key={req.id}
                    request={req}
                    onAccept={handleAcceptRequest}
                    onReject={handleRejectRequest}
                  />
                ))}
              </View>
            </SectionCard>
          )}

          {/* My Friends Section */}
          <SectionCard
            borderColorClassName="border-blue-500/30"
            shadowColor="#3B82F6" // Blue
            className="bg-dark-200/70"
          >
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-200">
                My Friends
              </Text>
              <Text className="text-sm text-blue-400">
                {myFriends.length} Total
              </Text>
            </View>
            <View className="space-y-3">
              {myFriends.map((friend) => (
                <FriendListItem
                  key={friend.id}
                  friend={friend}
                  onPress={handleFriendPress}
                />
              ))}
            </View>
            {myFriends.length === 0 && !isLoading && (
              <Text className="py-4 text-center text-gray-500">
                No friends yet. Try searching for some!
              </Text>
            )}
          </SectionCard>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};
export default SocialScreen;