import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { Sidebar } from "@/components/nav/sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <div className="border-b border-border bg-card/70 backdrop-blur">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="text-sm font-semibold tracking-tight">Product Initiative Lifecycle Management</div>
              <div className="text-xs text-muted-foreground">
                {session.user.email}
              </div>
            </div>
          </div>
          <div className="px-6 py-5">{children}</div>
        </main>
      </div>
    </div>
  );
}

