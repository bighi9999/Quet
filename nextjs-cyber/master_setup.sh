#!/bin/bash

##############################################################################
# MASTER_SETUP.SH - Elite DevOps Commander Script
# Version: 1.0.0
# Date: 2025-12-18
# Purpose: Deep Clean & Rebuild + Sentinel Pro v3.0 Installation
##############################################################################

# Exit immediately if a command exits with a non-zero status
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/home/root/webapp/nextjs-cyber"
APP_NAME="bg-ai-tools"
APP_PORT="30000"
TELEGRAM_TOKEN="7702131089:AAG7b4bWupoPV2w9U341Ip7HVUmW1fbMGQY"
CHAT_ID="7760255026"

# Logging function
log_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_section() {
    echo ""
    echo "========================================================================"
    echo -e "${BLUE}$1${NC}"
    echo "========================================================================"
}

# Send Telegram notification
send_telegram() {
    local message="$1"
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
        -d chat_id="${CHAT_ID}" \
        -d text="${message}" \
        -d parse_mode="HTML" > /dev/null 2>&1 || true
}

# Header
clear
echo "╔════════════════════════════════════════════════════════════════════════╗"
echo -e "║                                                                        ║"
echo -e "║        ${MAGENTA}🎯 ELITE DEVOPS COMMANDER - MASTER SETUP${NC}                   ║"
echo -e "║                                                                        ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${CYAN}Version:${NC} 1.0.0"
echo -e "${CYAN}Date:${NC} $(date '+%Y-%m-%d %H:%M:%S')"
echo -e "${CYAN}Project:${NC} BG AI Tools"
echo ""
echo -e "${YELLOW}This script will:${NC}"
echo "  1. Deep Clean & Rebuild (Fix package-lock.json corruption)"
echo "  2. Install Sentinel Pro v3.0 (Telegram-integrated monitoring)"
echo ""

# Navigate to project directory
log_info "Navigating to project directory: $PROJECT_DIR"
cd "$PROJECT_DIR" || { log_error "Failed to navigate to $PROJECT_DIR"; exit 1; }
log_success "Current directory: $(pwd)"
echo ""

##############################################################################
# PHẦN 1: DEEP CLEAN & REBUILD (KHẮC PHỤC SỰ CỐ)
##############################################################################

log_section "PHẦN 1: DEEP CLEAN & REBUILD"

# Step 1: Stop PM2
log_info "Step 1/5: Stopping PM2 process '$APP_NAME'..."
if pm2 list | grep -q "$APP_NAME"; then
    pm2 delete "$APP_NAME" || true
    log_success "PM2 process stopped and deleted"
else
    log_info "PM2 process not found, skipping..."
fi
sleep 2
echo ""

# Step 2: Deep Clean (Delete package-lock.json, node_modules, .next)
log_info "Step 2/5: Deep Clean - Removing corrupted files..."
log_warning "This will delete: package-lock.json, node_modules, .next"

if [ -f "package-lock.json" ]; then
    rm -rf package-lock.json
    log_success "Removed package-lock.json (fixing 'Cannot read properties of undefined' error)"
else
    log_info "package-lock.json not found"
fi

if [ -d "node_modules" ]; then
    rm -rf node_modules
    log_success "Removed node_modules directory"
else
    log_info "node_modules not found"
fi

if [ -d ".next" ]; then
    rm -rf .next
    log_success "Removed .next directory"
else
    log_info ".next directory not found"
fi

# Clean npm cache
log_info "Cleaning npm cache..."
npm cache clean --force
log_success "npm cache cleaned"
echo ""

# Step 3: Reinstall Dependencies
log_info "Step 3/5: Reinstalling dependencies (this may take several minutes)..."
log_warning "Creating new package-lock.json..."

if npm install; then
    log_success "Dependencies installed successfully"
    
    # Verify critical packages
    if [ -d "node_modules/next" ]; then
        NEXT_VERSION=$(node -p "require('./node_modules/next/package.json').version")
        log_success "Next.js version: $NEXT_VERSION"
    fi
    
    if [ -f "package-lock.json" ]; then
        log_success "New package-lock.json created successfully"
    fi
else
    log_error "npm install failed!"
    send_telegram "🚨 <b>MASTER SETUP FAILED</b>%0Anpm install failed. Check server logs."
    exit 1
fi
echo ""

# Step 4: Build with 8GB Swap Support
log_info "Step 4/5: Building production version with optimized settings..."
log_warning "Using NODE_OPTIONS='--max-old-space-size=4096'"
log_warning "This is the critical step - will exit if build fails"
echo ""

# Create build log
BUILD_LOG="build_master_$(date +%Y%m%d_%H%M%S).log"
log_info "Build log: $BUILD_LOG"
echo ""

# Run build
if NODE_OPTIONS="--max-old-space-size=4096" npm run build 2>&1 | tee "$BUILD_LOG"; then
    echo ""
    log_success "Production build completed successfully!"
    
    # Verify .next directory
    if [ -d ".next" ]; then
        log_success ".next directory created"
        
        if [ -f ".next/BUILD_ID" ]; then
            BUILD_ID=$(cat .next/BUILD_ID)
            log_success "Build ID: $BUILD_ID"
        fi
        
        if [ -d ".next/static" ]; then
            STATIC_SIZE=$(du -sh .next/static | cut -f1)
            log_success "Static files size: $STATIC_SIZE"
        fi
    else
        log_error ".next directory was not created!"
        log_error "Build failed - check log: $BUILD_LOG"
        send_telegram "🚨 <b>MASTER SETUP FAILED</b>%0ABuild failed. .next directory not created."
        exit 1
    fi
else
    echo ""
    log_error "Build process failed!"
    log_error "Error details logged to: $BUILD_LOG"
    echo ""
    log_warning "Last 30 lines of build log:"
    tail -30 "$BUILD_LOG"
    send_telegram "🚨 <b>MASTER SETUP FAILED</b>%0ABuild process failed. Check server logs."
    exit 1
fi
echo ""

# Step 5: Start PM2
log_info "Step 5/5: Starting PM2 in production mode..."
log_info "Command: pm2 start npm --name '$APP_NAME' -- start -- --port $APP_PORT"
echo ""

pm2 start npm --name "$APP_NAME" -- start -- --port "$APP_PORT"
log_success "PM2 process started"

# Wait for app to initialize
log_info "Waiting 15 seconds for application to initialize..."
sleep 15

# Check PM2 status
log_info "Checking PM2 process status..."
pm2 list | grep "$APP_NAME"

# Save PM2 configuration
log_info "Saving PM2 configuration..."
pm2 save
log_success "PM2 configuration saved"
echo ""

# Test service
log_info "Testing service availability..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$APP_PORT || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    log_success "Service is responding! HTTP Status: $HTTP_CODE"
else
    log_warning "Service returned HTTP $HTTP_CODE (may need more time to start)"
fi
echo ""

log_success "✅ PHẦN 1 HOÀN THÀNH - Deep Clean & Rebuild Successful"
send_telegram "✅ <b>PHẦN 1 HOÀN THÀNH</b>%0ADeep Clean & Rebuild thành công%0AHTTP Status: $HTTP_CODE"
echo ""

##############################################################################
# PHẦN 2: CÀI ĐẶT SENTINEL PRO v3.0
##############################################################################

log_section "PHẦN 2: CÀI ĐẶT SENTINEL PRO v3.0"

# Create Sentinel Pro script
log_info "Creating Sentinel Pro v3.0 monitoring script..."

cat > /root/sentinel_pro.sh << 'SENTINEL_EOF'
#!/bin/bash
##############################################################################
# SENTINEL PRO v3.0 - TELEGRAM INTEGRATED MONITORING SYSTEM
# Auto-healing system for BG AI Tools
##############################################################################

TELEGRAM_TOKEN="7702131089:AAG7b4bWupoPV2w9U341Ip7HVUmW1fbMGQY"
CHAT_ID="7760255026"
APP_PORT=30000
APP_NAME="bg-ai-tools"
PROJECT_DIR="/home/root/webapp/nextjs-cyber"
LOCK_FILE="/tmp/sentinel.lock"
LOG_FILE="/var/log/sentinel.log"

# Send Telegram alert
send_alert() {
    local message="$1"
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
        -d chat_id="${CHAT_ID}" \
        -d text="${message}" \
        -d parse_mode="HTML" > /dev/null 2>&1
}

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Cleanup on exit
cleanup() {
    rm -f "$LOCK_FILE"
}
trap cleanup EXIT

# Startup
log "🚀 Sentinel Pro v3.0 Started"
send_alert "🚀 <b>Sentinel Pro v3.0 Đã Kích Hoạt</b>%0AĐang giám sát hệ thống 24/7...%0APort: ${APP_PORT}%0AApp: ${APP_NAME}"

# Main monitoring loop
while true; do
    # Skip if another recovery is in progress
    if [ -f "$LOCK_FILE" ]; then
        sleep 30
        continue
    fi

    # Check HTTP status
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:${APP_PORT} 2>/dev/null || echo "000")
    
    # If service is healthy, continue monitoring
    if [ "$HTTP_STATUS" = "200" ]; then
        sleep 30
        continue
    fi

    # Service is down - start recovery
    touch "$LOCK_FILE"
    log "⚠️ ERROR DETECTED - HTTP Status: $HTTP_STATUS. Starting recovery..."
    send_alert "⚠️ <b>CẢNH BÁO:</b> Web lỗi (HTTP: ${HTTP_STATUS})%0AĐang tự động sửa chữa..."

    # LEVEL 1: Kill zombie processes and restart PM2
    log "Level 1: Killing zombie processes and restarting PM2..."
    fuser -k -n tcp ${APP_PORT} > /dev/null 2>&1 || true
    pm2 restart ${APP_NAME} > /dev/null 2>&1
    sleep 15
    
    # Check if Level 1 recovery worked
    if curl -s --head http://127.0.0.1:${APP_PORT} | grep -q "200 OK"; then
        log "✅ Recovery successful (Level 1: PM2 Restart)"
        send_alert "✅ <b>ĐÃ KHÔI PHỤC (Level 1)</b>%0ARestart PM2 thành công.%0AThời gian: $(date '+%H:%M:%S')"
        rm -f "$LOCK_FILE"
        sleep 60
        continue
    fi

    # LEVEL 2: Deep rebuild (remove .next and rebuild)
    log "Level 2: Deep rebuild - removing .next and rebuilding..."
    send_alert "⚠️ <b>Restart thất bại.</b>%0AĐang Build lại code (3-5 phút)..."
    
    cd "$PROJECT_DIR"
    
    # Remove only .next directory (keep node_modules and package-lock.json)
    rm -rf .next >> "$LOG_FILE" 2>&1
    
    # Rebuild application
    if NODE_OPTIONS="--max-old-space-size=4096" npm run build >> "$LOG_FILE" 2>&1; then
        log "Build successful, restarting PM2..."
        pm2 delete ${APP_NAME} > /dev/null 2>&1 || true
        pm2 start npm --name "${APP_NAME}" -- start -- --port ${APP_PORT} >> "$LOG_FILE" 2>&1
        pm2 save > /dev/null 2>&1
    else
        log "Build failed!"
        send_alert "🚨 <b>BUILD FAILED</b>%0AKhông thể build lại code.%0ACheck server ngay!"
        rm -f "$LOCK_FILE"
        sleep 300  # Wait 5 minutes before next attempt
        continue
    fi
    
    # Wait for app to start
    sleep 30
    
    # Check if Level 2 recovery worked
    if curl -s --head http://127.0.0.1:${APP_PORT} | grep -q "200 OK"; then
        log "✅ Recovery successful (Level 2: Deep Rebuild)"
        send_alert "✅ <b>ĐÃ KHÔI PHỤC (Level 2)</b>%0ABuild lại code thành công.%0AThời gian: $(date '+%H:%M:%S')"
    else
        # LEVEL 3: Restart Nginx as last resort
        log "Level 3: Restarting Nginx..."
        systemctl restart nginx 2>&1 | tee -a "$LOG_FILE"
        sleep 10
        
        # Final check
        if curl -s --head http://127.0.0.1:${APP_PORT} | grep -q "200 OK"; then
            log "✅ Recovery successful (Level 3: Nginx Restart)"
            send_alert "✅ <b>ĐÃ KHÔI PHỤC (Level 3)</b>%0ARestart Nginx thành công."
        else
            log "🚨 CRITICAL ERROR - All recovery attempts failed"
            send_alert "🚨 <b>LỖI NGHIÊM TRỌNG</b>%0ATất cả nỗ lực tự động sửa đều thất bại.%0A<b>CHECK VPS NGAY!</b>"
        fi
    fi
    
    rm -f "$LOCK_FILE"
    sleep 60  # Wait 1 minute before next check
done
SENTINEL_EOF

log_success "Sentinel Pro script created at /root/sentinel_pro.sh"
echo ""

# Make script executable
log_info "Making Sentinel Pro executable..."
chmod +x /root/sentinel_pro.sh
log_success "Permissions set (chmod +x)"
echo ""

# Create systemd service
log_info "Creating systemd service..."

cat > /etc/systemd/system/sentinel.service << 'SERVICE_EOF'
[Unit]
Description=Sentinel Pro v3.0 - Auto-healing Monitoring System
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root
ExecStart=/bin/bash /root/sentinel_pro.sh
Restart=always
RestartSec=10
StandardOutput=append:/var/log/sentinel.log
StandardError=append:/var/log/sentinel_error.log

# Restart policy
StartLimitInterval=0
StartLimitBurst=5

[Install]
WantedBy=multi-user.target
SERVICE_EOF

log_success "Systemd service created at /etc/systemd/system/sentinel.service"
echo ""

# Reload systemd daemon
log_info "Reloading systemd daemon..."
systemctl daemon-reload
log_success "Systemd daemon reloaded"
echo ""

# Enable and start service
log_info "Enabling and starting Sentinel Pro service..."
systemctl enable sentinel.service
systemctl start sentinel.service
log_success "Sentinel Pro service enabled and started"
echo ""

# Check service status
log_info "Checking Sentinel Pro service status..."
sleep 2
if systemctl is-active --quiet sentinel.service; then
    log_success "Sentinel Pro is running!"
    systemctl status sentinel.service --no-pager | head -15
else
    log_warning "Sentinel Pro may need a moment to start. Checking status..."
    systemctl status sentinel.service --no-pager | head -15
fi
echo ""

log_success "✅ PHẦN 2 HOÀN THÀNH - Sentinel Pro v3.0 Installed & Running"
send_telegram "✅ <b>PHẦN 2 HOÀN THÀNH</b>%0ASentinel Pro v3.0 đã được cài đặt và kích hoạt%0AService: systemctl status sentinel"
echo ""

##############################################################################
# FINAL SYSTEM STATISTICS & VERIFICATION
##############################################################################

log_section "FINAL SYSTEM STATISTICS & VERIFICATION"

# Memory Status
log_info "Memory Status:"
free -h | grep -E "^Mem:|^Swap:"
echo ""

# Disk Space
log_info "Disk Space:"
df -h "$PROJECT_DIR" | grep -v Filesystem
echo ""

# PM2 Status
log_info "PM2 Process Status:"
pm2 list
echo ""

# Sentinel Service Status
log_info "Sentinel Pro Service Status:"
systemctl is-active sentinel.service && echo "✅ Active" || echo "❌ Inactive"
echo ""

# Test endpoints
log_info "Testing Application Endpoints..."
APP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$APP_PORT || echo "000")
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$APP_PORT/api/system-health || echo "000")

echo "  • Main App (http://localhost:$APP_PORT): HTTP $APP_STATUS"
echo "  • System Health API: HTTP $API_STATUS"
echo ""

# URLs
log_info "Application URLs:"
echo "  • Local:    http://localhost:$APP_PORT"
echo "  • Public:   https://mochiphoto.click"
echo "  • Repo:     https://github.com/bighi9999/Quet"
echo ""

##############################################################################
# COMPLETION MESSAGE
##############################################################################

log_section "DEPLOYMENT COMPLETE"

if [ "$APP_STATUS" = "200" ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                                    ║${NC}"
    echo -e "${GREEN}║  ✅ MASTER SETUP COMPLETE - SYSTEM READY FOR PRODUCTION            ║${NC}"
    echo -e "${GREEN}║                                                                    ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════════╝${NC}"
    
    send_telegram "🎊 <b>MASTER SETUP HOÀN THÀNH</b>%0A%0A✅ Deep Clean & Rebuild: SUCCESS%0A✅ Sentinel Pro v3.0: ACTIVE%0A✅ Application: ONLINE (HTTP 200)%0A%0A<b>Hệ thống đã sẵn sàng production!</b>"
else
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║                                                                    ║${NC}"
    echo -e "${YELLOW}║  ⚠️  SETUP COMPLETE - APPLICATION STATUS: HTTP $APP_STATUS            ║${NC}"
    echo -e "${YELLOW}║                                                                    ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════════════════╝${NC}"
    
    send_telegram "⚠️ <b>MASTER SETUP HOÀN THÀNH</b>%0A%0A✅ Deep Clean & Rebuild: SUCCESS%0A✅ Sentinel Pro v3.0: ACTIVE%0A⚠️ Application: HTTP $APP_STATUS%0A%0ASentinel Pro sẽ tự động khôi phục..."
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Phase 1:${NC} Deep Clean & Rebuild - COMPLETE"
echo -e "${GREEN}✅ Phase 2:${NC} Sentinel Pro v3.0 Installation - COMPLETE"
echo ""
echo -e "${CYAN}📊 System Status:${NC}"
echo "   • Application: HTTP $APP_STATUS"
echo "   • PM2 Process: $(pm2 list | grep -q "$APP_NAME" && echo "✅ Running" || echo "❌ Stopped")"
echo "   • Sentinel Pro: $(systemctl is-active --quiet sentinel.service && echo "✅ Active" || echo "❌ Inactive")"
echo ""
echo -e "${CYAN}📝 Useful Commands:${NC}"
echo "   • Check logs:        pm2 logs $APP_NAME"
echo "   • Sentinel logs:     tail -f /var/log/sentinel.log"
echo "   • Sentinel status:   systemctl status sentinel"
echo "   • Restart Sentinel:  systemctl restart sentinel"
echo "   • Stop Sentinel:     systemctl stop sentinel"
echo ""
echo -e "${CYAN}🔔 Telegram Integration:${NC}"
echo "   • Bot Token: Configured"
echo "   • Chat ID: Configured"
echo "   • Notifications: Active"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}Script completed at: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
echo ""

# Create completion report
REPORT_FILE="master_setup_report_$(date +%Y%m%d_%H%M%S).txt"
cat > "$REPORT_FILE" << EOF
MASTER SETUP COMPLETION REPORT
================================

Date: $(date '+%Y-%m-%d %H:%M:%S')
Project: BG AI Tools
Location: $PROJECT_DIR

PHASE 1: Deep Clean & Rebuild
--------------------------------
✅ PM2 Process Stopped
✅ Corrupted Files Removed (package-lock.json, node_modules, .next)
✅ Dependencies Reinstalled
✅ Production Build Complete
✅ PM2 Process Restarted

PHASE 2: Sentinel Pro v3.0
--------------------------------
✅ Monitoring Script Created: /root/sentinel_pro.sh
✅ Systemd Service Created: /etc/systemd/system/sentinel.service
✅ Service Enabled and Started
✅ Telegram Integration Configured

SYSTEM STATUS
--------------------------------
Application: HTTP $APP_STATUS
PM2 Process: $(pm2 list | grep -q "$APP_NAME" && echo "Running" || echo "Stopped")
Sentinel Pro: $(systemctl is-active sentinel.service || echo "Unknown")

MONITORING FEATURES
--------------------------------
• Auto-healing on HTTP errors
• 3-level recovery system:
  Level 1: PM2 restart
  Level 2: Deep rebuild (.next removal)
  Level 3: Nginx restart
• Telegram alerts
• 24/7 monitoring (30-second intervals)

USEFUL COMMANDS
--------------------------------
pm2 logs $APP_NAME
tail -f /var/log/sentinel.log
systemctl status sentinel
systemctl restart sentinel

================================
Report saved to: $REPORT_FILE
EOF

log_success "Completion report saved to: $REPORT_FILE"
echo ""
