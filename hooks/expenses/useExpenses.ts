"use client";

import { Expense } from "@/types/expense";
import { useQuery } from "@tanstack/react-query";

const useExpenses = (event_id?: string) => {
  const { data: expenses = [], isLoading } = useQuery<Expense[]>({
    queryKey: ["expenses", event_id],
    queryFn: async () => {
      const response = await fetch(`/api/expenses?event_id=${event_id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      return response.json();
    },
  });

  return { expenses, isLoading };
};

export default useExpenses;
