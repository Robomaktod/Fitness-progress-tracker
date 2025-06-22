import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { View, TextInput } from "react-native";

import GradientText from "@/components/shared/GradientText";

const friendsTitleGradient: readonly [string, string, ...string[]] = [
  "#A78BFA",
  "#F472B6",
];

interface SocialHeaderProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearchSubmit?: () => void;
}

const SocialHeader: React.FC<SocialHeaderProps> = ({
  searchTerm,
  onSearchTermChange,
  onSearchSubmit,
}) => {
  return (
    <View className="bg-transparent px-5 pb-2 pt-4">
      <GradientText
        colors={[friendsTitleGradient[0], friendsTitleGradient[1]]}
        className="mb-4 text-2xl font-bold"
      >
        Friends
      </GradientText>
      <View className="relative">
        <FontAwesome5
          name="search"
          size={16}
          className="absolute left-4 top-3.5 z-10 text-fuchsia-400"
        />
        <TextInput
          placeholder="Search friends..."
          placeholderTextColor="#9CA3AF" // gray-400
          value={searchTerm}
          onChangeText={onSearchTermChange}
          onSubmitEditing={onSearchSubmit}
          className="h-12 w-full rounded-xl border border-fuchsia-500/50 bg-dark-100/50 pl-12 pr-4 text-base text-white focus:border-fuchsia-500"
          // dark-100/50 = approx bg-black/30 from image
          returnKeyType="search"
        />
      </View>
    </View>
  );
};
export default SocialHeader;