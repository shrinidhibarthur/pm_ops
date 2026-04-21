import Link from "next/link";
import { LayoutDashboard, ListTodo, CheckSquare, Settings, Layers } from "lucide-react";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/dashboard", label: "Executive Dashboard", icon: LayoutDashboard },
  { href: "/initiatives", label: "Initiatives", icon: Layers },
  { href: "/approvals", label: "Approvals", icon: CheckSquare },
  { href: "/admin/workflows", label: "Admin", icon: Settings },
  { href: "/admin/templates", label: "Templates", icon: ListTodo },
];

export function Sidebar() {
  return (
    <aside className="w-72 shrink-0 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 flex items-center justify-center text-xs font-bold">
            PILM
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold leading-5">Lifecycle OS</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Internal product system</div>
          </div>
        </div>
      </div>
      <nav className="px-2 pb-4">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50",
              )}
            >
              <Icon className="h-4 w-4 text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-50" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto px-4 pb-4 text-[11px] text-zinc-500 dark:text-zinc-400">
        Config-driven workflow • Audit-first
      </div>
    </aside>
  );
}

