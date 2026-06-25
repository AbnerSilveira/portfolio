# Fixtures PCAP

PCAPs **sintéticos** para demos e testes — gerados com Scapy, nunca tráfego real.

| Arquivo                | Detector      |
| ---------------------- | ------------- |
| `port-scan-demo.pcap`  | TCP SYN scan  |
| `arp-spoof-demo.pcap`  | ARP spoofing  |
| `dns-tunnel-demo.pcap` | DNS tunneling |
| `beaconing-demo.pcap`  | Beaconing     |

Regenerar (copia para `fixtures/`, `web/public/fixtures/` e `apps/web/public/fixtures/`):

```bash
pnpm --filter @projects/sniffer generate:fixtures
```
