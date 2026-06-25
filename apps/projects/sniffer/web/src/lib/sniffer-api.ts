import type { AnalyzeResponse } from "./alert-types";

const MAX_PCAP_BYTES = 50 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".pcap", ".pcapng"];

const DEV_API_DEFAULT = "http://127.0.0.1:8000";
/** URL pública do app Fly — não é secret; override via NEXT_PUBLIC_SNIFFER_API_URL se mudar. */
const PROD_API_DEFAULT = "https://portfolio-sniffer-api.fly.dev";

export function resolveApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SNIFFER_API_URL?.replace(
    /\/$/,
    "",
  );
  if (configured) {
    return configured;
  }
  if (process.env.NODE_ENV === "development") {
    return DEV_API_DEFAULT;
  }
  return PROD_API_DEFAULT;
}

function apiBaseUrl(): string {
  return resolveApiBaseUrl();
}

export function validatePcapFile(file: File): string | null {
  const name = file.name.toLowerCase();
  const ext = ALLOWED_EXTENSIONS.find((candidate) => name.endsWith(candidate));
  if (!ext) {
    return "Formato inválido. Use .pcap ou .pcapng";
  }
  if (file.size > MAX_PCAP_BYTES) {
    return "Arquivo muito grande (máx. 50 MB)";
  }
  if (file.size === 0) {
    return "Arquivo vazio";
  }
  return null;
}

export async function analyzePcap(file: File): Promise<AnalyzeResponse> {
  const validationError = validatePcapFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const form = new FormData();
  form.append("file", file);

  const response = await fetch(`${apiBaseUrl()}/analyze`, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    let detail = `Erro ${response.status}`;
    try {
      const body = (await response.json()) as { detail?: unknown };
      if (typeof body.detail === "string") {
        detail = body.detail;
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(detail);
  }

  return (await response.json()) as AnalyzeResponse;
}

export type ApiHealthStatus =
  | { state: "checking" }
  | { state: "online"; url: string }
  | { state: "offline"; url: string; reason: string };

export const DEMO_PCAP_PATH = "/fixtures/port-scan-demo.pcap";

export async function fetchDemoPcap(): Promise<File> {
  const response = await fetch(DEMO_PCAP_PATH);
  if (!response.ok) {
    throw new Error("Não foi possível carregar o PCAP de demonstração.");
  }
  const blob = await response.blob();
  return new File([blob], "port-scan-demo.pcap", {
    type: "application/vnd.tcpdump.pcap",
  });
}

export async function checkApiHealth(): Promise<ApiHealthStatus> {
  const url = resolveApiBaseUrl();

  try {
    const response = await fetch(`${url}/health`, {
      cache: "no-store",
      mode: "cors",
    });
    if (response.ok) {
      return { state: "online", url };
    }
    return {
      state: "offline",
      url,
      reason: `HTTP ${response.status} em /health`,
    };
  } catch {
    return {
      state: "offline",
      url,
      reason:
        "Não foi possível conectar. Confirme uvicorn na porta 8000 e reinicie o Next após mudar .env.local.",
    };
  }
}
