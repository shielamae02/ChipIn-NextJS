"use client";

import { toast } from "sonner";
import { Expense } from "@/types/expense";
import { useSessionStore } from "@/store/sessionStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createExpenseRequest = async (values: Expense) => {
  const response = await fetch("/api/expenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Failed to create expense");
  }

  return data;
};

const useCreateExpense = (event_id: string) => {
  const queryClient = useQueryClient();
  const { session, hasHydrated } = useSessionStore();

  const { mutateAsync: createExpense } = useMutation({
    mutationFn: async (expense: Omit<Expense, "event_id">) =>
      await createExpenseRequest({ ...expense, event_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses", event_id],
      });
      if (session) {
        queryClient.invalidateQueries({
          queryKey: ["participants", session.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["events", session.id],
        });
      }
      toast.success("Expense created successfully.");
    },
    onError: (err: any) => {
      toast.error("Failed to create expense.");
      console.error(err);
    },
  });

  return { createExpense };
};

export default useCreateExpense;
