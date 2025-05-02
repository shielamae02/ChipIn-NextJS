import { Event } from "@/types/event";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const updateEventRequest = async ({ values }: { values: Event }) => {
  const { id, name } = values;
  const result = await fetch("/api/events", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name }),
  });

  const response = await result.json();

  if (!result.ok) {
    throw new Error("Failed to update event");
  }

  return response;
};

const useUpdateEvent = (event_id: string) => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateEvent } = useMutation({
    mutationFn: updateEventRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", event_id] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["participants"] });
      toast.success("Successfully updated the event name.");
    },
    onError: (err: any) => {
      toast.error("Failed to update event.");
      console.error(err);
    },
  });

  return { updateEvent };
};

export default useUpdateEvent;
