import SiteNav from "../../components/site-nav";
import CreatorAuth from "./CreatorAuth";

export const metadata = {
  title: "Creator sign in — SkillShelf",
  description: "Sign in or create a verified SkillShelf creator account.",
};

export default function Submit() {
  return (
    <main>
      <SiteNav />
      <section className="page-head shell">
        <p className="eyebrow">CREATORS</p>
        <h1>Sign in to publish.</h1>
        <p>Create or sign in to your verified creator account first. After authentication, SkillShelf will take you to the real skill submission form.</p>
      </section>
      <section className="shell form-card">
        <CreatorAuth />
      </section>
    </main>
  );
}
