"use client";

import clsx from "clsx";
import Link from "next/link";
import { useEffect } from "react";
import { Calendar1 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useSessionStore } from "@/store/sessionStore";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, hasHydrated } = useSessionStore();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!session) router.replace("/join");
  }, [hasHydrated, session]);

  const basePath = pathname.split("/").slice(0, 3).join("/");

  const tabs = [
    { label: "Events", path: "events" },
    { label: "Participants", path: "participants" },
    { label: "Summary", path: "summary" },
  ];

  return (
    <div className='min-h-screen flex flex-col h-full'>
      {/* remove <Head> if you now use metadata */}
      <DashboardHeader />
      <main className='container py-6 mx-auto px-4 sm:px-2 flex h-full flex-1 flex-col space-y-5'>
        <div className='flex justify-between w-full items-end'>
          <div className='space-y-1'>
            <h1 className='text-2xl font-semibold sm:text-5xl'>
              {session?.name}
            </h1>
            <div className='flex text-muted-foreground text-xs sm:text-sm'>
              {session && `created by ${session.creator}`}
            </div>
          </div>
          <p className='text-sm sm:text-md text-muted-foreground flex items-center'>
            <Calendar1 className='size-3 mr-1 sm:size-4' />
            {session?.created_at ? formatDate(session.created_at) : ""}
          </p>
        </div>

        <div className='flex gap-2'>
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

        <div className='pt-3 w-full h-full flex-1 flex flex-col'>
          {children}
        </div>
      </main>
    </div>
  );
}
