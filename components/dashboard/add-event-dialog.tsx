"use client";

import type React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (eventName: string) => void;
}

const AddEventDialog: React.FC<AddEventDialogProps> = ({
  open,
  onOpenChange,
  onAdd,
}) => {
  const [eventName, setEventName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventName.trim()) {
      onAdd(eventName);
      setEventName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px] max-h-[90vh] overflow-auto'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className='flex items-center gap-2 mb-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800'>
                <CalendarPlus className='h-4 w-4 text-zinc-900 dark:text-zinc-100' />
              </div>
              <DialogTitle>Add New Event</DialogTitle>
            </div>
            <DialogDescription>
              Create a new event to track expenses for a specific activity.
            </DialogDescription>
          </DialogHeader>
          <div className='mt-4 pr-1'>
            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <Label htmlFor='event-name'>Event Name</Label>
                <Input
                  id='event-name'
                  placeholder='e.g., Dinner at Restaurant'
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className='h-10'
                  autoFocus
                />
              </div>
            </div>
          </div>
          <DialogFooter className='mt-6'>
            <Button type='submit' disabled={!eventName.trim()}>
              Add Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { AddEventDialog };
