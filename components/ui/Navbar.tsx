"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, AlertTriangle, LayoutDashboard, MapPin, Radar } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/locations", label: "Locations", icon: MapPin },
  { href: "/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/performance", label: "Performance", icon: Activity },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-(--color-panel-border) bg-(--color-console-bg)/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 rounded-md">
            <Radar className="size-5 text-(--color-accent-cyan)" aria-hidden="true" />
            <span className="text-sm font-bold tracking-widest text-(--color-text-primary) uppercase">
              WeatherWise<span className="text-(--color-accent-cyan)">AI</span>
            </span>
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "bg-(--color-accent-cyan)/12 text-(--color-accent-cyan)"
                      : "text-(--color-text-secondary) hover:bg-white/5 hover:text-(--color-text-primary)",
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-(--color-panel-border) bg-(--color-console-bg)/95 backdrop-blur-md sm:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-stretch justify-around">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium tracking-wide transition-colors",
                  active ? "text-(--color-accent-cyan)" : "text-(--color-text-muted)",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
