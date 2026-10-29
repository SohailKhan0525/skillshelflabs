"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type Point = [number, number];
const project = (x: number, y: number, z = 0): Point => [290 + (x - y) * .8660254, 300 + (x + y) * .5 - z];
const p = (point: Point) => point.map(v => +v.toFixed(3)).join(",");
const plane = (x = 0, y = 0, z = 0) => `matrix(.8660254 .5 -.8660254 .5 ${p(project(x,y,z)).replace(",", " ")})`;

// Round projected polygons in screen space for a consistent hand-drawn outline.
function outline(points: Point[], radius = 12) {
  const corners = points.map((c,i) => {
    const a=points[(i+points.length-1)%points.length], b=points[(i+1)%points.length];
    const la=Math.hypot(a[0]-c[0],a[1]-c[1]), lb=Math.hypot(b[0]-c[0],b[1]-c[1]);
    const r=Math.min(radius,la/2,lb/2);
    return {c,a:[c[0]+(a[0]-c[0])*r/la,c[1]+(a[1]-c[1])*r/la] as Point,b:[c[0]+(b[0]-c[0])*r/lb,c[1]+(b[1]-c[1])*r/lb] as Point};
  });
  return `M${p(corners[0].a)} ${corners.map((c,i)=>`Q${p(c.c)} ${p(c.b)} L${p(corners[(i+1)%corners.length].a)}`).join(" ")} Z`;
}

// Boundary of a polygon swept down the screen: its visible extruded side wall.
function extruded(points: Point[], height: number, radius = 12) {
  const boundary: Point[]=[];
  points.forEach((point,i)=>{
    const previous=points[(i+points.length-1)%points.length], next=points[(i+1)%points.length];
    const incoming=point[0]<previous[0]?height:0;
    const outgoing=next[0]<point[0]?height:0;
    boundary.push([point[0],point[1]+incoming]);
    if(incoming!==outgoing)boundary.push([point[0],point[1]+outgoing]);
  });
  return outline(boundary,radius);
}

function Key({x,y,width=78,depth=68,label,green=false,command=false,shape,id,onPress}: {
  x:number;y:number;width?:number;depth?:number;label?:string;green?:boolean;command?:boolean;shape?:Point[];id:string;onPress:(id:string)=>void;
}) {
  const polygon = shape || [[0,0],[width,0],[width,depth],[0,depth]] as Point[];
  const upper = outline(polygon.map(([a,b])=>project(x+a,y+b,28)),12);
  const lower = outline(polygon.map(([a,b])=>project(x+a,y+b,8)),12);
  const side=extruded(polygon.map(([a,b])=>project(x+a,y+b,28)),20);
  return <g className="physical-key" data-key={id} role="button" tabIndex={0} aria-label={id === "connect" ? "Preview wallet connection" : label === "Learn more" ? "Learn about Minto" : `Press ${label || "command"} key`}
    onClick={()=>onPress(id)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onPress(id)}}}>
    <path d={lower} transform="translate(5 5)" fill="#000" opacity=".10" stroke="none"/>
    <g className="key-body">
      <path d={side} fill={green ? "#66da4d" : "#d4d4d1"}/>
      <path d={upper} fill={green ? "url(#greenTop)" : "url(#keyWhite)"}/>
      <g transform={plane(x,y,28)} stroke="none" fill="#242622">
        {command ? <path transform="translate(14 7) scale(.65)" d="M28 24h24v24H28z M28 24c-16 0-16-15-7-15 7 0 7 7 7 15 M52 24c16 0 16-15 7-15-7 0-7 7-7 15 M28 48c-16 0-16 15-7 15 7 0 7-7 7-15 M52 48c16 0 16 15 7 15-7 0-7-7-7-15" fill="none" stroke="#d5d8d2" strokeWidth="1.8"/> : <text fontFamily="Arial, sans-serif" x={width/2} y={green ? 114 : depth/2+7} textAnchor="middle" fontSize={label && label.length>1 ? 14 : 22} fontWeight="650" letterSpacing={green ? 1.2 : .3}>{label}</text>}
      </g>
    </g>
  </g>;
}

export default function KeyboardScene({paused,reducedMotion,connected,replay,onConnect,onLearn,onToggleMotion}:{
  paused:boolean;reducedMotion:boolean;connected:boolean;replay:number;onConnect:()=>void;onLearn:()=>void;onToggleMotion:()=>void;
}) {
  const svg=useRef<SVGSVGElement>(null);
  const loop=useRef<gsap.core.Timeline|null>(null);
  const ambient=useRef<gsap.core.Timeline|null>(null);
  const typed=useRef<SVGTSpanElement>(null);
  const typedSecond=useRef<SVGTSpanElement>(null);
  const interactionTweens=useRef<gsap.core.Tween[]>([]);

  useEffect(()=>{
    const ctx=gsap.context(()=>{
      if(reducedMotion){gsap.set(".tooltip",{opacity:1}); if(typed.current)typed.current.textContent="Connect at the speed";if(typedSecond.current)typedSecond.current.textContent="of light."; return;}
      const message="Connect your wallet at the speed of light.";
      const updateText=(text:string)=>{if(typed.current)typed.current.textContent=text.slice(0,26);if(typedSecond.current)typedSecond.current.textContent=text.slice(26);};
      const textProgress={length:0};
      loop.current=gsap.timeline({repeat:-1,repeatDelay:.8,defaults:{ease:"power2.inOut"}})
        .set(".scene-cursor",{x:52,y:30})
        .set(".tooltip",{opacity:0,y:5})
        .set(".selection",{opacity:0})
        .set(textProgress,{length:0,onUpdate:()=>{updateText("");}})
        .to(".scene-cursor",{x:0,y:0,duration:1.1},.2)
        .to(".floating-tile",{y:5,duration:.15},1.3)
        .to(".floating-tile",{y:0,duration:.35,ease:"back.out(2)"},1.45)
        .to(".selection",{opacity:1,duration:.2},1.5)
        .to(".scene-cursor",{x:43,y:57,duration:.9},1.6)
        .to(".tooltip",{opacity:1,y:0,duration:.35},2.2)
        .to(textProgress,{length:message.length,duration:2.3,ease:"none",onUpdate:()=>{updateText(message.slice(0,Math.round(textProgress.length)));}},2.5)
        .to(".tooltip",{opacity:0,y:-4,duration:.4},7.4)
        .to(".scene-cursor",{x:-7,y:-4,duration:.9},7.7)
        .to(".selection",{opacity:0,duration:.25},8.6)
        .to(".scene-cursor",{x:52,y:30,duration:.8},8.8);
      ambient.current=gsap.timeline({repeat:-1})
        .to(".signal-dot",{strokeDashoffset:-90,duration:3,ease:"none"},0)
        .to(".knob-orbit",{rotation:360,transformOrigin:"50% 50%",duration:6,ease:"none"},0)
        .to(".meter-bar",{scaleY:.25,transformOrigin:"50% 100%",duration:.45,stagger:{each:.055,repeat:9,yoyo:true},ease:"sine.inOut"},0)
        .to(".light-sweep",{x:360,duration:3,repeat:1,ease:"none"},0)
        .to(".status-led",{opacity:.25,duration:.8,yoyo:true,repeat:6,stagger:.1},0);
    },svg);
    return ()=>{ctx.revert();loop.current=null;ambient.current=null;interactionTweens.current.forEach(t=>t.kill());interactionTweens.current=[];};
  },[reducedMotion,replay]);

  useEffect(()=>{loop.current?.paused(paused);ambient.current?.paused(paused)},[paused,reducedMotion,replay]);

  function press(id:string){
    const element=svg.current?.querySelector(`[data-key="${id}"] .key-body`);
    if(element&&!reducedMotion){
      gsap.killTweensOf(element);
      const tween=gsap.fromTo(element,{y:0},{y:12,duration:.12,repeat:1,yoyo:true,ease:"power2.out"});
      interactionTweens.current=interactionTweens.current.filter(t=>t.isActive());interactionTweens.current.push(tween);
    }
    if(id==="connect")onConnect();
    if(id==="learn")onLearn();
  }

  const shell=outline([[0,0],[580,0],[580,240],[0,240]].map(([x,y])=>project(x,y)),24);
  const lower=outline([[0,0],[580,0],[580,240],[0,240]].map(([x,y])=>project(x,y,-25)),24);
  return <div className={`scene-wrap ${connected ? "is-connected" : ""}`}>
    <svg ref={svg} className="keyboard-scene" viewBox="0 0 900 850" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="scene-title scene-description">
      <title id="scene-title">An illustrated keyboard, brought to life</title>
      <desc id="scene-description">An isometric white keyboard with START keys, a glowing green enter key, an animated display, and a floating wallet icon. The Connect and Learn more keys are interactive.</desc>
      <defs>
        <linearGradient id="keyWhite" x1="0" y1="0" x2=".5" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#fafaf8"/></linearGradient>
        <linearGradient id="greenTop" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#b2ff93"/><stop offset="1" stopColor="#8cf770"/></linearGradient>
        <linearGradient id="boardSide"><stop stopColor="#f2f2ef"/><stop offset=".6" stopColor="#d1d1cf"/><stop offset="1" stopColor="#e1e1df"/></linearGradient>
        <linearGradient id="knobMetal"><stop stopColor="#fafaf8"/><stop offset=".45" stopColor="#e8e8e5"/><stop offset="1" stopColor="#b9bab6"/></linearGradient>
        <linearGradient id="spectrum"><stop stopColor="#ffd45e"/><stop offset=".18" stopColor="#f68f43"/><stop offset=".4" stopColor="#b7ee64"/><stop offset=".62" stopColor="#e6b944"/><stop offset="1" stopColor="#f27349"/></linearGradient>
        <linearGradient id="shine"><stop stopColor="#fff" stopOpacity="0"/><stop offset=".5" stopColor="#efffcf" stopOpacity=".8"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
        <filter id="cursorShadow" x="-30%" y="-30%" width="170%" height="180%"><feDropShadow dx="1" dy="3" stdDeviation="2" floodOpacity=".15"/></filter>
        <filter id="paperGrain"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".045"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter>
        <clipPath id="screenClip"><rect x="114" y="16" width="440" height="50" rx="7"/></clipPath>
      </defs>

      {/* Cable is also a vector path; its coils never become blurry on large screens. */}
      <g className="cable" strokeLinecap="round" strokeLinejoin="round">
        <path d="M736 453 780 423 819 435 C840 415 854 396 866 404 C888 419 847 453 853 434 C859 416 893 398 897 419 C902 440 867 466 871 447 C876 427 911 413 916 431 C922 451 886 479 891 461 C897 442 932 426 937 444 C943 463 908 492 914 474 C920 454 953 438 960 455" stroke="#c6c7c4" strokeWidth="5"/>
        <g transform="translate(725 456) rotate(-30)" stroke="#30322e" strokeWidth="1.6">
          <path d="M0-11h25a7 11 0 0 1 0 22H0" fill="#d7d8d4"/><ellipse rx="7" ry="11" fill="#efefec"/><path d="M-2-4h7v8h-7" fill="#c5c6c2"/><path d="M-4 0h-10" strokeWidth="4"/>
        </g>
      </g>

      <path className="connection-path" d="M601 174V225Q601 240 584 250L345 389Q331 398 331 415V461" stroke="#c9cdc5" strokeWidth="1.3" strokeDasharray="5 6"/>
      <path className="signal-dot" d="M601 174V225Q601 240 584 250L345 389Q331 398 331 415V461" stroke="#9dcd88" strokeWidth="2.4" strokeDasharray="2 90" opacity=".5"/>

      <g stroke="#31332f" strokeWidth="1.65" strokeLinejoin="round">
        <path d={lower} transform="translate(17 13)" fill="#000" opacity=".09" stroke="none"/>
        <path d={extruded([[0,0],[580,0],[580,240],[0,240]].map(([x,y])=>project(x,y)),25,24)} fill="url(#boardSide)"/>
        <path d={shell} fill="#fff"/>
        <g transform={plane()} stroke="none">
          <rect x="114" y="16" width="440" height="50" rx="7" fill="#30332e"/>
          <g clipPath="url(#screenClip)">
            <rect x="114" y="16" width="440" height="50" fill="#30332e" filter="url(#paperGrain)"/>
            {Array.from({length:24},(_,i)=><rect className="meter-bar" key={i} x={125+i*2.8} y={24+(i%5)*2} width="1.3" height={24-(i%5)*2} rx=".6" fill={i<11 ? "#ee925d" : "#a6ef8a"}/>)}
            <circle className="status-led" cx="205" cy="29" r="3" fill="#c4f8af"/><circle cx="216" cy="29" r="3" fill="#fff"/>
            <circle cx="205" cy="41" r="3" fill="#fff"/><circle className="status-led" cx="216" cy="41" r="3" fill="#b3f87e"/>
            <rect x="201" y="51" width="18" height="4" rx="2" fill="#eed75a"/>
            {Array.from({length:30},(_,i)=><rect key={i} className={i%4===0?"status-led":""} x={235+i*10} y="24" width="2.5" height="2.5" rx="1" fill={i%3===0?"#bef384":"#e1cf69"}/>)}
            <rect x="232" y="36" width="307" height="18" rx="3" fill="url(#spectrum)"/>
            <rect className="light-sweep" x="175" y="36" width="25" height="18" fill="url(#shine)"/>
            {Array.from({length:38},(_,i)=><path key={i} d={`M${236+i*8} 36v18`} stroke="#222" opacity=".09" strokeWidth=".5"/>)}
          </g>
        </g>

        <g className="knob">
          <ellipse cx="298" cy="351" rx="35" ry="18" fill="#000" opacity=".12" stroke="none"/>
          <path d="M256 303v35c0 26 66 26 66 0v-35" fill="url(#knobMetal)"/>
          <ellipse cx="289" cy="303" rx="33" ry="19" fill="#fff"/>
          <path d="M304 301h11" stroke="#edbba1" strokeWidth="1.8"/>
          {Array.from({length:13},(_,i)=><path key={i} d={`M${262+i*4.2} ${318+Math.sin(i/12*Math.PI)*6}v24`} stroke="#80827b" opacity=".09" strokeWidth=".7"/>)}
        </g>
        <g className="knob-orbit" stroke="#c9ccc5" strokeWidth=".85" opacity=".75">
          <path d="M275 256c-43-2-45-33-7-40s70 15 41 30"/><path d="m309 239 1 8 8-1"/>
        </g>

        {["S","T","A","R","T"].map((letter,i)=><Key key={i} x={25+i*91} y={79} label={letter} id={`letter-${i}`} onPress={press}/>)}
        <Key x={25} y={160} depth={57} command id="command" onPress={press}/>
        <Key x={116} y={160} width={260} depth={57} label={connected?"Connected":"Connect"} id="connect" onPress={press}/>
        <Key x={391} y={79} width={161} depth={138} label="Learn more" green id="learn" shape={[[91,0],[161,0],[161,138],[0,138],[0,81],[91,81]]} onPress={press}/>
      </g>

      <g className="floating-tile" stroke="#32342f" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M550 125Q548 116 557 111L592 91Q601 86 610 91L646 111Q654 115 653 124V149Q653 155 646 159L612 179Q601 185 592 180L557 160Q550 156 550 149Z" fill="#ee9b73"/>
        <path d="M550 123Q548 115 557 110L592 90Q601 85 610 90L646 110Q659 118 646 126L612 146Q601 152 591 146L557 128Q551 125 550 123Z" fill="#fff"/>
        <path d="m584 116 19-10 16 3-11 7 9 3-20 10-15-3 10-7Z" fill="#a2fb88" stroke="none"/>
        <path d="m592 113 14-7 12 3-14 7Z" fill="#d2ffc3" stroke="none"/>
      </g>
      <g className="selection" stroke="#418fe7" strokeWidth="1.5">
        <rect x="541" y="79" width="119" height="109"/>
        {[[541,79],[660,79],[541,188],[660,188]].map(([x,y])=><rect key={`${x}-${y}`} x={x-3} y={y-3} width="6" height="6" fill="#fff"/>)}
      </g>
      <g transform="translate(620 130)"><g className="scene-cursor" filter="url(#cursorShadow)">
        <path d="m0 0 12 44q1 5 5 1l9-14 17-3q5-1 1-5L4-2Q-1-5 0 0Z" fill="#fff" stroke="#30322d" strokeWidth="1.7" strokeLinejoin="round"/>
      </g>
      </g>
      <g className="tooltip" opacity="0">
        <rect x="688" y="227" width="196" height="57" rx="18" fill="#000" opacity=".025"/>
        <rect x="686" y="224" width="196" height="57" rx="18" fill="#fff" stroke="#b6bab2" strokeWidth="1.15"/>
        <text x="699" y="247" fontFamily="monospace" fontSize="10.5" fill="#454940"><tspan ref={typed}>Connect your wallet.</tspan><tspan ref={typedSecond} x="699" dy="14"/></text>
      </g>
    </svg>
    <div className="scene-caption"><span className="live-dot"/>{connected ? "Demo wallet connected" : "A little connection. A lot of possibility."}</div>
    <button type="button" className="motion-control" onClick={onToggleMotion} aria-label={paused ? "Play animation" : "Pause animation"} aria-pressed={paused} disabled={reducedMotion} title={reducedMotion?"Reduced motion enabled":paused?"Play animation":"Pause animation"}>
      {paused||reducedMotion ? <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="m7 4 9 6-9 6Z" fill="currentColor"/></svg> : <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M6 4v12M13 4v12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/></svg>}
    </button>
  </div>;
}
