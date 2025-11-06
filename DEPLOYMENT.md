# Fredonbytes Deployment Guide

## Multi-Domain Setup with Coolify & Cloudflare Tunnel

This guide explains how to deploy Fredonbytes with multiple domains using Coolify and Cloudflare Tunnel.

### Architecture Overview

```
User Request (fredonbytes.com)
  ↓
Cloudflare Tunnel
  ↓
localhost:3000
  ↓
Coolify Traefik Proxy
  ↓
Next.js App (Docker Container)
  ↓
Middleware checks domain
  ↓
301 Redirect to fredonbytes.cz (if secondary domain)
```

### Prerequisites

- Coolify instance running
- All domains configured in Cloudflare
- Cloudflare Tunnel routing all domains to your Coolify server's localhost:3000

### Step 1: Cloudflare Tunnel Configuration

Configure your Cloudflare Tunnel to route **all domains** to `localhost:3000`:

```yaml
# cloudflared config.yml
tunnel: <your-tunnel-id>
credentials-file: /path/to/credentials.json

ingress:
  - hostname: fredonbytes.cz
    service: http://localhost:3000
  - hostname: fredonbytes.com
    service: http://localhost:3000
  - hostname: fredonbytes.cloud
    service: http://localhost:3000
  - hostname: fredonbytes.eu
    service: http://localhost:3000
  - hostname: fredonbytes.tech
    service: http://localhost:3000
  - service: http_status:404
```

### Step 2: Coolify Environment Variables

In Coolify, configure the following environment variables for your service:

#### Required Variables

```bash
# Primary Domain Configuration
NEXT_PUBLIC_SITE_URL=https://fredonbytes.cz
NEXT_PUBLIC_PRIMARY_DOMAIN=fredonbytes.cz

# Secondary Domains (comma-separated)
NEXT_PUBLIC_SECONDARY_DOMAINS=fredonbytes.cloud,fredonbytes.com,fredonbytes.eu,fredonbytes.tech

# Domain Strategy (primary = redirect all to primary domain)
NEXT_PUBLIC_DOMAIN_STRATEGY=primary

# Email Configuration
NEXT_PUBLIC_SUPPORT_EMAIL=info@fredonbytes.cz
NEXT_PUBLIC_CONTACT_EMAIL=info@fredonbytes.cz

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# SMTP Configuration
SMTP_HOST=smtp.forpsi.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@fredonbytes.cz
SMTP_PASS=your-smtp-password

# Security
CSRF_SECRET=your-random-secret-min-32-chars
```

### Step 3: Coolify Domain Configuration

In Coolify's service settings:

1. **Primary Domain**: Set `fredonbytes.cz` as the main domain
2. **Additional Domains** (Optional): You can add other domains in Coolify UI, but Traefik labels in docker-compose.yml already handle this

### Step 4: Deploy

1. Push your code to the repository
2. Coolify will automatically build and deploy using docker-compose.yml
3. Wait for the deployment to complete
4. Health check will verify the app is running

### How Multi-Domain Redirect Works

1. **All domains accepted**: Traefik accepts requests from all configured domains (primary + secondary)

2. **Middleware redirect**: The Next.js middleware checks each request:
   - If request is from **primary domain** (fredonbytes.cz) → serve normally
   - If request is from **secondary domain** (fredonbytes.com, etc.) → 301 redirect to primary domain

3. **Port handling**: When behind Cloudflare tunnel or Coolify's Traefik proxy:
   - Redirects use `url.hostname` (not `url.host`) to exclude port number
   - `url.port` is explicitly set to empty string
   - This prevents `https://fredonbytes.eu:3000` style URLs

### Troubleshooting

#### Issue: "Site can't be reached" with `:3000` in URL

**Cause**: The redirect URL includes port `:3000`, which bypasses Cloudflare tunnel

**Solution**:
- Ensure you're using the latest middleware.ts with `url.hostname` and `url.port = ""`
- Verify `NEXT_PUBLIC_PRIMARY_DOMAIN` doesn't include protocol or port (just `fredonbytes.cz`)

#### Issue: Secondary domains not redirecting

**Cause**: Traefik not accepting secondary domains

**Solution**:
- Check Traefik labels in docker-compose.yml include all domains
- Verify `NEXT_PUBLIC_SECONDARY_DOMAINS` environment variable is set correctly
- Check middleware.ts `shouldRedirect()` logic

#### Issue: Infinite redirect loop

**Cause**: Primary domain configuration mismatch

**Solution**:
- Verify `NEXT_PUBLIC_PRIMARY_DOMAIN` matches the domain you want to redirect TO
- Check that primary domain is NOT listed in `NEXT_PUBLIC_SECONDARY_DOMAINS`
- Ensure Cloudflare Tunnel doesn't force redirects

### Monitoring

Check logs in Coolify:

```bash
# App logs
docker logs fredonbytes-app

# Look for middleware redirects
# You should see 301 redirects from secondary to primary domain
```

### Alternative: Multi-Domain Strategy (No Redirects)

If you want to serve content on all domains without redirecting:

```bash
NEXT_PUBLIC_DOMAIN_STRATEGY=multi
```

This disables automatic redirects, and all domains will serve the same content.

**Note**: This is not recommended for SEO as it can cause duplicate content issues.

### SSL/TLS Certificates

Coolify's Traefik automatically requests Let's Encrypt certificates for all configured domains.

Ensure in docker-compose.yml:
```yaml
- "traefik.http.routers.fredonbytes.tls=true"
- "traefik.http.routers.fredonbytes.tls.certresolver=letsencrypt"
```

### Performance Optimization

1. **Redis**: Used for session storage and caching
2. **ISR**: Homepage revalidates every 24 hours
3. **Health checks**: Configured for both app and Redis

### Security

1. **CSRF Protection**: Enabled for all state-changing API requests
2. **Rate Limiting**: 10 requests per minute per IP for API routes
3. **Environment Variables**: Never commit `.env.local` or `.env.production`

## Support

For issues or questions, contact: info@fredonbytes.cz
