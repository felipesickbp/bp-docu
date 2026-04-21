import clsx from "clsx";
import Link from "next/link";
import type { NavGroup } from "@/lib/docs";

type SidebarNavProps = {
  navigation: NavGroup[];
  currentPath: string;
  onNavigate?: () => void;
};

export function SidebarNav({
  navigation,
  currentPath,
  onNavigate,
}: SidebarNavProps) {
  return (
    <nav className="space-y-8">
      {navigation.map((group) => (
        <div key={group.label}>
          <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate">
            {group.label}
          </div>
          <div className="space-y-1">
            {group.items.map((item) => {
              const isActive = currentPath === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={clsx(
                    "block rounded-2xl px-3 py-2.5 text-sm transition",
                    isActive
                      ? "bg-pine text-white shadow-sm"
                      : "text-slate hover:bg-white/80 hover:text-ink",
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
