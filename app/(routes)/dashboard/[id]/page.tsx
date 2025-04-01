"use client";

import { use } from "react";
import { useEffect } from "react";
import { useSessionStore } from "@/store/sessionStore";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const sessionId = useSessionStore((state) => state.sessionId);
  const setSessionId = useSessionStore((state) => state.setSessionId);

  useEffect(() => {
    setSessionId(id);
  }, [id, setSessionId]);

  return (
    <main>
      <h1>Dashboard for session id from URL: {id}</h1>
      <h1>Session ID in Zustand: {sessionId}</h1>
    </main>
  );
}
