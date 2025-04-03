import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateEventDialog } from "./create-event-dialog";

const EmptyEvents = () => {
  return (
    <Card className='border-dashed'>
      <CardHeader>
        <CardTitle>No Events Yet</CardTitle>
        <CardDescription className='text-sm'>
          Start by adding your first event, like "Dinner" or "Hotel Stay"
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col items-center justify-center py-8'>
        <div className='rounded-full bg-primary/10 p-3 mb-4'>
          <Plus className='h-6 w-6 text-primary' />
        </div>
        <CreateEventDialog>
          {/* disable if participants < 2 */}
          <Button>Add Your First Event</Button>
        </CreateEventDialog>
      </CardContent>
    </Card>
  );
};

export { EmptyEvents };
