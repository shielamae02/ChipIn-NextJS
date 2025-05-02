import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { copyToClipboard } from "@/lib/utils";
import { CreditCard } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface ShareQRCodeDialogProps {
  children: React.ReactNode;
  url: string;
  sessionName: string;
}

const ShareQRCodeDialog: React.FC<ShareQRCodeDialogProps> = ({
  children,
  url,
  sessionName,
}) => {
  const handleCopy = async () => {
    copyToClipboard(
      url,
      "Link copied to clipboard!",
      "Failed to copy the link."
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px] flex flex-col items-center'>
        <DialogHeader className='flex flex-col items-center text-center'>
          <div className='flex items-center gap-2 mb-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
              <CreditCard className='h-5 w-5 text-primary' />
            </div>
          </div>
          <DialogTitle className='text-xl'>{sessionName}</DialogTitle>
          <DialogDescription className='text-center text-sm'>
            Share the QR code, gather your crew, and keep your group spending on
            track!
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col items-center space-y-4 bg-zinc-100 p-4 rounded-md'>
          <QRCodeSVG
            value={url}
            size={200}
            level='H'
            bgColor='#ffffff'
            fgColor='#000000'
          />
        </div>

        <DialogFooter className='pt-2'>
          <button
            onClick={handleCopy}
            className='w-full hover:cursor-pointer hover:bg-zinc-100 p-2 rounded-md flex items-start text-xs text-muted-foreground whitespace-normal break-words text-center'
          >
            {url}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { ShareQRCodeDialog };
