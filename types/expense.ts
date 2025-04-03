export type Expense = {
  id?: string;
  event_id: string;
  description: string;
  amount: number;
  created_at?: string;
  paidBy: {
    participant_id: string;
    amount: number;
  }[];
  splitAmong: string[];
};
