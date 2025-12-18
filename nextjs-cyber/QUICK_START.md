# 🚀 QUICK START - Build Recovery

## 🆘 Emergency: Fix ".next directory not found" Error

```bash
cd /home/root/webapp/nextjs-cyber
sudo bash fix_build.sh
```

**That's it!** The script will:
1. Stop PM2
2. Clean `.next` and cache
3. Reinstall dependencies
4. Build with 4GB memory
5. Restart PM2
6. Test the service

**Time:** ~5-15 minutes

---

## 📋 After Git Pull (New Code)

```bash
cd /home/root/webapp/nextjs-cyber
git pull origin main
sudo bash fix_build.sh
```

---

## 🔍 Check Status

```bash
# PM2 status
pm2 list

# Test service
curl http://localhost:30000

# View logs
pm2 logs bg-ai-tools --lines 30
```

---

## 📚 Full Documentation

- **Usage Guide:** [BUILD_RECOVERY_GUIDE.md](./BUILD_RECOVERY_GUIDE.md)
- **Full Summary:** [BUILD_MASTER_RECOVERY_SUMMARY.md](./BUILD_MASTER_RECOVERY_SUMMARY.md)
- **Deployment Script:** [deploy_master.sh](./deploy_master.sh)

---

## 🆚 Which Script to Use?

| Situation | Script | Time |
|-----------|--------|------|
| Build error / Quick fix | `fix_build.sh` | ~5-15 min |
| Fresh server / Full setup | `deploy_master.sh` | ~20-40 min |

---

**Created:** December 18, 2025  
**Version:** v3.6.1
