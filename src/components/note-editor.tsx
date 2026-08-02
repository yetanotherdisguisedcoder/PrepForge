"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { saveNoteAction, deleteNoteAction } from "@/lib/actions";

export function NoteEditor({
  slug,
  initialTitle,
  initialBody,
}: {
  slug: string;
  initialTitle: string;
  initialBody: string;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function scheduleSave(nextTitle: string, nextBody: string) {
    setSaving("saving");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      await saveNoteAction(slug, nextTitle, nextBody);
      setSaving("saved");
    }, 700);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Input
          value={title}
          onChange={(e) => {
            const value = e.target.value;
            setTitle(value);
            scheduleSave(value, body);
          }}
          className="text-lg font-medium border-none px-0 shadow-none focus-visible:ring-0"
          placeholder="Untitled note"
        />
        <span className="text-xs text-muted-foreground shrink-0">
          {saving === "saving" ? "Saving…" : saving === "saved" ? "Saved" : ""}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={async () => {
            await deleteNoteAction(slug);
            router.push("/notes");
          }}
        >
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>

      <Tabs defaultValue="edit">
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <Textarea
            value={body}
            onChange={(e) => {
              const value = e.target.value;
              setBody(value);
              scheduleSave(title, value);
            }}
            className="min-h-[60vh] font-mono text-sm"
            placeholder="Write in markdown…"
          />
        </TabsContent>
        <TabsContent value="preview">
          <div className="prose prose-neutral dark:prose-invert max-w-none min-h-[60vh] border rounded-md p-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{body || "*Nothing yet*"}</ReactMarkdown>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
