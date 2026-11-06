import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

type Session = { id: string; number: string; title: string; genre: string; mood: string; bpm: string; color: string; description: string; notes: string[] };
const sessions: Session[] = [
  { id: 'slow', number: '001', title: 'THE SLOW\nBURN', genre: 'DOWNTEMPO / DUB', mood: 'Ease into it.', bpm: '80', color: '#fa7254', description: 'Soft edges. Heavy bass. A little space between the notes. The sound of the night finding its feet.', notes: ['Warm electric keys', 'Dubby low-end', 'Unhurried percussion'] },
  { id: 'deep', number: '002', title: 'DEEP\nIN THE CUT', genre: 'DEEP HOUSE / SOUL', mood: 'Find your pocket.', bpm: '112', color: '#a8b7ff', description: 'Round basslines and a pulse that settles somewhere behind your ribs. For that one-more-record feeling.', notes: ['Velvet chords', 'Four-on-the-floor pulse', 'After-dark atmosphere'] },
  { id: 'electric', number: '003', title: 'OUT OF\nORBIT', genre: 'ELECTRONIC / LEFTFIELD', mood: 'Take the long way.', bpm: '124', color: '#dfff00', description: 'A curious little transmission from the other side of the dance floor. Familiar enough to move to. Strange enough to stay.', notes: ['Playful arpeggios', 'Analog textures', 'A slightly cosmic detour'] },
];

function Arrow({ diagonal = false, className = '' }: { diagonal?: boolean; className?: string }) {
  return <svg aria-hidden="true" className={`arrow ${className}`} viewBox="0 0 32 32" fill="none"><path d={diagonal ? 'M7 25 25 7M7 7h18v18' : 'M4 16h24M17 5l11 11-11 11'} stroke="currentColor" strokeWidth="1.8" /></svg>;
}
function Asterisk({ className = '' }: { className?: string }) {
  return <svg className={`asterisk ${className}`} viewBox="0 0 100 100" fill="none" aria-hidden="true">{[0, 30, 60, 90, 120, 150].map(a => <path key={a} d="M50 3V97" transform={`rotate(${a} 50 50)`} stroke="currentColor" strokeWidth="7" />)}</svg>;
}
function PlaybackIcon({ playing }: { playing: boolean }) {
  return <svg className="playback-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">{playing ? <><rect x="3" y="2" width="3" height="12" /><rect x="10" y="2" width="3" height="12" /></> : <path d="M4 2v12l10-6z" />}</svg>;
}
function Magnet({ children, className = '', disabled }: { children: ReactNode; className?: string; disabled: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { contextSafe } = useGSAP({ scope: ref });
  const move = contextSafe((e: MouseEvent<HTMLSpanElement>) => {
    if (disabled || !window.matchMedia('(pointer: fine)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    gsap.to(ref.current, { x: (e.clientX - rect.left - rect.width / 2) * 0.17, y: (e.clientY - rect.top - rect.height / 2) * 0.17, duration: 0.4, overwrite: 'auto' });
  });
  const leave = contextSafe(() => { gsap.to(ref.current, { x: 0, y: 0, duration: disabled ? 0 : 0.7, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' }); });
  return <span ref={ref} onMouseMove={move} onMouseLeave={leave} className={`magnet ${className}`}>{children}</span>;
}

function Vinyl({ small = false }: { small?: boolean }) {
  return <div className={`vinyl ${small ? 'vinyl-small' : ''}`} aria-hidden="true">
    <div className="record-grooves" />
    <div className="record-sheen" />
    <div className="record-label">
      <svg viewBox="0 0 200 200" className="label-type"><defs><path id={small ? 'label-circle-small' : 'label-circle'} d="M100,100m-76,0a76,76 0 1,1 152,0a76,76 0 1,1 -152,0" /></defs><text><textPath href={small ? '#label-circle-small' : '#label-circle'} textLength="471">AFTERHOURS • FOR THE LOVE OF LISTENING • </textPath></text></svg>
      <span className="record-side">SIDE A</span><Asterisk /><span className="record-speed">33⅓ RPM<br />STEREO / AH—001</span><i className="spindle" />
    </div>
  </div>;
}

function AlbumArt({ session }: { session: Session }) {
  return <div className={`album-art art-${session.id}`} style={{ '--album-color': session.color } as CSSProperties} aria-hidden="true">
    <div className="sleeve-top"><span>AFTERHOURS®</span><span>SELECTS / {session.number}</span></div>
    <div className="album-graphic">{session.id === 'slow' ? <div className="sun-rings">{Array.from({ length: 8 }, (_, i) => <i key={i} style={{ '--i': i } as CSSProperties} />)}</div> : session.id === 'deep' ? <div className="deep-grid">{Array.from({ length: 25 }, (_, i) => <i key={i} />)}</div> : <div className="orbit-lines">{[0, 1, 2, 3, 4].map(i => <i key={i} style={{ '--i': i } as CSSProperties} />)}<span /></div>}</div>
    <div className="sleeve-title">{session.title.split('\n').map(line => <span key={line}>{line}</span>)}</div>
    <div className="sleeve-bottom"><span>NO SKIPS.<br />NO SHORTCUTS.</span><span className="barcode">||||| |||| || ||||| |||</span><span>{session.bpm}<br />BPM</span></div>
  </div>;
}

function Menu({ close, motion }: { close: (id?: string) => void; motion: boolean }) {
  const root = useRef<HTMLDialogElement>(null);
  useEffect(() => { const d = root.current!; d.showModal(); return () => d.close(); }, []);
  const { contextSafe } = useGSAP(() => {
    if (!motion) return;
    gsap.from('.menu-inner', { yPercent: -105, duration: 0.7, ease: 'power4.inOut' });
    gsap.from('.menu-link span', { yPercent: 110, stagger: 0.08, duration: 0.8, delay: 0.3, ease: 'power4.out' });
  }, { scope: root });
  const dismiss = contextSafe((id?: string) => {
    gsap.to('.menu-inner', { yPercent: -105, duration: motion ? 0.5 : 0, ease: 'power3.inOut', onComplete: () => close(id) });
  });
  return <dialog ref={root} className="menu-dialog" aria-label="Site navigation" onCancel={e => { e.preventDefault(); dismiss(); }}><div className="menu-inner">
    <div className="menu-top"><span className="wordmark">AFTERHOURS<span>®</span></span><button className="text-button" autoFocus onClick={() => dismiss()}>CLOSE <span className="close-symbol">×</span></button></div>
    <nav>{[['Our frequency', 'frequency'], ['The listening room', 'sessions'], ['The club', 'club']].map(([label, id], i) => <button className="menu-link" key={id} onClick={() => dismiss(id)}><small>0{i + 1}</small><span>{label}</span><Arrow diagonal /></button>)}</nav>
    <div className="menu-bottom"><span>GOOD RECORDS. OPEN MINDS.</span><Asterisk /><span>THE NIGHT IS STILL YOUNG.</span></div>
  </div></dialog>;
}

function SessionDialog({ session, close, playing, toggle, motion, audioError }: { session: Session; close: () => void; playing: boolean; toggle: () => void; motion: boolean; audioError: string }) {
  const root = useRef<HTMLDialogElement>(null);
  useEffect(() => { const d = root.current!; d.showModal(); return () => d.close(); }, []);
  const { contextSafe } = useGSAP(() => { if (motion) gsap.from('.session-panel', { y: 60, autoAlpha: 0, duration: 0.55, ease: 'power3.out' }); }, { scope: root });
  const dismiss = contextSafe(() => { gsap.to('.session-panel', { y: 30, autoAlpha: 0, duration: motion ? 0.25 : 0, onComplete: close }); });
  return <dialog ref={root} className="session-dialog" aria-labelledby="session-title" onCancel={e => { e.preventDefault(); dismiss(); }} onClick={e => { if (e.target === root.current) dismiss(); }}><div className="session-panel">
    <button className="dialog-close" autoFocus aria-label="Close listening session" onClick={dismiss}>×</button>
    <AlbumArt session={session} />
    <div className="session-info"><span className="eyebrow">ON THE TURNTABLE / {session.number}</span><h2 id="session-title">{session.title.replace('\n', ' ')}</h2><span className="session-genre">{session.genre} — {session.bpm} BPM</span><p>{session.description}</p><ul>{session.notes.map(note => <li key={note}>{note}</li>)}</ul><button className="solid-button" onClick={toggle}>{playing ? 'Pause the preview' : 'Drop the needle'}<PlaybackIcon playing={playing} /></button><p className="preview-note">An original 24-second studio sketch. Loops while you listen.</p>{audioError && <p role="status">{audioError}</p>}</div>
  </div></dialog>;
}

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const introPlayed = useRef(false);
  const [motion, setMotion] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [menu, setMenu] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [current, setCurrent] = useState(sessions[0]);
  const [sessionOpen, setSessionOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const pref = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = (event: MediaQueryListEvent) => setMotion(!event.matches);
    pref.addEventListener('change', change);
    try { setSaved(localStorage.getItem('afterhours-club') === 'joined'); } catch { /* Local storage is optional. */ }
    return () => pref.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    if (!menu && !sessionOpen) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = before; };
  }, [menu, sessionOpen]);

  const { contextSafe } = useGSAP(() => {
    const mm = gsap.matchMedia();
    const firstRun = !introPlayed.current;
    introPlayed.current = true;
    if (motion) {
      const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
      if (firstRun) {
        intro.set('.intro-curtain', { display: 'flex' }).fromTo('.intro-mark', { scale: 0.7, rotation: -45 }, { scale: 1, rotation: 0, duration: 0.5 })
          .to('.intro-curtain', { yPercent: -100, duration: 0.85, ease: 'power4.inOut' }, 0.45)
          .from('.hero-line span', { yPercent: 115, rotation: 3, duration: 1.15, stagger: 0.1 }, 0.7)
          .from('.turntable', { x: 120, rotation: 24, autoAlpha: 0, duration: 1.4 }, 0.8)
          .from('.hero-detail, .hero-footer', { y: 25, autoAlpha: 0, duration: 0.8, stagger: 0.1 }, 1.2)
          .set('.intro-curtain', { display: 'none' });
      } else gsap.set('.intro-curtain', { display: 'none' });

      const spin = gsap.to('.hero-disc .vinyl', { rotation: 360, duration: 35, repeat: -1, ease: 'none' });
      ScrollTrigger.create({ trigger: '.hero', start: 'top bottom', end: 'bottom top', onToggle: self => self.isActive ? spin.resume() : spin.pause() });
      gsap.to('.ticker-track', { xPercent: -50, repeat: -1, duration: 22, ease: 'none' });
      gsap.to('.club-asterisk', { rotation: 180, ease: 'none', scrollTrigger: { trigger: '.club', start: 'top bottom', end: 'bottom top', scrub: 1 } });

      mm.add('(min-width: 800px)', () => {
        gsap.to('.hero-disc', { y: 100, rotation: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
      }, root);

      gsap.from('.manifesto-word', { opacity: 0.17, stagger: 0.12, ease: 'none', scrollTrigger: { trigger: '.manifesto-copy', start: 'top 80%', end: 'bottom 45%', scrub: 0.5 } });
      gsap.from('.frequency-stamp', { rotation: -45, scale: 0.7, duration: 1.2, ease: 'elastic.out(1, 0.7)', scrollTrigger: { trigger: '.frequency-stamp', start: 'top 88%', once: true } });

      mm.add('(min-width: 1000px) and (min-height: 650px)', () => {
        const track = root.current!.querySelector<HTMLElement>('.records-track')!;
        gsap.to(track, { x: () => -(track.scrollWidth - window.innerWidth + 56), ease: 'none', scrollTrigger: { id: 'records', trigger: '.listening-room', start: 'top top', end: () => `+=${track.scrollWidth - window.innerWidth + 400}`, pin: true, scrub: 0.8, invalidateOnRefresh: true, onUpdate: self => { gsap.set('.collection-progress i', { scaleX: self.progress }); } } });
      }, root);

      gsap.utils.toArray<HTMLElement>('.reveal').forEach(el => {
        gsap.from(el, { y: 45, autoAlpha: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
      });
      gsap.from('.footer-word span', { yPercent: 105, stagger: 0.04, duration: 1, ease: 'power4.out', scrollTrigger: { trigger: '.footer-word', start: 'top 96%', once: true } });
    } else gsap.set('.intro-curtain', { display: 'none' });

    let disposed = false;
    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    return () => { disposed = true; mm.revert(); };
  }, { scope: root, dependencies: [motion], revertOnUpdate: true });

  useGSAP(() => {
    if (!playing || !motion) return;
    gsap.to('.equalizer i', { scaleY: i => [0.3, 0.8, 0.45, 1][i % 4], repeat: -1, yoyo: true, stagger: 0.13, duration: 0.35, ease: 'sine.inOut' });
  }, { scope: root, dependencies: [playing, motion], revertOnUpdate: true });

  const navigate = contextSafe((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const pin = id === 'sessions' ? ScrollTrigger.getById('records') : undefined;
    gsap.to(window, { scrollTo: { y: pin ? pin.start : el, offsetY: id === 'sessions' ? 0 : 30, autoKill: true }, duration: motion ? 1.15 : 0, ease: 'power3.inOut', onComplete: () => el.focus({ preventScroll: true }) });
  });
  // Run navigation after the menu has unmounted. Calling the parent GSAP
  // context inside the menu context would attach it to the menu cleanup.
  useEffect(() => {
    if (!menu && pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  }, [menu, pendingNavigation]);

  const hoverRecord = contextSafe((event: MouseEvent<HTMLButtonElement>, active: boolean) => {
    if (!motion || !window.matchMedia('(pointer: fine)').matches) return;
    gsap.to(event.currentTarget.querySelector('.album-art'), { y: active ? -8 : 0, rotation: active ? -2 : 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
  });
  const focusRecord = contextSafe((event: React.FocusEvent<HTMLButtonElement>, index: number) => {
    if (!event.currentTarget.matches(':focus-visible')) return;
    const trigger = ScrollTrigger.getById('records');
    if (!trigger) return;
    gsap.to(window, { scrollTo: trigger.start + (trigger.end - trigger.start) * index / 3, duration: motion ? 0.45 : 0, ease: 'power2.out' });
  });
  const toggleAudio = async () => {
    if (!audio.current) return;
    setAudioError('');
    if (!audio.current.paused) { audio.current.pause(); return; }
    try { await audio.current.play(); } catch { setAudioError('The preview could not start. Please try again.'); }
  };
  const openSession = (session: Session) => {
    if (current.id !== session.id) { audio.current?.pause(); setPlaying(false); setCurrent(session); }
    setSessionOpen(true);
  };
  const saveClub = () => {
    setSaved(true);
    try { localStorage.setItem('afterhours-club', 'joined'); } catch { /* The confirmation still works without persistence. */ }
  };

  return <div ref={root} className={`site ${motion ? 'motion-on' : 'motion-off'}`}>
    <a href="#main" className="skip-link">Skip to content</a>
    <div className="intro-curtain" aria-hidden="true"><Asterisk className="intro-mark" /><span>LET THE NIGHT IN.</span></div>
    <audio ref={audio} src={`/audio/${current.id}.mp3`} preload="none" loop onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setPlaying(false); setAudioError('This preview is unavailable. Try another session.'); }} />
    <main id="main" tabIndex={-1}>
      <section className="hero" aria-labelledby="hero-title">
        <header className="header"><a href="#" className="wordmark" aria-label="Afterhours home" onClick={e => { e.preventDefault(); navigate('main'); }}>AFTERHOURS<span>®</span></a><span className="header-caption">AN INDEPENDENT<br />LISTENING CLUB</span><div className="header-actions"><button className={`sound-button ${playing ? 'is-playing' : ''}`} onClick={toggleAudio} aria-pressed={playing} aria-label={playing ? "Turn sound off" : "Turn sound on"}><span className="equalizer" aria-hidden="true"><i /><i /><i /><i /></span><span>SOUND {playing ? 'ON' : 'OFF'}</span></button><button className="menu-button" onClick={() => setMenu(true)} aria-haspopup="dialog">MENU <span><i /><i /></span></button></div></header>
        <div className="hero-eyebrow hero-detail"><span><i className="status-dot" /> HIGH FIDELITY. LOW PRESSURE.</span><span>EST. AFTER DARK / VOL. 001</span></div>
        <div className="hero-content"><div className="hero-copy"><h1 id="hero-title"><span className="hero-line"><span>STAY</span></span><span className="hero-line"><span>A LITTLE</span></span><span className="hero-line"><span>LATER<span className="title-period">.</span></span></span></h1><div className="hero-description hero-detail"><p>For the records you haven’t heard.<br />And the nights you don’t want to end.</p><Magnet disabled={!motion}><button className="pill-button" onClick={() => navigate('sessions')}>Find your frequency <Arrow diagonal /></button></Magnet></div></div>
          <div className="turntable"><div className="record-outline" /><span className="record-coordinate">AH—001 / 12-INCH LONG PLAY</span><div className="hero-disc"><Vinyl /></div><svg className="tonearm" viewBox="0 0 260 570" aria-hidden="true"><defs><linearGradient id="metal"><stop stopColor="#494a42" /><stop offset=".25" stopColor="#f8f9de" /><stop offset=".47" stopColor="#96978a" /><stop offset=".62" stopColor="#fffde4" /><stop offset="1" stopColor="#53544c" /></linearGradient></defs><circle cx="210" cy="69" r="39" fill="#1a1b15" /><circle cx="210" cy="69" r="28" fill="url(#metal)" /><circle cx="210" cy="69" r="15" fill="#292b25" /><path d="M210 69V330Q210 360 188 384L96 476" stroke="#111" strokeWidth="20" fill="none" opacity=".25" transform="translate(5 6)" /><path d="M210 69V330Q210 360 188 384L96 476" stroke="url(#metal)" strokeWidth="13" fill="none" /><path d="m97 450 26 25-48 55-30-29z" fill="#262821" /><path d="m47 498 30 27-11 12-30-27z" fill="#fa7254" /><rect x="191" y="105" width="38" height="51" rx="4" fill="url(#metal)" /></svg><div className="record-sticker"><span>ALL EARS.</span><span>NO RULES.</span><Asterisk /></div><button className="needle-button" onClick={toggleAudio} aria-label={playing ? 'Pause listening preview' : 'Play listening preview'}><span><PlaybackIcon playing={playing} /></span>{playing ? 'LIFT THE NEEDLE' : 'DROP THE NEEDLE'}</button></div>
        </div>
        <div className="hero-footer"><div><span className="small-disc" aria-hidden="true" /><span>ON ROTATION<br /><strong>{current.title.replace('\n', ' ')} — AH {current.number}</strong></span></div><span className="hero-note">Good records. Open minds.<br />Absolutely no rush.</span><button className="scroll-cue" onClick={() => navigate('frequency')}>SCROLL TO TUNE IN <span>↓</span></button></div>
        {audioError && <p role="status" className="audio-error">{audioError}</p>}
      </section>

      <div className="ticker" aria-hidden="true"><div className="ticker-track">{[0, 1].map(i => <div key={i} className="ticker-set"><span>LESS NOISE.</span><Asterisk /><span>MORE FEELING.</span><Asterisk /><span>KEEP THE RECORD SPINNING.</span><Asterisk /></div>)}</div></div>

      <section className="frequency section-pad" id="frequency" tabIndex={-1} aria-labelledby="frequency-title"><div className="section-index"><span>01 / THE FREQUENCY</span><span>A PLACE FOR CURIOUS EARS ↙</span></div><div className="frequency-layout"><div className="frequency-aside"><div className="frequency-stamp"><Asterisk /><span>HUMAN SELECTED<br />ALWAYS.</span></div><p>A feeling, not an algorithm.</p></div><div className="manifesto-copy"><h2 id="frequency-title">{'Some things sound better after dark.'.split(' ').map((word, i) => <span className={`manifesto-word ${i > 4 ? 'word-serif' : ''}`} key={i}>{word} </span>)}</h2><div className="manifesto-bottom reveal"><span className="mini-arrow">↳</span><p>We’re here for the B-sides. The slow builds. The track that makes the whole room stop talking. A small corner of the internet for listening a little closer.</p><span className="no-shuffle">NO SKIPS.<br />JUST DISCOVERY.</span></div></div></div></section>

      <section id="sessions" tabIndex={-1} className="listening-room" aria-labelledby="sessions-title"><div className="collection-heading"><span className="eyebrow">02 / ON ROTATION</span><div><h2 id="sessions-title">PICK YOUR<br /><span>AFTERHOURS.</span></h2><p>Three ways into the night.<br />Drop a needle. See where it takes you.</p></div><div className="collection-directions"><span className="desktop-direction">SCROLL TO DIG DEEPER</span><span className="mobile-direction">CHOOSE A RECORD TO LISTEN</span><Arrow /></div></div><div className="records-window"><div className="records-track">{sessions.map((session, index) => <article className="record-card" key={session.id}><button className="record-button" onMouseEnter={e => hoverRecord(e, true)} onMouseLeave={e => hoverRecord(e, false)} onFocus={e => focusRecord(e, index)} onClick={() => openSession(session)} aria-label={`Listen to ${session.title.replace('\n', ' ')}`}><AlbumArt session={session} /><span className="record-hover"><span>LISTEN IN</span><Arrow diagonal /></span></button><div className="record-caption"><span><small>SESSION {session.number} — {session.genre}</small><h3>{session.mood}</h3></span><button onClick={() => openSession(session)} aria-label={`Open session ${session.number}`}><Arrow diagonal /></button></div></article>)}<div className="collection-end" aria-hidden="true"><Asterisk /><p>ONE MORE<br />RECORD?</p><span>THOUGHT SO.</span></div></div></div><div className="collection-bottom"><span>SELECTED WITH FEELING. PLAYED WITH LOVE.</span><div className="collection-progress"><i /></div><span>001 — 003</span></div></section>

      <section className="ritual section-pad" aria-labelledby="ritual-title"><div className="section-index"><span>03 / THE RITUAL</span><span>YOU’RE IN GOOD COMPANY</span></div><div className="ritual-title reveal"><h2 id="ritual-title">NOT EVERYTHING<br />NEEDS A <span>SKIP BUTTON.</span></h2><div className="ritual-circle"><span>33⅓</span><small>TAKE IT SLOW</small></div></div><div className="ritual-rows">{[['01', 'Leave the algorithm outside.', 'A little less prediction. A lot more happy accidents. Every session starts with a human feeling.'], ['02', 'Give it a whole side.', 'Let the unfamiliar become your new favorite. The good part might be just around the corner.'], ['03', 'Bring an open mind.', 'Jazz to dub. Soul to something we can’t quite name. Good music doesn’t care much for categories.']].map(([n, title, text]) => <div className="ritual-row reveal" key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p><Asterisk /></div>)}</div></section>

      <section className="club section-pad" id="club" tabIndex={-1} aria-labelledby="club-title"><div className="section-index"><span>04 / SAME TIME, NEXT RECORD?</span><span>THE DOOR IS ALWAYS OPEN ↙</span></div><div className="club-layout"><div className="club-copy"><h2 id="club-title" className="reveal">YOU HAVE<br />GOOD <span>TASTE.</span></h2><div className="club-invite reveal"><p>Make yourself a regular.<br />Save your place in this little listening club.</p><Magnet disabled={!motion}><button className="pill-button dark" onClick={saveClub}>{saved ? 'You’re one of us' : 'Count me in'}<span aria-hidden="true">{saved ? '✓' : '↗'}</span></button></Magnet><p className="club-confirmation" role="status">{saved ? 'Your club card is saved on this browser. Welcome to the late side.' : 'No inbox. No sign-up. Just a shared frequency.'}</p></div></div><div className={`club-card ${saved ? 'is-member' : ''}`}><div className="club-card-top"><span>AFTERHOURS®</span><Asterisk className="club-asterisk" /></div><span className="membership-label">THE LISTENING CLUB</span><div className="member-title">ALL<br />EARS.</div><div className="club-card-bottom"><span>{saved ? 'STATUS: ONE OF US' : 'ADMIT ONE CURIOUS MIND'}<br />VALID: AS LONG AS THE RECORD SPINS</span><Arrow diagonal /></div></div></div></section>

      <footer className="footer"><div className="footer-top"><span>INDEPENDENT SOUND.<br />UNREASONABLY LATE.</span><button onClick={() => navigate('main')}>BACK TO THE TOP <span>↑</span></button></div><div className="footer-word" aria-label="Afterhours">{'AFTERHOURS'.split('').map((letter, i) => <span aria-hidden="true" key={i}>{letter}</span>)}<sup>®</sup></div><div className="footer-bottom"><span>© {new Date().getFullYear()} AFTERHOURS — A LISTENING CLUB CONCEPT</span><button onClick={() => setMotion(!motion)} aria-pressed={motion}>MOTION {motion ? 'ON' : 'OFF'} <span aria-hidden="true">{motion ? '◉' : '○'}</span></button><span>MADE FOR YOUR EARS. AND YOUR EYES.</span></div></footer>
    </main>
    {menu && <Menu close={id => { setMenu(false); if (id) setPendingNavigation(id); }} motion={motion} />}
    {sessionOpen && <SessionDialog session={current} close={() => setSessionOpen(false)} playing={playing} toggle={toggleAudio} motion={motion} audioError={audioError} />}
  </div>;
}
