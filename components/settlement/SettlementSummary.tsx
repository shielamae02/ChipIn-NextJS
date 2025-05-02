"use client";

import { useMemo } from "react";
import Image from "next/image";
import {
  ArrowDownToLine,
  ArrowRight,
  Calculator,
  CreditCard,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/lib/utils";
import { Participant } from "@/types/participant";
import { Event } from "@/types/event";
import { exportToPDF } from "@/lib/exportToPdf";
import { useSessionStore } from "@/store/sessionStore";
import { Button } from "../ui/button";
import { ReminderWarningCard } from "./ReminderWarningCard";
import { FadeIn } from "../shared/FadeIn";

interface SettlementSummaryProps {
  events: Event[];
  participants: Participant[];
}

interface Transaction {
  from: string;
  to: string;
  amount: number;
}

export default function SettlementSummary({
  events,
  participants,
}: SettlementSummaryProps) {
  const session = useSessionStore((state) => state.session);

  const { totalAmount, participantBalances, transactions } = useMemo(() => {
    const balances: Record<string, number> = {};
    let totalAmount = 0;

    // Initialize balances
    participants.forEach((p) => {
      balances[p.id!] = 0;
    });

    // Process all events and nested expenses
    events.forEach((event) => {
      event.expenses?.forEach((rawExpense) => {
        const expense = {
          ...rawExpense,
          paidBy: rawExpense.expense_paid_by ?? [],
          splitAmong:
            rawExpense.expense_split_among?.map(
              (entry) => entry.participant_id
            ) ?? [],
        };

        totalAmount += expense.amount;

        // Add what was paid
        expense.paidBy.forEach(({ participant_id, amount }) => {
          balances[participant_id] = (balances[participant_id] || 0) + amount;
        });

        // Subtract what was owed
        const amountPerPerson = expense.amount / expense.splitAmong.length;
        expense.splitAmong.forEach((participant_id) => {
          balances[participant_id] =
            (balances[participant_id] || 0) - amountPerPerson;
        });
      });
    });

    // Generate settlement transactions
    const transactions: Transaction[] = [];

    const debtors = Object.entries(balances)
      .filter(([, balance]) => balance < 0)
      .map(([id, balance]) => ({ id, balance: Math.abs(balance) }))
      .sort((a, b) => b.balance - a.balance);

    const creditors = Object.entries(balances)
      .filter(([, balance]) => balance > 0)
      .map(([id, balance]) => ({ id, balance }))
      .sort((a, b) => b.balance - a.balance);

    while (debtors.length && creditors.length) {
      const debtor = debtors[0];
      const creditor = creditors[0];

      const amount = Math.min(debtor.balance, creditor.balance);
      const roundedAmount = Math.round(amount * 100) / 100;

      if (roundedAmount > 0) {
        transactions.push({
          from: debtor.id,
          to: creditor.id,
          amount: roundedAmount,
        });
      }

      debtor.balance -= amount;
      creditor.balance -= amount;

      if (debtor.balance < 0.01) debtors.shift();
      if (creditor.balance < 0.01) creditors.shift();
    }

    return { totalAmount, participantBalances: balances, transactions };
  }, [events, participants]);

  const getParticipantName = (id: string) =>
    participants.find((p) => p.id === id)?.name || "Unknown";

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between space-x-2 gap-2'>
        <ReminderWarningCard />
        <Button
          onClick={() =>
            exportToPDF({
              sessionName: session!.name,
              createdBy: session!.creator,
              balances: participantBalances,
              transactions,
              participants,
              totalAmount: formatCurrency(totalAmount),
            })
          }
        >
          <ArrowDownToLine />
          Export to PDF
        </Button>
      </div>
      {/* Balances Card */}
      <FadeIn duration={100}>
        <Card className='border-zinc-200 dark:border-zinc-800 shadow-sm'>
          <CardHeader className='pb-2'>
            <div className='flex items-center gap-2 mb-2'>
              <div className='flex size-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800'>
                <Calculator className='h-4 w-4 text-zinc-900 dark:text-zinc-100' />
              </div>
              <CardTitle className='text-xl'>Current Balances</CardTitle>
            </div>
            <CardDescription>
              Total expenses:
              <span className='font-semibold text-zinc-800 ml-2'>
                {formatCurrency(totalAmount)}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {participants.length === 0 ? (
              <p className='text-zinc-500 dark:text-zinc-400 text-center'>
                No participants yet
              </p>
            ) : (
              <div className='space-y-1'>
                {Object.entries(participantBalances)
                  .sort((a, b) => b[1] - a[1])
                  .map(([id, balance]) => (
                    <div
                      key={id}
                      className='flex justify-between items-center p-2 rounded-md bg-zinc-50 hover:bg-[#f8f8f8]  dark:hover:bg-zinc-900 transition-colors'
                    >
                      <span className='font-medium flex'>
                        <Image
                          src={`https://api.dicebear.com/9.x/big-ears/png?seed=${getParticipantName(
                            id
                          )}}`}
                          alt='Cute Avatar'
                          width={48}
                          height={48}
                          className='size-6 rounded-full mr-2'
                        />
                        {getParticipantName(id)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          balance > 0
                            ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : balance < 0
                            ? "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        {formatCurrency(balance)}
                      </span>
                    </div>
                  ))}
              </div>
              // <ScrollArea className='h-[200px] pr-4'>
              // </ScrollArea>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Settlement Plan Card */}
      <FadeIn duration={200}>
        <Card className='border-zinc-200 dark:border-zinc-800 shadow-sm'>
          <CardHeader className='pb-3'>
            <div className='flex items-center gap-2 mb-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800'>
                <CreditCard className='h-4 w-4 text-zinc-900 dark:text-zinc-100' />
              </div>
              <CardTitle className='text-xl'>Settlement Plan</CardTitle>
            </div>
            <CardDescription>
              The most efficient way to settle all debts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className='text-zinc-500 dark:text-zinc-400 text-center'>
                {events.length === 0
                  ? "No expenses added yet"
                  : "All balances are settled"}
              </p>
            ) : (
              <ScrollArea className='h-[200px] pr-4'>
                <div className='space-y-3'>
                  {transactions.map((t, index) => (
                    <div
                      key={index}
                      className='flex items-center gap-2 p-3 border rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors'
                    >
                      <div className='font-medium'>
                        {getParticipantName(t.from)}
                      </div>
                      <ArrowRight className='h-4 w-4 text-zinc-500 dark:text-zinc-400 mx-1' />
                      <div className='font-medium'>
                        {getParticipantName(t.to)}
                      </div>
                      <div className='ml-auto font-semibold bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 px-2 py-1 rounded-full text-sm'>
                        {formatCurrency(t.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
