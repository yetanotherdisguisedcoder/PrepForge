"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { rateFlashcardAction } from "@/lib/actions";
import { CATEGORY_LABELS_CLIENT } from "@/lib/category-labels";
import type { DailyFlashcard } from "@/lib/daily-queue.server";
import type { FlashcardRating } from "@/lib/progress.server";
import { cn } from "@/lib/utils";

const RATING_STYLES: Record<FlashcardRating, string> = {
  again: "border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-500/10",
  hard: "border-orange-500/50 text-orange-600 dark:text-orange-400 hover:bg-orange-500/10",
  good: "border-emerald-500/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10",
  easy: "border-blue-500/50 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10",
};

const RATING_LABELS: Record<FlashcardRating, string> = {
  again: "Again",
  hard: "Hard",
  good: "Good",
  easy: "Easy",
};

export function FlashcardDeck({ cards }: { cards: DailyFlashcard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [, startTransition] = useTransition();

  if (cards.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No flashcards today — mark some topics in progress on the Roadmap first.
      </p>
    );
  }

  if (index >= cards.length) {
    return (
      <div className="text-center py-10">
        <p className="text-lg font-medium">Deck complete 🎉</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {cards.length} cards reviewed. A fresh set generates tomorrow.
        </p>
      </div>
    );
  }

  const card = cards[index];

  function rate(rating: FlashcardRating) {
    startTransition(() => {
      rateFlashcardAction(card.topicId, rating);
    });
    setFlipped(false);
    setIndex((i) => i + 1);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {index + 1} / {cards.length}
        </span>
        <Badge variant="outline" className="text-[10px]">
          {CATEGORY_LABELS_CLIENT[card.category] ?? card.category}
        </Badge>
      </div>

      <Card
        className="min-h-56 flex items-center justify-center cursor-pointer select-none"
        onClick={() => setFlipped((f) => !f)}
      >
        <CardContent className="text-center py-10 px-6 space-y-3">
          {flipped ? (
            <>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {card.topicTitle}
              </p>
              <p className="text-base">{card.back}</p>
            </>
          ) : (
            <>
              <p className="text-lg font-medium">{card.front}</p>
              <p className="text-xs text-muted-foreground">Click to reveal</p>
            </>
          )}
        </CardContent>
      </Card>

      {flipped ? (
        <div className="grid grid-cols-4 gap-2">
          {(["again", "hard", "good", "easy"] as FlashcardRating[]).map((r) => (
            <Button
              key={r}
              variant="outline"
              className={cn(RATING_STYLES[r])}
              onClick={() => rate(r)}
            >
              {RATING_LABELS[r]}
            </Button>
          ))}
        </div>
      ) : (
        <Button className="w-full" variant="secondary" onClick={() => setFlipped(true)}>
          Show answer
        </Button>
      )}
    </div>
  );
}
