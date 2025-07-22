import { ReactNode } from "react";
import { BanIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

type EmptyStateWrapperProps<T> = {
  data: T[];
  children: ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
};

export const EmptyStateWrapper = <T,>({
  data,
  children,
  title,
  description,
  buttonText,
  buttonHref,
}: EmptyStateWrapperProps<T>) =>
  data.length === 0 ? (
    <div className="flex flex-col flex-1 h-full items-center justify-center rounded-md border-dashed border p-8 text-center animate-in fade-in-50">
      <div className="flex  size-20 items-center justify-center rounded-full bg-primary/10">
        <BanIcon className="size-10 text-primary" />
      </div>
      <h2 className="mt-2 text-xl font-semibold">{title}</h2>
      <p className="mt-2 mb-8 text-center text-sm leading-tight text-muted-foreground">
        {description}
      </p>
      <Link href={buttonHref} className={buttonVariants()}>
        {buttonText}
      </Link>
    </div>
  ) : (
    children
  );
