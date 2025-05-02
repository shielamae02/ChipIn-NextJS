import { Card, CardContent } from "@/components/ui/card";
import { TestimonialsData } from "@/lib/landing-data";
import { Star } from "lucide-react";
import Image from "next/image";

interface TestimonialsProps {
  name: string;
  position: string;
  testimony: string;
}

const Testimonials = () => {
  return (
    <section id='testimonials' className='py-16 md:py-24 bg-background'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <div className='inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary'>
              Testimonials
            </div>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
              What Our Users Say
            </h2>
            <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              Don&pos;t just take our word for it. Here&pos;s what people love
              about ChipIn.
            </p>
          </div>
        </div>
        <div className='mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12'>
          {TestimonialsData.map((testimony, index) => (
            <TestimonialCard
              key={index}
              name={testimony.name}
              position={testimony.position}
              testimony={testimony.testimony}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { Testimonials };

const TestimonialCard: React.FC<TestimonialsProps> = ({
  name,
  position,
  testimony,
}) => {
  return (
    <Card className='border-none shadow-md'>
      <CardContent className='pt-6'>
        <div className='flex items-start gap-4'>
          <div className='rounded-full flex items-center justify-center overflow-hidden w-12 h-12 border'>
            <Image
              src={`https://api.dicebear.com/9.x/big-ears/png?seed=lemon`}
              alt='User Avatar'
              width={80}
              height={80}
              className='size-6 rounded-full'
            />
          </div>
          <div>
            <p className='font-medium'>{name}</p>
            <p className='text-sm text-muted-foreground'>{position}</p>
          </div>
        </div>
        <div className='mt-4 flex'>
          {[...Array(5)].map((_, i) => (
            <Star key={i} className='h-5 w-5 text-yellow-300 fill-yellow-300' />
          ))}
        </div>
        <p className='mt-4 text-muted-foreground'>{testimony}</p>
      </CardContent>
    </Card>
  );
};
