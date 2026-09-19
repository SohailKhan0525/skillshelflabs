import SiteNav from "../../components/site-nav";
import SubmitForm from "./SubmitForm";

export const metadata = {
  title: "Publish a skill — SkillShelf",
  description: "Submit a real AI skill to SkillShelf for manual review.",
};

export default function Submit() {
  return (
    <main>
      <SiteNav />
      <section className="page-head shell">
        <p className="eyebrow">FOR CREATORS · SUBMIT</p>
        <h1>Publish a real skill.</h1>
        <p>Create or sign in to your creator account, verify your email, then submit the original skill and real demo for manual review.</p>
      </section>

      <section className="shell form-card">
        <h2>What we check</h2>
        <ul>
          <li>Your email must be verified before a submission enters the review queue.</li>
          <li>Your source must be the original skill or a source you have permission to publish.</li>
          <li>Your demo must use that same skill — not a different template or unrelated website.</li>
          <li>The demo should be responsive and tested on mobile, tablet, and desktop.</li>
          <li>Your AI-tool selection must match the actual tool the skill supports.</li>
          <li>Never include API keys, passwords, private tokens, or other secrets.</li>
        </ul>
        <p className="form-note">Read the <a href="/terms">Creator Terms</a> before continuing. Every submission enters manual review and may take up to 24 hours before it becomes publicly visible.</p>
      </section>

      <section className="shell form-card">
        <h2>Creator account + skill submission</h2>
        <SubmitForm />
      </section>
    </main>
  );
}
