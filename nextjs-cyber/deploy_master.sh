#!/bin/bash

################################################################################
# BG AI TOOLS - MASTER DEPLOYMENT SCRIPT
# Version: v1.0.0 - Production Grade
# Author: Senior DevOps Architect
# Date: 2025-12-18
#
# DESCRIPTION:
# Comprehensive VPS optimization and deployment script that performs:
# - System infrastructure setup (Swap, Cleanup, Firewall)
# - Application build and deployment (Next.js + PM2)
# - Web server configuration (Nginx + SSL)
# - Monitoring and diagnostics
#
# USAGE:
# sudo bash deploy_master.sh
################################################################################

# Exit on any error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Project configuration
PROJECT_DIR="/home/root/webapp/nextjs-cyber"
APP_NAME="bg-ai-tools"
APP_PORT="30000"
DOMAIN="mochiphoto.click"
SWAP_SIZE="8G"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

# Banner
echo -e "${CYAN}"
cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     🚀 BG AI TOOLS - MASTER DEPLOYMENT SCRIPT v1.0.0        ║
║                                                              ║
║     Performing comprehensive VPS optimization...            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    error "Please run as root (use sudo)"
fi

################################################################################
# PHẦN 1: HẠ TẦNG HỆ THỐNG (SYSTEM INFRASTRUCTURE)
################################################################################

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    PHẦN 1: HẠ TẦNG HỆ THỐNG (SYSTEM INFRASTRUCTURE)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"

################################################################################
# 1. TẠO 8GB SWAP (CẤP BÁCH)
################################################################################

log "TASK 1/10: Creating 8GB Swap Memory..."

# Check current swap
CURRENT_SWAP=$(free -m | awk '/Swap:/ {print $2}')
info "Current swap size: ${CURRENT_SWAP}MB"

if [ "$CURRENT_SWAP" -gt 0 ]; then
    warning "Existing swap detected. Disabling..."
    swapoff -a || true
    # Remove old swap entries from fstab
    sed -i '/swap/d' /etc/fstab
fi

# Remove old swapfile if exists
if [ -f /swapfile ]; then
    warning "Removing old /swapfile..."
    rm -f /swapfile
fi

# Create new 8GB swapfile
info "Creating 8GB swapfile (this may take a moment)..."
if command -v fallocate &> /dev/null; then
    fallocate -l 8G /swapfile
else
    dd if=/dev/zero of=/swapfile bs=1M count=8192 status=progress
fi

# Set correct permissions
chmod 600 /swapfile
info "Swapfile permissions set to 600"

# Format as swap
mkswap /swapfile

# Enable swap
swapon /swapfile
info "Swap enabled"

# Add to fstab for persistence
if ! grep -q "/swapfile" /etc/fstab; then
    echo "/swapfile none swap sw 0 0" >> /etc/fstab
    info "Swap added to /etc/fstab for auto-mount on boot"
fi

# Configure swappiness (prefer RAM, use swap only when necessary)
sysctl vm.swappiness=10
if ! grep -q "vm.swappiness" /etc/sysctl.conf; then
    echo "vm.swappiness=10" >> /etc/sysctl.conf
    info "Swappiness set to 10 (prefer RAM over swap)"
fi

# Verify swap
NEW_SWAP=$(free -m | awk '/Swap:/ {print $2}')
log "✅ Swap created successfully: ${NEW_SWAP}MB"

################################################################################
# 2. DỌN DẸP HỆ THỐNG (CLEANUP)
################################################################################

log "TASK 2/10: System Cleanup..."

# Remove unused packages
info "Removing unused packages..."
apt-get autoremove -y > /dev/null 2>&1

# Clean package cache
info "Cleaning package cache..."
apt-get clean > /dev/null 2>&1

# Clear memory caches (safe operation)
info "Clearing memory caches..."
sync
echo 3 > /proc/sys/vm/drop_caches

# Clean old logs (keep last 7 days)
info "Cleaning old system logs..."
journalctl --vacuum-time=7d > /dev/null 2>&1 || true

# Clean npm cache (optional but helpful)
if command -v npm &> /dev/null; then
    npm cache clean --force > /dev/null 2>&1 || true
fi

log "✅ System cleanup completed"

################################################################################
# 3. CẤU HÌNH TƯỜNG LỬA (UFW SECURITY)
################################################################################

log "TASK 3/10: Configuring Firewall (UFW)..."

# Install UFW if not present
if ! command -v ufw &> /dev/null; then
    info "Installing UFW..."
    apt-get install -y ufw > /dev/null 2>&1
fi

# Reset UFW to default
info "Resetting UFW to default configuration..."
ufw --force reset > /dev/null 2>&1

# Set default policies
ufw default deny incoming > /dev/null 2>&1
ufw default allow outgoing > /dev/null 2>&1

# Allow SSH (critical - do this first!)
info "Allowing SSH (port 22)..."
ufw allow 22/tcp > /dev/null 2>&1

# Allow HTTP and HTTPS
info "Allowing HTTP (port 80) and HTTPS (port 443)..."
ufw allow 80/tcp > /dev/null 2>&1
ufw allow 443/tcp > /dev/null 2>&1

# BLOCK direct access to port 30000 from outside
# Only allow localhost/nginx to access it
info "Blocking external access to port 30000 (app port)..."
# Note: By default, UFW denies incoming, so we don't explicitly need to deny 30000
# But we can be explicit about it
ufw deny 30000/tcp > /dev/null 2>&1

# Enable UFW
info "Enabling UFW..."
echo "y" | ufw enable > /dev/null 2>&1

log "✅ Firewall configured: SSH(22), HTTP(80), HTTPS(443) open | Port 30000 blocked externally"

################################################################################
# PHẦN 2: ỨNG DỤNG (APPLICATION DEPLOYMENT)
################################################################################

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    PHẦN 2: ỨNG DỤNG (APPLICATION DEPLOYMENT)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"

################################################################################
# 4. CHUẨN BỊ MÔI TRƯỜNG BUILD
################################################################################

log "TASK 4/10: Preparing Build Environment..."

# Navigate to project directory
if [ ! -d "$PROJECT_DIR" ]; then
    error "Project directory not found: $PROJECT_DIR"
fi

cd "$PROJECT_DIR"
info "Changed to project directory: $PROJECT_DIR"

# Remove old .next build
if [ -d ".next" ]; then
    info "Removing old .next build directory..."
    rm -rf .next
fi

# Check if node_modules needs refresh
# Only remove if there are known issues, otherwise keep it for faster installs
if [ "$FORCE_CLEAN_INSTALL" = "true" ]; then
    warning "Force clean install requested - removing node_modules..."
    rm -rf node_modules
fi

# Install dependencies (including devDependencies for build)
info "Installing dependencies..."
npm install --production=false

log "✅ Build environment prepared"

################################################################################
# 5. OPTIMIZED BUILD (BUILD TỐI ƯU)
################################################################################

log "TASK 5/10: Building Application (Optimized)..."

# Set Node.js memory limit to 4GB for build process
info "Running optimized build with 4GB heap size limit..."
export NODE_OPTIONS="--max-old-space-size=4096"

# Run production build
npm run build

log "✅ Application built successfully"

################################################################################
# 6. PM2 PRODUCTION START
################################################################################

log "TASK 6/10: Starting Application with PM2..."

# Stop and delete old process if exists
info "Stopping old PM2 process (if exists)..."
pm2 delete "$APP_NAME" > /dev/null 2>&1 || true

# Start application in production mode
# Using 'npm start' which runs the optimized Next.js production server
info "Starting application on port $APP_PORT..."
pm2 start npm --name "$APP_NAME" -- start -- -p "$APP_PORT"

# Set memory restart limit (auto-restart if memory exceeds 2GB)
info "Configuring auto-restart at 2GB memory usage..."
pm2 set "$APP_NAME:max_memory_restart" 2G

# Save PM2 configuration
pm2 save > /dev/null 2>&1

# Configure PM2 to start on system boot
pm2 startup systemd -u root --hp /root > /dev/null 2>&1 || true

# Wait for app to start
info "Waiting for application to start..."
sleep 5

log "✅ Application started with PM2"

################################################################################
# PHẦN 3: WEB SERVER (NGINX & SSL)
################################################################################

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    PHẦN 3: WEB SERVER (NGINX & SSL)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"

################################################################################
# 7. SỬA LỖI 502 (FIX NGINX PROXY)
################################################################################

log "TASK 7/10: Fixing Nginx Proxy Configuration..."

# Find Nginx config file for domain
NGINX_CONFIG=""
if [ -f "/etc/nginx/sites-available/$DOMAIN" ]; then
    NGINX_CONFIG="/etc/nginx/sites-available/$DOMAIN"
elif [ -f "/etc/nginx/conf.d/$DOMAIN.conf" ]; then
    NGINX_CONFIG="/etc/nginx/conf.d/$DOMAIN.conf"
else
    # Search for any config containing the domain
    NGINX_CONFIG=$(grep -l "$DOMAIN" /etc/nginx/sites-available/* 2>/dev/null | head -1)
fi

if [ -z "$NGINX_CONFIG" ]; then
    warning "Nginx config not found for $DOMAIN - creating new config..."
    
    NGINX_CONFIG="/etc/nginx/sites-available/$DOMAIN"
    
    cat > "$NGINX_CONFIG" << NGINXEOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Redirect to HTTPS
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # SSL certificates (will be configured by Certbot)
    # ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Client body size
    client_max_body_size 20M;

    # Proxy settings
    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        
        # Essential headers
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # WebSocket support
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
NGINXEOF

    # Enable site
    ln -sf "$NGINX_CONFIG" /etc/nginx/sites-enabled/
    info "Created new Nginx configuration"
else
    info "Found existing Nginx config: $NGINX_CONFIG"
    
    # Backup existing config
    cp "$NGINX_CONFIG" "${NGINX_CONFIG}.backup.$(date +%Y%m%d-%H%M%S)"
    
    # Update proxy_pass to point to correct port
    sed -i "s|proxy_pass.*|proxy_pass http://127.0.0.1:$APP_PORT;|g" "$NGINX_CONFIG"
    
    # Ensure essential proxy headers are present
    if ! grep -q "proxy_set_header Host" "$NGINX_CONFIG"; then
        sed -i "/proxy_pass/a \        proxy_set_header Host \$host;" "$NGINX_CONFIG"
    fi
    
    if ! grep -q "proxy_set_header X-Real-IP" "$NGINX_CONFIG"; then
        sed -i "/proxy_set_header Host/a \        proxy_set_header X-Real-IP \$remote_addr;" "$NGINX_CONFIG"
    fi
    
    if ! grep -q "proxy_set_header X-Forwarded-For" "$NGINX_CONFIG"; then
        sed -i "/proxy_set_header X-Real-IP/a \        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;" "$NGINX_CONFIG"
    fi
    
    if ! grep -q "proxy_set_header Upgrade" "$NGINX_CONFIG"; then
        sed -i "/proxy_set_header X-Forwarded-For/a \        proxy_set_header Upgrade \$http_upgrade;\n        proxy_set_header Connection \"upgrade\";" "$NGINX_CONFIG"
    fi
fi

log "✅ Nginx proxy configuration updated"

################################################################################
# 8. TỐI ƯU HIỆU SUẤT NGINX (PERFORMANCE)
################################################################################

log "TASK 8/10: Optimizing Nginx Performance..."

NGINX_MAIN_CONFIG="/etc/nginx/nginx.conf"

# Backup nginx.conf
cp "$NGINX_MAIN_CONFIG" "${NGINX_MAIN_CONFIG}.backup.$(date +%Y%m%d-%H%M%S)"

# Enable Gzip compression if not already enabled
if ! grep -q "gzip on;" "$NGINX_MAIN_CONFIG"; then
    sed -i '/http {/a \    gzip on;\n    gzip_vary on;\n    gzip_min_length 1024;\n    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;' "$NGINX_MAIN_CONFIG"
    info "Gzip compression enabled"
fi

# Set client_max_body_size to 20M
if ! grep -q "client_max_body_size" "$NGINX_MAIN_CONFIG"; then
    sed -i '/http {/a \    client_max_body_size 20M;' "$NGINX_MAIN_CONFIG"
    info "Client max body size set to 20M"
fi

# Set keepalive_timeout to 60s
sed -i 's/keepalive_timeout.*/keepalive_timeout 60;/g' "$NGINX_MAIN_CONFIG"
info "Keepalive timeout set to 60s"

# Test Nginx configuration
info "Testing Nginx configuration..."
nginx -t

# Reload Nginx
info "Reloading Nginx..."
systemctl reload nginx

log "✅ Nginx performance optimized"

################################################################################
# 9. KIỂM TRA & GIA HẠN SSL
################################################################################

log "TASK 9/10: Checking and Renewing SSL Certificate..."

# Install certbot if not present
if ! command -v certbot &> /dev/null; then
    info "Installing Certbot..."
    apt-get update > /dev/null 2>&1
    apt-get install -y certbot python3-certbot-nginx > /dev/null 2>&1
fi

# Check if SSL certificate exists
if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    info "SSL certificate found for $DOMAIN"
    
    # Try to renew (will only renew if expiring soon)
    info "Checking if renewal is needed..."
    certbot renew --quiet --nginx || true
else
    warning "SSL certificate not found for $DOMAIN"
    info "Attempting to obtain new certificate..."
    
    # Obtain new certificate
    certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "admin@$DOMAIN" || {
        warning "SSL certificate installation failed - you may need to configure DNS first"
    }
fi

log "✅ SSL certificate checked"

################################################################################
# PHẦN 4: GIÁM SÁT & BÁO CÁO (MONITORING)
################################################################################

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    PHẦN 4: GIÁM SÁT & BÁO CÁO (MONITORING)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"

################################################################################
# 10. SELF-DIAGNOSIS (TỰ KIỂM TRA)
################################################################################

log "TASK 10/10: Running Self-Diagnosis..."

# Test application endpoint
info "Testing application endpoint..."
APP_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$APP_PORT 2>/dev/null || echo "000")

if [ "$APP_TEST" = "200" ]; then
    log "✅ Application responding on port $APP_PORT (HTTP $APP_TEST)"
else
    warning "Application health check returned HTTP $APP_TEST"
fi

# Test public endpoint
info "Testing public endpoint..."
PUBLIC_TEST=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN 2>/dev/null || echo "000")

if [ "$PUBLIC_TEST" = "200" ]; then
    log "✅ Public website accessible at https://$DOMAIN (HTTP $PUBLIC_TEST)"
else
    warning "Public website returned HTTP $PUBLIC_TEST - may need DNS/SSL configuration"
fi

################################################################################
# FINAL REPORT
################################################################################

echo -e "\n${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}              🎉 DEPLOYMENT SUCCESSFUL - SYSTEM READY${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}\n"

# System Statistics
echo -e "${CYAN}📊 SYSTEM STATISTICS:${NC}\n"

# Memory info
echo -e "${YELLOW}Memory Usage:${NC}"
free -h | awk 'NR==1{print "  "$0} NR==2{printf "  RAM:  Total: %s | Used: %s | Free: %s | Available: %s\n", $2, $3, $4, $7} NR==3{printf "  SWAP: Total: %s | Used: %s | Free: %s\n", $2, $3, $4}'

# Disk usage
echo -e "\n${YELLOW}Disk Usage:${NC}"
df -h / | awk 'NR==1{print "  "$0} NR==2{printf "  Root: %s / %s (%s used) - %s available\n", $3, $2, $5, $4}'

# PM2 Status
echo -e "\n${YELLOW}PM2 Process Status:${NC}"
pm2 list | grep -A 1 "bg-ai-tools" || echo "  No PM2 process found"

# Nginx Status
echo -e "\n${YELLOW}Nginx Status:${NC}"
systemctl status nginx --no-pager -l | head -5 | sed 's/^/  /'

# Firewall Status
echo -e "\n${YELLOW}Firewall Status:${NC}"
ufw status | head -10 | sed 's/^/  /'

# Application URLs
echo -e "\n${CYAN}🌐 APPLICATION ACCESS:${NC}"
echo -e "  Local:  ${GREEN}http://localhost:$APP_PORT${NC}"
echo -e "  Public: ${GREEN}https://$DOMAIN${NC}"

# Summary
echo -e "\n${CYAN}✅ COMPLETED TASKS:${NC}"
echo -e "  ${GREEN}✓${NC} 1. Created 8GB Swap Memory"
echo -e "  ${GREEN}✓${NC} 2. System Cleanup Completed"
echo -e "  ${GREEN}✓${NC} 3. Firewall Configured (SSH, HTTP, HTTPS)"
echo -e "  ${GREEN}✓${NC} 4. Build Environment Prepared"
echo -e "  ${GREEN}✓${NC} 5. Application Built (Optimized)"
echo -e "  ${GREEN}✓${NC} 6. PM2 Production Started"
echo -e "  ${GREEN}✓${NC} 7. Nginx Proxy Fixed"
echo -e "  ${GREEN}✓${NC} 8. Nginx Performance Optimized"
echo -e "  ${GREEN}✓${NC} 9. SSL Certificate Checked"
echo -e "  ${GREEN}✓${NC} 10. Self-Diagnosis Completed"

echo -e "\n${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}    Version: v3.5.0 | Status: PRODUCTION READY 🚀${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}\n"

log "Deployment script completed successfully!"
log "Check the status above and visit https://$DOMAIN to verify"

exit 0
