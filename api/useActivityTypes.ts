import { useQuery } from "@tanstack/react-query";

import { apiClient } from "./apiClient";

export interface ExerciseType {
  id: string;
  name: string;
}

export interface ActivityCategory {
  id: string;
  name: string;
}

export function useExerciseTypes() {
  return useQuery({
    queryKey: ["exerciseTypes"],
    queryFn: async () => {
      const { data } = await apiClient.get<ExerciseType[]>(
        "/activity/exercise-types",
      );
      return data;
    },
  });
}

export function useActivityCategories() {
  return useQuery({
    queryKey: ["activityCategories"],
    queryFn: async () => {
      const { data } = await apiClient.get<ActivityCategory[]>(
        "/activity/activity-categories",
      );
      return data;
    },
  });
}
