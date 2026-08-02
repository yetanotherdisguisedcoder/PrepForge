export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-svh flex items-center justify-center p-6 bg-muted/30">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
