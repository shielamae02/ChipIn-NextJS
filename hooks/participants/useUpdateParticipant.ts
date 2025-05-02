import { toast } from "sonner";
import { Participant } from "@/types/participant";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateParticipantRequest = async ({
  values,
}: {
  values: Participant;
}) => {
  const { id, name } = values;
  const result = await fetch("/api/participants", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name }),
  });

  const response = await result.json();

  if (!result.ok) {
    throw new Error("Failed to update participant");
  }

  return response;
};

const useUpdateParticipant = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateParticipant } = useMutation({
    mutationFn: updateParticipantRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
      toast.success("Successfully updated the participant.");
    },
    onError: (err: any) => {
      toast.error("Failed to update participant.");
      console.error(err);
    },
  });

  return { updateParticipant };
};

export default useUpdateParticipant;
