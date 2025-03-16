import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="py-38 md:py-28 bg-gradient-to-b from-background to-muted/50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col lg:flex-row w-full xl:px-24">
          <div className="flex flex-col justify-center space-y-4 w-full">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Split Expenses Effortlessly with ChipIn
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                The web-based expense splitter that makes managing shared costs
                simple for trips, events, or everyday household expenses.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="gap-1">
                Start Splitting <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <Image
              src="/placeholder.svg?height=550&width=450"
              alt="ChipIn App Screenshot"
              className="rounded-lg border shadow-xl object-cover"
              width={500}
              height={500}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
