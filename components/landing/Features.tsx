import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideProps } from "lucide-react";
import { FeaturesData } from "@/lib/landing-data";
import { ForwardRefExoticComponent } from "react";

interface FeatureCardProps {
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  title: string;
  description: string;
}

const Features = () => {
  return (
    <section id='features' className='py-16 md:py-24 bg-background scroll-mt-4'>
      <div className='container mx-auto px-4 md:px-6 '>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <div className='inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary'>
              Features
            </div>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
              Why Choose ChipIn?
            </h2>
            <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              ChipIn makes expense splitting simple, fair, and stress-free with
              these powerful features.
            </p>
          </div>
        </div>
        <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12'>
          {FeaturesData.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { Features };

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <Card className='border-none shadow-md hover:shadow-lg transition-shadow'>
      <CardHeader className='pb-2'>
        <div className='rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4'>
          <Icon className='h-6 w-6 text-primary' />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className='text-base'>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};
