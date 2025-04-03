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
