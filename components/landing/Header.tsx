"use client";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { NavData } from "@/lib/landing-data";
import { HandCoins } from "lucide-react";

interface ItemProps {
  title: string;
  path: string;
}

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className=" flex h-16 items-center justify-between mx-auto container">
        <div className="flex items-center gap-2 font-bold text-xl">
          <HandCoins />
          <a href="/" className="text-primary">
            ChipIn
          </a>
        </div>
        <nav className="hidden md:flex gap-8">
          {NavData.map((item, index) => (
            <Item key={index} title={item.title} path={item.path} />
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Button>Get Started</Button>
        </div>
      </div>
    </header>
  );
};

export { Header };

const Item: React.FC<ItemProps> = memo(({ title, path }) => (
  <a
    href={path}
    className="text-sm font-medium hover:text-primary transition-colors"
  >
    {title}
  </a>
));
