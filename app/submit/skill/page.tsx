import SiteNav from "../../../components/site-nav";
import SubmitForm from "../SubmitForm";

export const metadata = {
  title: "Submit a skill — SkillShelf",
  description: "Submit a real AI skill to SkillShelf for manual review.",
};

export default function SkillSubmission() {
  return (
    <main>
      <SiteNav />
      <section className="page-head shell">
        <p className="eyebrow">CREATOR AREA · VERIFIED</p>
        <h1>Submit your skill.</h1>
        <p>Your creator account is verified. Add the real source, matching demo, instructions, and review attestations below.</p>
      </section>
      <section className="shell form-card">
        <h2>Skill submission</h2>
        <p className="form-note">Every submission is private while pending review. A SkillShelf reviewer must approve it before it appears publicly.</p>
        <SubmitForm />
      </section>
    </main>
  );
}
