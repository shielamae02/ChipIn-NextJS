import { supabase } from "@/lib/supabase/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const eventId = (await params).id;

  // 1) Load all expenses + their paid_by + split_among
  const { data: expenses, error } = await supabase
    .from("expenses")
    .select(
      `
      id,
      amount,
      expense_paid_by (
        participant_id,
        amount
      ),
      expense_split_among (
        participant_id
      )
    `
    )
    .eq("event_id", eventId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // 2) Aggregate nets per participant
  const balances: Record<string, number> = {};

  expenses!.forEach((e) => {
    const paidBy = e.expense_paid_by ?? [];
    const splitAmong = e.expense_split_among ?? [];
    const share = e.amount / (splitAmong.length || 1);

    // add what they paid
    paidBy.forEach(({ participant_id, amount }) => {
      balances[participant_id] = (balances[participant_id] || 0) + amount;
    });

    // subtract what they owe
    splitAmong.forEach(({ participant_id }) => {
      balances[participant_id] = (balances[participant_id] || 0) - share;
    });
  });

  // 3) Turn into an array
  const result = Object.entries(balances).map(([participant_id, net]) => ({
    participant_id,
    net,
  }));

  return NextResponse.json(result);
}
