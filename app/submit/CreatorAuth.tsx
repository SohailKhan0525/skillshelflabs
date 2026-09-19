"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";
import { getSupabaseBrowser } from "../../lib/supabase-browser";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function CreatorAuth() {
  const router = useRouter();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    const supabase = getSupabaseBrowser();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (active && session) router.replace("/submit/skill");
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active && session) router.replace("/submit/skill");
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [router]);

  async function authenticate(e: FormEvent) {
    e.preventDefault();
    setMessage("");

    if (mode === "signup" && password.length < 12) {
      setMessage("Use at least 12 characters for a new creator account.");
      return;
    }

    if (turnstileSiteKey && !captchaToken) {
      setMessage("Please complete the security check.");
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
            captchaToken: captchaToken || undefined,
          },
        });

        if (error) throw error;

        if (!data.session) {
          setMode("signin");
          setMessage("Account created. Sign in to continue.");
          return;
        }

        router.replace("/submit/skill");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
          options: { captchaToken: captchaToken || undefined },
        });

        if (error) throw error;
        if (!data.session) throw new Error("Sign-in did not create a session.");

        router.replace("/submit/skill");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Authentication failed. Please try again.");
      setCaptchaToken("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="auth-toggle">
        <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => { setMode("signup"); setMessage(""); setCaptchaToken(""); }}>Create creator account</button>
        <button type="button" className={mode === "signin" ? "active" : ""} onClick={() => { setMode("signin"); setMessage(""); setCaptchaToken(""); }}>Sign in</button>
      </div>

      <form className="publish-form" onSubmit={authenticate}>
        {mode === "signup" && (
          <label>Creator name<input required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
        )}
        <label>Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
        <label>Password<input required minLength={mode === "signup" ? 12 : 8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "signup" ? "new-password" : "current-password"} /></label>

        {turnstileSiteKey && (
          <div className="captcha-panel">
            <Turnstile
              siteKey={turnstileSiteKey}
              onSuccess={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken("")}
              onError={() => {
                setCaptchaToken("");
                setMessage("Security check failed. Please try again.");
              }}
            />
          </div>
        )}

        {message && <p className="form-message" role="status" aria-live="polite">{message}</p>}
        <button className="button" disabled={busy}>{busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}</button>
      </form>
    </div>
  );
}
