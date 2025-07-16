"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";


export default function Navbar({children}: {children: ReactNode }) {
  return (
    <nav className="w-full border-b-1 border-primary-[2px] text-primary-foreground flex items-center font-medium">
      <div className="font-sans text-black px-6">
        <h1 className="font-semibold text-[16.5px]">Management App</h1>
      </div>
      { children }
    </nav>
  )
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        "p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground text-[15px]",
        props.href && "bg-background text-foreground"
      )}
    />
  );
}