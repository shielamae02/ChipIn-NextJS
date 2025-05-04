import { QueryClient } from "@tanstack/react-query";
import { supabase } from "./supabaseClient";

import { RealtimeChannel } from "@supabase/supabase-js";

export const initRealtimeListener = (
  queryClient: QueryClient
): RealtimeChannel => {
  const channel = supabase
    .channel("public:all-tables")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "*",
      },
      (payload) => {
        switch (payload.table) {
          case "participants":
            queryClient.invalidateQueries({ queryKey: ["participants"] });
            queryClient.invalidateQueries({ queryKey: ["eventBalances"] });
            break;
          case "events":
            queryClient.invalidateQueries({ queryKey: ["events"] });
            queryClient.invalidateQueries({ queryKey: ["eventBalances"] });
            break;
          case "expenses":
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
            queryClient.invalidateQueries({ queryKey: ["eventBalances"] });
            break;
        }
      }
    )
    .subscribe();

  return channel;
};
