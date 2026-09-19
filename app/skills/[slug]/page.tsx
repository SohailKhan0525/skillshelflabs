import Link from "next/link";

const data: Record<string,{title:string,tag:string,description:string,ai:string,what:string,forWho:string,how:string}> = {
  "frontend-ui-ux-wizard": {
    title: "Frontend UI & UX Wizard",
    tag: "Website design",
    description: "Turn a rough website idea into a clear visual direction, responsive interface, and implementation-ready frontend decisions.",
    ai: "Claude",
    what: "It helps you think through the website before jumping straight into code: structure, visual direction, components, responsive behavior, and interaction states.",
    forWho: "Vibe coders, indie builders, designers, and developers who want a stronger website direction before or while building.",
    how: "Give it your website idea, audience, goal, constraints, and any reference material. The skill guides the design and frontend decisions from there."
  }
};

export default async function Skill({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const s=data[slug];
  if(!s) return <main><nav className="nav"><Link href="/" className="brand">SKILLSHELF</Link><Link href="/skills">All skills</Link></nav><section className="page-head shell"><p className="eyebrow">NOT FOUND</p><h1>That skill is not in the library.</h1><p>It may have been removed or the link may be outdated.</p><Link href="/skills" className="button">Browse skills ↗</Link></section></main>;

  return <main>
    <nav className="nav"><Link href="/" className="brand">SKILLSHELF</Link><Link href="/skills">All skills</Link></nav>
    <section className="skill-hero shell">
      <p className="eyebrow">{s.ai} · {s.tag}</p>
      <h1>{s.title}</h1>
      <p>{s.description}</p>
      <div className="actions"><a className="button" href="https://github.com/SohailKhan0525/test" target="_blank" rel="noreferrer">Get the skill ↗</a><Link href="/submit" className="text-link">Publish your own</Link></div>
    </section>

    <section className="shell content-grid">
      <article>
        <p className="eyebrow">START HERE</p>
        <h2>What does this skill actually do?</h2>
        <p>{s.what}</p>
        <p><strong>Who is it for?</strong> {s.forWho}</p>
        <p><strong>How do I use it?</strong> {s.how}</p>
        <h2>What you should expect</h2>
        <p>The goal is not to replace your judgment or magically finish a website. It gives you a repeatable set of instructions and decisions you can steer, review, and adapt to your project.</p>
      </article>
      <aside><span>AI TOOL</span><strong>{s.ai}</strong><span>CATEGORY</span><strong>{s.tag}</strong><span>BEST FOR</span><strong>Website building</strong></aside>
    </section>
  </main>
}
