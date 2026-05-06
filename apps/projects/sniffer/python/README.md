# Sniffer — motor Python

Analisador de PCAP com Scapy. Captura **live** não é suportada no deploy (apenas arquivos `.pcap` / `.pcapng`).

```bash
cd apps/projects/sniffer/python
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # Unix
pip install -r requirements.txt
python -m pytest tests -q
uvicorn src.api:app --reload --port 8000
```
