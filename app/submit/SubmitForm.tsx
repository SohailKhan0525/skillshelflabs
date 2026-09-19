"use client";

import { FormEvent, useState } from "react";
import { getSupabaseBrowser } from "../../lib/supabase-browser";

const tools = ["ChatGPT","Claude","Codex","Gemini","Cursor"];

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80);
}

function isHttpUrl(value: string) {
  try { const u = new URL(value); return u.protocol === "https:" || u.protocol === "http:"; } catch { return false; }
}

export default function SubmitForm() {
  const [mode,setMode]=useState<"login"|"signup">("signup");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [organization,setOrganization]=useState("");
  const [skillName,setSkillName]=useState("");
  const [description,setDescription]=useState("");
  const [category,setCategory]=useState("Website design");
  const [aiTool,setAiTool]=useState("ChatGPT");
  const [source,setSource]=useState("");
  const [demo,setDemo]=useState("");
  const [instructions,setInstructions]=useState("");
  const [terms,setTerms]=useState(false);
  const [attest,setAttest]=useState(false);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");

  async function publish(e: FormEvent) {
    e.preventDefault(); setMessage("");
    if (!terms || !attest) { setMessage("Please accept the creator terms and both publishing attestations."); return; }
    if (!skillName || !description || !name || !source || !demo || !instructions) { setMessage("Complete every required field before publishing."); return; }
    if (!isHttpUrl(source) || !isHttpUrl(demo)) { setMessage("Source and demo must be valid http(s) URLs."); return; }
    setBusy(true);
    try {
      const supabase=getSupabaseBrowser();
      let {data:{session}}=await supabase.auth.getSession();
      if (!session) {
        if (mode==="signup") {
          const sign=await supabase.auth.signUp({email,password,options:{data:{display_name:name}}});
          if (sign.error) throw sign.error;
          session=sign.data.session;
          if (!session) { setMessage("Account created. Check your email to confirm it, then return and sign in to publish."); setBusy(false); return; }
        } else {
          const sign=await supabase.auth.signInWithPassword({email,password});
          if (sign.error) throw sign.error;
          session=sign.data.session;
        }
      }
      const creatorId=session.user.id;
      const {error:profileError}=await supabase.from("profiles").upsert({id:creatorId,display_name:name,username:null,bio:null},{onConflict:"id"});
      if(profileError) throw profileError;
      const {error}=await supabase.from("skills").insert({
        slug:slugify(skillName)+"-"+Math.random().toString(36).slice(2,7),
        name:skillName,description,category,ai_tool:aiTool,creator_id:creatorId,
        creator_name:name,organization_name:organization||null,source_url:source,demo_url:demo,
        instructions,status:"pending_review"
      });
      if(error) throw error;
      setMessage("Submitted for review. Your skill will stay hidden until a SkillShelf reviewer checks the source, demo, AI-tool match, originality, and responsive behavior. Review can take up to 24 hours.");
      setSkillName(""); setDescription(""); setSource(""); setDemo(""); setInstructions("");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally { setBusy(false); }
  }

  return <form className="publish-form" onSubmit={publish}>
    <div className="auth-toggle"><button type="button" className={mode==="signup"?"active":""} onClick={()=>setMode("signup")}>Create creator account</button><button type="button" className={mode==="login"?"active":""} onClick={()=>setMode("login")}>I already have an account</button></div>
    <label>Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} /></label>
    <label>Password<input required minLength={8} type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label>
    <label>Creator name<input required value={name} onChange={e=>setName(e.target.value)} /></label>
    <label>Organization (optional)<input value={organization} onChange={e=>setOrganization(e.target.value)} /></label>
    <hr />
    <label>Skill name<input required value={skillName} onChange={e=>setSkillName(e.target.value)} /></label>
    <label>Description<textarea required value={description} onChange={e=>setDescription(e.target.value)} /></label>
    <label>Category<input required value={category} onChange={e=>setCategory(e.target.value)} /></label>
    <label>AI tool<select value={aiTool} onChange={e=>setAiTool(e.target.value)}>{tools.map(t=><option key={t}>{t}</option>)}</select></label>
    <label>Original source / code URL<input required type="url" placeholder="https://..." value={source} onChange={e=>setSource(e.target.value)} /></label>
    <label>Live demo URL<input required type="url" placeholder="https://..." value={demo} onChange={e=>setDemo(e.target.value)} /></label>
    <label>Usage instructions<textarea required value={instructions} onChange={e=>setInstructions(e.target.value)} /></label>
    <div className="publish-checks">
      <label className="check"><input type="checkbox" checked={terms} onChange={e=>setTerms(e.target.checked)} /> I agree to the <a href="/terms" target="_blank">Creator Terms</a>.</label>
      <label className="check"><input type="checkbox" checked={attest} onChange={e=>setAttest(e.target.checked)} /> I confirm this is my original skill (or I have permission), the demo uses this same skill, and the demo is my real work.</label>
      <p className="form-note">Before publishing, test the demo on phone, tablet, and desktop. Do not publish secrets or private credentials.</p>
    </div>
    {message && <p className="form-message" role="status">{message}</p>}
    <button className="button" disabled={busy}>{busy ? "Publishing…" : "Publish skill"}</button>
  </form>;
}
