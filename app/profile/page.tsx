"use client";

import SiteFooter from "../../components/site-footer";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SiteNav from "../../components/site-nav";
import { getSupabaseBrowser } from "../../lib/supabase-browser";

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const supabase = getSupabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/submit");
        return;
      }

      setEmail(user.email ?? "");
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name,username,bio,avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      setName(profile?.display_name ?? user.user_metadata?.display_name ?? "");
      setUsername(profile?.username ?? "");
      setBio(profile?.bio ?? "");
      setAvatarUrl(profile?.avatar_url ?? "");
      setLoading(false);
    })();
  }, [router]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const supabase = getSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/submit");
      return;
    }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      display_name: name.trim() || null,
      username: username.trim().toLowerCase() || null,
      bio: bio.trim() || null,
      avatar_url: avatarUrl.trim() || null,
      updated_at: new Date().toISOString(),
    });

    if (error) setMessage(error.message);
    else setMessage("Profile settings saved.");
    setSaving(false);
  }

  async function logout() {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut({ scope: "local" });
    router.replace("/");
  }

  async function deleteAccount() {
    const confirmed = window.confirm(
      "Delete your SkillShelf account permanently? Your account access will be removed. This cannot be undone."
    );
    if (!confirmed) return;

    setDeleting(true);
    setMessage("");
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.functions.invoke("delete-account", { body: {} });

    if (error) {
      setMessage(error.message);
      setDeleting(false);
      return;
    }

    await supabase.auth.signOut({ scope: "local" });
    router.replace("/");
  }

  if (loading) {
    return <main><SiteNav /><section className="page-head shell"><p className="eyebrow">PROFILE SETTINGS</p><h1>Loading…</h1></section></main>;
  }

  return (
    <main>
      <SiteNav />
      <section className="page-head shell">
        <p className="eyebrow">PROFILE SETTINGS</p>
        <h1>Manage your creator profile.</h1>
        <p>Update the public details attached to your creator account, sign out, or permanently delete the account.</p>
      </section>

      <section className="shell content-grid">
        <form className="form-card" onSubmit={saveProfile}>
          <label>Display name<input value={name} onChange={e => setName(e.target.value)} maxLength={80} required /></label>
          <label>Email<input value={email} disabled /></label>
          <label>Username<input value={username} onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))} maxLength={32} placeholder="your-username" /></label>
          <label>Avatar URL<input type="url" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} maxLength={500} placeholder="https://…" /></label>
          <label>Bio<textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={280} rows={5} placeholder="Tell people what you build." /></label>
          {message && <p className="form-message" role="status">{message}</p>}
          <button className="button" disabled={saving}>{saving ? "Saving…" : "Save profile"}</button>
        </form>

        <aside className="form-card">
          <span>ACCOUNT</span>
          <h2>Session & account</h2>
          <p>Your email address is managed by your authentication account.</p>
          <button type="button" className="text-link" onClick={() => void logout()}>Log out</button>
          <hr />
          <strong>Delete account</strong>
          <p>This permanently removes your authentication account. Any published or submitted content should be reviewed against your retention policy before deletion.</p>
          <button type="button" className="text-link" disabled={deleting} onClick={() => void deleteAccount()}>
            {deleting ? "Deleting…" : "Delete my account"}
          </button>
        </aside>
      </section>
    <SiteFooter /></main>
  );
}
