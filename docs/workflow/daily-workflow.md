# Workflow — Dia a Dia com Cursor e Lovable

Como trabalhar no monorepo com eficiência, seguindo o modelo Akita-XP adaptado.

---

## Antes de abrir o editor

**1. Ler o CLAUDE.md.** Raiz e do projeto em que vai mexer. 2 minutos.

**2. Ver o que está em `Próximos Passos` do CLAUDE.md.** Ou definir o escopo da sessão: "hoje vou implementar X".

**3. Sincronizar com `main`.**

```bash
git checkout main
git pull
git checkout -b feature/<descricao-curta>
```

---

## No Cursor

### Configuração do Cursor

O Cursor lê o `CLAUDE.md` automaticamente se estiver na raiz. Também respeitar:

- `.cursor/rules/` (se usar Cursor Rules)
- Arquivos `.cursorignore` para excluir `node_modules`, `.turbo`, etc.

### Fluxo de trabalho

**Estratégia dominante: pair programming.**

- Você define o que quer ("vou implementar o scanner de SQLi começando pelo detector UNION-based")
- Cursor escreve
- Você revisa **cada bloco antes de aceitar**
- Interrompe quando o caminho está errado

Nunca aceite uma resposta de 300 linhas sem ler. Se fez uma pergunta ampla demais, o resultado vai ser genérico. Seja específico:

- ❌ "Faz um scanner de SQLi"
- ✅ "Implementa a função `detectUnionBased(response: string, baseline: string): boolean` seguindo o padrão em `src/detectors/error-based.ts`. O teste em `tests/union-based.test.ts` descreve o comportamento esperado."

### TDD sempre

Ordem correta:

1. Escrever o teste (ou pedir ao Cursor para escrever, revisando)
2. Rodar: `pnpm test --filter=<projeto>` — deve **falhar**
3. Implementar
4. Rodar: deve **passar**
5. Refatorar se necessário
6. Commit

Se pular o passo 2, o teste pode estar errado e nunca falhar mesmo sem implementação.

### Quando o Cursor está errado

Sinais de que você precisa interromper e corrigir curso:

- Propõe mudar arquitetura quando você só pediu para adicionar uma feature
- Adiciona dependências novas sem necessidade clara
- Cria 8 arquivos quando 2 resolveriam
- Ignora padrões existentes no código (consultar `CLAUDE.md`!)
- Remove testes "para fazer compilar"
- Hardcoda valores que deveriam vir de config

Nestes casos, interrompa com "Para. [corrigir o curso]" e refaça.

### Commits pequenos

Um commit por unidade lógica. Não acumule.

```bash
git add src/detectors/union-based.ts tests/union-based.test.ts
git commit -m "feat(sqli-scanner): add UNION-based injection detector"

git add src/detectors/error-based.ts tests/error-based.test.ts
git commit -m "feat(sqli-scanner): add error-based injection detector"
```

---

## No Lovable

Lovable é bom para **gerar UI rápido**. Use quando:

- Precisa de uma tela nova no portfólio e quer ver opções visuais
- Quer protótipo de um componente visual antes de codificar no Cursor
- Precisa de layout responsivo que você não quer pensar do zero

**Como integrar:**

1. Descreva a tela no Lovable com contexto: "Uma página de detalhe de projeto em um portfólio de cibersegurança, com título, descrição, tags, área de demo embedada, seção de destaques técnicos e link para GitHub. Minimalista, dark mode, Tailwind, shadcn/ui."
2. Itere no Lovable até gostar do visual
3. **Exporte o código**
4. No Cursor, coloque o código exportado em `apps/web/...` e ajuste:
   - Importar do `@portfolio/ui` em vez de inlinar componentes shadcn
   - Usar tokens do `config-tailwind` em vez de cores hardcoded
   - Adicionar os tipos certos (`ProjectMetadata`)
   - Substituir dados mockados por dados reais (Contentlayer)

O Lovable dá o primeiro 70% visual rápido. O Cursor refina o último 30% técnico.

---

## Durante a sessão

### Refactoring contínuo

Se durante a sessão você notar:

- 2 projetos com código similar → mover para `packages/`
- Arquivo com 500 linhas → quebrar em módulos
- Função com 80 linhas → extrair helpers

Não deixar para "depois". Refatorar na mesma sessão, com os testes cobrindo.

### Quando rodar CI local

Antes de cada commit:

```bash
pnpm --filter <app-afetada> lint
pnpm --filter <app-afetada> typecheck
pnpm --filter <app-afetada> test
```

Antes de push:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Isso vai apanhar quase tudo que o CI vai apanhar. Economiza o tempo de esperar o CI para descobrir que um `npm run build` quebrou.

### Quando atualizar o CLAUDE.md

Qualquer uma dessas:

- Descobriu um obstáculo e resolveu
- Estabeleceu um padrão novo
- Mudou algo arquitetural
- Aprendeu um quirk de alguma biblioteca

Não deixar acumular. Atualizar no mesmo commit da solução. Ex:

```bash
git add src/detectors/time-based.ts tests/time-based.test.ts CLAUDE.md
git commit -m "feat(sqli-scanner): add time-based detector with MySQL SLEEP fallback

CLAUDE.md: documented that MySQL 5.7+ requires SLEEP() instead of BENCHMARK()
for reliable timing delay detection."
```

---

## Ao final da sessão

**1. CI local verde.**

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

**2. Push e abrir PR.**

```bash
git push -u origin feature/<descricao>
gh pr create
```

**3. Esperar o CI do GitHub.** Se passar, mergear. Se falhar, corrigir e repetir.

**4. Atualizar `Próximos Passos` no CLAUDE.md** se aplicável.

---

## Anti-patterns para evitar

### 1. "Big bang commits"

Commit com 40 arquivos mudados. Impossível de revisar, impossível de reverter seletivamente.

**Correção:** pare, use `git add -p` para separar em commits lógicos.

### 2. "Testes retroativos"

Implementar sem testes e depois "adicionar testes para subir cobertura".

**Correção:** se já aconteceu, pelo menos escreva testes cobrindo cenários reais antes do próximo refactoring.

### 3. "Copy-paste entre projetos"

Copiar `hashPassword` de um projeto para outro porque é "mais rápido".

**Correção:** extrair para `packages/` **na segunda vez**. Não esperar a terceira.

### 4. "Refactoring de emergência"

Deixar código crescer até 3000 linhas num arquivo e depois gastar um dia reorganizando.

**Correção:** refatorar a cada sessão. Quando um arquivo passa de 300 linhas, olhar com desconfiança.

### 5. "Me explica esse erro" repetido

Fazer o Cursor depurar erros sem entender por quê. Vai ficar em loop.

**Correção:** ler a stack trace. Entender. Aí perguntar algo específico baseado no entendimento.

### 6. "CLAUDE.md morto"

CLAUDE.md que foi escrito uma vez e nunca mais atualizado. Em 3 meses, está mentindo sobre a arquitetura.

**Correção:** atualizar na mesma sessão em que algo muda. Tratar como código — desatualizado é bug.

---

## Métricas saudáveis

Com base no artigo do Akita, alvos para este monorepo:

- **Commits/dia em dias ativos:** 5-15 (small releases)
- **Ratio teste/código em packages/:** ≥ 1.5x
- **Ratio teste/código em apps/projects/:** ≥ 1.0x
- **Cobertura em packages/:** ≥ 90%
- **Cobertura em apps/:** ≥ 70%
- **Tempo médio de CI:** < 5min (Turborepo cache ajuda)
- **PRs abertos simultaneamente:** 1-2 (focar, não dispersar)
- **Zero warnings de Semgrep/Snyk/Gitleaks** em `main`

Se essas métricas estão ruins consistentemente, parar features e investir em infra/refactoring.
