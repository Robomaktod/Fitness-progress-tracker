import { FontAwesome5, Ionicons } from "@expo/vector-icons"; // Assuming you use these, adjust if not
import { ComponentProps } from "react";

export type IconNameFA5 = ComponentProps<typeof FontAwesome5>["name"];
export type IconNameIonicons = ComponentProps<typeof Ionicons>["name"];
export type IconProvider = "FontAwesome5" | "Ionicons"; // Add more as needed

// Data for the individual statistics cards in "Your Activity"
export interface StatCardData {
  id: string;
  iconName: IconNameFA5 | IconNameIonicons;
  iconProvider?: IconProvider;
  iconClassName?: string;
  title: string;
  value: string | null; // Allow null for loading or N/A
  subValue?: string | null; // Allow null
  subValueClassName?: string;
  blurBgClassName?: string;
}

// Data for Upcoming Workouts (example, expand as needed)
export interface WorkoutData {
  id: string;
  iconName: IconNameFA5 | IconNameIonicons;
  iconProvider?: IconProvider;
  iconWrapperClassName?: string; // e.g., bg-blue-500/20
  iconClassName?: string; // e.g., text-blue-400
  title: string;
  details: string; // "30 min • Medium"
  timeInfo: string; // "Today, 6:00 PM"
  points: string; // "+250 pts"
  pointsClassName?: string; // e.g., text-blue-400
  actionIconName?: IconNameFA5 | IconNameIonicons; // e.g. 'play'
  actionIconProvider?: IconProvider;
  actionIconClassName?: string;
}

// Data for Active Challenges (example, expand as needed)
export interface ChallengeData {
  id: string;
  iconName: IconNameFA5 | IconNameIonicons;
  iconProvider?: IconProvider;
  iconWrapperClassName?: string;
  iconClassName?: string;
  tagText: string; // "5 days left" or "New"
  tagClassName?: string; // For styling the tag
  title: string;
  description: string;
  progressPercent: number; // 0-100
  progressText: string; // "5/7 days completed"
  progressBarClassName?: string;
  cardGradientVariant?: keyof typeof import("@/constants").gradients; // To pick from your defined gradients
  cardBorderClassName?: string; // e.g., border-blue-700
}

// Data for Nutrition Summary (example)
export interface NutritionSummaryItem {
  id: string;
  label: string; // "Calories", "Protein", "Water"
  currentValue: string; // "1,248"
  targetValue: string; // "of 2,000"
  statusClassName?: string; // e.g., text-green-400
}

// Data for Meal Log (example)
export interface MealLogItem {
  id: string;
  mealName: "Breakfast" | "Lunch" | "Dinner" | string; // Allow custom meal names too
  calories?: string; // "420 cal"
  description?: string; // "Oatmeal with berries..."
  isLogged: boolean;
  onAddPress?: () => void; // For the "+ Add" button
}

export interface WeightLogEntry {
  date: string; // e.g., "Apr 6", "Apr 13"
  weight: number;
}

export interface WeightProgressData {
  currentWeight: number;
  weightUnit: string; // "kg" or "lbs"
  change: number; // Can be negative
  goalWeight: number;
  history: WeightLogEntry[]; // For the chart
}

export interface ActivityTrendDay {
  dayInitial: "M" | "T" | "W" | "Th" | "F" | "S" | "Su"; // Or string if more flexible
  activePercent: number; // 0-100, for the bar height
  isFuture?: boolean; // To render differently if day hasn't occurred
}

export interface ActivityTrendsData {
  weeklyActiveDaysLabel: string;
  daysCompleted: number;
  totalDaysInWeek: number;
  dailyBreakdown: ActivityTrendDay[];
}

export interface CalorieTrendItemData {
  id: string;
  label: string; // "Daily Average", "Weekly Target"
  value: string; // "2,180 cal"
  progressPercent: number; // 0-100 for the progress bar
  progressBarColorClasses?: string; // e.g., "from-green-500 to-emerald-400"
}

export interface ActivityMetric {
  label: "Duration" | "Distance" | "Sets" | "Calories" | string; // Allow custom labels
  value: string;
  unit?: string;
}

export interface ActivityLogItemData {
  id: string;
  activityName: string;
  iconName: IconNameFA5 | IconNameIonicons; // Reusing from previous definitions
  iconProvider?: IconProvider;
  iconBgClassName?: string; // e.g., 'bg-green-500/20'
  activityDetails: string; // e.g., "Outdoor • 2:30 PM" or "Upper Body • 11:15 AM"
  metrics: ActivityMetric[];
  timestamp: number; // For sorting or display
}

export interface ActivityTypeOption {
  id: "cardio" | "strength" | string; // Unique ID
  name: string; // "Cardio", "Strength"
  description: string; // "Running, cycling, etc."
  iconName: IconNameFA5 | IconNameIonicons;
  iconProvider?: IconProvider;
  iconClassName?: string;
  cardClassName?: string; // For specific styling of the card
}

export type ActivityIntensity = "Light" | "Moderate" | "Intense";

export interface UserProfileData {
  name: string;
  avatarUrl?: string; // Optional, can fallback to a default
  memberSince: string; // e.g., "May 2025"
  bodyMetrics: {
    currentWeight: ProfileMetric;
    goalWeight: ProfileMetric;
    height: ProfileMetric;
    age: ProfileMetric;
  };
  fitnessGoals: FitnessGoal[];
  dailyTargets: {
    calories: DailyTarget;
    protein: DailyTarget;
    carbs: DailyTarget;
    fat: DailyTarget;
  };
}

export interface ProfileMetric {
  id: string;
  label: string;
  value: string;
  unit?: string;
  valueClassName?: string; // e.g., "text-cyan-400" for Body Metrics
}

export interface FitnessGoal {
  id: string;
  label: string;
  value: string;
  iconName: IconNameFA5 | IconNameIonicons;
  iconProvider?: IconProvider;
  iconClassName?: string; // e.g., "text-purple-400"
}

export interface DailyTarget {
  id: string;
  label: string;
  value: string; // e.g., "2,400", "140g"
  unit?: string; // e.g., "kcal", "g"
  valueClassName?: string; // e.g., "text-blue-400"
  // Optional: for the visual bar, if it were a progress bar
  // progressPercent?: number;
  // barColorClassName?: string;
}

export interface StaticStatCardInfo {
  id: StatCardData["id"];
  title: StatCardData["title"];
  defaultIconName: IconNameFA5 | IconNameIonicons;
  defaultIconProvider?: IconProvider;
  defaultIconClassName?: string;
  defaultBlurBgClassName?: string;
}

export interface FoodItemMacro {
  protein: string; // "12g"
  fat: string; // "13g"
  carbs: string; // "1g"
}

export interface FoodLogItemData {
  id: string;
  name: string;
  calories: string; // "180 cal"
  macros: FoodItemMacro;
  iconName: IconNameFA5 | IconNameIonicons;
  iconProvider?: IconProvider;
  iconColorClassName?: string; // e.g., "text-cyan-400"
  iconBgClassName?: string; // e.g., "bg-cyan-500/20"
}

export type MealName = "Breakfast" | "Lunch" | "Dinner" | "Snack" | string;

export interface FoodLogMealSectionData {
  mealName: MealName;
  totalCalories: string; // "420 cal"
  iconName: IconNameFA5 | IconNameIonicons;
  iconProvider?: IconProvider;
  iconColorClassName?: string; // Accent color for this meal section
  borderColorClassName?: string; // e.g., border-cyan-500/30
  shadowColor?: string; // e.g., #06B6D4 (cyan-500)
  foodItems: FoodLogItemData[];
}

export interface MealTimeOption {
  id: MealName; // 'Breakfast', 'Lunch', 'Dinner', 'Snack'
  name: MealName;
  iconName: IconNameFA5 | IconNameIonicons;
  iconProvider?: IconProvider;
}