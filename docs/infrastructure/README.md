# 🚀 Lightweight Production Infrastructure

Jednoduchý, efektivní stack pro Next.js aplikace.

## 📦 Co obsahuje

```
├── Traefik         → Reverse proxy + dashboard (localhost:8080)
├── CrowdSec        → Moderní IPS/IDS (60 útoků/h → 1-2 útoky/h)
├── Redis           → Sdílená cache pro všechny Next.js apps (512MB)
├── Beszel          → Lightweight monitoring (localhost:8090)
├── Dozzle          → Real-time Docker logs (localhost:8081)
└── Redis Insight   → Redis management (localhost:5540)

Resources: ~400-500MB RAM | 8 kontejnerů
```

## 🏗️ Architektura

```
Internet → Cloudflare Tunnel → VPS:80
                                  ↓
                               Traefik
                      ┌─────────┴─────────┐
                      ↓                   ↓
              fredonbytes-app     fredonbytes-tech
                 (Redis DB 0)        (Redis DB 1)
                      └─────────┬─────────┘
                                ↓
                          redis-shared
```

---

## ⚡ Quick Start

### 1️⃣ První setup (na VPS)

```bash
# SSH na server
ssh user@your-vps

# Vytvořit strukturu
mkdir -p ~/infrastructure/{traefik,crowdsec}
cd ~/infrastructure

# Upload soubory (nebo git clone)
# - docker-compose.yml
# - traefik/traefik.yml
# - crowdsec/acquis.yaml
# - .env.example
# - deploy.sh

# Nastavit .env
cp .env.example .env
nano .env
# GID=1000 (spusť: id -g)

# Start základních služeb (bez CrowdSec nejdřív)
docker compose up -d traefik redis beszel dozzle

# Počkat 10s
sleep 10

# Start CrowdSec
docker compose up -d crowdsec
sleep 15

# Vygenerovat CrowdSec bouncer key
docker exec crowdsec cscli bouncers add traefik-bouncer -o raw

# Zkopírovat output do .env:
nano .env
# CROWDSEC_KEY=<output-from-above>

# Restart všeho s CrowdSec
docker compose down
docker compose up -d

# Ověřit
docker compose ps
```

### 2️⃣ Beszel Setup

```bash
# Otevřít Beszel web UI
open http://your-vps-ip:8090

# První přihlášení:
# 1. Vytvořit admin účet
# 2. Přidat "System" → vygeneruje KEY
# 3. Zkopírovat KEY do .env:

nano .env
# BESZEL_KEY=<key-from-dashboard>

# Restart agent
docker compose restart beszel-agent

# Refresh dashboard → měl byste vidět server metrics
```

---

## 📱 Access Dashboards

| Dashboard | URL | Popis |
|-----------|-----|-------|
| **Traefik** | http://localhost:8080 | Routing overview |
| **Beszel** | http://localhost:8090 | Server monitoring |
| **Dozzle** | http://localhost:8081 | Real-time logs |
| **Redis Insight** | http://localhost:5540 | Redis management |

### Přístup odkudkoliv (přes Cloudflare Tunnel)

```bash
# V Cloudflare Zero Trust → Tunnels → Add Public Hostname:

monitoring.fredonbytes.eu → localhost:8090  # Beszel
logs.fredonbytes.eu       → localhost:8081  # Dozzle

# ⚠️ Doporučuji přidat Cloudflare Access (auth) před exponováním!
```

---

## 🐳 Deploy Next.js Aplikace

### Template pro docker-compose.yml

```yaml
# ~/fredonbytes/docker-compose.yml
services:
  app:
    container_name: fredonbytes-app
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://redis-shared:6379/0  # DB 0
      # ... další env vars
    networks:
      - web
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.fredonbytes-main.rule=Host(`fredonbytes.eu`) || Host(`fredonbytes.com`)"
      - "traefik.http.routers.fredonbytes-main.entrypoints=web"
      - "traefik.http.services.fredonbytes-main.loadbalancer.server.port=3000"

networks:
  web:
    external: true
    name: web
```

### Deployment

```bash
cd ~/fredonbytes
git pull
docker compose up -d --build

# Verify
docker ps | grep fredonbytes-app
curl -H "Host: fredonbytes.eu" http://localhost
```

---

## 🛡️ CrowdSec Management

### Základní příkazy

```bash
# Zobrazit metriky
docker exec crowdsec cscli metrics

# Zobrazit zablokované IP
docker exec crowdsec cscli decisions list

# Zobrazit alerty
docker exec crowdsec cscli alerts list

# Whitelist IP (např. vaše kancelář)
docker exec crowdsec cscli decisions add --ip YOUR.IP --duration 999999h --type ban --reason "My IP"

# Odblokovat IP
docker exec crowdsec cscli decisions delete --ip BANNED.IP

# Zobrazit bouncers
docker exec crowdsec cscli bouncers list
```

### Instalovat collections

```bash
# Instalovat doporučené collections
docker exec crowdsec cscli collections install crowdsecurity/traefik
docker exec crowdsec cscli collections install crowdsecurity/http-cve
docker exec crowdsec cscli collections install crowdsecurity/linux

# Verify
docker exec crowdsec cscli collections list
```

---

## 📊 Monitoring s Beszel

### Co monitorovat:

- **CPU Usage** → Alert pokud > 80%
- **RAM Usage** → Alert pokud > 85%
- **Disk Usage** → Alert pokud > 80%
- **Container Health** → Uptime pro každý kontejner
- **Network Traffic** → Anomálie v trafficu

### Notifications:

1. V Beszel UI → Settings → Alerts
2. Nastavit thresholdy (CPU > 80%, RAM > 85%)
3. Přidat notifikace (Email, Webhook)

---

## 📝 Logs s Dozzle

### Použití:

```bash
# Otevřít Dozzle
open http://localhost:8081

# Funkce:
# - Real-time streaming logs všech kontejnerů
# - Search/filter logs
# - Multi-container view
# - Dark mode
```

### Hledat v logech:

- Klikni na kontejner (např. fredonbytes-app)
- Použij search box: `error`, `Redis`, atd.
- Filter by time range

---

## 🔧 Common Commands

```bash
cd ~/infrastructure

# Start všeho
./deploy.sh start

# Stop všeho
./deploy.sh stop

# Restart
./deploy.sh restart

# Logy (všechny)
./deploy.sh logs

# Logy (specifický service)
./deploy.sh logs traefik
./deploy.sh logs crowdsec

# Status
./deploy.sh status

# Update images
docker compose pull
docker compose up -d
```

---

## 🌐 Cloudflare Tunnel Setup

### Konfigurace:

```bash
# V Cloudflare Zero Trust → Tunnels → Public Hostnames:

# Next.js aplikace
fredonbytes.eu       → localhost:80  # Traefik směruje na správný kontejner
fredonbytes.com      → localhost:80
tech.fredonbytes.eu  → localhost:80

# Monitoring (optional, s auth!)
monitoring.fredonbytes.eu → localhost:8090  # Beszel
logs.fredonbytes.eu       → localhost:8081  # Dozzle
```

**DŮLEŽITÉ**: Všechny app domény → `localhost:80` (Traefik routing)

---

## 📋 Redis Database Allocation

Rozdělení Redis databází pro projekty:

```bash
DB 0: fredonbytes main app     → REDIS_URL=redis://redis-shared:6379/0
DB 1: tech support app         → REDIS_URL=redis://redis-shared:6379/1
DB 2: budoucí projekt          → REDIS_URL=redis://redis-shared:6379/2
...
DB 15: poslední dostupná
```

### Test Redis:

```bash
# Připojit se k Redis
docker exec -it redis-shared redis-cli

# Vybrat databázi
SELECT 0

# Zobrazit keys
KEYS *

# Get value
GET api:pricing-items:locale=en

# Přepnout na jinou DB
SELECT 1
KEYS *
```

---

## 🔍 Troubleshooting

### CrowdSec nefunguje

```bash
# Check logs
docker logs crowdsec -f

# Verify bouncer key
docker exec crowdsec cscli bouncers list

# Restart bouncer
docker compose restart crowdsec-bouncer
```

### Redis connection errors

```bash
# Check Redis is running
docker ps | grep redis-shared

# Test connection
docker exec redis-shared redis-cli ping
# Expected: PONG

# Check network
docker network inspect web | grep redis-shared
```

### Beszel nevidí server

```bash
# Check agent logs
docker logs beszel-agent

# Verify KEY v .env
cat .env | grep BESZEL_KEY

# Restart agent
docker compose restart beszel-agent
```

### App nevidí Redis

```bash
# Verify network
docker inspect fredonbytes-app | grep -A 10 Networks

# Test connection from app
docker exec fredonbytes-app ping redis-shared

# Check REDIS_URL v .env aplikace
docker exec fredonbytes-app env | grep REDIS_URL
```

---

## 📦 Resources (VPS)

### Tento stack:

```
Minimum: 4GB RAM, 2 CPU
Doporučeno: 8GB RAM, 4 CPU (to co máte je perfektní!)

Infrastructure: ~500MB RAM
Per Next.js app: ~150-200MB RAM

Váš VPS (16GB, 8 CPU):
Může běžet: 20-30 Next.js aplikací klidně
```

---

## 🎯 Deployment Checklist

Před spuštěním v produkci:

- [ ] `.env` nastaveno (GID, CROWDSEC_KEY, BESZEL_KEY)
- [ ] CrowdSec běží a je konfigurovaný
- [ ] Beszel monitoring nastaven s alerty
- [ ] Cloudflare Tunnel konfigurován
- [ ] Redis funguje (test ping)
- [ ] Traefik dashboard accessible
- [ ] Všechny Next.js apps deployed
- [ ] Logy se zobrazují v Dozzle
- [ ] Whitelist vaše IP v CrowdSec

---

## 🚀 Přidání dalšího Next.js projektu

```bash
# 1. Vytvořit projekt
mkdir ~/new-project
cd ~/new-project

# 2. Vytvořit docker-compose.yml (copy from template výše)
# 3. Upravit:
#    - container_name: unique
#    - REDIS_URL DB number (např. DB 2)
#    - Traefik labels (router name + domains)

# 4. Deploy
docker compose up -d --build

# 5. Add to crowdsec monitoring
nano ~/infrastructure/crowdsec/acquis.yaml
# Add: - new-project-app

# 6. Restart crowdsec
cd ~/infrastructure
docker compose restart crowdsec

# Done!
```

---

## 💾 Backup

```bash
# Backup configs
tar -czf ~/backups/infrastructure-$(date +%Y%m%d).tar.gz ~/infrastructure

# Backup Redis
docker exec redis-shared redis-cli SAVE
docker cp redis-shared:/data/dump.rdb ~/backups/redis-$(date +%Y%m%d).rdb

# Restore Redis
docker cp ~/backups/redis-YYYYMMDD.rdb redis-shared:/data/dump.rdb
docker restart redis-shared
```

---

## 📚 Odkazy

- **Traefik**: https://doc.traefik.io/traefik/
- **CrowdSec**: https://docs.crowdsec.net
- **Beszel**: https://github.com/henrygd/beszel
- **Dozzle**: https://dozzle.dev/
- **Redis**: https://redis.io/docs/

---

**VPS Specs**: 16GB RAM, 8 vCPU, 160GB Disk  
**Stack Resources**: ~500MB RAM, 8 containers  
**Production Ready**: ✅ Ano

**Created**: 2025-11-13  
**Last Updated**: 2025-11-13
