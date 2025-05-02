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
import { toast } from "sonner";
import { useCreateParticipant } from "@/hooks";
import { useSessionStore } from "@/store/sessionStore";
import { useSearchParams } from "next/navigation";

export const getSession = async (id: string) => {
  const response = await fetch(`/api/sessions/${id}`);
  if (!response.ok) throw new Error("Session not found");
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
    reset,
    formState: { errors },
  } = useForm<Session>();

  const onSubmit = async (data: Session) => {
    setIsLoading(true);

    try {
      const session = await getSession(data.id);
      useSessionStore.getState().setSession(session);
      await createParticipant({
        values: {
          name: data.name,
          id: "",
        },
        session_id: data.id,
      });

      toast.success("Successfully joined the session!");
      router.push(`/dashboard/${data.id}/participants`);
      reset();
    } catch (err) {
      console.error("Error creating session:", err);
      toast.error("Something went wrong.");
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
              value={id}
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
        <CardFooter className='pt-4'>
          <CustomButton
            type='submit'
            isLoading={isLoading}
            buttonText='Join Session'
            buttonLoadingText='Joining Session...'
            disabled={isLoading}
          />
        </CardFooter>
      </form>
    </Card>
  );
};

export default JoinSession;
