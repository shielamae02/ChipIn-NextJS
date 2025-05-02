import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { copyToClipboard } from "@/lib/utils";
import { CreditCard, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Session } from "@/types/session";

interface ShareSessionDialogProps {
  children: React.ReactNode;
  session: Session;
}

const ShareSessionDialog: React.FC<ShareSessionDialogProps> = ({
  children,
  session,
}) => {
  const url = session ? `${process.env.NEXT_PUBLIC_BASE_URL}/join` : "";

  const handleCopy = async () => {
    copyToClipboard(
      session.id,
      "Session ID copied to clipboard!",
      "Failed to copy the Session ID."
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[550px] flex flex-col items-center'>
        <DialogHeader className='flex items-center text-center'>
          <div className='flex items-center gap-2 mb-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
              <CreditCard className='h-5 w-5 text-primary' />
            </div>
          </div>
          <DialogTitle className='text-xl'>{session.name}</DialogTitle>
          <DialogDescription className='text-center text-sm'>
            Want your friends to join this session?
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-2 flex flex-col items-center bg-zinc-100 w-full p-2.5 rounded-md'>
          <p className='text-xs text-center'>
            Share the session ID so they can join you at <br />
            <span className='font-semibold'>{url}.</span>
          </p>
          <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 justify-center items-center space-x-2 w-full'>
            <p className='bg-white p-2.5 text-xs rounded-sm w-full text-center'>
              {session.id}
            </p>
            <Button onClick={handleCopy} className='w-full sm:w-fit'>
              Copy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ShareSessionDialog };
