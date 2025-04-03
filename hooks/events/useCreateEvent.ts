"use client";

import { toast } from "sonner";
import { Event } from "@/types/event";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createEventRequest = async (values: Event, session_id: string) => {
  const { name } = values;

  const result = await fetch("/api/events", {
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

const useCreateEvent = (session_id: string) => {
  const queryClient = useQueryClient();

  const { mutateAsync: createEvent } = useMutation({
    mutationFn: async (event: Event) =>
      await createEventRequest(event, session_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events", session_id],
      });
      toast.success("Successfully created the event.");
    },

    onError: (err: any) => {
      toast.error("Failed to create event.");
      console.error(err);
    },
  });

  return { createEvent };
};

export default useCreateEvent;
