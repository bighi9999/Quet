# 🌐 Remote Access Information

## ✅ Flask Server Running 24/7

### **Service Status:**
```bash
sudo systemctl status ai-analyzer
```

### **Service Control:**
```bash
# Start service
sudo systemctl start ai-analyzer

# Stop service
sudo systemctl stop ai-analyzer

# Restart service
sudo systemctl restart ai-analyzer

# View logs
sudo journalctl -u ai-analyzer -f
```

---

## 🌐 Access URLs

### **From Internet (Remote Access):**
- **Homepage:** `http://14.225.210.195:5000/`
- **V3 Multi-AI:** `http://14.225.210.195:5000/v3.html`
- **V2 Pro:** `http://14.225.210.195:5000/v2.html`
- **Health Check:** `http://14.225.210.195:5000/health`

### **From Local Network:**
- **Homepage:** `http://14.225.210.195:5000/`
- **V3:** `http://14.225.210.195:5000/v3.html`

### **From Server (localhost):**
- **Homepage:** `http://localhost:5000/`
- **V3:** `http://localhost:5000/v3.html`

---

## 🔧 Configuration

### **Port:** 5000
### **Host:** 0.0.0.0 (accessible from anywhere)
### **Service:** systemd (auto-start on boot)

---

## 🔥 Firewall

Port 5000 has been opened for TCP traffic.

Check firewall status:
```bash
sudo ufw status
```

---

## 📊 Monitoring

### **Check if server is running:**
```bash
curl http://localhost:5000/health
```

### **View real-time logs:**
```bash
sudo journalctl -u ai-analyzer -f
```

### **Check process:**
```bash
ps aux | grep app.py
```

---

## 🚨 Troubleshooting

### **Service not starting:**
```bash
sudo systemctl status ai-analyzer
sudo journalctl -u ai-analyzer -n 50
```

### **Port already in use:**
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
sudo systemctl restart ai-analyzer
```

### **Cannot access from remote:**
1. Check firewall: `sudo ufw status`
2. Check service: `sudo systemctl status ai-analyzer`
3. Check if port is listening: `sudo netstat -tulpn | grep 5000`
4. Check cloud provider security groups (if on AWS/Azure/GCP)

---

## 🔒 Security Notes

⚠️ **WARNING:** Server is accessible from internet on port 5000.

**Recommendations:**
1. Use Nginx reverse proxy with SSL
2. Add authentication
3. Use firewall rules to restrict IPs
4. Monitor access logs

---

Generated: Wed Dec 17 12:36:02 +07 2025
Server IP: 14.225.210.195
Port: 5000
Service: ai-analyzer
