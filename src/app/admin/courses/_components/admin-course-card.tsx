import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminCoursesListItem } from "@/data/admin/get-admin-courses";
import { constructUrl } from "@/functions/construct-url";
import {
  ChevronRightIcon,
  EyeIcon,
  MoreVerticalIcon,
  PencilIcon,
  SchoolIcon,
  TimerIcon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type AdminCourseCardProps = {
  course: AdminCoursesListItem;
};

export const AdminCourseCard = ({ course }: AdminCourseCardProps) => (
  <Card className="group relative py-0 gap-0">
    <div className="absolute top-2 right-2 z-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon">
            <MoreVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href={`/admin/courses/${course.id}/edit`}>
              <PencilIcon className="size-4 mr-2" />
              Edit Course
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/admin/courses/${course.slug}`}>
              <EyeIcon className="size-4 mr-2" />
              Preview Course
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/admin/courses/${course.id}/delete`}>
              <TrashIcon className="size-4 mr-2" />
              Delete Course
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <Image
      src={constructUrl(course.fileKey)}
      alt={`${course.title} thumbnail`}
      width={600}
      height={400}
      className="w-full rounded-t-lg aspect-video h-full object-cover"
    />
    <CardContent className="p-4">
      <Link
        href={`/admin/courses/${course.slug}`}
        className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
      >
        {course.title}
      </Link>
      <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
        {course.smallDescription}
      </p>
      <div className="mt-4 flex items-center gap-x-5">
        <div className="flex items-center gap-x-2">
          <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
          <p className="text-sm text-muted-foreground">{course.duration}h</p>
        </div>
        <div className="flex items-center gap-x-2">
          <SchoolIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
          <p className="text-sm text-muted-foreground">{course.level}</p>
        </div>
      </div>
      <Link
        href={`/admin/courses/${course.id}/edit`}
        className={buttonVariants({ className: "mt-4 w-full" })}
      >
        Edit Course
        <ChevronRightIcon className="size-4" />
      </Link>
    </CardContent>
  </Card>
);
