"use client";

import type React from "react";

import { useState } from "react";
import { Receipt } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Participant } from "@/types/participant";

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (expense: {
    description: string;
    amount: number;
    paidBy: string[];
    splitAmong: string[];
    date: string;
  }) => void;
  participants: Participant[];
  eventName: string;
}

const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({
  open,
  onOpenChange,
  onAdd,
  participants,
  eventName,
}) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState<string[]>([]);
  const [splitAmong, setSplitAmong] = useState<string[]>([]);

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setPaidBy([]);
    setSplitAmong([]);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      description.trim() &&
      amount &&
      paidBy.length > 0 &&
      splitAmong.length > 0
    ) {
      onAdd({
        description,
        amount: Number.parseFloat(amount),
        paidBy,
        splitAmong,
        date: new Date().toISOString(),
      });
      resetForm();
    }
  };

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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[500px] max-h-[90vh] overflow-auto'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className='flex items-center gap-2 mb-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800'>
                <Receipt className='h-4 w-4 text-zinc-900 dark:text-zinc-100' />
              </div>
              <DialogTitle>Add Expense to {eventName}</DialogTitle>
            </div>
            <DialogDescription>
              Enter the expense details and who paid for it.
            </DialogDescription>
          </DialogHeader>
          <div className='mt-4 pr-1'>
            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <Label htmlFor='description'>Description</Label>
                <Input
                  id='description'
                  placeholder='e.g., Dinner bill'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className='h-10'
                  autoFocus
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='amount'>Amount</Label>
                <Input
                  id='amount'
                  type='number'
                  min='0.01'
                  step='0.01'
                  placeholder='0.00'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className='h-10'
                />
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
                        checked={participant.id ? paidBy.includes(participant.id) : false}
                        onCheckedChange={() => participant.id && togglePaidBy(participant.id)}
                        className='data-[state=checked]:bg-zinc-900 data-[state=checked]:text-zinc-50 dark:data-[state=checked]:bg-zinc-50 dark:data-[state=checked]:text-zinc-900'
                      />
                      <Label
                        htmlFor={`paid-${participant.id}`}
                        className='cursor-pointer text-sm font-normal'
                      >
                        {participant.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {paidBy.length === 0 && (
                  <p className='text-sm text-destructive'>
                    Select at least one person who paid
                  </p>
                )}
              </div>

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
                        checked={participant.id ? splitAmong.includes(participant.id) : false}
                        onCheckedChange={() => participant.id && toggleSplitAmong(participant.id)}
                        className='data-[state=checked]:bg-zinc-900 data-[state=checked]:text-zinc-50 dark:data-[state=checked]:bg-zinc-50 dark:data-[state=checked]:text-zinc-900'
                      />
                      <Label
                        htmlFor={`split-${participant.id}`}
                        className='cursor-pointer text-sm font-normal'
                      >
                        {participant.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {splitAmong.length === 0 && (
                  <p className='text-sm text-destructive'>
                    Select at least one person to split with
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className='mt-6'>
            <Button
              type='submit'
              disabled={
                !description.trim() ||
                !amount ||
                paidBy.length === 0 ||
                splitAmong.length === 0
              }
              className='w-full sm:w-auto'
            >
              Add Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { AddExpenseDialog };
