import { useState } from "react";
import { LogIn, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useClaims } from "@/hooks/useClaims";
import { tabsFor } from "@/lib/nav";
import { Logo } from "./Logo";
import { NavItems } from "./NavItems";
import { SignOutButton } from "./SignOutButton";

/**
 * Navy top bar. Wide screens: links in a row. Phones: a menu button that opens the links
 * as a list under the bar. Each person only sees their own tabs (lib/nav.ts).
 */
export function SiteHeader() {
  const { role, email } = useClaims();
  const [menuOpen, setMenuOpen] = useState(false);
  // Signed out: "Staff login" link. Signed in: the Sign out button instead (SignOutButton).
  const links = email ? tabsFor(role) : [...tabsFor(role), { to: "/login", label: "Staff login", icon: LogIn }];

  return (
    <header className="sticky top-0 z-[1100] bg-ink shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <NavLink to="/" onClick={() => setMenuOpen(false)}>
          <Logo light />
        </NavLink>
        <div className="hidden items-center gap-3 sm:flex">
          <NavItems links={links} />
          <SignOutButton />
        </div>
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="grid h-11 w-11 place-items-center rounded-xl text-white hover:bg-white/10 sm:hidden"
        >
          {menuOpen ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
        </button>
      </div>
      {menuOpen && (
        <div className="border-t border-white/10 px-4 pb-4 pt-2 sm:hidden">
          <NavItems links={links} stacked onPick={() => setMenuOpen(false)} />
          <SignOutButton stacked />
        </div>
      )}
    </header>
  );
}
