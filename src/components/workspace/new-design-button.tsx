"use client";

import { useState, useTransition } from "react";
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
import { createDesignAction } from "@/lib/actions";

export function NewDesignButton() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [, startTransition] = useTransition();

  function create() {
    startTransition(async () => {
      await createDesignAction(title.trim() || "Untitled design");
    });
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" /> New design
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New design</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="e.g. URL Shortener — attempt 1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") create();
            }}
            autoFocus
          />
          <DialogFooter>
            <Button onClick={create}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
