# 🌐 Remote Access Guide

Complete guide to access your AI Product Image Analyzer from anywhere!

---

## 🔗 PUBLIC ACCESS URLS

Your webapp is now accessible from anywhere with these URLs:

### 🎯 Main Access Portal
```
http://14.225.210.195:3000/access
```
**Use this first!** - Shows all available URLs and server status

### 🚀 V2 Pro Edition (Recommended)
```
http://14.225.210.195:3000/v2
```
**Features:** Dark mode, Cost calculator, History, Advanced options, Custom prompts, Multi-image generation

### 📌 V1 Classic Edition
```
http://14.225.210.195:3000/v1
```
**Features:** Basic analysis and generation, Simple interface

### 🏠 Default Homepage
```
http://14.225.210.195:3000
```
**Redirects to:** V1 Classic

### ❤️ Health Check
```
http://14.225.210.195:3000/api/health
```
**Use to:** Check if server is running

### 🔄 Keepalive
```
http://14.225.210.195:3000/keepalive
```
**Shows:** Server uptime and memory usage

---

## 📱 HOW TO ACCESS

### From Computer:
1. Open any web browser (Chrome, Firefox, Safari, Edge)
2. Copy one of the URLs above
3. Paste into address bar
4. Press Enter
5. Enjoy!

### From Mobile Phone:
1. Open mobile browser
2. Type or paste URL
3. Bookmark for easy access
4. Works on iOS and Android

### From Tablet:
- Same as mobile
- Better experience with larger screen

### From Another Network:
- Works from any WiFi or mobile data
- No VPN needed
- Public internet access

---

## 🎯 QUICK START

### Option 1: Access Portal (Recommended)
```
1. Visit: http://14.225.210.195:3000/access
2. See all URLs and status
3. Click "Launch V2 Pro" or "Launch V1 Classic"
4. Start using!
```

### Option 2: Direct Access
```
1. Visit: http://14.225.210.195:3000/v2
2. Enter OpenAI API key
3. Upload image
4. Analyze and generate!
```

---

## 🔄 KEEPALIVE SYSTEM

Your webapp has an automatic keepalive system that:

✅ **Monitors** server every 30 seconds
✅ **Auto-restarts** if server crashes
✅ **Logs** all health checks
✅ **Maintains** 24/7 availability

### Check Keepalive Status:
```bash
# View logs
tail -f /home/root/webapp/keepalive.log

# Check if running
ps aux | grep keepalive

# View recent activity
tail -20 /home/root/webapp/keepalive.log
```

---

## 📊 SERVER STATUS

### Check Server Health:
```bash
# Method 1: Using curl
curl http://14.225.210.195:3000/api/health

# Method 2: Using browser
Visit: http://14.225.210.195:3000/api/health

# Method 3: Access portal
Visit: http://14.225.210.195:3000/access
```

### Response when healthy:
```json
{
  "status": "ok",
  "timestamp": "2025-12-17T00:00:00.000Z",
  "message": "AI Product Image Analyzer is running!"
}
```

---

## 🎨 FEATURES AVAILABLE

### V2 Pro Edition Features:
1. 🌓 **Dark Mode** - Toggle light/dark theme
2. 💰 **Cost Calculator** - Track API usage and costs
3. 📚 **History** - Save last 10 analyses
4. ⚙️ **Advanced Options** - 3 sizes + 2 qualities
5. ✏️ **Custom Prompts** - Write your own
6. 📥 **Download Buttons** - Save all images
7. 🎨 **Multi-Image Grid** - View all results
8. 💾 **LocalStorage** - Persist data

### V1 Classic Features:
1. 📤 **Image Upload** - Drag & drop
2. 🔍 **AI Analysis** - GPT-4 Vision
3. ✨ **Auto Prompts** - 3 suggestions
4. 🎨 **Image Generation** - DALL-E 3
5. 📊 **Side-by-side** - Compare results

---

## 💡 USAGE TIPS

### For Best Experience:
- ✅ Use **V2 Pro** for professional work
- ✅ Use **V1 Classic** for quick tests
- ✅ Bookmark your favorite version
- ✅ Share URL with team members
- ✅ Access from any device

### Performance Tips:
- 📶 Use stable internet connection
- 🚀 Chrome/Firefox for best performance
- 💾 Clear browser cache if slow
- 🔄 Refresh page if issues

---

## 🔐 SECURITY NOTES

### What's Safe:
✅ Public URL is temporary sandbox
✅ API keys not stored on server
✅ All requests over HTTP (sandbox limitation)
✅ No personal data collected
✅ LocalStorage encrypted by browser

### Best Practices:
- 🔑 Don't share your API key
- 🔒 Use strong API key
- 📊 Monitor OpenAI usage
- 🔄 Rotate keys regularly

---

## 🐛 TROUBLESHOOTING

### Server Not Responding?
**Problem:** URL not loading

**Solutions:**
```bash
# Check if server is running
curl http://14.225.210.195:3000/api/health

# Check keepalive log
tail /home/root/webapp/keepalive.log

# Manually restart if needed
killall node
cd /home/root/webapp && node index.js
```

### Keepalive Not Running?
**Problem:** Auto-restart not working

**Solutions:**
```bash
# Check if keepalive is running
ps aux | grep keepalive

# Start keepalive manually
cd /home/root/webapp
nohup ./keepalive.sh > keepalive_output.log 2>&1 &

# Verify it started
tail -f keepalive.log
```

### Slow Performance?
**Problem:** Pages loading slowly

**Solutions:**
- Check internet connection
- Clear browser cache
- Try different browser
- Restart browser
- Try incognito mode

### 404 Not Found?
**Problem:** Page not found

**Solutions:**
- Check URL is correct
- Make sure to include `/v2` or `/v1`
- Try access portal first: `/access`
- Server might be restarting (wait 30s)

---

## 📞 QUICK REFERENCE

### All Available URLs:
```
Access Portal:  /access
V2 Pro:        /v2
V1 Classic:    /v1
Homepage:      /
Health:        /api/health
Keepalive:     /keepalive
Analyze API:   /api/analyze
Generate API:  /api/generate
```

### Server Control:
```bash
# Check status
curl http://localhost:3000/api/health

# View logs
tail -f /home/root/webapp/server.log

# View keepalive logs
tail -f /home/root/webapp/keepalive.log

# Restart manually
killall node && cd /home/root/webapp && node index.js

# Check processes
ps aux | grep node
```

---

## 🎯 USE CASES

### Use Case 1: Share with Team
```
1. Copy V2 URL: http://14.225.210.195:3000/v2
2. Send to team members
3. Everyone can access simultaneously
4. Each person uses their own API key
```

### Use Case 2: Demo to Client
```
1. Use Access Portal: /access
2. Show professional interface
3. Demonstrate features live
4. Client can test themselves
```

### Use Case 3: Mobile Testing
```
1. Open URL on phone
2. Test responsive design
3. Try all features
4. Bookmark for later
```

### Use Case 4: Multi-device Workflow
```
1. Analyze on desktop: /v2
2. Check on mobile
3. Download on tablet
4. All using same URL
```

---

## ⚠️ IMPORTANT NOTES

### Sandbox Limitations:
- 🕐 **Temporary** - URL valid while sandbox is active
- 🔄 **Auto-restart** - Server restarts if crashes
- 💾 **No persistence** - Deploy for permanent storage
- 🌐 **HTTP only** - Not HTTPS in sandbox

### For Production:
For permanent 24/7 access with HTTPS:
1. Deploy to Render.com (free)
2. Get permanent URL like: `https://your-app.onrender.com`
3. See DEPLOYMENT.md for guide

---

## 🚀 WHAT'S RUNNING

### Current Services:
```
✅ Main Server (Node.js + Express)
   - Port: 3000
   - Status: Running
   - Auto-restart: Yes

✅ Keepalive Monitor
   - Check interval: 30 seconds
   - Auto-restart: Yes
   - Logging: Enabled

✅ All Endpoints
   - V1, V2, Access, APIs
   - Status: Available
   - Monitoring: Active
```

---

## 📈 MONITORING

### Real-time Status:
Visit access portal to see:
- ✅ Server online indicator
- 📊 All URL links
- 🔄 Auto-refreshing status
- 📱 Mobile-friendly interface

### Logs Location:
```
Main server:    /home/root/webapp/server.log
Keepalive:      /home/root/webapp/keepalive.log
Keepalive out:  /home/root/webapp/keepalive_output.log
```

---

## 🎉 READY TO USE!

Your webapp is:
- ✅ Running 24/7 with keepalive
- ✅ Accessible from anywhere
- ✅ Available on all devices
- ✅ Auto-restarting if crashes
- ✅ Fully functional

**Start using now:**
👉 http://14.225.210.195:3000/access

---

## 📞 SUPPORT

### If You Need Help:
1. Check troubleshooting section above
2. Review server logs
3. Check keepalive logs
4. Read documentation files
5. Test with health endpoint

### Documentation Files:
- `README.md` - Main guide
- `V2_FEATURES.md` - V2 details
- `DEPLOYMENT.md` - Production deploy
- `ACCESS_GUIDE.md` - This file

---

**Server Running Since:** 2025-12-17
**Status:** Active & Monitored
**Uptime:** Continuous with auto-restart

**Enjoy your always-accessible webapp!** 🚀✨
