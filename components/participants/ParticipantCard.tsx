"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Participant } from "@/types/participant";
import { Pencil } from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";
import { UpdateParticipantDialog } from "@/components/participants/UpdateParticipantDialog";
import { Badge } from "../ui/badge";

interface ParticipantCardProps {
  participant: Participant;
  participants: Participant[];
}

const ParticipantCard = ({
  participant,
  participants,
}: ParticipantCardProps) => {
  const { session } = useSessionStore();

  return (
    <article
      key={participant.id}
      className='flex items-center justify-between p-3 border rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors'
    >
      <div className='flex items-center gap-2'>
        <div className='flex items-center justify-center size-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'>
          <Image
            src={`https://api.dicebear.com/9.x/big-ears/png?seed=${participant.name}`}
            alt='Cute Avatar'
            width={48}
            height={48}
            className='size-6 rounded-full'
          />
        </div>
        <span className='font-medium'>{participant.name}</span>
        {session?.creator === participant.name && (
          <Badge className='bg-sky-50 text-xs border-sky-200 text-sky-700'>
            Organizer
          </Badge>
        )}
      </div>
      <div className='flex gap-1'>
        <UpdateParticipantDialog
          participant={participant}
          participants={participants}
        >
          <Button
            type='submit'
            variant='ghost'
            size='icon'
            className='size-8 text-zinc-500 hover:text-amber-600'
          >
            <Pencil className='size-4' />
          </Button>
        </UpdateParticipantDialog>

        {/* <ConfirmationDialog
          title='Delete Participant'
          description={`Are you sure you want to delete ${participant.name}? This
              will remove them from all expenses they are part of.`}
          onClick={async () => {
            if (participant.id && deleteParticipant) {
              await deleteParticipant({ id: participant.id });
            }
          }}
          actionText='Delete'
          variant='destructive'
        >
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 text-zinc-500 hover:text-red-600'
            disabled={session?.creator === participant.name}
          >
            <Trash2 className='size-4' />
          </Button>
        </ConfirmationDialog> */}
      </div>
    </article>
  );
};

export { ParticipantCard };
