#!/bin/bash

##############################################################################
# FIX_BUILD.SH - Complete Next.js Production Build Recovery Script
# Version: 1.0.0
# Date: 2025-12-18
# Description: Emergency CLEAN & REBUILD process for production deployment
##############################################################################

# Exit immediately if a command exits with a non-zero status
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/home/root/webapp/nextjs-cyber"
APP_NAME="bg-ai-tools"
APP_PORT="30000"

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

# Header
echo "========================================================================"
echo -e "${BLUE}    BG AI TOOLS - PRODUCTION BUILD RECOVERY SCRIPT${NC}"
echo -e "${CYAN}    Version: 1.0.0 | Date: 2025-12-18${NC}"
echo "========================================================================"
echo ""

# Navigate to project directory
log_info "Navigating to project directory: $PROJECT_DIR"
cd "$PROJECT_DIR" || { log_error "Failed to navigate to $PROJECT_DIR"; exit 1; }
log_success "Current directory: $(pwd)"
echo ""

##############################################################################
# STEP 1: STOP PM2 PROCESS (TO FREE UP RAM)
##############################################################################
echo "========================================================================"
echo -e "${BLUE}STEP 1/6: STOPPING PM2 PROCESS${NC}"
echo "========================================================================"

log_info "Checking if PM2 process '$APP_NAME' exists..."
if pm2 list | grep -q "$APP_NAME"; then
    log_warning "Process '$APP_NAME' found. Stopping..."
    pm2 stop "$APP_NAME" || true
    log_info "Deleting process to ensure clean state..."
    pm2 delete "$APP_NAME" || true
    log_success "PM2 process '$APP_NAME' stopped and deleted"
else
    log_info "Process '$APP_NAME' not found. Skipping..."
fi

# Wait for resources to be released
log_info "Waiting 3 seconds for system resources to be released..."
sleep 3
echo ""

##############################################################################
# STEP 2: CLEAN UP (DELETE .next AND CACHE)
##############################################################################
echo "========================================================================"
echo -e "${BLUE}STEP 2/6: CLEANING UP BUILD ARTIFACTS${NC}"
echo "========================================================================"

log_info "Removing .next directory..."
if [ -d ".next" ]; then
    rm -rf .next
    log_success ".next directory removed"
else
    log_info ".next directory not found. Skipping..."
fi

log_info "Clearing Next.js cache..."
rm -rf .next/cache 2>/dev/null || true
log_success "Next.js cache cleared"

log_info "Clearing npm cache..."
npm cache clean --force
log_success "npm cache cleared"

# Check available disk space
DISK_USAGE=$(df -h "$PROJECT_DIR" | awk 'NR==2 {print $5}' | sed 's/%//')
log_info "Current disk usage: ${DISK_USAGE}%"
if [ "$DISK_USAGE" -gt 90 ]; then
    log_warning "Disk usage is high (${DISK_USAGE}%). Consider cleaning up old files."
fi

echo ""

##############################################################################
# STEP 3: RE-INSTALL DEPENDENCIES
##############################################################################
echo "========================================================================"
echo -e "${BLUE}STEP 3/6: RE-INSTALLING DEPENDENCIES${NC}"
echo "========================================================================"

log_info "Checking node_modules integrity..."
if [ ! -d "node_modules" ]; then
    log_warning "node_modules not found. Will install from scratch."
fi

log_info "Running: npm install"
log_warning "This may take several minutes. Please wait..."
npm install

log_success "Dependencies installed successfully"

# Verify critical packages
log_info "Verifying critical packages..."
if [ -d "node_modules/next" ]; then
    NEXT_VERSION=$(node -p "require('./node_modules/next/package.json').version")
    log_success "Next.js version: $NEXT_VERSION"
else
    log_error "Next.js package not found!"
    exit 1
fi

echo ""

##############################################################################
# STEP 4: BUILD WITH OPTIMIZED SETTINGS (WAIT FOR COMPLETION)
##############################################################################
echo "========================================================================"
echo -e "${BLUE}STEP 4/6: BUILDING PRODUCTION VERSION (OPTIMIZED)${NC}"
echo "========================================================================"

log_info "Starting production build with 4GB memory allocation..."
log_info "Command: NODE_OPTIONS=\"--max-old-space-size=4096\" npm run build"
log_warning "This is the most critical step. Please wait..."
echo ""

# Create build log file
BUILD_LOG="build_$(date +%Y%m%d_%H%M%S).log"

# Run build with memory optimization and log output
if NODE_OPTIONS="--max-old-space-size=4096" npm run build 2>&1 | tee "$BUILD_LOG"; then
    log_success "Production build completed successfully!"
    
    # Verify .next directory was created
    if [ -d ".next" ]; then
        log_success ".next directory created successfully"
        
        # Check build manifest
        if [ -f ".next/BUILD_ID" ]; then
            BUILD_ID=$(cat .next/BUILD_ID)
            log_success "Build ID: $BUILD_ID"
        fi
        
        # Check static files
        if [ -d ".next/static" ]; then
            STATIC_SIZE=$(du -sh .next/static | cut -f1)
            log_success "Static files size: $STATIC_SIZE"
        fi
    else
        log_error ".next directory was not created!"
        log_error "Build failed. Check log: $BUILD_LOG"
        exit 1
    fi
else
    log_error "Build process failed!"
    log_error "Error details logged to: $BUILD_LOG"
    
    # Show last 20 lines of error log
    echo ""
    log_warning "Last 20 lines of build log:"
    tail -20 "$BUILD_LOG"
    
    exit 1
fi

echo ""

##############################################################################
# STEP 5: RESTART PM2 (ONLY IF BUILD SUCCESSFUL)
##############################################################################
echo "========================================================================"
echo -e "${BLUE}STEP 5/6: RESTARTING PM2 IN PRODUCTION MODE${NC}"
echo "========================================================================"

log_info "Starting PM2 process in production mode..."
log_info "Command: pm2 start npm --name \"$APP_NAME\" -- start -- --port $APP_PORT"

# Start the application in production mode
pm2 start npm --name "$APP_NAME" -- start -- --port "$APP_PORT"

log_success "PM2 process '$APP_NAME' started"

# Wait for app to initialize
log_info "Waiting 10 seconds for application to initialize..."
sleep 10

# Check PM2 status
log_info "Checking PM2 process status..."
pm2 list | grep "$APP_NAME"

# Save PM2 configuration
log_info "Saving PM2 configuration..."
pm2 save
log_success "PM2 configuration saved"

echo ""

##############################################################################
# STEP 6: SELF-CHECK SERVICE (CURL TEST)
##############################################################################
echo "========================================================================"
echo -e "${BLUE}STEP 6/6: TESTING SERVICE AVAILABILITY${NC}"
echo "========================================================================"

log_info "Testing localhost:$APP_PORT..."
sleep 3

# Test HTTP endpoint
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$APP_PORT || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    log_success "Service is responding! HTTP Status: $HTTP_CODE"
    
    # Get response preview
    log_info "Response preview:"
    curl -s http://localhost:$APP_PORT | head -10 | grep -o "<title>.*</title>" || echo "HTML content received"
else
    log_warning "Service returned HTTP $HTTP_CODE"
    log_info "Checking PM2 logs for errors..."
    pm2 logs "$APP_NAME" --nostream --lines 20
fi

echo ""

##############################################################################
# FINAL SYSTEM STATISTICS
##############################################################################
echo "========================================================================"
echo -e "${BLUE}FINAL SYSTEM STATISTICS${NC}"
echo "========================================================================"

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

# Application URLs
log_info "Application URLs:"
echo "  - Local:  http://localhost:$APP_PORT"
echo "  - Public: https://mochiphoto.click"

echo ""

##############################################################################
# COMPLETION MESSAGE
##############################################################################
echo "========================================================================"
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ DEPLOYMENT SUCCESSFUL - SYSTEM READY${NC}"
else
    echo -e "${YELLOW}⚠ BUILD COMPLETED - SERVICE STATUS: HTTP $HTTP_CODE${NC}"
    echo -e "${YELLOW}  Check PM2 logs: pm2 logs $APP_NAME${NC}"
fi
echo "========================================================================"
echo ""
echo -e "${CYAN}Build log saved to: $BUILD_LOG${NC}"
echo -e "${CYAN}Project directory: $PROJECT_DIR${NC}"
echo ""
echo -e "${GREEN}Script completed at: $(date)${NC}"
echo ""
