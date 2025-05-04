"use client";
import { useEffect, useMemo } from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initRealtimeListener } from "@/lib/supabase/realtime-listener";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useMemo(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          refetchOnWindowFocus: false,
          refetchOnMount: false,
        },
      },
    });
  }, []);

  useEffect(() => {
    const channel = initRealtimeListener(queryClient);

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {children}
        <Toaster expand={true} duration={4000} visibleToasts={5} />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export { Provider };
