"use client";

import { Users } from "lucide-react";
import { useParams } from "next/navigation";
import { useParticipants } from "@/hooks";
import { ParticipantCard } from "@/components/participants/ParticipantCard";
import { CreateParticipant } from "@/components/participants/CreateParticipant";
import { ParticipantSkeletonList } from "@/components/participants/ParticipantsListSkeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ParticipantsWarningCard } from "@/components/participants/ParticipantsWarningCard";

export default function Page() {
  const { id } = useParams();
  const session_id = id as string;

  const { participants, isLoading } = useParticipants(session_id);

  return (
    <Card className='border-zinc-200 dark:border-zinc-800 shadow-sm h-full flex-col'>
      <CardHeader>
        <div className='flex items-center gap-2 mb-2'>
          <div className='flex size-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800'>
            <Users className='size-4 text-zinc-900 dark:text-zinc-100' />
          </div>
          <CardTitle className='text-lg sm:text-xl'>Participants</CardTitle>
        </div>
        <CardDescription className='text-sm'>
          Expense buddies loading… here’s who’s in the mix! 🚀
        </CardDescription>
      </CardHeader>

      <CardContent>
        {participants.length === 1 && <ParticipantsWarningCard />}

        <CreateParticipant participants={participants} />

        <div className='grid gap-2 max-h-72 overflow-y-auto no-scrollbar'>
          {isLoading ? (
            <ParticipantSkeletonList />
          ) : (
            participants.map((participant) => (
              <ParticipantCard
                key={participant.id}
                participant={participant}
                participants={participants}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
