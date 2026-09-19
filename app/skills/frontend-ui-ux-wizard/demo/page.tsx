import Link from "next/link";

export default function Demo(){
  return <main>
    <nav className="nav"><Link href="/skills/frontend-ui-ux-wizard" className="brand">SKILLSHELF</Link><span className="eyebrow">LIVE DEMO · WEBSITE OUTPUT</span></nav>
    <section className="hero shell">
      <p className="eyebrow">A REAL WEBSITE CONCEPT</p>
      <h1>Publish your AI skill.<br/><span>Make it understandable.</span></h1>
      <p className="hero-copy">SkillShelf helps creators turn useful AI skills into clear, discoverable website pages with source, examples, instructions, creator context, and a direct path to use the skill.</p>
      <div className="actions"><a className="button" href="#how">See how it works ↘</a><Link href="/skills/frontend-ui-ux-wizard" className="text-link">View the skill that produced this demo</Link></div>
    </section>

    <section id="how" className="platforms shell">
      <div className="section-head"><p className="eyebrow">01 / USER JOURNEY</p><h2>Understand first. Use second.</h2></div>
      <div className="platform-grid">
        <article className="platform"><span>01</span><strong>Discover</strong><em>Find a website skill by AI tool or category.</em></article>
        <article className="platform"><span>02</span><strong>Understand</strong><em>Read what it does, who made it, and what to provide.</em></article>
        <article className="platform"><span>03</span><strong>Inspect</strong><em>Open the source and see a real example of the output.</em></article>
        <article className="platform"><span>04</span><strong>Build</strong><em>Take the skill into your own website workflow.</em></article>
      </div>
    </section>

    <section className="creator shell">
      <div><p className="eyebrow">02 / CREATOR PAGE</p><h2>A skill page should answer the questions before the install.</h2></div>
      <div><p>A good listing makes the purpose, audience, inputs, expected output, source, demo, and ownership obvious. That is the pattern this demo uses.</p><a className="button" href="https://github.com/Qofeno/skills/blob/main/skills%2Ffrontend-ui-ux-wizard%2FSKILL.md" target="_blank" rel="noreferrer">Open upstream source ↗</a></div>
    </section>

    <section className="shell content-grid">
      <article>
        <p className="eyebrow">03 / DESIGN SYSTEM</p>
        <h2>Context drives the interface.</h2>
        <p>This demo deliberately uses real SkillShelf content instead of fake dashboard numbers, fake testimonials, or placeholder copy. The hierarchy is built around the actual job: helping a visitor understand and trust a skill before using it.</p>
        <p><strong>Responsive:</strong> The layout collapses from multi-column discovery cards into a single-column reading flow on small screens.</p>
        <p><strong>Accessible:</strong> Semantic links and headings, visible focus treatment, readable contrast, and touch-friendly controls are part of the implementation.</p>
      </article>
      <aside><span>OUTPUT</span><strong>Working website</strong><span>CONTENT</span><strong>Real SkillShelf copy</strong><span>SOURCE</span><strong>Qofeno</strong><span>CATALOG</span><strong>SkillShelf</strong></aside>
    </section>

    <section className="shell empty">
      <p className="eyebrow">04 / NEXT</p>
      <h2>Use the original skill on your own website brief.</h2>
      <p>Give the skill the site's purpose, audience, mood, colors, and framework. The upstream workflow then guides the production build and verification process.</p>
      <Link href="/skills/frontend-ui-ux-wizard" className="button">Back to skill ↗</Link>
    </section>
  </main>
}