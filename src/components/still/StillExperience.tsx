"use client";

import { useEffect, useRef, useState } from "react";
import LampScene from "./LampScene";
import {
  chooseMood,
  finishes,
  initialLight,
  selectionDescription,
  type FinishId,
  type LightMood,
  type LightSelection,
} from "../../lib/still-light";

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={down ? "still-arrow-down" : undefined}
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function Sun({ small = false }: { small?: boolean }) {
  return (
    <svg
      className={small ? "still-sun small" : "still-sun"}
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="30" cy="30" r="10" stroke="currentColor" strokeWidth="1.4" />
      {Array.from({ length: 12 }, (_, i) => (
        <path
          key={i}
          d="M30 5v8"
          stroke="currentColor"
          strokeWidth="1.4"
          transform={`rotate(${i * 30} 30 30)`}
        />
      ))}
    </svg>
  );
}
function FinishPicker({
  value,
  onChange,
  name,
  ready,
}: {
  value: FinishId;
  onChange: (value: FinishId) => void;
  name: string;
  ready: boolean;
}) {
  return (
    <fieldset className="still-finishes">
      <legend>
        Choose your finish{" "}
        <span>— {finishes.find((f) => f.id === value)!.name}</span>
      </legend>
      <div className="still-swatch-row">
        {finishes.map((finish) => (
          <label
            key={finish.id}
            className={`still-swatch ${value === finish.id ? "selected" : ""}`}
          >
            <input
              type="radio"
              name={name}
              value={finish.id}
              checked={value === finish.id}
              onChange={() => onChange(finish.id)}
              disabled={!ready}
            />
            <span
              className="still-swatch-color"
              style={{ backgroundColor: finish.color }}
              aria-hidden="true"
            >
              {value === finish.id && (
                <svg width="16" height="16" viewBox="0 0 20 20">
                  <path
                    d="m4 10 4 4 8-8"
                    fill="none"
                    stroke={finish.id === "chalk" ? "#293e30" : "#fff"}
                    strokeWidth="1.5"
                  />
                </svg>
              )}
            </span>
            <span className="still-swatch-name">{finish.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function StillExperience({
  className = "",
}: {
  className?: string;
}) {
  const [selection, setSelection] = useState<LightSelection>({
    ...initialLight,
  });
  const [saved, setSaved] = useState<LightSelection | null>(null);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [notice, setNotice] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const finish = finishes.find((item) => item.id === selection.finish)!;
  const isSaved =
    saved !== null &&
    selectionDescription(saved) === selectionDescription(selection);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    setReady(true);
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  function changeFinish(value: FinishId) {
    setSelection((current) => ({ ...current, finish: value }));
    setNotice("");
  }
  function openConfiguration() {
    opener.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setNotice("");
    dialog.current?.showModal();
    closeButton.current?.focus();
  }
  function closeConfiguration() {
    dialog.current?.close();
  }
  function setMood(mood: LightMood) {
    setSelection((current) => chooseMood(current, mood));
  }

  return (
    <div className={className} data-still-demo>
      <a className="still-skip" href="#still-main">
        Skip to content
      </a>
      <header className="still-header">
        <a
          href="#still-main"
          className="still-wordmark"
          aria-label="Still home"
        >
          still<span>.</span>
        </a>
        <nav aria-label="Still navigation">
          <a href="#the-object">The object</a>
          <a href="#the-details">The details</a>
          <a href="#our-approach">Our approach</a>
        </nav>
        <button
          className="still-header-action"
          onClick={() => {
            if (saved) setSelection({ ...saved });
            openConfiguration();
          }}
          disabled={!ready}
        >
          {saved ? "Your saved light" : "Find your light"}
          <Arrow />
        </button>
      </header>

      <main id="still-main" tabIndex={-1}>
        <section
          className="still-hero"
          id="the-object"
          aria-labelledby="still-headline"
        >
          <div className="still-hero-copy">
            <div className="still-edition">
              <span className="still-edition-line" /> Objects for the everyday{" "}
              <span className="still-edition-number">No. 001</span>
            </div>
            <h1 id="still-headline">
              A little light.
              <br />A different
              <br />
              <em>feeling.</em>
            </h1>
            <p className="still-intro">
              Meet Arc 01. A quiet companion for reading, making, and the
              moments in between.
            </p>
            <div className="still-hero-actions">
              <button
                className="still-primary"
                onClick={openConfiguration}
                disabled={!ready}
              >
                Make it yours <Arrow />
              </button>
              <a className="still-text-link" href="#the-details">
                A closer look <Arrow down />
              </a>
            </div>
            <FinishPicker
              value={selection.finish}
              onChange={changeFinish}
              name="hero-finish"
              ready={ready}
            />
            <p className="still-concept-note">
              An interactive design study. Made to explore.
            </p>
          </div>

          <div className="still-object-stage" data-mood={selection.mood}>
            <div className="still-stage-top">
              <span>
                Arc 01 <span className="still-stage-dot">/</span> The table
                light
              </span>
              <button
                className="still-power"
                aria-label={`Light ${selection.lightOn ? "on" : "off"}`}
                aria-pressed={selection.lightOn}
                disabled={!ready}
                onClick={() =>
                  setSelection((current) => ({
                    ...current,
                    lightOn: !current.lightOn,
                  }))
                }
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M10 2v7M6 5a6.5 6.5 0 1 0 8 0"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span>{selection.lightOn ? "On" : "Off"}</span>
              </button>
            </div>
            <LampScene selection={selection} reducedMotion={reducedMotion} />
            <div className="still-stage-foot">
              <span className="still-hand-note">a softer side of everyday</span>
              <span className="still-object-number">
                0
                {finishes.findIndex((item) => item.id === selection.finish) + 1}{" "}
                / 03
              </span>
            </div>
            <div className="still-light-controls">
              <fieldset className="still-moods">
                <legend>Set the mood</legend>
                <div>
                  {(["reading", "unwinding"] as const).map((mood) => (
                    <button
                      key={mood}
                      type="button"
                      aria-pressed={selection.mood === mood}
                      disabled={!ready}
                      onClick={() => setMood(mood)}
                    >
                      {mood === "reading" ? "Reading" : "Unwinding"}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="still-dimmer">
                <label htmlFor="still-brightness">
                  Brightness{" "}
                  <output htmlFor="still-brightness">
                    {selection.brightness}%
                  </output>
                </label>
                <input
                  id="still-brightness"
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={selection.brightness}
                  disabled={!ready || !selection.lightOn}
                  onChange={(event) =>
                    setSelection((current) => ({
                      ...current,
                      brightness: Number(event.target.value),
                    }))
                  }
                />
                <span className="still-control-hint">
                  {selection.lightOn
                    ? "Go on, turn it down a little."
                    : "Switch the light on to adjust."}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section
          className="still-principles"
          aria-label="The design in three ideas"
        >
          <div>
            <span>01</span>
            <p>
              A shape with
              <br />
              <strong>a softer side.</strong>
            </p>
          </div>
          <div>
            <span>02</span>
            <p>
              Light that follows
              <br />
              <strong>your kind of evening.</strong>
            </p>
          </div>
          <div>
            <span>03</span>
            <p>
              A little less noise.
              <br />
              <strong>A little more room.</strong>
            </p>
          </div>
          <Sun />
        </section>

        <section
          className="still-story"
          id="our-approach"
          aria-labelledby="still-story-title"
        >
          <div className="still-story-heading">
            <p className="still-section-label">The thought behind the object</p>
            <h2 id="still-story-title">
              Some things
              <br />
              just make a room
              <br />
              <em>feel right.</em>
            </h2>
          </div>
          <div className="still-story-copy">
            <Sun small />
            <p className="still-story-lead">
              The book you keep coming back to. Your favorite corner. The light
              you leave on.
            </p>
            <p>
              Still is an exploration of the objects that become part of our
              rituals. Arc 01 began with a simple question: what would a lamp
              look like if it asked a little less of your attention?
            </p>
            <p>
              A rounded shade. A single, sweeping stem. Three colors borrowed
              from the world outside. Nothing more than it needs to be.
            </p>
            <a href="#the-details" className="still-text-link">
              Get to know Arc 01 <Arrow />
            </a>
          </div>
        </section>

        <section
          className="still-details"
          id="the-details"
          aria-labelledby="still-details-title"
        >
          <div className="still-drawing">
            <span className="still-drawing-caption">A study in balance</span>
            <svg
              viewBox="0 0 520 500"
              role="img"
              aria-labelledby="still-drawing-title"
            >
              <title id="still-drawing-title">
                Arc 01 design sketch, showing a 42 centimeter height and 24
                centimeter shade
              </title>
              <g fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M280 392V184C280 120 211 119 211 176M290 392V184C290 107 201 109 201 176" />
                <path d="M112 246c0-113 200-113 200 0" />
                <ellipse cx="212" cy="246" rx="100" ry="17" />
                <ellipse cx="263" cy="397" rx="83" ry="18" />
                <path
                  d="M180 397v12c0 24 166 24 166 0v-12M212 246v-85"
                  strokeDasharray="3 6"
                  opacity="0.45"
                />
                <path
                  d="M377 126v289m-8-289h16m-16 289h16M112 92h200m-200-8v16m200-16v16"
                  opacity="0.45"
                />
              </g>
              <text
                x="212"
                y="76"
                textAnchor="middle"
                fill="currentColor"
                fontSize="13"
              >
                24 cm
              </text>
              <text x="396" y="275" fill="currentColor" fontSize="13">
                42 cm
              </text>
              <path d="m105 442 268-1" stroke="currentColor" opacity="0.25" />
              <text x="107" y="466" fill="currentColor" fontSize="11">
                ARC 01 — CONCEPT DRAWING
              </text>
            </svg>
            <span className="still-drawing-footer">
              Simple by intention. Considered in detail.
            </span>
          </div>
          <div className="still-specification">
            <p className="still-section-label">Every detail has a reason</p>
            <h2 id="still-details-title">
              An everyday object.
              <br />
              <em>A considered one.</em>
            </h2>
            <p>
              A generous pool of light, a compact footprint, and a finish that
              feels at home.
            </p>
            <dl>
              <div>
                <dt>The silhouette</dt>
                <dd>A rounded shade on a continuous curved stem</dd>
              </div>
              <div>
                <dt>The finish</dt>
                <dd>Terracotta, Moss, or Chalk</dd>
              </div>
              <div>
                <dt>The material idea</dt>
                <dd>Matte, powder-coated aluminum</dd>
              </div>
              <div>
                <dt>The proportions</dt>
                <dd>42 cm tall · 24 cm shade</dd>
              </div>
              <div>
                <dt>The light</dt>
                <dd>Warm white, with an adjustable glow</dd>
              </div>
            </dl>
            <p className="still-spec-note">
              Concept specifications, not a manufactured product.
            </p>
          </div>
        </section>

        <section
          className="still-invitation"
          aria-labelledby="still-invitation-title"
        >
          <Sun />
          <p className="still-section-label">Your corner of the world</p>
          <h2 id="still-invitation-title">
            Find your own
            <br />
            <em>little bright spot.</em>
          </h2>
          <p>A different finish. A softer glow. Make it feel like you.</p>
          <button
            className="still-primary"
            onClick={openConfiguration}
            disabled={!ready}
          >
            Create your combination <Arrow />
          </button>
          <span className="still-invitation-note">
            Three finishes. Your kind of light.
          </span>
        </section>

        <section className="still-faq" aria-labelledby="still-faq-title">
          <h2 id="still-faq-title">
            A few things
            <br />
            <em>you might wonder.</em>
          </h2>
          <div>
            <details>
              <summary>
                Can I buy Arc 01?<span aria-hidden="true">+</span>
              </summary>
              <p>
                Arc 01 is an original, fictional product created for this
                interactive design study. There is no checkout, payment, or
                physical product for sale.
              </p>
            </details>
            <details>
              <summary>
                What happens when I save a combination?
                <span aria-hidden="true">+</span>
              </summary>
              <p>
                Your finish and lighting choices stay in this page while it is
                open. Nothing is sent to a server. Refreshing the page resets
                the preview.
              </p>
            </details>
            <details>
              <summary>
                Can I use the controls without animation?
                <span aria-hidden="true">+</span>
              </summary>
              <p>
                Yes. When your device requests reduced motion, the lamp changes
                instantly. Finish choices, the light switch, brightness, and
                both moods work with a keyboard or touch.
              </p>
            </details>
          </div>
        </section>
        <noscript>
          <p className="still-no-script">
            JavaScript is off. You can read the complete design story and
            specifications; the interactive lamp preview requires JavaScript.
          </p>
        </noscript>
      </main>

      <footer className="still-footer">
        <div>
          <a
            href="#still-main"
            className="still-wordmark"
            aria-label="Still, back to top"
          >
            still<span>.</span>
          </a>
          <p>Objects for a slower everyday.</p>
        </div>
        <div className="still-footer-links">
          <a href="/">
            Back to SkillShelf Labs <Arrow />
          </a>
          <a href="https://github.com/SohailKhan0525/skillshelflabs">
            View the source <Arrow />
          </a>
        </div>
        <div className="still-colophon">
          <span>A fictional brand. A working design demonstration.</span>
          <span>Built with frontend-ui-ux-pro-plus</span>
        </div>
      </footer>

      <dialog
        ref={dialog}
        className="still-dialog"
        aria-labelledby="still-dialog-title"
        aria-describedby="still-dialog-description"
        onClose={() => opener.current?.focus()}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeConfiguration();
        }}
      >
        <div className="still-dialog-inner">
          <button
            ref={closeButton}
            className="still-close"
            onClick={closeConfiguration}
            aria-label="Close configuration"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path
                d="m5 5 10 10M15 5 5 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
          <Sun small />
          <p className="still-section-label">A light of your own</p>
          <h2 id="still-dialog-title">
            Make room for
            <br />
            <em>{finish.name.toLowerCase()}.</em>
          </h2>
          <p id="still-dialog-description">
            Choose the finish that feels like you. This saves a combination in
            this preview only.
          </p>
          <FinishPicker
            value={selection.finish}
            onChange={changeFinish}
            name="dialog-finish"
            ready={ready}
          />
          <p className="still-finish-description">{finish.description}</p>
          <div className="still-selection-summary">
            <span>Your combination</span>
            <strong>{selectionDescription(selection)}</strong>
          </div>
          <button
            className="still-primary"
            disabled={isSaved}
            onClick={() => {
              setSaved({ ...selection });
              setNotice(
                "Your combination is saved in this preview. Nothing was ordered or sent.",
              );
            }}
          >
            {isSaved ? "Combination saved" : "Save this combination"}
            <Arrow />
          </button>
          <p className="still-save-status" role="status">
            {notice || "You can keep exploring and change your mind anytime."}
          </p>
        </div>
      </dialog>
    </div>
  );
}
