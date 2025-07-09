import { ThemeToggle } from "@/components/theme-toggle";
import { UserDropdown } from "@/components/user-dropdown";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User } from "better-auth";
import Link from "next/link";

type NavbarButtonsProps = {
  isPending: boolean;
  user?: User;
};

export const NavbarButtons = ({ isPending, user }: NavbarButtonsProps) => (
  <div className="flex items-center gap-2">
    <ThemeToggle />
    {isPending ? null : user ? (
      <UserDropdown user={user} />
    ) : (
      <>
        <Link
          href="/login"
          className={cn(
            buttonVariants({
              variant: "ghost",
            }),
            "md:flex hidden"
          )}
        >
          Login
        </Link>
        <Link href="/login" className={buttonVariants({})}>
          Get Started
        </Link>
      </>
    )}
  </div>
);
