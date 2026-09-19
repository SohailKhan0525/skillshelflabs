import Link from "next/link";

const ais=[["claude","Claude"],["codex","Codex"],["gemini","Gemini"],["cursor","Cursor"]];

export default function AI(){
  return <main>
    <nav className="nav"><Link href="/" className="brand">SKILLSHELF</Link><Link href="/skills">Website skills</Link></nav>
    <section className="page-head shell"><p className="eyebrow">AI TOOLS</p><h1>Website skills, organized by tool.</h1><p>Choose the AI tool you use, then explore the website skills made for that workflow.</p></section>
    <section className="shell platform-grid">{ais.map(([slug,name])=><Link href={"/ai/"+slug} className="platform" key={slug}><span>AI TOOL</span><strong>{name}</strong><em>Browse website skills →</em></Link>)}</section>
  </main>
}
