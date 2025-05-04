import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { HowItWorksData } from "@/lib/landing-data";
import Link from "next/link";

interface ItemProps {
  index: number;
  title: string;
  description: string;
}

const HowItWorks = () => {
  return (
    <section
      id='how-it-works'
      className='py-16 md:py-24 bg-muted/50 scroll-mt-4'
    >
      <div className='container mx-auto px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <div className='inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary'>
              How It Works
            </div>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
              Simple Steps to Split Expenses
            </h2>
            <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              Get started with ChipIn in just a few easy steps.
            </p>
          </div>
        </div>
        <div className='mx-auto grid max-w-5xl gap-8 mt-12'>
          <div className='grid gap-8 md:grid-cols-3'>
            {HowItWorksData.slice(0, 3).map((item, index) => (
              <Item
                index={index + 1}
                key={index + 1}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
          <div className='grid gap-8 md:grid-cols-2 md:px-12 lg:px-24'>
            {HowItWorksData.slice(3, 5).map((item, index) => (
              <Item
                index={index + 4}
                key={index + 4}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
        <div className='flex justify-center mt-12'>
          <Link href='/create' className='gap-2'>
            <Button size='lg' className='gap-2'>
              Try It Now <ChevronRight className='h-4 w-4' />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export { HowItWorks };

const Item: React.FC<ItemProps> = ({ index, title, description }) => {
  return (
    <div className='flex flex-col items-center text-center'>
      <div className='flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white text-xl font-bold mb-4'>
        {index}
      </div>
      <h3 className='text-xl font-bold'>{title}</h3>
      <p className='text-muted-foreground mt-2'>{description}</p>
    </div>
  );
};
