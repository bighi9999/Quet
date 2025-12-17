# 🔧 VPS CLEANUP GUIDE - DEVOPS EXPERT

## 📋 OVERVIEW

**Purpose:** Deep clean Ubuntu VPS running Next.js + PM2  
**Target:** Free up maximum disk space & optimize performance  
**Stack:** Next.js 14, PM2, Nginx, Ubuntu  
**Script:** `/home/root/webapp/cleanup_vps.sh`  

---

## 🚀 QUICK START

### **One-Command Full Cleanup:**
```bash
cd /home/root/webapp && ./cleanup_vps.sh
```

**⚠️ WARNING:** This will:
- Stop PM2 processes
- Delete `.next` and `node_modules`
- Clean all caches
- Rebuild from scratch
- Takes ~5-10 minutes

---

## 📦 TASK 1: PROCESS & SOURCE CODE CLEANUP

### **Step-by-Step Manual Commands:**

#### **1A. Check RAM Before Build**
```bash
# Check available RAM
free -h && echo "---" && df -h /
```

#### **1B. Create Swap if RAM < 2GB (One-time only)**
```bash
# Create 2GB swap file
sudo fallocate -l 2G /swapfile && \
sudo chmod 600 /swapfile && \
sudo mkswap /swapfile && \
sudo swapon /swapfile && \
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab && \
free -h
```

**Check if swap exists:**
```bash
swapon --show
```

#### **1C. Clean & Rebuild Next.js**
```bash
# Full rebuild chain (copy-paste safe)
cd /home/root/webapp/nextjs-cyber && \
pm2 stop all && \
rm -rf .next node_modules && \
npm cache clean --force && \
npm install && \
npm run build && \
pm2 restart all && \
pm2 save
```

**Expected:** 5-10 minutes  
**Frees:** ~500MB-1GB  

---

## 📦 TASK 2: LOGS & SYSTEM CACHE CLEANUP

### **2A. PM2 Logs (Usually 100MB-500MB)**
```bash
# Flush all PM2 logs
pm2 flush
```

### **2B. System Logs (Can be 1GB+)**
```bash
# Keep only 1 day of system logs
sudo journalctl --vacuum-time=1d
```

### **2C. APT Package Cache**
```bash
# Clean apt cache & remove unused packages
sudo apt-get clean && \
sudo apt-get autoremove -y && \
sudo apt-get autoclean
```

**Expected savings:** 500MB-2GB total

---

## 📦 TASK 3: FIND JUNK FILES & BACKUPS

### **3A. Find Compressed Files**
```bash
# Find .zip, .tar.gz, .rar files (excludes node_modules, .git)
cd /home/root/webapp && \
find . -type f \( -name "*.zip" -o -name "*.tar.gz" -o -name "*.tar" -o -name "*.rar" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -exec du -h {} + | sort -hr
```

### **3B. Find Backup Directories**
```bash
# Find folders with: bak, old, backup, v1, temp, tmp
cd /home/root/webapp && \
find . -type d \( -iname "*bak*" -o -iname "*old*" -o -iname "*backup*" -o -iname "*v1*" -o -iname "*temp*" -o -iname "*tmp*" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -exec du -sh {} + | sort -hr
```

### **3C. Find Log Files**
```bash
# Find all .log files
cd /home/root/webapp && \
find . -type f -name "*.log" \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -exec du -h {} + | sort -hr | head -20
```

**⚠️ IMPORTANT:** Review before deleting!

### **Manual Delete (if needed):**
```bash
# Delete specific file/folder
rm -rf /path/to/unwanted/file_or_folder
```

---

## 📦 TASK 4: CHECK RESULTS

### **4A. Disk Space**
```bash
# Show disk usage
df -h /
```

### **4B. Top 10 Largest Directories**
```bash
# Find biggest space consumers
cd /home/root/webapp && \
du -ah --max-depth=1 | sort -hr | head -n 10
```

### **4C. PM2 & Website Status**
```bash
# Check PM2
pm2 list

# Check Next.js logs
pm2 logs bg-ai-tools --lines 20 --nostream

# Test website
curl -I https://mochiphoto.click
```

---

## 🚨 TROUBLESHOOTING

### **Problem 1: Build Fails (Out of Memory)**

**Symptoms:**
```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Solution:**
```bash
# Create swap immediately
sudo fallocate -l 2G /swapfile && \
sudo chmod 600 /swapfile && \
sudo mkswap /swapfile && \
sudo swapon /swapfile

# Then retry build
cd /home/root/webapp/nextjs-cyber && npm run build
```

---

### **Problem 2: Website Shows "502 Bad Gateway"**

**Cause:** Nginx can't connect to Next.js

**Check:**
```bash
# Is Next.js running?
pm2 list

# Is it on port 3000?
curl -s http://localhost:3000 | grep title
```

**Fix:**
```bash
# Restart PM2
pm2 restart all

# Reload Nginx
sudo systemctl reload nginx

# Wait 5 seconds then test
sleep 5 && curl -I https://mochiphoto.click
```

---

### **Problem 3: PM2 Process Keeps Restarting**

**Check logs:**
```bash
pm2 logs bg-ai-tools --err --lines 50
```

**Common causes:**
- Missing `node_modules` → Run `npm install`
- Port conflict → Check `lsof -i:3000`
- Syntax error → Check `npm run build`

**Reset PM2:**
```bash
cd /home/root/webapp/nextjs-cyber && \
pm2 delete all && \
pm2 start npm --name "bg-ai-tools" -- run dev && \
pm2 save
```

---

### **Problem 4: Disk Still Full After Cleanup**

**Find large files system-wide:**
```bash
# Find files > 100MB
sudo find / -type f -size +100M -exec du -h {} + 2>/dev/null | sort -hr | head -20
```

**Common culprits:**
- `/var/log/` - Old system logs
- `/tmp/` - Temporary files
- `/root/.npm/` - npm cache
- `/root/.pm2/logs/` - PM2 logs

**Clean them:**
```bash
# Clean /tmp
sudo rm -rf /tmp/*

# Clean npm cache globally
npm cache clean --force

# Clean PM2 logs
pm2 flush
```

---

## 📊 EXPECTED RESULTS

### **Before Cleanup:**
```
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        50G   45G    5G  90% /
```

### **After Cleanup:**
```
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        50G   38G   12G  76% /
```

**Typical Savings:**
- `.next` + `node_modules`: 500MB-1GB
- PM2 logs: 100MB-500MB
- System logs: 500MB-1GB
- APT cache: 200MB-500MB
- **Total: 1.5GB-3GB+**

---

## 🔄 MAINTENANCE SCHEDULE

### **Weekly:**
```bash
# Flush PM2 logs
pm2 flush

# Clean system logs
sudo journalctl --vacuum-time=7d
```

### **Monthly:**
```bash
# Full cleanup script
cd /home/root/webapp && ./cleanup_vps.sh

# Or manually:
cd /home/root/webapp/nextjs-cyber && \
pm2 stop all && \
rm -rf .next node_modules && \
npm cache clean --force && \
npm install && \
npm run build && \
pm2 restart all
```

### **As Needed:**
```bash
# When disk > 80% full
df -h /
cd /home/root/webapp && ./cleanup_vps.sh
```

---

## 🎯 BEST PRACTICES

### **1. Monitor Disk Usage**
```bash
# Add to crontab for daily email alerts
0 0 * * * df -h / | grep -E "9[0-9]%|100%" && mail -s "Disk Alert" your@email.com
```

### **2. Auto-cleanup PM2 Logs**
```bash
# Add to crontab (daily at 2 AM)
0 2 * * * /usr/bin/pm2 flush
```

### **3. Keep Swap Active**
```bash
# Check swap is permanent
grep swap /etc/fstab

# If empty, add swap permanently
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### **4. Production Build**
For better performance, use production build:
```bash
cd /home/root/webapp/nextjs-cyber && \
npm run build && \
pm2 delete bg-ai-tools && \
pm2 start npm --name "bg-ai-tools" -- start && \
pm2 save
```

---

## 📝 CLEANUP CHECKLIST

- [ ] Check RAM (`free -h`)
- [ ] Create swap if needed (`swapon --show`)
- [ ] Stop PM2 (`pm2 stop all`)
- [ ] Remove `.next` and `node_modules`
- [ ] Clean npm cache
- [ ] Rebuild Next.js
- [ ] Restart PM2
- [ ] Flush PM2 logs
- [ ] Clean system logs (journalctl)
- [ ] Clean APT cache
- [ ] Find and review junk files
- [ ] Check disk space (`df -h /`)
- [ ] Test website (https://mochiphoto.click)
- [ ] Verify PM2 status (`pm2 list`)

---

## 🚀 AUTOMATION SCRIPT

**Location:** `/home/root/webapp/cleanup_vps.sh`

**Usage:**
```bash
# Make executable (one-time)
chmod +x /home/root/webapp/cleanup_vps.sh

# Run full cleanup
cd /home/root/webapp && ./cleanup_vps.sh
```

**Script does:**
1. ✅ Checks RAM & warns if < 2GB
2. ✅ Stops PM2
3. ✅ Removes old builds
4. ✅ Cleans all caches
5. ✅ Rebuilds from scratch
6. ✅ Restarts PM2
7. ✅ Finds junk files (doesn't delete)
8. ✅ Shows disk usage report

---

## ✅ VERIFICATION

### **Final Checks:**
```bash
# 1. Disk space OK?
df -h / | grep -v "Use%"

# 2. PM2 running?
pm2 list | grep online

# 3. Website working?
curl -I https://mochiphoto.click | grep "200 OK"

# 4. Next.js healthy?
pm2 logs bg-ai-tools --lines 5 --nostream | grep "Ready"
```

**All ✅? You're good to go!**

---

## 📞 SUPPORT

**Script location:** `/home/root/webapp/cleanup_vps.sh`  
**Logs:** `pm2 logs bg-ai-tools`  
**Website:** https://mochiphoto.click  
**PM2 docs:** https://pm2.keymetrics.io/docs/usage/quick-start/  

---

**Created by:** DevOps Cleanup Expert  
**Date:** 2025-12-17  
**Version:** 1.0.0  
