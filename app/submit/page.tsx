import SiteNav from "../../components/site-nav";
import SubmitForm from "./SubmitForm";

export const metadata = { title: "Publish a skill — SkillShelf", description: "Publish a real AI website skill to SkillShelf." };

export default function Submit() {
  return <main><SiteNav />
    <section className="page-head shell"><p className="eyebrow">FOR CREATORS · STEP 1</p><h1>Publish a real skill.</h1><p>Sign in or create a creator account, add the original skill and its real demo, then accept the creator terms before publishing.</p></section>
    <section className="shell form-card"><h2>Before you publish</h2><ul><li>Your source must be the original skill or a source you have permission to publish.</li><li>Your demo must use that same skill — not a different template or unrelated website.</li><li>The demo should be responsive and tested on mobile, tablet, and desktop.</li><li>Your AI-tool selection must match the actual tool the skill supports.</li><li>Never include API keys, passwords, private tokens, or other secrets.</li></ul><p className="form-note">Read the <a href="/terms">Creator Terms</a> before continuing.</p></section>
    <section className="shell form-card"><h2>Step 2 · Creator + skill</h2><SubmitForm /></section>
  </main>;
}
