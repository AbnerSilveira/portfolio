# Arquitetura — Segurança do Sandbox Runner

Documento técnico sobre como o `services/sandbox-runner` isola projetos "perigosos" do resto da infraestrutura.

Este é um dos pontos mais críticos do monorepo. Uma falha aqui vira manchete. Tratar com paranoia.

---

## Contexto

Projetos como SQL Injection Scanner, OWASP Scanner, WAF e IDS precisam **executar payloads reais** e **analisar tráfego suspeito**. Não dá para rodar em produção pública nem em um container comum.

A solução: `sandbox-runner`, um serviço que:

1. Recebe request do portfólio (autenticada)
2. Instancia container Docker **efêmero** (uso único)
3. Injeta input do usuário
4. Coleta output
5. Destrói o container

---

## Ameaças consideradas

| Ameaça                                     | Mitigação                                               |
| ------------------------------------------ | ------------------------------------------------------- |
| Container escape                           | Capabilities dropped, user namespace, seccomp, AppArmor |
| Esgotamento de recursos (DoS)              | CPU/memória/processos limitados; timeout agressivo      |
| Abuso como proxy/scanner de alvos externos | Network namespace isolado; sem internet                 |
| Crypto mining                              | CPU quota agressiva + detecção de padrões CPU-heavy     |
| Persistência de código malicioso           | Read-only filesystem + container descartado             |
| Enumerar rede interna                      | `network_mode: none` por padrão                         |
| Ler secrets do host                        | Nenhum bind mount de `/` ou paths sensíveis             |
| Saturar disco                              | Limite de escrita em tmpfs                              |
| Roubo via volumes                          | Volumes montados read-only quando aplicável             |

---

## Configuração base do container

Toda execução usa parâmetros como estes:

```typescript
const DEFAULT_DOCKER_CONFIG = {
  Image: "ghcr.io/<seu-usuario>/portfolio-<projeto>:latest",
  HostConfig: {
    Memory: 256 * 1024 * 1024, // 256 MB
    MemorySwap: 256 * 1024 * 1024, // sem swap
    CpuPeriod: 100000,
    CpuQuota: 50000, // 50% de 1 CPU
    PidsLimit: 64,
    ReadonlyRootfs: true,
    AutoRemove: true,
    NetworkMode: "none", // sem rede por padrão
    CapDrop: ["ALL"],
    CapAdd: [], // adicionado por projeto se necessário
    SecurityOpt: [
      "no-new-privileges:true",
      "seccomp=default",
      "apparmor=docker-default",
    ],
    Tmpfs: {
      "/tmp": "rw,noexec,nosuid,size=50m",
    },
    Ulimits: [
      { Name: "nofile", Soft: 256, Hard: 512 },
      { Name: "nproc", Soft: 32, Hard: 64 },
    ],
  },
  User: "1000:1000", // nunca root
  WorkingDir: "/app",
  Env: [], // env vars do projeto, sem secrets do host
};
```

---

## Isolamento de rede

### Padrão: sem rede

Quase todos os projetos rodam com `NetworkMode: "none"`. Input e output são passados por stdin/stdout ou via filesystem temporário.

### Exceção: alvos sandbox pré-definidos

Quando um projeto precisa de rede (ex: SQLi scanner contra DVWA), criar uma rede Docker dedicada contendo apenas o alvo sandbox:

```bash
docker network create --internal sandbox-targets
# target DVWA já está nessa rede
```

O container do scanner entra em `sandbox-targets`. `--internal` impede acesso à internet. Ele só alcança o DVWA (alvo pré-definido), nada mais.

### Nunca

- Rede `bridge` padrão (permite enumerar outros containers)
- Rede `host` (quebra todo o isolamento)
- DNS apontando para resolvers externos (usar DNS interno)

---

## Autenticação e rate limiting

O endpoint `POST /run` do sandbox runner exige:

1. **Token HMAC** — portfólio assina cada request com `SANDBOX_SHARED_SECRET`. Previne uso direto por terceiros.
2. **Rate limit por IP cliente** — 10 runs/hora. Armazenado em Redis.
3. **Rate limit global** — máximo 5 containers simultâneos. Fila o resto.
4. **CORS restrito** — apenas origem do portfólio.

```typescript
const PROJECTS = {
  "sqli-scanner": {
    image: "ghcr.io/.../sqli-scanner:latest",
    timeoutMs: 30_000,
    memoryMb: 256,
    network: "sandbox-targets",
    capAdd: [],
    allowedInputSchema: sqliInputSchema,
  },
  "owasp-scanner": {
    /* ... */
  },
  waf: {
    /* ... */
  },
};
```

Projetos não listados em `PROJECTS` são rejeitados — não dá para pedir execução arbitrária.

---

## Validação de input

Antes de passar input para o container:

```typescript
const parsed = project.allowedInputSchema.safeParse(rawInput);
if (!parsed.success) {
  throw new BadRequestException("Invalid input for this project");
}
```

Cada projeto define seu schema Zod. Exemplo para SQLi scanner:

```typescript
const sqliInputSchema = z.object({
  targetId: z.enum(["dvwa", "juice-shop", "webgoat"]), // fechado
  // sem campo `targetUrl` livre!
});
```

Jamais aceitar URL arbitrária do usuário. A enumeração `targetId` mapeia internamente para URLs pré-configuradas.

---

## Lifecycle de um run

```
1. Request chega em POST /run
2. Auth HMAC verificada
3. Rate limit checado
4. Input validado contra schema do projeto
5. Container criado com config hardened
6. Container iniciado com timeout de N segundos
7. Input escrito em stdin do container
8. Output capturado de stdout/stderr (limitado a 1MB)
9. Timeout guardado: se passar, SIGKILL
10. Container auto-removido
11. Resposta enviada ao portfólio (somente output validado)
12. Log estruturado: inputId, projectId, duração, exitCode, tamanho output
```

---

## Monitoramento

Métricas expostas em `/metrics` (Prometheus format):

- `sandbox_runs_total{project,status}` — contador de runs
- `sandbox_run_duration_seconds{project}` — histograma de duração
- `sandbox_active_containers` — gauge de containers rodando
- `sandbox_rate_limit_rejections_total` — contador de rejeições por rate limit

Alertas configurados:

- `active_containers > 10` por mais de 1min → investigar
- `runs_total / 5min > 500` → ataque em andamento, bloquear IP
- `container OOM killed` → review de limites

---

## Logs

Log estruturado JSON, retido 30 dias, sem conter dados do input do usuário (apenas hashes). Exemplo:

```json
{
  "timestamp": "2025-03-15T14:22:01Z",
  "event": "sandbox.run",
  "runId": "01HSABC...",
  "projectId": "sqli-scanner",
  "clientIp": "203.0.113.42",
  "clientIpHashed": "sha256:abc123...",
  "inputHash": "sha256:def456...",
  "durationMs": 4218,
  "exitCode": 0,
  "outputBytes": 2048,
  "containerId": "f7a8b9c2...",
  "rateLimitRemaining": 7
}
```

---

## O que fazer se algo der errado

### Container não morre

1. `flyctl ssh console -a portfolio-sandbox-runner` e `docker ps` para confirmar
2. `docker kill <id>`
3. Investigar logs (`flyctl logs`) — provavelmente algum escape de timeout
4. Se recorrente, adicionar cgroups com `OOMScoreAdj` e PID limits mais agressivos

### Abuso detectado

1. Adicionar IP à lista `BLOCKED_IPS` (variável de ambiente do Fly app) e redeployar
2. Se o padrão é global (não um IP específico), desabilitar o projeto via feature flag
3. Auditar logs procurando pattern comum
4. Considerar adicionar CAPTCHA no endpoint

### Containers deixando resíduos

Cleanup automático dentro do próprio sandbox-runner (`services/sandbox-runner/src/cleanup.ts` agendado com `node-cron`), rodando de hora em hora:

```bash
docker container prune -f --filter "until=1h"
docker volume prune -f
```

Roda dentro da Fly Machine quando ela está acordada. Se a máquina está suspensa, não há containers para limpar (já destruídos no suspend).

---

## Testes de segurança do próprio sandbox

Incluir em `services/sandbox-runner/tests/security.test.ts`:

- Container não consegue escrever em `/`
- Container não consegue acessar `169.254.169.254` (metadata AWS/cloud)
- Container não consegue listar outros containers
- Container não consegue usar `ptrace`, `mount`, `reboot`
- Timeout realmente mata containers pendurados
- Container killed após exceder memory limit

Rodar esses testes no CI a cada mudança no sandbox runner.

---

## Referências

- [Docker Security Documentation](https://docs.docker.com/engine/security/)
- [OWASP Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)
- [Aqua Security — Container Security Best Practices](https://www.aquasec.com/cloud-native-academy/container-security/container-security-best-practices/)
- [Google gVisor](https://gvisor.dev/) — considerar como runtime alternativo ao `runc` se quiser defense-in-depth extra

---

## Decisão — gVisor/kata containers?

Para o nível de risco deste portfólio (não é SaaS multi-tenant real), Docker com configuração hardened acima é suficiente. gVisor adicionaria overhead de performance e complexidade operacional.

**Revisitar essa decisão se:**

- O portfólio começar a receber ataques sérios
- Algum container escape for demonstrado
- O uso crescer para níveis comerciais

Por enquanto, manter simples e rigoroso.
