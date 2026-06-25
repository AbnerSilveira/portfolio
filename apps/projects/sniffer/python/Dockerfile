FROM python:3.11-slim

WORKDIR /app

# Scapy/pcap support + basic CA certs
RUN apt-get update \
  && apt-get install -y --no-install-recommends libpcap-dev ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Non-root user
RUN useradd -m -u 1000 -s /bin/bash appuser

# Install deps
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# App source
COPY src/ /app/src/

EXPOSE 8080

USER appuser

# Default: API server (override CMD for CLI)
CMD ["python", "-m", "uvicorn", "src.api:app", "--host", "0.0.0.0", "--port", "8080"]
