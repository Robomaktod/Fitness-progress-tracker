import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';

// Get all nutrition logs
export function useAllNutritionLogs() {
  return useQuery({
    queryKey: ['nutrition', 'all'],
    queryFn: async () => {
      const { data } = await apiClient.get('/nutrition');
      return data;
    },
  });
}

export function useNutritionLogById(id: string | number) {
  return useQuery({
    queryKey: ['nutrition', 'id', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/nutrition/${id}`);
      return data;
    },
    enabled: !!id,
  });
}


export function useNutritionLogsByMealType(mealType: string) {
  return useQuery({
    queryKey: ['nutrition', 'mealType', mealType],
    queryFn: async () => {
      const { data } = await apiClient.get(`/nutrition/mealType/${mealType}`);
      return data;
    },
    enabled: !!mealType,
  });
}

export function useCreateNutritionLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (food: any) => {
      const { data } = await apiClient.post("/nutrition/", food);
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
      update: any; // Replace with your NutritionLogUpdateInput type if available
    }) => {
      const { data } = await apiClient.patch(`/nutrition/${id}`, update);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition'] });
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
      queryClient.invalidateQueries({ queryKey: ['nutrition'] });
    },
  });
}