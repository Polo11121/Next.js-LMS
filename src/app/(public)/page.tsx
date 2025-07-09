import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import {
  GamepadIcon,
  BarChart3Icon,
  Users2Icon,
  LucideIcon,
  BookOpenIcon,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

type Feature = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

const FEATURES: Feature[] = [
  {
    title: "Comprehensive Courses",
    description:
      "Access a wide range of carefully curated courses designed by industry experts.",
    Icon: BookOpenIcon,
  },
  {
    title: "Interactive Learning",
    description:
      "Engage with interactive content, quizzes, and assignments to enhance your learning experience.",
    Icon: GamepadIcon,
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your progress and achievements with detailed analytics and personalized dashboards.",
    Icon: BarChart3Icon,
  },
  {
    title: "Community Support",
    description:
      "Join a vibrant community of learners and instructors to collaborate and share knowledge.",
    Icon: Users2Icon,
  },
];

const PublicRootPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant="outline">The Future of Online Education</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Elevate your Learning Experience
          </h1>
          <p className="text-muted-foreground max-w-[700px] md:text-xl">
            Discover a new way to learn with our modern, interactive learning
            management system. Access high-quality courses anytime, anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/courses"
              className={buttonVariants({
                size: "lg",
              })}
            >
              Explore Courses
            </Link>
            {!session && (
              <Link
                href="/login"
                className={buttonVariants({
                  size: "lg",
                  variant: "outline",
                })}
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
        {FEATURES.map(({ title, description, Icon }) => (
          <Card key={title}>
            <CardHeader>
              <Icon className="w-10 h-10 mb-4" />
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
};

export default PublicRootPage;
