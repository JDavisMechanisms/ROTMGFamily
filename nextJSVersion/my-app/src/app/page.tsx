"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CONFIG } from "@/config";
import { ApplyWizard } from "@/components/ApplyWizard";
import { Gallery } from "@/components/Gallery";
import { DiscordButton } from "@/components/DiscordButton";
import { TabButton } from "@/components/TabButton";
import { FeatureCard } from "@/components/FeatureCard";
import { FaqItem } from "@/components/FaqItem";

type Tab = "home" | "faq" | "apply" | "gallery";
const TABS: { id: Tab; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "faq", label: "FAQ" },
  { id: "apply", label: "Apply" },
  { id: "gallery", label: "Gallery" },
];

// Home feature cards — edit / add / remove freely.
const HOME_FEATURES = [
  { ic: "#", title: "Active & organized", body: "Regular runs, events, and people actually online when you log in." },
  { ic: ">", title: "No-drama crew", body: "We keep it friendly. Skill matters, but so does not being a pain." },
  { ic: "*", title: "Voted in", body: "Applications are read and voted on by the guild — everyone has a say." },
];

// FAQ entries — each becomes one accordion. `open` expands it by default.
const FAQS: { q: React.ReactNode; a: React.ReactNode; open?: boolean }[] = [
  {
    q: <>What is {CONFIG.GUILD}?</>,
    a: <>A [game] guild focused on [your focus]. We&apos;ve been around since [year] and run [events/activities].</>,
    open: true,
  },
  {
    q: "What are the requirements to join?",
    a: <>[e.g. a certain level/rank, a mic for events, basic activity.] Be honest on your application — it gets read.</>,
  },
  {
    q: "How does the application process work?",
    a: <>Fill out the Apply tab. It posts into our Discord and the guild votes Accept / Reject over 48 hours. If you&apos;re in, an officer reaches out.</>,
  },
  {
    q: "How active do I need to be?",
    a: <>[Set your expectation — e.g. &quot;log in a few times a week&quot; or &quot;no hard requirement, just don&apos;t go dark for a month.&quot;]</>,
  },
  {
    q: "Do you allow hacked clients?",
    a: "No. We ask on the application and we take it seriously.",
  },
  {
    q: "I applied — what now?",
    a: <>Hang tight while the guild votes. Join the Discord in the meantime so we can reach you and you can say hi.</>,
  },
];

function tabFromHash(hash: string): Tab {
  const name = hash.slice(1);
  return (TABS.some((t) => t.id === name) ? name : "home") as Tab;
}

export default function Page() {
  // Server always renders "home" (the hash is never sent to the server), so we
  // start there to keep hydration consistent, then sync to the URL hash on mount.
  const [tab, setTab] = useState<Tab>("home");
  const shellRef = useRef<HTMLElement>(null);

  const goTo = useCallback((name: string, scroll = true) => {
    const next = (TABS.some((t) => t.id === name) ? name : "home") as Tab;
    setTab(next);
    if (location.hash.slice(1) !== next) history.replaceState(null, "", "#" + next);
    if (scroll) shellRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // deep-link support + back/forward: sync the tab to the URL hash.
  useEffect(() => {
    const sync = () => setTab(tabFromHash(window.location.hash));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <main className="shell" ref={shellRef}>
      <div className="bar">
        <span className="dot r" />
        <span className="dot y" />
        <span className="dot g" />
        <span className="path">~/fmy</span>
      </div>

      <nav>
        <span className="nav-brand">{CONFIG.GUILD}</span>
        {TABS.map((t) => (
          <TabButton key={t.id} label={t.label} active={tab === t.id} onClick={() => goTo(t.id)} />
        ))}
        <span className="nav-spacer" />
        <DiscordButton />
      </nav>

      <div className="body">
        {tab === "home" && (
          <section className="rise">
            <div className="banner">{CONFIG.BANNER}</div>
            <div className="tag">
              join guild name fmy <b>{"// since 2026"}</b>
            </div>
            <p className="lead">
              Welcome, My name is OBD! I was wondering if i could see pictures of your feet.
            </p>

            <div className="cards">
              {HOME_FEATURES.map((f) => (
                <FeatureCard key={f.title} ic={f.ic} title={f.title} body={f.body} />
              ))}
            </div>

           
          </section>
        )}

        {tab === "faq" && (
          <section className="rise">
            <div className="kicker">&gt; frequently asked</div>
            <h2>FAQ</h2>
            <p className="hint">Edit these freely — each one is a details block.</p>
            {FAQS.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} open={f.open} />
            ))}
          </section>
        )}

        {tab === "apply" && (
          <section className="rise">
            <ApplyWizard active={tab === "apply"} />
          </section>
        )}

        {tab === "gallery" && (
          <section className="rise">
            <Gallery active={tab === "gallery"} />
          </section>
        )}
      </div>

    </main>
  );
}
