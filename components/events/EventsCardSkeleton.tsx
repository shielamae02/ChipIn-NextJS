import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const EventCardSkeleton = () => {
  return (
    <Card className='overflow-hidden transition-all hover:shadow-md'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-8 w-8 rounded-full' />
            <Skeleton className='h-5 w-32' />
          </div>
          <Skeleton className='h-6 w-16 rounded-full' />
        </div>
        <CardDescription className='flex items-center gap-2 mt-2'>
          <Skeleton className='h-3 w-3 rounded-full' />
          <Skeleton className='h-4 w-20' />
        </CardDescription>
      </CardHeader>

      <CardContent className='p-5'>
        <div className='flex flex-col items-center justify-center py-8 text-center'>
          <Skeleton className='h-10 w-10 rounded-full mb-3' />
          <Skeleton className='h-4 w-32' />
        </div>
      </CardContent>

      <CardFooter>
        <Skeleton className='h-10 w-full rounded-md' />
      </CardFooter>
    </Card>
  );
};

export { EventCardSkeleton };
