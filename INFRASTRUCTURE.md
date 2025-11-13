# 🏗️ Infrastructure Setup

FredonBytes používá sdílenou lightweight infrastructure pro všechny Next.js aplikace.

## 📦 Infrastructure Stack

Nachází se v: `~/infrastructure/`

**Components:**
- **Traefik v3**: Reverse proxy + dashboard (localhost:8080)
- **CrowdSec**: Modern IPS/IDS security
- **Redis Shared**: Cache pro všechny apps (512MB, 16 databases)
- **Beszel**: Lightweight monitoring (localhost:8090)
- **Dozzle**: Real-time Docker logs (localhost:8081)
- **Redis Insight**: Redis GUI (localhost:5540)

**Resources**: ~400-500MB RAM | 8 containers

## 🚀 Setup Infrastructure (První instalace)

```bash
# 1. Upload infrastructure složku na VPS
cd ~
# (upload infrastructure/ folder)

# 2. Start infrastructure
cd ~/infrastructure
cp .env.example .env
nano .env  # Set GID, CROWDSEC_KEY, BESZEL_KEY

# 3. Deploy
./deploy.sh start

# 4. Verify
docker compose ps
open http://localhost:8080  # Traefik
open http://localhost:8090  # Beszel
```

## 📚 Kompletní Dokumentace

Vše je zdokumentováno v:

```
~/infrastructure/README.md
```

Obsahuje:
- ✅ Detailní setup guide
- ✅ CrowdSec konfigurace & management
- ✅ Beszel monitoring setup
- ✅ Cloudflare Tunnel konfigurace
- ✅ Troubleshooting
- ✅ Backup procedures
- ✅ Next.js app deployment template

## 🔗 Pro tento projekt (fredonbytes)

Tento projekt používá:
- **Redis DB 0**: `redis://redis-shared:6379/0`
- **Network**: `web` (shared s infrastructure)
- **Routing**: Traefik automaticky směruje dle labels

Deployment guide: `DEPLOYMENT.md`

## 🆘 Quick Commands

```bash
# Infrastructure management
cd ~/infrastructure
./deploy.sh start|stop|restart|logs|status

# View infrastructure logs
cd ~/infrastructure
./deploy.sh logs

# Check all services
docker ps | grep -E "traefik|redis|crowdsec|beszel|dozzle"
```

---

**Infrastructure Repository**: Může být shared mezi všemi Next.js projekty na VPS  
**This Project**: FredonBytes main app (Redis DB 0)
