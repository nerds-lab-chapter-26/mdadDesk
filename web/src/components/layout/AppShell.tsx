import { Outlet } from "react-router-dom";
import { Backdrop } from "./Backdrop";
import { SiteHeader } from "./SiteHeader";
import { StatusBanners } from "./StatusBanners";

/** The frame around every page: background, top bar, warnings, the page itself, footer. */
export function AppShell() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Backdrop />
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-4 px-4 py-5 sm:py-6">
        <StatusBanners />
        <Outlet />
      </main>
      <footer className="pb-20 pt-2 text-center text-xs text-slate-600">
        Prototype for drills and demos. In real danger also call 1122 · 16 · 15.
        <span className="mt-1 block text-[11px] text-slate-600">Version {__BUILD_TIME__} UTC</span>
      </footer>
    </div>
  );
}
