"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Notifications from "./notifications";

const links = [
  ["/skills", "Skills"],
  ["/ai", "AI tools"],
  ["/submit", "Publish"],
  ["/profile", "Profile"],
] as const;

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <nav className="nav" aria-label="Primary navigation">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>SKILLSHELF</Link>

        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="primary-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen(value => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <div id="primary-navigation" className={`nav-links ${open ? "is-open" : ""}`}>
          {links.map(([href, label]) => (
            <Link
              href={href}
              key={href}
              className={pathname === href || pathname.startsWith(`${href}/`) ? "active" : ""}
              aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Notifications />
        </div>
      </nav>
    </header>
  );
}
