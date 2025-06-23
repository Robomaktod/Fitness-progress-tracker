import { useQuery } from '@tanstack/react-query';
import { apiClient } from './apiClient';

export function useExerciseTypes() {
  return useQuery({
    queryKey: ['exerciseTypes'],
    queryFn: async () => {
      const { data } = await apiClient.get('/activity/exercise-types');
      return data;
    },
  });
}

export function useActivityCategories() {
  return useQuery({
    queryKey: ['activityCategories'],
    queryFn: async () => {
      const { data } = await apiClient.get('/activity/activity-categories');
      return data;
    },
  });
}
