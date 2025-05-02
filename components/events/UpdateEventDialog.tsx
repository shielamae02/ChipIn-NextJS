import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import useUpdateEvent from "@/hooks/events/useUpdateEvent";
import { Event } from "@/types/event";
import { Input } from "../ui/input";

interface UpdateEventDialogProps {
  children: React.ReactNode;
  event: Event;
}

const UpdateEventDialog: React.FC<UpdateEventDialogProps> = ({
  children,
  event,
}) => {
  const { updateEvent } = useUpdateEvent(event.id!);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Event>({
    mode: "onChange",
    defaultValues: {
      name: event.name,
    },
  });

  const onSubmit = async (data: Event) => {
    setIsLoading(true);
    try {
      await updateEvent({
        values: { id: event.id, name: data.name },
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error updating event name:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col items-start space-y-3'
        >
          <DialogHeader>
            <DialogTitle>Update Event Name</DialogTitle>
          </DialogHeader>

          <Input
            {...register("name", {
              required: "Event name is required.",
            })}
            className='h-10 w-full'
          />
          {errors.name && (
            <p className='text-xs text-red-400'>{errors.name.message}</p>
          )}

          <div className='w-full flex justify-end space-x-2 pt-1'>
            <DialogClose asChild>
              <Button
                size='sm'
                type='button'
                variant='outline'
                className='h-10'
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type='submit'
              size='sm'
              disabled={isLoading}
              className='h-10'
            >
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { UpdateEventDialog };
