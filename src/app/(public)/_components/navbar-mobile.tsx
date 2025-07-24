"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NAVIGATION_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export const NavbarMobile = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center md:hidden">
      <Popover>
        <PopoverTrigger asChild>
          <Button className="group size-8" variant="ghost" size="icon">
            <MenuIcon className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-36 p-1 md:hidden">
          <NavigationMenu className="max-w-none *:w-full">
            <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
              {NAVIGATION_ITEMS.map(({ label, href }, index) => (
                <NavigationMenuItem key={index} className="w-full">
                  <NavigationMenuLink
                    href={href}
                    className={cn(
                      "py-1.5",
                      pathname === href && "bg-primary text-primary-foreground"
                    )}
                    active={pathname === href}
                  >
                    {label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </PopoverContent>
      </Popover>
    </div>
  );
};
