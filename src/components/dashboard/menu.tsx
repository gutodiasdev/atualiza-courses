"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { getMenuList } from "@/lib/menu-list";
import { Button } from "@/components/ui/button";
import { CollapseMenuButton } from "@/components/dashboard/collapse-menu-button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip";
import { signOut } from "@/lib/auth/session";
import { useUser } from "@/lib/auth";

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const menuList = getMenuList();

  return (
    <nav className="absolute left-0 top-0 bottom-0 w-[90px] flex flex-col items-center justify-center gap-8 z-20">
      <ul>
        {menuList
          .filter((list) => list.roles.some((role) => user?.roles.includes(role)))
          .map(({ groupLabel, menus }, index) => (
            <li key={index}>
              {menus.map(
                ({ href, label, icon: Icon, active, submenus }, index) =>
                  !submenus || submenus.length === 0 ? (
                    <div className="w-full space-y-8" key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={
                                (active === undefined &&
                                  pathname.startsWith(href)) ||
                                  active
                                  ? "secondary"
                                  : "ghost"
                              }
                              size="icon"
                              className="text-gray-300 hover:text-white transition-colors mb-4"
                              asChild
                            >
                              <Link href={href}>
                                <span
                                  className={cn(isOpen === false ? "" : "mr-4")}
                                >
                                  <Icon size={32} />
                                </span>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="w-full" key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={
                          active === undefined
                            ? pathname.startsWith(href)
                            : active
                        }
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  )
              )}
            </li>
          ))}
        <li className="w-full flex items-end">
          <TooltipProvider disableHoverableContent>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  onClick={signOut}
                  variant="ghost"
                  className="w-full justify-center h-10 mt-5"
                  size="icon"
                >
                  <span className={cn(isOpen === false ? "" : "mr-4")}>
                    <LogOut size={18} />
                  </span>
                  <p
                    className={cn(
                      "whitespace-nowrap",
                      isOpen === false ? "opacity-0 hidden" : "opacity-100"
                    )}
                  >
                    Sair
                  </p>
                </Button>
              </TooltipTrigger>
              {isOpen === false && (
                <TooltipContent side="right">Sign out</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </li>
      </ul>
    </nav>
  );
}