"use client";

import SiteFooter from "../../components/site-footer";


import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "../../lib/supabase-browser";
import SiteNav from "../../components/site-nav";

type Skill = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  ai_tool: string;
  creator_name: string | null;
  organization_name: string | null;
  source_url: string | null;
  demo_url: string | null;
  instructions: string | null;
  created_at: string;
};

export default function ReviewPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    setMessage("");
    const supabase = getSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setAuthorized(false);
      setLoading(false);
      return;
    }
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
    if (!profile?.is_admin) {
      setAuthorized(false);
      setLoading(false);
      return;
    }
    setAuthorized(true);
    const { data, error } = await supabase
      .from("skills")
      .select("id,slug,name,description,category,ai_tool,creator_name,organization_name,source_url,demo_url,instructions,created_at")
      .eq("status", "pending_review")
      .order("created_at", { ascending: true });
    if (error) setMessage(error.message);
    setSkills((data ?? []) as Skill[]);
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function decide(id: string, status: "published" | "rejected") {
    const note = window.prompt(status === "published" ? "Optional review note" : "Reason for rejection");
    if (status === "rejected" && note === null) return;
    const supabase = getSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("skills").update({
      status,
      review_note: note || null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id
    }).eq("id", id);
    if (error) {
      setMessage(error.message);
      return;
    }
    await load();
  }

  if (loading) return <main><SiteNav /><section className="page-head shell"><p className="eyebrow">CREATOR REVIEW</p><h1>Loading review queue…</h1></section></main>;
  if (!authorized) return <main><SiteNav /><section className="page-head shell"><p className="eyebrow">CREATOR REVIEW</p><h1>Reviewer access required.</h1><p>Sign in with a SkillShelf admin account to review submissions.</p></section></main>;

  return <main><SiteNav />
    <section className="page-head shell">
      <p className="eyebrow">CREATOR REVIEW</p>
      <h1>Review submissions manually.</h1>
      <p>Open the source and live demo yourself. Confirm the demo uses the submitted skill, the AI-tool association is accurate, the creator has permission to publish it, the instructions are usable, and the experience works on mobile, tablet, and desktop.</p>
    </section>
    <section className="shell content-grid">
      <article>
        {message && <p className="form-message" role="status">{message}</p>}
        {!skills.length ? <div className="empty-state"><span>QUEUE CLEAR</span><h2>No submissions waiting for review.</h2><p>New creator submissions will appear here as pending review.</p></div> :
          skills.map(s => <article key={s.id} className="form-card" style={{marginBottom: "1.5rem"}}>
            <p className="eyebrow">{s.ai_tool} · {s.category}</p>
            <h2>{s.name}</h2>
            <p>{s.description}</p>
            <p><strong>Creator:</strong> {s.creator_name || "Unknown"}{s.organization_name ? " · " + s.organization_name : ""}</p>
            <p><strong>Submitted:</strong> {new Date(s.created_at).toLocaleString()}</p>
            <p><strong>Instructions:</strong> {s.instructions || "None provided"}</p>
            <div className="actions">
              {s.demo_url && <a className="button" href={s.demo_url} target="_blank" rel="noreferrer">Open demo ↗</a>}
              {s.source_url && <a className="text-link" href={s.source_url} target="_blank" rel="noreferrer">Open source ↗</a>}
            </div>
            <div className="actions">
              <button className="button" onClick={() => void decide(s.id, "published")}>Approve & publish</button>
              <button className="text-link" onClick={() => void decide(s.id, "rejected")}>Reject</button>
            </div>
          </article>)
        }
      </article>
      <aside>
        <span>CHECK BEFORE APPROVAL</span>
        <strong>1. Source is original or authorized</strong>
        <strong>2. Demo is the same skill</strong>
        <strong>3. AI-tool association is correct</strong>
        <strong>4. No secrets or private credentials</strong>
        <strong>5. Instructions are clear enough to use</strong>
        <strong>6. Demo works on mobile, tablet, desktop</strong>
        <strong>7. No misleading claims or unrelated template</strong>
      </aside>
    </section>
  <SiteFooter /></main>;
}
