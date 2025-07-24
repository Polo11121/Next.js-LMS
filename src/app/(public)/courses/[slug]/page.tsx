import { RenderJson } from "@/components/render-json";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPublicCourse } from "@/data/public/get-public-course";
import { constructUrl } from "@/functions/construct-url";
import { replaceUnderscore } from "@/functions/replace-underscore";
import { IconCategory, IconChartBar, IconClock } from "@tabler/icons-react";
import { ChaptersList } from "@/app/(public)/courses/_components/chapters-list";
import { EnrollmentCard } from "@/app/(public)/courses/_components/enrollment-card";
import Image from "next/image";

type PublicCoursePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PublicCoursePage({
  params,
}: PublicCoursePageProps) {
  const { slug } = await params;
  const course = await getPublicCourse(slug);

  const lessons = course.chapters.reduce(
    (acc, chapter) => acc + chapter.lessons.length,
    0
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-5">
      <div className="order-1 lg:col-span-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
          <Image
            src={constructUrl(course.fileKey)}
            alt={course.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              {course.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2">
              {course.smallDescription}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconChartBar className="size-4" />
              {course.level}
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconCategory className="size-4" />
              {replaceUnderscore(course.category)}
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconClock className="size-4" />
              {course.duration} hours
            </Badge>
          </div>
          <Separator className="my-8" />
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight">
              Course Description
            </h2>
            <RenderJson jsonContent={JSON.parse(course.description)} />
          </div>
        </div>
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold tracking-tight">
              Course Content
            </h2>
            <div>
              {course.chapters.length} chapters |{" "}
              {course.chapters.reduce(
                (acc, chapter) => acc + chapter.lessons.length,
                0
              )}
              lessons
            </div>
          </div>
          <ChaptersList chapters={course.chapters} />
        </div>
      </div>
      <EnrollmentCard
        price={course.price}
        duration={course.duration}
        level={course.level}
        category={course.category}
        lessons={lessons}
      />
    </div>
  );
}
