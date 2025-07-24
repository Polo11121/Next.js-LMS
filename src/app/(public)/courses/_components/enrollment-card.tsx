import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { replaceUnderscore } from "@/functions/replace-underscore";
import { CourseCategory, CourseLevel } from "@/lib/generated/prisma";
import {
  IconBook,
  IconCategory,
  IconChartBar,
  IconClock,
} from "@tabler/icons-react";
import { CheckIcon } from "lucide-react";

type EnrollmentCardProps = {
  price: number;
  duration: number;
  level: CourseLevel;
  category: CourseCategory;
  lessons: number;
};

export const EnrollmentCard = ({
  price,
  duration,
  level,
  category,
  lessons,
}: EnrollmentCardProps) => (
  <div className="order-2 lg:col-span-1">
    <div className="sticky top-20">
      <Card className="p-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Price:</span>
            <span className="text-2xl font-bold text-primary">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(price)}
            </span>
          </div>
          <div className="mb-6 space-y-3 rounded-lg bg-muted p-4">
            <h4 className="font-medium">What you will get:</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full  text-primary bg-primary/10">
                  <IconClock className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Course Duration</p>
                  <p className="text-sm text-muted-foreground">
                    {duration} hours
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full  text-primary bg-primary/10">
                  <IconChartBar className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Course Level</p>
                  <p className="text-sm text-muted-foreground">{level}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full  text-primary bg-primary/10">
                  <IconCategory className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Course Category</p>
                  <p className="text-sm text-muted-foreground">
                    {replaceUnderscore(category)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full  text-primary bg-primary/10">
                  <IconBook className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Total Lessons</p>
                  <p className="text-sm text-muted-foreground">
                    {lessons} lessons
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-6 space-y-3">
            <h4>This course includes:</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <div className="rounded-full p-1 bg-green-500/10 ">
                  <CheckIcon className="size-3" />
                </div>
                <span>Full lifetime access</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="rounded-full p-1 bg-green-500/10 ">
                  <CheckIcon className="size-3" />
                </div>
                <span>Access on mobile and desktop</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="rounded-full p-1 bg-green-500/10 ">
                  <CheckIcon className="size-3" />
                </div>
                <span>Certificate of completion</span>
              </li>
            </ul>
          </div>
          <Button className="w-full">Enroll Now!</Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            30-day money-back guarantee
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
);
