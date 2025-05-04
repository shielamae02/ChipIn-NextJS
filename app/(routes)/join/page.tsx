import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import JoinSession from "@/components/session/JoinSession";
import { FadeIn } from "@/components/shared/FadeIn";

export default function Page() {
  return (
    <section className='min-h-screen bg-gradient-to-b from-background to-muted flex flex-col'>
      <header className='container mx-auto px-4 sm:px-2 py-10'>
        <Button size='icon' variant='ghost' asChild>
          <Link href='/'>
            <ArrowLeft className='size-5' />
          </Link>
        </Button>
      </header>
      <FadeIn duration={100}>
        <div className='flex-1 flex items-start mx-auto px-4 md:px-6 w-full justify-center py-8 container'>
          <JoinSession />
        </div>
      </FadeIn>
    </section>
  );
}
