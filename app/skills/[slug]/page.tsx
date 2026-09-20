import SiteFooter from "../../components/site-footer";
import Link from "next/link";
import { getSupabase } from "../../../lib/supabase";
import SiteNav from "../../../components/site-nav";

export const dynamic = "force-dynamic";

export default async function Skill({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: s } = await getSupabase()
    .from("skills")
    .select("slug,name,description,category,ai_tool,creator_name,organization_name,source_url,demo_url,instructions")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!s) {
    return <main><SiteNav /><section className="page-head shell">
      <p className="eyebrow">NOT FOUND</p><h1>That skill is not in the library.</h1><Link href="/skills" className="button">Browse skills</Link>
    </section></main>;
  }

  return <main><SiteNav />
    <section className="skill-hero shell">
      <p className="eyebrow">{s.ai_tool} · {s.category}</p><h1>{s.name}</h1><p>{s.description}</p>
      <div className="actions">{s.demo_url && <a className="button" href={s.demo_url} target="_blank" rel="noreferrer">Open demo ↗</a>}{s.source_url && <a className="text-link" href={s.source_url} target="_blank" rel="noreferrer">Get the code ↗</a>}</div>
    </section>
    <section className="shell content-grid">
      <article>
        <p className="eyebrow">SKILL DETAILS</p><h2>What does this skill do?</h2><p>{s.description}</p>
        <h2>How do I use it?</h2><p>{s.instructions || "The creator has not published usage instructions yet."}</p>
        <h2>Demo</h2>{s.demo_url ? <p><a href={s.demo_url} target="_blank" rel="noreferrer" className="text-link">Open the creator-provided demo ↗</a></p> : <p>The creator has not provided a demo for this skill.</p>}
        <h2>Code and source</h2>{s.source_url ? <p><a href={s.source_url} target="_blank" rel="noreferrer" className="text-link">Open the creator-provided source ↗</a></p> : <p>The creator has not provided a source link.</p>}
        <h2>Creator</h2><p><strong>{s.creator_name || "Unknown creator"}</strong>{s.organization_name ? <> · {s.organization_name}</> : null}</p>
      </article>
      <aside><span>AI TOOL</span><strong>{s.ai_tool}</strong><span>CATEGORY</span><strong>{s.category}</strong><span>CREATOR</span><strong>{s.creator_name || "Unknown creator"}</strong><span>ORGANIZATION</span><strong>{s.organization_name || "—"}</strong></aside>
    </section>
  <SiteFooter /></main>;
}