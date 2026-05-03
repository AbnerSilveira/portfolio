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

Demonstrar domínio de aritmética modular, Euclides estendido e primalidade (Miller-Rabin), alinhado ao plano em `docs/roadmap/2023-1.md`. Serve como **template** dos demais projetos em `apps/projects/`.

## 2. Stack

| Camada     | Tecnologia                                    |
| ---------- | --------------------------------------------- |
| Framework  | Next.js 16 (App Router, client-heavy onde UI) |
| Aritmética | `BigInt` nativo                               |
| UI         | Tailwind v4 + `@portfolio/ui`                 |
| Animação   | Framer Motion                                 |
| Testes     | Vitest                                        |

Sem backend; demo em porta **3001** para não colidir com `apps/web` (3000).

## 3. Arquitetura

```
apps/projects/rsa-visualizer/
├── src/
│   ├── app/           # rotas Next
│   ├── components/    # UI (a criar: PrimeSelector, steps, etc.)
│   └── lib/           # rsa.ts, prime.ts, modular.ts, euclidean.ts
├── tests/
├── CLAUDE.md
├── README.md
└── package.json
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
**Solução:** `crypto.getRandomValues()` para geração relacionada a chaves (quando implementado).

### 5.3 Tamanho das chaves (didático)

**Problema:** primos grandes travam o browser.  
**Solução (planejada):** modo didático **32 bits** com aviso explícito de que não é seguro para uso real.

## 6. Padrões de código

- TDD para `src/lib/*`: testes em `tests/` antes ou junto da implementação.
- Sem `node:crypto` para o núcleo RSA (requisito acadêmico).
- Consumir `@portfolio/ui` / `@portfolio/types` em vez de duplicar padrões do monorepo.

## 7. Testes

Vitest, ambiente `node` para matemática pura. Meta: cobertura alta em `src/lib/` (ver critérios em `docs/roadmap/2023-1.md`).

## 8. Segurança

App estático; sem URLs de utilizador para serviços externos no núcleo. Qualquer demo pública deve manter o aviso de **modo didático**.

## 9. Checklist de sessão

- [ ] `pnpm dev --filter=@projects/rsa-visualizer` sobe sem erros
- [ ] `pnpm test --filter=@projects/rsa-visualizer` verde
- [ ] `pnpm lint --filter=@projects/rsa-visualizer` limpo

## 10. Próximos passos

- [ ] Implementar `modular.ts`, `euclidean.ts`, `prime.ts`, `rsa.ts` com TDD (`docs/roadmap/2023-1.md` — Dia 2)
- [ ] UI em colunas + `PrimeSelector` (Dia 3)
- [ ] Framer Motion nos passos (Dia 4–5)
- [ ] MDX em `apps/web/content/projects/rsa-visualizer.mdx` + `DemoFrame` (Dia 7 / `new-project.md` §9)
