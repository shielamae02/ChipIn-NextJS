import { Event } from "@/types/event";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Receipt } from "lucide-react";
import { Expense } from "@/types/expense";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ExpenseForm } from "./ExpenseForm";
import { useExpense, useUpdateExpense } from "@/hooks";
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

interface UpdateExpenseDialogProps {
  children: React.ReactNode;
  event: Event;
  expenseId: string;
}

const UpdateExpenseDialog: React.FC<UpdateExpenseDialogProps> = ({
  children,
  event,
  expenseId,
}) => {
  const { id: session_id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAmountMismatch, setIsAmountMismatch] = useState(false);

  const [paidBy, setPaidBy] = useState<Record<string, number | null>>({});
  const [splitAmong, setSplitAmong] = useState<string[]>([]);

  const { expense } = useExpense(expenseId);
  const { updateExpense } = useUpdateExpense(event.id!, expenseId);

  const methods = useForm<Expense>({
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

      if (paidBy.length === 0) {
        toast.error("Select at least one participant who paid.");
        return;
      }

      if (splitAmong.length === 0) {
        toast.error("Select at least one participant to split with.");
        return;
      }

      const expensePayload = {
        ...data,
        event_id: event.id,
        amount: parseFloat(data.amount),
        paidBy: paidByArray,
        splitAmong,
        date: new Date().toISOString(),
      };

      console.log("Expense Payload:", expensePayload);

      await updateExpense(expensePayload);

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
                <DrawerTitle>Update {expense?.description} </DrawerTitle>
              </div>
              <DrawerDescription>
                Edit the expense details and who paid for it.
              </DrawerDescription>
            </DrawerHeader>

            <ExpenseForm
              session_id={session_id as string}
              paidBy={paidBy}
              setPaidBy={setPaidBy}
              splitAmong={splitAmong}
              setSplitAmong={setSplitAmong}
              initialData={expense}
              setIsAmountMismatch={setIsAmountMismatch}
            />

            <DrawerFooter className='border-t mt-auto'>
              <Button type='submit' disabled={!isValid || isLoading}>
                {isLoading ? "Updating..." : "Update Expense"}
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

export { UpdateExpenseDialog };
