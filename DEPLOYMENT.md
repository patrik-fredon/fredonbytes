# 🚀 FredonBytes - Deployment Guide

Main Next.js application using lightweight infrastructure stack.

## 📦 Stack Architecture

```
FredonBytes App
├── Uses: ~/infrastructure (Traefik + Redis + CrowdSec + Beszel + Dozzle)
├── Redis: DB 0 (redis-shared:6379/0)
├── Network: web (shared with infrastructure)
└── Domains: fredonbytes.eu, .com, .tech, .cloud, .cz
```

## ⚡ Quick Deploy

```bash
cd ~/fredonbytes

# Pull latest changes
git pull

# Build and start
docker compose up -d --build

# Check status
docker compose ps
docker logs fredonbytes-app --tail 50

# Test
curl -H "Host: fredonbytes.eu" http://localhost
```

## 🔧 Environment Variables

Vytvořte `.env` soubor:

```bash
# Core
NODE_ENV=production
REDIS_URL=redis://redis-shared:6379/0
CSRF_SECRET=<generate-with: openssl rand -hex 32>
BEHIND_PROXY=true

# Domains
NEXT_PUBLIC_SITE_URL=https://fredonbytes.eu
NEXT_PUBLIC_PRIMARY_DOMAIN=fredonbytes.eu
NEXT_PUBLIC_SECONDARY_DOMAINS=fredonbytes.com,fredonbytes.tech,fredonbytes.cloud,fredonbytes.cz
NEXT_PUBLIC_DOMAIN_STRATEGY=primary

# Email
NEXT_PUBLIC_SUPPORT_EMAIL=support@fredonbytes.eu
NEXT_PUBLIC_CONTACT_EMAIL=contact@fredonbytes.eu

# SMTP
SMTP_HOST=smtp.forpsi.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_REJECT_UNAUTHORIZED=true

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# SEO (optional)
NEXT_PUBLIC_GOOGLE_VERIFICATION=
NEXT_PUBLIC_BING_VERIFICATION=
```

## 🌐 Cloudflare Tunnel

V Cloudflare Zero Trust → Tunnels:

```
fredonbytes.eu      → localhost:80
fredonbytes.com     → localhost:80
fredonbytes.tech    → localhost:80
fredonbytes.cloud   → localhost:80
fredonbytes.cz      → localhost:80
```

**DŮLEŽITÉ**: Všechny domény → `localhost:80` (Traefik routing)

## 📊 Monitoring

### Beszel Dashboard
```bash
open http://your-vps:8090
# Sledujte: CPU, RAM, Container status
```

### Dozzle Logs
```bash
open http://your-vps:8081
# Real-time logs pro fredonbytes-app
```

### Redis Cache
```bash
# Check cache hits
docker exec redis-shared redis-cli
> SELECT 0
> KEYS api:*
> GET api:pricing-items:locale=en
```

## 🔍 Troubleshooting

### App nevidí Redis
```bash
# Test connection
docker exec fredonbytes-app ping redis-shared

# Check network
docker network inspect web | grep fredonbytes-app

# Verify REDIS_URL
docker exec fredonbytes-app env | grep REDIS_URL
```

### Slow loading
```bash
# Check Redis
docker exec redis-shared redis-cli ping

# Clear cache
docker exec redis-shared redis-cli FLUSHDB

# Restart app
docker compose restart
```

### Build errors
```bash
# Clean build
docker compose down
docker compose build --no-cache
docker compose up -d
```

## 🔄 Update Workflow

```bash
# 1. Pull changes
git pull

# 2. Rebuild
docker compose up -d --build

# 3. Verify
docker compose ps
curl https://fredonbytes.eu/api/health

# 4. Check logs
docker logs fredonbytes-app --tail 100
```

## 📝 Prerequisites

1. ✅ Infrastructure running (`~/infrastructure`)
2. ✅ `.env` file configured
3. ✅ Cloudflare Tunnel configured
4. ✅ Docker network `web` exists

Check infrastructure:
```bash
cd ~/infrastructure
docker compose ps
# Should see: traefik, redis-shared, crowdsec, beszel, dozzle
```

## 🎯 Production Checklist

- [ ] Infrastructure stack running
- [ ] `.env` file configured with real values
- [ ] Redis connection working (test ping)
- [ ] Traefik routing configured
- [ ] Cloudflare Tunnel pointing to localhost:80
- [ ] Health endpoint responding: /api/health
- [ ] Logs visible in Dozzle
- [ ] Monitoring in Beszel

## 🆘 Common Issues

**Issue**: `Error: getaddrinfo ENOTFOUND redis-shared`  
**Fix**: Start infrastructure first: `cd ~/infrastructure && docker compose up -d`

**Issue**: `Network web not found`  
**Fix**: Infrastructure creates this network: `cd ~/infrastructure && ./deploy.sh start`

**Issue**: `/pricing slow loading`  
**Fix**: Check Redis cache: `docker exec redis-shared redis-cli ping`

---

**Related**: See `~/infrastructure/README.md` for infrastructure setup
