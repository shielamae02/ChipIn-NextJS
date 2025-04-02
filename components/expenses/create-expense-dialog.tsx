import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { Event } from "@/types/event";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useParams } from "next/navigation";
import { useCreateExpense, useParticipants } from "@/hooks";
import { Checkbox } from "../ui/checkbox";
import { Receipt } from "lucide-react";
import { Expense } from "@/types/expense";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

interface CreateExpenseDialogProps {
  children: React.ReactNode;
  event: Event;
}

const CreateExpenseDialog: React.FC<CreateExpenseDialogProps> = ({
  children,
  event,
}) => {
  const { id } = useParams();
  const session_id = id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [paidBy, setPaidBy] = useState<string[]>([]);
  const [splitAmong, setSplitAmong] = useState<string[]>([]);

  if (!event?.id) {
    throw new Error("Event ID is required.");
  }

  const { participants } = useParticipants(session_id);
  const { createExpense } = useCreateExpense(event.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm<Omit<Expense, "event_id">>({
    mode: "onChange",
  });

  const togglePaidBy = (participantId: string) => {
    setPaidBy((prev) =>
      prev.includes(participantId)
        ? prev.filter((id) => id !== participantId)
        : [...prev, participantId]
    );
  };

  const toggleSplitAmong = (participantId: string) => {
    setSplitAmong((prev) =>
      prev.includes(participantId)
        ? prev.filter((id) => id !== participantId)
        : [...prev, participantId]
    );
  };

  const selectAllForSplit = () => {
    setSplitAmong(
      participants
        .map((p) => p.id)
        .filter((id): id is string => id !== undefined)
    );
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      if (!session_id) {
        toast.error("Session ID is missing.");
        return;
      }

      if (paidBy.length === 0) {
        toast.error("Select at least one participant who paid.");
        return;
      }

      if (splitAmong.length === 0) {
        toast.error("Select at least one participant to split with.");
        return;
      }

      await createExpense({
        ...data,
        amount: parseFloat(data.amount),
        paidBy,
        splitAmong,
        date: new Date().toISOString(),
      });

      setIsDrawerOpen(false);
      reset();
      setPaidBy([]);
      setSplitAmong([]);
    } catch (err) {
      console.error("Error creating expense:", err);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className='flex flex-col max-h-[90vh]'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col flex-1 overflow-hidden'
        >
          <DrawerHeader>
            <div className='flex items-center gap-2 mb-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800'>
                <Receipt className='h-4 w-4 text-zinc-900 dark:text-zinc-100' />
              </div>
              <DrawerTitle>Add Expense to {event.name}</DrawerTitle>
            </div>
            <DrawerDescription>
              Enter the expense details and who paid for it.
            </DrawerDescription>
          </DrawerHeader>

          {/* Scrollable content area */}
          <div className='flex-1 overflow-y-auto px-4'>
            <div className='pb-4'>
              <div className='grid gap-4 py-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='description'>Description</Label>
                  <Input
                    id='description'
                    placeholder='e.g., Dinner bill'
                    {...register("description", {
                      required: "Description is required.",
                    })}
                    className='h-10 w-full'
                  />
                  {errors.description && (
                    <p className='text-xs text-red-400'>
                      {errors.description.message}
                    </p>
                  )}
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='amount'>Amount</Label>
                  <Input
                    id='amount'
                    type='number'
                    min='0.00'
                    placeholder='0.00'
                    className='h-10'
                    {...register("amount", {
                      required: "Amount is required.",
                    })}
                  />
                  {errors.amount && (
                    <p className='text-xs text-red-400'>
                      {errors.amount.message}
                    </p>
                  )}
                </div>

                <div className='grid gap-2'>
                  <Label>Paid by</Label>
                  <div className='grid gap-2 p-3 border rounded-md bg-zinc-50 dark:bg-zinc-900 max-h-[200px] overflow-y-auto'>
                    {participants.map((participant) => (
                      <div
                        key={`paid-${participant.id}`}
                        className='flex items-center space-x-2'
                      >
                        <Checkbox
                          id={`paid-${participant.id}`}
                          checked={
                            participant.id
                              ? paidBy.includes(participant.id)
                              : false
                          }
                          onCheckedChange={() =>
                            participant.id && togglePaidBy(participant.id)
                          }
                          className='data-[state=checked]:bg-zinc-900 data-[state=checked]:text-zinc-50 dark:data-[state=checked]:bg-zinc-50 dark:data-[state=checked]:text-zinc-900'
                        />
                        <Label
                          htmlFor={`paid-${participant.id}`}
                          className='cursor-pointer text-sm font-normal'
                        >
                          <Image
                            src={`https://api.dicebear.com/9.x/big-ears/png?seed=${participant.name}`}
                            alt='Cute Avatar'
                            width={48}
                            height={48}
                            className='size-5 rounded-full'
                          />
                          {participant.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {paidBy.length === 0 && (
                    <p className='text-xs text-destructive'>
                      Select at least one person who paid
                    </p>
                  )}
                </div>

                {/* Split Among */}
                <div className='grid gap-2'>
                  <div className='flex items-center justify-between'>
                    <Label>Split among</Label>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={selectAllForSplit}
                      className='h-8 px-3 text-xs'
                    >
                      Select All
                    </Button>
                  </div>
                  <div className='grid gap-2 p-3 border rounded-md bg-zinc-50 dark:bg-zinc-900 max-h-[200px] overflow-y-auto'>
                    {participants.map((participant) => (
                      <div
                        key={`split-${participant.id}`}
                        className='flex items-center space-x-2'
                      >
                        <Checkbox
                          id={`split-${participant.id}`}
                          checked={
                            participant.id
                              ? splitAmong.includes(participant.id)
                              : false
                          }
                          onCheckedChange={() =>
                            participant.id && toggleSplitAmong(participant.id)
                          }
                          className='data-[state=checked]:bg-zinc-900 data-[state=checked]:text-zinc-50 dark:data-[state=checked]:bg-zinc-50 dark:data-[state=checked]:text-zinc-900'
                        />
                        <Label
                          htmlFor={`split-${participant.id}`}
                          className='cursor-pointer text-sm font-normal'
                        >
                          <Image
                            src={`https://api.dicebear.com/9.x/big-ears/png?seed=${participant.name}`}
                            alt='Cute Avatar'
                            width={48}
                            height={48}
                            className='size-5 rounded-full'
                          />
                          {participant.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {splitAmong.length === 0 && (
                    <p className='text-xs text-destructive'>
                      Select at least one person to split with
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Always visible footer */}
          <DrawerFooter className='border-t mt-auto'>
            <Button type='submit' disabled={!isValid}>
              Create Expense
            </Button>
            <DrawerClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export { CreateExpenseDialog };
