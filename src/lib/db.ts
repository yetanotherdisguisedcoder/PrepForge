import "server-only";
import { Pool } from "pg";

// A fresh Pool per cold start is fine here because Neon's pooled connection
// string (the `-pooler` host, or Vercel's auto-injected POSTGRES_URL) already
// proxies connection pooling at the database layer.
const globalForPool = globalThis as unknown as { pgPool?: Pool };

function createPool(): Pool {
  const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "POSTGRES_URL (or DATABASE_URL) is not set. Add a Postgres connection string " +
        "to your environment — see README.md for setup instructions.",
    );
  }
  return new Pool({
    connectionString,
    ssl: connectionString.includes("sslmode=") ? undefined : { rejectUnauthorized: false },
    max: 5,
  });
}

// Lazy: the connection string is only required once a query actually runs, not
// at module-import time — otherwise `next build` fails without env vars set,
// even though dynamic routes never touch the DB during the build itself.
function getPool(): Pool {
  if (!globalForPool.pgPool) {
    globalForPool.pgPool = createPool();
  }
  return globalForPool.pgPool;
}

export const pool: Pool = new Proxy({} as Pool, {
  get(_target, prop) {
    const real = getPool();
    const value = Reflect.get(real, prop, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
