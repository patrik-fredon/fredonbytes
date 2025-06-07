# Coolify Deployment Guide for Fredonbytes

This guide provides step-by-step instructions for deploying the Fredonbytes Next.js application to Coolify.

## Prerequisites

- Coolify instance running
- Domain configured
- SSL certificate (Let's Encrypt recommended)
- Node.js 18+ runtime in Coolify

## Environment Variables

Configure the following environment variables in Coolify:

### Required Variables

```bash
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://fredonbytes.cloud
NEXT_TELEMETRY_DISABLED=1
```

### Optional Variables

```bash
# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key_here

# Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_GTM_ID=your_google_tag_manager_id

# Business Information
NEXT_PUBLIC_COMPANY_EMAIL=info@fredonbytes.cloud
NEXT_PUBLIC_COMPANY_PHONE=+420799027984
```

## Coolify Configuration

### 1. Create New Project

1. Go to Coolify dashboard
2. Click "New Project"
3. Choose "Docker" as deployment type
4. Connect your Git repository

### 2. Build Configuration

- **Build Pack**: Docker
- **Dockerfile**: `./Dockerfile`
- **Build Context**: `.`
- **Port**: 3000

### 3. Health Check

Configure health check endpoint:

- **Path**: `/api/health`
- **Method**: GET
- **Expected Status**: 200
- **Timeout**: 30 seconds
- **Interval**: 30 seconds

### 4. Persistent Storage (Optional)

If you need persistent file storage:

- Mount point: `/app/uploads`
- Storage type: Local or S3-compatible

### 5. Custom Headers (Nginx/Caddy)

Add these headers for better security and performance:

```nginx
# Security Headers
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options DENY;
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";

# Cache Headers
location /_next/static/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}

location /static/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

## Performance Optimization

### 1. Image Optimization

Images are automatically optimized by Next.js. Ensure your domain is configured for external image loading if needed.

### 2. Caching Strategy

- Static files: 1 year cache
- API routes: No cache (default)
- Pages: ISR (Incremental Static Regeneration)

### 3. Bundle Analysis

Run locally to analyze bundle size:

```bash
npm run build:analyze
```

## Monitoring and Logging

### Health Check Endpoint

The application includes a health check at `/api/health` that returns:

```json
{
  "uptime": 12345,
  "message": "OK",
  "timestamp": 1641234567890,
  "env": "production",
  "version": "1.0.0"
}
```

### Logs

Application logs are available in Coolify's log viewer. Key log locations:

- Build logs: Available during deployment
- Runtime logs: Available in real-time
- Error logs: Captured automatically

## SSL/TLS Configuration

Coolify automatically handles SSL certificates via Let's Encrypt. Ensure:

1. Domain is properly configured
2. DNS points to Coolify server
3. Firewall allows ports 80 and 443

## Backup Strategy

### Database Backup (if applicable)

Configure automated backups in Coolify for any databases.

### File Backup

For persistent storage, configure regular backups:

- Daily backups recommended
- Retention: 30 days
- Location: External S3-compatible storage

## Scaling

### Horizontal Scaling

For high traffic, consider:

1. Multiple container instances
2. Load balancer configuration
3. Database connection pooling

### Resource Limits

Recommended container resources:

- **Memory**: 512MB minimum, 1GB recommended
- **CPU**: 0.5 cores minimum, 1 core recommended

## Troubleshooting

### Common Issues

#### Build Failures

1. Check Node.js version (must be 18+)
2. Verify all environment variables are set
3. Check for TypeScript errors

#### Runtime Errors

1. Check logs in Coolify dashboard
2. Verify health check endpoint responds
3. Ensure all required environment variables are present

#### Performance Issues

1. Monitor resource usage
2. Check bundle size with analyzer
3. Review Next.js performance metrics

### Support

For deployment issues specific to this application:

- Check documentation in `/docs`
- Review logs for specific error messages
- Contact: info@fredonbytes.cloud

## Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled and enforced
- [ ] Security headers configured
- [ ] API routes protected
- [ ] No sensitive data in logs
- [ ] Regular security updates applied

## Post-Deployment Verification

1. **Health Check**: Verify `/api/health` returns 200
2. **SEO**: Test meta tags with social media validators
3. **Performance**: Run Lighthouse audit
4. **Functionality**: Test all major user flows
5. **Analytics**: Verify tracking is working
6. **Forms**: Test contact form submission
7. **Responsiveness**: Test on various devices

## Maintenance

### Regular Tasks

- [ ] Monitor resource usage weekly
- [ ] Update dependencies monthly
- [ ] Review logs for errors weekly
- [ ] Performance audit quarterly
- [ ] Security audit quarterly

### Updates

Deploy updates through Coolify's automatic deployment when pushing to the main branch.

---

For more detailed technical information, see the main [optimization plan](./COOLIFY_DEPLOYMENT_OPTIMIZATION_PLAN.md).
