"use client";
import clsx from "clsx";
import { ReactNode, useState, useRef, useEffect } from "react";

interface FadeInProps {
  children: ReactNode;
  duration: number;
  className?: string;
}

const FadeIn = ({ children, duration = 0, className }: FadeInProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentElement = elementRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, duration);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [duration]);

  return (
    <div
      ref={elementRef}
      className={clsx(
        "transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-0",
        className
      )}
    >
      {children}
    </div>
  );
};

export { FadeIn };
