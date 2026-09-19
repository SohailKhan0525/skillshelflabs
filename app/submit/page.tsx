import Link from "next/link";

export default function Submit(){
  return <main>
    <nav className="nav"><Link href="/" className="brand">SKILLSHELF</Link><Link href="/skills">Website skills</Link></nav>
    <section className="page-head shell"><p className="eyebrow">FOR CREATORS</p><h1>Publish a website skill.</h1><p>Help a new user understand your skill in a few minutes. Explain the problem it solves, who should use it, how to start, what the output looks like, and where to get the skill.</p></section>
    <section className="shell form-card">
      <label>Skill name<input placeholder="e.g. Website UI & UX Wizard"/></label>
      <label>AI tool<input placeholder="Claude, Codex, Gemini, Cursor..."/></label>
      <label>Source / Get skill URL<input placeholder="https://github.com/..."/></label>
      <label>What does it do?<textarea placeholder="Explain the skill in plain language. What can a beginner expect?"/></label>
      <label>Who is it for?<textarea placeholder="e.g. vibe coders, designers, indie hackers, frontend developers..."/></label>
      <label>How do I use it?<textarea placeholder="Give the first few steps a new user should follow."/></label>
      <button className="button" type="button">Continue publishing ↗</button>
      <p className="form-note">The publishing flow will become authenticated and persistent as the creator layer is connected to the production database.</p>
    </section>
  </main>
}
