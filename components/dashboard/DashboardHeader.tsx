"use client";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/store/sessionStore";
import { Copy, LogOut, ScanQrCode } from "lucide-react";
import { ShareQRCodeDialog } from "./ShareQRCodeDialog";
import { ShareSessionDialog } from "./ShareSessionDialog";
import { Skeleton } from "../ui/skeleton";
import { ConfirmationDialog } from "../common/ConfirmationDialog";
import { useState } from "react";
import { Loading } from "../common/Loading";
import { toast } from "sonner";
import { Logo } from "../common/Logo";

const DashboardHeader = () => {
  const [isExiting, setIsExiting] = useState(false);

  const session = useSessionStore((state) => state.session);
  const clearSession = useSessionStore((state) => state.clearSession);

  if (!session) {
    return (
      <header className='sticky top-0 z-10  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='py-10 flex h-16 items-center mx-auto px-4 sm:px-6 max-w-6xl'>
          <div className='flex gap-2'>
            <Skeleton className='h-8 w-24' />
            <Skeleton className='h-8 w-36' />
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      {isExiting && <Loading />}
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
            <Logo />
          </ConfirmationDialog>

          <div className='ml-auto flex gap-2'>
            <ShareQRCodeDialog sessionName={session.name}>
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
              onClick={async () => {
                setIsExiting(true);
                try {
                  clearSession();
                  localStorage.removeItem("chipin-session");
                  toast.success("Sucessfully logged out from session.");
                  await new Promise((res) => setTimeout(res, 300));
                } catch (err) {
                  console.error("Error exiting session", err);
                }
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
    </>
  );
};

export { DashboardHeader };
