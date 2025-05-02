"use client";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/store/sessionStore";
import { Copy, LogOut, ScanQrCode } from "lucide-react";
import { ShareQRCodeDialog } from "./ShareQRCodeDialog";
import { ShareSessionDialog } from "./ShareSessionDialog";
import { Skeleton } from "../ui/skeleton";
import { ConfirmationDialog } from "../common/ConfirmationDialog";

const DashboardHeader = () => {
  const session = useSessionStore((state) => state.session);
  const clearSession = useSessionStore((state) => state.clearSession);

  const url = session
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/${session.id}/events`
    : "";

  if (!session) {
    return (
      <header className='sticky top-0 z-10  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='px-4 sm:px-2 py-10 flex h-16 items-center justify-between'>
          <div className='flex gap-2'>
            <Skeleton className='h-8 w-24' />
            <Skeleton className='h-8 w-36' />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className='sticky top-0 z-10 bg-background/95 backdrop-blur w-full supports-[backdrop-filter]:bg-background/60'>
      <div className='py-10 flex h-16 items-center mx-auto px-4 sm:px-6 max-w-6xl'>
        <ConfirmationDialog
          title='Exit Session'
          description={`Are you sure you want to exit? This will end your current session, and you'll need to rejoin using the shared session ID. Do you want to continue?`}
          onClick={() => {
            clearSession();
            localStorage.removeItem("chipin-session");
          }}
          actionText='Exit Session'
          variant='destructive'
        >
          <h1 className='text-xl font-medium'>
            Chip<span className='font-bold'>In</span>
          </h1>
        </ConfirmationDialog>

        <div className='ml-auto flex gap-2'>
          <ShareQRCodeDialog url={url} sessionName={session.name}>
            <Button variant='outline' size='sm'>
              <ScanQrCode className='mr-0 sm:mr-1 size-4' />
              <p className='hidden sm:block'>Show QR Code</p>
            </Button>
          </ShareQRCodeDialog>
          <ShareSessionDialog session={session}>
            <Button size='sm'>
              <Copy className='mr-0 sm:mr-1 size-4' />
              <p className='hidden sm:block'>Share Session ID</p>
            </Button>
          </ShareSessionDialog>

          <ConfirmationDialog
            title='Exit Session'
            description={`Are you sure you want to exit? This will end your current session, and you'll need to rejoin using the shared session ID. Do you want to continue?`}
            onClick={() => {
              clearSession();
              localStorage.removeItem("chipin-session");
            }}
            actionText='Exit Session'
            variant='destructive'
          >
            <Button
              size='sm'
              className='bg-red-500 text-white hover:bg-red-400'
            >
              <LogOut />
            </Button>
          </ConfirmationDialog>
        </div>
      </div>
    </header>
  );
};

export { DashboardHeader };
