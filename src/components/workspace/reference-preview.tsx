"use client";

import { ReactFlow, ReactFlowProvider, Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import { ComponentNode } from "./component-node";
import type { ReferenceDesign } from "@/lib/reference-designs";

const nodeTypes = { component: ComponentNode };

export function ReferencePreview({ design }: { design: ReferenceDesign }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{design.summary}</p>
      <div className="h-80 rounded-md border">
        <ReactFlowProvider>
          <ReactFlow
            nodes={design.nodes}
            edges={design.edges}
            nodeTypes={nodeTypes}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            fitView
          >
            <Background />
            <Controls showInteractive={false} />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
}
