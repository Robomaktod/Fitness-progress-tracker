import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "./apiClient";

interface NewNutritionLogEntry {
  userId: string | null | undefined;
  foodId: string;
  quantityConsumed: number;
  mealType: string;
  loggedAt: string;
}

interface NutritionLogUpdate {
  quantityConsumed?: number;
  mealType?: string;
  loggedAt?: string;
}

export function useAllNutritionLogs(userId: string, date?: Date) {
  return useQuery({
    queryKey: ["nutrition", "all", userId, date?.toISOString()],
    queryFn: async () => {
      const params = new URLSearchParams({
        userId,
        ...(date ? { date: date.toISOString() } : {}),
      }).toString();
      const { data } = await apiClient.get(`/nutrition/getAll?${params}`);
      return data;
    },
    enabled: !!userId,
  });
}

export function useCreateNutritionLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (food: NewNutritionLogEntry) => {
      const { data } = await apiClient.post("/nutrition/create/", food);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutrition"] });
    },
  });
}

// Update a nutrition log
export function useUpdateNutritionLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      update,
    }: {
      id: string | number;
      update: NutritionLogUpdate;
    }) => {
      const { data } = await apiClient.patch(`/nutrition/${id}`, update);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutrition"] });
    },
  });
}

// Delete a nutrition log
export function useDeleteNutritionLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      const { data } = await apiClient.delete(`/nutrition/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutrition"] });
    },
  });
}
