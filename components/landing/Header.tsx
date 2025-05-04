"use client";
import { Button } from "@/components/ui/button";
import { NavData } from "@/lib/landing-data";
import { HandCoins, Menu } from "lucide-react";
import Link from "next/link";
import { MobileHeader } from "./MobileHeader";

interface ItemProps {
  title: string;
  path: string;
  onClick?: () => void;
}

const Header = () => {
  return (
    <header className='sticky top-0 z-50 w-full md:border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4'>
      <div className=' flex h-16 items-center justify-between mx-auto max-w-6xl'>
        {/* Logo */}
        <div className='flex items-center gap-2 font-bold text-xl'>
          <HandCoins />
          <Link href='/' className='text-primary'>
            ChipIn
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className='hidden md:flex gap-8'>
          {NavData.map((item, index) => (
            <Item key={index} title={item.title} path={item.path} />
          ))}
        </nav>

        {/* Desktop Button */}
        <div className='items-center gap-4 hidden md:flex'>
          <Link href='/create'>
            <Button>Get Started</Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className='md:hidden'>
          <MobileHeader>
            <button className='p-2 rounded-md hover:bg-muted transition'>
              <Menu className='size-5' />
            </button>
          </MobileHeader>
        </div>
      </div>
    </header>
  );
};

export { Header };

export const Item: React.FC<ItemProps> = ({ title, path, onClick }) => (
  <a
    href={path}
    onClick={onClick}
    className='text-sm font-medium text-zinc-600 hover:text-primary transition-colors'
  >
    {title}
  </a>
);
