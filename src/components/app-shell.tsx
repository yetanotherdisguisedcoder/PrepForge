"use client";

import { useState } from "react";
import { Menu, Search } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { CommandMenu, type SearchDoc } from "@/components/command-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import type { CategoryStat } from "@/lib/aggregate.server";

export function AppShell({
  categoryStats,
  searchDocs,
  userEmail,
  children,
}: {
  categoryStats: CategoryStat[];
  searchDocs: SearchDoc[];
  userEmail: string;
  children: React.ReactNode;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <div className="flex min-h-svh w-full">
        <div className="hidden md:flex">
          <Sidebar
            categoryStats={categoryStats}
            userEmail={userEmail}
            onOpenSearch={() => setSearchOpen(true)}
          />
        </div>

        <SheetContent side="left" className="w-72 p-0">
          <Sidebar
            categoryStats={categoryStats}
            userEmail={userEmail}
            onOpenSearch={() => {
              setMobileOpen(false);
              setSearchOpen(true);
            }}
          />
        </SheetContent>

        <div className="flex-1 min-w-0 flex flex-col">
          <header className="md:hidden flex items-center gap-2 border-b px-4 py-3 sticky top-0 bg-background z-10">
            <SheetTrigger render={<Button variant="ghost" size="icon" />}>
              <Menu className="size-5" />
            </SheetTrigger>
            <span className="flex items-center gap-2 font-semibold">
              <Logo size={22} />
              PrepForge
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-5" />
            </Button>
          </header>

          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>

      <CommandMenu docs={searchDocs} open={searchOpen} onOpenChange={setSearchOpen} />
    </Sheet>
  );
}
