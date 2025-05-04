import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center z-[9999]'>
      <div className='bg-white dark:bg-zinc-900 text-black dark:text-white rounded-lg shadow-xl p-8 flex flex-col items-center justify-center gap-4'>
        <Loader2 className='animate-spin size-14 text-zinc-600' />
        <p className='font-medium text-zinc-600 text-lg'>Loading...</p>
      </div>
    </div>
  );
};

export { Loading };
