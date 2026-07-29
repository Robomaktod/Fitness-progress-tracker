import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "./apiClient";

export function useFetchUser(
  userId: string,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/profile/${userId}`);
      return data;
    },
    enabled: !!userId,
    ...options,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      update,
    }: {
      userId: string;
      update: Record<string, unknown>;
    }) => {
      const { data } = await apiClient.patch(`/profile/${userId}`, update);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}
