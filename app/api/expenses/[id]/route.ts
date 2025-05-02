import { supabase } from "@/lib/supabase/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const expenseId = (await params).id;

  if (!expenseId) {
    return NextResponse.json({ error: "Missing expense ID" }, { status: 400 });
  }

  // 1) Load expense amount & event_id
  const { data: exp, error: expErr } = await supabase
    .from("expenses")
    .select("amount, event_id")
    .eq("id", expenseId)
    .single();
  if (expErr || !exp) {
    return NextResponse.json(
      { error: expErr?.message ?? "Expense not found" },
      { status: 404 }
    );
  }

  // 2) Load related paid_by & split_among entries
  const { data: paidRows = [], error: paidErr } = await supabase
    .from("expense_paid_by")
    .select("participant_id, amount")
    .eq("expense_id", expenseId);
  if (paidErr) {
    console.warn("Could not fetch paid_by rows:", paidErr);
  }

  const { data: splitRows = [], error: splitErr } = await supabase
    .from("expense_split_among")
    .select("participant_id")
    .eq("expense_id", expenseId);
  if (splitErr) {
    console.warn("Could not fetch split_among rows:", splitErr);
  }

  // 3) Delete child-table rows
  await supabase.from("expense_paid_by").delete().eq("expense_id", expenseId);
  await supabase
    .from("expense_split_among")
    .delete()
    .eq("expense_id", expenseId);

  // 4) Delete the expense itself
  const { error: delErr } = await supabase
    .from("expenses")
    .delete()
    .eq("id", expenseId);
  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 400 });
  }

  // 5) Update event.total_amount
  const { data: ev, error: evErr } = await supabase
    .from("events")
    .select("total_amount")
    .eq("id", exp.event_id)
    .single();
  if (!evErr && ev) {
    const newTotal = (ev.total_amount ?? 0) - exp.amount;
    await supabase
      .from("events")
      .update({ total_amount: newTotal })
      .eq("id", exp.event_id);
  }

  // 6a) Revert payers’ balances
  for (const { participant_id, amount } of paidRows || []) {
    const { data: p, error: pErr } = await supabase
      .from("participants")
      .select("balance")
      .eq("id", participant_id)
      .single();
    if (!pErr && p) {
      await supabase
        .from("participants")
        .update({ balance: (p.balance ?? 0) - amount })
        .eq("id", participant_id);
    }
  }

  // 6b) Revert split‐among balances
  const share = splitRows?.length ? exp.amount / splitRows.length : 0;
  for (const { participant_id } of splitRows || []) {
    const { data: p, error: pErr } = await supabase
      .from("participants")
      .select("balance")
      .eq("id", participant_id)
      .single();
    if (!pErr && p) {
      await supabase
        .from("participants")
        .update({ balance: (p.balance ?? 0) + share })
        .eq("id", participant_id);
    }
  }

  return NextResponse.json({
    message: "Expense deleted and balances reconciled",
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const expenseId = (await params).id;

  const { data, error } = await supabase
    .from("expenses")
    .select(
      `
        *,
        expense_paid_by ( participant_id, amount ),
        expense_split_among ( participant_id )
      `
    )
    .eq("id", expenseId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const expense = {
    ...data,
    paidBy: data.expense_paid_by,
    splitAmong: data.expense_split_among.map(
      (row: { participant_id: string }) => row.participant_id
    ),
  };

  return NextResponse.json(expense);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const body = await request.json();
  const expenseId = (await params).id;

  const {
    expense_id = expenseId,
    event_id,
    description,
    amount,
    paidBy,
    splitAmong,
    date,
  }: {
    expense_id: string;
    event_id: string;
    description: string;
    amount: number | string;
    paidBy: { participant_id: string; amount: number }[];
    splitAmong: string[];
    date?: string;
  } = body;

  console.log("Parsed expense update payload:", {
    expense_id,
    event_id,
    description,
    amount,
    paidBy,
    splitAmong,
  });

  // Basic validation
  if (
    !expense_id ||
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

  // Parse amount
  const totalAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(totalAmount)) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  // 1. Fetch original expense and its associated paid_by and split_among records.
  const originalExpense = await supabase
    .from("expenses")
    .select()
    .eq("id", expense_id)
    .single();
  if (originalExpense.error) {
    return NextResponse.json(
      { error: originalExpense.error.message },
      { status: 400 }
    );
  }

  const originalPaidByResult = await supabase
    .from("expense_paid_by")
    .select()
    .eq("expense_id", expense_id);
  if (originalPaidByResult.error) {
    return NextResponse.json(
      { error: originalPaidByResult.error.message },
      { status: 400 }
    );
  }

  const originalSplitResult = await supabase
    .from("expense_split_among")
    .select()
    .eq("expense_id", expense_id);
  if (originalSplitResult.error) {
    return NextResponse.json(
      { error: originalSplitResult.error.message },
      { status: 400 }
    );
  }

  // 2. Calculate the original expense deltas.
  const oldTotal = originalExpense.data.amount;
  const oldSplitCount = originalSplitResult.data.length;
  const oldShare = oldTotal / oldSplitCount;

  // Build a map of what each participant paid originally.
  const oldPaidMap: Record<string, number> = {};
  for (const entry of originalPaidByResult.data) {
    oldPaidMap[entry.participant_id] =
      (oldPaidMap[entry.participant_id] || 0) + entry.amount;
  }

  // For each participant in the original expense, compute old delta.
  // (delta = amount paid - oldShare; if participant did not pay, treated as 0)
  const oldDeltaMap: Record<string, number> = {};
  for (const participant_id of originalSplitResult.data.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (r: any) => r.participant_id
  )) {
    const paid = oldPaidMap[participant_id] || 0;
    oldDeltaMap[participant_id] = paid - oldShare;
  }

  // 3. Calculate the new expense deltas.
  const newSplitCount = splitAmong.length;
  const newShare = totalAmount / newSplitCount;

  // Build new map for amount paid from the update payload.
  const newPaidMap: Record<string, number> = {};
  for (const { participant_id, amount } of paidBy) {
    newPaidMap[participant_id] = (newPaidMap[participant_id] || 0) + amount;
  }

  const newDeltaMap: Record<string, number> = {};
  for (const participant_id of splitAmong) {
    const paid = newPaidMap[participant_id] || 0;
    newDeltaMap[participant_id] = paid - newShare;
  }

  // 4. Compute the set of all participant IDs involved either originally or in the update.
  const allParticipantIds = new Set<string>([
    ...Object.keys(oldDeltaMap),
    ...Object.keys(newDeltaMap),
  ]);

  // 5. For each participant, calculate the net delta.
  for (const participant_id of allParticipantIds) {
    const oldDelta = oldDeltaMap[participant_id] || 0;
    const newDelta = newDeltaMap[participant_id] || 0;
    const netDelta = newDelta - oldDelta;
    if (netDelta !== 0) {
      const result = await supabase.rpc("adjust_participant_amount", {
        participant_id,
        delta: netDelta,
      });
      if (result.error) {
        return NextResponse.json(
          { error: result.error.message },
          { status: 400 }
        );
      }
    }
  }

  // 6. Update the expense record.
  const expenseUpdate = await supabase
    .from("expenses")
    .update({
      description,
      amount: totalAmount,
      created_at: date ?? new Date().toISOString(),
    })
    .eq("id", expense_id)
    .select()
    .single();
  if (expenseUpdate.error) {
    return NextResponse.json(
      { error: expenseUpdate.error.message },
      { status: 400 }
    );
  }

  // 7. Replace the associated paid_by and split_among records.
  // Delete old records.
  const deletePaidBy = await supabase
    .from("expense_paid_by")
    .delete()
    .eq("expense_id", expense_id);
  if (deletePaidBy.error) {
    return NextResponse.json(
      { error: deletePaidBy.error.message },
      { status: 400 }
    );
  }

  const deleteSplit = await supabase
    .from("expense_split_among")
    .delete()
    .eq("expense_id", expense_id);
  if (deleteSplit.error) {
    return NextResponse.json(
      { error: deleteSplit.error.message },
      { status: 400 }
    );
  }

  // Insert new paid_by records.
  const newPaidByInserts = paidBy.map((entry) => ({
    expense_id,
    participant_id: entry.participant_id,
    amount: entry.amount,
  }));
  const paidByResult = await supabase
    .from("expense_paid_by")
    .insert(newPaidByInserts);
  if (paidByResult.error) {
    return NextResponse.json(
      { error: paidByResult.error.message },
      { status: 400 }
    );
  }

  // Insert new split_among records.
  const newSplitInserts = splitAmong.map((participant_id) => ({
    expense_id,
    participant_id,
  }));
  const splitResult = await supabase
    .from("expense_split_among")
    .insert(newSplitInserts);
  if (splitResult.error) {
    return NextResponse.json(
      { error: splitResult.error.message },
      { status: 400 }
    );
  }

  // 8. Update the event’s total_amount by summing all expenses.
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
    (sum: number, expense: { amount: number | null }) =>
      sum + (expense.amount || 0),
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

  return NextResponse.json(expenseUpdate.data);
}
