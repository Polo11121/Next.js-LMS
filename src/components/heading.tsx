import { BackButton } from "@/components/back-button";
import { cn } from "@/lib/utils";

type HeadingProps = {
  text: string;
  href: string;
  underlineText: string;
  noMargin?: boolean;
};

export const Heading = ({
  text,
  href,
  underlineText,
  noMargin = false,
}: HeadingProps) => (
  <div
    className={cn(
      "flex items-center gap-2",
      noMargin ? "mb-0" : "mb-4 md:mb-6"
    )}
  >
    <BackButton href={href} />
    <h1 className="text-2xl md:text-3xl font-bold">
      {text} <span className="text-primary underline">{underlineText}</span>
    </h1>
  </div>
);
