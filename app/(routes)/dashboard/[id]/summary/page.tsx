"use client";

import SettlementSummary from "@/components/settlement/SettlementSummary";
import { useEvents, useParticipants } from "@/hooks";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  const session_id = id as string;
  const { events } = useEvents(session_id);
  const { participants } = useParticipants(session_id);

  return (
    <section>
      <SettlementSummary participants={participants} events={events} />
    </section>
  );
}
