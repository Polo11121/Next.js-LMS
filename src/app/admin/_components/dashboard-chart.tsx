"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type DashboardChartProps = {
  data: {
    date: string;
    enrollments: number;
  }[];
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const chartConfig = {
  enrollments: {
    label: "Enrollments",
    color: "var(--charts-1)",
  },
} satisfies ChartConfig;

export const DashboardChart = ({ data }: DashboardChartProps) => {
  const totalEnrollments = useMemo(
    () => data.reduce((acc, curr) => acc + curr.enrollments, 0),
    [data]
  );

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Enrollments</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total enrollments for the last 30 days: {totalEnrollments}
          </span>
          <span className="@[540px]/card:hidden">
            Last 30 days: {totalEnrollments}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px]">
          <BarChart
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
              tickFormatter={(value) => formatDate(value as string)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => formatDate(value as string)}
                />
              }
            />
            <Bar
              dataKey="enrollments"
              fill="var(--color-enrollments)"
              radius={2}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
