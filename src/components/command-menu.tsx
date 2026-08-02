"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS_CLIENT } from "@/lib/category-labels";

export interface SearchDoc {
  id: string;
  title: string;
  category: string;
  slug: string;
  priority: string;
  note: string;
  content: string;
}

export function CommandMenu({
  docs,
  open,
  onOpenChange,
}: {
  docs: SearchDoc[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(docs, {
        keys: [
          { name: "title", weight: 0.5 },
          { name: "note", weight: 0.15 },
          { name: "category", weight: 0.1 },
          { name: "content", weight: 0.25 },
        ],
        threshold: 0.3,
        ignoreLocation: true,
      }),
    [docs],
  );

  const results = useMemo(() => {
    if (!query.trim()) return docs.slice(0, 20);
    return fuse.search(query).map((r) => r.item).slice(0, 20);
  }, [query, fuse, docs]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Search topics">
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Search topics, resume questions, leadership stories…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No topics found.</CommandEmpty>
          <CommandGroup heading="Topics">
            {results.map((doc) => (
              <CommandItem
                key={doc.id}
                value={doc.id}
                onSelect={() => {
                  onOpenChange(false);
                  router.push(`/topics/${doc.category}/${doc.slug}`);
                }}
              >
                <Badge variant="outline" className="text-[10px] mr-1 shrink-0">
                  {CATEGORY_LABELS_CLIENT[doc.category] ?? doc.category}
                </Badge>
                <span className="truncate">{doc.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
