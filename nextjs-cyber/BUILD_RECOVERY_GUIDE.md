# 🔧 BUILD RECOVERY GUIDE

## Emergency Build Recovery Script

**File:** `fix_build.sh`  
**Version:** 1.0.0  
**Date:** December 18, 2025  
**Purpose:** Complete clean & rebuild process for production deployment

---

## 🚨 When to Use This Script

Use this script when you encounter:
- ❌ `Error: Could not find a production build in the '.next' directory`
- ❌ `MODULE_NOT_FOUND` errors related to `.next` directory
- ❌ Corrupted build artifacts
- ❌ Need to force a complete rebuild

---

## 📋 What This Script Does (6 Steps)

### **STEP 1: Stop PM2 Process**
- Stops and deletes the `bg-ai-tools` PM2 process
- Frees up RAM and system resources
- Ensures clean state before rebuild

### **STEP 2: Clean Up Build Artifacts**
- Removes `.next` directory completely
- Clears Next.js cache
- Clears npm cache with `npm cache clean --force`
- Checks disk space usage

### **STEP 3: Re-install Dependencies**
- Runs `npm install` to ensure all packages are up-to-date
- Verifies critical packages (Next.js, React, etc.)
- Checks package integrity

### **STEP 4: Optimized Production Build** ⚠️ **CRITICAL STEP**
- Builds with **4GB memory allocation**: `NODE_OPTIONS="--max-old-space-size=4096"`
- Runs `npm run build` in production mode
- Logs all output to timestamped log file
- Verifies `.next` directory creation
- Checks `BUILD_ID` and static files
- **Exits immediately if build fails** (thanks to `set -e`)

### **STEP 5: Restart PM2 (Production Mode)**
- **Only runs if Step 4 succeeds**
- Starts: `pm2 start npm --name "bg-ai-tools" -- start -- --port 30000`
- Waits 10 seconds for app initialization
- Saves PM2 configuration with `pm2 save`

### **STEP 6: Self-Check Service**
- Tests `http://localhost:30000` with curl
- Verifies HTTP 200 response
- Shows preview of HTML response
- Displays PM2 logs if service fails

---

## 🚀 How to Use

### **Option 1: Run Script Directly**
```bash
cd /home/root/webapp/nextjs-cyber
sudo bash fix_build.sh
```

### **Option 2: Run with Output Logging**
```bash
cd /home/root/webapp/nextjs-cyber
sudo bash fix_build.sh 2>&1 | tee recovery_$(date +%Y%m%d_%H%M%S).log
```

---

## ⚙️ Configuration

The script uses these default settings (modify at top of script if needed):

```bash
PROJECT_DIR="/home/root/webapp/nextjs-cyber"
APP_NAME="bg-ai-tools"
APP_PORT="30000"
```

---

## ✅ Success Indicators

You'll know the script succeeded when you see:

```
✓ DEPLOYMENT SUCCESSFUL - SYSTEM READY
Service is responding! HTTP Status: 200
```

**Final checks:**
- PM2 process status: `online`
- HTTP test: `200 OK`
- Build log: No critical errors

---

## ⚠️ Troubleshooting

### **Script Stops at Step 4 (Build Failed)**

**Symptoms:**
```
[ERROR] Build process failed!
[ERROR] Error details logged to: build_YYYYMMDD_HHMMSS.log
```

**Solution:**
1. Check the build log:
   ```bash
   cat build_*.log | tail -50
   ```

2. Common issues:
   - **Out of Memory**: Ensure 8GB swap is active (`free -h`)
   - **Syntax Error**: Fix TypeScript/JavaScript errors in code
   - **Missing Dependencies**: Re-run `npm install`

3. Fix and re-run:
   ```bash
   sudo bash fix_build.sh
   ```

---

### **Service Returns HTTP 000 or Non-200**

**Symptoms:**
```
[WARNING] Service returned HTTP 000
```

**Solution:**
1. Check PM2 logs:
   ```bash
   pm2 logs bg-ai-tools --lines 50
   ```

2. Common causes:
   - Port 30000 blocked by firewall
   - App crashed during startup
   - Missing environment variables

3. Manual restart:
   ```bash
   pm2 restart bg-ai-tools
   pm2 logs bg-ai-tools --lines 30
   ```

---

### **Build Takes Too Long (> 10 minutes)**

**Symptoms:**
- Build process stuck or very slow

**Solution:**
1. Check system resources:
   ```bash
   free -h           # Check RAM/Swap
   df -h             # Check disk space
   top               # Check CPU usage
   ```

2. If stuck, kill and retry:
   ```bash
   pkill -f "npm run build"
   sudo bash fix_build.sh
   ```

---

## 📊 System Requirements

### **Minimum:**
- **RAM:** 2GB physical + 8GB swap
- **Disk:** 5GB free space
- **Node.js:** v18+ or v20+
- **npm:** v9+ or v10+

### **Recommended:**
- **RAM:** 4GB physical + 8GB swap
- **Disk:** 10GB free space
- **Node.js:** v20.x LTS
- **CPU:** 2+ cores

---

## 🔐 Security Features

- ✅ Runs with `set -e` - stops on first error
- ✅ Validates all critical steps before proceeding
- ✅ Clears caches to prevent stale data issues
- ✅ Creates timestamped build logs for debugging
- ✅ Verifies `.next` directory integrity

---

## 📝 Build Logs

Each run creates a timestamped build log:

**Location:** `/home/root/webapp/nextjs-cyber/build_YYYYMMDD_HHMMSS.log`

**Example:**
```bash
build_20251218_133000.log
```

**View recent logs:**
```bash
cd /home/root/webapp/nextjs-cyber
ls -lht build_*.log | head -5
tail -50 build_*.log | less
```

---

## 🔄 Regular Maintenance Workflow

### **After Git Pull (New Code)**
```bash
cd /home/root/webapp/nextjs-cyber
git pull origin main
sudo bash fix_build.sh
```

### **Weekly Clean Build**
```bash
# Ensure everything is up-to-date
cd /home/root/webapp/nextjs-cyber
sudo bash fix_build.sh
```

### **Before Important Deployment**
```bash
# Full system check + rebuild
cd /home/root/webapp/nextjs-cyber
sudo bash deploy_master.sh  # Comprehensive 10-step script
```

---

## 🆚 Comparison: fix_build.sh vs deploy_master.sh

| Feature | fix_build.sh | deploy_master.sh |
|---------|-------------|------------------|
| **Purpose** | Emergency build recovery | Full production deployment |
| **Steps** | 6 steps | 10 steps |
| **System Setup** | ❌ No | ✅ Yes (Swap, Firewall, Nginx) |
| **Build Process** | ✅ Yes | ✅ Yes |
| **PM2 Management** | ✅ Yes | ✅ Yes |
| **Web Server Config** | ❌ No | ✅ Yes (Nginx + SSL) |
| **Use Case** | Quick rebuild needed | Complete server setup |
| **Execution Time** | ~5-15 minutes | ~20-40 minutes |

**Recommendation:**
- Use `fix_build.sh` for build errors or quick updates
- Use `deploy_master.sh` for initial setup or major infrastructure changes

---

## 📞 Support Commands

### **Check Current Status**
```bash
# PM2 status
pm2 list
pm2 logs bg-ai-tools --lines 30

# Test application
curl http://localhost:30000
curl http://localhost:30000/api/system-health

# Check build artifacts
ls -lah /home/root/webapp/nextjs-cyber/.next/
```

### **Manual Build (Debug Mode)**
```bash
cd /home/root/webapp/nextjs-cyber
NODE_OPTIONS="--max-old-space-size=4096" npm run build -- --debug
```

### **Clean Everything (Nuclear Option)**
```bash
cd /home/root/webapp/nextjs-cyber
pm2 delete bg-ai-tools || true
rm -rf .next node_modules package-lock.json
npm install
sudo bash fix_build.sh
```

---

## ✅ Post-Recovery Checklist

After running `fix_build.sh`, verify:

- [ ] PM2 process is `online` (`pm2 list`)
- [ ] HTTP response is `200` (`curl http://localhost:30000`)
- [ ] Public site works (`curl https://mochiphoto.click`)
- [ ] System health API responds (`curl http://localhost:30000/api/system-health`)
- [ ] Build log shows no critical errors
- [ ] `.next` directory exists and contains `BUILD_ID`

---

## 📌 Important Notes

1. **Always run as root/sudo** - Script needs permissions for PM2 and system operations
2. **Wait for build completion** - Step 4 can take 5-15 minutes depending on server specs
3. **Keep build logs** - Useful for debugging recurring issues
4. **Monitor first run** - Watch for any unexpected errors
5. **Backup before major changes** - Consider backing up `.env.local` and custom files

---

## 🎯 Quick Reference

**One-Line Recovery:**
```bash
cd /home/root/webapp/nextjs-cyber && sudo bash fix_build.sh
```

**Recovery + Log:**
```bash
cd /home/root/webapp/nextjs-cyber && sudo bash fix_build.sh 2>&1 | tee recovery.log
```

**Check Results:**
```bash
pm2 list && curl -I http://localhost:30000
```

---

**Created:** December 18, 2025  
**Version:** 1.0.0  
**Maintainer:** Senior DevOps Architect  
**Project:** BG AI Tools - https://mochiphoto.click
