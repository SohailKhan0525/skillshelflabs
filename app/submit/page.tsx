import Link from "next/link";

export default function Submit() {
  return (
    <main>
      <nav className="nav">
        <Link href="/" className="brand">SKILLSHELF</Link>
        <Link href="/skills">Website skills</Link>
      </nav>

      <section className="page-head shell">
        <p className="eyebrow">FOR CREATORS</p>
        <h1>Publish a real skill.</h1>
        <p>
          SkillShelf does not create demos, source code, testimonials, metrics, or example skills for creators.
          Every published listing must come from the creator and include the real information users need to inspect and use it.
        </p>
      </section>

      <section className="shell form-card">
        <h2>What a submission must contain</h2>
        <ul>
          <li>Skill name and description</li>
          <li>The AI tool or tools the skill actually supports</li>
          <li>Creator and organization information</li>
          <li>A real source or code URL</li>
          <li>A real demo URL, when the creator has one</li>
          <li>Actual usage instructions</li>
        </ul>

        <p className="form-note">
          Creator authentication and the persistent submission workflow are not enabled yet.
          This page intentionally does not pretend that a submission has been saved.
        </p>
      </section>
    </main>
  );
}
