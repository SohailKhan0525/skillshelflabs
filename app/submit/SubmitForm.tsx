"use client";

import { FormEvent, useEffect, useState } from "react";
import { getSupabaseBrowser } from "../../lib/supabase-browser";

const tools = ["ChatGPT", "Claude", "Codex", "Gemini", "Cursor"];

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

function isHttpUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export default function SubmitForm() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState("");

  const supabase = getSupabaseBrowser();

  useEffect(() => {
    const verified = new URLSearchParams(window.location.search).get("verified");
    if (verified === "1") {
      setMessage("Email verified. You can now sign in and submit your skill for review.");
      window.history.replaceState({}, "", "/submit");
    }
  }, []);

  async function resendVerification() {
    if (!pendingVerificationEmail) return;
    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: pendingVerificationEmail,
        options: { emailRedirectTo: `${window.location.origin}/submit?verified=1` },
      });
      if (error) throw error;
      setMessage("Verification email sent again. Check your inbox and spam folder.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not resend the verification email.");
    } finally {
      setBusy(false);
    }
  }

  async function submitSkill(e: FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!email.trim() || !password) {
      setMessage("Enter your email and password first.");
      return;
    }
    if (!name.trim()) {
      setMessage("Enter your creator name.");
      return;
    }
    if (mode === "signup" && password.length < 12) {
      setMessage("Use a password with at least 12 characters for a new creator account.");
      return;
    }
    if (!skillName.trim() || !description.trim() || !source.trim() || !demo.trim() || !instructions.trim()) {
      setMessage("Complete every required skill field before submitting.");
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
      let { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        if (mode === "signup") {
          const sign = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: { display_name: name.trim() },
              emailRedirectTo: `${window.location.origin}/submit?verified=1`,
            },
          });

          if (sign.error) throw sign.error;
          session = sign.data.session;

          if (!session) {
            setPendingVerificationEmail(email.trim());
            setMode("login");
            setMessage("Account created. We sent a verification email. Confirm it, then return here and sign in.");
            return;
          }
        } else {
          const sign = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

          if (sign.error) {
            if (/email not confirmed/i.test(sign.error.message)) {
              setPendingVerificationEmail(email.trim());
              setMessage("Your email is not verified yet. Check your inbox or resend the verification email below.");
              return;
            }
            throw sign.error;
          }

          session = sign.data.session;
        }
      }

      if (!session?.user?.email_confirmed_at) {
        setPendingVerificationEmail(session?.user?.email ?? email.trim());
        await supabase.auth.signOut();
        setMessage("Please verify your email before submitting a skill.");
        return;
      }

      const creatorId = session.user.id;

      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: creatorId,
          display_name: name.trim(),
          username: null,
          bio: null,
        },
        { onConflict: "id" }
      );
      if (profileError) throw profileError;

      const { error } = await supabase.from("skills").insert({
        slug: slugify(skillName) + "-" + Math.random().toString(36).slice(2, 7),
        name: skillName.trim(),
        description: description.trim(),
        category: category.trim(),
        ai_tool: aiTool,
        creator_id: creatorId,
        creator_name: name.trim(),
        organization_name: organization.trim() || null,
        source_url: source.trim(),
        demo_url: demo.trim(),
        instructions: instructions.trim(),
        status: "pending_review",
      });

      if (error) throw error;

      setMessage("Submitted for review. Your skill stays hidden until a SkillShelf reviewer checks the source, demo, AI-tool match, originality, and responsive behavior. Review can take up to 24 hours.");
      setSkillName("");
      setDescription("");
      setSource("");
      setDemo("");
      setInstructions("");
      setTerms(false);
      setAttest(false);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="publish-form" onSubmit={submitSkill}>
      <div className="auth-toggle">
        <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Create creator account</button>
        <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>I already have an account</button>
      </div>

      <label>Email<input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label>Password<input required minLength={mode === "signup" ? 12 : 8} type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} /><span className="form-note">{mode === "signup" ? "Use at least 12 characters." : "Use your existing password."}</span></label>

      {pendingVerificationEmail && (
        <div className="verification-panel">
          <strong>Verify your email</strong>
          <p>Check <strong>{pendingVerificationEmail}</strong> and your spam folder. Verification is required before a skill can be submitted.</p>
          <button type="button" className="button secondary" onClick={resendVerification} disabled={busy}>{busy ? "Sending…" : "Resend verification email"}</button>
        </div>
      )}

      <label>Creator name<input required value={name} onChange={(e) => setName(e.target.value)} /></label>
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
      <button className="button" disabled={busy}>{busy ? "Submitting…" : "Submit for review"}</button>
    </form>
  );
}
