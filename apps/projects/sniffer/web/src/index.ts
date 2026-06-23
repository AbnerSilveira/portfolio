/**
 * Public API do package `@projects/sniffer-web`.
 *
 * `SnifferWorkbench` — upload de PCAP, gráficos e timeline de alertas.
 * Pensado para embebido em `apps/web` ou app Next standalone em `web/`.
 */
export {
  SnifferWorkbench,
  type SnifferWorkbenchProps,
} from "./components/SnifferWorkbench";

export type { SnifferAlert, AnalyzeResponse } from "./lib/alert-types";
