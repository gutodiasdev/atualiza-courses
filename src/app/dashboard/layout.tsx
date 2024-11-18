"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";

export default function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { getOpenState, settings } = sidebar;

  return (
    <div className="relative w-full min-h-screen bg-black">
      {/* <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/60 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent z-10" /> */}
      <Sidebar />
      <main
        className={cn(
          "min-h-screen bg-black dark:bg-black transition-[margin-left] ease-in-out duration-300",
          !settings.disabled && (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72")
        )}
      >
        {children}
      </main>
    </div>
  );
}