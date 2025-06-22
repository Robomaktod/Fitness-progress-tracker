import error from "@/assets/icons/error.png";
import google from "@/assets/icons/google.png";
import success from "@/assets/icons/success.png";
import mainIcon from "@/assets/images/react-logo.png";
import { MealTimeOption, StaticStatCardInfo } from "@/types/health";

export const images = {
  mainIcon,
};

export const icons = {
  google,
  success,
  error,
};

export const menuItems = [
  {
    name: "Dashboard",
    path: "/index",
    icon: "speedometer-outline" as const,
  },
  {
    name: "Nutrition",
    path: "/nutrition",
    icon: "restaurant-outline" as const,
  },
  {
    name: "Activity",
    path: "/activity",
    icon: "barbell-outline" as const,
  },
  {
    name: "Progress",
    path: "/progress",
    icon: "trending-up-outline" as const,
  },
  {
    name: "Social",
    path: "/social",
    icon: "people-outline" as const,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: "person-circle-outline" as const,
  },
];

export const onboarding = [
  {
    id: 1,
    title: "Track Your Health Journey",
    description:
      "Monitor your daily activities, nutrition, and progress with our advanced tracking system",
  },
  {
    id: 2,
    title: "Set Your Goals",
    description:
      "Customize your fitness targets and let us help you achieve your personal health objectives",
  },
  {
    id: 3,
    title: "You're All Set!",
    description:
      "Your personalized health journey begins now. Let's start tracking your progress!",
  },
];

export const gradients = {
  default: ["#1ED2EE", "#7B39ED"],
  oceanBlue: ["#2193b0", "#6dd5ed", "#2E8BC0"],
  pastelDream: ["#A1C4FD", "#C2E9FB", "#FFDBE4"],
  neonParty: ["#ff00cc", "#3333ff", "#00ffcc"],
} as const;
export type GradientName = keyof typeof gradients;

export const STATIC_ACTIVITY_CARDS: StaticStatCardInfo[] = [
  {
    id: "calories",
    title: "Calories",
    defaultIconName: "fire",
    defaultIconProvider: "FontAwesome5",
    defaultIconClassName: "text-orange-400",
    defaultBlurBgClassName: "bg-purple-500/10",
  },
  {
    id: "heartRate",
    title: "Heart Rate",
    defaultIconName: "heartbeat",
    defaultIconProvider: "FontAwesome5",
    defaultIconClassName: "text-red-400",
    defaultBlurBgClassName: "bg-blue-500/10",
  },
  {
    id: "steps",
    title: "Steps",
    defaultIconName: "shoe-prints",
    defaultIconProvider: "FontAwesome5",
    defaultIconClassName: "text-green-400",
    defaultBlurBgClassName: "bg-green-500/10",
  },
  {
    id: "sleep",
    title: "Sleep",
    defaultIconName: "moon",
    defaultIconProvider: "Ionicons",
    defaultIconClassName: "text-purple-400",
    defaultBlurBgClassName: "bg-yellow-500/10",
  },
];

export const MEAL_TIME_OPTIONS: MealTimeOption[] = [
  {
    id: "Breakfast",
    name: "Breakfast",
    iconName: "cafe",
    iconProvider: "Ionicons",
  },
  {
    id: "Lunch",
    name: "Lunch",
    iconName: "restaurant",
    iconProvider: "Ionicons",
  },
  { 
    id: "Dinner", 
    name: "Dinner", 
    iconName: "moon", 
    iconProvider: "Ionicons" },
  {
    id: "Snacks",
    name: "Snacks",
    iconName: "ice-cream",
    iconProvider: "Ionicons",
  },
];