import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AppShell } from "@/components/app-shell";
import { getCategoryStats } from "@/lib/aggregate.server";
import { getSearchIndex } from "@/lib/aggregate.server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prep/OS — Interview Preparation Platform",
  description: "A daily-driver interview prep platform: roadmap, spaced repetition, mock interviews, and progress tracking.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categoryStats = await getCategoryStats();
  const searchDocs = getSearchIndex();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <AppShell categoryStats={categoryStats} searchDocs={searchDocs}>
            {children}
          </AppShell>
        </Providers>
      </body>
    </html>
  );
}
