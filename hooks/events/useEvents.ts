"use client";

import { Event } from "@/types/event";
import { useQuery } from "@tanstack/react-query";

const useEvents = (session_id?: string) => {
  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["events", session_id],
    queryFn: async () => {
      const response = await fetch(`/api/events?session_id=${session_id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      return response.json();
    },
  });

  return { events, isLoading };
};

export default useEvents;
