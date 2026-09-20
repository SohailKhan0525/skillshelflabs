import Link from "next/link";
import Notifications from "./notifications";

export default function SiteNav() {
  return (
    <nav className="nav" aria-label="Primary navigation">
      <Link href="/" className="brand">SKILLSHELF</Link>
      <div className="nav-links">
        <Link href="/skills">Skills</Link>
        <Link href="/ai">AI tools</Link>
        <Link href="/submit">Publish</Link>
        <Notifications />
        <Link href="/profile">Profile</Link>
      </div>
    </nav>
  );
}
