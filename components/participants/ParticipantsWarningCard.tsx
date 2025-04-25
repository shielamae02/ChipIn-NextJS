import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlert } from "lucide-react";

const ParticipantsWarningCard = () => {
  return (
    <Alert className='mb-4 bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800/30'>
      <AlertTitle className='flex text-sm items-center'>
        <CircleAlert className='size-3 mr-1' />
        Heads up!
      </AlertTitle>

      <AlertDescription className='text-xs'>
        You need at least 2 participants to start adding events and expenses.
      </AlertDescription>
    </Alert>
  );
};

export { ParticipantsWarningCard };
