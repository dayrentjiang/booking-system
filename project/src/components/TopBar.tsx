"use client";

import { Menu } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">
      <button className="lg:hidden" onClick={onMenuClick}>
        <Menu size={24} />
      </button>
      <div></div>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <UserButton />
        </div>
      </div>
    </div>
  );
}
