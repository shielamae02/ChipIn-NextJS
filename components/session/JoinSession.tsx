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
import { useEffect, useState } from "react";
import { CustomButton } from "../shared/CustomButton";
import { useForm } from "react-hook-form";
import { Session } from "@/types/session";
import { toast } from "sonner";
import { useCreateParticipant } from "@/hooks";
import { useSessionStore } from "@/store/sessionStore";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export const getSession = async (id: string) => {
  const response = await fetch(`/api/sessions/${id}`);
  if (!response.ok) {
    toast.error("Session not found.");
    throw new Error("Session not found.");
  }
  return response.json();
};

const JoinSession = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { createParticipant } = useCreateParticipant();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Session>({
    defaultValues: {
      id: id,
    },
  });

  useEffect(() => {
    if (id) {
      setValue("id", id);
    }
  }, [id, setValue]);

  const onSubmit = async (data: Session) => {
    setIsLoading(true);

    try {
      const session = await getSession(data.id);

      await createParticipant({
        values: { id: "", name: data.name },
        session_id: data.id,
        showToast: false,
      });

      useSessionStore.getState().setSession(session);
      router.push(`/dashboard/${data.id}/participants`);
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
        <CardTitle className='text-2xl leading-tight font-semibold'>
          Join a Session
        </CardTitle>
        <CardDescription>
          Enter the session ID and your name to join an existing expense
          splitting session
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-4 pt-2'>
          <div className='space-y-2'>
            <Label htmlFor='id'>Session ID</Label>
            <Input
              id='id'
              placeholder='Enter the session ID'
              {...register("id", { required: true })}
              className='h-11'
            />
            {errors.id && (
              <p className='text-xs text-red-400'>Session ID is required.</p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='name'>Your Name</Label>
            <Input
              id='name'
              placeholder='Enter your name'
              {...register("name", {
                required: "Participant name is required.",
              })}
              className='h-11'
            />
            {errors.name && (
              <p className='text-xs text-red-400'>
                {errors.name.message || "Your name is required."}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className='pt-4 flex flex-col gap-3'>
          <CustomButton
            type='submit'
            isLoading={isLoading}
            buttonText='Join Session'
            buttonLoadingText='Joining Session...'
            disabled={isLoading}
          />
          <p className='text-xs text-muted-foreground'>
            Would you like to
            <Link href='/create'>
              <span className='mx-1 text-zinc-700 hover:text-primary font-medium transition-colors hover:underline cursor-pointer'>
                create a session
              </span>
            </Link>
            instead?
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default JoinSession;
