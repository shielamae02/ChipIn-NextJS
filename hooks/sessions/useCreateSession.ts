"use client";

import { toast } from "sonner";
import { Session } from "@/types/session";
import { useTransition } from "react";
import { useSessionStore } from "@/store/sessionStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createSessionRequest = async (values: Session) => {
  const { name, creator } = values;
  const result = await fetch("/api/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, creator }),
  });

  const response = await result.json();

  if (!result.ok) {
    throw new Error("Failed to create session");
  }

  useSessionStore.getState().setSession(response);
  return response;
};

const useCreateSession = () => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: createSession } = useMutation({
    mutationFn: createSessionRequest,
    onSuccess: () => {
      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: ["participants"] });
      });
    },
    onError: (err: any) => {
      toast.error("Failed to create session.");
      console.error(err);
    },
  });

  return { createSession, isPending };
};

export default useCreateSession;
