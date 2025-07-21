"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DndContext, rectIntersection } from "@dnd-kit/core";
import { AdminCourse } from "@/data/admin/get-admin-course";
import { ChaptersList } from "@/app/admin/courses/[courseId]/edit/_components/chapters-list";
import { useChaptersDnd } from "@/app/admin/courses/[courseId]/edit/hooks/use-chapters-dnd";

type CourseStructureProps = {
  course: AdminCourse;
};

export const CourseStructure = ({ course }: CourseStructureProps) => {
  const { items, sensors, handleDragEnd, toggleChapter, isReordering } =
    useChaptersDnd(course);

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border">
          <CardTitle>Chapters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <ChaptersList
            chapters={items}
            toggleChapter={toggleChapter}
            courseId={course.id}
            isReordering={isReordering}
          />
        </CardContent>
      </Card>
    </DndContext>
  );
};
