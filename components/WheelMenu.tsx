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

/*const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#1a1a2e", // Dark futuristic background
    },
    content: {
      flex: 1,
    },
    radialMenuTrigger: {
      position: "absolute",
      bottom: 40,
      right: 30,
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: "#00f2ea", // Neon accent color
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#00f2ea",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.7,
      shadowRadius: 10,
      elevation: 10,
      zIndex: 1000, // Ensure it's above other content
    },
    radialMenuContainer: {
      position: "absolute",
      bottom: 120, // Position above the trigger
      right: 30,
      alignItems: "flex-end",
      zIndex: 999, // Below trigger when closed, but above content
    },
    menuItem: {
      backgroundColor: "rgba(25, 28, 49, 0.8)", // Glassmorphism attempt
      paddingVertical: 12,
      paddingHorizontal: 20,
      marginVertical: 5,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      borderColor: "#00f2ea",
      borderWidth: 1,
    },
    menuItemText: {
      color: "#e0e0e0", // Light text for readability
      fontSize: 16,
      marginLeft: 10,
      fontFamily: "YourFuturisticFont-Regular", // Replace with your font
    },
    activeMenuItemText: {
      color: "#00f2ea", // Neon color for active item
      fontWeight: "bold",
    },
    menuIcon: {
      color: "#e0e0e0",
    },
    activeMenuIcon: {
      color: "#00f2ea",
    },
    menuTriggerIcon: {
      // Style for the '+' or menu icon on the trigger
    },
  });*/
