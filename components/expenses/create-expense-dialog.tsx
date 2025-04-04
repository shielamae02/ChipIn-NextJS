import { toast } from "sonner";
import { Event } from "@/types/event";
import { Button } from "../ui/button";
import { Receipt } from "lucide-react";
import { Expense } from "@/types/expense";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ExpenseForm } from "./expense-form";
import { useCreateExpense } from "@/hooks";
import { FormProvider, useForm } from "react-hook-form";
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

interface CreateExpenseDialogProps {
  children: React.ReactNode;
  event: Event;
}

const CreateExpenseDialog: React.FC<CreateExpenseDialogProps> = ({
  children,
  event,
}) => {
  const { id: session_id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAmountMismatch, setIsAmountMismatch] = useState(false);

  const [paidBy, setPaidBy] = useState<Record<string, number | null>>({});
  const [splitAmong, setSplitAmong] = useState<string[]>([]);

  const { createExpense } = useCreateExpense(event.id!);

  const methods = useForm<Omit<Expense, "event_id">>({
    mode: "onChange",
  });

  const {
    handleSubmit,
    reset,
    formState: { isValid },
  } = methods;

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      if (!session_id) {
        return;
      }

      const paidByArray = Object.entries(paidBy)
        .filter(([_, amount]) => amount! > 0)
        .map(([participant_id, amount]) => ({
          participant_id,
          amount,
        }));

      const expensePayload = {
        ...data,
        amount: parseFloat(data.amount),
        paidBy: paidByArray,
        splitAmong,
        date: new Date().toISOString(),
      };

      await createExpense(expensePayload);

      setIsDrawerOpen(false);
      reset();
      setPaidBy({});
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
        <FormProvider {...methods}>
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

            <ExpenseForm
              session_id={session_id as string}
              paidBy={paidBy}
              setPaidBy={setPaidBy}
              splitAmong={splitAmong}
              setSplitAmong={setSplitAmong}
              setIsAmountMismatch={setIsAmountMismatch}
            />

            <DrawerFooter className='border-t mt-auto'>
              <Button
                type='submit'
                disabled={!isValid || isLoading || isAmountMismatch}
              >
                {isLoading ? "Saving..." : "Create Expense"}
              </Button>
              <DrawerClose asChild>
                <Button type='button' variant='outline'>
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </FormProvider>
      </DrawerContent>
    </Drawer>
  );
};

export { CreateExpenseDialog };
