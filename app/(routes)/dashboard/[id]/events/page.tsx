"use client";

import { EventCard } from "@/components/events/EventCard";
import { useEvents, useParticipants } from "@/hooks";
import { useParams } from "next/navigation";
import { EmptyEvents } from "@/components/events/EmptyEventsCard";
import { EventCardSkeleton } from "@/components/events/EventsCardSkeleton";
import { ParticipantsWarningCard } from "@/components/participants/ParticipantsWarningCard";

export default function Page() {
  const { id } = useParams();
  const session_id = id as string;
  const { events, isLoading } = useEvents(session_id);
  const { participants } = useParticipants(session_id);

  return (
    <>
      <section className='w-full flex-grow'>
        {isLoading ? (
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            {[...Array(3)].map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <>
            {participants.length < 2 && <ParticipantsWarningCard />}
            <EmptyEvents />
          </>
        ) : (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
              {events.map((event) => (
                <EventCard {...event} key={event.id} />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
