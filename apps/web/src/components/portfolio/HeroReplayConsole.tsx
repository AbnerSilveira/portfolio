"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { clearHeroIntroSession } from "@/lib/hero-intro-session";
import { cn } from "@/lib/utils";

type Props = {
  onReplay: () => void;
};

const OK = new Set([
  "replay",
  "sudo replay",
  "./replay-intro.sh",
  "intro --force",
  "sudo intro --force",
]);

export function HeroReplayConsole({ onReplay }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!open) return;
    const id = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    setValue("");
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const onDown = (ev: MouseEvent) => {
      if (ev.button > 0) return;
      const root = panelRef.current;
      if (root && !root.contains(ev.target as Node)) close();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, close]);

  const submit = useCallback(() => {
    const cmd = value.trim().toLowerCase();
    if (!cmd) return;
    if (OK.has(cmd)) {
      clearHeroIntroSession();
      close();
      window.scrollTo({ top: 0, behavior: "smooth" });
      onReplay();
    }
  }, [value, onReplay, close]);

  if (!open) {
    return (
      <div className="mx-auto max-w-6xl px-6">
        <button
          type="button"
          className="group flex w-full cursor-default items-center justify-center border-0 bg-transparent py-2 text-left outline-none hover:cursor-text focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-expanded={false}
          aria-label="Abrir linha de comando"
          onClick={(e) => {
            if (e.button > 0) return;
            setOpen(true);
          }}
        >
          <span
            className="pointer-events-none h-0.5 w-24 max-w-[40%] rounded-full bg-border/0 transition-colors duration-150 group-hover:bg-border/45"
            aria-hidden
          />
        </button>
      </div>
    );
  }

  return (
    <div ref={panelRef} className="mx-auto max-w-6xl px-6 py-2">
      <form
        className="flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-xs text-muted-foreground sm:text-sm"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <span className="shrink-0 text-primary">~/portfolio</span>
        <span className="shrink-0 text-foreground">$</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder=""
          aria-label="Comando"
          className={cn(
            "min-w-[10ch] flex-1 border-0 border-b border-border/50 bg-transparent py-1 text-foreground outline-none",
            "focus:border-primary/60",
          )}
        />
        <button
          type="submit"
          className="shrink-0 rounded border border-border/40 px-2 py-1 text-[0.7rem] text-foreground/90 hover:border-primary/50 hover:text-primary sm:text-xs"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
