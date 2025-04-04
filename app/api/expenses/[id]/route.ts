import { supabase } from "@/lib/supabase/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const expenseId = params.id;

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


