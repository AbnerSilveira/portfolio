# RSA Visualizer

Implementação didática de **RSA do zero** (BigInt nativo, sem biblioteca criptográfica), com visualização passo a passo dos cálculos. Projeto #1 (2023/1), Matemática Discreta.

Este diretório é um **package de componentes React** (`@projects/rsa-visualizer`), não um Next.js app. A demo é servida pelo `apps/web` em `/projetos/rsa-visualizer/demo`.

## Uso (consumidor)

```tsx
import { RsaVisualizer } from "@projects/rsa-visualizer";

export default function DemoPage() {
  return <RsaVisualizer />;
}
```

Opcional: `<RsaVisualizer backHref="/projetos/rsa-visualizer" />` renderiza um link "← Portfólio" no header — útil quando o componente é embebido fora do contexto do `apps/web` (que já fornece Navbar própria).

A API pública também expõe o motor matemático: `generateKeyPair`, `encrypt`, `decrypt`, `totient`, `modPow`, `modInverse`, `extendedEuclid`, `isProbablyPrime`, `utf8ToMessageBigInt`, `bigIntToUtf8` e tipos relacionados.

## Setup local

Como package, não corre standalone. Para iterar na demo, sobe o portfólio:

```bash
pnpm install
pnpm --filter web dev
# http://localhost:3000/projetos/rsa-visualizer/demo
```

Tailwind v4 do `apps/web` rastreia as classes deste package via `@source` em `apps/web/src/app/globals.css`.

## Arquitetura

- `src/lib/` — núcleo matemático (`rsa`, `prime`, `modular`, `euclidean`, `utf8-message`, `parse-bigint`, `chunk-bigint-display`, `rsa-presets`).
- `src/components/rsa/` — UI por painel (`PrimeSelector`, `KeyStepsPanel`, `KeyOutputPanel`, `CryptoMessagePanel`, `StepCalcReveal`, `TypewriterLines`, `RsaWorkbench`).
- `src/index.ts` — barrel da API pública.
- `tests/` — Vitest sobre `src/lib/`.

Detalhes em `CLAUDE.md` e `docs/roadmap/2023-1.md`.

## Testes

```bash
pnpm --filter @projects/rsa-visualizer test
pnpm --filter @projects/rsa-visualizer typecheck
pnpm --filter @projects/rsa-visualizer lint
```

## Licença

MIT
