"use client";

import { DollarSign } from "lucide-react";

export default function Loading() {
  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/90 backdrop-blur-sm z-50'>
      <div className='relative'>
        <div className='absolute -inset-1 rounded-full bg-gradient-to-r from-zinc-400 to-gray-400 opacity-75 blur-sm animate-pulse'></div>
        <div className='relative flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-lg'>
          <DollarSign className='h-10 w-10 text-zinc-500 animate-pulse' />
        </div>
      </div>

      <div className='mt-8 space-y-2 text-center'>
        <h3 className='text-xl font-medium'>Loading...</h3>
      </div>

      <div className='mt-8 flex space-x-1'>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className='h-2.5 w-2.5 rounded-full bg-gray-400'
            style={{
              animation: `bounce 1.4s infinite ease-in-out both`,
              animationDelay: `${i * 0.16}s`,
            }}
          ></div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
