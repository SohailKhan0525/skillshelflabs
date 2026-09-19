import Link from "next/link";
import { getSupabase } from "../../lib/supabase";

export const dynamic = "force-dynamic";

export default async function Skills(){
 const {data:skills=[]}=await getSupabase().from("skills").select("slug,name,ai_tool,category").eq("status","published").order("created_at",{ascending:false});
 return <main><nav className="nav"><Link href="/" className="brand">SKILLSHELF</Link><div className="nav-links"><Link href="/ai">AI tools</Link><Link href="/submit">Publish a skill</Link></div></nav>
 <section className="page-head shell"><p className="eyebrow">WEBSITE SKILL LIBRARY</p><h1>Skills, explained simply.</h1><p>Browse AI skills for building websites. Each page is written so someone new to AI skills—or an experienced vibe coder—can quickly understand what the skill does and when to use it.</p></section>
 <section className="shell list">{skills.length?skills.map(s=><Link className="list-item" href={"/skills/"+s.slug} key={s.slug}><span>{s.category}</span><div><small>{s.ai_tool}</small><h2>{s.name}</h2></div><b>Understand ↗</b></Link>):<div className="empty-state"><span>NO PUBLISHED SKILLS</span><h2>The library is empty.</h2><Link href="/submit" className="button">Publish a skill</Link></div>}</section></main>
}