"use client";

import { EventBalance } from "@/types/event-balance";
import { useQuery } from "@tanstack/react-query";

const useEventBalances = (event_id?: string) => {
  const { data: eventBalances = [], isLoading } = useQuery<EventBalance[]>({
    queryKey: ["eventBalances", event_id],
    queryFn: async () => {
      const response = await fetch(`/api/events/${event_id}/balances`);
      if (!response.ok) {
        throw new Error("Failed to fetch event balances.");
      }
      return response.json();
    },
  });

  return { eventBalances, isLoading };
};

export default useEventBalances;
