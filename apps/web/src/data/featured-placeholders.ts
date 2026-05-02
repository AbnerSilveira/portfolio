import type { ProjectMetadata } from "@portfolio/types";

/** Cards de exemplo (estilo Lovable) para preencher a grade até 6 itens; não correspondem a MDX reais. */
export const FEATURED_PLACEHOLDER_PROJECTS: ProjectMetadata[] = [
  {
    slug: "pipeline-de-deteccao-soc",
    title: "Pipeline de detecção SOC",
    description:
      "Regras Sigma, ingestão Elastic e triagem assistida para reduzir ruído em alertas de laboratório.",
    subject: "SOC",
    semester: "2024/2",
    impact: "high",
    category: "interactive",
    tags: ["sigma", "elastic", "python"],
  },
  {
    slug: "recon-assistido-por-llm",
    title: "Recon assistido por LLM",
    description:
      "Resumo de superfície de ataque com modelo local e checklist de enumeração priorizada.",
    subject: "Offensive",
    semester: "2024/2",
    impact: "high",
    category: "sandbox",
    tags: ["recon", "llm", "go"],
  },
  {
    slug: "lab-de-active-directory",
    title: "Lab de Active Directory",
    description:
      "Movimentação lateral em domínio de testes, BloodHound e cenários purple team documentados.",
    subject: "AD",
    semester: "2025/1",
    impact: "medium",
    category: "interactive",
    tags: ["ad", "bloodhound", "purple-team"],
  },
  {
    slug: "hardening-de-container-ci",
    title: "Hardening de container CI",
    description:
      "Imagens mínimas, Trivy no pipeline e políticas de admission para builds reproduzíveis.",
    subject: "DevSecOps",
    semester: "2025/1",
    impact: "medium",
    category: "documentation",
    tags: ["docker", "trivy", "ci"],
  },
  {
    slug: "ctf-write-ups",
    title: "CTF write-ups",
    description:
      "Notas de resolução, exploits didáticos e lições aprendidas por desafio (sem flags reais).",
    subject: "CTF",
    semester: "2023/2",
    impact: "low",
    category: "documentation",
    tags: ["ctf", "writeups"],
  },
  {
    slug: "notas-de-seguranca-ofensiva",
    title: "Notas de segurança ofensiva",
    description:
      "Resumos táticos mapeados a MITRE ATT&CK e referências para estudo dirigido.",
    subject: "Notes",
    semester: "2024/1",
    impact: "low",
    category: "documentation",
    tags: ["notes", "mitre"],
  },
];
