"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavData } from "@/lib/landing-data";
import { HandCoins } from "lucide-react";
import Link from "next/link";
import { Item } from "./Header";
import { Button } from "../ui/button";
import { useState } from "react";

const MobileHeader = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <div className='flex items-center gap-2 font-bold text-xl'>
              <HandCoins />
              <Link href='/' className='text-primary'>
                ChipIn
              </Link>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className='flex flex-col px-4 gap-4'>
          {NavData.map((item, index) => (
            <Item
              key={index}
              title={item.title}
              path={item.path}
              onClick={handleClose}
            />
          ))}
          <Link href='/create' className='w-full' onClick={handleClose}>
            <Button className='w-full mt-2'>Get Started</Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { MobileHeader };
