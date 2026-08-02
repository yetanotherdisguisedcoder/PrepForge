import type { Node, Edge } from "reactflow";

export interface ReferenceDesign {
  key: string;
  name: string;
  summary: string;
  nodes: Node[];
  edges: Edge[];
}

function n(id: string, label: string, kind: string, x: number, y: number): Node {
  return { id, type: "component", position: { x, y }, data: { label, kind } };
}

function e(id: string, source: string, target: string, label?: string): Edge {
  return { id, source, target, label, type: "smoothstep" };
}

export const REFERENCE_DESIGNS: ReferenceDesign[] = [
  {
    key: "url_shortener",
    name: "URL Shortener (TinyURL)",
    summary:
      "Client → CDN/LB → API service → cache-aside on Redis → Postgres for the id→URL mapping, base62 encoding on a sharded counter or Snowflake ID.",
    nodes: [
      n("client", "Client", "client", 250, 0),
      n("cdn", "CDN", "cdn", 250, 90),
      n("lb", "Load Balancer", "load_balancer", 250, 180),
      n("api", "API Service", "service", 250, 270),
      n("cache", "Redis Cache", "cache", 100, 370),
      n("db", "Postgres (id → URL)", "database", 400, 370),
    ],
    edges: [
      e("e1", "client", "cdn"),
      e("e2", "cdn", "lb"),
      e("e3", "lb", "api"),
      e("e4", "api", "cache", "cache-aside"),
      e("e5", "api", "db", "on miss"),
    ],
  },
  {
    key: "rate_limiter",
    name: "Distributed Rate Limiter",
    summary:
      "Enforced at the gateway using a Redis-backed sliding window counter (INCR+EXPIRE or a Lua script for atomicity), shared across all API nodes.",
    nodes: [
      n("client", "Client", "client", 250, 0),
      n("gw", "API Gateway", "api_gateway", 250, 100),
      n("redis", "Redis (sliding window)", "cache", 250, 220),
      n("api", "App Service", "service", 100, 320),
      n("api2", "App Service (replica)", "service", 400, 320),
    ],
    edges: [
      e("e1", "client", "gw"),
      e("e2", "gw", "redis", "check + increment"),
      e("e3", "gw", "api", "allowed"),
      e("e4", "gw", "api2", "allowed"),
    ],
  },
  {
    key: "chat_system",
    name: "Chat / Messaging System",
    summary:
      "WebSocket gateway for presence + real-time delivery, a message queue for fan-out to offline users, and a database for message history with pagination.",
    nodes: [
      n("client", "Client (WebSocket)", "client", 250, 0),
      n("gw", "WS Gateway", "api_gateway", 250, 100),
      n("queue", "Message Queue", "queue", 250, 200),
      n("worker", "Delivery Worker", "worker", 100, 300),
      n("db", "Message Store", "nosql", 400, 300),
      n("cache", "Presence Cache", "cache", 400, 100),
    ],
    edges: [
      e("e1", "client", "gw"),
      e("e2", "gw", "cache", "presence"),
      e("e3", "gw", "queue", "publish"),
      e("e4", "queue", "worker", "fan-out"),
      e("e5", "worker", "db", "persist"),
    ],
  },
];
