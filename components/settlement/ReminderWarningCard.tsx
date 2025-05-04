import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlert } from "lucide-react";

interface Props {
  content: string;
  className?: string;
}

const ReminderWarningCard: React.FC<Props> = ({ content, className }) => {
  return (
    <Alert
      className={`bg-amber-50 w-fit text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800/30 ${className}`}
    >
      <AlertTitle className='flex text-sm items-center'>
        <CircleAlert className='size-3 mr-1' />
        Heads up!
      </AlertTitle>

      <AlertDescription className='text-xs flex'>{content}</AlertDescription>
    </Alert>
  );
};

export { ReminderWarningCard };
