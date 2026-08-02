import "server-only";
import { pool } from "./db";

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { rows } = await pool.query("select * from users where email = $1", [
    email.toLowerCase().trim(),
  ]);
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    id: r.id,
    email: r.email,
    name: r.name,
    passwordHash: r.password_hash,
    createdAt: r.created_at.toISOString(),
  };
}

export async function createUser(
  email: string,
  passwordHash: string,
  name: string,
): Promise<{ id: string; email: string }> {
  const { rows } = await pool.query(
    "insert into users (email, password_hash, name) values ($1, $2, $3) returning id, email",
    [email.toLowerCase().trim(), passwordHash, name.trim()],
  );
  return rows[0];
}
