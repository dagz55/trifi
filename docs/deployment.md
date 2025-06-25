# TriFi Deployment Guide

This guide covers deploying the TriFi application to various platforms and environments.

## 🚀 Deployment Options

### **Vercel (Recommended)**
Vercel provides the best experience for Next.js applications with automatic deployments and edge functions.

### **Docker**
Containerized deployment for flexibility across different hosting providers.

### **Traditional Hosting**
Standard hosting with Node.js support.

## ☁️ Vercel Deployment

### **Prerequisites**
- GitHub, GitLab, or Bitbucket repository
- Vercel account
- Environment variables configured

### **Step-by-Step Deployment**

1. **Connect Repository**
   ```bash
   # Install Vercel CLI (optional)
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy from project directory
   vercel
   ```

2. **Configure Environment Variables**
   In Vercel Dashboard > Project Settings > Environment Variables:
   
   ```env
   # Required Environment Variables
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
   CLERK_SECRET_KEY=sk_test_xxx
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
   
   # Database
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
   SUPABASE_SERVICE_ROLE_KEY=eyJxxx
   DATABASE_URL=postgresql://xxx
   
   # Optional
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   NODE_ENV=production
   ```

3. **Build Configuration**
   Create `vercel.json` (optional):
   ```json
   {
     "framework": "nextjs",
     "buildCommand": "npm run build",
     "devCommand": "npm run dev",
     "installCommand": "npm install",
     "functions": {
       "app/api/**/*.ts": {
         "maxDuration": 30
       }
     },
     "regions": ["sin1"],
     "env": {
       "NODE_ENV": "production"
     }
   }
   ```

4. **Domain Configuration**
   - Add custom domain in Vercel dashboard
   - Configure DNS records:
     ```
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     
     Type: A
     Name: @
     Value: 76.76.19.61
     ```

### **Automatic Deployments**
- Push to main branch triggers production deployment
- Pull requests create preview deployments
- Preview URLs for testing before merge

## 🐳 Docker Deployment

### **Dockerfile**
Create a production-ready Dockerfile:

```dockerfile
# Multi-stage build for optimal image size
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### **Docker Compose**
For local development and testing:

```yaml
# docker-compose.yml
version: '3.8'

services:
  trifi:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - DATABASE_URL=${DATABASE_URL}
    volumes:
      - ./.env.local:/app/.env.local:ro
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - trifi
    restart: unless-stopped
```

### **Build and Deploy**
```bash
# Build the Docker image
docker build -t trifi:latest .

# Run the container
docker run -p 3000:3000 --env-file .env.local trifi:latest

# Using Docker Compose
docker-compose up -d
```

## 🌐 Traditional Hosting

### **VPS/Cloud Server Deployment**

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 for process management
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   ```

2. **Application Setup**
   ```bash
   # Clone repository
   git clone https://github.com/your-username/trifi.git
   cd trifi
   
   # Install dependencies
   npm ci --only=production
   
   # Build application
   npm run build
   
   # Create ecosystem file for PM2
   cat > ecosystem.config.js << EOF
   module.exports = {
     apps: [{
       name: 'trifi',
       script: 'npm',
       args: 'start',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   }
   EOF
   
   # Start with PM2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

3. **Nginx Configuration**
   ```nginx
   # /etc/nginx/sites-available/trifi
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;
       
       # Redirect HTTP to HTTPS
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl http2;
       server_name your-domain.com www.your-domain.com;
       
       # SSL Configuration
       ssl_certificate /path/to/ssl/certificate.crt;
       ssl_certificate_key /path/to/ssl/private.key;
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers HIGH:!aNULL:!MD5;
       
       # Gzip compression
       gzip on;
       gzip_vary on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
       
       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-XSS-Protection "1; mode=block" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header Referrer-Policy "no-referrer-when-downgrade" always;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
       
       # Static files cache
       location /_next/static {
           alias /path/to/trifi/.next/static;
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
       
       location /public {
           alias /path/to/trifi/public;
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

4. **Enable Site**
   ```bash
   # Create symbolic link
   sudo ln -s /etc/nginx/sites-available/trifi /etc/nginx/sites-enabled/
   
   # Test configuration
   sudo nginx -t
   
   # Restart Nginx
   sudo systemctl restart nginx
   ```

## 📊 Database Setup

### **Supabase (Recommended)**

1. **Create Project**
   - Visit [Supabase Dashboard](https://supabase.com/dashboard)
   - Create new project
   - Note project URL and API keys

2. **Database Schema**
   ```sql
   -- Users table (managed by Supabase Auth)
   -- Additional tables for TriFi
   
   CREATE TABLE transactions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     type VARCHAR(50) NOT NULL,
     description TEXT NOT NULL,
     amount DECIMAL(12,2) NOT NULL,
     date DATE NOT NULL,
     time TIME NOT NULL,
     status VARCHAR(50) DEFAULT 'completed',
     category VARCHAR(100),
     account VARCHAR(100),
     reference VARCHAR(100),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   CREATE TABLE invoices (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     invoice_number VARCHAR(50) UNIQUE NOT NULL,
     client_id UUID,
     subtotal DECIMAL(12,2) NOT NULL,
     tax DECIMAL(12,2) DEFAULT 0,
     total DECIMAL(12,2) NOT NULL,
     status VARCHAR(50) DEFAULT 'draft',
     issue_date DATE NOT NULL,
     due_date DATE NOT NULL,
     paid_date DATE,
     notes TEXT,
     terms TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Add RLS policies
   ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Users can only see their own transactions" ON transactions
     FOR ALL USING (auth.uid() = user_id);
     
   CREATE POLICY "Users can only see their own invoices" ON invoices
     FOR ALL USING (auth.uid() = user_id);
   ```

3. **Environment Setup**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### **Self-hosted PostgreSQL**

1. **Installation**
   ```bash
   # Ubuntu/Debian
   sudo apt install postgresql postgresql-contrib
   
   # Start PostgreSQL
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

2. **Database Setup**
   ```bash
   # Create database and user
   sudo -u postgres psql
   
   CREATE DATABASE trifi_production;
   CREATE USER trifi_user WITH ENCRYPTED PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE trifi_production TO trifi_user;
   \q
   ```

3. **Connection String**
   ```env
   DATABASE_URL=postgresql://trifi_user:secure_password@localhost:5432/trifi_production
   ```

## 🔐 Security Configuration

### **Environment Variables Security**
```bash
# Set restrictive permissions on env files
chmod 600 .env.local
chown root:root .env.local

# Use secrets management in production
# AWS Secrets Manager, HashiCorp Vault, etc.
```

### **HTTPS/SSL Setup**
```bash
# Using Let's Encrypt with Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **Firewall Configuration**
```bash
# UFW (Ubuntu Firewall)
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw status
```

## 📈 Performance Optimization

### **Next.js Configuration**
```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  output: 'standalone', // For Docker deployment
}

export default nextConfig
```

### **CDN Setup**
Configure CloudFlare or AWS CloudFront:
- Cache static assets (CSS, JS, images)
- Enable Brotli/Gzip compression
- Set cache headers
- Enable HTTP/2

### **Database Optimization**
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_invoices_user_status ON invoices(user_id, status);
CREATE INDEX idx_transactions_category ON transactions(category);

-- Enable query optimization
ANALYZE;
```

## 🔍 Monitoring & Logging

### **Application Monitoring**
```javascript
// lib/monitoring.ts
import { NextRequest } from 'next/server'

export function logRequest(req: NextRequest) {
  console.log({
    method: req.method,
    url: req.url,
    userAgent: req.headers.get('user-agent'),
    timestamp: new Date().toISOString(),
  })
}

export function logError(error: Error, context?: any) {
  console.error({
    error: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  })
}
```

### **Health Check Endpoint**
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check database connection
    // Check external services
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message },
      { status: 503 }
    )
  }
}
```

### **Log Management**
```bash
# PM2 log management
pm2 logs trifi --lines 100
pm2 flush trifi

# Rotate logs
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

## 📋 Deployment Checklist

### **Pre-deployment**
- [ ] Environment variables configured
- [ ] Database schema migrated
- [ ] SSL certificates obtained
- [ ] DNS records configured
- [ ] Build tested locally
- [ ] Security headers configured
- [ ] Backup strategy implemented

### **Post-deployment**
- [ ] Health check endpoint working
- [ ] SSL certificate valid
- [ ] Performance metrics baseline
- [ ] Error monitoring active
- [ ] Database connections stable
- [ ] CDN caching working
- [ ] Authentication flow tested

### **Maintenance**
- [ ] Automated backups scheduled
- [ ] SSL certificate auto-renewal
- [ ] Log rotation configured
- [ ] Monitoring alerts set up
- [ ] Update strategy defined
- [ ] Rollback plan documented

## 🚨 Troubleshooting

### **Common Issues**

1. **Build Failures**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   
   # Check TypeScript errors
   npx tsc --noEmit
   ```

2. **Environment Variable Issues**
   ```bash
   # Verify variables are loaded
   printenv | grep NEXT_PUBLIC
   
   # Check in Node.js
   console.log(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
   ```

3. **Database Connection Issues**
   ```bash
   # Test connection
   psql $DATABASE_URL -c "SELECT 1;"
   
   # Check SSL requirements
   psql $DATABASE_URL?sslmode=require -c "SELECT 1;"
   ```

4. **Memory Issues**
   ```bash
   # Increase Node.js memory limit
   NODE_OPTIONS="--max-old-space-size=4096" npm start
   
   # Monitor memory usage
   pm2 monit
   ```

## 📖 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Platform Documentation](https://vercel.com/docs)
- [Docker Best Practices](https://docs.docker.com/develop/best-practices/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [PostgreSQL Performance Tuning](https://www.postgresql.org/docs/current/performance-tips.html)

---

For API setup and configuration, see the [API Documentation](api.md). 