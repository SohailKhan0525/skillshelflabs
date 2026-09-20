import SiteFooter from "../../components/site-footer";
import SiteNav from "../../components/site-nav";

export const metadata = {
  title: "Terms for Creators — SkillShelf",
  description: "Creator terms for publishing skills on SkillShelf.",
};

export default function Terms() {
  return <main><SiteNav /><section className="page-head shell"><p className="eyebrow">CREATOR TERMS</p><h1>Terms for publishing.</h1><p>These terms are designed for creators who submit AI skills, source links, demos, and related material to SkillShelf.</p></section>
  <section className="shell content-grid"><article>
    <h2>1. You own or can publish the skill</h2><p>You confirm that you created the submitted skill or have permission to publish it. Do not upload or link to material you are not authorized to distribute.</p>
    <h2>2. Your listing must be accurate</h2><p>Names, descriptions, creator identity, organization, AI-tool support, source links, instructions, and claims must be truthful. Do not submit fake metrics, testimonials, examples, or capabilities.</p>
    <h2>3. The demo must be the actual skill</h2><p>If you provide a demo, it must demonstrate the same original skill being published, not a separate template or unrelated website. You must have the right to show the demo.</p>
    <h2>4. Responsive quality</h2><p>You confirm that the demo is intended to work responsively across desktop, tablet, and mobile screen sizes. SkillShelf does not certify every submitted demo, so creators remain responsible for testing their own work.</p>
    <h2>5. Third-party services</h2><p>Do not expose API keys, passwords, private tokens, or other secrets in a skill, demo, repository, screenshots, or instructions.</p>
    <h2>6. Manual review</h2><p>New submissions enter manual review before they become publicly visible. A reviewer checks the source, demo, AI-tool association, originality/permission, instructions, and responsive behavior. Review may take up to 24 hours. SkillShelf may request changes, reject, unpublish, or remove a listing that is misleading, unauthorized, unsafe, malicious, abusive, or materially inconsistent with these terms.</p>
    <h2>7. Your content remains yours</h2><p>You retain ownership of your submitted material. You grant SkillShelf permission to display the submitted listing, metadata, source/demo links, and previews as part of the discovery service.</p>
    <h2>8. No guarantee of availability</h2><p>SkillShelf may change, suspend, or remove features and does not guarantee that third-party source or demo URLs will remain available.</p>
    <h2>9. Acceptance</h2><p>By publishing, you confirm that you have read these creator terms and that your submission satisfies them.</p>
  </article></section><SiteFooter /></main>;
}
