/**
 * Public API do package `@projects/rsa-visualizer`.
 *
 * Componente principal: `RsaVisualizer` (alias de `RsaWorkbench`) — demo interativa
 * pensada para ser embebida numa rota dentro do `apps/web` ou em qualquer consumidor
 * que já compile Tailwind a partir das classes deste package.
 *
 * Subcomponentes (`PrimeSelector`, `KeyStepsPanel`, etc.) ficam intencionalmente
 * fora deste barrel — são detalhes de composição da própria demo.
 */
export {
  RsaWorkbench,
  RsaWorkbench as RsaVisualizer,
} from "./components/rsa/RsaWorkbench";
export type { RsaWorkbenchProps } from "./components/rsa/RsaWorkbench";

export * from "./lib/rsa";
export * from "./lib/modular";
export * from "./lib/euclidean";
export * from "./lib/prime";
export * from "./lib/utf8-message";
