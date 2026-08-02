"use client";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function levelFor(count: number) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

const LEVEL_CLASSES = [
  "bg-muted",
  "bg-primary/25",
  "bg-primary/45",
  "bg-primary/70",
  "bg-primary",
];

export function Heatmap({ data }: { data: { date: string; count: number }[] }) {
  // group into weeks (columns of 7), left-to-right chronological
  const weeks: { date: string; count: number }[][] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map((day) => (
            <Tooltip key={day.date}>
              <TooltipTrigger
                render={
                  <div
                    className={cn(
                      "size-3 rounded-[3px]",
                      LEVEL_CLASSES[levelFor(day.count)],
                    )}
                  />
                }
              />
              <TooltipContent>
                {day.count} {day.count === 1 ? "action" : "actions"} · {day.date}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      ))}
    </div>
  );
}
