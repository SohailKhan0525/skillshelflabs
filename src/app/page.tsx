"use client";

import { useState } from "react";
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Atom,
  AudioWaveform,
  Check,
  ChevronRight,
  Code2,
  Compass,
  Cpu,
  GitBranch,
  Layers3,
  Orbit,
  Rocket,
  Sparkles,
  Terminal,
  WandSparkles,
} from "lucide-react";

const tracks = [
  {
    icon: Cpu,
    eyebrow: "01 / INTELLIGENCE",
    title: "AI, with intention.",
    description:
      "Go from clever prompts to capable systems. Explore agents, retrieval, evaluation, and inference through real builds.",
    forBuilders: "Build your own AI-native tools, one thoughtful experiment at a time.",
    forTeams: "Create dependable AI workflows that fit the way your team actually works.",
    tags: ["LLMs", "Agent systems", "RAG"],
    color: "violet",
  },
  {
    icon: Layers3,
    eyebrow: "02 / ARCHITECTURE",
    title: "Systems that scale.",
    description:
      "Design beautiful frontends and resilient backends with modern frameworks, edge patterns, and clear architecture.",
    forBuilders: "Turn a blank canvas into a production-minded full-stack product.",
    forTeams: "Align product thinking, system design, and delivery around one shared blueprint.",
    tags: ["Next.js", "Edge systems", "APIs"],
    color: "blue",
  },
  {
    icon: WandSparkles,
    eyebrow: "03 / EXPRESSION",
    title: "Interfaces that breathe.",
    description:
      "Blend interaction design, motion, and creative code into digital experiences that feel as good as they function.",
    forBuilders: "Learn the small details that make a product feel unexpectedly alive.",
    forTeams: "Build a coherent visual language with motion that earns its place.",
    tags: ["Motion", "Creative code", "WebGL"],
    color: "pearl",
  },
];

const principles = [
  {
    icon: Compass,
    title: "Follow your curiosity",
    description: "A clear direction, with enough room to explore the unknown.",
  },
  {
    icon: Code2,
    title: "Learn by making",
    description: "Real code, real decisions, and useful things that leave the sandbox.",
  },
  {
    icon: AudioWaveform,
    title: "Feel every detail",
    description: "From system architecture to the final frame of an interaction.",
  },
];

const stars = Array.from({ length: 38 }, (_, index) => ({
  left: (index * 37 + 11) % 100,
  top: (index * 61 + 7) % 100,
  delay: (index % 9) * 0.47,
  size: index % 8 === 0 ? 3 : 1.5,
}));

function Starfield() {
  return (
    <div className="starfield" aria-hidden="true">
      {stars.map((star, index) => (
        <i
          key={index}
          style={{
            left: star.left + "%",
            top: star.top + "%",
            width: star.size + "px",
            height: star.size + "px",
            animationDelay: star.delay + "s",
          }}
        />
      ))}
    </div>
  );
}

function CelestialOrb({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="orbital-stage" aria-label="An animated celestial light sculpture">
      <div className="orbital-aura" />
      <div className="orbit-ring orbit-ring-one" />
      <div className="orbit-ring orbit-ring-two" />
      <div className="orbit-ring orbit-ring-three" />
      <div className="orbit-dash orbit-dash-one" />
      <div className="celestial-core">
        <div className="core-sheen" />
        <div className="core-inner" />
      </div>
      <div className="orbit-node node-one" />
      <div className="orbit-node node-two" />
      <div className="orbit-node node-three" />
      <motion.div
        className="orb-label orb-label-top"
        animate={reducedMotion ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="orb-label-icon"><Sparkles size={14} /></span>
        <span><small>CREATIVE ENERGY</small><strong>Ideas in orbit</strong></span>
      </motion.div>
      <motion.div
        className="orb-label orb-label-bottom"
        animate={reducedMotion ? undefined : { y: [0, 9, 0] }}
        transition={{ duration: 6.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      >
        <span className="orb-label-pulse" />
        <span><small>THE LAB IS</small><strong>Open to possibility</strong></span>
        <ArrowUpRight size={15} />
      </motion.div>
      <div className="orb-caption"><span /> A SPACE TO BECOME</div>
    </div>
  );
}

export default function SkillShelfLanding() {
  const reducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });
  const [audience, setAudience] = useState<"builders" | "teams">("builders");

  return (
    <MotionConfig reducedMotion="user">
      <div className="site-shell">
        <motion.div className="scroll-progress" style={{ scaleX: progress }} />
        <div className="ambient ambient-one" aria-hidden="true" />
        <div className="ambient ambient-two" aria-hidden="true" />
        <Starfield />

        <header className="site-header">
          <a href="#home" className="brand" aria-label="SkillShelf Labs home">
            <span className="brand-mark"><Orbit size={21} strokeWidth={1.6} /></span>
            <span className="brand-wordmark">SkillShelf <span>Labs</span></span>
          </a>

          <nav className="main-nav" aria-label="Main navigation">
            <a href="#tracks">The universe</a>
            <a href="#method">Our philosophy</a>
            <a href="#blueprint">Inside the lab</a>
          </nav>

          <a
            className="header-cta"
            href="https://github.com/SohailKhan0525/skillshelflabs"
            target="_blank"
            rel="noreferrer"
          >
            Explore the source <ArrowUpRight size={15} />
          </a>
        </header>

        <main id="home">
          <section className="hero-section">
            <div className="hero-copy">
              <motion.div
                className="eyebrow-pill"
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="pill-star"><Sparkles size={13} /></span>
                A NEW FRONTIER FOR DIGITAL CREATORS
              </motion.div>

              <motion.h1
                className="hero-title"
                initial={reducedMotion ? false : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                Make room
                <br />
                for <span className="title-glow">wonder.</span>
              </motion.h1>

              <motion.p
                className="hero-description"
                initial={reducedMotion ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                SkillShelf Labs is where curious minds become extraordinary builders.
                Explore AI, craft graceful systems, and turn your most ambitious ideas into reality.
              </motion.p>

              <motion.div
                className="hero-actions"
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                <a className="button button-primary" href="#tracks">
                  Enter the universe <ArrowUpRight size={17} />
                </a>
                <a className="button button-quiet" href="#blueprint">
                  <span className="play-mark"><ArrowDown size={14} /></span>
                  Take a little tour
                </a>
              </motion.div>

              <motion.div
                className="hero-footnote"
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 1 }}
              >
                <span className="tiny-orbit"><Orbit size={15} /></span>
                <span>Curiosity is the beginning of everything.</span>
              </motion.div>
            </div>

            <motion.div
              className="hero-art-wrap"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.88, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 1.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <CelestialOrb reducedMotion={reducedMotion} />
            </motion.div>

            <div className="hero-bottom-line">
              <span>THOUGHTFULLY ENGINEERED</span>
              <span className="line-dash" />
              <span>ENDLESSLY CURIOUS</span>
              <span className="line-dash" />
              <span>ALWAYS IN MOTION</span>
            </div>
          </section>

          <section className="signal-strip" aria-label="SkillShelf Labs disciplines">
            <div className="signal-intro">A little bit of<br /><em>everything.</em></div>
            <div className="signal-item"><Atom size={19} /><span>Applied intelligence</span></div>
            <div className="signal-item"><Layers3 size={19} /><span>Beautiful architecture</span></div>
            <div className="signal-item"><Activity size={19} /><span>Living interfaces</span></div>
            <div className="signal-item"><Rocket size={19} /><span>Ideas made real</span></div>
          </section>

          <section className="tracks-section section-wrap" id="tracks">
            <motion.div
              className="section-heading"
              initial={reducedMotion ? false : { opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <div className="section-kicker"><span /> FIND YOUR ORBIT</div>
                <h2>A universe of skills.<br /><em>One place to evolve.</em></h2>
              </div>
              <p className="section-aside">
                Follow a thread of curiosity. Discover a new discipline.
                Bring something beautiful into the world.
              </p>
            </motion.div>

            <div className="audience-switch" role="group" aria-label="Choose your path">
              <span className="switch-label">MADE FOR</span>
              <button
                type="button"
                className={audience === "builders" ? "switch-option active" : "switch-option"}
                onClick={() => setAudience("builders")}
                aria-pressed={audience === "builders"}
              >
                Independent builders
              </button>
              <button
                type="button"
                className={audience === "teams" ? "switch-option active" : "switch-option"}
                onClick={() => setAudience("teams")}
                aria-pressed={audience === "teams"}
              >
                Product teams
              </button>
            </div>

            <div className="tracks-grid">
              {tracks.map((track, index) => {
                const Icon = track.icon;
                return (
                  <motion.article
                    key={track.title}
                    className={"track-card track-card-" + track.color}
                    initial={reducedMotion ? false : { opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.18 }}
                    transition={{
                      delay: reducedMotion ? 0 : index * 0.12,
                      duration: 0.75,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={reducedMotion ? undefined : { y: -7, transition: { duration: 0.25 } }}
                  >
                    <div className="card-topline">
                      <span>{track.eyebrow}</span>
                      <ArrowUpRight size={17} className="card-arrow" />
                    </div>
                    <div className="track-icon"><Icon size={23} strokeWidth={1.5} /></div>
                    <h3>{track.title}</h3>
                    <p>{track.description}</p>
                    <div className="track-audience-note">
                      <span className="note-sparkle"><Sparkles size={13} /></span>
                      {audience === "builders" ? track.forBuilders : track.forTeams}
                    </div>
                    <div className="track-tags">
                      {track.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </section>

          <section className="blueprint-section section-wrap" id="blueprint">
            <div className="blueprint-glow" aria-hidden="true" />
            <motion.div
              className="blueprint-copy"
              initial={reducedMotion ? false : { opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="section-kicker"><span /> INSIDE THE LAB</div>
              <h2>Big ideas.<br /><em>Beautifully built.</em></h2>
              <p className="blueprint-description">
                This is where abstract ideas become tangible. Follow a blueprint,
                experiment with the edges, and ship something that feels unmistakably yours.
              </p>
              <div className="blueprint-points">
                <div><span className="point-check"><Check size={13} /></span><span>Hands-on, project-first learning</span></div>
                <div><span className="point-check"><Check size={13} /></span><span>Modern tools, meaningful fundamentals</span></div>
                <div><span className="point-check"><Check size={13} /></span><span>Room to experiment, designed to ship</span></div>
              </div>
              <a className="text-link" href="https://github.com/SohailKhan0525/skillshelflabs" target="_blank" rel="noreferrer">
                Explore the open-source lab <ArrowRight size={16} />
              </a>
            </motion.div>

            <motion.div
              className="terminal-window"
              initial={reducedMotion ? false : { opacity: 0, y: 30, rotateX: 5, rotateY: -4 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={reducedMotion ? undefined : { y: -4, transition: { duration: 0.25 } }}
            >
              <div className="terminal-header">
                <div className="window-dots"><i /><i /><i /></div>
                <span className="terminal-title"><Terminal size={13} /> skillshelf / first-light.ts</span>
                <span className="terminal-status"><span /> READY</span>
              </div>
              <div className="terminal-body">
                <div className="code-line"><span className="line-number">01</span><span><b>const</b> vision = <i>"something extraordinary"</i>;</span></div>
                <div className="code-line"><span className="line-number">02</span><span><b>const</b> curiosity = <em>Infinity</em>;</span></div>
                <div className="code-line code-blank"><span className="line-number">03</span><span /></div>
                <div className="code-line"><span className="line-number">04</span><span><b>await</b> ideas.<strong>takeShape</strong>({'{'}</span></div>
                <div className="code-line indent"><span className="line-number">05</span><span>intention: <i>"make it matter"</i>,</span></div>
                <div className="code-line indent"><span className="line-number">06</span><span>craft: <i>"sweat the details"</i>,</span></div>
                <div className="code-line indent"><span className="line-number">07</span><span>limits: <b>null</b></span></div>
                <div className="code-line"><span className="line-number">08</span><span>{'}'});</span></div>
                <motion.div
                  className="terminal-output"
                  initial={reducedMotion ? false : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.75, duration: 0.8 }}
                >
                  <span className="output-symbol">✳</span>
                  <span>Build initialized. Possibility detected.</span>
                  <motion.i
                    className="cursor-block"
                    animate={reducedMotion ? undefined : { opacity: [1, 0.15, 1] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              </div>
              <div className="terminal-footer">
                <span><GitBranch size={12} /> main / a-world-of-possibility</span>
                <span>UTF-8 <span className="footer-separator">•</span> TypeScript</span>
              </div>
            </motion.div>
          </section>

          <section className="method-section section-wrap" id="method">
            <motion.div
              className="method-heading"
              initial={reducedMotion ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <div className="section-kicker"><span /> THE WAY WE BUILD</div>
              <h2>Good work has a <em>feeling.</em></h2>
              <p>Tools change. The instinct to make something meaningful never goes out of style.</p>
            </motion.div>
            <div className="principles-grid">
              {principles.map((principle, index) => {
                const Icon = principle.icon;
                return (
                  <motion.div
                    key={principle.title}
                    className="principle"
                    initial={reducedMotion ? false : { opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: reducedMotion ? 0 : index * 0.1, duration: 0.7 }}
                  >
                    <div className="principle-icon"><Icon size={21} strokeWidth={1.6} /></div>
                    <span className="principle-number">0{index + 1}</span>
                    <h3>{principle.title}</h3>
                    <p>{principle.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          <section className="final-section section-wrap">
            <div className="final-portal" aria-hidden="true">
              <div className="portal-ring portal-ring-a" />
              <div className="portal-ring portal-ring-b" />
              <div className="portal-center"><Sparkles size={26} strokeWidth={1.2} /></div>
            </div>
            <motion.div
              className="final-content"
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="section-kicker"><span /> YOUR NEXT CHAPTER STARTS HERE</div>
              <h2>There is more<br />to <em>imagine.</em></h2>
              <p>Bring your curiosity. Leave with something real.</p>
              <div className="final-actions">
                <a className="button button-primary" href="#tracks">
                  Find your first orbit <ArrowUpRight size={17} />
                </a>
                <a className="button button-quiet" href="https://github.com/SohailKhan0525/skillshelflabs" target="_blank" rel="noreferrer">
                  Meet us on GitHub <ChevronRight size={16} />
                </a>
              </div>
            </motion.div>
          </section>
        </main>

        <footer className="site-footer">
          <a href="#home" className="footer-brand"><span className="brand-mark"><Orbit size={17} /></span> SkillShelf <span>Labs</span></a>
          <p>Made with wonder, precision, and a little cosmic dust.</p>
          <div className="footer-links">
            <a href="#tracks">Explore</a>
            <a href="#method">Philosophy</a>
            <a href="https://github.com/SohailKhan0525/skillshelflabs" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={12} /></a>
          </div>
          <span className="copyright">© {new Date().getFullYear()} SkillShelf Labs</span>
        </footer>
      </div>
    </MotionConfig>
  );
}
