import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';

// Fetch activity logs with optional filters (userId, date, period)
export function useFetchActivityLogs(filters: any = {}, options: any = {}) {
  return useQuery({
    queryKey: ['activityLogs', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters).toString();
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
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
    },
  });
}

// Create a new activity log
export function useCreateActivityLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (activity: any) => {
      const { data } = await apiClient.post('/activity', activity);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
    },
  });
}

// Fetch all activity categories and exercise types for modal dropdowns
export function useActivityAndExerciseCategories(options: any = {}) {
  return useQuery({
    queryKey: ['activityAndExerciseCategories'],
    queryFn: async () => {
      const [activityRes, exerciseRes] = await Promise.all([
        apiClient.get('/activity/categories'),
        apiClient.get('/exercise/types'),
      ]);
      return {
        activityCategories: activityRes.data,
        exerciseTypes: exerciseRes.data,
      };
    },
    ...options,
  });
}

export function useActivityCategories(options: any = {}) {
  return useQuery({
    queryKey: ['activityCategories'],
    queryFn: async () => {
      const { data } = await apiClient.get('/activity/categories');
      return data;
    },
    ...options,
  });
}

export function useExerciseTypes(options: any = {}) {
  return useQuery({
    queryKey: ['exerciseTypes'],
    queryFn: async () => {
      const { data } = await apiClient.get('/activity/exercise-types');
      return data;
    },
    ...options,
  });
}
