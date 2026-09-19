"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "../../lib/supabase-browser";

export default function CreatorAuth() {
  const router = useRouter();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");

  useEffect(() => {
    let active = true;
    const supabase = getSupabaseBrowser();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (active && session?.user?.email_confirmed_at) router.replace("/submit/skill");
    });
    return () => { active = false; };
  }, [router, supabase]);

  async function resend() {
    if (!verificationEmail) return;
    const supabase = getSupabaseBrowser();
    setBusy(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: verificationEmail,
        options: { emailRedirectTo: `${window.location.origin}/submit/skill` },
      });
      if (error) throw error;
      setMessage("Verification email sent again. Check your inbox and spam folder.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not resend the verification email.");
    } finally {
      setBusy(false);
    }
  }

  async function authenticate(e: FormEvent) {
    e.preventDefault();
    setMessage("");

    if (mode === "signup" && password.length < 12) {
      setMessage("Use at least 12 characters for a new creator account.");
      return;
    }

    setBusy(true);
    try {
      const supabase = getSupabaseBrowser();
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { display_name: name.trim() },
            emailRedirectTo: `${window.location.origin}/submit/skill`,
          },
        });
        if (error) throw error;

        if (!data.session) {
          setVerificationEmail(email.trim());
          setMode("signin");
          setMessage("Account created. Check your email and click the verification link. After verification, return here and sign in.");
          return;
        }

        router.replace("/submit/skill");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          if (/email not confirmed/i.test(error.message)) {
            setVerificationEmail(email.trim());
            setMessage("Your email is not verified yet. Verify it or resend the verification email below.");
            return;
          }
          throw error;
        }

        if (!data.session?.user?.email_confirmed_at) {
          await supabase.auth.signOut();
          setVerificationEmail(email.trim());
          setMessage("Please verify your email before continuing.");
          return;
        }

        router.replace("/submit/skill");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Authentication failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="auth-toggle">
        <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Create creator account</button>
        <button type="button" className={mode === "signin" ? "active" : ""} onClick={() => setMode("signin")}>Sign in</button>
      </div>

      <form className="publish-form" onSubmit={authenticate}>
        {mode === "signup" && (
          <label>Creator name<input required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
        )}
        <label>Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
        <label>Password<input required minLength={mode === "signup" ? 12 : 8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "signup" ? "new-password" : "current-password"} /></label>

        {verificationEmail && (
          <div className="verification-panel">
            <strong>Email verification required</strong>
            <p>We sent a confirmation link to <strong>{verificationEmail}</strong>. Confirm it before signing in.</p>
            <button type="button" className="button secondary" onClick={resend} disabled={busy}>{busy ? "Sending…" : "Resend verification email"}</button>
          </div>
        )}

        {message && <p className="form-message" role="status" aria-live="polite">{message}</p>}
        <button className="button" disabled={busy}>{busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}</button>
      </form>
    </div>
  );
}
