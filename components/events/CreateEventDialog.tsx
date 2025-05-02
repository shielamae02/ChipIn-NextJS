"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Event } from "@/types/event";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import useCreateEvent from "@/hooks/events/useCreateEvent";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CreateEventDialogProps {
  children: React.ReactNode;
}

const CreateEventDialog: React.FC<CreateEventDialogProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { id } = useParams();
  const session_id = id as string;

  const { createEvent } = useCreateEvent(session_id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm<Event>({
    mode: "onChange",
  });

  const onSubmit = async (data: Event) => {
    setIsLoading(true);

    try {
      if (session_id) {
        await createEvent({ name: data.name });
        setIsModalOpen(false);
        reset();
      } else {
        console.error("Session ID is undefined.");
        toast.error("Session ID is missing.");
      }
      reset();
    } catch (err) {
      console.error("Error adding participant:", err);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px] max-h-[90vh] overflow-auto'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <div className='flex items-center gap-2 mb-1'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800'>
                <CalendarPlus className='h-4 w-4 text-zinc-900 dark:text-zinc-100' />
              </div>
              <DialogTitle>Add New Event</DialogTitle>
            </div>
            <DialogDescription>
              Create a new event to track expenses for a specific activity.
            </DialogDescription>
          </DialogHeader>
          <div className='mt-2 pr-1'>
            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <Label htmlFor='event-name'>Event Name</Label>
                <Input
                  id='name'
                  placeholder='e.g., Dinner at Restaurant'
                  {...register("name", {
                    required: "Event name is required.",
                  })}
                  className='h-10 w-full'
                />
                {errors.name && (
                  <p className='text-xs text-red-400'>{errors.name.message}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type='submit' disabled={isLoading || !isValid}>
              Add Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { CreateEventDialog };
