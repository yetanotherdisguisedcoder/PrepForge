"use client";

import { useState, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { toggleChecklistAction } from "@/lib/actions";

export function TopicBody({
  topicId,
  body,
  initialChecked,
}: {
  topicId: string;
  body: string;
  initialChecked: number[];
}) {
  const [checked, setChecked] = useState<number[]>(initialChecked);
  const [, startTransition] = useTransition();
  let checkboxIndex = 0;

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-pre:bg-muted prose-pre:text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          input: (props) => {
            if (props.type !== "checkbox") {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { node, ...rest } = props as typeof props & { node?: unknown };
              return <input {...rest} />;
            }
            const index = checkboxIndex++;
            const isChecked = checked.includes(index);
            return (
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => {
                  setChecked((prev) =>
                    prev.includes(index)
                      ? prev.filter((i) => i !== index)
                      : [...prev, index].sort((a, b) => a - b),
                  );
                  startTransition(() => {
                    toggleChecklistAction(topicId, index);
                  });
                }}
                className="mr-2 size-4 rounded border-input accent-primary cursor-pointer align-middle"
              />
            );
          },
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
