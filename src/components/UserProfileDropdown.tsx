"use client";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Image from "next/image";

export default function UserProfileDropdown({ user }: { user: { name: string; email: string; image?: string } }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-3 py-2">
          {user.image ? (
            <Image src={user.image} alt="Profile" width={32} height={32} className="rounded-full" />
          ) : (
            <User className="w-6 h-6" />
          )}
          <span className="hidden md:inline text-sm font-medium">{user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-3 py-2 border-b">
          <div className="font-semibold text-sm">{user.name}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </div>
        <DropdownMenuItem asChild>
          <a href="/profile" className="text-sm">Profile</a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/settings" className="text-sm">Settings</a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/logout" className="text-sm text-destructive">Logout</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
