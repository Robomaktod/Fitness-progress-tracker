import React from "react";
import { View, ViewProps, Platform } from "react-native";
// import { BlurView } from 'expo-blur'; // Uncomment if you have expo-blur and want to use it

interface SectionCardProps extends ViewProps {
  children: React.ReactNode;
  borderColorClassName?: string; // e.g., "border-purple-500/30"
  shadowColor?: string; // Hex color for the shadow, e.g., '#8B5CF6' (violet)
  // Add other style-related props if needed
}

const SectionCard: React.FC<SectionCardProps> = ({
  children,
  className,
  borderColorClassName = "border-gray-700/30", // Default subtle border
  shadowColor = "#000000", // Default shadow color
  ...props
}) => {
  // Note: Achieving the exact CSS `box-shadow` for a "glow" effect is tricky in React Native.
  // Standard shadow props are used here. For a pronounced glow, consider image assets or more complex SVG/View layering.
  // The `shadowColor` prop allows tinting the shadow, which helps.
  // `backdrop-blur` from the HTML example requires a library like `expo-blur`.

  // Base card classes - using your dark theme colors
  const cardBaseClasses = "rounded-2xl p-4 mb-5 overflow-hidden"; // overflow-hidden for rounded corners with internal content
  // Using dark-200 as a base for the semi-transparent background
  const cardBackgroundClasses = "bg-dark-200/60"; // Adjust opacity (e.g., /60, /70) as needed to match design

  // --- If using expo-blur ---
  // return (
  //   <View
  //     className={`${cardBaseClasses} ${borderColorClassName} ${className ?? ''}`}
  //     style={[
  //       Platform.OS === 'ios' ? { // iOS tends to show shadows better
  //         shadowColor: shadowColor,
  //         shadowOffset: { width: 0, height: 2 },
  //         shadowOpacity: 0.2, // Softer opacity for glow
  //         shadowRadius: 8,    // Larger radius for glow
  //       } : { // Android elevation for shadow
  //         elevation: 5,
  //         // Android shadow color is harder to tint effectively without workarounds
  //       },
  //     ]}
  //     {...props}
  //   >
  //     <BlurView
  //        tint="dark" // or 'light', 'default'
  //        intensity={Platform.OS === 'ios' ? 30 : 60} // Adjust intensity
  //        className="absolute inset-0 rounded-2xl" // Ensure BlurView covers the area and respects border radius
  //     />
  //     {/* Content must be on top of BlurView */}
  //     <View className="relative z-10">
  //        {children}
  //     </View>
  //   </View>
  // );
  // --- End if using expo-blur ---

  // --- Without expo-blur (semi-transparent background) ---
  return (
    <View
      className={`${cardBaseClasses} ${cardBackgroundClasses} ${borderColorClassName} ${className ?? ""}`}
      style={[
        // Shadow styles:
        // iOS allows colored shadows more easily. Android elevation is more about depth.
        // The visual "glow" in the image is prominent. This is an approximation.
        Platform.OS === "ios"
          ? {
              shadowColor: shadowColor,
              shadowOpacity: 0.3, // Match opacity from HTML example's rgba
              shadowRadius: 8, // Larger radius for a softer, wider shadow (glow)
            }
          : {
              elevation: 8, // Android elevation, adjust for desired depth
              // Note: Android shadow color is not directly settable like iOS with `shadowColor`
              // It often picks up a dark tint. To color Android shadows, one might use libraries or custom native code.
            },
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

export default SectionCard;
