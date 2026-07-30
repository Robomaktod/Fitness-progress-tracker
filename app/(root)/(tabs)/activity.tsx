import { useAuth } from "@clerk/clerk-expo";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useCallback } from "react";
import {
  View,
  StatusBar,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  useFetchActivityLogs,
  useDeleteActivityLog,
  useCreateActivityLog,
} from "@/api/useActivityLogs";
import {
  useActivityCategories,
  useExerciseTypes,
} from "@/api/useActivityTypes";
import CustomButton from "@/components/shared/CustomButton";
import ActivityLogCard from "@/components/ui/activity/ActivityLogCard";
import ActivityLogHeader from "@/components/ui/activity/ActivityLogHeader";
import AddActivityModal from "@/components/ui/activity/AddActivityModal";
import AddExerciseModal from "@/components/ui/activity/AddExerciseModal";
import FilterTabs from "@/components/ui/activity/FilterTabs";
import { ActivityLogItemData } from "@/types/health";

const screenBackgroundGradient: readonly [string, string, string] = [
  "#111827",
  "#301934",
  "#172554",
];

const ActivityLogScreen: React.FC = () => {
  const { userId } = useAuth();

  const [selectedFilter, setSelectedFilter] = useState<string>("Today");
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);

  const { data: activityCategories = [], isLoading: isLoadingCategories } =
    useActivityCategories();
  const { data: exerciseTypes = [], isLoading: isLoadingExerciseTypes } =
    useExerciseTypes();

  // Prepare filters for the API call based on selectedFilter
  const getApiFilters = useCallback(() => {
    if (!userId) return { userId: "" };
    const now = new Date();
    let dateFilter;
    // If your backend supports date ranges or specific keywords, adjust this
    switch (selectedFilter) {
      case "Today":
        dateFilter = format(now, "yyyy-MM-dd");
        break;
      case "Yesterday":
        dateFilter = format(subDays(now, 1), "yyyy-MM-dd");
        break;
      case "This Week":
        return {
          userId,
          start: format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
          end: format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
        };
      default:
        dateFilter = undefined;
    }
    return { userId, date: dateFilter };
  }, [userId, selectedFilter]);

  const apiFilters = getApiFilters();

  const {
    data: activityLogRaw,
    isLoading: isLoadingActivities,
    error: fetchError,
    refetch,
    isFetching: isRefetchingActivities,
  } = useFetchActivityLogs(apiFilters, { enabled: !!userId });

  const activityLog: ActivityLogItemData[] = Array.isArray(activityLogRaw)
    ? activityLogRaw
    : [];

  const { mutate: deleteActivityLog, isPending: isDeletingLog } =
    useDeleteActivityLog();
  const { mutate: createActivityLog, isPending: isCreating } =
    useCreateActivityLog();

  const handleFilterChange = (option: string) => {
    setSelectedFilter(option);
    // TanStack Query will automatically refetch if `apiFilters` (part of queryKey) changes.
  };

  const handleMoreOptions = (logId: string) => {
    Alert.alert("Activity Options", "What would you like to do?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Edit (TBD)",
        onPress: () =>
          Alert.alert("Edit", "Edit functionality to be implemented."),
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => confirmDeleteLog(logId),
      },
    ]);
  };

  const confirmDeleteLog = (logId: string) => {
    Alert.alert(
      "Delete Activity",
      "Are you sure you want to delete this log?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteActivityLog(logId, {
              onError: (deleteErr: any) => {
                Alert.alert(
                  "Delete Failed",
                  deleteErr.message || "Could not delete activity log.",
                );
              },
              // onSuccess is handled by query invalidation in the hook
            });
          },
        },
      ],
    );
  };

  const renderActivityItem = ({ item }: { item: ActivityLogItemData }) => (
    <ActivityLogCard item={item} onMoreOptionsPress={handleMoreOptions} />
  );

  const effectiveIsLoading = isLoadingActivities && activityLog.length === 0; // Show main loader only if no data yet

  const handleAddActivity = (activity: {
    categoryId: string;
    duration: string;
    date: string;
  }) => {
    const category = activityCategories.find(
      (cat) => cat.id === activity.categoryId,
    );
    createActivityLog(
      {
        categoryId: activity.categoryId,
        categoryName: category?.name || "",
        duration: Number(activity.duration),
        date: activity.date,
        type: "activity",
        userId,
      },
      {
        onSuccess: () => setShowAddActivityModal(false),
        onError: (err: any) =>
          Alert.alert("Error", err.message || "Failed to add activity."),
      },
    );
  };

  const handleAddExercise = (exercise: {
    exerciseTypeId: string;
    sets: string;
    reps: string;
    date: string;
  }) => {
    const exerciseType = exerciseTypes.find(
      (ex) => ex.id === exercise.exerciseTypeId,
    );
    createActivityLog(
      {
        exerciseTypeId: exercise.exerciseTypeId,
        exerciseTypeName: exerciseType?.name || "",
        sets: Number(exercise.sets),
        reps: Number(exercise.reps),
        date: exercise.date,
        type: "exercise",
        userId,
      },
      {
        onSuccess: () => setShowAddExerciseModal(false),
        onError: (err: any) =>
          Alert.alert("Error", err.message || "Failed to add exercise."),
      },
    );
  };

  return (
    <LinearGradient colors={screenBackgroundGradient} className="flex-1">
      <SafeAreaView edges={["top"]} className="flex-1">
        <StatusBar
          barStyle="light-content"
          backgroundColor={screenBackgroundGradient[0]}
        />
        <ActivityLogHeader
          onFilterPress={() =>
            Alert.alert("Filter Options", "Advanced filtering TBD.")
          }
        />
        <FilterTabs
          options={["Today", "Yesterday", "This Week"]}
          selectedOption={selectedFilter}
          onSelectOption={handleFilterChange}
        />

        {effectiveIsLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text className="mt-2 text-gray-300">Loading activities...</Text>
          </View>
        ) : fetchError ? (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-center text-lg text-red-400">
              {(fetchError as Error).message}
            </Text>
            <CustomButton
              title="Retry"
              onPress={() => refetch()}
              className="mt-4 w-1/2"
            />
          </View>
        ) : activityLog.length === 0 ? (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-center text-lg text-gray-400">
              No activities logged for {selectedFilter.toLowerCase()}.
            </Text>
            <CustomButton
              title="Reload"
              onPress={() => refetch()}
              className="mt-4 w-1/2"
            />
          </View>
        ) : (
          <FlatList
            data={activityLog}
            renderItem={renderActivityItem}
            keyExtractor={(item) => item.id}
            className="px-4"
            contentContainerClassName="pb-28"
            showsVerticalScrollIndicator={false}
            refreshControl={
              // Added for pull-to-refresh
              <RefreshControl
                refreshing={isRefetchingActivities}
                onRefresh={refetch}
                tintColor="#FFFFFF" // For iOS
                colors={["#FFFFFF"]} // For Android
              />
            }
          />
        )}
        <View className="absolute bottom-8 left-4 right-4 flex-row gap-3">
          <CustomButton
            title="Add Activity"
            onPress={() => setShowAddActivityModal(true)}
            className="flex-1"
            disabled={isCreating}
          />
          <CustomButton
            title="Add Exercise"
            onPress={() => setShowAddExerciseModal(true)}
            className="flex-1"
            disabled={isCreating}
          />
        </View>
        <AddActivityModal
          isVisible={showAddActivityModal}
          onClose={() => setShowAddActivityModal(false)}
          onSave={handleAddActivity}
          categories={activityCategories}
          isLoading={isLoadingCategories}
        />
        <AddExerciseModal
          isVisible={showAddExerciseModal}
          onClose={() => setShowAddExerciseModal(false)}
          onSave={handleAddExercise}
          exerciseTypes={exerciseTypes}
          isLoading={isLoadingExerciseTypes}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ActivityLogScreen;
