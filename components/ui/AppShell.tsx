import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { OfflineBanner } from "./OfflineBanner";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-full flex-col">
      <div className="storm-grid-texture" aria-hidden="true" />
      <Navbar />
      <OfflineBanner />
      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 pt-4 pb-20 sm:pb-10">
        {children}
      </main>
      <footer className="relative z-10 mx-auto hidden w-full max-w-6xl px-4 pb-6 text-xs text-(--color-text-muted) sm:block">
        WeatherWise AI &mdash; Storm Operations Console &middot; mock data provider &middot;{" "}
        <a
          href="https://vercel.com"
          className="underline decoration-dotted underline-offset-2 hover:text-(--color-text-secondary)"
        >
          deployed on Vercel
        </a>
      </footer>
    </div>
  );
}
