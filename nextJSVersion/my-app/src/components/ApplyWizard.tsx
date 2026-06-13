"use client";

import { useEffect, useRef, useState } from "react";
import { CONFIG, LABELS } from "@/config";

type FormData = Record<string, string>;

const EMPTY: FormData = {
  website: "", // honeypot
  ign: "",
  discord_username: "",
  discord_id: "",
  about: "",
  value: "",
  hacked: "",
  activity: "",
  why: "",
};

// Step definitions. Each renders one screen of the wizard.
// `fields` lists which inputs that step validates before advancing.
type Step = {
  render: (ctx: StepCtx) => React.ReactNode;
  fields?: { name: string; digits?: boolean }[];
};

type StepCtx = {
  data: FormData;
  set: (name: string, value: string) => void;
  err: string;
};

const STEPS: Step[] = [
  {
    render: () => (
      <>
        <div className="kicker">Thank you for choosing Family</div>
        <h2>Apply to join.</h2>
        <p className="hint">
          Your application gets read and voted on by the guild
        </p>
      </>
    ),
  },
  {
    fields: [{ name: "ign" }],
    render: ({ data, set, err }) => (
      <>
        <div className="kicker">&gt; identity</div>
        <h2>What&apos;s your in-game name?</h2>
        <p className="hint">Capital Sensitive</p>
        <input
          type="text"
          placeholder="IGN"
          maxLength={40}
          value={data.ign}
          onChange={(e) => set("ign", e.target.value)}
        />
        <div className="err-msg">{err}</div>
      </>
    ),
  },
  {
    fields: [{ name: "discord_username" }, { name: "discord_id", digits: true }],
    render: ({ data, set, err }) => (
      <>
        <div className="kicker">&gt; contact</div>
        <h2>Your Discord.</h2>
        <p className="hint">
          We need your username (not display name) and your User ID.
          Right-click your profile, then copy User ID (enable Developer Mode in
          Settings if you don&apos;t see it).
        </p>
        <input
          type="text"
          placeholder="discord username (e.g. coolperson)"
          maxLength={40}
          style={{ marginBottom: 10 }}
          value={data.discord_username}
          onChange={(e) => set("discord_username", e.target.value)}
        />
        <input
          type="text"
          placeholder="discord user id (e.g. 845594331322515487)"
          maxLength={25}
          value={data.discord_id}
          onChange={(e) => set("discord_id", e.target.value)}
        />
        <div className="err-msg">{err}</div>
      </>
    ),
  },
  {
    fields: [{ name: "about" }],
    render: ({ data, set, err }) => (
      <>
        <div className="kicker">&gt; profile</div>
        <h2>Describe yourself as a person.</h2>
        <p className="hint">
          Feel free to include hobbies and other games you play, along with anything else that makes you interesting
        </p>
        <textarea
          placeholder="..."
          maxLength={900}
          value={data.about}
          onChange={(e) => set("about", e.target.value)}
        />
        <div className="err-msg">{err}</div>
      </>
    ),
  },
  {
    fields: [{ name: "value" }],
    render: ({ data, set, err }) => (
      <>
        <div className="kicker">&gt; pitch</div>
        <h2>Why would you be a great addition?</h2>
        <p className="hint">We want to know how you'll benefit the guild (Think alive fame, popularity, utility, etc)</p>
        <textarea
          placeholder="..."
          maxLength={900}
          value={data.value}
          onChange={(e) => set("value", e.target.value)}
        />
        <div className="err-msg">{err}</div>
      </>
    ),
  },
  {
    fields: [{ name: "hacked" }],
    render: ({ data, set, err }) => (
      <>
        <div className="kicker">&gt; Clients</div>
        <h2>Do you use any clients?</h2>
        <p className="hint">We need to know because the requirements change based on this response</p>
        <select value={data.hacked} onChange={(e) => set("hacked", e.target.value)}>
          <option value="" disabled>
            select an answer…
          </option>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
          <option value="Used to / sometimes">Used to / sometimes</option>
        </select>
        <div className="err-msg">{err}</div>
      </>
    ),
  },
  {
    fields: [{ name: "activity" }],
    render: ({ data, set, err }) => (
      <>
        <div className="kicker">&gt; activity</div>
        <h2>How often do you play?</h2>
        <p className="hint">
          Rough estimate
        </p>
        <input
          type="text"
          placeholder="e.g. a few hours most evenings"
          maxLength={120}
          value={data.activity}
          onChange={(e) => set("activity", e.target.value)}
        />
        <div className="err-msg">{err}</div>
      </>
    ),
  },
  {
    fields: [{ name: "why" }],
    render: ({ data, set, err }) => (
      <>
        <div className="kicker">&gt; motivation</div>
        <h2>Why do you want to join us?</h2>
        <textarea
          placeholder="..."
          maxLength={900}
          value={data.why}
          onChange={(e) => set("why", e.target.value)}
        />
        <div className="err-msg">{err}</div>
      </>
    ),
  },
];

const SUBMIT_IDX = STEPS.length; // the review/confirm step
const OK_IDX = SUBMIT_IDX + 1;
const BAD_IDX = SUBMIT_IDX + 2;

export function ApplyWizard({ active }: { active: boolean }) {
  const [idx, setIdx] = useState(0);
  const [data, setData] = useState<FormData>(EMPTY);
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const [failMsg, setFailMsg] = useState("");
  const firstFieldRef = useRef<HTMLDivElement>(null);

  const set = (name: string, value: string) =>
    setData((d) => ({ ...d, [name]: value }));

  // autofocus the first field of the new step when the apply tab is visible
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => {
      const el = firstFieldRef.current?.querySelector<HTMLElement>(
        "input:not(.hp),textarea,select"
      );
      el?.focus();
    }, 60);
    return () => clearTimeout(t);
  }, [idx, active]);

  function validate(step: Step): boolean {
    if (!step.fields) return true;
    for (const f of step.fields) {
      const val = (data[f.name] ?? "").trim();
      if (!val) {
        setErr("This one's required.");
        return false;
      }
      if (f.digits && !/^\d{15,25}$/.test(val)) {
        setErr("A Discord User ID is a long string of numbers.");
        return false;
      }
    }
    setErr("");
    return true;
  }

  function next() {
    if (idx < STEPS.length && !validate(STEPS[idx])) return;
    setErr("");
    setIdx((i) => i + 1);
  }
  function back() {
    setErr("");
    setIdx((i) => i - 1);
  }

  async function submit() {
    if (data.website) return; // honeypot
    setSending(true);
    try {
      const res = await fetch(CONFIG.ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      setIdx(OK_IDX);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "unknown error";
      setFailMsg(
        `Couldn't reach the server (${msg}). Try again — if it persists, ping us in the Discord.`
      );
      setIdx(BAD_IDX);
    } finally {
      setSending(false);
    }
  }

  // progress bar
  const dots = [];
  for (let i = 0; i <= SUBMIT_IDX; i++) {
    dots.push(
      <i key={i} className={i < idx ? "done" : i === idx ? "active" : ""} />
    );
  }

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
      e.preventDefault();
      if (idx < STEPS.length) next();
    }
  };

  return (
    <form autoComplete="off" onKeyDown={onKeyDown} onSubmit={(e) => e.preventDefault()}>
      <input
        className="hp"
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        value={data.website}
        onChange={(e) => set("website", e.target.value)}
      />

      {idx <= SUBMIT_IDX && <div className="progress">{dots}</div>}

      <div className="rise" key={idx} ref={firstFieldRef}>
        {idx < STEPS.length && STEPS[idx].render({ data, set, err })}

        {idx < STEPS.length && (
          <div className="nav-btns">
            {idx > 0 && (
              <button type="button" className="btn" onClick={back}>
                Back
              </button>
            )}
            <button type="button" className="btn btn-primary" onClick={next}>
              {idx === 0 ? (
                <>
                  Begin
                </>
              ) : idx === STEPS.length - 1 ? (
                "Review"
              ) : (
                "Next"
              )}
            </button>
          </div>
        )}

        {idx === SUBMIT_IDX && (
          <>
            <div className="kicker">&gt; confirm</div>
            <h2>Application form</h2>
            <p className="hint">Double-check, then send it to the guild.</p>
            <div className="review">
              {Object.keys(LABELS).map((k) => (
                <div className="row" key={k}>
                  <div className="q">{LABELS[k]}</div>
                  <div className="a">{data[k] || "—"}</div>
                </div>
              ))}
            </div>
            <div className="err-msg" />
            <div className="nav-btns">
              <button type="button" className="btn" onClick={back}>
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={sending}
                onClick={submit}
              >
                {sending ? "Sending…" : "Submit application"}
              </button>
            </div>
          </>
        )}

        {idx === OK_IDX && (
          <div className="end ok">
            <div className="big">✓ sent</div>
            <h2>You&apos;re in the queue.</h2>
            <p>
              Your application landed in our Discord and the guild is voting on
              it now. Hop in the server while you wait.
            </p>
            <p>
              <a href={CONFIG.DISCORD} target="_blank" rel="noopener noreferrer">
                › Join the Discord
              </a>
            </p>
          </div>
        )}

        {idx === BAD_IDX && (
          <div className="end bad">
            <div className="big">x oops</div>
            <h2>Something broke.</h2>
            <p>{failMsg}</p>
            <div className="nav-btns" style={{ justifyContent: "center" }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ margin: 0 }}
                onClick={() => setIdx(SUBMIT_IDX)}
              >
                Try again
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
