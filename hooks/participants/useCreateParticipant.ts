"use client";

import { toast } from "sonner";
import { Participant } from "@/types/participant";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateParticipantPaylod {
  values: Participant;
  session_id: string;
  showToast?: boolean;
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
    throw new Error("Failed to create participant. Name must be unique.");
  }

  return response;
};

const useCreateParticipant = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: createParticipant } = useMutation({
    mutationFn: async ({ values, session_id }: CreateParticipantPaylod) =>
      await createParticipantRequest(values, session_id),
    onSuccess: (_, { session_id, showToast = true }) => {
      queryClient.invalidateQueries({
        queryKey: ["participants", { session_id }],
      });

      if (showToast) {
        toast.success("Successfully created participant.");
      }
    },

    onError: (err: any) => {
      toast.error(err.message);
      console.error(err);
    },
  });

  return { createParticipant };
};

export default useCreateParticipant;
