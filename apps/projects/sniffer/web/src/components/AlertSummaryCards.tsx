"use client";

import type { TypeCount } from "@/lib/alert-stats";

interface AlertSummaryCardsProps {
  total: number;
  byType: TypeCount[];
  filename?: string;
  packetCount?: number;
}

export function AlertSummaryCards({
  total,
  byType,
  filename,
  packetCount,
}: AlertSummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <article className="rounded-lg border border-border bg-card p-4 transition hover:border-primary/55">
        <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
          Alertas
        </p>
        <p className="mt-2 font-mono text-3xl font-semibold tabular-nums text-foreground">
          {total}
        </p>
        {filename ? (
          <p className="mt-2 truncate text-xs text-muted-foreground">
            {filename}
          </p>
        ) : null}
        {packetCount !== undefined ? (
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {packetCount} pacotes analisados
          </p>
        ) : null}
      </article>

      {byType.slice(0, 3).map((item) => (
        <article
          key={item.type}
          className="rounded-lg border border-border bg-card p-4 transition hover:border-primary/55"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {item.label}
          </p>
          <p className="mt-2 font-mono text-3xl font-semibold tabular-nums text-foreground">
            {item.count}
          </p>
        </article>
      ))}
    </div>
  );
}
