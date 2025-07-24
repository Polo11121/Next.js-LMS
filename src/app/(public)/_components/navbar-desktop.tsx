"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NAVIGATION_ITEMS } from "@/lib/constants";
import { usePathname } from "next/navigation";

export const NavbarDesktop = () => {
  const pathname = usePathname();

  return (
    <NavigationMenu className="h-full *:h-full max-md:hidden">
      <NavigationMenuList className="h-full gap-2">
        {NAVIGATION_ITEMS.map(({ label, href }, index) => (
          <NavigationMenuItem key={index} className="h-full">
            <NavigationMenuLink
              active={pathname === href}
              href={href}
              className="text-muted-foreground hover:text-primary border-b-primary hover:border-b-primary data-[active]:border-b-primary h-full justify-center rounded-none border-y-2 border-transparent py-1.5 font-medium hover:bg-transparent data-[active]:bg-transparent!"
            >
              {label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
