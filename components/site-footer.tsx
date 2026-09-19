import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="footer shell">
      <Link href="/" className="footer-brand">SKILLSHELF</Link>
      <div className="footer-links">
        <Link href="/skills">Skills</Link>
        <Link href="/ai">AI tools</Link>
        <Link href="/submit">Publish a skill</Link><Link href="/terms">Creator terms</Link>
      </div>
      <span>Discover · Understand · Build</span>
    </footer>
  );
}
