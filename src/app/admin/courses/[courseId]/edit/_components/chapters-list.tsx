"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "@/app/admin/courses/[courseId]/edit/_components/sortable-item";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileTextIcon,
  GripVerticalIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";

type DndLesson = {
  id: string;
  title: string;
  description: string | null;
  position: number;
};

type DndChapter = {
  id: string;
  title: string;
  position: number;
  isOpen: boolean;
  lessons: DndLesson[];
};

type ChaptersListProps = {
  chapters: DndChapter[];
  toggleChapter: (chapterId: string) => void;
  courseId: string;
  isReordering: boolean;
};

export const ChaptersList = ({
  chapters,
  toggleChapter,
  courseId,
  isReordering,
}: ChaptersListProps) => (
  <SortableContext
    items={chapters}
    strategy={verticalListSortingStrategy}
    disabled={isReordering}
  >
    {chapters.map((chapter) => (
      <SortableItem
        key={chapter.id}
        id={chapter.id}
        data={{
          type: "chapter",
        }}
        className={isReordering ? "opacity-50" : ""}
      >
        {(chapterListeners) => (
          <Card>
            <Collapsible
              open={chapter.isOpen}
              onOpenChange={() => toggleChapter(chapter.id)}
            >
              <div className="flex items-center justify-between p-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    className="cursor-grab"
                    size="icon"
                    {...chapterListeners}
                  >
                    <GripVerticalIcon className="size-4 opacity-60 hover:opacity-100" />
                  </Button>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center"
                      size="icon"
                    >
                      {chapter.isOpen ? (
                        <ChevronDownIcon className="size-4" />
                      ) : (
                        <ChevronRightIcon className="size-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <p className="hover:cursor-pointer hover:text-primary pl-2">
                    {chapter.title}
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <TrashIcon className="size-4" />
                </Button>
              </div>
              <CollapsibleContent>
                <div className="p-1">
                  <SortableContext
                    items={chapter.lessons.map((lesson) => lesson.id)}
                    strategy={verticalListSortingStrategy}
                    disabled={isReordering}
                  >
                    {chapter.lessons.map((lesson) => (
                      <SortableItem
                        key={lesson.id}
                        id={lesson.id}
                        data={{
                          type: "lesson",
                          chapterId: chapter.id,
                        }}
                        className={isReordering ? "opacity-50" : ""}
                      >
                        {(lessonListeners) => (
                          <div className="flex items-center justify-between p-2  rounded-sm">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                className="cursor-grab"
                                size="icon"
                                {...lessonListeners}
                              >
                                <GripVerticalIcon className="size-4" />
                              </Button>
                              <div className="flex items-center gap-2 hover:cursor-pointer hover:text-primary">
                                <FileTextIcon className="size-4" />
                                <Link
                                  href={`/admin/courses/${courseId}/${chapter.id}/${lesson.id}`}
                                >
                                  {lesson.title}
                                </Link>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <TrashIcon className="size-4" />
                            </Button>
                          </div>
                        )}
                      </SortableItem>
                    ))}
                  </SortableContext>
                  <div className="p-2">
                    <Button variant="outline" className="w-full">
                      Create new lesson
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}
      </SortableItem>
    ))}
  </SortableContext>
);
