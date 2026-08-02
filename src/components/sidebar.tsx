"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  StickyNote,
  Briefcase,
  Search,
  Sun,
  Moon,
  Flame,
  GitBranch,
  Boxes,
  Mic,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { CategoryStat } from "@/lib/aggregate.server";

export function Sidebar({
  categoryStats,
  onOpenSearch,
}: {
  categoryStats: CategoryStat[];
  onOpenSearch: () => void;
}) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Standard next-themes hydration-safe mount flag — theme is unknown on the server.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/today", label: "Today", icon: Flame },
    { href: "/roadmap", label: "Roadmap", icon: Map },
    { href: "/interviews", label: "Interviews", icon: Briefcase },
    { href: "/mock-interview", label: "Mock Interview", icon: Mic },
    { href: "/resume-map", label: "Resume Map", icon: GitBranch },
    { href: "/workspace", label: "Design Workspace", icon: Boxes },
    { href: "/notes", label: "Notes", icon: StickyNote },
  ];

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground h-full md:h-svh md:sticky md:top-0">
      <div className="p-4 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-lg">
          Prep<span className="text-muted-foreground">/</span>OS
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted && theme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className={cn("size-4", !mounted && "invisible")} />
          )}
        </Button>
      </div>

      <div className="px-4 pb-3">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors"
        >
          <Search className="size-4" />
          <span className="flex-1 text-left">Search topics…</span>
          <kbd className="text-[10px] border rounded px-1 py-0.5 bg-muted">⌘K</kbd>
        </button>
      </div>

      <nav className="px-2 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
              href === "/" ? pathname === "/" : pathname.startsWith(href)
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Categories
      </div>
      <ScrollArea className="flex-1 min-h-0 px-2 py-2">
        <div className="space-y-0.5 pb-6">
          {categoryStats
            .sort((a, b) => b.topicsCount - a.topicsCount)
            .map((c) => {
              const href = `/roadmap?category=${c.category}`;
              const active = pathname === "/roadmap" && false;
              return (
                <Link
                  key={c.category}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                    active && "bg-sidebar-accent",
                  )}
                >
                  <span className="flex-1 truncate text-sidebar-foreground/90">{c.label}</span>
                  <span className="text-[11px] text-muted-foreground tabular-nums">
                    {c.percent}%
                  </span>
                </Link>
              );
            })}
        </div>
      </ScrollArea>
    </aside>
  );
}
