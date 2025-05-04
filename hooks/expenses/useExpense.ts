"use client";

import { Expense } from "@/types/expense";
import { useQuery } from "@tanstack/react-query";

const useExpense = (expense_id?: string) => {
  const { data: expense, isLoading } = useQuery<Expense>({
    queryKey: ["expense", {expense_id}],
    queryFn: async () => {
      const response = await fetch(`/api/expenses/${expense_id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch expense");
      }

      return response.json();
    },
  });

  return { expense, isLoading };
};

export default useExpense;
