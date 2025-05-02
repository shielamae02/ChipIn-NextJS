import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section
      id='hero'
      className='py-38 md:py-38 bg-gradient-to-b from-background to-muted/100 '
    >
      <div className='absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]' />
      <div className='container px-4 md:px-6 mx-auto flex space-x-10'>
        <div className='flex flex-col lg:flex-row w-full xl:px-24'>
          <div className='flex flex-col justify-center items-center space-y-6 w-full'>
            <div className='space-y-6 flex flex-col items-center text-center'>
              <h1 className='text-4xl font-bold sm:text-5xl xl:text-6xl/none'>
                Split Expenses Effortlessly <br />
                with ChipIn
              </h1>
              <p className='max-w-3xl text-sm text-muted-foreground md:text-xl'>
                The web-based expense splitter that makes managing shared costs
                simple for trips, events, or everyday household expenses.
              </p>
            </div>
            <div className='flex flex-col gap-2 sm:flex-row'>
              <Link href='/create'>
                <Button size='lg' className='gap-1'>
                  Create a Session <ArrowRight className='size-4' />
                </Button>
              </Link>
              <Link href='/join'>
                <Button size='lg' variant='outline' className='px-10'>
                  Join a Session
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
