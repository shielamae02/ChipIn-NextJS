import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabaseClient";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, creator } = body;

  const { data, error } = await supabase
    .from("sessions")
    .insert({ name, creator })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
