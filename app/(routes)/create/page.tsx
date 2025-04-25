import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import CreateSession from "@/components/session/create-session";

export const metadata: Metadata = {
  title: "Create Session | ChipIn",
  description:
    "Effortlessly split costs for trips, events, and daily expenses with our easy-to-use web-based tool.",
};

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
      <div className='flex-1 flex items-start mx-auto px-4 md:px-6 w-full justify-center py-8 container'>
        <CreateSession />
      </div>
    </section>
  );
}
