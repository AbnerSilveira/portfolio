# 05 — Roadmap de Projetos

Plano completo dos 15 projetos + TCC. A ordem segue o calendário acadêmico. Cada projeto tem uma ficha técnica, estimativa de esforço e estratégia de demonstração.

---

## Ordem de execução

| Ordem | Projeto                   | Matéria               | Semestre | Impacto | Categoria    |
| ----- | ------------------------- | --------------------- | -------- | ------- | ------------ |
| 1     | RSA Visualizer            | Matemática Discreta   | 2023/1   | 🟡      | Interativa   |
| 2     | Sniffer                   | Redes I               | 2023/2   | 🔴      | Vídeo        |
| 3     | Password Manager          | AED I                 | 2023/2   | 🟡      | Interativa   |
| 4     | SQL Injection Scanner     | BD I                  | 2024/1   | 🔴      | Sandbox      |
| 5     | Esteganálise              | Visão Computacional   | 2024/1   | 🟡      | Interativa   |
| 6     | OWASP Scanner             | Tecnologia Web        | 2024/1   | 🔴      | Sandbox      |
| 7     | Honeypot ⭐               | Sistemas Operacionais | 2024/2   | 🔴      | Híbrida      |
| 8     | Encrypted Storage         | BD II                 | 2024/2   | 🔴      | Interativa   |
| 9     | WAF                       | Sistemas Web          | 2024/2   | 🔴      | Sandbox      |
| 10    | CIS Auditor ⭐            | Seg. e Auditoria      | 2025/1   | 🔴      | Sandbox      |
| 11    | Mobile 2FA                | Aplicativos Mobile    | 2025/1   | 🟡      | Interativa   |
| 12    | DevSecOps Pipeline        | Qualidade de Software | 2025/1   | 🟢      | Documentação |
| 13    | IDS                       | Redes II              | 2025/2   | 🔴      | Sandbox      |
| 14    | Threat Intel Dashboard ⭐ | Analytics             | 2025/2   | 🔴      | Live         |
| 15    | IoT Security              | Sistemas Distribuídos | 2026/1   | 🔴      | Vídeo        |
| TCC   | SAD Cibersegurança ⭐     | TCC                   | 2026/2   | 🔴      | Híbrida      |

---

## Fichas técnicas resumidas

### 1. RSA Visualizer — Matemática Discreta (2023/1)

**O quê:** Aplicação didática que implementa RSA e Diffie-Hellman do zero em TypeScript, com visualização passo a passo dos cálculos matemáticos (escolha de primos, cálculo de chaves, encriptação, decriptação).

**Stack:** Next.js client-side, Framer Motion para animações, BigInt nativo para aritmética modular.

**Por que é um bom primeiro projeto:** escopo pequeno, roda 100% no browser, é um ótimo template para os próximos projetos. Você estabelece o padrão de como documentar, testar e integrar ao portfólio.

**Demo:** `<DemoFrame />` no portfólio.

**Esforço estimado:** 1 semana.

### 2. Sniffer — Redes I (2023/2)

**O quê:** Sniffer de pacotes em Python (Scapy) com análise automatizada de tráfego: detecção de port scanning, ARP spoofing, DNS tunneling, beaconing.

**Stack:** Python 3.11 + Scapy + FastAPI (para expor API ao sandbox) + Next.js (UI de visualização).

**Desafios:** Scapy exige privilégios raw socket. No container do Fly Machine, roda com `cap_add: NET_ADMIN, NET_RAW` — aceitável porque o projeto trabalha sobre PCAPs enviados, não captura live.

**Demo:** Vídeo gravado + análise de PCAP estático (usuário faz upload de `.pcap`, sistema analisa).

**Esforço estimado:** 2 semanas.

### 3. Password Manager — AED I (2023/2)

**O quê:** Cofre de senhas com hashing Argon2id, criptografia AES-256-GCM, derivação de chaves com PBKDF2. Implementa árvore B+ para organização dos entries (aplicação direta de AED).

**Stack:** Next.js + `@portfolio/crypto-utils` + IndexedDB local.

**Zero-knowledge:** servidor nunca vê senhas. Tudo client-side.

**Demo:** interativa — usuário pode criar vault demo temporário.

**Esforço estimado:** 2 semanas.

### 4. SQL Injection Scanner — BD I (2024/1)

**O quê:** Scanner automatizado que testa formulários web e APIs contra SQLi (union-based, error-based, time-based, boolean-based). Gera relatório com payload, response, remediação.

**Stack:** Python + Playwright para navegar forms + regras baseadas em sqlmap (sem ser sqlmap).

**Sandbox obrigatório:** tem que rodar contra DVWA/Juice Shop — esses alvos são spawnados como containers efêmeros pelo sandbox runner (Fly.io) a cada execução. Nunca aceita URL arbitrária do usuário (evita uso malicioso).

**Demo:** sandbox com DVWA pré-configurado, usuário escolhe o target entre uma lista fechada.

**Esforço estimado:** 2 semanas.

### 5. Esteganálise — Visão Computacional (2024/1)

**O quê:** Detecção de mensagens ocultas em imagens via LSB (Least Significant Bit), análise chi-quadrado, visual attacks.

**Stack:** Next.js + WebAssembly (compilar detector em Rust/C para rodar no browser).

**Demo:** interativa — upload de imagem, análise em tempo real.

**Esforço estimado:** 2 semanas.

### 6. OWASP Scanner — Tecnologia Web (2024/1)

**O quê:** Scanner de vulnerabilidades Top 10 OWASP: XSS refletido/armazenado, CSRF, IDOR, SSRF, Open Redirect, headers de segurança ausentes.

**Stack:** Node.js + Playwright + regras customizadas, UI Next.js.

**Sandbox obrigatório:** mesmo approach do SQLi scanner — alvos pré-definidos (Juice Shop, WebGoat).

**Demo:** sandbox com Juice Shop, relatório detalhado estilo Burp.

**Esforço estimado:** 3 semanas.

### 7. Honeypot ⭐ — Sistemas Operacionais (2024/2)

**O quê:** Honeypot multi-serviço simulando SSH, FTP, HTTP vulneráveis. Captura credenciais testadas, comandos executados, payloads enviados. Dashboard exibe ataques em tempo real.

**Stack:** Python (Cowrie-like customizado) + PostgreSQL + Next.js dashboard.

**Integração com threat-intel-aggregator:** IPs capturados são enriquecidos automaticamente (país, ASN, reputação AbuseIPDB).

**Demo:** **dashboard público** no portfólio com dados reais acumulados (IPs mascarados por LGPD). Isso é um dos maiores diferenciais do portfólio — dados reais impressionam muito.

**Esforço estimado:** 3 semanas.

### 8. Encrypted Storage — BD II (2024/2)

**O quê:** Sistema de criptografia de dados sensíveis em repouso com rotação de chaves. Detector de PII (CPF, cartões, RG) em dumps de texto usando regex + validação algorítmica (Luhn para cartões, DV para CPF).

**Stack:** NestJS + PostgreSQL + `pgcrypto` + `@portfolio/crypto-utils`.

**Demo:** interativa — usuário cola texto, sistema destaca PII encontrado.

**Esforço estimado:** 2 semanas.

### 9. WAF — Sistemas Web (2024/2)

**O quê:** Web Application Firewall com engine de regras customizáveis. Bloqueia SQLi, XSS, Command Injection, Path Traversal, Scanner detection. Painel de monitoramento em tempo real.

**Stack:** Node.js (middleware Express/Fastify) + Redis (rate limiting) + Next.js dashboard.

**Sandbox:** aplicação de teste protegida pelo WAF, usuário tenta ataques no frontend e vê o WAF bloqueando.

**Esforço estimado:** 3 semanas.

### 10. CIS Auditor ⭐ — Seg. e Auditoria (2025/1)

**O quê:** Ferramenta de auditoria automatizada baseada em CIS Benchmarks (Ubuntu 22.04, Windows Server 2022). Verifica configurações de segurança, gera relatório de conformidade com sugestões de remediação.

**Stack:** Python + Jinja2 (relatórios) + Next.js UI.

**Sandbox:** container Ubuntu sacrificial efêmero no sandbox runner, usuário dispara audit, recebe relatório.

**Por que é projeto-âncora:** reúne muitos conceitos (sysadmin, compliance, scripting, reporting). Recrutadores de segurança entendem o valor imediatamente.

**Esforço estimado:** 3 semanas.

### 11. Mobile 2FA — Aplicativos Mobile (2025/1)

**O quê:** App Android/iOS que gera códigos TOTP (RFC 6238) com backup criptografado, scanner de permissões perigosas em apps instalados.

**Stack:** React Native ou Flutter + `@portfolio/crypto-utils`.

**Demo:** APK assinado disponível para download + versão web da UI no portfólio.

**Esforço estimado:** 3 semanas.

### 12. DevSecOps Pipeline — Qualidade de Software (2025/1)

**O quê:** Documentação completa + exemplo vivo do pipeline DevSecOps já integrado ao monorepo. Adiciona DAST (ZAP automation) ao fluxo.

**Stack:** GitHub Actions + templates reutilizáveis.

**Demo:** documentação MDX + link para GitHub Actions do próprio monorepo (live CI verde como prova).

**Esforço estimado:** 1 semana (é mais doc que código).

### 13. IDS — Redes II (2025/2)

**O quê:** Intrusion Detection System com regras customizadas (Snort-like). Análise de tráfego capturado em tempo real, detecção de anomalias por metadados.

**Stack:** Python + Scapy + PostgreSQL + Next.js dashboard.

**Integração:** usa o sniffer (projeto 2) como base, estende com engine de regras e alertas.

**Sandbox:** PCAP pré-carregado, usuário vê alertas gerados.

**Esforço estimado:** 3 semanas.

### 14. Threat Intel Dashboard ⭐ — Analytics (2025/2)

**O quê:** Dashboard que agrega dados de AbuseIPDB, VirusTotal, Shodan, URLhaus, ThreatFox. Correlaciona ameaças, mostra tendências, heatmaps geográficos.

**Stack:** Next.js + `services/threat-intel-aggregator` (NestJS) + PostgreSQL + Recharts/D3.

**Demo:** **live no portfólio** com dados reais atualizados. Visualmente impressionante.

**Esforço estimado:** 3 semanas.

### 15. IoT Security — Sistemas Distribuídos (2026/1)

**O quê:** Framework de segurança para IoT — detecção de firmware comprometido (comparação de hashes contra baseline conhecido), comunicação MQTT com TLS mútuo, detecção de dispositivos rogue na rede.

**Stack:** Go (agent no dispositivo) + Node.js (servidor central) + ESP32 (dispositivos reais de teste).

**Demo:** vídeo mostrando 3 ESP32 reais, um com firmware adulterado, sistema detectando.

**Esforço estimado:** 4 semanas.

### TCC. SAD Cibersegurança ⭐ — 2026/2

Já documentado em detalhes em `docs/06-integracao-tcc.md` e no próprio `apps/projects/sad-ciberseguranca/CLAUDE.md` (anexado como referência).

**Esforço estimado:** semestre inteiro.

---

## Ritual para iniciar um projeto novo

Todo projeto segue o mesmo ritual. Documentado em `docs/workflow/new-project.md`. Resumidamente:

1. Criar pasta `apps/projects/<slug>/` a partir do template
2. Copiar `CLAUDE.md` template e adaptar para o projeto
3. Copiar `README.md` template e adaptar
4. Escrever os primeiros testes (TDD) antes do código
5. Implementar iterativamente, commit a cada small release
6. Criar MDX em `apps/web/content/projects/<slug>.mdx`
7. Adicionar demo (interactive/sandbox/video conforme categoria)
8. Validar CI verde, revisar, mergear
9. Atualizar CLAUDE.md da raiz com obstáculos descobertos

---

## Calendário realista

Assumindo disponibilidade de fim de semana + algumas noites (15h/semana em média):

- **Fase 0 (infra):** Mês 1
- **Fase 1 (portfólio público):** Mês 2
- **Fase 2 (projetos):** ~44 semanas de esforço estimado × ritmo realista = distribuído ao longo de 2023/2 a 2026/1
- **Fase 3 (TCC):** 2026/2

O ritmo real vai oscilar — semanas de prova terão menos código, férias terão mais. A vantagem do monorepo é que projetos parados continuam operacionais, não apodrecem.

---

## Projetos marcados com ⭐

São os 4 "projetos-hero" que mais chamam atenção em portfólio de segurança:

- **Honeypot** — dados reais acumulados = vitrine ao vivo
- **CIS Auditor** — demonstra compreensão de compliance real
- **Threat Intel Dashboard** — visualmente impressionante
- **SAD Cibersegurança (TCC)** — profundidade técnica + rigor acadêmico

Vale investir extra em polimento visual e documentação nestes quatro.

---

**Próximo passo:** `docs/roadmap/2023-1.md` quando começar o primeiro projeto (RSA Visualizer).
