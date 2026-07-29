import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "./apiClient";

interface ActivityLogFilters {
  userId?: string;
  date?: string;
  start?: string;
  end?: string;
}

interface QueryToggleOptions {
  enabled?: boolean;
}

interface NewActivityLogEntry {
  type: "activity" | "exercise";
  date: string;
  userId: string | null | undefined;
  categoryId?: string;
  categoryName?: string;
  duration?: number;
  exerciseTypeId?: string;
  exerciseTypeName?: string;
  sets?: number;
  reps?: number;
}

// Fetch activity logs with optional filters (userId, date, period)
export function useFetchActivityLogs(
  filters: ActivityLogFilters = {},
  options: QueryToggleOptions = {},
) {
  return useQuery({
    queryKey: ["activityLogs", filters],
    queryFn: async () => {
      const definedFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== undefined),
      ) as Record<string, string>;
      const params = new URLSearchParams(definedFilters).toString();
      const { data } = await apiClient.get(`/activity?${params}`);
      return data;
    },
    ...options,
  });
}

// Delete an activity log by id
export function useDeleteActivityLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      const { data } = await apiClient.delete(`/activity/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activityLogs"] });
    },
  });
}

// Create a new activity or exercise log
export function useCreateActivityLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (activity: NewActivityLogEntry) => {
      const { data } = await apiClient.post("/activity", activity);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activityLogs"] });
    },
  });
}
