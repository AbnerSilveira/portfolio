import type { ProjectMetadata } from "@portfolio/types";

/** Catálogo canônico (roadmap 05). MDX publicado sobrescreve metadados e marca como `ready`. */
export const PROJECT_CATALOG: Omit<ProjectMetadata, "status">[] = [
  {
    slug: "rsa-visualizer",
    title: "RSA Visualizer",
    description:
      "RSA didático no browser: primos, φ(n), Euclides estendido, chaves e encriptação com animações.",
    subject: "Matemática Discreta",
    semester: "2023/1",
    impact: "medium",
    category: "interactive",
    tags: ["rsa", "criptografia", "matemática-discreta"],
  },
  {
    slug: "sniffer",
    title: "Sniffer com Análise de Ameaças",
    description:
      "Análise de PCAP com detectores de port scan, ARP spoof, DNS tunneling e beaconing.",
    subject: "Redes I",
    semester: "2023/2",
    impact: "high",
    category: "interactive",
    tags: ["python", "scapy", "fastapi", "ids-lite"],
  },
  {
    slug: "password-manager",
    title: "Password Manager",
    description:
      "Cofre zero-knowledge com Argon2id, AES-256-GCM e árvore B+ para organização de entries.",
    subject: "AED I",
    semester: "2023/2",
    impact: "medium",
    category: "interactive",
    tags: ["crypto", "bplus-tree", "zero-knowledge"],
  },
  {
    slug: "sql-injection-scanner",
    title: "SQL Injection Scanner",
    description:
      "Scanner automatizado contra SQLi (union, error, time, boolean) com relatório de remediação.",
    subject: "BD I",
    semester: "2024/1",
    impact: "high",
    category: "sandbox",
    tags: ["sqli", "python", "playwright"],
  },
  {
    slug: "stegananalysis",
    title: "Esteganálise",
    description:
      "Detecção de mensagens ocultas em imagens via LSB, chi-quadrado e visual attacks.",
    subject: "Visão Computacional",
    semester: "2024/1",
    impact: "medium",
    category: "interactive",
    tags: ["steganography", "lsb", "wasm"],
  },
  {
    slug: "owasp-scanner",
    title: "OWASP Scanner",
    description:
      "Scanner Top 10 OWASP: XSS, CSRF, IDOR, SSRF, open redirect e headers ausentes.",
    subject: "Tecnologia Web",
    semester: "2024/1",
    impact: "high",
    category: "sandbox",
    tags: ["owasp", "playwright", "web-security"],
  },
  {
    slug: "honeypot",
    title: "Honeypot",
    description:
      "Honeypot multi-serviço com dashboard de ataques reais capturados (IPs mascarados).",
    subject: "Sistemas Operacionais",
    semester: "2024/2",
    impact: "high",
    category: "interactive",
    tags: ["honeypot", "soc", "lgpd"],
  },
  {
    slug: "encrypted-storage",
    title: "Encrypted Storage",
    description:
      "Criptografia em repouso com rotação de chaves e detector de PII (CPF, cartões).",
    subject: "BD II",
    semester: "2024/2",
    impact: "high",
    category: "interactive",
    tags: ["postgres", "pgcrypto", "pii"],
  },
  {
    slug: "waf",
    title: "WAF",
    description:
      "Web Application Firewall com engine de regras e painel de bloqueios em tempo real.",
    subject: "Sistemas Web",
    semester: "2024/2",
    impact: "high",
    category: "sandbox",
    tags: ["waf", "redis", "modsecurity-like"],
  },
  {
    slug: "cis-auditor",
    title: "CIS Auditor",
    description:
      "Auditoria automatizada CIS Benchmarks (Ubuntu/Windows) com relatório de conformidade.",
    subject: "Seg. e Auditoria",
    semester: "2025/1",
    impact: "high",
    category: "sandbox",
    tags: ["cis", "compliance", "audit"],
  },
  {
    slug: "mobile-2fa",
    title: "Mobile 2FA",
    description:
      "App TOTP (RFC 6238) com backup criptografado e scanner de permissões perigosas.",
    subject: "Aplicativos Mobile",
    semester: "2025/1",
    impact: "medium",
    category: "interactive",
    tags: ["totp", "mobile", "2fa"],
  },
  {
    slug: "devsecops-pipeline",
    title: "DevSecOps Pipeline",
    description:
      "Pipeline DevSecOps vivo do monorepo: SAST, SCA, secrets, DAST e CI verde como prova.",
    subject: "Qualidade de Software",
    semester: "2025/1",
    impact: "low",
    category: "documentation",
    tags: ["devsecops", "github-actions", "ci"],
  },
  {
    slug: "ids",
    title: "IDS",
    description:
      "Intrusion Detection System com engine de regras Snort-like e correlação temporal.",
    subject: "Redes II",
    semester: "2025/2",
    impact: "high",
    category: "sandbox",
    tags: ["ids", "scapy", "rules"],
  },
  {
    slug: "threat-intel-dashboard",
    title: "Threat Intel Dashboard",
    description:
      "Dashboard OSINT agregando AbuseIPDB, VirusTotal, Shodan e tendências geográficas.",
    subject: "Analytics",
    semester: "2025/2",
    impact: "high",
    category: "interactive",
    tags: ["threat-intel", "osint", "recharts"],
  },
  {
    slug: "iot-security",
    title: "IoT Security",
    description:
      "Segurança IoT: baseline de firmware, MQTT com mTLS e detecção de dispositivos rogue.",
    subject: "Sistemas Distribuídos",
    semester: "2026/1",
    impact: "high",
    category: "video",
    tags: ["iot", "mqtt", "esp32"],
  },
  {
    slug: "sad-ciberseguranca",
    title: "SAD Cibersegurança (TCC)",
    description:
      "Sistema de Apoio à Decisão com Gordon-Loeb, AHP e TOPSIS para investimento em segurança.",
    subject: "TCC",
    semester: "2026/2",
    impact: "high",
    category: "interactive",
    tags: ["tcc", "ahp", "topsis", "decision-support"],
  },
];
