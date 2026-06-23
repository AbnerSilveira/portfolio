export type ScanType =
  | "TCP_SYN_SCAN"
  | "ARP_SPOOFING"
  | "DNS_TUNNELING"
  | "BEACONING";

export interface SnifferAlert {
  src_ip: string;
  scan_type: string;
  dst_ip: string;
  message: string;
  timestamp: number;
}

export interface AnalyzeResponse {
  alerts: SnifferAlert[];
  count: number;
  packet_count?: number;
  filename?: string;
}

const SCAN_TYPE_LABELS: Record<ScanType, string> = {
  TCP_SYN_SCAN: "Port scan (SYN)",
  ARP_SPOOFING: "ARP spoofing",
  DNS_TUNNELING: "DNS tunneling",
  BEACONING: "Beaconing",
};

export const SCAN_TYPE_COLORS: Record<ScanType, string> = {
  TCP_SYN_SCAN: "var(--chart-1)",
  ARP_SPOOFING: "var(--chart-2)",
  DNS_TUNNELING: "var(--chart-3)",
  BEACONING: "var(--chart-4)",
};

export function scanTypeLabel(type: string): string {
  if (type in SCAN_TYPE_LABELS) {
    return SCAN_TYPE_LABELS[type as ScanType];
  }
  return type;
}
