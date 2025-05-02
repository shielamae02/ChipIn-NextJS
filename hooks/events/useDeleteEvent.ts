import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const deleteEventRequest = async ({ id }: { id: string }) => {
  const result = await fetch(`/api/events/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  const response = await result.json();

  if (!result.ok) {
    throw new Error("Failed to delete event.");
  }

  return response;
};

const useDeleteEvent = (session_id: string) => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteEvent } = useMutation({
    mutationFn: deleteEventRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", session_id] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["participants"] });

      toast.success("Successfully deleted the event.");
    },
    onError: (err: any) => {
      toast.error("Failed to delete event.");
      console.error(err);
    },
  });

  return { deleteEvent };
};

export default useDeleteEvent;
