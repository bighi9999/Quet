#!/bin/bash

# =============================================================================
# VPS CLEANUP SCRIPT - BG AI TOOLS
# Version: 1.0.0
# Purpose: Clean up Ubuntu VPS running Next.js + PM2
# =============================================================================

set -e  # Exit on error

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}================================================${NC}"
echo -e "${CYAN}  VPS CLEANUP SCRIPT - DEVOPS EXPERT${NC}"
echo -e "${CYAN}================================================${NC}"
echo ""

# =============================================================================
# TASK 1: PROCESS MANAGEMENT & SOURCE CODE CLEANUP
# =============================================================================

echo -e "${GREEN}[TASK 1] Process Management & Source Code Cleanup${NC}"
echo ""

# Step 1: Check RAM
echo -e "${YELLOW}Step 1: Checking RAM...${NC}"
free -h
echo ""

TOTAL_RAM=$(free -m | awk 'NR==2{print $2}')
if [ "$TOTAL_RAM" -lt 2000 ]; then
    echo -e "${RED}⚠️  WARNING: RAM < 2GB detected ($TOTAL_RAM MB)${NC}"
    echo -e "${YELLOW}Recommend creating swap before build. Run this separately:${NC}"
    echo -e "sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile"
    echo ""
else
    echo -e "${GREEN}✓ RAM is sufficient ($TOTAL_RAM MB)${NC}"
    echo ""
fi

# Step 2: Stop PM2
echo -e "${YELLOW}Step 2: Stopping PM2 processes...${NC}"
cd /home/root/webapp/nextjs-cyber
pm2 stop all
echo -e "${GREEN}✓ PM2 stopped${NC}"
echo ""

# Step 3: Remove old builds
echo -e "${YELLOW}Step 3: Removing old builds (.next, node_modules)...${NC}"
rm -rf .next node_modules
du -sh . 2>/dev/null || echo "Cleanup complete"
echo -e "${GREEN}✓ Old builds removed${NC}"
echo ""

# Step 4: Clean npm cache
echo -e "${YELLOW}Step 4: Cleaning npm cache...${NC}"
npm cache clean --force
echo -e "${GREEN}✓ npm cache cleaned${NC}"
echo ""

# Step 5: Reinstall & rebuild
echo -e "${YELLOW}Step 5: Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

echo -e "${YELLOW}Step 6: Building Next.js...${NC}"
npm run build
echo -e "${GREEN}✓ Build complete${NC}"
echo ""

# Step 7: Restart PM2
echo -e "${YELLOW}Step 7: Restarting PM2...${NC}"
pm2 restart all
pm2 save
echo -e "${GREEN}✓ PM2 restarted and saved${NC}"
echo ""

# =============================================================================
# TASK 2: LOGS & SYSTEM CACHE CLEANUP
# =============================================================================

echo -e "${GREEN}[TASK 2] Logs & System Cache Cleanup${NC}"
echo ""

# PM2 logs
echo -e "${YELLOW}Flushing PM2 logs...${NC}"
pm2 flush
echo -e "${GREEN}✓ PM2 logs flushed${NC}"
echo ""

# System logs
echo -e "${YELLOW}Cleaning system logs (keep 1 day)...${NC}"
sudo journalctl --vacuum-time=1d
echo -e "${GREEN}✓ System logs cleaned${NC}"
echo ""

# APT cache
echo -e "${YELLOW}Cleaning APT cache...${NC}"
sudo apt-get clean
sudo apt-get autoremove -y
sudo apt-get autoclean
echo -e "${GREEN}✓ APT cache cleaned${NC}"
echo ""

# =============================================================================
# TASK 3: FIND "JUNK" FILES & BACKUPS
# =============================================================================

echo -e "${GREEN}[TASK 3] Finding Junk Files & Backups${NC}"
echo ""

cd /home/root/webapp

# Find compressed files
echo -e "${YELLOW}Finding compressed files (.zip, .tar.gz)...${NC}"
find . -type f \( -name "*.zip" -o -name "*.tar.gz" -o -name "*.tar" -o -name "*.rar" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -exec du -h {} + | sort -hr | head -10
echo ""

# Find backup directories
echo -e "${YELLOW}Finding backup directories...${NC}"
find . -type d \( -iname "*bak*" -o -iname "*old*" -o -iname "*backup*" -o -iname "*v1*" -o -iname "*temp*" -o -iname "*tmp*" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -exec du -sh {} + | sort -hr | head -10
echo ""

# Find log files
echo -e "${YELLOW}Finding log files (.log)...${NC}"
find . -type f -name "*.log" \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -exec du -h {} + | sort -hr | head -10
echo ""

echo -e "${RED}⚠️  REVIEW THE ABOVE FILES BEFORE DELETING!${NC}"
echo ""

# =============================================================================
# TASK 4: CHECK RESULTS
# =============================================================================

echo -e "${GREEN}[TASK 4] Checking Results${NC}"
echo ""

# Disk usage
echo -e "${YELLOW}Disk usage:${NC}"
df -h /
echo ""

# Top 10 largest
echo -e "${YELLOW}Top 10 largest directories:${NC}"
cd /home/root/webapp
du -ah --max-depth=1 | sort -hr | head -n 10
echo ""

# PM2 status
echo -e "${YELLOW}PM2 status:${NC}"
pm2 list
echo ""

# Website status
echo -e "${YELLOW}Website status:${NC}"
curl -I https://mochiphoto.click 2>&1 | grep "HTTP"
echo ""

echo -e "${CYAN}================================================${NC}"
echo -e "${GREEN}✓ CLEANUP COMPLETE!${NC}"
echo -e "${CYAN}================================================${NC}"
echo ""
echo -e "Next steps:"
echo -e "1. Review junk files listed above"
echo -e "2. Manually delete if needed: ${YELLOW}rm -rf path/to/file${NC}"
echo -e "3. Check website: ${CYAN}https://mochiphoto.click${NC}"
echo ""
