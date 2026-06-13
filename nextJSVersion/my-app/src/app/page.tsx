"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CONFIG } from "@/config";
import { ApplyWizard } from "@/components/ApplyWizard";
import { Gallery } from "@/components/Gallery";
import { DiscordButton } from "@/components/DiscordButton";
import { TabButton } from "@/components/TabButton";
import { FaqItem } from "@/components/FaqItem";

type Tab = "home" | "faq" | "apply" | "gallery";
const TABS: { id: Tab; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "faq", label: "FAQ" },
  { id: "apply", label: "Apply" },
  { id: "gallery", label: "Gallery" },
];
const FAQS: { q: React.ReactNode; a: React.ReactNode; open?: boolean }[] = [
  {
    q: <>What is fmy?</>,
    a: <>fmy is the official Family guild. Our focus is to create a comfortable envoirnment for people to play in. In fmy, a higher rank means more responsibility, and not more privilege. The guild is separate from the Family Party, so you don't need to be in the guild to join the party.</>,
    open: true,
  },
  {
    q: "What are the requirements to join?",
    a: <>While there are no official requirements for joining the guild, there is a rulebook that must be followed if you want to stay in the guild after joining.</>,
  },
  {
    q: "How does the application process work?",
    a: <>Fill out the application form in the Apply tab, then wait until you're aproved or rejected based on votes from the guild members. Make sure you're in the Family discord server so that we can contact you.</>,
  },
  {
    q: "Is there a fame requirement?",
    a: <>No, everyone is free to join regardless of fame, status, star levels and so on.</>,
  },
  {
    q: "Do you allow hacked clients?",
    a: "While fmy is not against the usage of hacked clients, some exceptions like bot accounts are not allowed. This question is answered in more detail in the rulebook.",
  },
  {
    q: "I applied, what now?",
    a: <>Join the Discord and wait while the guild votes. If accepted, you will be reached out to. The longest it can take is 24 hours.</>,
  },
];

function tabFromHash(hash: string): Tab {
  const name = hash.slice(1);
  return (TABS.some((t) => t.id === name) ? name : "home") as Tab;
}

export default function Page() {
  const [tab, setTab] = useState<Tab>("home");
  const shellRef = useRef<HTMLElement>(null);

  const goTo = useCallback((name: string, scroll = true) => {
    const next = (TABS.some((t) => t.id === name) ? name : "home") as Tab;
    setTab(next);
    if (location.hash.slice(1) !== next) history.replaceState(null, "", "#" + next);
    if (scroll) shellRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const sync = () => setTab(tabFromHash(window.location.hash));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <main className="shell" ref={shellRef}>
      <header className="masthead">
  <div className="masthead-empty" />

  <nav>
    {TABS.map((t) => (
      <TabButton key={t.id} label={t.label} active={tab === t.id} onClick={() => goTo(t.id)} />
    ))}
    <span className="nav-spacer" />
    <DiscordButton />
  </nav>
</header>
      <div className="body">
        {tab === "home" && (
          <section className="rise home-page">
            <div className="hero">
              <div className="hero-copy">
                <div className="eyebrow">Welcome to the</div>
                <div className="hero-script-logo">Family</div>
                <p className="lead">
                  For the People, By the People
                </p>
                <div className="cta-row hero-actions">
                  <button className="btn btn-primary hero-apply" onClick={() => goTo("apply")}>
    Apply now
  </button>
                                </div>
              </div>

              <aside className="hero-panel" aria-label="Guild status">
                <div className="panel-label">We are not a raiding discord server</div>
                <div className="panel-title">We are a Family</div>
                <p>Unlike raiding servers, our parties are always open to everyone, including people who are not in the server</p>
              </aside>
            </div>
          </section>
        )}

        {tab === "faq" && (
          <section className="rise page-panel">
            <div className="section-heading">
              <div className="kicker">Questions before entry</div>
              <h2>FAQ</h2>
            </div>
            {FAQS.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} open={f.open} />
            ))}
          </section>
        )}

        {tab === "apply" && (
          <section className="rise page-panel apply-panel">
            <ApplyWizard active={tab === "apply"} />
          </section>
        )}

        {tab === "gallery" && (
          <section className="rise page-panel gallery-panel">
            <Gallery active={tab === "gallery"} />
          </section>
        )}
      </div>
    </main>
  );
}
