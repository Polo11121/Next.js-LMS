import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronsUpDown } from "lucide-react";
import { IconPlayerPlay } from "@tabler/icons-react";
import { Chapter, Lesson } from "@/lib/generated/prisma";

type ChaptersListProps = {
  chapters: (Pick<Chapter, "id" | "title"> & {
    lessons: Pick<Lesson, "id" | "title">[];
  })[];
};

export const ChaptersList = ({ chapters }: ChaptersListProps) => (
  <div className="space-y-4">
    {chapters.map((chapter, index) => (
      <Collapsible key={chapter.id} defaultOpen={index === 0}>
        <Card className="p-0 overflow-hidden border-2 transition-all duration-200 hover:shadow-md gap-0">
          <CollapsibleTrigger>
            <div>
              <CardContent className="p-6 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <p className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {index + 1}
                    </p>
                    <div>
                      <h3 className="text-xl font-semibold text-left">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 text-left">
                        {chapter.lessons.length} lesson
                        {!!chapter.lessons.length && "s"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {chapter.lessons.length} lesson
                      {!!chapter.lessons.length && "s"}
                    </Badge>
                    <ChevronsUpDown className="size-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="border-t bg-muted/20">
              <div className="space-y-4">
                <div className="p-6 pt-4 space-y-3">
                  {chapter.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-4 rounded-lg p-3 hover:bg-accent transition-colors group"
                    >
                      <div className="flex size-8 items-center justify-center rounded-full bg-background border-2 border-primary/20">
                        <IconPlayerPlay className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Lesson {index + 1}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    ))}
  </div>
);
