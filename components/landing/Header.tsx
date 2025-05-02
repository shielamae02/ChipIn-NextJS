"use client";
import { Button } from "@/components/ui/button";
import { NavData } from "@/lib/landing-data";
import { HandCoins, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ItemProps {
  title: string;
  path: string;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4'>
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
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='p-2 rounded-md hover:bg-muted transition'
          >
            {isMenuOpen ? (
              <X className='w-5 h-5' />
            ) : (
              <Menu className='w-5 h-5' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className='md:hidden p-4space-y-2'>
          {NavData.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className='block text-sm font-medium hover:text-primary transition-colors'
              onClick={() => setIsMenuOpen(false)}
            >
              {item.title}
            </Link>
          ))}
          <Link href='/create'>
            <Button className='w-full mt-2'>Get Started</Button>
          </Link>
        </div>
      )}
    </header>
  );
};

export { Header };

const Item: React.FC<ItemProps> = ({ title, path }) => (
  <a
    href={path}
    className='text-sm font-medium hover:text-primary transition-colors'
  >
    {title}
  </a>
);
