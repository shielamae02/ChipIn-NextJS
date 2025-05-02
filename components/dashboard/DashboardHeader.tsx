"use client";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/store/sessionStore";
import { Copy, ScanQrCode } from "lucide-react";
import Link from "next/link";
import { ShareQRCodeDialog } from "./ShareQRCodeDialog";
import { ShareSessionDialog } from "./ShareSessionDialog";
import { Skeleton } from "../ui/skeleton";

const DashboardHeader = () => {
  const session = useSessionStore((state) => state.session);

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
    <header className='sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 bg'>
      <div className='py-10 flex h-16 items-center'>
        {/* insert confirmation modal to go back to the home page */}
        {/* <Button variant='ghost' size='icon' asChild>
          <Link href='/'>
            <ArrowLeft className='size-5' />
          </Link>
        </Button> */}
        <Link href='/'>
          <h1 className='text-xl font-medium'>
            Chip<span className='font-bold'>In</span>
          </h1>
        </Link>
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
        </div>
      </div>
    </header>
  );
};

export { DashboardHeader };
