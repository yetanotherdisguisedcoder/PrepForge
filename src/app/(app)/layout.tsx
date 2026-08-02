import { AppShell } from "@/components/app-shell";
import { getCategoryStats, getSearchIndex } from "@/lib/aggregate.server";
import { requireSession } from "@/lib/auth.server";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireSession();
  const categoryStats = await getCategoryStats(session.userId);
  const searchDocs = getSearchIndex();

  return (
    <AppShell categoryStats={categoryStats} searchDocs={searchDocs} userEmail={session.email}>
      {children}
    </AppShell>
  );
}
