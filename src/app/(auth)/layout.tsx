import { PropsWithChildren } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Logo from "@/../public/logo.png";
import Link from "next/link";
import Image from "next/image";

const AuthLayout = async ({ children }: PropsWithChildren) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center">
      <Link
        href="-"
        className={buttonVariants({
          variant: "outline",
          className: "absolute top-4 left-4",
        })}
      >
        <ArrowLeftIcon className="size-4" />
        Back
      </Link>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Image src={Logo} alt="Logo" width={48} height={48} />
          Michael.LMS
        </Link>
        {children}
        <div className="text-center text-balance text-xs text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <span className="hover:text-primary underline cursor-pointer">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="hover:text-primary underline cursor-pointer">
            Privacy Policy
          </span>
          .
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
