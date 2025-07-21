"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DraggableSyntheticListeners } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SortableItemProps = {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => ReactNode;
  className?: string;
  data?: { type: "chapter" | "lesson"; chapterId?: string };
};

export const SortableItem = ({
  id,
  children,
  className,
  data,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn("touch-none", className, isDragging && "z-10")}
    >
      {children(listeners)}
    </div>
  );
};
