"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CustomButton } from "../shared/CustomButton";
import { useForm } from "react-hook-form";
import { Session } from "@/types/session";
import { useCreateSession } from "@/hooks";
import { useCreateParticipant } from "@/hooks";
import { ReminderWarningCard } from "../settlement/ReminderWarningCard";
import Link from "next/link";

const CreateSession = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { createSession } = useCreateSession();
  const { createParticipant } = useCreateParticipant();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Session>();

  const onSubmit = async (data: Session) => {
    setIsLoading(true);

    try {
      const response = await createSession(data);
      router.push(`/dashboard/${response.id}/participants`);
      await createParticipant({
        values: {
          name: data.creator,
          id: "",
        },
        session_id: response.id,
      });
      reset();
    } catch (err) {
      console.error("Error creating session:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-lg'>
      <CardHeader className='space-y-1'>
        <div className='flex items-center gap-2 mb-2'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
            <CreditCard className='h-5 w-5 text-primary' />
          </div>
        </div>
        <CardTitle className='text-xl sm:text-2xl leading-tight font-semibold'>
          Create a New Session
        </CardTitle>
        <CardDescription>
          Start a new expense splitting session for your group
        </CardDescription>
        <ReminderWarningCard
          content='Choose your session name carefully — no take-backs! 🚫✏️'
          className='w-full'
        />
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-4 pt-2'>
          <div className='space-y-2'>
            <Label htmlFor='session-name'>Session Name</Label>
            <Input
              id='name'
              placeholder='e.g., Summer Trip 2025'
              {...register("name", { required: true })}
              className='h-11'
            />
            {errors.name && (
              <p className='text-xs text-red-400'>Session name is required.</p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='your-name'>Your Name</Label>
            <Input
              id='creator'
              placeholder='Enter your name'
              {...register("creator", { required: true })}
              className='h-11'
            />
            {errors.creator && (
              <p className='text-xs text-red-400'>Your name is required.</p>
            )}
          </div>
        </CardContent>
        <CardFooter className='pt-4 flex flex-col gap-3'>
          <CustomButton
            type='submit'
            isLoading={isLoading}
            buttonText='Create Session'
            buttonLoadingText='Creating Session...'
            disabled={isLoading}
          />
          <p className='text-xs text-muted-foreground text-center'>
            Got a session ID?
            <Link href='/join'>
              <span className='mx-1 text-zinc-700 hover:text-primary font-medium transition-colors hover:underline cursor-pointer'>
                Join your session
              </span>
            </Link>
            now!
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateSession;
