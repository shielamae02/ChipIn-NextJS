import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const deleteExpenseRequest = async ({ id }: { id: string }) => {
  const result = await fetch(`/api/expenses/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  const response = await result.json();

  if (!result.ok) {
    throw new Error("Failed to delete expense.");
  }

  return response;
};

const useDeleteExpense = (session_id: string, event_id: string) => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteExpense } = useMutation({
    mutationFn: deleteExpenseRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", event_id] });
      queryClient.invalidateQueries({
        queryKey: ["eventBalances", event_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["participants", session_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["events", session_id],
      });
      toast.success("Successfully deleted the expense.");
    },
    onError: (err: any) => {
      toast.error("Failed to delete expense.");
      console.error(err);
    },
  });

  return { deleteExpense };
};

export default useDeleteExpense;
