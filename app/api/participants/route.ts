import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabaseClient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("session_id");

  if (!id) {
    return NextResponse.json(
      { error: "Session ID is required." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("participants")
    .select("*")
    .eq("session_id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { session_id, name } = body;

  const { data, error } = await supabase
    .from("participants")
    .insert([{ session_id, name }])
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, name } = body;

  if (!id || !name) {
    return NextResponse.json(
      { error: "Participant ID and name are required." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("participants")
    .update({ name })
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ message: "Participant updated successfully." });
}
