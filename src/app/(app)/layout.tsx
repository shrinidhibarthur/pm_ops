import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { Sidebar } from "@/components/nav/sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <div className="border-b border-zinc-200 bg-white/70 backdrop-blur dark:border-zinc-800 dark:bg-black/40">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="text-sm font-semibold tracking-tight">Product Initiative Lifecycle Management</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
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

