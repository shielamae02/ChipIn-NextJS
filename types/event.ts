import { Expense } from "./expense";

export type Event = {
  id?: string;
  name: string;
  created_at?: string;
  expenses?: Expense[];
  total_amount?: number;
};
