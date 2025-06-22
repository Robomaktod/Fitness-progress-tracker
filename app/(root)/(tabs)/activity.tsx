// // Fitness-progress-tracker1/app/(root)/(tabs)/activity.tsx
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router"; // useFocusEffect can be removed if not needed for other logic
// import React, { useState, useCallback } from "react";
// import {
//   View,
//   StatusBar,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   Alert,
//   RefreshControl, // For pull-to-refresh
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// import ActivityLogCard from "@/components/ui/activity/ActivityLogCard";
// import ActivityLogHeader from "@/components/ui/activity/ActivityLogHeader";
// import FilterTabs from "@/components/ui/activity/FilterTabs";
// import CustomButton from "@/components/shared/CustomButton";
// import { ActivityLogItemData } from "@/types/health";
// // import { useAppAuth } from "@/hooks/useAppAuth"; // For getting user ID
// // import { useFetchActivityLogs, useDeleteActivityLog } from "@/hooks/useActivityLogs"; // TanStack Query hooks
// // import { format, subDays, startOfWeek, endOfWeek } from 'date-fns'; // For date filtering

// const screenBackgroundGradient: readonly [string, string, string] = [
//   "#111827",
//   "#301934",
//   "#172554",
// ];

// const ActivityLogScreen: React.FC = () => {
//   const router = useRouter();
//   // const { clerkUserId, isAuthLoaded } = useAppAuth();

//   const [selectedFilter, setSelectedFilter] = useState<string>("Today");

//   // Prepare filters for the API call based on selectedFilter
//   // const getApiFilters = useCallback(() => {
//   //   if (!clerkUserId) return { userId: '' }; // Return empty if no user id, query will be disabled
//   //   const now = new Date();
//   //   let dateFilter;
//   //   // If your backend supports date ranges or specific keywords, adjust this
//   //   switch (selectedFilter) {
//   //     case "Today":
//   //       dateFilter = format(now, 'yyyy-MM-dd');
//   //       break;
//   //     case "Yesterday":
//   //       dateFilter = format(subDays(now, 1), 'yyyy-MM-dd');
//   //       break;
//   //     case "This Week":
//   //       // This is an example; your backend might need 'period=week' or specific start/end dates
//   //       // For simplicity, if backend doesn't support 'period', this might fetch all and filter client-side (less ideal)
//   //       // dateFilter = undefined; // Or send startOfWeek and endOfWeek if backend supports
//   //       break;
//   //     default:
//   //       dateFilter = undefined;
//   //   }
//   //   return { userId: clerkUserId, date: dateFilter };
//   // }, [clerkUserId, selectedFilter]);

//   // const apiFilters = getApiFilters();

//   // const {
//   //   data: activityLog = [],
//   //   isLoading: isLoadingActivities,
//   //   error: fetchError,
//   //   refetch,
//   //   isFetching: isRefetchingActivities, // For pull-to-refresh indicator
//   // } = useFetchActivityLogs(
//   //   apiFilters,
//   //   { enabled: isAuthLoaded && !!clerkUserId } // Only fetch if user is loaded and ID exists
//   // );

//   // const { mutate: deleteActivityLog, isPending: isDeletingLog } = useDeleteActivityLog();

//   const handleFilterChange = (option: string) => {
//     setSelectedFilter(option);
//     // TanStack Query will automatically refetch if `apiFilters` (part of queryKey) changes.
//   };

//   const handleMoreOptions = (logId: string) => {
//     Alert.alert("Activity Options", "What would you like to do?", [
//       { text: "Cancel", style: "cancel" },
//       { text: "Edit (TBD)", onPress: () => Alert.alert("Edit", "Edit functionality to be implemented.") },
//       {
//         text: "Delete",
//         style: "destructive",
//         onPress: () => confirmDeleteLog(logId),
//       },
//     ]);
//   };

//   const confirmDeleteLog = (logId: string) => {
//     Alert.alert("Delete Activity", "Are you sure you want to delete this log?", [
//       { text: "Cancel", style: "cancel"},
//       { text: "Delete", style: "destructive", onPress: () => {
//           deleteActivityLog(parseInt(logId, 10), {
//             onError: (deleteErr: any) => {
//               Alert.alert("Delete Failed", deleteErr.message || "Could not delete activity log.");
//             },
//             // onSuccess is handled by query invalidation in the hook
//           });
//         }
//       }
//     ]);
//   };


//   const renderActivityItem = ({ item }: { item: ActivityLogItemData }) => (
//     <ActivityLogCard item={item} onMoreOptionsPress={handleMoreOptions} />
//   );

//   const effectiveIsLoading = isLoadingActivities && !activityLog.length; // Show main loader only if no data yet

//   return (
//     <LinearGradient colors={screenBackgroundGradient} className="flex-1">
//       <SafeAreaView edges={["top"]} className="flex-1">
//         <StatusBar barStyle="light-content" backgroundColor={screenBackgroundGradient[0]} />
//         <ActivityLogHeader onFilterPress={() => Alert.alert("Filter Options", "Advanced filtering TBD.")} />
//         <FilterTabs
//           options={["Today", "Yesterday", "This Week"]}
//           selectedOption={selectedFilter}
//           onSelectOption={handleFilterChange}
//         />

//         {effectiveIsLoading ? (
//           <View className="flex-1 items-center justify-center">
//             <ActivityIndicator size="large" color="#FFFFFF" />
//             <Text className="mt-2 text-gray-300">Loading activities...</Text>
//           </View>
//         ) : fetchError ? (
//           <View className="flex-1 items-center justify-center px-4">
//             <Text className="text-lg text-red-400 text-center">{(fetchError as Error).message}</Text>
//             <CustomButton title="Retry" onPress={() => refetch()} className="mt-4 w-1/2" />
//           </View>
//         ) : activityLog.length === 0 ? (
//           <View className="flex-1 items-center justify-center px-4">
//             <Text className="text-lg text-gray-400 text-center">
//               No activities logged for {selectedFilter.toLowerCase()}.
//             </Text>
//             <CustomButton title="Reload" onPress={() => refetch()} className="mt-4 w-1/2" />
//           </View>
//         ) : (
//           <FlatList
//             data={activityLog}
//             renderItem={renderActivityItem}
//             keyExtractor={(item) => item.id}
//             className="px-4"
//             contentContainerClassName="pb-20"
//             showsVerticalScrollIndicator={false}
//             refreshControl={ // Added for pull-to-refresh
//               <RefreshControl
//                 refreshing={isRefetchingActivities}
//                 onRefresh={refetch}
//                 tintColor="#FFFFFF" // For iOS
//                 colors={["#FFFFFF"]} // For Android
//               />
//             }
//           />
//         )}
//       </SafeAreaView>
//     </LinearGradient>
//   );
// };

// export default ActivityLogScreen;