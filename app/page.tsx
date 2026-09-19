import Link from "next/link";
import { getSupabase } from "../lib/supabase";

const platforms=[["chatgpt","ChatGPT"],["claude","Claude"],["codex","Codex"],["gemini","Gemini"],["cursor","Cursor"]];

export const dynamic = "force-dynamic";

export default async function Home(){
  const {data:skills=[]}=await getSupabase().from("skills").select("slug,name,description,category,ai_tool").eq("status","published").order("created_at",{ascending:false}).limit(6);
  return <main><nav className="nav"><Link href="/" className="brand">SKILLSHELF</Link><div className="nav-links"><Link href="/skills">Skills</Link><Link href="/ai">AI tools</Link><Link href="/submit">Publish a skill</Link></div></nav>
  <section className="hero shell"><p className="eyebrow">THE HOME FOR AI WEBSITE SKILLS</p><h1>Find skills that help you <span>build better websites.</span></h1><p className="hero-copy">A community library for AI skills that help with website design and development. Every skill gets a clear page explaining what it does, who it is for, how to use it, and where to get it.</p><div className="actions"><Link href="/skills" className="button">Explore website skills ↗</Link><Link href="/submit" className="text-link">Publish yours</Link></div></section>
  <section className="platforms shell"><div className="section-head"><p className="eyebrow">BROWSE BY AI TOOL</p><h2>Find website skills for the AI tool you already use.</h2></div><div className="platform-grid">{platforms.map(p=><Link href={"/ai/"+p[0]} className="platform" key={p[0]}><span>AI TOOL</span><strong>{p[1]}</strong><em>Explore website skills →</em></Link>)}</div></section>
  <section className="featured shell"><div className="section-head"><p className="eyebrow">YOUR LIBRARY</p><h2>Start with a skill that has context.</h2></div><div className="skill-grid">{skills.map(s=><Link href={"/skills/"+s.slug} className="skill" key={s.slug}><span className="tag">{s.category}</span><small>{s.ai_tool}</small><h3>{s.name}</h3><p>{s.description}</p><b>Understand this skill ↗</b></Link>)}</div></section>
  <section className="creator shell"><div><p className="eyebrow">FOR CREATORS</p><h2>Made a website skill?<br/><span>Give it a home.</span></h2></div><div><p>Publish the skill's purpose, instructions, examples, source, AI tool, and creator information so a new user or vibe coder can understand it before trying it.</p><Link href="/submit" className="button">Publish a website skill ↗</Link></div></section>
  <footer className="footer shell"><span>SKILLSHELF</span><span>Discover · Understand · Build</span></footer></main>
}