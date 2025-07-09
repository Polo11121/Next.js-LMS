import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NAVIGATION_ITEMS } from "@/lib/constants";

export const NavbarDesktop = () => (
  <NavigationMenu className="h-full *:h-full max-md:hidden">
    <NavigationMenuList className="h-full gap-2">
      {NAVIGATION_ITEMS.map(({ label, href, active }, index) => (
        <NavigationMenuItem key={index} className="h-full">
          <NavigationMenuLink
            active={active}
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
