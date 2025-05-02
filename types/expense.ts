export type Expense = {
  id?: string;
  event_id: string;
  description: string;
  amount: number;
  created_at?: string;
  expense_paid_by: {
    participant_id: string;
    amount: number;
  }[];
  expense_split_among: {
    participant_id: string;
  }[];
};
