"use client";

import type { SnifferAlert } from "../lib/alert-types";
import { scanTypeLabel } from "../lib/alert-types";
import { formatTimestamp, timelineBase } from "../lib/alert-stats";

interface AlertTimelineProps {
  alerts: SnifferAlert[];
}

export function AlertTimeline({ alerts }: AlertTimelineProps) {
  const base = timelineBase(alerts);

  if (alerts.length === 0) {
    return (
      <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        Nenhum alerta detectado neste PCAP.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-card font-mono text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">t+</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Origem</th>
              <th className="px-4 py-3 font-medium">Destino</th>
              <th className="px-4 py-3 font-medium">Detalhe</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, index) => (
              <tr
                key={`${alert.scan_type}-${alert.src_ip}-${alert.dst_ip}-${index}`}
                className="border-b border-border/60 transition hover:bg-card/80"
              >
                <td className="px-4 py-3 font-mono text-xs tabular-nums text-muted-foreground">
                  {formatTimestamp(alert.timestamp, base)}
                </td>
                <td className="px-4 py-3">
                  <ScanTypeBadge type={alert.scan_type} />
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {alert.src_ip || "—"}
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {alert.dst_ip || "—"}
                </td>
                <td className="max-w-md truncate px-4 py-3 text-xs text-muted-foreground">
                  {alert.message || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ScanTypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-block rounded border border-border bg-background px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-foreground">
      [{scanTypeLabel(type)}]
    </span>
  );
}
