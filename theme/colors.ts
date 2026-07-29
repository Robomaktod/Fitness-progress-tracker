// Raw color values for places that can't use NativeWind class names
// (e.g. native props like `color` on icons). Keep in sync with tailwind.config.js.
export const AppColors = {
  blue400: "#60A5FA",
  gray500: "#6B7280",
  white: "#FFFFFF",
} as const;

export const AppColorClasses = {
  backgroundDark: "bg-dark-100",
  borderDark: "border-gray-800",
} as const;
