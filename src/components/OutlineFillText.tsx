"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function OutlineFillText({ text, className }: { text: string, className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current || !fillRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        fillRef.current,
        { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
        {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 30%",
            scrub: 0.5,
          }
        }
      );
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={cn("relative inline-block font-bold", className)}>
      <span className="text-stroke opacity-30">{text}</span>
      <span 
        ref={fillRef} 
        className="absolute top-0 left-0 text-white w-full h-full whitespace-nowrap overflow-hidden"
        style={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
        aria-hidden="true"
      >
        {text}
      </span>
    </div>
  );
}
