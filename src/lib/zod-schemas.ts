import { z } from "zod";
import {
  CourseCategory,
  CourseLevel,
  CourseStatus,
} from "@/lib/generated/prisma";

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, "Course title must be at least 3 characters long")
    .max(100, "Course title cannot exceed 100 characters"),
  description: z
    .string()
    .min(3, "Course description must be at least 3 characters long")
    .max(2000, "Course description cannot exceed 2000 characters"),
  fileKey: z
    .string()
    .min(3, "File key must be at least 3 characters long")
    .max(100, "File key cannot exceed 100 characters"),
  price: z.coerce.number().min(1, "Course price must be at least $1"),
  duration: z.coerce
    .number()
    .min(1, "Course duration must be at least 1 minute")
    .max(500, "Course duration cannot exceed 500 minutes"),
  level: z.nativeEnum(CourseLevel, {
    errorMap: () => ({ message: "Please select a valid course level" }),
  }),
  category: z.nativeEnum(CourseCategory, {
    errorMap: () => ({ message: "Please select a valid course category" }),
  }),
  smallDescription: z
    .string()
    .min(3, "Short description must be at least 3 characters long")
    .max(200, "Short description cannot exceed 200 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters long")
    .max(100, "Slug cannot exceed 100 characters"),
  status: z.nativeEnum(CourseStatus, {
    errorMap: () => ({ message: "Please select a valid course status" }),
  }),
});

export const chapterSchema = z.object({
  name: z.string().min(3, "Chapter name must be at least 3 characters long"),
  courseId: z.string().uuid({
    message: "Invalid course ID",
  }),
});

export const lessonSchema = z.object({
  name: z.string().min(3, "Lesson name must be at least 3 characters long"),
  courseId: z.string().uuid({
    message: "Invalid course ID",
  }),
  chapterId: z.string().uuid({
    message: "Invalid chapter ID",
  }),
  description: z
    .string()
    .min(3, "Lesson description must be at least 3 characters long")
    .max(2000, "Lesson description cannot exceed 2000 characters")
    .optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
});

export type CourseSchema = z.infer<typeof courseSchema>;
export type ChapterSchema = z.infer<typeof chapterSchema>;
export type LessonSchema = z.infer<typeof lessonSchema>;
