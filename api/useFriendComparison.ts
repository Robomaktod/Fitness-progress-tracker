import { useQuery } from "@tanstack/react-query";

import { apiClient } from "./apiClient";

export function useFriendDetails(friendId: string) {
  return useQuery({
    queryKey: ["friendDetails", friendId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/social/friend/${friendId}`);
      return data;
    },
    enabled: !!friendId,
  });
}

export function useFriendComparison(userId: string, friendId: string) {
  return useQuery({
    queryKey: ["friendComparison", userId, friendId],
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/social/comparison?userId=${userId}&friendId=${friendId}`,
      );
      return data;
    },
    enabled: !!userId && !!friendId,
  });
}
