"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AlertCharts } from "./AlertCharts";
import { AlertSummaryCards } from "./AlertSummaryCards";
import { AlertTimeline } from "./AlertTimeline";
import { PcapUploadPanel } from "./PcapUploadPanel";
import type { SnifferAlert } from "../lib/alert-types";
import {
  buildTimelineBuckets,
  countBySource,
  countByType,
} from "../lib/alert-stats";
import {
  analyzePcap,
  checkApiHealth,
  fetchDemoPcap,
  type ApiHealthStatus,
  type DemoPcapId,
} from "../lib/sniffer-api";

export interface SnifferWorkbenchProps {
  /** Em `embedded`, o prompt `curl` fica oculto — a rota host já exibe `cd ./projetos/sniffer/demo`. */
  variant?: "standalone" | "embedded";
}

export function SnifferWorkbench({
  variant = "standalone",
}: SnifferWorkbenchProps = {}) {
  const [apiStatus, setApiStatus] = useState<ApiHealthStatus>({
    state: "checking",
  });
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<DemoPcapId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | undefined>();
  const [packetCount, setPacketCount] = useState<number | undefined>();
  const [analyzed, setAnalyzed] = useState(false);
  const [alerts, setAlerts] = useState<SnifferAlert[]>([]);

  useEffect(() => {
    let cancelled = false;
    void checkApiHealth().then((status) => {
      if (!cancelled) setApiStatus(status);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const byType = useMemo(() => countByType(alerts), [alerts]);
  const bySource = useMemo(() => countBySource(alerts), [alerts]);
  const timeline = useMemo(() => buildTimelineBuckets(alerts), [alerts]);

  const runAnalysis = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    setFilename(file.name);
    try {
      const result = await analyzePcap(file);
      setAlerts(result.alerts);
      setPacketCount(result.packet_count);
      setAnalyzed(true);
    } catch (e) {
      setAlerts([]);
      setPacketCount(undefined);
      setAnalyzed(false);
      setError(e instanceof Error ? e.message : "Falha ao analisar PCAP");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFileSelect = useCallback(
    (file: File) => {
      void runAnalysis(file);
    },
    [runAnalysis],
  );

  const handleDemoSelect = useCallback(
    async (id: DemoPcapId) => {
      setDemoLoading(id);
      setError(null);
      try {
        const file = await fetchDemoPcap(id);
        await runAnalysis(file);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha ao carregar demo");
      } finally {
        setDemoLoading(null);
      }
    },
    [runAnalysis],
  );

  const embedded = variant === "embedded";

  return (
    <div className="min-w-0">
      <div
        className={
          embedded
            ? "mt-4 flex flex-col gap-8"
            : "mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 sm:py-16"
        }
      >
        <header className="max-w-2xl">
          {!embedded ? (
            <p className="mb-2 font-mono text-xs sm:text-sm">
              <span className="text-primary">~/portfolio</span>
              <span className="text-foreground"> $ </span>
              <span className="text-foreground/90">
                curl -F file=@capture.pcap http://127.0.0.1:8000/analyze
              </span>
            </p>
          ) : null}
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Redes I · Análise offline
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Sniffer — PCAP Analyzer
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Detectores para port scan (SYN), ARP spoofing, DNS tunneling e
            beaconing. Envie um capture file; a API FastAPI processa localmente
            ou no deploy Fly.
          </p>
          <ApiStatus status={apiStatus} />
        </header>

        <PcapUploadPanel
          disabled={loading || demoLoading !== null}
          onFileSelect={handleFileSelect}
          onDemoSelect={(id) => void handleDemoSelect(id)}
          demoLoading={demoLoading}
        />

        {loading ? (
          <p
            className="font-mono text-sm text-muted-foreground"
            aria-live="polite"
          >
            Analisando PCAP…
          </p>
        ) : null}

        {error ? (
          <p
            className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        {analyzed && alerts.length === 0 && !error ? (
          <p className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            Análise concluída: nenhum padrão de ameaça detectado neste PCAP. Os
            detectores exigem tráfego específico. Experimente um dos{" "}
            <strong className="font-medium text-foreground">
              PCAPs de demonstração
            </strong>{" "}
            acima (port scan, ARP, DNS tunnel ou beaconing).
          </p>
        ) : null}

        {analyzed || filename ? (
          <>
            <AlertSummaryCards
              total={alerts.length}
              byType={byType}
              filename={filename}
              packetCount={packetCount}
            />
            <AlertCharts
              byType={byType}
              bySource={bySource}
              timeline={timeline}
            />
            <section className="flex flex-col gap-3">
              <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Timeline de alertas
              </h2>
              <AlertTimeline alerts={alerts} />
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}

function ApiStatus({ status }: { status: ApiHealthStatus }) {
  if (status.state === "checking") {
    return (
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        Verificando API…
      </p>
    );
  }

  const online = status.state === "online";

  return (
    <div className="mt-3 space-y-1">
      <p
        className={`inline-flex items-center gap-2 font-mono text-xs ${
          online ? "text-primary" : "text-destructive"
        }`}
      >
        <span
          className={`inline-block h-2 w-2 rounded-full ${
            online ? "bg-primary" : "bg-destructive"
          }`}
          aria-hidden
        />
        {online ? "API online" : "API offline"}
        <span className="text-muted-foreground">· {status.url}</span>
      </p>
      {!online ? (
        <p className="font-mono text-xs text-muted-foreground">
          {status.reason}
        </p>
      ) : null}
    </div>
  );
}
