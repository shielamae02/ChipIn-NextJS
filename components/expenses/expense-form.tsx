import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaidBy } from "./form/paid-by";
import { Button } from "@/components/ui/button";
import { Expense } from "@/types/expense";
import { FormField } from "./form/form-field";
import { SplitAmong } from "./form/split-among";
import { Participant } from "@/types/participant";
import { useFormContext } from "react-hook-form";
import { useParticipants } from "@/hooks";
import { useEffect, useMemo } from "react";
import { ParticipantsSkeleton } from "./participants-skeleton";

interface ExpenseDialogFormProps {
  session_id: string;
  initialData?: Expense;
  isUpdate?: boolean;
  paidBy: Record<string, number | null>;
  setPaidBy: React.Dispatch<
    React.SetStateAction<Record<string, number | null>>
  >;
  splitAmong: string[];
  setSplitAmong: React.Dispatch<React.SetStateAction<string[]>>;
  setIsAmountMismatch: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExpenseForm: React.FC<ExpenseDialogFormProps> = ({
  session_id,
  initialData,
  paidBy,
  setPaidBy,
  splitAmong,
  setSplitAmong,
  setIsAmountMismatch,
}) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const amount = watch("amount");

  const { participants, isLoading } = useParticipants(session_id);

  useEffect(() => {
    if (initialData) {
      setValue("description", initialData.description);
      setValue("amount", initialData.amount.toString());

      const paidByMap = (initialData || []).paidBy.reduce((acc, curr) => {
        acc[curr.participant_id] = curr.amount;
        return acc;
      }, {} as Record<string, number | null>);
      setPaidBy(paidByMap);

      setSplitAmong(initialData.splitAmong);
    }
  }, [initialData, setPaidBy, setSplitAmong, setValue]);

  const areAllPaidBySelected = participants.every(
    (p) => p.id && paidBy.hasOwnProperty(p.id)
  );

  const areAllSplitSelected = participants.every(
    (p) => p.id && splitAmong.includes(p.id)
  );

  const toggleSplitAmong = (participantId: string) => {
    setSplitAmong((prev) =>
      prev.includes(participantId)
        ? prev.filter((id) => id !== participantId)
        : [...prev, participantId]
    );
  };

  const togglePaidBy = (checked: boolean, p: Participant) =>
    setPaidBy((prev) => {
      const updated = { ...prev };
      if (checked) updated[p.id!] = null;
      else delete updated[p.id!];
      return updated;
    });

  const toggleSelectAllForSplit = () => {
    if (areAllSplitSelected) {
      setSplitAmong([]);
    } else {
      const allIds = participants
        .map((p) => p.id)
        .filter((id): id is string => id !== undefined);
      setSplitAmong(allIds);
    }
  };

  const toggleSelectAllForPaidBy = () => {
    if (areAllPaidBySelected) {
      setPaidBy({});
    } else {
      const allPaidBy = participants.reduce((acc, p) => {
        if (p.id) acc[p.id] = null;
        return acc;
      }, {} as Record<string, number | null>);
      setPaidBy(allPaidBy);
    }
  };

  const isParticipantChecked = (id: string) => paidBy[id] !== undefined;

  const totalPaid = useMemo(() => {
    return Object.values(paidBy).reduce((sum, val) => {
      return sum! + (typeof val === "number" ? val : 0);
    }, 0);
  }, [paidBy]);

  const amountValue = parseFloat(amount);

  const isAmountMismatch = useMemo(() => {
    return !isNaN(amountValue) && totalPaid !== amountValue;
  }, [amountValue, totalPaid]);

  useEffect(() => {
    setIsAmountMismatch(isAmountMismatch);
  }, [isAmountMismatch, setIsAmountMismatch]);

  return (
    <div className='flex-1 overflow-y-auto px-4'>
      <div className='pb-4'>
        <div className='grid gap-4 py-4'>
          {/* Description */}
          <FormField
            label='Description'
            htmlFor='description'
            error={
              typeof errors.description?.message === "string"
                ? errors.description.message
                : undefined
            }
          >
            <Input
              id='description'
              placeholder='e.g., Dinner bill'
              {...register("description", {
                required: "Description is required.",
              })}
              className='h-10 w-full'
            />
          </FormField>

          {/* Amount */}
          <FormField
            label='Amount'
            htmlFor='amount'
            error={
              typeof errors.amount?.message === "string"
                ? errors.amount.message
                : undefined
            }
          >
            <Input
              id='amount'
              type='number'
              min='0.00'
              placeholder='0.00'
              className='h-10'
              {...register("amount", { required: "Amount is required." })}
            />
          </FormField>

          {/* Paid By */}
          <div className='grid gap-2 p-3 border rounded-md bg-zinc-50 dark:bg-zinc-900 max-h-[200px] overflow-y-auto'>
            <div className='flex items-center justify-between'>
              <Label>Paid by</Label>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={toggleSelectAllForPaidBy}
                className='h-8 px-3 text-xs'
              >
                {areAllPaidBySelected ? "Unselect All" : "Select All"}
              </Button>
            </div>
            {isLoading ? (
              <ParticipantsSkeleton />
            ) : (
              participants.map((p) => (
                <PaidBy
                  key={p.id}
                  participant={p}
                  isChecked={isParticipantChecked(p.id!)}
                  value={paidBy[p.id!] ?? ""}
                  onCheckboxChange={(checked) => togglePaidBy(checked, p)}
                  onAmountChange={(value: string) =>
                    setPaidBy((prev) => ({
                      ...prev,
                      [p.id!]: value === "" ? null : parseFloat(value),
                    }))
                  }
                />
              ))
            )}
          </div>
          {Object.keys(paidBy).length === 0 && (
            <p className='text-xs text-destructive mt-1'>
              Select at least one participant who paid
            </p>
          )}
          {isAmountMismatch && (
            <p className='text-xs text-destructive mt-1'>
              Total paid (${totalPaid}) does not match the total amount ( $
              {amountValue})
            </p>
          )}

          {/* Split Among */}
          <div className='grid gap-2'>
            <div className='flex items-center justify-between'>
              <Label>Split among</Label>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={toggleSelectAllForSplit}
                className='h-8 px-3 text-xs'
              >
                {areAllSplitSelected ? "Unselect All" : "Select All"}
              </Button>
            </div>
            <div className='grid gap-2 p-3 border rounded-md bg-zinc-50 dark:bg-zinc-900 max-h-[200px] overflow-y-auto'>
              {isLoading ? (
                <ParticipantsSkeleton />
              ) : (
                participants.map((p) => (
                  <SplitAmong
                    key={p.id}
                    participant={p}
                    checked={splitAmong.includes(p.id!)}
                    toggle={() => toggleSplitAmong(p.id!)}
                  />
                ))
              )}
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
  );
};

export { ExpenseForm };
