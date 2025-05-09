"use client";

import { toast } from "sonner";
import { Expense } from "@/types/expense";
import { useSessionStore } from "@/store/sessionStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateExpenseRequest = async (values: Expense, expenseId: string) => {
  const response = await fetch(`/api/expenses/${expenseId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Failed to update expense");
  }

  return data;
};

const useUpdateExpense = (event_id: string, expense_id: string) => {
  const queryClient = useQueryClient();
  const { session } = useSessionStore();

  const { mutateAsync: updateExpense } = useMutation({
    mutationFn: async (expense: Expense) =>
      await updateExpenseRequest({ ...expense }, expense_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expense", { expense_id }],
      });
      queryClient.invalidateQueries({
        queryKey: ["expenses", { event_id }],
      });
      if (session) {
        queryClient.invalidateQueries({
          queryKey: ["participants", { sessionId: session.id }],
        });
        queryClient.invalidateQueries({
          queryKey: ["events", { sessionId: session.id }],
        });
        queryClient.invalidateQueries({
          queryKey: ["eventBalances", { event_id }],
        });
      }
      toast.success("Expense updated successfully.");
    },
    onError: (err: any) => {
      toast.error("Failed to update expense.");
      console.error(err);
    },
  });

  return { updateExpense };
};

export default useUpdateExpense;
