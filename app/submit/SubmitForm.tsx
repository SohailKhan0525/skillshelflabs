"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "../../lib/supabase-browser";

const tools = ["ChatGPT", "Claude", "Codex", "Gemini", "Cursor"];

function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80); }
function isHttpUrl(value: string) { try { const u = new URL(value); return u.protocol === "https:" || u.protocol === "http:"; } catch { return false; } }

export default function SubmitForm() {
  const [name, setName] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");
  const [loadingCreator, setLoadingCreator] = useState(true);
  const [organization, setOrganization] = useState("");
  const [skillName, setSkillName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Website design");
  const [aiTool, setAiTool] = useState("ChatGPT");
  const [source, setSource] = useState("");
  const [demo, setDemo] = useState("");
  const [instructions, setInstructions] = useState("");
  const [terms, setTerms] = useState(false);
  const [attest, setAttest] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    let active = true;
    async function loadCreator() {
      const supabase = getSupabaseBrowser();
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.replace("/submit");
        return;
      }

      const user = data.user;
      const metadataName = typeof user.user_metadata?.display_name === "string" ? user.user_metadata.display_name.trim() : "";
      let displayName = metadataName;

      if (!displayName) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", user.id)
          .maybeSingle();
        displayName = profile?.display_name?.trim() ?? "";
      }

      if (!displayName) {
        displayName = user.email?.split("@")[0] ?? "Creator";
      }

      if (active) {
        setName(displayName);
        setCreatorEmail(user.email ?? "");
        setLoadingCreator(false);
      }
    }

    loadCreator();
    return () => { active = false; };
  }, [router]);

  async function submitSkill(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    if (!name.trim() || !skillName.trim() || !description.trim() || !source.trim() || !demo.trim() || !instructions.trim()) {
      setMessage("Complete every required field before submitting.");
      return;
    }
    if (!isHttpUrl(source) || !isHttpUrl(demo)) {
      setMessage("Source and demo must be valid http(s) URLs.");
      return;
    }
    if (!terms || !attest) {
      setMessage("Please accept the Creator Terms and both publishing attestations.");
      return;
    }

    setBusy(true);
    try {
      const supabase = getSupabaseBrowser();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        router.replace("/submit");
        return;
      }

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        display_name: name.trim(),
        username: null,
        bio: null,
      }, { onConflict: "id" });
      if (profileError) throw profileError;

      const { error } = await supabase.from("skills").insert({
        slug: slugify(skillName) + "-" + Math.random().toString(36).slice(2, 7),
        name: skillName.trim(),
        description: description.trim(),
        category: category.trim(),
        ai_tool: aiTool,
        creator_id: user.id,
        creator_name: name.trim(),
        organization_name: organization.trim() || null,
        source_url: source.trim(),
        demo_url: demo.trim(),
        instructions: instructions.trim(),
        status: "pending_review",
      });
      if (error) throw error;

      setMessage("Submitted for review. Your skill stays hidden until a SkillShelf reviewer checks the source, demo, AI-tool match, originality, and responsive behavior. Review can take up to 24 hours.");
      setSkillName(""); setDescription(""); setSource(""); setDemo(""); setInstructions(""); setTerms(false); setAttest(false);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="publish-form" onSubmit={submitSkill}>
      <label>Creator name<input required value={name} readOnly disabled autoComplete="name" aria-describedby="creator-identity-note" /></label>
      <p id="creator-identity-note" className="form-note">This name comes from your creator account and cannot be changed from a skill submission.</p>
      {creatorEmail && <p className="form-note">Creator email: {creatorEmail}</p>}
      <label>Organization (optional)<input value={organization} onChange={(e) => setOrganization(e.target.value)} /></label>
      <hr />
      <label>Skill name<input required value={skillName} onChange={(e) => setSkillName(e.target.value)} /></label>
      <label>Description<textarea required value={description} onChange={(e) => setDescription(e.target.value)} /></label>
      <label>Category<input required value={category} onChange={(e) => setCategory(e.target.value)} /></label>
      <label>AI tool<select value={aiTool} onChange={(e) => setAiTool(e.target.value)}>{tools.map((tool) => <option key={tool}>{tool}</option>)}</select></label>
      <label>Original source / code URL<input required type="url" placeholder="https://..." value={source} onChange={(e) => setSource(e.target.value)} /></label>
      <label>Live demo URL<input required type="url" placeholder="https://..." value={demo} onChange={(e) => setDemo(e.target.value)} /></label>
      <label>Usage instructions<textarea required value={instructions} onChange={(e) => setInstructions(e.target.value)} /></label>
      <div className="publish-checks">
        <label className="check"><input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} /> I agree to the <a href="/terms" target="_blank" rel="noreferrer">Creator Terms</a>.</label>
        <label className="check"><input type="checkbox" checked={attest} onChange={(e) => setAttest(e.target.checked)} /> I confirm this is my original skill (or I have permission), the demo uses this same skill, and the demo is my real work.</label>
        <p className="form-note">Before submitting, test the demo on phone, tablet, and desktop. Do not publish secrets or private credentials.</p>
      </div>
      {message && <p className="form-message" role="status" aria-live="polite">{message}</p>}
      <button className="button" disabled={busy || loadingCreator || !name}>{busy ? "Submitting…" : loadingCreator ? "Loading creator…" : "Submit for review"}</button>
    </form>
  );
}
