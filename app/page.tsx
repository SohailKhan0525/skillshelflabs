import Link from "next/link";

const platforms = [
  { slug: "claude", name: "Claude", count: "Explore skills" },
  { slug: "codex", name: "Codex", count: "Explore skills" },
  { slug: "gemini", name: "Gemini", count: "Explore skills" },
  { slug: "cursor", name: "Cursor", count: "Explore skills" },
];

const skills = [
  { platform: "Claude", title: "Frontend UI & UX Wizard", slug: "frontend-ui-ux-wizard", description: "Turn rough product intent into a bold, coherent interface direction and implementation ready frontend.", tag: "Design" },
  { platform: "Claude", title: "Landing Page Design", slug: "landing-page-design", description: "Build focused landing pages around one offer, one audience, and one clear action.", tag: "Conversion" },
  { platform: "Claude", title: "Redesign Existing Projects", slug: "redesign-existing-projects", description: "Audit an existing interface and apply deliberate visual and interaction improvements without breaking the product.", tag: "Redesign" },
];

export default function Home() {
  return <main>
    <nav className="nav"><Link href="/" className="brand">SKILLSHELF</Link><div className="nav-links"><Link href="/skills">Skills</Link><Link href="/ai">AI</Link><Link href="/submit">Publish a skill</Link></div></nav>
    <section className="hero shell"><p className="eyebrow">THE HOME FOR AI SKILLS</p><h1>Discover what<br/><span>AI skills can do.</span></h1><p className="hero-copy">A community library where creators give their skills a home and people can understand, explore, and use them without digging through endless instructions.</p><div className="actions"><Link href="/skills" className="button">Explore skills ↗</Link><Link href="/submit" className="text-link">Publish yours</Link></div></section>
    <section className="platforms shell"><div className="section-head"><p className="eyebrow">BROWSE BY AI</p><h2>Find skills for the tools you already use.</h2></div><div className="platform-grid">{platforms.map(p=><Link href={"/ai/"+p.slug} className="platform" key={p.slug}><span>AI PLATFORM</span><strong>{p.name}</strong><em>{p.count} →</em></Link>)}</div></section>
    <section className="featured shell"><div className="section-head"><p className="eyebrow">FEATURED SKILLS</p><h2>Start with something useful.</h2></div><div className="skill-grid">{skills.map(s=><Link href={"/skills/"+s.slug} className="skill" key={s.slug}><span className="tag">{s.tag}</span><small>{s.platform}</small><h3>{s.title}</h3><p>{s.description}</p><b>View skill ↗</b></Link>)}</div></section>
    <section className="creator shell"><div><p className="eyebrow">FOR CREATORS</p><h2>Made a skill?<br/><span>Give it a home.</span></h2></div><div><p>Publish your skill with its source, instructions, examples, and a page people can actually understand and share.</p><Link href="/submit" className="button">Publish a skill ↗</Link></div></section>
    <footer className="footer shell"><span>SKILLSHELF</span><span>Discover · Create · Share</span></footer>
  </main>;
}
