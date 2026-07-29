import { IconNameFA5, IconNameIonicons, IconProvider } from "./health";

export interface FriendRequestData {
  id: string;
  name: string;
  avatarUrl?: string;
  mutualFriendsCount: number;
}

export interface FriendData {
  id: string;
  name: string;
  avatarUrl?: string;
  activitySummary: string; // e.g., "5 workouts this week"
  activityIconName: IconNameFA5 | IconNameIonicons; // Icon representing primary activity type
  activityIconProvider?: IconProvider;
  activityIconColorClassName?: string; // e.g., text-cyan-400
  achievementIconName?: IconNameFA5 | IconNameIonicons; // The icon on the far right (medal, chart, crown)
  achievementIconProvider?: IconProvider;
  achievementIconColorClassName?: string;
  achievementIconBgClassName?: string; // e.g., bg-cyan-500/20
}

export interface GiftedChartDataPoint {
  value: number;
  label?: string; // For X-axis label, often taken from the 'labels' prop or generated
  labelText?: string; // Alternative for X-axis label if needed
  date?: string; // Can be useful for time-series data
  dataPointText?: string; // Text to display on the data point itself
  // ... other props supported by react-native-gifted-charts data points
}

export interface ComparisonChartDataPoint {
  // Keep this for conceptual clarity or simplify
  label: string; // X-axis label (e.g., 'Mon', 'Week 1', 'Jan')
  userValue: number; // Y-axis value for the current user
  friendValue: number; // Y-axis value for the friend
}

export interface ComparisonStat {
  id: string;
  title: string;
  userValueDisplay: string;
  friendValueDisplay: string;
  unit?: string;
  // chartData will still hold the original comparison structure,
  // transformation will happen in the Chart component
  chartData?: ComparisonChartDataPoint[];
  // Props specific to how react-native-gifted-charts might need styling
  userLineColor?: string;
  friendLineColor?: string;
}
