"use client";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/store/sessionStore";
import { ArrowLeft, Copy, ScanQrCode, Share2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ShareQRCodeDialog } from "./share-qrcode-dialog";
import { ShareSessionDialog } from "./share-session-dialog";
import { Skeleton } from "../ui/skeleton";

const DashboardHeader = () => {
  const session = useSessionStore((state) => state.session);

  const url = `www.linkedin.com/in/shiela-mae-lepon`;
  const sessionId = session?.id ?? "";
  //   const url = `${process.env.NEXT_PUBLIC_BASE_URL}/session/${session.id}`;

  if (!session) {
    return (
      <header className='sticky top-0 z-10  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container mx-auto px-4 sm:px-2 py-8 flex h-16 items-center justify-between'>
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
      <div className='container mx-auto px-4 sm:px-2 py-8 flex h-16 items-center'>
        {/* insert confirmation modal to go back to the home page */}
        {/* <Button variant='ghost' size='icon' asChild>
          <Link href='/'>
            <ArrowLeft className='size-5' />
          </Link>
        </Button> */}
        <h1 className='text-xl font-medium'>
          Chip<span className='font-bold'>In</span>
        </h1>
        <div className='ml-auto flex gap-2'>
          <ShareQRCodeDialog url={url}>
            <Button variant='outline' size='sm' onClick={() => {}}>
              <ScanQrCode className='mr-0 sm:mr-1 size-4' />
              <p className='hidden sm:block'>Show QR Code</p>
            </Button>
          </ShareQRCodeDialog>
          <ShareSessionDialog sessionId={sessionId}>
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
