"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { signInAction } from "@/lib/auth-actions";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await signInAction({ email, password });
      if (result?.error) setError(result.error);
    });
  }

  return (
    <Card>
      <CardHeader className="items-center text-center space-y-2">
        <Logo size={40} />
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Sign in to PrepForge</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="text-sm text-muted-foreground text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-foreground underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
