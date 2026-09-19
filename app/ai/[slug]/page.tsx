import Link from "next/link";
import { getSupabase } from "../../../lib/supabase";

const platforms: Record<string, string> = {
  chatgpt: "ChatGPT",
  claude: "Claude",
  codex: "Codex",
  gemini: "Gemini",
  cursor: "Cursor",
};

export const dynamic = "force-dynamic";

export default async function Platform({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = platforms[slug];

  if (!name) {
    return (
      <main>
        <nav className="nav"><Link href="/" className="brand">SKILLSHELF</Link><Link href="/ai">All AI tools</Link></nav>
        <section className="page-head shell">
          <p className="eyebrow">NOT FOUND</p>
          <h1>That AI tool is not in SkillShelf.</h1>
          <Link href="/ai" className="button">Browse AI tools</Link>
        </section>
      </main>
    );
  }

  const { data: skills } = await getSupabase()
    .from("skills")
    .select("slug,name,description,category,ai_tool")
    .eq("status", "published")
    .eq("ai_tool", name)
    .order("created_at", { ascending: false });

  const skillList = skills ?? [];

  return (
    <main>
      <nav className="nav"><Link href="/" className="brand">SKILLSHELF</Link><Link href="/ai">All AI tools</Link></nav>
      <section className="page-head shell">
        <p className="eyebrow">AI TOOL · WEBSITE BUILDING</p>
        <h1>Website skills for {name}.</h1>
        <p>Only skills actually published for {name} are shown here.</p>
      </section>
      <section className="shell list">
        {skillList.length ? skillList.map((s) => (
          <Link key={s.slug} className="list-item" href={"/skills/" + s.slug}>
            <span>{s.category}</span>
            <div><small>{s.ai_tool}</small><h2>{s.name}</h2><p>{s.description}</p></div>
            <b>View ↗</b>
          </Link>
        )) : (
          <div className="empty-state">
            <span>NO PUBLISHED SKILLS</span>
            <h2>Nothing is published for {name} yet.</h2>
            <p>This page stays empty until a real skill is associated with {name}.</p>
            <Link href="/submit" className="button">Publish a skill</Link>
          </div>
        )}
      </section>
    </main>
  );
}