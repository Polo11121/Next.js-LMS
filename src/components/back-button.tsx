import { ArrowLeftIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

type BackButtonProps = {
  href: string;
};

export const BackButton = ({ href }: BackButtonProps) => (
  <Link
    href={href}
    className={buttonVariants({ variant: "outline", size: "icon" })}
  >
    <ArrowLeftIcon className="size-4" />
  </Link>
);
