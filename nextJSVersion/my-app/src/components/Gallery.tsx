"use client";

import { useCallback, useEffect, useState } from "react";
import { PHOTOS } from "@/config";

export function Gallery({ active }: { active: boolean }) {
  const [si, setSi] = useState(0);
  const count = PHOTOS.length;

  const go = useCallback(
    (n: number) => {
      if (!count) return;
      setSi((n + count) % count);
    },
    [count]
  );

  // auto-advance only while the gallery tab is visible
  useEffect(() => {
    if (!active || count <= 1) return;
    const t = setInterval(() => setSi((s) => (s + 1) % count), 5000);
    return () => clearInterval(t);
  }, [active, count]);

  // arrow-key navigation while visible
  useEffect(() => {
    if (!active || !count) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(si - 1);
      if (e.key === "ArrowRight") go(si + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, count, si, go]);

  if (!count) {
    return (
      <>
        <div className="kicker">&gt; gallery</div>
        <h2>Photos</h2>
        <p className="hint">
          Guild moments, clears, events. Add photos by putting image URLs in the{" "}
          <code>PHOTOS</code> list in <code>src/config.ts</code>.
        </p>
        <div className="slideshow">
          <div className="ss-empty">
            <div className="ic">[ ]</div>
            <div>
              No photos yet.
              <br />
              Add image URLs to the PHOTOS list in the code to start the
              slideshow.
            </div>
          </div>
        </div>
      </>
    );
  }

  const p = PHOTOS[si];
  return (
    <>
      <div className="kicker">&gt; gallery</div>
      <h2>Photos</h2>
      <p className="hint">
        Guild moments, clears, events. Add photos by putting image URLs in the{" "}
        <code>PHOTOS</code> list in <code>src/config.ts</code>.
      </p>
      <div className="slideshow">
        <div className="slides">
          <div className="slide rise" key={si}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={p.caption || ""} loading="lazy" />
            {p.caption && <div className="cap">{p.caption}</div>}
          </div>
        </div>
        <button className="ss-arrow prev" aria-label="Previous" onClick={() => go(si - 1)}>
          ‹
        </button>
        <button className="ss-arrow next" aria-label="Next" onClick={() => go(si + 1)}>
          ›
        </button>
      </div>
      <div className="ss-dots">
        {PHOTOS.map((_, i) => (
          <i key={i} className={i === si ? "active" : ""} onClick={() => go(i)} />
        ))}
      </div>
    </>
  );
}
