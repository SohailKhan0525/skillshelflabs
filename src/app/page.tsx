"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Terminal,
  Cpu,
  Layers,
  ArrowUpRight,
  Code2,
  Rocket,
  GitBranch,
  ChevronRight,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const tracks = [
  {
    icon: Cpu,
    tag: "AI & Applied ML",
    title: "Autonomous AI & LLM Pipelines",
    desc: "Architect RAG engines, multi-agent workflows, and low-latency inference services built for production workloads.",
    metrics: "12 Modules • 4 Live Deployments",
    gradient: "from-indigo-500/20 via-purple-500/10 to-transparent",
  },
  {
    icon: Layers,
    tag: "Full-Stack Systems",
    title: "High-Concurrency Web Architecture",
    desc: "Master Next.js App Router, distributed edge caching, real-time WebSockets, and resilient cloud-native backends.",
    metrics: "10 Modules • 3 System Designs",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
  },
  {
    icon: Terminal,
    tag: "Creative Engineering",
    title: "Interactive 3D & Motion Systems",
    desc: "Craft 60fps micro-interactions, WebGL shaders, and fluid spatial interfaces using Framer Motion and Three.js.",
    metrics: "8 Modules • Custom Design System",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
];

const projects = [
  {
    name: "NeuralForge CLI",
    category: "Developer Tooling",
    status: "v2.4 Live",
    description: "Zero-config local benchmarking suite for quantized open-weights models and prompt evaluation.",
    stack: ["TypeScript", "Rust", "WebAssembly"],
  },
  {
    name: "PulseGrid Telemetry",
    category: "Distributed Systems",
    status: "Production",
    description: "Sub-millisecond observability dashboard streaming edge worker logs and cold-start metrics.",
    stack: ["Next.js 15", "ClickHouse", "Tailwind"],
  },
  {
    name: "Aether UI Kit",
    category: "Design Engineering",
    status: "Open Source",
    description: "Physics-driven component primitives engineered for dark-mode SaaS and AI developer portals.",
    stack: ["Framer Motion", "React 18", "Radix"],
  },
];

export default function SkillShelfLanding() {
  const [activeTab, setActiveTab] = useState<"builders" | "teams">("builders");

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050508]">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[140px]" />
        <div className="absolute top-[45%] -right-32 h-[420px] w-[520px] rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#050508]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 p-[1px]">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#050508]">
                <Code2 className="h-5 w-5 text-indigo-400" />
              </div>
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              SkillShelf <span className="text-indigo-400">Labs</span>
            </span>
            <span className="hidden rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-medium text-indigo-300 sm:inline-block">
              v2.0 ULTRA
            </span>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#tracks" className="transition hover:text-white">Tracks</a>
            <a href="#labs" className="transition hover:text-white">R&D Labs</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/SohailKhan0525/skillshelflabs"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[0.07] sm:flex"
            >
              <GitBranch className="h-3.5 w-3.5 text-indigo-400" />
              GitHub Repo
            </a>
            <a
              href="#join"
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500"
            >
              Enter the Lab
              <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-28">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Next-Gen Engineering Sandbox & Product Accelerator</span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Stop watching tutorials.{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              Ship real systems.
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg"
          >
            SkillShelf Labs is a high-velocity R&D ecosystem where developers master AI engineering,
            distributed web architecture, and interactive UI systems by building production-ready software.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="#tracks"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Explore Engineering Tracks
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#labs"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:border-white/25 hover:bg-white/[0.07]"
            >
              <Terminal className="h-4 w-4 text-cyan-400" />
              Inspect Live Blueprints
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-16 max-w-5xl rounded-2xl border border-white/10 bg-[#0b0c12]/90 p-2 shadow-2xl shadow-indigo-950/30 backdrop-blur-xl"
        >
          <div className="rounded-xl border border-white/[0.06] bg-[#07080d] p-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 font-mono text-xs text-slate-400">
                  skillshelf-cli — cmd.exe — 120x38
                </span>
              </div>
              <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] text-emerald-400">
                ● CLUSTER ONLINE
              </span>
            </div>

            <div className="mt-5 grid gap-6 font-mono text-xs sm:grid-cols-2">
              <div className="space-y-2.5 text-slate-300">
                <p className="text-slate-500"># Initialize SkillShelf Production Blueprint</p>
                <p>
                  <span className="text-indigo-400">&gt;</span> npx skillshelf-labs init --template ai-agent-mesh
                </p>
                <p className="text-emerald-400">✔ Verified TypeScript + Next.js 15 Edge Runtime</p>
                <p className="text-emerald-400">✔ Connected Vector Store &amp; Streaming Telemetry</p>
                <p className="text-cyan-300">➜ Deployed preview to https://edge.skillshelflabs.dev</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3.5">
                  <span className="text-[11px] text-slate-400">Build Velocity</span>
                  <p className="mt-1 text-xl font-bold text-white">3.8x Faster</p>
                  <span className="text-[10px] text-emerald-400">Zero boilerplate lock-in</span>
                </div>
                <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3.5">
                  <span className="text-[11px] text-slate-400">Architecture</span>
                  <p className="mt-1 text-xl font-bold text-white">99.98%</p>
                  <span className="text-[10px] text-indigo-400">Edge SLA benchmark</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <section id="tracks" className="mt-32">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                Core Curriculum &amp; Sprints
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Engineered for deep technical mastery
              </h2>
            </div>
            <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
              <button
                onClick={() => setActiveTab("builders")}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
                  activeTab === "builders"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Individual Builders
              </button>
              <button
                onClick={() => setActiveTab("teams")}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
                  activeTab === "teams"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Product Squads
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {tracks.map((track, idx) => {
              const Icon = track.icon;
              return (
                <motion.div
                  key={track.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.12, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d14] p-7"
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${track.gradient} opacity-60 transition-opacity group-hover:opacity-100`}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-slate-300">
                        {track.tag}
                      </span>
                      <Icon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-white">{track.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">{track.desc}</p>
                    <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-4 text-xs text-slate-300">
                      <span>{track.metrics}</span>
                      <span className="inline-flex items-center gap-1 font-medium text-indigo-400 group-hover:translate-x-1 transition-transform">
                        Syllabus <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section id="labs" className="mt-32">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-8 sm:p-12">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                Open-Source &amp; Internal Incubator
              </span>
              <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                Shipped inside SkillShelf Labs
              </h2>
              <p className="mt-3 text-sm text-slate-400">
                Every cohort contributes directly to battle-tested open-source repositories, micro-SaaS
                launches, and developer utilities.
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {projects.map((proj) => (
                <div
                  key={proj.name}
                  className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#07080d]/90 p-6 transition hover:border-indigo-500/40"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-indigo-400">{proj.category}</span>
                      <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300">
                        {proj.status}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-white">{proj.name}</h3>
                    <p className="mt-2 text-sm text-slate-400">{proj.description}</p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {proj.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="join" className="mt-28 text-center">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/50 via-[#0b0d18] to-cyan-950/40 px-6 py-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to build your next flagship engineering project?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-slate-300">
              Clone the v2-nextjs-ultra branch, customize your lab modules, or deploy straight to Vercel in under 60 seconds.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="https://github.com/SohailKhan0525/skillshelflabs"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
              >
                <Rocket className="h-4 w-4" />
                View Repository on GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.06] py-10 text-center text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <p>© {new Date().getFullYear()} SkillShelf Labs. Built with Next.js, TypeScript &amp; Framer Motion.</p>
          <div className="flex gap-6">
            <a href="https://github.com/SohailKhan0525/skillshelflabs" className="hover:text-slate-300">
              GitHub
            </a>
            <a href="#tracks" className="hover:text-slate-300">
              Curriculum
            </a>
            <a href="#labs" className="hover:text-slate-300">
              Labs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
