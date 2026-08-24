"use client";

import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { NavGroup } from "@/lib/docs";

type SidebarNavProps = {
  navigation: NavGroup[];
  currentPath: string;
  onNavigate?: () => void;
};

type NavItem = NavGroup["items"][number];

function navItemMatches(item: NavItem, currentPath: string): boolean {
  return item.href === currentPath || item.items.some((child) => navItemMatches(child, currentPath));
}

export function SidebarNav({
  navigation,
  currentPath,
  onNavigate,
}: SidebarNavProps) {
  const activeGroupLabel =
    navigation.find((group) => group.items.some((item) => navItemMatches(item, currentPath)))?.label ?? null;
  const [expandedGroup, setExpandedGroup] = useState<string | null>(
    currentPath === "/" ? null : activeGroupLabel,
  );

  useEffect(() => {
    setExpandedGroup(currentPath === "/" ? null : activeGroupLabel);
  }, [activeGroupLabel, currentPath]);

  const isBexflowActive = currentPath === "/bexflow";

  return (
    <nav className="space-y-3">
      <Link
        href="/bexflow"
        onClick={onNavigate}
        className={clsx(
          "flex items-center justify-between rounded-[1.6rem] px-3 py-3 text-sm font-semibold transition",
          isBexflowActive
            ? "bg-[#0b214c] text-white shadow-sm"
            : "text-ink hover:bg-white/80",
        )}
      >
        <span>BexFLOW</span>
        <span
          className={clsx(
            "text-[10px] font-semibold uppercase tracking-[0.16em]",
            isBexflowActive ? "text-white/80" : "text-slate/70",
          )}
        >
          Technisch
        </span>
      </Link>

      {navigation.map((group) => {
        const isExpanded = expandedGroup === group.label;
        const isActiveGroup = activeGroupLabel === group.label;

        return (
          <div key={group.label} className="rounded-[1.6rem] border border-transparent bg-white/40">
            <button
              type="button"
              onClick={() => setExpandedGroup((current) => (current === group.label ? null : group.label))}
              className={clsx(
                "flex w-full items-center justify-between rounded-[1.6rem] px-3 py-3 text-left text-sm font-semibold transition",
                isExpanded || isActiveGroup
                  ? "bg-[#0b214c] text-white shadow-sm"
                  : "text-ink hover:bg-white/80",
              )}
              aria-expanded={isExpanded}
            >
              <span>{group.label}</span>
              <ChevronDown
                className={clsx("h-4 w-4 shrink-0 transition-transform", isExpanded ? "rotate-180" : "")}
              />
            </button>
            {isExpanded ? (
              <div className="mt-2 space-y-1 px-2 pb-2">
                {group.items.map((item) => {
                  const isActive = currentPath === item.href;
                  const hasActiveChild = item.items.some((child) => navItemMatches(child, currentPath));
                  const hasChildren = item.items.length > 0;

                  return (
                    <div key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className={clsx(
                          "block rounded-2xl px-3 py-2.5 text-sm transition",
                          isActive
                            ? "bg-pine text-white shadow-sm"
                            : hasActiveChild
                              ? "bg-white/85 font-semibold text-ink shadow-sm"
                              : "text-slate hover:bg-white/80 hover:text-ink",
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {item.title}
                      </Link>
                      {hasChildren ? (
                        <div className="ml-3 mt-1 space-y-1 border-l border-pine/15 pl-2">
                          {item.items.map((child) => {
                            const isChildActive = currentPath === child.href;

                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={onNavigate}
                                className={clsx(
                                  "block rounded-xl px-3 py-2 text-[13px] transition",
                                  isChildActive
                                    ? "bg-pine text-white shadow-sm"
                                    : "text-slate hover:bg-white/80 hover:text-ink",
                                )}
                                aria-current={isChildActive ? "page" : undefined}
                              >
                                {child.title}
                              </Link>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
