"use client";

import { useEffect, useRef, useState } from "react";
import KeyboardScene from "@/components/KeyboardScene";

type Panel = "connect" | "learn" | null;

function BrandMark(){return <svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="#80ed62"/><g fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"><path d="M10 20c0-7 11-11 13-6s-7 12-10 7 1-12 9-12 12 10 7 17-13 7-18 3"/><path d="M6 21c8 7 22 1 21-8"/></g></svg>}

export default function Home(){
  const [paused,setPaused]=useState(false);
  const [reducedMotion,setReducedMotion]=useState(false);
  const [panel,setPanel]=useState<Panel>(null);
  const [connected,setConnected]=useState(false);
  const [connecting,setConnecting]=useState(false);
  const [replay,setReplay]=useState(0);
  const [notice,setNotice]=useState("");
  const dialog=useRef<HTMLDialogElement>(null);
  const connectTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const noticeTimer=useRef<ReturnType<typeof setTimeout>|null>(null);

  useEffect(()=>{
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync=()=>setReducedMotion(media.matches);sync();media.addEventListener("change",sync);
    return ()=>{media.removeEventListener("change",sync);if(connectTimer.current)clearTimeout(connectTimer.current);if(noticeTimer.current)clearTimeout(noticeTimer.current);};
  },[]);
  useEffect(()=>{if(panel)dialog.current?.showModal();else dialog.current?.close();},[panel]);
  function close(){if(connectTimer.current)clearTimeout(connectTimer.current);setConnecting(false);setPanel(null);}
  function connect(){
    setConnecting(true);
    connectTimer.current=setTimeout(()=>{setConnected(true);setConnecting(false);setPanel(null);setNotice("Demo wallet connected. You're all set.");},reducedMotion?0:1300);
  }
  useEffect(()=>{if(notice){noticeTimer.current=setTimeout(()=>setNotice(""),4500);return()=>{if(noticeTimer.current)clearTimeout(noticeTimer.current)}}},[notice]);
  function watch(){setPaused(false);setReplay(n=>n+1);setNotice(reducedMotion?"Your reduced motion preference is on. The illustration stays still.":"Playing the illustration from the beginning.");}

  return <main className="hero">
    <a className="brand" href="/" aria-label="Minto home"><BrandMark/><span>Minto</span></a>
    <div className="art-background" aria-hidden="true"/>
    <section className="hero-copy" aria-labelledby="headline">
      <h1 id="headline">One click.<br/>Zero friction.</h1>
      <p>Instant wallet connections, real-time status,<br className="desktop-break"/> and infrastructure built for scale.</p>
      <div className="hero-actions">
        <button className="button button-primary" onClick={()=>setPanel("connect")}>{connected?"Wallet Connected":"Connect Wallet"}{connected&&<span aria-hidden="true"> ✓</span>}</button>
        <button className="button button-secondary" onClick={watch}>Watch Demo</button>
      </div>
    </section>
    <KeyboardScene paused={paused||!!panel} reducedMotion={reducedMotion} connected={connected} replay={replay} onConnect={()=>setPanel("connect")} onLearn={()=>setPanel("learn")} onToggleMotion={()=>setPaused(p=>!p)}/>
    <div className={`toast ${notice?"visible":""}`} role="status" aria-live="polite">{notice}</div>
    <dialog ref={dialog} className="detail-dialog" onCancel={e=>{e.preventDefault();close()}} onClick={e=>{if(e.target===e.currentTarget)close()}} onClose={()=>setPanel(null)} aria-labelledby="dialog-title">
      <div className="dialog-content">
        <button className="close-dialog" onClick={close} aria-label="Close dialog"><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.7"/></svg></button>
        <div className="dialog-brand"><BrandMark/></div>
        {panel==="connect" ? <>
          <span className="eyebrow">INTERACTIVE PREVIEW</span>
          <h2 id="dialog-title">{connected?"You're connected.":"Your next move.\nOne click away."}</h2>
          <p>{connected?"The demo connection is active. Take a look at the keyboard—it's ready when you are.":"Try the wallet connection experience with a demo wallet. No account, wallet extension, or transaction needed."}</p>
          <div className="wallet-option"><span className="wallet-icon">↗</span><div><strong>Minto demo wallet</strong><small>{connected?"Preview connection active":"A safe space to try it out"}</small></div><span className={`wallet-dot ${connected?"active":""}`}/></div>
          {connected ? <button className="button button-primary dialog-action" onClick={()=>{setConnected(false);close();setNotice("Demo wallet disconnected.")}}>Disconnect demo wallet</button> : <button className="button button-primary dialog-action" disabled={connecting} onClick={connect}>{connecting?<><span className="spinner"/> Connecting…</>:"Connect demo wallet"}</button>}
          <small className="dialog-footnote">This is a visual concept. No real funds or wallet access.</small>
        </> : <>
          <span className="eyebrow">SMALL DETAILS. BIG DIFFERENCE.</span>
          <h2 id="dialog-title">Made to feel<br/>effortless.</h2>
          <p>A simple idea: connecting should feel as natural as pressing a key.</p>
          <div className="feature-list"><div><span>01</span><section><h3>One click to get going</h3><p>Try the demo connection directly from the keyboard.</p></section></div><div><span>02</span><section><h3>Every little detail, alive</h3><p>Press a key. Follow the cursor. Watch the signal flow.</p></section></div><div><span>03</span><section><h3>At your pace</h3><p>Pause the scene anytime. Reduced motion is respected automatically.</p></section></div></div>
          <button className="button button-primary dialog-action" onClick={()=>setPanel("connect")}>Try the connection <span aria-hidden="true">↗</span></button>
        </>}
      </div>
    </dialog>
  </main>;
}
