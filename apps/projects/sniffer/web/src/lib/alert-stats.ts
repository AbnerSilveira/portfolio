import type { SnifferAlert } from "./alert-types";
import { scanTypeLabel } from "./alert-types";

export interface TypeCount {
  type: string;
  label: string;
  count: number;
}

export interface TimelineBucket {
  label: string;
  TCP_SYN_SCAN: number;
  ARP_SPOOFING: number;
  DNS_TUNNELING: number;
  BEACONING: number;
  total: number;
}

const BUCKET_COUNT = 8;

export function countByType(alerts: SnifferAlert[]): TypeCount[] {
  const counts = new Map<string, number>();
  for (const alert of alerts) {
    counts.set(alert.scan_type, (counts.get(alert.scan_type) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([type, count]) => ({
      type,
      label: scanTypeLabel(type),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

export function countBySource(alerts: SnifferAlert[], limit = 8): TypeCount[] {
  const counts = new Map<string, number>();
  for (const alert of alerts) {
    counts.set(alert.src_ip, (counts.get(alert.src_ip) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([type, count]) => ({ type, label: type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function buildTimelineBuckets(alerts: SnifferAlert[]): TimelineBucket[] {
  const timed = alerts.filter((a) => a.timestamp > 0);
  if (timed.length === 0) {
    return [];
  }

  const min = Math.min(...timed.map((a) => a.timestamp));
  const max = Math.max(...timed.map((a) => a.timestamp));
  const span = Math.max(max - min, 1);
  const bucketSize = span / BUCKET_COUNT;

  const buckets: TimelineBucket[] = Array.from(
    { length: BUCKET_COUNT },
    (_, i) => ({
      label: formatOffset(min + i * bucketSize - min),
      TCP_SYN_SCAN: 0,
      ARP_SPOOFING: 0,
      DNS_TUNNELING: 0,
      BEACONING: 0,
      total: 0,
    }),
  );

  for (const alert of timed) {
    const index = Math.min(
      BUCKET_COUNT - 1,
      Math.floor((alert.timestamp - min) / bucketSize),
    );
    if (index < 0 || index >= buckets.length) continue;
    const bucket = buckets[index];

    switch (alert.scan_type) {
      case "TCP_SYN_SCAN":
        bucket.TCP_SYN_SCAN += 1;
        break;
      case "ARP_SPOOFING":
        bucket.ARP_SPOOFING += 1;
        break;
      case "DNS_TUNNELING":
        bucket.DNS_TUNNELING += 1;
        break;
      case "BEACONING":
        bucket.BEACONING += 1;
        break;
      default:
        break;
    }
    bucket.total += 1;
  }

  return buckets;
}

function formatOffset(seconds: number): string {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}m ${rest.toFixed(0)}s`;
}

export function formatTimestamp(epochSeconds: number, base = 0): string {
  if (epochSeconds <= 0) {
    return "—";
  }
  const offset = epochSeconds - base;
  return formatOffset(Math.max(0, offset));
}

export function timelineBase(alerts: SnifferAlert[]): number {
  const timed = alerts.filter((a) => a.timestamp > 0);
  if (timed.length === 0) return 0;
  return Math.min(...timed.map((a) => a.timestamp));
}
