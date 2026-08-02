"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createNoteAction } from "@/lib/actions";

export function NewNoteButton() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [, startTransition] = useTransition();
  const router = useRouter();

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" /> New note
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New note</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Note title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && title.trim()) {
                startTransition(async () => {
                  const slug = await createNoteAction(title.trim());
                  setOpen(false);
                  setTitle("");
                  router.push(`/notes/${slug}`);
                });
              }
            }}
            autoFocus
          />
          <DialogFooter>
            <Button
              disabled={!title.trim()}
              onClick={() => {
                startTransition(async () => {
                  const slug = await createNoteAction(title.trim());
                  setOpen(false);
                  setTitle("");
                  router.push(`/notes/${slug}`);
                });
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
