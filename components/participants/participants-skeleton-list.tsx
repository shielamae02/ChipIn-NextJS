import { Skeleton } from "@/components/ui/skeleton";

const ParticipantSkeletonList = () => {
  return (
    <div className='grid gap-2 max-h-64 overflow-y-auto no-scrollbar'>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className='flex items-center justify-between p-3 border rounded-md bg-zinc-50 dark:bg-zinc-900'
        >
          <div className='flex items-center gap-2'>
            <Skeleton className='size-8 rounded-full' />
            <Skeleton className='h-4 w-24' />
          </div>
          <div className='flex gap-2'>
            <Skeleton className='h-6 w-6 rounded-full' />
            <Skeleton className='h-6 w-6 rounded-full' />
          </div>
        </div>
      ))}
    </div>
  );
};

export { ParticipantSkeletonList };
