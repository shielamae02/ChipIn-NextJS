"use client";

import clsx from "clsx";
import Link from "next/link";
import { useEffect } from "react";
import { Calendar1, Plus } from "lucide-react";
import { formatDateTime, getTimeEmoji } from "@/lib/utils";
import { useSessionStore } from "@/store/sessionStore";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { usePathname, useRouter } from "next/navigation";
import { CreateEventDialog } from "@/components/events/CreateEventDialog";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/FadeIn";
import { useParticipants } from "@/hooks";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, hasHydrated } = useSessionStore();
  const { participants } = useParticipants(session?.id);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!session) router.replace("/join");
  }, [hasHydrated, session, router]);

  const basePath = pathname.split("/").slice(0, 3).join("/");

  const tabs = [
    { label: "Events", path: "events" },
    { label: "Participants", path: "participants" },
    { label: "Summary", path: "summary" },
  ];

  return (
    <>
      <DashboardHeader />
      <div className='min-h-screen flex flex-col h-full max-w-6xl mx-auto px-4 sm:px-6'>
        <main className='py-6 flex h-full flex-1 flex-col space-y-5 '>
          <div className='flex justify-between w-full items-end'>
            <div className='space-y-1'>
              <FadeIn duration={100}>
                <h1 className='text-2xl font-semibold sm:text-5xl'>
                  {session?.name}
                </h1>
              </FadeIn>
              <FadeIn duration={200}>
                <div className='flex text-muted-foreground text-xs sm:text-sm'>
                  {session && `created by ${session.creator}`}
                </div>
              </FadeIn>
            </div>
            <FadeIn duration={200}>
              <p className='text-xs sm:text-sm text-muted-foreground flex items-center'>
                <Calendar1 className='size-3 mr-1 sm:size-4' />
                {session?.created_at ? (
                  <>
                    {formatDateTime(session.created_at)}
                    <span className='mr-1'>
                      {getTimeEmoji(session.created_at)}
                    </span>
                  </>
                ) : (
                  ""
                )}
              </p>
            </FadeIn>
          </div>

          <FadeIn duration={300}>
            <div className='flex justify-between gap-1'>
              <div className=' flex gap-1 sm:gap-2'>
                {tabs.map((tab) => {
                  const href = `${basePath}/${tab.path}`;
                  const isActive = pathname === href;

                  return (
                    <Link key={tab.path} href={href}>
                      <button
                        className={clsx(
                          "text-xs sm:text-sm font-medium py-2 px-3.5 w-fit rounded-lg transition",
                          isActive
                            ? "bg-zinc-900 text-white"
                            : "bg-zinc-100 hover:bg-zinc-200"
                        )}
                      >
                        {tab.label}
                      </button>
                    </Link>
                  );
                })}
              </div>

              {pathname.endsWith("/events") && (
                <CreateEventDialog>
                  <Button
                    disabled={participants.length < 2}
                    className='text-sm bg-zinc-800 h-8 sm:h-auto hover:bg-zinc-900 text-white shadow-lg transition duration-300'
                  >
                    <Plus />
                    <span className='hidden sm:block'>Add Event</span>
                  </Button>
                </CreateEventDialog>
              )}
            </div>
          </FadeIn>

          <FadeIn duration={400}>
            <div className='pt-3 w-full h-full flex-1 flex flex-col'>
              {children}
            </div>
          </FadeIn>
        </main>
      </div>
    </>
  );
}
