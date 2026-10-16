"use client";

import { useMemo, useState } from "react";
import { verifyQuote } from "@/lib/verifier";

const chapters = [
  { number: "01", title: "The question", subtitle: "Your buyer asks about your AI.", body: "Enterprise security forms ask how your system works. Start with what you know." },
  { number: "02", title: "The evidence", subtitle: "Build answers from your own facts.", body: "Turn interview notes into governance drafts, then match questions to sentences in that evidence." },
  { number: "03", title: "The check", subtitle: "A quote, or an honest gap.", body: "Qofeno checks each quote against its source. Unsupported answers become gaps to resolve." },
];
const documentTypes = [
  { number: "01", title: "AI Usage Policy", outline: ["Where AI is used", "Approved model providers", "Data sent to providers", "Human review"] },
  { number: "02", title: "Data Flow & Subprocessors", outline: ["Data categories", "Flow description", "Storage and retention", "Subprocessor table"] },
  { number: "03", title: "AI System Description", outline: ["Product summary", "AI features", "Inputs and outputs", "Known limitations"] },
  { number: "04", title: "AI Incident Runbook", outline: ["Roles", "Detect and triage", "Containment", "Customer notification"] },
  { number: "05", title: "EU AI Act Notes", outline: ["Direct AI interaction", "Suggested notice", "Generated content", "Items for an adviser"] },
];
const steps = [
  ["Interview", "Record what your product does, the providers you call, and the data you handle."],
  ["Documents", "Build five deterministic drafts from the answers you entered."],
  ["Questionnaire", "Import a buyer workbook or CSV and choose its question column."],
  ["Verify", "Check that each quoted sentence exists in the selected evidence."],
  ["Export", "Confirm answers before exporting the workbook and evidence pack."],
];

function Logo({ symbolOnly = false }: { symbolOnly?: boolean }) {
  return <span className="brand-lockup"><img className="brand-symbol-image" src="/brand/qofeno-symbol.svg" alt="" />{!symbolOnly && <span className="brand-name">qofeno</span>}</span>;
}

function Verifier() {
  const [evidence, setEvidence] = useState("");
  const [quote, setQuote] = useState("");
  const result = useMemo(() => quote.length ? verifyQuote(evidence, quote) : null, [evidence, quote]);
  const reason = result && !result.supported ? {
    "missing-quote": "Add the exact sentence you want to check.",
    "quote-too-short": "The quote must contain at least 8 characters.",
    "quote-not-found": "This quote does not appear in the evidence you provided.",
  }[result.reason] : "";

  return <div className="verifier-panel">
    <div className="verifier-top"><div><span className="eyebrow">LIVE VERIFIER</span><h3>Does the quote hold up?</h3></div><span className="mode-chip"><span /> Runs in this browser</span></div>
    <p className="muted">Paste a source passage and the claim’s quote. Nothing is sent to a server or saved by this checker.</p>
    <label className="field-label" htmlFor="evidence">Evidence text</label>
    <textarea id="evidence" value={evidence} onChange={(event) => setEvidence(event.target.value)} placeholder="Paste the original evidence text…" rows={5} />
    <label className="field-label" htmlFor="quote">Claimed quote</label>
    <textarea id="quote" value={quote} onChange={(event) => setQuote(event.target.value)} placeholder="Paste the sentence used to support an answer…" rows={3} />
    {result && <div className={result.supported ? "result result-supported" : "result result-gap"} role="status" aria-live="polite">
      <span className="result-mark" aria-hidden="true">{result.supported ? "✓" : "!"}</span><div><strong>{result.supported ? "Supported: the quote appears in the evidence" : "Would be downgraded to a gap"}</strong><p>{result.supported ? "The quote was found, ignoring case and extra whitespace." : reason}</p>{result.supported && <blockquote>“{evidence.slice(result.start, result.end)}”</blockquote>}</div>
    </div>}
    <div className="verifier-foot"><span>Template mode · no AI used</span><button type="button" className="text-button" onClick={() => { setEvidence(""); setQuote(""); }}>Clear fields ↗</button></div>
  </div>;
}

export default function QofenoHome() {
  const [chapter, setChapter] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const current = chapters[chapter];

  return <main>
    <header className="site-header">
      <a href="#home" className="brand-link" aria-label="Qofeno home"><Logo /></a>
      <nav aria-label="Main navigation"><a href="#how-it-works">How it works</a><a href="#verifier">Verifier</a><a href="#documents">Documents</a><a href="#security">Security</a></nav>
      <span className="mode-chip nav-mode">Template mode</span><a className="button button-dark nav-cta" href="#verifier">Open the verifier <span>↗</span></a>
    </header>
    <section id="home" className="hero">
      <div className="hero-grain" aria-hidden="true" /><div className="hero-glow hero-glow-one" aria-hidden="true" /><div className="hero-glow hero-glow-two" aria-hidden="true" />
      <div className="hero-copy"><p className="eyebrow"><span className="eyebrow-dot" /> EVIDENCE-FIRST AI SECURITY</p>
        <h1>{current.title}<br /><em>{chapter === 0 ? "starts here." : chapter === 1 ? "stays grounded." : "or stays a gap."}</em></h1>
        <p className="hero-subtitle">{current.subtitle}</p><p className="hero-body">{current.body}</p>
        <div className="hero-actions"><a className="button button-dark" href="#verifier">Open the verifier <span>↗</span></a><a className="button button-outline" href="#full-run">See how it works <span>↓</span></a></div>
        <div className="hero-note"><span className="note-rule" /> Template mode: no AI used</div>
      </div>
      <div className="hero-art" aria-label="Abstract layered Q symbol artwork" role="img">
        <div className="art-orbit art-orbit-a" /><div className="art-orbit art-orbit-b" /><div className="art-paper paper-one" /><div className="art-paper paper-two" /><div className="art-strip strip-one" /><div className="art-strip strip-two" /><div className="art-check">✓</div><div className="art-check check-two">✓</div><div className="q-sculpture"><span>Q</span><i /></div><div className="art-caption"><span>01 / 03</span><span>FACTS IN · EVIDENCE OUT</span></div>
      </div>
      <div className="chapter-control"><span className="chapter-label">CHAPTER</span><strong aria-live="polite">{current.number}</strong><div className="chapter-progress"><span style={{ width: ((chapter + 1) / 3) * 100 + "%" }} /></div><div className="chapter-buttons"><button type="button" onClick={() => setChapter((chapter + 2) % 3)} aria-label="Previous chapter">← Prev</button><button type="button" onClick={() => setChapter((chapter + 1) % 3)} aria-label="Next chapter">Next →</button></div></div>
      <div className="hero-bottom"><span>AI QUESTIONNAIRES, WITHOUT INVENTED ANSWERS</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>
    <section className="problem-section section-pad"><div className="section-index">01 / THE PROBLEM</div><div className="problem-layout"><h2>When the security form arrives, <em>what can you prove?</em></h2><div className="problem-copy"><p>Enterprise buyers ask which models you use, what happens to customer data, and how you handle incidents.</p><p>Small AI teams may know how their product works but have not written the evidence down. Qofeno turns what you provide into reviewable drafts and checks every quoted answer against its source.</p></div></div><div className="problem-rule"><span>NO CLAIM WITHOUT A SOURCE</span><span>NO SOURCE? SHOW THE GAP.</span></div></section>
    <section id="full-run" className="full-run-section section-pad"><div className="section-index">02 / A WORKFLOW</div><div className="full-run-head"><h2>From founder notes<br /><em>to a checked export.</em></h2><p>This is a workflow overview, not a customer result. The working verifier below operates on the text you provide.</p></div><div className="workflow-strip">{steps.map(([title, description], index) => <div className="workflow-step" key={title}><span className="workflow-number">0{index + 1}</span><h3>{title}</h3><p>{description}</p><span className="workflow-arrow" aria-hidden="true">↘</span></div>)}</div><p className="preview-caption">Actual product videos are not yet available in this repository.</p></section>
    <section id="verifier" className="verifier-section section-pad"><div className="section-index">03 / LIVE VERIFIER</div><div className="verifier-layout"><div className="verifier-intro"><h2>Evidence first.<br /><em>Every time.</em></h2><p>Paste a sentence from your evidence and the quote used in an answer. The verifier checks the text directly. Unsupported quotes become a gap, not a confident guess.</p><div className="truth-list"><span>✓ Case-insensitive match</span><span>✓ Extra whitespace ignored</span><span>✓ No network request</span></div></div><Verifier /></div></section>
    <section id="how-it-works" className="steps-section section-pad"><div className="section-index">04 / HOW IT WORKS</div><div className="steps-heading"><h2>Five steps, <em>one source of truth.</em></h2><p>Each stage stays tied to the facts entered by the founder.</p></div><div className="steps-layout">
      <div className="steps-list" role="tablist" aria-label="Workflow steps">{steps.map(([title, description], index) => <button key={title} type="button" role="tab" aria-selected={activeStep === index} className={activeStep === index ? "step-tab active" : "step-tab"} onClick={() => setActiveStep(index)}><span>0{index + 1}</span><strong>{title}</strong><span className="tab-indicator">{activeStep === index ? "−" : "+"}</span><small>{description}</small></button>)}</div>
      <div className="step-detail" role="tabpanel"><span className="step-detail-number">STEP 0{activeStep + 1}</span><div className="step-detail-mark">{["↳", "▤", "⇧", "✓", "⇩"][activeStep]}</div><h3>{steps[activeStep][0]}</h3><p>{steps[activeStep][1]}</p><span className="step-detail-note">LOCAL-FIRST · TEMPLATE MODE</span></div>
    </div></section>
    <section id="documents" className="documents-section section-pad"><div className="section-index">05 / THE DOCUMENTS</div><div className="documents-heading"><h2>Five drafts.<br /><em>Built from your answers.</em></h2><p>Missing details stay marked for founder confirmation. Nothing is silently filled in.</p></div><div className="documents-grid">{documentTypes.map((document) => <article className="document-card" key={document.number}><span className="document-number">{document.number}</span><h3>{document.title}</h3><ol>{document.outline.map((item) => <li key={item}>{item}</li>)}</ol><span className="document-card-foot">DRAFT · REVIEW REQUIRED</span></article>)}</div></section>
    <section id="security" className="data-section section-pad"><div className="section-index">06 / YOUR DATA</div><div className="data-layout"><div><h2>Your answers stay <em>with you.</em></h2><p>The verifier processes its inputs in your browser. It makes no AI calls and does not send the text to a server.</p><p>Workspace persistence, questionnaire import and export are not connected in this build. Do not treat entered text as saved when you close or reload the page.</p></div><div className="data-label"><div className="data-label-title">DATA FACTS <span>QOFENO / TEMPLATE MODE</span></div><div className="data-fact"><span>AI MODEL CALLS</span><strong>NONE</strong></div><div className="data-fact"><span>SERVER STORAGE</span><strong>NONE</strong></div><div className="data-fact"><span>LOCAL AUTOSAVE</span><strong>NOT CONNECTED</strong></div><div className="data-label-note">The verifier does not transmit or persist its inputs.</div></div></div></section>
    <section className="modes-section section-pad"><div className="section-index">07 / TWO MODES, HONESTLY</div><div className="modes-grid"><article className="mode-card mode-current"><span className="mode-status">AVAILABLE NOW</span><h3>Template mode</h3><p>Deterministic templates and extractive sentence matching. This verifier never invents evidence or rewrites a quoted sentence.</p><ul><li>Browser-only verifier</li><li>No AI provider calls</li><li>Founder confirms exports</li></ul></article><article className="mode-card"><span className="mode-status mode-later">ARRIVES WITH THE BACKEND</span><h3>Claude mode</h3><p>Fluent drafting and evidence matching are planned for a later backend. There is no control to enable it here.</p><ul><li>Not connected</li><li>No data transmitted</li><li>No settings toggle shown</li></ul></article></div></section>
    <section className="limits-section section-pad"><div className="section-index">08 / BOUNDARIES</div><div className="limits-content"><h2>Useful evidence.<br /><em>Not a certification.</em></h2><p>Qofeno does not certify your company, give legal advice or replace an audit. It does not invent controls, vendors or certifications. A founder must review every document and confirm each answer before it is exported.</p><a className="button button-dark" href="#verifier">Try the verifier <span>↗</span></a></div><div className="limits-symbol" aria-hidden="true"><Logo symbolOnly /></div></section>
    <section className="faq-section section-pad"><div className="section-index">09 / FAQ</div><div className="faq-layout"><h2>Clear answers<br /><em>about the tool.</em></h2><div className="faq-list">{[
      ["Does Qofeno use an AI model in this version?", "No. Template mode uses deterministic templates and text matching. No third-party AI calls are made."],
      ["Does the app send my questionnaire to a server?", "The verifier processes its inputs locally and does not send or save them. Workspace persistence and questionnaire import/export are not connected in this implementation yet."],
      ["Can Qofeno certify my company?", "No. It does not certify a company, provide legal advice or replace an audit."],
      ["When can I use Claude mode?", "Claude mode is planned for a future backend. No Claude connection or toggle exists in this frontend."],
    ].map(([question, answer], index) => <div className="faq-item" key={question}><button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? null : index)}><span>{question}</span><strong>{openFaq === index ? "−" : "+"}</strong></button>{openFaq === index && <p>{answer}</p>}</div>)}</div></div></section>
    <footer className="site-footer"><div className="footer-main"><a href="#home" className="brand-link"><Logo /></a><span>Security answers grounded in evidence.</span><a className="button button-dark" href="#verifier">Open the verifier <span>↗</span></a></div><div className="footer-bottom"><span>Template mode · no AI used</span><span>© {new Date().getFullYear()} Qofeno</span></div></footer>
  </main>;
}
