#!/bin/bash

# ╔══════════════════════════════════════════════════════════════╗
# ║  LINUX SYSTEM OPTIMIZER - VPS Performance Tuning Script     ║
# ║  Target: 4 Core CPU, 4GB RAM VPS running Next.js            ║
# ║  Author: AI System Architect                                ║
# ║  Version: 1.0.0                                              ║
# ╚══════════════════════════════════════════════════════════════╝

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
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

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    log_error "This script must be run as root (use sudo)"
    exit 1
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║       🚀 LINUX SYSTEM OPTIMIZER - STARTING...               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Display current system status
log_info "Current System Status:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
free -h
echo ""
df -h / | grep -E '^Filesystem|^/'
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ============================================================
# STEP 1: CREATE SWAP MEMORY (VIRTUAL RAM)
# ============================================================
log_info "STEP 1/3: Creating 4GB SWAP Memory..."

# Check if swap already exists
if [ -f /swapfile ]; then
    log_warning "Swap file already exists. Checking status..."
    EXISTING_SWAP=$(swapon --show | grep -c "/swapfile" || echo "0")
    
    if [ "$EXISTING_SWAP" -gt 0 ]; then
        log_info "Swap is already active. Disabling old swap..."
        swapoff /swapfile 2>/dev/null || true
    fi
    
    log_info "Removing old swap file..."
    rm -f /swapfile
fi

# Create 4GB swap file
log_info "Allocating 4GB swap file..."
fallocate -l 4G /swapfile

# Set correct permissions
log_info "Setting permissions (600)..."
chmod 600 /swapfile

# Make swap
log_info "Formatting as swap..."
mkswap /swapfile

# Enable swap
log_info "Activating swap..."
swapon /swapfile

# Verify swap is active
SWAP_ACTIVE=$(swapon --show | grep -c "/swapfile" || echo "0")
if [ "$SWAP_ACTIVE" -eq 0 ]; then
    log_error "Failed to activate swap!"
    exit 1
fi

# Make swap permanent (add to /etc/fstab if not exists)
if ! grep -q "/swapfile" /etc/fstab; then
    log_info "Adding swap to /etc/fstab for auto-mount on boot..."
    echo "/swapfile none swap sw 0 0" >> /etc/fstab
else
    log_info "Swap entry already exists in /etc/fstab"
fi

# Configure swappiness (20 = prefer RAM, only use swap when necessary)
log_info "Configuring vm.swappiness=20 (prefer RAM over swap)..."
sysctl vm.swappiness=20

# Make swappiness permanent
if ! grep -q "vm.swappiness" /etc/sysctl.conf; then
    echo "vm.swappiness=20" >> /etc/sysctl.conf
else
    sed -i 's/^vm.swappiness=.*/vm.swappiness=20/' /etc/sysctl.conf
fi

log_success "✓ Swap memory created and activated (4GB)"
echo ""

# ============================================================
# STEP 2: CONFIGURE PM2 MEMORY LIMITS
# ============================================================
log_info "STEP 2/3: Configuring PM2 memory limits..."

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    log_warning "PM2 not found. Skipping PM2 configuration."
else
    # Get current directory with Next.js app
    NEXTJS_DIR="/home/root/webapp/nextjs-cyber"
    
    if [ -d "$NEXTJS_DIR" ]; then
        cd "$NEXTJS_DIR"
        
        # Check if PM2 process exists
        PM2_PROCESS=$(pm2 list | grep -c "bg-ai-tools" || echo "0")
        
        if [ "$PM2_PROCESS" -gt 0 ]; then
            log_info "Setting max memory restart: 2500MB..."
            pm2 reload bg-ai-tools --max-memory-restart 2500M --update-env
            
            log_info "Saving PM2 configuration..."
            pm2 save --force
            
            log_success "✓ PM2 configured: Auto-restart when memory > 2.5GB"
        else
            log_warning "PM2 process 'bg-ai-tools' not found. Skipping memory limit."
        fi
    else
        log_warning "Next.js directory not found: $NEXTJS_DIR"
    fi
fi
echo ""

# ============================================================
# STEP 3: CLEAN UP DISK & CACHE
# ============================================================
log_info "STEP 3/3: Cleaning up disk and cache..."

# Clean APT cache
log_info "Cleaning APT package cache..."
apt-get clean
log_success "✓ APT cache cleaned"

# Clean old logs (keep only 50MB)
log_info "Cleaning system logs (vacuum to 50MB)..."
journalctl --vacuum-size=50M
log_success "✓ System logs cleaned"

# Clean npm cache (optional)
if command -v npm &> /dev/null; then
    log_info "Cleaning npm cache..."
    npm cache clean --force 2>/dev/null || true
    log_success "✓ npm cache cleaned"
fi

# Clean PM2 logs (keep only last 10KB)
if command -v pm2 &> /dev/null; then
    log_info "Flushing PM2 logs..."
    pm2 flush 2>/dev/null || true
    log_success "✓ PM2 logs flushed"
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║       ✅ OPTIMIZATION COMPLETE!                             ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Display final system status
log_info "Final System Status:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
free -h
echo ""
echo "Swap Status:"
swapon --show
echo ""
echo "Disk Usage:"
df -h / | grep -E '^Filesystem|^/'
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

log_success "System optimization completed successfully!"
log_info "Summary of changes:"
echo "  • 4GB Swap memory created (/swapfile)"
echo "  • vm.swappiness set to 20 (prefer RAM)"
echo "  • PM2 max memory limit: 2500MB (auto-restart)"
echo "  • System cache and logs cleaned"
echo ""
log_warning "NOTE: If you need to revert swap, run: sudo swapoff /swapfile && sudo rm /swapfile"
echo ""
