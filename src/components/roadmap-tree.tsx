"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { setStatusAction } from "@/lib/actions";
import type { CategoryGroupWithProgress } from "@/lib/aggregate.server";

const PRIORITIES = ["ALL", "P0", "P1", "P2", "P3"] as const;

const PRIORITY_COLORS: Record<string, string> = {
  P0: "border-red-500/50 text-red-600 dark:text-red-400",
  P1: "border-orange-500/50 text-orange-600 dark:text-orange-400",
  P2: "border-yellow-500/50 text-yellow-600 dark:text-yellow-400",
  P3: "border-muted-foreground/30 text-muted-foreground",
};

export function RoadmapTree({
  groups,
  initialCategory,
}: {
  groups: CategoryGroupWithProgress[];
  initialCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<(typeof PRIORITIES)[number]>("ALL");
  const [, startTransition] = useTransition();

  const filteredGroups = useMemo(() => {
    return groups
      .map((g) => ({
        ...g,
        topics: g.topics.filter((t) => {
          const matchesQuery =
            !query.trim() ||
            t.title.toLowerCase().includes(query.toLowerCase()) ||
            t.number?.toLowerCase().includes(query.toLowerCase());
          const matchesPriority = priority === "ALL" || t.priority === priority;
          return matchesQuery && matchesPriority;
        }),
      }))
      .filter((g) => g.topics.length > 0);
  }, [groups, query, priority]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Filter topics…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        <div className="flex gap-1 flex-wrap">
          {PRIORITIES.map((p) => (
            <Button
              key={p}
              size="sm"
              variant={priority === p ? "default" : "outline"}
              onClick={() => setPriority(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      <Accordion
        multiple
        defaultValue={initialCategory ? [initialCategory] : filteredGroups.slice(0, 1).map((g) => g.category)}
      >
        {filteredGroups.map((group) => (
          <AccordionItem key={group.category} value={group.category}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex flex-1 items-center gap-3 pr-4">
                <span className="font-medium">{group.label}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {group.topics.length} topics
                </span>
                <div className="flex-1 max-w-40 h-1.5 rounded-full bg-muted overflow-hidden ml-auto">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${group.percent}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground tabular-nums w-9 text-right">
                  {group.percent}%
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-0.5">
                {group.topics
                  .sort((a, b) => a.order - b.order)
                  .map((t) => {
                    const done = t.progress.status === "mastered" || t.progress.status === "expert";
                    return (
                      <div
                        key={t.id}
                        className="flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-accent group"
                      >
                        <Checkbox
                          checked={done}
                          onCheckedChange={(checked) =>
                            startTransition(() => {
                              setStatusAction(t.id, checked ? "mastered" : "not-started");
                            })
                          }
                        />
                        <Link
                          href={`/topics/${t.category}/${t.slug}`}
                          className={cn(
                            "flex-1 min-w-0 text-sm truncate",
                            done && "text-muted-foreground line-through",
                          )}
                        >
                          {t.number ? `${t.number} ` : ""}
                          {t.title}
                        </Link>
                        {t.percent > 0 && t.percent < 100 && (
                          <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">
                            {t.percent}%
                          </span>
                        )}
                        <Badge
                          variant="outline"
                          className={cn("text-[10px] shrink-0", PRIORITY_COLORS[t.priority])}
                        >
                          {t.priority}
                        </Badge>
                      </div>
                    );
                  })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
