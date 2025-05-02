import { Event } from "@/types/event";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Receipt, Trash2 } from "lucide-react";
import { Expense } from "@/types/expense";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ExpenseForm } from "./ExpenseForm";
import { useDeleteExpense, useExpense, useUpdateExpense } from "@/hooks";
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
import { ConfirmationDialog } from "../common/ConfirmationDialog";

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
  const { deleteExpense } = useDeleteExpense(session_id as string);

  const methods = useForm<Expense>({
    mode: "onChange",
  });

  const {
    handleSubmit,
    reset,
    formState: { isValid },
  } = methods;

  const onSubmit = async (data: Expense) => {
    setIsLoading(true);
    try {
      if (!session_id) {
        return;
      }

      const paidByArray = Object.entries(paidBy)
        .filter(([, amount]) => amount! > 0)
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
        event_id: event.id!,
        amount: data.amount,
        paidBy: paidByArray,
        splitAmong,
        date: new Date().toISOString(),
      };

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
            className='flex flex-col flex-1 overflow-hidden max-w-6xl  w-full mx-auto'
          >
            <DrawerHeader>
              <div className='flex items-center gap-2 mb-2 justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='flex size-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800'>
                    <Receipt className='size-4 text-zinc-900 dark:text-zinc-100' />
                  </div>
                  <DrawerTitle>Update {expense?.description} </DrawerTitle>
                </div>
                <ConfirmationDialog
                  title='Delete Expense'
                  description={`Are you sure you want to delete ${expense?.description} expense?`}
                  onClick={() =>
                    expense?.id && deleteExpense({ id: expense.id })
                  }
                  actionText='Delete'
                  variant='destructive'
                >
                  <Button className='bg-red-50 mr-5 text-red-600 border-red-100 hover:bg-red-100 hover:text-red-600 '>
                    <Trash2 className='size-4' />
                    Delete Expense
                  </Button>
                </ConfirmationDialog>
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
              <Button
                type='submit'
                disabled={!isValid || isLoading || isAmountMismatch}
              >
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
