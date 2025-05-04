"use client";

import Image from "next/image";
import { Event } from "@/types/event";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UpdateExpenseDialog } from "../expenses/UpdateExpenseDialog";
import { CreateExpenseDialog } from "../expenses/CreateExpenseDialog";
import { Plus, Receipt, Clock, Trash2 } from "lucide-react";
import { formatCurrency, formatTime } from "@/lib/utils";
import {
  useDeleteEvent,
  useEventBalances,
  useExpenses,
  useParticipants,
} from "@/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmationDialog } from "../common/ConfirmationDialog";

const EventCard = (event: Event) => {
  const { id } = useParams();
  const session_id = id as string;

  const { expenses } = useExpenses(event.id);
  const { participants } = useParticipants(session_id);
  const { deleteEvent } = useDeleteEvent(session_id, event.id || "");
  const { eventBalances } = useEventBalances(event.id);

  const mergedParticipants = participants.map((p) => {
    const balanceEntry = eventBalances.find((b) => b.participant_id === p.id);
    return {
      ...p,
      balance: balanceEntry?.net ?? 0,
    };
  });

  return (
    <Card className='overflow-hidden transition-all hover:shadow-md'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='flex size-6 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800'>
              <Receipt className='size-3 text-zinc-900 dark:text-zinc-100' />
            </div>
            <CardTitle className='text-xl'>{event.name}</CardTitle>
          </div>
          {expenses.length > 0 && (
            <span className='text-xs font-medium text-muted-foreground rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-1'>
              {expenses.length} expense
              {expenses.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <CardDescription className='flex items-center gap-1 mt-2'>
          <Clock className='h-3 w-3' />
          {formatTime(event.created_at || "")}
        </CardDescription>
      </CardHeader>
      <CardContent className='flex h-full'>
        {expenses.length === 0 ? (
          <div className='flex flex-1 flex-grow h-full flex-col items-center justify-center py-8 text-center'>
            <div className='rounded-full bg-zinc-100 dark:bg-zinc-800 p-3 mb-3'>
              <Plus className='h-5 w-5 text-muted-foreground' />
            </div>
            <p className='text-muted-foreground'>No expenses added yet</p>
          </div>
        ) : (
          <div className='space-y-4 flex-1'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium'>Total</span>
              <span className='font-semibold'>
                {formatCurrency(event.total_amount ?? 0)}
              </span>
            </div>
            <Separator />

            <ScrollArea className='h-44 pr-1.5'>
              <div className='space-y-2'>
                {expenses.map((expense) => (
                  <UpdateExpenseDialog
                    expenseId={expense.id!}
                    event={event}
                    key={expense.id}
                  >
                    <div className='flex justify-between cursor-pointer items-center text-sm py-1.5 px-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group'>
                      <span>{formatTime(expense.created_at!)}</span>
                      <span>{expense.description}</span>
                      <div className='flex items-center gap-2'>
                        <span className='font-medium'>
                          {formatCurrency(expense.amount)}
                        </span>
                      </div>
                    </div>
                  </UpdateExpenseDialog>
                ))}
              </div>
            </ScrollArea>

            <Separator />

            <div className='space-y-2'>
              <h4 className='text-sm font-medium'>Current Balances</h4>
              <ScrollArea className='h-28 pr-1.5'>
                <div className='space-y-1'>
                  {mergedParticipants.map((participant) => (
                    <div
                      className='flex text-sm sm:text-md justify-between'
                      key={participant.id}
                    >
                      <div className='flex items-center'>
                        <Image
                          src={`https://api.dicebear.com/9.x/big-ears/png?seed=${participant.name}`}
                          alt='Cute Avatar'
                          width={48}
                          height={48}
                          className='size-5 mr-1 rounded-full'
                        />
                        {participant.name}
                      </div>
                      <span
                        className={
                          Number(participant.balance) > 0
                            ? "text-green-400 font-medium"
                            : Number(participant.balance) < 0
                            ? "text-red-400 font-medium"
                            : ""
                        }
                      >
                        {formatCurrency(Number(participant.balance))}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className='w-full space-y-2'>
          <CreateExpenseDialog event={event}>
            <Button className='w-full flex items-center'>
              <Plus className='size-4' />
              Add Expense
            </Button>
          </CreateExpenseDialog>

          <ConfirmationDialog
            title='Delete Event'
            description={`Are you sure you want to delete ${event.name}? This will also delete all expenses associated with this event.`}
            onClick={async () =>
              event.id && (await deleteEvent({ id: event.id }))
            }
            actionText='Delete'
            variant='destructive'
          >
            <Button className='bg-red-50 text-red-600 w-full hover:bg-red-100 hover:text-red-600'>
              <Trash2 className='size-4' />
              Delete Event
            </Button>
          </ConfirmationDialog>
        </div>
      </CardFooter>
    </Card>
  );
};

export { EventCard };
