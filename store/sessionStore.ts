import { Session } from "@/types/session";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SessionState {
  session: Session | null;
  hasHydrated: boolean;
  setSession: (session: Session) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
      hasHydrated: false,
    }),
    {
      name: "chipin-session", // key in localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  )
);
