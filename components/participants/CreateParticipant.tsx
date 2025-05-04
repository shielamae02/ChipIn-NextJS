import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Participant } from "@/types/participant";
import { useCreateParticipant } from "@/hooks";

const CreateParticipant = ({
  participants,
}: {
  participants: Participant[];
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();
  const session_id = id as string;

  const { createParticipant } = useCreateParticipant();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm<Participant>({
    mode: "onChange",
  });

  const onSubmit = async (data: Participant) => {
    setIsLoading(true);

    try {
      if (session_id) {
        await createParticipant({
          values: { name: data.name, id: "" },
          session_id: session_id,
        });
      } else {
        console.error("Session ID is undefined.");
        toast.error("Session ID is missing.");
      }
      reset();
    } catch (err) {
      console.error("Error adding participant:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex flex-col items-start gap-2 mb-6 ${
        errors.name ? "items-center" : "items-end"
      }`}
    >
      <div className='flex gap-2 w-full'>
        <Input
          id='name'
          placeholder='Add Participant Name'
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
        <Button
          type='submit'
          disabled={isLoading || !isValid}
          className='h-10 shrink-0'
        >
          <Plus className='size-4' />
          Add
        </Button>
      </div>
      {errors.name && (
        <p className='text-xs text-red-400'>{errors.name.message}</p>
      )}
    </form>
  );
};

export { CreateParticipant };
