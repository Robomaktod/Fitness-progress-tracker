import React, { useState } from "react";
import { Slot, useRouter, usePathname, Stack } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import WheelMenu from "@/components/WheelMenu";



const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="find-ride" options={{ headerShown: false }} />
      <Stack.Screen
        name="confirm-ride"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="book-ride"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default Layout;
// export default function TabLayout() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//  const styles = StyleSheet.create({
//   radialMenuTrigger: {
//     position: "absolute",
//     bottom: 40,
//     right: 30,
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: "#00f2ea", // Neon accent color
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#00f2ea",
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.7,
//     shadowRadius: 10,
//     elevation: 10,
//     zIndex: 1000, // Ensure it's above other content
//   },
//   radialMenuContainer: {
//     position: "absolute",
//     bottom: 120, // Position above the trigger
//     right: 30,
//     alignItems: "flex-end",
//     zIndex: 999, // Below trigger when closed, but above content
//   },
//  })
//   return (
//     <SafeAreaView className="flex-1 bg-[#1a1a2e]" edges={["top", "left", "right"]}>
//       <View className="flex">
//         {/* Slot renders the current child route (e.g., dashboard.tsx) */}
//         <Slot />
//       </View>

//       { (!isMenuOpen) || WheelMenu()}
//       <Pressable
//         style={styles.radialMenuTrigger}
//         onPress={() => setIsMenuOpen(!isMenuOpen)}
//       >
//         <Ionicons
//           name={isMenuOpen ? "close-outline" : "menu-outline"}
//           size={36}
//           color="#1a1a2e"
//         />
//       </Pressable>
//     </SafeAreaView>
//   );
// }


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
