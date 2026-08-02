export interface PaletteItem {
  kind: string;
  label: string;
  colorClass: string;
}

export const PALETTE_ITEMS: PaletteItem[] = [
  { kind: "client", label: "Client", colorClass: "bg-slate-500" },
  { kind: "dns", label: "DNS", colorClass: "bg-slate-500" },
  { kind: "cdn", label: "CDN", colorClass: "bg-sky-500" },
  { kind: "load_balancer", label: "Load Balancer", colorClass: "bg-sky-500" },
  { kind: "api_gateway", label: "API Gateway", colorClass: "bg-indigo-500" },
  { kind: "service", label: "App Service", colorClass: "bg-indigo-500" },
  { kind: "worker", label: "Worker / Consumer", colorClass: "bg-indigo-500" },
  { kind: "cache", label: "Cache (Redis)", colorClass: "bg-red-500" },
  { kind: "queue", label: "Queue (Kafka/SQS)", colorClass: "bg-amber-500" },
  { kind: "database", label: "Database (SQL)", colorClass: "bg-emerald-500" },
  { kind: "nosql", label: "NoSQL Store", colorClass: "bg-emerald-600" },
  { kind: "storage", label: "Object Storage", colorClass: "bg-teal-600" },
  { kind: "search", label: "Search Index", colorClass: "bg-purple-500" },
];

export function paletteItemFor(kind: string): PaletteItem {
  return PALETTE_ITEMS.find((p) => p.kind === kind) ?? {
    kind,
    label: kind,
    colorClass: "bg-slate-500",
  };
}
