"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = React.useState("pm@example.com");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, callbackUrl: "/dashboard", redirect: false });
    setLoading(false);
    if (res?.error) setError("Sign-in failed. Use a seeded user email.");
    else window.location.href = res?.url ?? "/dashboard";
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>Dev login (SSO-ready boundary).</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-3">
              <label className="block text-sm font-medium">
                Email
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-black dark:focus:ring-zinc-50/10"
                  placeholder="pm@example.com"
                />
              </label>
              {error ? <div className="text-sm text-red-600">{error}</div> : null}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in…" : "Continue"}
              </Button>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Seeded: pm@example.com, director@example.com, finance@example.com, ada@example.com, admin@example.com
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

