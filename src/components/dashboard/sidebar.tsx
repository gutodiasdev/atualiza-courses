"use client";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { Menu } from "./menu";

export function Sidebar() {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { getOpenState } = sidebar;

  return (
    <nav className="absolute left-0 top-0 bottom-0 w-16 flex flex-col items-center justify-center gap-8 z-20">
      <Menu isOpen={getOpenState()} />
    </nav>
  );
}