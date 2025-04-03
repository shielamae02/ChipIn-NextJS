"use client";

import { EventCard } from "@/components/events/event-card";
import { useEvents } from "@/hooks";
import { useParams } from "next/navigation";
import { EmptyEvents } from "@/components/events/empty-events";
import { EventCardSkeleton } from "@/components/events/events-skeleton-card";

export default function Page() {
  const { id } = useParams();
  const session_id = id as string;
  const { events, isLoading } = useEvents(session_id);

  console.log(id);

  return (
    <section className='w-full flex-grow'>
      {isLoading ? (
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {[...Array(3)].map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyEvents />
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {events.map((event) => (
            <EventCard {...event} key={event.id} />
          ))}
        </div>
      )}
    </section>
  );
}
