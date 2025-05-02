import { supabase } from "@/lib/supabase/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const participantId = (await params).id;

  if (!participantId) {
    return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
  }

  const { error } = await supabase.from("participants").delete().eq("id", participantId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Participant deleted successfully" });
}
