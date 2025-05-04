import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteParticipantRequest = async ({ id }: { id: string }) => {
  const result = await fetch(`/api/participants/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id }),
  });

  const response = await result.json();

  if (!result.ok) {
    throw new Error("Failed to delete participant");
  }

  return response;
};

const useDeleteParticipant = (session_id: string) => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteParticipant } = useMutation({
    mutationFn: deleteParticipantRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", { session_id }] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({
        queryKey: ["participants", { session_id }],
      });
      queryClient.invalidateQueries({
        queryKey: ["eventBalances"],
      });
      toast.success("Successfully deleted the participant.");
    },
    onError: (err: any) => {
      toast.error("Failed to delete participant.");
      console.error(err);
    },
  });

  return { deleteParticipant };
};

export default useDeleteParticipant;
