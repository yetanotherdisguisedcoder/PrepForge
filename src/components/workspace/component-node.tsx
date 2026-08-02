"use client";

import { Handle, Position, type NodeProps } from "reactflow";
import { paletteItemFor } from "@/lib/component-palette";
import { cn } from "@/lib/utils";

export function ComponentNode({ data, selected }: NodeProps<{ label: string; kind: string }>) {
  const item = paletteItemFor(data.kind);
  return (
    <div
      className={cn(
        "rounded-md border-2 border-transparent px-3 py-2 text-xs font-medium text-white shadow-sm min-w-32 text-center",
        item.colorClass,
        selected && "border-foreground",
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-foreground/50" />
      {data.label}
      <Handle type="source" position={Position.Bottom} className="!bg-foreground/50" />
    </div>
  );
}
