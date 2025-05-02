import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className='py-38 md:py-28 bg-gradient-to-b from-background to-muted/50'>
      <div className='container px-4 md:px-6 mx-auto flex space-x-10'>
        <div className='flex flex-col lg:flex-row w-full xl:px-24'>
          <div className='flex flex-col justify-center items-center space-y-6 w-full'>
            <div className='space-y-8 flex flex-col items-center text-center'>
              <h1 className='text-5xl font-bold sm:text-5xl xl:text-6xl/none'>
                Split Expenses Effortlessly <br />
                with ChipIn
              </h1>
              <p className='max-w-3xl text-muted-foreground md:text-xl'>
                The web-based expense splitter that makes managing shared costs
                simple for trips, events, or everyday household expenses.
              </p>
            </div>
            <div className='flex flex-col gap-2 min-[400px]:flex-row'>
              <Link href='/create'>
                <Button size='lg' className='gap-1'>
                  Create a Session <ArrowRight className='h-4 w-4' />
                </Button>
              </Link>
              <Link href='/join'>
                <Button size='lg' variant='outline'>
                  Join a Session
                </Button>
              </Link>
            </div>
          </div>
          {/* <div className='hidden lg:block ml-3'>
            <Image
              src='/placeholder.svg?height=550&width=450'
              alt='ChipIn App Screenshot'
              className='rounded-lg border shadow-xl object-cover'
              width={500}
              height={500}
            />
          </div> */}
        </div>
      </div>
    </section>
  );
};

export { Hero };
