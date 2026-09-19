import Link from "next/link";

const skills = [["frontend-ui-ux-wizard","Frontend UI & UX Wizard","Claude","Website design"]];

export default function Skills(){
  return <main>
    <nav className="nav"><Link href="/" className="brand">SKILLSHELF</Link><div className="nav-links"><Link href="/ai">AI tools</Link><Link href="/submit">Publish a skill</Link></div></nav>
    <section className="page-head shell"><p className="eyebrow">WEBSITE SKILL LIBRARY</p><h1>Skills, explained simply.</h1><p>Browse AI skills for building websites. Each page is written so someone new to AI skills—or an experienced vibe coder—can quickly understand what the skill does and when to use it.</p></section>
    <section className="shell list">{skills.map(([slug,title,ai,tag])=><Link className="list-item" href={"/skills/"+slug} key={slug}><span>{tag}</span><div><small>{ai}</small><h2>{title}</h2></div><b>Understand ↗</b></Link>)}</section>
  </main>
}
