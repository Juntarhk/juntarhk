import { 
  useListActivities, 
  useGetActivity, 
  useCreateActivity,
  getListActivitiesQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import type { CreateActivityInput } from "@workspace/api-client-react";

// Re-exporting standard hooks for consistent architectural structure
export { useListActivities, useGetActivity };

// Wrapping mutation hook to add cache invalidation
export function useCreateActivityMutation() {
  const queryClient = useQueryClient();
  const mutation = useCreateActivity({
    mutation: {
      onSuccess: () => {
        // Invalidate list queries when a new activity is created
        queryClient.invalidateQueries({ queryKey: getListActivitiesQueryKey() });
      },
    },
  });

  return mutation;
}
