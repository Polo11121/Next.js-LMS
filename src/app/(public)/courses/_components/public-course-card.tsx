import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicCoursesListItem } from "@/data/public/get-public-courses";
import { constructUrl } from "@/functions/construct-url";
import { replaceUnderscore } from "@/functions/replace-underscore";
import { SchoolIcon, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type PublicCourseCardProps = {
  course: PublicCoursesListItem;
};

export const PublicCourseCard = ({ course }: PublicCourseCardProps) => (
  <Card className="group relative py-0 gap-0">
    <Badge className="absolute top-2 right-2 z-10">{course.level}</Badge>
    <Image
      src={constructUrl(course.fileKey)}
      alt={course.title}
      width={600}
      height={400}
      className="w-full rounded-t-lg aspect-video object-cover"
    />
    <CardContent className="p-4">
      <Link
        href={`/courses/${course.slug}`}
        className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
      >
        {course.title}
      </Link>
      <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
        {course.smallDescription}
      </p>
      <div className="mt-4 flex items-center gap-x-2">
        <div className="flex items-center gap-x-2">
          <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
          <p className="text-sm text-muted-foreground">{course.duration}h</p>
        </div>
        <div className="flex items-center gap-x-2">
          <SchoolIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
          <p className="text-sm text-muted-foreground">
            {replaceUnderscore(course.category)}
          </p>
        </div>
      </div>
      <Link
        href={`/courses/${course.slug}`}
        className={buttonVariants({
          className: "w-full mt-4",
        })}
      >
        Learn More
      </Link>
    </CardContent>
  </Card>
);
