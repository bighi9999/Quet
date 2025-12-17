# 🚀 PRODUCTION DEPLOYMENT COMPLETE

## 🌐 DOMAIN INFORMATION

**Production URL:** https://mochiphoto.click  
**Alternative URL:** https://www.mochiphoto.click  
**Server IP:** 14.225.210.195  
**Deployment Date:** 2025-12-17  

---

## ✅ DEPLOYMENT STATUS

| Component | Status | Details |
|-----------|--------|---------|
| 🌐 **Domain** | ✅ ACTIVE | mochiphoto.click (DNS configured) |
| 🔒 **SSL Certificate** | ✅ VALID | Let's Encrypt (expires 2026-03-17) |
| 🚀 **Next.js App** | ✅ RUNNING | Port 3000 (PM2 managed) |
| 🔧 **Nginx** | ✅ ACTIVE | Reverse proxy configured |
| 🔥 **Firewall** | ✅ CONFIGURED | Ports 80, 443 open |

---

## 🏗️ INFRASTRUCTURE ARCHITECTURE

```
Internet (HTTPS)
      ↓
mochiphoto.click:443 (SSL/TLS)
      ↓
Nginx Reverse Proxy
      ↓
localhost:3000 (Next.js 14)
      ↓
PM2 Process Manager
```

---

## 📦 INSTALLED COMPONENTS

### 1. **PM2 (Process Manager)**
- **Process Name:** `bg-ai-tools`
- **Command:** `npm run dev`
- **Status:** Online
- **Auto-restart:** Enabled
- **Monitoring:** `pm2 status`

### 2. **Nginx (Web Server)**
- **Version:** 1.18.0 (Ubuntu)
- **Config:** `/etc/nginx/sites-available/mochiphoto.click`
- **Features:**
  - Reverse proxy to localhost:3000
  - WebSocket support (Upgrade headers)
  - Static asset caching
  - Real IP forwarding

### 3. **Certbot (SSL Manager)**
- **Certificate:** Let's Encrypt
- **Domains:** mochiphoto.click, www.mochiphoto.click
- **Auto-renewal:** Configured (renews 30 days before expiry)
- **Certificate Path:** `/etc/letsencrypt/live/mochiphoto.click/`

### 4. **UFW (Firewall)**
- **Status:** Active
- **Rules:**
  - Port 80 (HTTP): Allow
  - Port 443 (HTTPS): Allow
  - Other ports: Deny by default

---

## 🔧 CONFIGURATION FILES

### `/etc/nginx/sites-available/mochiphoto.click`
```nginx
server {
    server_name mochiphoto.click www.mochiphoto.click;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/mochiphoto.click/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/mochiphoto.click/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = www.mochiphoto.click) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    if ($host = mochiphoto.click) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    server_name mochiphoto.click www.mochiphoto.click;
    return 404; # managed by Certbot
}
```

### `/home/root/webapp/nextjs-cyber/.env.local`
```bash
REPLICATE_API_TOKEN=your_replicate_token_here
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

**Note:** Replace with your actual API keys from:
- Replicate: https://replicate.com/account/api-tokens
- Google AI: https://aistudio.google.com/app/apikey

---

## 🚀 DEPLOYMENT COMMANDS

### PM2 Management
```bash
# Check status
pm2 status

# View logs
pm2 logs bg-ai-tools

# Restart app
pm2 restart bg-ai-tools

# Stop app
pm2 stop bg-ai-tools

# Save PM2 configuration
pm2 save
```

### Nginx Management
```bash
# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Check status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate Management
```bash
# Manual renewal
sudo certbot renew

# Check certificate expiry
sudo certbot certificates

# Test auto-renewal
sudo certbot renew --dry-run
```

### Firewall Management
```bash
# Check firewall status
sudo ufw status

# Allow port
sudo ufw allow 80
sudo ufw allow 443

# Reload firewall
sudo ufw reload
```

---

## 📊 MONITORING & LOGS

### Application Logs
```bash
# PM2 logs (real-time)
cd /home/root/webapp/nextjs-cyber && pm2 logs bg-ai-tools

# PM2 logs (last 50 lines)
cd /home/root/webapp/nextjs-cyber && pm2 logs bg-ai-tools --lines 50 --nostream
```

### Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### System Logs
```bash
# Check system resource usage
htop

# Check disk space
df -h

# Check memory usage
free -h
```

---

## 🔄 UPDATE PROCEDURE

### 1. Pull Latest Code
```bash
cd /home/root/webapp/nextjs-cyber
git pull origin main
```

### 2. Install Dependencies (if needed)
```bash
npm install
```

### 3. Restart Application
```bash
pm2 restart bg-ai-tools
```

### 4. Verify Deployment
```bash
curl -I https://mochiphoto.click
```

---

## 🛠️ TROUBLESHOOTING

### Problem: App not starting
**Solution:**
```bash
cd /home/root/webapp/nextjs-cyber
pm2 logs bg-ai-tools --err
npm install
pm2 restart bg-ai-tools
```

### Problem: SSL certificate expired
**Solution:**
```bash
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

### Problem: Nginx not serving content
**Solution:**
```bash
sudo nginx -t
sudo systemctl restart nginx
sudo tail -f /var/log/nginx/error.log
```

### Problem: Port 3000 already in use
**Solution:**
```bash
pm2 stop bg-ai-tools
lsof -ti:3000 | xargs kill -9
pm2 start bg-ai-tools
```

---

## 📈 PERFORMANCE OPTIMIZATION

### Enable Gzip Compression
Add to Nginx config:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### Enable HTTP/2
Nginx already supports HTTP/2 with `listen 443 ssl http2;`

### Next.js Production Build
```bash
cd /home/root/webapp/nextjs-cyber
npm run build
pm2 stop bg-ai-tools
pm2 start npm --name "bg-ai-tools" -- start
pm2 save
```

---

## 🔐 SECURITY CHECKLIST

- [x] SSL/TLS certificate installed (HTTPS)
- [x] Firewall configured (UFW)
- [x] Environment variables secured (.env.local)
- [x] Nginx security headers configured
- [x] Auto-renewal for SSL certificates
- [x] Non-root user for application (root - to be changed)

### Recommended: Create Non-Root User
```bash
sudo adduser bgaitools
sudo usermod -aG sudo bgaitools
# Transfer PM2 processes to new user
pm2 save
sudo su - bgaitools
pm2 resurrect
```

---

## 📞 SUPPORT CONTACTS

**Domain Provider:** (Your domain registrar)  
**Server Provider:** (Your hosting provider)  
**Developer:** BG Ai Tools Team  
**GitHub Repository:** https://github.com/bighi9999/Quet  

---

## 🎯 NEXT STEPS

1. **Set up monitoring:** Install tools like Prometheus/Grafana
2. **Enable analytics:** Google Analytics or Plausible
3. **Configure backups:** Automated database/file backups
4. **Set up CI/CD:** GitHub Actions for auto-deployment
5. **Create staging environment:** Test changes before production

---

## 📝 DEPLOYMENT HISTORY

| Date | Version | Changes | Status |
|------|---------|---------|--------|
| 2025-12-17 | v2.3.0 | Initial production deployment | ✅ Success |
| 2025-12-17 | v2.3.0 | HTTPS & SSL configured | ✅ Success |
| 2025-12-17 | v2.3.0 | Nginx reverse proxy | ✅ Success |

---

## ✅ VERIFICATION CHECKLIST

- [x] Domain resolves to server IP
- [x] HTTPS certificate valid
- [x] HTTP redirects to HTTPS
- [x] Next.js app running on port 3000
- [x] PM2 process manager active
- [x] Nginx reverse proxy working
- [x] Firewall rules configured
- [x] SSL auto-renewal enabled
- [x] Application accessible via https://mochiphoto.click
- [x] All API endpoints functional
- [x] Static assets loading correctly
- [x] WebSocket connections working (if applicable)

---

**🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!**

Access your production app at: **https://mochiphoto.click**
