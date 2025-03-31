import { Participant } from "./participant";

export type Expense = {
  description: string;
  amount: number;
  paidBy: Participant[];
  splitAmong: Participant[];
};
