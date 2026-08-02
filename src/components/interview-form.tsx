"use client";

import { useState, useTransition } from "react";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  createInterviewLogAction,
  updateInterviewLogAction,
  deleteInterviewLogAction,
} from "@/lib/actions";
import type { InterviewLogInput } from "@/lib/interviews.server";
import type { InterviewLog, InterviewOutcome, InterviewType } from "@/lib/types";

const TYPE_OPTIONS: { value: InterviewType; label: string }[] = [
  { value: "technical", label: "Technical" },
  { value: "system_design", label: "System Design" },
  { value: "behavioral", label: "Behavioral" },
  { value: "hr", label: "HR / Recruiter screen" },
  { value: "take_home", label: "Take-home assignment" },
  { value: "other", label: "Other" },
];

const OUTCOME_OPTIONS: { value: InterviewOutcome; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "passed", label: "Passed / Advanced" },
  { value: "rejected", label: "Rejected" },
  { value: "no_response", label: "No response" },
  { value: "withdrew", label: "Withdrew" },
];

// Base UI's <Select.Value> shows the raw value unless Root is given an `items`
// map to resolve the display label from.
const TYPE_ITEMS = Object.fromEntries(TYPE_OPTIONS.map((o) => [o.value, o.label]));
const OUTCOME_ITEMS = Object.fromEntries(OUTCOME_OPTIONS.map((o) => [o.value, o.label]));

export function InterviewForm({ existing }: { existing?: InterviewLog }) {
  const [company, setCompany] = useState(existing?.company ?? "");
  const [role, setRole] = useState(existing?.role ?? "");
  const [round, setRound] = useState(existing?.round ?? "");
  const [interviewDate, setInterviewDate] = useState(existing?.interviewDate ?? "");
  const [interviewType, setInterviewType] = useState<InterviewType>(
    existing?.interviewType ?? "technical",
  );
  const [outcome, setOutcome] = useState<InterviewOutcome>(existing?.outcome ?? "pending");
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [questions, setQuestions] = useState(existing?.questions ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [pending, startTransition] = useTransition();

  function buildInput(): InterviewLogInput {
    return {
      company: company.trim(),
      role: role.trim(),
      round: round.trim(),
      interviewDate: interviewDate || null,
      interviewType,
      outcome,
      rating: rating || null,
      questions,
      notes,
    };
  }

  function handleSave() {
    if (!company.trim()) {
      toast.error("Company name is required");
      return;
    }
    startTransition(async () => {
      if (existing) {
        await updateInterviewLogAction(existing.id, buildInput());
        toast.success("Saved");
      } else {
        await createInterviewLogAction(buildInput());
      }
    });
  }

  function handleDelete() {
    if (!existing) return;
    startTransition(async () => {
      await deleteInterviewLogAction(existing.id);
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Company</Label>
          <Input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Razorpay"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Role</Label>
          <Input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Tech Lead"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Round</Label>
          <Input
            value={round}
            onChange={(e) => setRound(e.target.value)}
            placeholder="e.g. Onsite Round 2 — System Design"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Date</Label>
          <Input
            type="date"
            value={interviewDate ?? ""}
            onChange={(e) => setInterviewDate(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Type</Label>
          <Select
            items={TYPE_ITEMS}
            value={interviewType}
            onValueChange={(v) => setInterviewType(v as InterviewType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Outcome</Label>
          <Select
            items={OUTCOME_ITEMS}
            value={outcome}
            onValueChange={(v) => setOutcome(v as InterviewOutcome)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OUTCOME_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>How did it go? (self-rating)</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(rating === n ? 0 : n)} type="button">
              <Star
                className={cn(
                  "size-5 transition-colors",
                  n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Questions asked</Label>
        <Textarea
          value={questions}
          onChange={(e) => setQuestions(e.target.value)}
          className="min-h-40 font-mono text-sm"
          placeholder={"- Explain CAP theorem with an example\n- Design a rate limiter\n- Walk me through your CodInferno architecture"}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Detailed notes — how it went, what you missed, follow-ups, gut feeling</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-48 font-mono text-sm"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button onClick={handleSave} disabled={pending}>
          {existing ? "Save changes" : "Log interview"}
        </Button>
        {existing && (
          <Button variant="ghost" onClick={handleDelete} disabled={pending}>
            <Trash2 className="size-4 text-destructive" /> Delete
          </Button>
        )}
      </div>
    </div>
  );
}
