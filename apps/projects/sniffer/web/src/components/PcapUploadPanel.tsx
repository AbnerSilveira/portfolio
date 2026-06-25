"use client";

import { useCallback, useRef, useState } from "react";

import {
  DEMO_PCAPS,
  type DemoPcapId,
  validatePcapFile,
} from "../lib/sniffer-api";

interface PcapUploadPanelProps {
  disabled?: boolean;
  onFileSelect: (file: File) => void;
  onDemoSelect?: (id: DemoPcapId) => void;
  demoLoading?: DemoPcapId | null;
}

export function PcapUploadPanel({
  disabled,
  onFileSelect,
  onDemoSelect,
  demoLoading = null,
}: PcapUploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      const validationError = validatePcapFile(file);
      if (validationError) {
        setHint(validationError);
        return;
      }
      setHint(null);
      onFileSelect(file);
    },
    [onFileSelect],
  );

  return (
    <section
      aria-label="Upload de PCAP"
      className={`relative rounded-xl border border-dashed p-8 transition-colors duration-200 sm:p-10 ${
        dragOver ? "border-primary bg-card" : "border-border bg-card/60"
      } ${disabled ? "pointer-events-none opacity-60" : ""}`}
      onDragEnter={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragOver(false);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files[0]);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pcap,.pcapng,application/vnd.tcpdump.pcap,application/octet-stream"
        className="hidden"
        disabled={disabled}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <p className="absolute right-4 top-4 font-mono text-xs uppercase tracking-widest text-muted-foreground sm:right-6 sm:top-6">
        POST /analyze
      </p>

      <div className="flex flex-col items-center gap-5 pt-2 text-center">
        <p className="max-w-md text-sm text-muted-foreground">
          Arraste um arquivo <span className="font-mono">.pcap</span> ou{" "}
          <span className="font-mono">.pcapng</span> (máx. 50 MB). Análise
          offline — sem captura live.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            disabled={disabled}
            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition hover:border-primary hover:text-primary"
            onClick={() => inputRef.current?.click()}
          >
            Escolher arquivo
          </button>
        </div>
        {onDemoSelect ? (
          <div className="flex w-full max-w-xl flex-col gap-2">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              PCAPs de demonstração
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {(
                Object.entries(DEMO_PCAPS) as [
                  DemoPcapId,
                  (typeof DEMO_PCAPS)[DemoPcapId],
                ][]
              ).map(([id, demo]) => (
                <button
                  key={id}
                  type="button"
                  disabled={disabled || demoLoading !== null}
                  className="rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/20 sm:text-sm"
                  onClick={() => onDemoSelect(id)}
                >
                  {demoLoading === id ? "Carregando…" : demo.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        {hint ? (
          <p className="text-sm text-destructive" role="alert">
            {hint}
          </p>
        ) : null}
      </div>
    </section>
  );
}
