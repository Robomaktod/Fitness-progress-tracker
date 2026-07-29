import {
  useQuery,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";

import { apiClient } from "./apiClient";

interface AddWeightPayload {
  weight: number;
  date?: string;
}

export function useWeightProgress(userId: string) {
  return useQuery({
    queryKey: ["progress", "weight", userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/progress/weight?userId=${userId}`);
      return data;
    },
    enabled: !!userId,
  });
}

export function useActivityTrends(userId: string) {
  return useQuery({
    queryKey: ["progress", "activity", userId],
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/progress/activity?userId=${userId}`,
      );
      return data;
    },
    enabled: !!userId,
  });
}

export function useCalorieTrends(userId: string) {
  return useQuery({
    queryKey: ["progress", "calories", userId],
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/progress/calories?userId=${userId}`,
      );
      return data;
    },
    enabled: !!userId,
  });
}

export function useAddWeight(
  userId: string,
  options?: Omit<
    UseMutationOptions<unknown, Error, AddWeightPayload>,
    "mutationFn"
  >,
) {
  return useMutation<unknown, Error, AddWeightPayload>({
    mutationFn: async ({ weight, date }) => {
      const res = await apiClient.post("/progress/weight", {
        userId,
        weight,
        date, // optional, defaults to today
      });
      return res.data;
    },
    ...options,
  });
}
