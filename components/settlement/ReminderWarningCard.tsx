import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlert } from "lucide-react";

const ReminderWarningCard = () => {
  return (
    <Alert className='w-fit bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800/30'>
      <AlertTitle className='flex text-sm items-center'>
        <CircleAlert className='size-3 mr-1' />
        Heads up!
      </AlertTitle>

      <AlertDescription className='text-xs flex'>
        This session lasts one day—don’t forget to download your expenses data
        before it’s gone!
      </AlertDescription>
    </Alert>
  );
};

export { ReminderWarningCard };
