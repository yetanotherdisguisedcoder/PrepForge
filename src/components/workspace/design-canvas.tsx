"use client";

import { useCallback, useState, useTransition } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Connection,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Trash2, Save, History, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ComponentNode } from "./component-node";
import { ReferencePreview } from "./reference-preview";
import { PALETTE_ITEMS } from "@/lib/component-palette";
import { REFERENCE_DESIGNS } from "@/lib/reference-designs";
import {
  saveDesignAction,
  saveDesignVersionAction,
  deleteDesignAction,
} from "@/lib/actions";
import type { DesignFull, DesignVersion } from "@/lib/designs.server";
import { cn } from "@/lib/utils";

const nodeTypes = { component: ComponentNode };

// Base UI's <Select.Value> shows the raw value unless Root is given an `items`
// map to resolve the display label from.
const REFERENCE_ITEMS = Object.fromEntries(REFERENCE_DESIGNS.map((d) => [d.key, d.name]));

function CanvasInner({
  design,
  versions,
}: {
  design: DesignFull;
  versions: DesignVersion[];
}) {
  const [title, setTitle] = useState(design.title);
  const [nodes, setNodes, onNodesChange] = useNodesState(design.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(design.edges);
  const [, startTransition] = useTransition();
  const [versionDialogOpen, setVersionDialogOpen] = useState(false);
  const [versionLabel, setVersionLabel] = useState("");
  // Always a string (never undefined) so the Select stays controlled from the
  // very first render — flipping undefined -> string mid-lifecycle triggers a
  // "changing from uncontrolled to controlled" warning.
  const [compareKey, setCompareKey] = useState("");
  const reactFlowInstance = useReactFlow();

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, type: "smoothstep" }, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const kind = event.dataTransfer.getData("application/reactflow");
      if (!kind) return;
      const item = PALETTE_ITEMS.find((p) => p.kind === kind);
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const id = `${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const newNode: Node = {
        id,
        type: "component",
        position,
        data: { label: item?.label ?? kind, kind },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  function handleSave() {
    startTransition(async () => {
      await saveDesignAction(design.id, title, nodes, edges);
      toast.success("Design saved");
    });
  }

  function handleSaveVersion() {
    startTransition(async () => {
      await saveDesignVersionAction(design.id, versionLabel || "Untitled version", nodes, edges);
      toast.success("Version saved");
      setVersionDialogOpen(false);
      setVersionLabel("");
    });
  }

  function loadVersion(version: DesignVersion) {
    setNodes(version.nodes);
    setEdges(version.edges);
    toast.info(`Loaded "${version.label || "version"}" — click Save to keep it`);
  }

  const compareDesign = REFERENCE_DESIGNS.find((d) => d.key === compareKey) ?? null;

  return (
    <div className="flex flex-col h-svh">
      <div className="flex items-center gap-2 border-b px-4 py-3 flex-wrap">
        <Link
          href="/workspace"
          className="inline-flex items-center text-muted-foreground hover:text-foreground shrink-0"
        >
          <ChevronLeft className="size-4" />
        </Link>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="max-w-xs font-medium"
        />
        <Button size="sm" onClick={handleSave}>
          <Save className="size-4" /> Save
        </Button>
        <Button size="sm" variant="outline" onClick={() => setVersionDialogOpen(true)}>
          <History className="size-4" /> Save as version
        </Button>

        {versions.length > 0 && (
          <Select
            items={Object.fromEntries(
              versions.map((v) => [
                String(v.id),
                `${v.label || "Untitled"} · ${new Date(v.createdAt).toLocaleDateString()}`,
              ]),
            )}
            onValueChange={(id) => {
              const v = versions.find((v) => String(v.id) === id);
              if (v) loadVersion(v);
            }}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder={`${versions.length} version${versions.length === 1 ? "" : "s"}`} />
            </SelectTrigger>
            <SelectContent>
              {versions.map((v) => (
                <SelectItem key={v.id} value={String(v.id)}>
                  {v.label || "Untitled"} · {new Date(v.createdAt).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select
          items={REFERENCE_ITEMS}
          value={compareKey}
          onValueChange={(key) => setCompareKey(key as string)}
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Compare with reference…" />
          </SelectTrigger>
          <SelectContent>
            {REFERENCE_DESIGNS.map((d) => (
              <SelectItem key={d.key} value={d.key}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          size="sm"
          variant="ghost"
          className="ml-auto"
          onClick={() => {
            startTransition(async () => {
              await deleteDesignAction(design.id);
            });
          }}
        >
          <Trash2 className="size-4 text-destructive" /> Delete
        </Button>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="w-44 border-r p-2 space-y-1.5 overflow-y-auto shrink-0">
          <p className="text-xs font-medium text-muted-foreground px-1 mb-1">
            Drag onto canvas
          </p>
          {PALETTE_ITEMS.map((item) => (
            <div
              key={item.kind}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("application/reactflow", item.kind)}
              className={cn(
                "rounded-md px-2 py-1.5 text-xs font-medium text-white cursor-grab active:cursor-grabbing",
                item.colorClass,
              )}
            >
              {item.label}
            </div>
          ))}
        </div>

        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap pannable zoomable />
          </ReactFlow>
        </div>
      </div>

      <Dialog open={versionDialogOpen} onOpenChange={setVersionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as version</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="e.g. First attempt, After feedback…"
            value={versionLabel}
            onChange={(e) => setVersionLabel(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleSaveVersion}>Save version</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!compareDesign} onOpenChange={(open) => !open && setCompareKey("")}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{compareDesign?.name}</DialogTitle>
          </DialogHeader>
          {compareDesign && <ReferencePreview design={compareDesign} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function DesignCanvas(props: { design: DesignFull; versions: DesignVersion[] }) {
  return (
    <ReactFlowProvider>
      <CanvasInner design={props.design} versions={props.versions} />
    </ReactFlowProvider>
  );
}
