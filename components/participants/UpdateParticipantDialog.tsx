import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Participant } from "@/types/participant";
import { useUpdateParticipant } from "@/hooks";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UpdateParticipantDialogProps {
  children: React.ReactNode;
  participant: Participant;
  participants: Participant[];
}

const UpdateParticipantDialog: React.FC<UpdateParticipantDialogProps> = ({
  children,
  participant,
  participants,
}) => {
  const { updateParticipant } = useUpdateParticipant();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Participant>({
    mode: "onChange",
    defaultValues: {
      name: participant.name,
    },
  });

  const onSubmit = async (data: Participant) => {
    setIsLoading(true);
    try {
      await updateParticipant({
        values: { id: participant.id, name: data.name },
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error updating participant:", err);
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
            <DialogTitle>Update Participant Name</DialogTitle>
          </DialogHeader>

          <Input
            {...register("name", {
              required: "Participant name is required.",
              validate: (value) => {
                const nameAlreadyExists = participants.some(
                  (p) => p.name.toLowerCase() === value.toLowerCase()
                );
                return !nameAlreadyExists || "Participant name must be unique.";
              },
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

export { UpdateParticipantDialog };
