// lib/realtimeListener.ts
import { supabase } from "./supabaseClient";

export const initRealtimeListener = () => {
  const channel = supabase
    .channel("public:all-tables")
    .on(
      "postgres_changes",
      {
        event: "*", // INSERT, UPDATE, DELETE
        schema: "public",
        table: "*", // All tables
      },
      (payload) => {
        // console.log(`[Realtime] Change received on ${payload.table}:`, payload);
        // Handle your logic here: update state, revalidate SWR, notify UI, etc.
      }
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        // console.log("[Realtime] Subscribed to all table changes");
      }
    });
};
