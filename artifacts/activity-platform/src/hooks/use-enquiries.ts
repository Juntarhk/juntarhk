import { 
  useSubmitEnquiry, 
  useListEnquiries,
  getListEnquiriesQueryKey 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export { useListEnquiries };

// Wrapping mutation hook to add cache invalidation
export function useSubmitEnquiryMutation() {
  const queryClient = useQueryClient();
  const mutation = useSubmitEnquiry({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListEnquiriesQueryKey() });
      },
    },
  });

  return mutation;
}
