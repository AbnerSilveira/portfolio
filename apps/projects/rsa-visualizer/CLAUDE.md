# CLAUDE.md — RSA Visualizer

> Documento vivo. Atualizar a cada decisão de arquitetura ou obstáculo resolvido.

## 1. O Projeto

**Matéria:** Matemática Discreta  
**Semestre:** 2023/1  
**Categoria:** interactive  
**Impacto:** medium

### O que o projeto faz

Ferramenta didática no browser que implementa **RSA do zero** (sem bibliotecas criptográficas), com visualização dos passos: primos \(p, q\), \(n\), \(\phi(n)\), escolha de \(e\), cálculo de \(d\) (Euclides estendido), encriptação e decriptação com exponenciação modular.

### Por que existe

Demonstrar domínio de aritmética modular, Euclides estendido e primalidade (Miller-Rabin), alinhado ao plano em `docs/roadmap/2023-1.md`. Serve como **template** dos demais projetos `interactive` em `apps/projects/`.

## 2. Stack

| Camada       | Tecnologia                                                           |
| ------------ | -------------------------------------------------------------------- |
| Distribuição | Package React (`@projects/rsa-visualizer`) consumido pelo `apps/web` |
| Aritmética   | `BigInt` nativo                                                      |
| UI           | Tailwind v4 (compilado pelo consumidor) + `@portfolio/ui`            |
| Animação     | Framer Motion                                                        |
| Testes       | Vitest                                                               |

Não corre standalone: a rota `/projetos/rsa-visualizer/demo` no `apps/web` importa o componente raiz (`RsaVisualizer`) e renderiza-o no mesmo deploy do portfólio.

## 3. Arquitetura

```
apps/projects/rsa-visualizer/
├── src/
│   ├── components/rsa/   # PrimeSelector, KeyStepsPanel, KeyOutputPanel,
│   │                      # CryptoMessagePanel, StepCalcReveal,
│   │                      # TypewriterLines, RsaWorkbench
│   ├── lib/               # rsa, prime, modular, euclidean,
│   │                      # utf8-message, parse-bigint,
│   │                      # chunk-bigint-display, rsa-presets
│   └── index.ts           # barrel da API pública
├── tests/                 # Vitest sobre src/lib/*
├── CLAUDE.md
├── README.md
└── package.json           # main: ./src/index.ts; sem next; peer ^18||^19
```

## 4. Conceitos fundamentais

- Aritmética modular e teorema de Euler
- Inverso modular via algoritmo de Euclides estendido
- Miller-Rabin vs Fermat (Carmichael, ex.: 561)
- Exponenciação modular (binary exponentiation)

## 5. Obstáculos conhecidos e soluções

### 5.1 BigInt e React

**Problema:** React não serializa `BigInt` em props/JSON.  
**Solução:** exibir `value.toString()` na UI; manter `BigInt` só em estado local ou em libs puras.

### 5.2 Aleatoriedade

**Problema:** `Math.random()` não é criptograficamente seguro.  
**Solução:** `crypto.getRandomValues()` para qualquer escolha relacionada a chaves.

### 5.3 Tamanho das chaves (didático)

**Problema:** primos grandes travam o browser.  
**Solução:** modo didático com primos pequenos e aviso explícito de que não é seguro para uso real.

### 5.4 Imports internos do package vs `transpilePackages`

**Problema:** o Next.js do `apps/web` compila o package via `transpilePackages`, mas não conhece os `paths` do `tsconfig` interno. Aliases `@/*` rebentam em runtime.  
**Solução:** dentro do package, **só imports relativos** (`./Foo`, `../../lib/Bar`). Sem `@/*` na superfície interna.

### 5.5 Tailwind v4 e classes do package

**Problema:** Tailwind v4 não rastreia automaticamente classes em packages workspace consumidos via `transpilePackages`.  
**Solução:** o consumidor (`apps/web/src/app/globals.css`) adiciona `@source "../../../../apps/projects/rsa-visualizer/src/**/*.tsx";`. Sem isto, classes usadas só dentro do package ficam fora do bundle.

## 6. Padrões de código

- TDD para `src/lib/*`: testes em `tests/` antes ou junto da implementação.
- Sem `node:crypto` para o núcleo RSA (requisito acadêmico).
- Consumir `@portfolio/ui` / `@portfolio/types` em vez de duplicar padrões do monorepo.
- Imports internos relativos (ver §5.4).

## 7. Testes

Vitest, ambiente `node` para matemática pura. Meta: cobertura alta em `src/lib/` (ver critérios em `docs/roadmap/2023-1.md`).

## 8. Segurança

App estático; sem URLs de utilizador para serviços externos no núcleo. Qualquer demo pública mantém o aviso de **modo didático**.

## 9. Checklist de sessão

- [ ] `pnpm --filter @projects/rsa-visualizer typecheck` limpo
- [ ] `pnpm --filter @projects/rsa-visualizer test` verde
- [ ] `pnpm --filter @projects/rsa-visualizer lint` limpo
- [ ] `pnpm --filter web build` passa, com `/projetos/rsa-visualizer/demo` no manifesto

## 10. Próximos passos

- [x] Implementar `modular.ts`, `euclidean.ts`, `prime.ts`, `rsa.ts` com TDD (`docs/roadmap/2023-1.md` — Dia 2)
- [x] UI em colunas + `PrimeSelector` (Dia 3)
- [x] Framer Motion nos passos (Dia 4–5)
- [x] Encriptação/decriptação com mensagem UTF-8 em bloco único (Dia 5)
- [x] Conversão de Next.js app standalone para package consumido pelo `apps/web` (rota `/projetos/rsa-visualizer/demo`).

### Integração ao portfólio (`apps/web`)

- Dependência `workspace:*` no `apps/web/package.json`.
- `transpilePackages` no `apps/web/next.config.ts` inclui `@projects/rsa-visualizer`.
- Rota `apps/web/src/app/projetos/rsa-visualizer/demo/page.tsx` importa `RsaVisualizer`.
- MDX `apps/web/content/projects/rsa-visualizer.mdx` linka para `/projetos/rsa-visualizer/demo` na seção "Demo".
- Sem iframe, sem deploy adicional, sem variável de URL externa.
