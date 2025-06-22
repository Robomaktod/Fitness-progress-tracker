import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { AppColors, AppColorClasses } from "@/theme/colors";

interface TabItemProps {
  label: string;
  iconName: React.ComponentProps<typeof FontAwesome5>["name"];
  isActive?: boolean;
  onPress: () => void;
}

const TabItem: React.FC<TabItemProps> = ({
  label,
  iconName,
  isActive,
  onPress,
}) => {
  const color = isActive ? AppColors.blue400 : AppColors.gray500;
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 flex-col items-center justify-center py-2"
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      activeOpacity={0.7}
    >
      <FontAwesome5 name={iconName} size={20} color={color} />
      <Text
        className={`mt-1 text-xs ${isActive ? "text-blue-400" : "text-gray-500"}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const BottomTabBar: React.FC = () => {
  // In a real app, active state would come from navigation
  const [activeTab, setActiveTab] = React.useState("Home");

  const tabs = [
    { name: "Home", icon: "home", key: "Home" },
    { name: "Stats", icon: "chart-line", key: "Stats" },
    { name: "Add", icon: "plus", key: "Add", isCentral: true },
    { name: "Workouts", icon: "dumbbell", key: "Workouts" },
    { name: "Profile", icon: "user-alt", key: "Profile" },
  ];

  return (
    <View
      className={`h-16 flex-row ${AppColorClasses.backgroundDark} border-t ${AppColorClasses.borderDark}`}
    >
      {tabs.map((tab) => {
        if (tab.isCentral) {
          return (
            <View key={tab.key} className="flex-1 items-center justify-center">
              <TouchableOpacity
                className="relative -mt-7"
                onPress={() => console.log("Add button pressed")}
                accessibilityLabel="Add new entry"
                accessibilityRole="button"
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#FF6F00", "#FF8F00"]}
                  className="h-14 w-14 items-center justify-center rounded-full shadow-lg"
                >
                  <FontAwesome5
                    name={tab.icon as any}
                    size={22}
                    color={AppColors.white}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          );
        }
        return (
          <TabItem
            key={tab.key}
            label={tab.name}
            iconName={tab.icon as any}
            isActive={activeTab === tab.name}
            onPress={() => setActiveTab(tab.name)}
          />
        );
      })}
    </View>
  );
};

export default BottomTabBar;