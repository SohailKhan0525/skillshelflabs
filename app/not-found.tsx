import Link from "next/link";
import SiteNav from "../components/site-nav";
export default function NotFound(){return <main><SiteNav /><section className="shell page-head"><p className="eyebrow">404</p><h1>That page is not here.</h1><p>The page may have moved or has not been published yet.</p><Link className="button" href="/">Back to SkillShelf ↗</Link></section></main>}