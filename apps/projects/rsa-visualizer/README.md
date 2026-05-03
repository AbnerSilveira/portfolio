# RSA Visualizer

Implementação didática de **RSA do zero** (BigInt, sem biblioteca criptográfica), com visualização dos passos matemáticos — projeto #1 (2023/1), Matemática Discreta.

## Setup

```bash
cd apps/projects/rsa-visualizer
pnpm install
cp .env.example .env
pnpm dev
```

Abre em [http://localhost:3001](http://localhost:3001) (porta distinta do `apps/web`).

## Uso

Durante o desenvolvimento: `pnpm dev`. O scaffold mostra uma página inicial; a demo interativa virá com o motor em `src/lib/` e os componentes em `src/components/`.

## Arquitetura

Ver `CLAUDE.md` e `docs/roadmap/2023-1.md`. Estrutura alvo:

- `src/lib/` — núcleo matemático (RSA, primos, modular, Euclides)
- `src/components/` — UI por etapa
- `tests/` — Vitest

## Testes

```bash
pnpm test
```

## Licença

MIT
