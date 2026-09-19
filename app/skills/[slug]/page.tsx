import Link from "next/link";

const data = {
  "frontend-ui-ux-wizard": {
    title: "Frontend UI & UX Wizard",
    tag: "Website design",
    description: "A production-oriented workflow for designing and building real websites with deliberate visual systems, responsive behavior, accessibility, and verification.",
    ai: "ChatGPT",
    what: "It guides a website build from real product context through visual direction, design tokens, implementation, responsive behavior, accessibility, testing, GitHub, and deployment.",
    forWho: "Vibe coders, indie builders, designers, and developers who want a real website workflow instead of a generic mockup.",
    how: "Give it the site purpose, audience, mood, color preferences, framework, and real references or assets. If the brief is underspecified, the upstream workflow asks for the missing context before building."
  }
} as const;

export default async function Skill({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = data[slug as keyof typeof data];

  if (!s) {
    return <main><nav className="nav"><Link href="/" className="brand">SKILLSHELF</Link><Link href="/skills">All skills</Link></nav><section className="page-head shell"><p className="eyebrow">NOT FOUND</p><h1>That skill is not in the library.</h1><Link href="/skills" className="button">Browse skills</Link></section></main>;
  }

  return <main>
    <nav className="nav"><Link href="/" className="brand">SKILLSHELF</Link><Link href="/skills">All skills</Link></nav>

    <section className="skill-hero shell">
      <p className="eyebrow">{s.ai} · {s.tag}</p>
      <h1>{s.title}</h1>
      <p>{s.description}</p>
      <div className="actions">
        <Link className="button" href="/skills/frontend-ui-ux-wizard/demo">See the demo</Link>
        <a className="text-link" href="https://github.com/Qofeno/skills/blob/main/skills%2Ffrontend-ui-ux-wizard%2FSKILL.md" target="_blank" rel="noreferrer">Read original source</a>
      </div>
    </section>

    <section className="shell content-grid">
      <article>
        <p className="eyebrow">START HERE</p>
        <h2>What does this skill actually do?</h2>
        <p>{s.what}</p>
        <p><strong>Who is it for?</strong> {s.forWho}</p>
        <p><strong>How do I use it?</strong> {s.how}</p>

        <h2>See it in action</h2>
        <p>The demo is a working SkillShelf page using real SkillShelf content. It demonstrates hierarchy, deliberate systems, responsive structure, and production-minded implementation instead of a fake product screenshot.</p>
        <p><Link href="/skills/frontend-ui-ux-wizard/demo" className="text-link">Open the demo</Link></p>

        <h2>Source and attribution</h2>
        <p><strong>Original source: Qofeno.</strong> SkillShelf is the catalog and demo layer maintained by Sohail Khan.</p>
        <p><a href="https://github.com/Qofeno/skills/blob/main/skills%2Ffrontend-ui-ux-wizard%2FSKILL.md" target="_blank" rel="noreferrer" className="text-link">Open Qofeno source</a></p>

        <h2>What you should expect</h2>
        <p>The upstream workflow is intended for real websites. It covers real inputs, a project-specific design system, responsive implementation, accessibility, cross-device verification, a clean build, GitHub, and deployment.</p>
      </article>

      <aside>
        <span>AI TOOL</span><strong>{s.ai}</strong>
        <span>CATEGORY</span><strong>{s.tag}</strong>
        <span>ORIGINAL AUTHOR</span><strong>Qofeno</strong>
        <span>SKILLSHELF</span><strong>Sohail Khan</strong>
      </aside>
    </section>
  </main>;
}
