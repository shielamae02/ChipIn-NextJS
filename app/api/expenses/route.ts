// /app/api/expenses/route.ts
import { supabase } from "@/lib/supabase/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { event_id, description, amount, paidBy, splitAmong, date } = body;

  if (
    !event_id ||
    !description ||
    !amount ||
    !paidBy?.length ||
    !splitAmong?.length
  ) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const totalAmount = parseFloat(amount);
  const splitCount = splitAmong.length;
  const sharePerPerson = totalAmount / splitCount;
  const paidPerPerson = totalAmount / paidBy.length;

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

  // 1. Add to expense_paid_by
  const paidByInserts = paidBy.map((participant_id: string) => ({
    expense_id: expenseId,
    participant_id,
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

  // 2. Add to expense_split_among
  const splitAmongInserts = splitAmong.map((participant_id: string) => ({
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

  // 3. Adjust balances
  // PaidBy gets + (paid - share)
  // for (const participant_id of paidBy) {
  //   const delta = paidPerPerson - sharePerPerson;
  //   await supabase.rpc("adjust_participant_amount", {
  //     participant_id,
  //     delta,
  //   });
  // }


  // Step 3. Adjust balances correctly
  // Each participant pays what they paid MINUS what they owe

  // 1. Each participant who paid gets CREDIT for the full amount they paid
  // For now, assume each paid full amount
  // In a real case you'd include actual amounts per payer in the payload
  const amountPaidMap: Record<string, number> = {};
  const amountOwedMap: Record<string, number> = {};

  // Credit paidBy participants
  for (const participant_id of paidBy) {
    amountPaidMap[participant_id] =
      (amountPaidMap[participant_id] || 0) + totalAmount / paidBy.length;
  }

  // Debit splitAmong participants
  for (const participant_id of splitAmong) {
    amountOwedMap[participant_id] =
      (amountOwedMap[participant_id] || 0) + sharePerPerson;
  }

  // Final balance adjustments = paid - owed
  const allParticipantIds = new Set([...paidBy, ...splitAmong]);

  for (const participant_id of allParticipantIds) {
    const paid = amountPaidMap[participant_id] || 0;
    const owed = amountOwedMap[participant_id] || 0;
    const delta = paid - owed;

    if (delta !== 0) {
      await supabase.rpc("adjust_participant_amount", {
        participant_id,
        delta,
      });
    }
  }

  // 4. Update total_amount in the events table
  const totalSumResult = await supabase
    .from("expenses")
    .select("amount", { count: "exact", head: false })
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

  // Others in splitAmong get - share
  for (const participant_id of splitAmong) {
    if (!paidBy.includes(participant_id)) {
      await supabase.rpc("adjust_participant_amount", {
        participant_id,
        delta: -sharePerPerson,
      });
    }
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
