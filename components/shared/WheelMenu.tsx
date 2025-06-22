import { Ionicons } from "@expo/vector-icons";
import { router, usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";

import { menuItems } from "@/constants";

const WheelMenu = () => {
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const router = useRouter();
  // const pathname = usePathname();

  return (
    <View className="absolute bottom-[120px] right-[30px] items-end z-50">
      {menuItems.map((item, index) => (
        <Pressable
          key={item.name}
          className="animate-wiggle flex flex-row"
          onPress={() => Alert.alert(item.path)}
        >
          <Ionicons name={item.icon} size={24} className="text-[#00f2ea]" />

          <Text className="text-active text-xl">{item.name}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default WheelMenu;