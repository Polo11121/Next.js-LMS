import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";

const PublicRootPage = () => (
  <>
    <section className="relative py-20">
      <div className="flex flex-col items-center text-center space-y-8">
        <Badge>The Future of Online Education</Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Elevate your Learning Experience
        </h1>
        <p className="text-muted-foreground max-w-[700px] md:text-xl">
          Discover a new way to learn with our modern, interactive learning
          management system. Access high-quality courses anytime, anywhere.
        </p>
      </div>
    </section>
    <ThemeToggle />
  </>
);

export default PublicRootPage;
