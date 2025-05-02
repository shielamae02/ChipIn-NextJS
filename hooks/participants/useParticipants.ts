"use client";

import { useQuery } from "@tanstack/react-query";
import { Participant } from "@/types/participant";

const useParticipants = (session_id?: string) => {
  const { data: participants = [], isLoading } = useQuery<Participant[]>({
    queryKey: ["participants", session_id],
    queryFn: async () => {
      const response = await fetch(
        `/api/participants?session_id=${session_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch participants");
      }
      return response.json();
    },
  });

  return { participants, isLoading };
};

export default useParticipants;
