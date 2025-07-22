"use client";

import { useEffect, useState } from "react";
import { AdminCourse } from "@/data/admin/get-admin-course";
import {
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { toast } from "sonner";
import {
  reorderChapters,
  reorderLessons,
} from "@/app/admin/courses/[courseId]/edit/actions";

export const useChaptersDnd = (course: AdminCourse) => {
  const [isReordering, setIsReordering] = useState(false);
  const initialItems = course.chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    position: chapter.position,
    isOpen: true,
    lessons:
      chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        position: lesson.position,
      })) || [],
  }));
  const [items, setItems] = useState(initialItems);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    const activeType = active.data.current?.type as "chapter" | "lesson";
    const overType = over.data.current?.type as "chapter" | "lesson";

    if (activeType === "chapter") {
      let targetChapterId = null;

      if (overType === "chapter") {
        targetChapterId = overId;
      } else if (overType === "lesson") {
        targetChapterId = over.data.current?.chapterId ?? null;
      }

      if (!targetChapterId) {
        toast.error("Failed to move chapter");
        return;
      }

      const oldChapterIndex = items.findIndex((item) => item.id === activeId);
      const newChapterIndex = items.findIndex(
        (item) => item.id === targetChapterId
      );

      if (oldChapterIndex === -1 || newChapterIndex === -1) {
        toast.error("Failed to move chapter");
        return;
      }

      const reorderedChapters = arrayMove(
        items,
        oldChapterIndex,
        newChapterIndex
      );

      const updatedChaptersForState = reorderedChapters.map((item, index) => ({
        ...item,
        position: index + 1,
      }));

      const previousItems = [...items];

      setItems(updatedChaptersForState);

      if (course.id) {
        const chapterToUpdate = updatedChaptersForState.map((chapter) => ({
          id: chapter.id,
          position: chapter.position,
        }));

        setIsReordering(true);

        toast.promise(reorderChapters(chapterToUpdate, course.id), {
          loading: "Reordering chapters...",
          success: (result) => {
            if (result.status === "success") {
              return "Chapters reordered successfully";
            }
            throw new Error(result.message);
          },
          error: (error: Error) => {
            setItems(previousItems);
            return error.message;
          },
          finally: () => {
            setIsReordering(false);
          },
        });
      }
      return;
    }

    if (activeType === "lesson" && overType === "lesson") {
      const chapterId = active.data.current?.chapterId;
      const overChapterId = over.data.current?.chapterId;

      if (!chapterId || chapterId !== overChapterId) {
        toast.error("You can only move lessons within the same chapter");
        return;
      }

      const chapterIndex = items.findIndex(
        (chapter) => chapter.id === chapterId
      );

      if (chapterIndex === -1) {
        toast.error("Failed to move lesson");
        return;
      }

      const chapterToUpdate = items[chapterIndex];

      const oldLessonIndex = chapterToUpdate.lessons.findIndex(
        (lesson) => lesson.id === activeId
      );
      const newLessonIndex = chapterToUpdate.lessons.findIndex(
        (lesson) => lesson.id === overId
      );

      if (oldLessonIndex === -1 || newLessonIndex === -1) {
        toast.error("Failed to move lesson");
        return;
      }

      const reorderedLessons = arrayMove(
        chapterToUpdate.lessons,
        oldLessonIndex,
        newLessonIndex
      );

      const updatedLessonsForState = reorderedLessons.map((lesson, index) => ({
        ...lesson,
        position: index + 1,
      }));

      const newItems = items.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              lessons: updatedLessonsForState,
            }
          : chapter
      );

      const previousItems = [...items];

      setItems(newItems);

      if (course.id) {
        const lessonToUpdate = updatedLessonsForState.map((lesson) => ({
          id: lesson.id,
          position: lesson.position,
        }));

        setIsReordering(true);

        toast.promise(reorderLessons(lessonToUpdate, chapterId, course.id), {
          loading: "Reordering lessons...",
          success: (result) => {
            if (result.status === "success") {
              return "Lessons reordered successfully";
            }
            throw new Error(result.message);
          },
          error: (error: Error) => {
            setItems(previousItems);
            return error.message;
          },
          finally: () => {
            setIsReordering(false);
          },
        });
      }
      return;
    }
  };

  const toggleChapter = (chapterId: string) =>
    setItems((items) =>
      items.map((item) => ({
        ...item,
        isOpen: item.id === chapterId ? !item.isOpen : item.isOpen,
      }))
    );

  useEffect(() => {
    setItems((prevItems) => {
      const updatedItems =
        course.chapters.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          position: chapter.position,
          isOpen:
            prevItems.find((item) => item.id === chapter.id)?.isOpen ?? true,
          lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            position: lesson.position,
          })),
        })) || [];
      return updatedItems;
    });
  }, [course]);

  return {
    items,
    sensors,
    handleDragEnd,
    toggleChapter,
    isReordering,
  };
};
