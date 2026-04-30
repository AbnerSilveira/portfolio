# Arquitetura — Topologia de Deploy

Como os componentes do monorepo estão distribuídos em produção.

**Filosofia de custo:** nada roda 24/7 por default. O portfólio estático fica sempre no ar (Vercel free). Backends scale-to-zero dormem quando ninguém usa e acordam em ~1s quando chega request. A VPS só é ligada em "temporadas de coleta" específicas (honeypot no semestre da matéria). Resultado: R$ 0 de custo mensal típico, com picos R$ 5–15 em meses de tráfego (divulgação, entrevistas).

---

## Visão macro

```
                              ┌──────────────────────┐
                              │   Cloudflare DNS     │
                              │                      │
                              │   portfolio.dom      │
                              │   tcc.dom            │
                              │   demo.dom           │
                              │   api.dom            │
                              │   assets.dom         │
                              └──────────┬───────────┘
                                         │
           ┌─────────────────────────────┼─────────────────────────────┐
           ▼                             ▼                             ▼
    ┌────────────┐              ┌────────────────┐            ┌──────────────┐
    │   Vercel   │              │    Fly.io      │            │ Hetzner VPS  │
    │   (free)   │              │ (scale to 0)   │            │ (temporada)  │
    │            │              │                │            │              │
    │ portfolio. │              │ demo.dom       │            │ Honeypot em  │
    │ apps/web   │              │ api.dom        │            │ coleta ativa │
    │            │              │                │            │              │
    │ tcc.dom    │              │ sandbox-runner │            │ Desligada    │
    │ TCC frontend               │ TCC backend   │            │ fora da      │
    └────────────┘              └────────────────┘            │ temporada    │
                                         │                    └──────────────┘
                                         ▼
                              ┌──────────────────────┐
                              │  Neon Postgres       │
                              │  (auto-suspend)      │
                              │                      │
                              │  DB compartilhado    │
                              │  Branches por        │
                              │  projeto             │
                              └──────────┬───────────┘
                                         │
                              ┌──────────┴───────────┐
                              │  Cloudflare R2       │
                              │                      │
                              │  Videos demo         │
                              │  Backups             │
                              │  Assets estáticos    │
                              │  (assets.dom)        │
                              └──────────────────────┘
```

---

## Detalhamento por plataforma

### Vercel (free tier)

**Hospeda:**

- `portfolio.<dominio>` — `apps/web` (Next.js (App Router) — atualmente 16.x)
- `tcc.<dominio>` — `apps/projects/sad-ciberseguranca/frontend` (Vite + React)

**Deploy:** `apps/web` via **integração nativa Vercel ↔ GitHub** (Framework Preset = Next.js; Root Directory = `apps/web`; Include files outside = Enabled). TCC frontend: [a confirmar]

**Monitoramento:** analytics built-in do Vercel

**Limites do free tier relevantes:**

- 100 GB bandwidth/mês — suficiente para tráfego orgânico do portfólio
- Build time 6h/mês — com Turbo cache, usamos <30min/mês
- Serverless function timeout 10s — API routes do portfólio precisam ser rápidas

**Quando migrar para Pro:** se bandwidth passar 50 GB/mês consistentemente.

### Fly.io Machines (substitui Railway e VPS 24/7)

Plataforma central para tudo que não é estático. Containers Docker que **suspendem automaticamente após ~5min sem tráfego** e acordam em ~1s quando chega o próximo request. Cobrança por segundo de CPU efetivamente em uso.

**Hospeda:**

- `api.<dominio>` — `services/sandbox-runner` (executa demos de scanners)
- `api.<dominio>` (outra rota) — TCC Backend (NestJS do SAD Cibersegurança)
- `demo.<dominio>` — backends leves de projetos que precisam de runtime (Mosquitto MQTT broker para IoT, WAF target, etc.) quando necessário

**Free tier:**

- 3 shared-cpu VMs com 256MB RAM
- Bandwidth generoso
- Cold start ~1s

**Cenários de custo:**

- **Idle total** (ninguém usa demo no mês): R$ 0
- **Picos de divulgação** (50 runs de sandbox no dia do post LinkedIn): ~R$ 2 no mês
- **Dia de entrevista com recrutador abrindo várias demos**: ~R$ 1 esporádico
- **Teto realista** considerando o perfil de tráfego do portfólio: R$ 10–15/mês mesmo em meses ativos

**Deploy:** `flyctl deploy` via GitHub Actions, disparado por push em `main` afetando `services/**` ou `apps/projects/sad-ciberseguranca/backend/**`.

**Por que não Railway:** free tier de $5 crédito acabando rápido e cobrança fixa no plano pago. Fly scale-to-zero é radicalmente mais barato para portfólio com uso intermitente.

**Por que não Vercel Functions:** timeout 10s no hobby, incompatível com sandbox runner (scan pode levar 20–30s).

### Neon Postgres (free)

Banco **serverless com auto-suspend** após 5min sem query. Acorda em ~500ms na próxima. Substitui o Postgres que rodaria na VPS.

**Hospeda:**

- Branch `portfolio-main` — dados gerais (métricas, contato, logs de sandbox)
- Branch `tcc-sad-ciberseguranca` — DB do TCC
- Branch `honeypot-capture` — dados coletados durante temporadas do honeypot
- Branch `threat-intel` — cache do agregador OSINT

**Free tier:**

- 0.5 GB storage (mais que suficiente — dados de portfólio são pequenos)
- 190h de compute/mês com auto-suspend ativo (uso real estimado: 20–30h)
- Branching nativo — cada branch é um DB independente, mesma conta

**Backup:** ponto-no-tempo automático de 7 dias no free tier. Snapshots manuais antes de eventos importantes.

### Hetzner CPX11 (temporada de coleta, ~R$ 28/mês quando ligada)

**Ligada apenas em janelas específicas.** Fora dessas janelas, **instância destruída** (não só desligada — Hetzner cobra até em stopped). Config versionada em `infra/hetzner-temporada/` para reconstruir idêntica quando necessário.

**Janelas de operação previstas:**

| Janela                                       | Duração     | Motivo                                                              | Custo               |
| -------------------------------------------- | ----------- | ------------------------------------------------------------------- | ------------------- |
| 2024/2 semestre                              | ~3 meses    | Matéria de Sistemas Operacionais — honeypot real capturando ataques | ~R$ 84 uma vez      |
| 1 mês antes do TCC (2026/2)                  | ~1 mês      | Reativar para coletar amostra fresca para banca                     | ~R$ 28 uma vez      |
| Esporádico antes de entrevistas estratégicas | 1–2 semanas | Dashboard do honeypot com dados recentes                            | ~R$ 15 por ativação |

**Estimativa total ao longo do curso:** R$ 150–200, gastos de forma concentrada, não recorrente.

**Serviços rodando na temporada:**

| Serviço         | Uso                                         |
| --------------- | ------------------------------------------- |
| Traefik         | Reverse proxy + TLS (Let's Encrypt)         |
| Fail2ban        | Protege o SSH real (que fica em porta alta) |
| `honeypot-ssh`  | Porta 22 fake                               |
| `honeypot-ftp`  | Porta 21 fake                               |
| `honeypot-http` | Porta 8080/8443 fake                        |
| Exporter        | Despeja captura para Neon em tempo real     |

**Fora da temporada:** dashboard no portfólio lê dados congelados do Neon com rótulo "Coleta ativa: [janela] · N tentativas · paused".

**Quando voltar para VPS 24/7:** se o portfólio virar negócio (SaaS de segurança, consultoria com demos ao vivo). Enquanto for portfólio acadêmico, temporadas cobrem.

### GitHub Actions scheduled workflows (substitui threat-intel-aggregator 24/7)

Cron workflows rodam 2x/dia puxando APIs OSINT (AbuseIPDB, VirusTotal, Shodan) e inserindo no Neon.

**Custo:** R$ 0 — 2000 min/mês grátis em repo público, uso real ~30 min/mês.

**Trade-off aceito:** dados atualizam a cada 12h em vez de em tempo real. Para um dashboard de portfólio, é mais que suficiente — recrutador não precisa de dado do último minuto.

Ver `.github/workflows/threat-intel-cron.yml`.

### Cloudflare R2

**Armazena:**

- `/videos/` — vídeos dos projetos (público, lazy-loaded)
- `/pcaps/` — PCAPs fixture para IDS demo
- `/ota/` — firmwares assinados para projeto IoT
- `/backups/` — backups diários do Neon (script de dump via GitHub Actions)

**Por que R2:** 10 GB grátis, sem egress fees.

**Acesso:** bucket público em `assets.<dominio>` para recursos públicos. API Token para uploads automáticos.

---

## Rede e DNS

### Subdomínios

| Subdomínio      | Aponta para               | Função                           |
| --------------- | ------------------------- | -------------------------------- |
| `portfolio.<d>` | Vercel                    | Site principal                   |
| `www.<d>`       | Vercel (redirect)         | Alias para portfolio             |
| `<d>` (apex)    | Vercel (redirect)         | Alias para portfolio             |
| `tcc.<d>`       | Vercel                    | TCC frontend                     |
| `demo.<d>`      | Fly.io                    | Demos interativas embedadas      |
| `api.<d>`       | Fly.io                    | Sandbox runner + TCC backend API |
| `assets.<d>`    | Cloudflare R2             | Videos e assets grandes          |
| `honeypot.<d>`  | Hetzner (só na temporada) | Entradas fake para captura       |

### Isolamento por subdomínio

- `portfolio.<d>` e `demo.<d>` estão em subdomínios diferentes **de propósito**. CSP restritiva no principal; demos mais permissivas no demo — sem risco de escape.
- Cookies de um subdomínio não vazam para outro (CSP path scoped)
- iframes do portfólio para demo.<d> usam `sandbox="allow-scripts allow-same-origin"` — permissões mínimas

### DNS durante temporadas do honeypot

Na ativação: `honeypot.<d>` aponta para o IP da Hetzner recém-provisionada. No fim da temporada: DNS removido, instância destruída.

---

## TLS e certificados

- **Vercel:** TLS automático, renovação automática
- **Fly.io:** TLS automático via Let's Encrypt, renovação automática
- **Neon:** TLS automático na connection string (`sslmode=require`)
- **Hetzner durante temporada (Traefik):** Let's Encrypt automático
- **Mosquitto (mTLS IoT):** CA própria no repositório, cert lifetime 1 ano, rotação documentada

---

## Backups

### Automáticos

- **Neon:** point-in-time restore de 7 dias built-in no free tier. Workflow GitHub Actions faz `pg_dump` semanal e joga no R2.
- **Configs Fly.io:** versionadas em `fly.toml` no monorepo
- **Firmwares IoT:** em R2, com assinaturas

### Manuais (antes de eventos importantes)

- Export completo do Neon antes da defesa do TCC
- Export de dados do honeypot no fim de cada temporada (vira fixture permanente no R2)
- Backup do R2 para disco externo local (semestral)

---

## Observabilidade

### Logs

- **Vercel:** log view built-in (7 dias free)
- **Fly.io:** `flyctl logs` e log view no dashboard (retenção limitada no free — o suficiente para debug)
- **Neon:** query logs e slow query analyzer no dashboard
- **Hetzner (temporada):** `journalctl` + logs do Docker, upload diário para R2

### Métricas

- **apps/web:** Vercel Analytics (free)
- **Fly.io:** métricas built-in (CPU, RAM, requests) no dashboard
- **Honeypot durante temporada:** métricas expostas em `apps/admin` via API do próprio backend Fly.io (lê do Neon)

### Alertas

Canal único: webhook Discord/Slack pessoal.

Alertas configurados:

- Fly.io: erros 5xx > 10/min
- Fly.io: cold start > 3s (indica app mal configurado)
- Neon: compute hours > 80% do free tier (aviso antes de cobrar)
- CI: build de main quebrado
- Durante temporada do honeypot: pico incomum (DDoS?) — via exporter customizado
- Certificados (só Hetzner, resto é automático): próximos a expirar

---

## Runbooks básicos

### Fly.io app fora do ar

1. `flyctl status -a <app>` para ver se está suspended ou crashed
2. Se crashed: `flyctl logs -a <app>` para ver o erro
3. Se suspended e app simples, `flyctl machine start` força wake
4. Rollback: `flyctl releases -a <app>` e `flyctl deploy --image <release-anterior>`

### Neon suspendeu no meio de um pico

Normal. Primeira query acorda em ~500ms. Se isso atrapalhar UX de alguma demo:

1. Adicionar health check ping 30s antes da demo no client-side (acorda o DB preventivamente)
2. Considerar Neon Scale-to-Zero com tempo maior de idle no plano pago ($19/mês) — apenas se virar problema recorrente

### Portfólio Vercel fora do ar

Raríssimo, mas:

1. Verificar status.vercel.com
2. Se for nosso problema: `git log` para ver último commit, rollback se necessário
3. Abrir issue no monorepo

### Sandbox sendo abusado

1. `flyctl status` e `flyctl logs` no `sandbox-runner`
2. Identificar IP atacante nos logs
3. Rate limit por IP já configurado no app — se ainda assim passar, adicionar bloqueio via middleware (variável de ambiente `BLOCKED_IPS`)
4. Se muito sério: `flyctl apps stop sandbox-runner` até patchar

### Iniciando uma temporada do honeypot

Procedimento em `infra/hetzner-temporada/README.md`. Resumo:

1. `terraform apply` em `infra/hetzner-temporada/` (provisiona VPS idêntica a última vez)
2. SSH e rodar `setup.sh` (instala Docker, Traefik, honeypots)
3. DNS: apontar `honeypot.<d>` para novo IP
4. Verificar que exporter está populando Neon (`branch honeypot-capture`)
5. Marcar data de início no `apps/admin` (aparece no dashboard)

### Encerrando temporada do honeypot

1. Último export completo do banco local para Neon
2. Snapshot final para R2 (backup histórico)
3. Atualizar dashboard: rótulo muda para "Coleta encerrada · paused"
4. Remover DNS de `honeypot.<d>`
5. `terraform destroy` — VPS destruída, custo para
6. Commit da janela fechada em `docs/honeypot-temporadas.md` (data início/fim, total capturado)

### Portfólio com pico de tráfego (entrevista viralizou)

1. Verificar dashboard Fly.io — se uso subir, considerar ativar `flyctl scale count 2` (2 instâncias paralelas, ainda dentro do free tier)
2. Vercel Analytics para ver origem
3. Se passar 80% do free tier de algum serviço, avaliar upgrade temporário

---

## Custos mensais consolidados

### Cenário realista

| Serviço                                 | Custo típico              |
| --------------------------------------- | ------------------------- |
| Vercel                                  | R$ 0 (free tier)          |
| Fly.io Machines (idle)                  | R$ 0                      |
| Fly.io Machines (mês ativo com tráfego) | R$ 5–15                   |
| Neon Postgres                           | R$ 0 (dentro do free)     |
| GitHub Actions (cron)                   | R$ 0 (repo público)       |
| Cloudflare R2                           | R$ 0 (dentro de 10 GB)    |
| Cloudflare DNS                          | R$ 0                      |
| Domínio `.com.br`                       | ~R$ 40/ano = ~R$ 3,30/mês |
| **Total mensal típico**                 | **R$ 3–15**               |

### Gastos extras não-mensais

| Gasto                                             | Quando            | Valor      |
| ------------------------------------------------- | ----------------- | ---------- |
| Temporada honeypot (Sistemas Operacionais 2024/2) | Uma vez, ~3 meses | ~R$ 84     |
| Temporada honeypot (pré-TCC 2026/2)               | Uma vez, ~1 mês   | ~R$ 28     |
| Ativações pontuais antes de entrevistas           | Esporádico        | R$ 15 cada |

### Comparação com plano antigo

Plano antigo fixo: R$ 56/mês × 24 meses (até o TCC) = **R$ 1.344**
Plano novo típico: R$ 10/mês × 24 meses + R$ 150 de temporadas = **R$ 390**

**Economia projetada até o TCC: ~R$ 950.**

### Budget alvo

**R$ 0–20/mês em meses típicos.** Gastos extras apenas em temporadas planejadas, nunca surpresa.

Se algum serviço passar isso consistentemente sem razão clara, parar e investigar.
