import { supabase } from "@/lib/supabase/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const {
    event_id,
    description,
    amount,
    paidBy,
    splitAmong,
    date,
  }: {
    event_id: string;
    description: string;
    amount: number | string;
    paidBy: { participant_id: string; amount: number }[];
    splitAmong: string[];
    date?: string;
  } = body;

  console.log("Parsed expense payload:", {
    event_id,
    description,
    amount,
    paidBy,
    splitAmong,
  });

  // Basic validation
  if (
    !event_id ||
    !description ||
    amount === null ||
    amount === undefined ||
    !Array.isArray(paidBy) ||
    paidBy.length === 0 ||
    !Array.isArray(splitAmong) ||
    splitAmong.length === 0
  ) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const totalAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(totalAmount)) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const splitCount = splitAmong.length;
  const sharePerPerson = totalAmount / splitCount;

  // 1. Insert expense
  const expenseInsert = await supabase
    .from("expenses")
    .insert([
      {
        event_id,
        description,
        amount: totalAmount,
        created_at: date ?? new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (expenseInsert.error) {
    return NextResponse.json(
      { error: expenseInsert.error.message },
      { status: 400 }
    );
  }

  const expenseId = expenseInsert.data.id;

  // 2. Insert into expense_paid_by
  const paidByInserts = paidBy.map((entry) => ({
    expense_id: expenseId,
    participant_id: entry.participant_id,
    amount: entry.amount,
  }));

  const paidByResult = await supabase
    .from("expense_paid_by")
    .insert(paidByInserts);

  if (paidByResult.error) {
    return NextResponse.json(
      { error: paidByResult.error.message },
      { status: 400 }
    );
  }

  // 3. Insert into expense_split_among
  const splitAmongInserts = splitAmong.map((participant_id) => ({
    expense_id: expenseId,
    participant_id,
  }));

  const splitResult = await supabase
    .from("expense_split_among")
    .insert(splitAmongInserts);

  if (splitResult.error) {
    return NextResponse.json(
      { error: splitResult.error.message },
      { status: 400 }
    );
  }

  // 4. Adjust participant balances
  const amountPaidMap: Record<string, number> = {};
  const amountOwedMap: Record<string, number> = {};

  // Track how much each person paid
  for (const { participant_id, amount } of paidBy) {
    amountPaidMap[participant_id] =
      (amountPaidMap[participant_id] || 0) + amount;
  }

  // Track how much each person owes
  for (const participant_id of splitAmong) {
    amountOwedMap[participant_id] =
      (amountOwedMap[participant_id] || 0) + sharePerPerson;
  }

  const allParticipantIds = new Set([
    ...Object.keys(amountPaidMap),
    ...Object.keys(amountOwedMap),
  ]);

  // Apply balance changes: paid - owed
  for (const participant_id of allParticipantIds) {
    const paid = amountPaidMap[participant_id] || 0;
    const owed = amountOwedMap[participant_id] || 0;
    const delta = paid - owed;

    if (delta !== 0) {
      const result = await supabase.rpc("adjust_participant_amount", {
        participant_id,
        delta,
      });

      if (result.error) {
        return NextResponse.json(
          { error: result.error.message },
          { status: 400 }
        );
      }
    }
  }

  // 5. Update total_amount on the event
  const totalSumResult = await supabase
    .from("expenses")
    .select("amount", { head: false })
    .eq("event_id", event_id);

  if (totalSumResult.error) {
    return NextResponse.json(
      { error: totalSumResult.error.message },
      { status: 400 }
    );
  }

  const totalEventAmount = totalSumResult.data.reduce(
    (sum, expense) => sum + (expense.amount || 0),
    0
  );

  const updateEvent = await supabase
    .from("events")
    .update({ total_amount: totalEventAmount })
    .eq("id", event_id);

  if (updateEvent.error) {
    return NextResponse.json(
      { error: updateEvent.error.message },
      { status: 400 }
    );
  }

  return NextResponse.json(expenseInsert.data);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const event_id = searchParams.get("event_id");

  const query = supabase.from("expenses").select("*");

  if (event_id) {
    query.eq("event_id", event_id);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}
