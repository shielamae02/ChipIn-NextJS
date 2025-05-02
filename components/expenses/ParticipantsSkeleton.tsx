import { Skeleton } from "@/components/ui/skeleton";

const ParticipantsSkeleton = () => {
  return (
    <div className='flex flex-col gap-2'>
      {Array.from({ length: 3 }).map((_, idx) => (
        <div
          key={`skeleton-paid-${idx}`}
          className='flex items-center space-x-2'
        >
          <Skeleton className='size-5 rounded' />
          <Skeleton className='h-5 flex-1 rounded' />
        </div>
      ))}
    </div>
  );
};

export { ParticipantsSkeleton };
