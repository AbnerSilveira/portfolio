import type { Metadata } from "next";

import { SnifferWorkbench } from "@projects/sniffer-web";

import {
  PortfolioCmdLine,
  PortfolioPageMain,
} from "@/components/portfolio/PortfolioPageFrame";

export const metadata: Metadata = {
  title: "Sniffer — Demo",
  description:
    "Análise de PCAP com detectores de port scan, ARP spoofing, DNS tunneling e beaconing.",
};

export default function SnifferDemoPage() {
  return (
    <PortfolioPageMain>
      <PortfolioCmdLine cmd="cd ./projetos/sniffer/demo" />
      <SnifferWorkbench variant="embedded" />
    </PortfolioPageMain>
  );
}
