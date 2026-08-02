import "server-only";
import { pool } from "./db";
import type { Node, Edge } from "reactflow";

export interface DesignSummary {
  id: string;
  title: string;
  updatedAt: string;
}

export interface DesignFull extends DesignSummary {
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
}

export interface DesignVersion {
  id: string;
  designId: string;
  label: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
}

export async function listDesigns(userId: string): Promise<DesignSummary[]> {
  const { rows } = await pool.query(
    "select id, title, updated_at from designs where user_id = $1 order by updated_at desc",
    [userId],
  );
  return rows.map((r) => ({ id: r.id, title: r.title, updatedAt: r.updated_at.toISOString() }));
}

// Scoped by user_id AND id everywhere below — never id alone (IDOR guard).
export async function getDesign(userId: string, id: string): Promise<DesignFull | null> {
  const { rows } = await pool.query("select * from designs where user_id = $1 and id = $2", [
    userId,
    id,
  ]);
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

export async function createDesign(userId: string, title: string): Promise<string> {
  const { rows } = await pool.query(
    "insert into designs (user_id, title) values ($1, $2) returning id",
    [userId, title || "Untitled design"],
  );
  return rows[0].id;
}

export async function saveDesign(
  userId: string,
  id: string,
  title: string,
  nodes: Node[],
  edges: Edge[],
): Promise<void> {
  await pool.query(
    "update designs set title = $3, nodes = $4, edges = $5, updated_at = now() where user_id = $1 and id = $2",
    [userId, id, title, JSON.stringify(nodes), JSON.stringify(edges)],
  );
}

export async function deleteDesign(userId: string, id: string): Promise<void> {
  await pool.query("delete from designs where user_id = $1 and id = $2", [userId, id]);
}

export async function saveVersion(
  userId: string,
  designId: string,
  label: string,
  nodes: Node[],
  edges: Edge[],
): Promise<string> {
  // Verify the design actually belongs to this user before attaching a version
  // to it — otherwise a caller could snapshot a version onto someone else's design.
  const owned = await pool.query("select 1 from designs where user_id = $1 and id = $2", [
    userId,
    designId,
  ]);
  if (owned.rows.length === 0) {
    throw new Error("Design not found");
  }
  const { rows } = await pool.query(
    "insert into design_versions (design_id, user_id, label, nodes, edges) values ($1, $2, $3, $4, $5) returning id",
    [designId, userId, label, JSON.stringify(nodes), JSON.stringify(edges)],
  );
  return rows[0].id;
}

export async function listVersions(userId: string, designId: string): Promise<DesignVersion[]> {
  const { rows } = await pool.query(
    "select * from design_versions where user_id = $1 and design_id = $2 order by created_at desc",
    [userId, designId],
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
