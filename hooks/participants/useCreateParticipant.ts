"use client";

import { toast } from "sonner";
import { Participant } from "@/types/participant";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateParticipantPaylod {
  values: Participant;
  session_id: string;
}

const createParticipantRequest = async (
  values: Participant,
  session_id: string
) => {
  const { name } = values;

  const result = await fetch("/api/participants", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id, name }),
  });

  const response = await result.json();
  if (!result.ok) {
    throw new Error("Failed to create participant");
  }

  return response;
};

const useCreateParticipant = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: createParticipant } = useMutation({
    mutationFn: async ({ values, session_id }: CreateParticipantPaylod) =>
      await createParticipantRequest(values, session_id),
    onSuccess: (_, { session_id }) => {
      queryClient.invalidateQueries({
        queryKey: ["participants", session_id],
      });
      toast.success("Successfully created the participant.");
    },

    onError: (err: any) => {
      toast.error("Failed to create participant.");
      console.error(err);
    },
  });

  return { createParticipant };
};

export default useCreateParticipant;
