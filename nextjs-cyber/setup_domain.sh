#!/bin/bash
###############################################################################
# BG AI TOOLS - PRODUCTION SETUP SCRIPT
# Domain: mochiphoto.click
# HTTPS with Let's Encrypt SSL
###############################################################################

set -e  # Exit on error

DOMAIN="mochiphoto.click"
APP_DIR="/home/root/webapp/nextjs-cyber"
APP_PORT="3000"
PM2_APP_NAME="bg-ai-tools"

echo "============================================================"
echo "🚀 BG AI TOOLS - PRODUCTION SETUP"
echo "============================================================"
echo "📍 Domain: $DOMAIN"
echo "📁 App Directory: $APP_DIR"
echo "🔌 Port: $APP_PORT"
echo "============================================================"
echo ""

# Step 1: Install Required Tools
echo "📦 [1/7] Installing PM2, Nginx, Certbot..."
sudo apt-get update -qq
sudo apt-get install -y nginx certbot python3-certbot-nginx

# Install PM2 globally if not exists
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    echo "✅ PM2 installed"
else
    echo "✅ PM2 already installed"
fi

# Step 2: Stop Old Processes
echo ""
echo "🛑 [2/7] Stopping old processes..."
pm2 delete $PM2_APP_NAME 2>/dev/null || true
sudo lsof -ti:$APP_PORT | xargs kill -9 2>/dev/null || true
echo "✅ Old processes stopped"

# Step 3: Build Application
echo ""
echo "🔨 [3/7] Building Next.js application..."
cd $APP_DIR
npm run build
echo "✅ Build completed"

# Step 4: Start Application with PM2
echo ""
echo "🚀 [4/7] Starting application with PM2..."
cd $APP_DIR
pm2 start npm --name "$PM2_APP_NAME" --cwd "$APP_DIR" -- start
pm2 save
pm2 startup systemd -u root --hp /root | tail -1 | bash
echo "✅ Application started with PM2"

# Step 5: Configure Nginx
echo ""
echo "⚙️  [5/7] Configuring Nginx..."

# Create Nginx config
sudo tee /etc/nginx/sites-available/$DOMAIN > /dev/null <<'NGINX_CONFIG'
server {
    listen 80;
    listen [::]:80;
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

    # Next.js static files
    location /_next/static {
        proxy_cache STATIC;
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Next.js images
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }
}
NGINX_CONFIG

# Enable site
sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx config
echo ""
echo "🔍 Testing Nginx configuration..."
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
echo "✅ Nginx configured and reloaded"

# Step 6: Install SSL Certificate
echo ""
echo "🔒 [6/7] Installing SSL certificate..."
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect
echo "✅ SSL certificate installed"

# Step 7: Final Checks
echo ""
echo "🔍 [7/7] Running final checks..."

# Check PM2 status
echo ""
echo "📊 PM2 Status:"
pm2 status

# Check Nginx status
echo ""
echo "📊 Nginx Status:"
sudo systemctl status nginx --no-pager | head -10

# Check SSL expiry
echo ""
echo "🔒 SSL Certificate:"
sudo certbot certificates | grep -A 2 $DOMAIN || echo "Certificate info not available yet"

echo ""
echo "============================================================"
echo "✅ PRODUCTION SETUP COMPLETED!"
echo "============================================================"
echo ""
echo "🌐 Your application is now live at:"
echo "   https://$DOMAIN"
echo "   https://www.$DOMAIN"
echo ""
echo "📊 Useful commands:"
echo "   pm2 status              - Check app status"
echo "   pm2 logs $PM2_APP_NAME  - View app logs"
echo "   pm2 restart $PM2_APP_NAME - Restart app"
echo "   sudo nginx -t           - Test Nginx config"
echo "   sudo systemctl reload nginx - Reload Nginx"
echo "   sudo certbot renew --dry-run - Test SSL renewal"
echo ""
echo "🔄 SSL auto-renewal is enabled (runs twice daily)"
echo "============================================================"
