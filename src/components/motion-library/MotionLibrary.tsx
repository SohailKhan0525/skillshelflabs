"use client";

import { useRef, useState } from "react";
import { useInView } from "motion/react";
import MotionPresetPlayer from "./MotionPresetPlayer";
import {
  findPresets,
  motionFamilies,
  motionPresets,
  presetSource,
} from "./presets";

export default function MotionLibrary({
  reducedMotion = true,
}: {
  reducedMotion?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("all");
  const [selected, setSelected] = useState("");
  const [page, setPage] = useState(0);
  const [replay, setReplay] = useState(0);
  const [status, setStatus] = useState("");
  const [sourceOpen, setSourceOpen] = useState(false);
  const preview = useRef<HTMLDivElement>(null);
  const inView = useInView(preview, { amount: 0.1 });
  const matches = findPresets(query, family);
  const pageSize = 8;
  const currentPage = Math.min(
    page,
    Math.max(0, Math.ceil(matches.length / pageSize) - 1),
  );
  const visible = matches.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );
  const active = visible.find((item) => item.id === selected) || visible[0];
  const contract = motionFamilies.find((item) => item.id === active?.family);
  function changeFilter(value: string, kind: "query" | "family") {
    if (kind === "query") setQuery(value);
    else setFamily(value);
    setPage(0);
    setStatus("");
  }
  async function copy() {
    if (!active) return;
    try {
      await navigator.clipboard.writeText(presetSource(active));
      setStatus(`Copied ${active.name} configuration.`);
    } catch {
      setSourceOpen(true);
      setStatus(
        "Clipboard unavailable. Select and copy the configuration below.",
      );
    }
  }
  return (
    <div className="mp-library">
      <div className="mp-library-top">
        <div>
          <span className="mp-eyebrow">The motion collection</span>
          <h2>
            Small movements.
            <br />
            <em>Endless possibilities.</em>
          </h2>
          <p>
            {motionPresets.length} playable presets. {motionFamilies.length}{" "}
            reusable families. One clear idea at a time.
          </p>
        </div>
        <span className="mp-library-badge">
          Motion.dev
          <br />
          <strong>240</strong>
          <small>compositional presets</small>
        </span>
      </div>
      <div className="mp-browser">
        <div className="mp-index">
          <div className="mp-filters">
            <label>
              Find a movement
              <input
                type="search"
                value={query}
                onChange={(event) => changeFilter(event.target.value, "query")}
                placeholder="Try path, spring, editorial…"
              />
            </label>
            <label>
              Motion family
              <select
                value={family}
                onChange={(event) => changeFilter(event.target.value, "family")}
              >
                <option value="all">All 24 families</option>
                {motionFamilies.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="mp-result-count" role="status">
            {matches.length} {matches.length === 1 ? "preset" : "presets"} found
          </p>
          {visible.length ? (
            <ol className="mp-results" start={currentPage * pageSize + 1}>
              {visible.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-pressed={item.id === active?.id}
                    onClick={() => {
                      setSelected(item.id);
                      setReplay((n) => n + 1);
                      setStatus("");
                    }}
                  >
                    <span>
                      {item.name}
                      <small>
                        {
                          motionFamilies.find(
                            (group) => group.id === item.family,
                          )!.name
                        }
                      </small>
                    </span>
                    <span aria-hidden="true">↗</span>
                  </button>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mp-empty">
              <p>No presets match that search.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFamily("all");
                  setPage(0);
                }}
              >
                Clear filters
              </button>
            </div>
          )}
          <div className="mp-pagination">
            <button
              type="button"
              disabled={currentPage === 0}
              onClick={() => setPage((n) => n - 1)}
            >
              Previous
            </button>
            <span>
              {matches.length
                ? `${currentPage * pageSize + 1}–${Math.min((currentPage + 1) * pageSize, matches.length)} of ${matches.length}`
                : "0 results"}
            </span>
            <button
              type="button"
              disabled={(currentPage + 1) * pageSize >= matches.length}
              onClick={() => setPage((n) => n + 1)}
            >
              Next
            </button>
          </div>
        </div>
        <div className="mp-inspector" ref={preview}>
          {active && contract ? (
            <>
              <div className="mp-preview-head">
                <span>{active.id}</span>
                <span>
                  {reducedMotion ? "Static · reduced motion" : "Live preview"}
                </span>
              </div>
              <div className="mp-preview-canvas">
                <MotionPresetPlayer
                  key={`${active.id}-${replay}-${reducedMotion}-${inView}`}
                  preset={active}
                  reducedMotion={reducedMotion || !inView}
                />
              </div>
              <div className="mp-preview-controls">
                <button
                  type="button"
                  onClick={() => setReplay((n) => n + 1)}
                  disabled={reducedMotion}
                >
                  Replay animation ↻
                </button>
                <button type="button" onClick={copy}>
                  Copy preset JSON
                </button>
              </div>
              <div className="mp-preset-notes">
                <h3>{active.name}</h3>
                <p>{contract.purpose}</p>
                <dl>
                  <div>
                    <dt>Primitive</dt>
                    <dd>{contract.api}</dd>
                  </div>
                  <div>
                    <dt>Keep in mind</dt>
                    <dd>{contract.avoid}</dd>
                  </div>
                  <div>
                    <dt>Reduced motion</dt>
                    <dd>{contract.reducedMotion}</dd>
                  </div>
                </dl>
                <button
                  className="mp-source-toggle"
                  type="button"
                  aria-expanded={sourceOpen}
                  onClick={() => setSourceOpen((value) => !value)}
                >
                  {sourceOpen ? "Hide" : "View"} configuration
                </button>
                {sourceOpen && (
                  <pre
                    className="mp-source"
                    tabIndex={0}
                    aria-label="Preset configuration"
                  >
                    {presetSource(active)}
                  </pre>
                )}
                <p className="mp-copy-status" role="status">
                  {status}
                </p>
              </div>
            </>
          ) : (
            <div className="mp-preview-empty">
              Choose another search to find your next movement.
            </div>
          )}
        </div>
      </div>
      <p className="mp-library-footnote">
        240 named configurations of 24 implementations, not 240 independently
        tested techniques. Drag and pointer examples include button
        alternatives. Only the selected preview runs.
      </p>
    </div>
  );
}
