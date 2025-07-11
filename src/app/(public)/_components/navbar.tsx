"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/../public/logo.png";
import { authClient } from "@/lib/auth-client";
import { NavbarMobile } from "@/app/(public)/_components/navbar-mobile";
import { NavbarDesktop } from "@/app/(public)/_components/navbar-desktop";
import { NavbarButtons } from "@/app/(public)/_components/navbar-buttons";

export const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="border-b px-4 md:px-6 sticky top-0 z-50 bg-background">
      <div className="flex h-16 justify-between gap-4">
        <div className="flex gap-2">
          <NavbarMobile />
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-primary hover:text-primary/90 flex items-center gap-2"
            >
              <Image src={logo} alt="Logo" className="size-9" />
              <span className="font-bold">Michael.LMS</span>
            </Link>
            <NavbarDesktop />
          </div>
        </div>
        <NavbarButtons isPending={isPending} user={session?.user} />
      </div>
    </header>
  );
};
