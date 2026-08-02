"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setStatusAction, setConfidenceAction } from "@/lib/actions";
import type { TopicStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: { value: TopicStatus; label: string }[] = [
  { value: "not-started", label: "Not started" },
  { value: "learning", label: "Learning" },
  { value: "needs-revision", label: "Needs revision" },
  { value: "mastered", label: "Mastered" },
  { value: "expert", label: "Expert" },
];

// Base UI's <Select.Value> shows the raw value unless the Root is given an
// `items` map — this is how it resolves the display label instead of "not-started".
const STATUS_ITEMS = Object.fromEntries(STATUS_OPTIONS.map((o) => [o.value, o.label]));

export function TopicControls({
  topicId,
  initialStatus,
  initialConfidence,
}: {
  topicId: string;
  initialStatus: TopicStatus;
  initialConfidence: number;
}) {
  const [status, setStatus] = useState<TopicStatus>(initialStatus);
  const [confidence, setConfidence] = useState(initialConfidence);
  const [, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Select
        items={STATUS_ITEMS}
        value={status}
        onValueChange={(v) => {
          setStatus(v as TopicStatus);
          startTransition(() => {
            setStatusAction(topicId, v as TopicStatus);
          });
        }}
      >
        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-1">
        <span className="text-sm text-muted-foreground mr-1">Confidence</span>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => {
              const next = confidence === n ? 0 : n;
              setConfidence(next);
              startTransition(() => {
                setConfidenceAction(topicId, next);
              });
            }}
            aria-label={`Set confidence ${n}`}
          >
            <Star
              className={cn(
                "size-4 transition-colors",
                n <= confidence
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
