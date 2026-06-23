"use client";

import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TypeCount, TimelineBucket } from "@/lib/alert-stats";
import {
  SCAN_TYPE_COLORS,
  scanTypeLabel,
  type ScanType,
} from "@/lib/alert-types";

const SCAN_TYPES: ScanType[] = [
  "TCP_SYN_SCAN",
  "ARP_SPOOFING",
  "DNS_TUNNELING",
  "BEACONING",
];

interface AlertChartsProps {
  byType: TypeCount[];
  bySource: TypeCount[];
  timeline: TimelineBucket[];
}

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  color: "var(--foreground)",
};

export function AlertCharts({ byType, bySource, timeline }: AlertChartsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard title="Por tipo de ameaça">
        {byType.length === 0 ? (
          <ChartEmpty message="Nenhum alerta para plotar." />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={byType}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                interval={0}
                angle={-12}
                textAnchor="end"
                height={56}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar
                dataKey="count"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Top IPs de origem">
        {bySource.length === 0 ? (
          <ChartEmpty message="Nenhum IP de origem com alertas." />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={bySource}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
            >
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={96}
                tick={{
                  fill: "var(--muted-foreground)",
                  fontSize: 11,
                  fontFamily: "var(--font-geist-mono)",
                }}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar
                dataKey="count"
                fill="var(--chart-2)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {timeline.length > 0 ? (
        <ChartCard title="Distribuição temporal" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={timeline}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {SCAN_TYPES.map((type) => (
                <Bar
                  key={type}
                  dataKey={type}
                  name={scanTypeLabel(type)}
                  stackId="alerts"
                  fill={SCAN_TYPE_COLORS[type]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}
    </div>
  );
}

function ChartEmpty({ message }: { message: string }) {
  return (
    <p className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
      {message}
    </p>
  );
}

function ChartCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`rounded-xl border border-border bg-card p-4 ${className}`}
    >
      <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {title}
      </h3>
      {children}
    </article>
  );
}
