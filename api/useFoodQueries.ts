import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';


export function useFoodByBarcode(barcode: string) {
  return useQuery({
    queryKey: ['food', 'barcode', barcode],
    queryFn: async () => {
      const { data } = await apiClient.get(`/food/barcode/${barcode}`);
      return data;
    },
    enabled: !!barcode,
  });
}

export function useFoodByName(name: string) {
  return useQuery({
    queryKey: ['food', 'name', name],
    queryFn: async () => {
      const { data } = await apiClient.get(`/food/name/${name}`);
      return data;
    },
    enabled: !!name,
  });
}

export function useAllFood() {
  return useQuery({
    queryKey: ['food', 'all'],
    queryFn: async () => {
      const { data } = await apiClient.get('/food');
      return data;
    },
  });
}

export function useDeleteFood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      const { data } = await apiClient.delete(`/food/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food'] });
    },
  });
}

export function useAddFood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (food: any) => {
      const { data } = await apiClient.post("/food/", food);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["food"] });
    },
  });
}