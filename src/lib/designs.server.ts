import "server-only";
import { pool } from "./db";
import type { Node, Edge } from "reactflow";

export interface DesignSummary {
  id: number;
  title: string;
  updatedAt: string;
}

export interface DesignFull extends DesignSummary {
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
}

export interface DesignVersion {
  id: number;
  designId: number;
  label: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
}

export async function listDesigns(): Promise<DesignSummary[]> {
  const { rows } = await pool.query(
    "select id, title, updated_at from designs order by updated_at desc",
  );
  return rows.map((r) => ({ id: r.id, title: r.title, updatedAt: r.updated_at.toISOString() }));
}

export async function getDesign(id: number): Promise<DesignFull | null> {
  const { rows } = await pool.query("select * from designs where id = $1", [id]);
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    id: r.id,
    title: r.title,
    nodes: r.nodes,
    edges: r.edges,
    createdAt: r.created_at.toISOString(),
    updatedAt: r.updated_at.toISOString(),
  };
}

export async function createDesign(title: string): Promise<number> {
  const { rows } = await pool.query("insert into designs (title) values ($1) returning id", [
    title || "Untitled design",
  ]);
  return rows[0].id;
}

export async function saveDesign(
  id: number,
  title: string,
  nodes: Node[],
  edges: Edge[],
): Promise<void> {
  await pool.query(
    "update designs set title = $2, nodes = $3, edges = $4, updated_at = now() where id = $1",
    [id, title, JSON.stringify(nodes), JSON.stringify(edges)],
  );
}

export async function deleteDesign(id: number): Promise<void> {
  await pool.query("delete from designs where id = $1", [id]);
}

export async function saveVersion(
  designId: number,
  label: string,
  nodes: Node[],
  edges: Edge[],
): Promise<number> {
  const { rows } = await pool.query(
    "insert into design_versions (design_id, label, nodes, edges) values ($1, $2, $3, $4) returning id",
    [designId, label, JSON.stringify(nodes), JSON.stringify(edges)],
  );
  return rows[0].id;
}

export async function listVersions(designId: number): Promise<DesignVersion[]> {
  const { rows } = await pool.query(
    "select * from design_versions where design_id = $1 order by created_at desc",
    [designId],
  );
  return rows.map((r) => ({
    id: r.id,
    designId: r.design_id,
    label: r.label,
    nodes: r.nodes,
    edges: r.edges,
    createdAt: r.created_at.toISOString(),
  }));
}
