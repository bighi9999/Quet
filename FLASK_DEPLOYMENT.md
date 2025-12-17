# 🚀 Flask Deployment Guide - AI Product Image Analyzer V3

## ✅ Quick Start (3 Steps)

### **1. Install Dependencies**
```bash
cd /home/root/webapp
python3 -m pip install -r requirements.txt
```

### **2. Start Server**
```bash
./start.sh
```

**Or manually:**
```bash
python3 app.py
```

### **3. Access Application**
- **Homepage:** http://localhost:5000
- **V3 Multi-AI:** http://localhost:5000/v3.html
- **V2 Pro:** http://localhost:5000/v2.html
- **Health Check:** http://localhost:5000/health

---

## 📋 Configuration

### **Environment Variables**

Create `.env` file:
```bash
PORT=5000
HOST=0.0.0.0
DEBUG=false
```

### **Custom Port**
```bash
PORT=8080 python3 app.py
```

### **Production Mode**
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

---

## 🔧 API Endpoints

### **Static Files**
- `GET /` - Homepage (redirects to V3)
- `GET /v3.html` - V3 Multi-AI Edition
- `GET /v2.html` - V2 Pro Edition
- `GET /ui-enhancements.css` - CSS
- `GET /ui-enhancements.js` - JavaScript

### **AI APIs**
- `POST /api/analyze` - OpenAI GPT-4 Vision Analysis
- `POST /api/generate` - DALL-E 3 Image Generation
- `POST /api/gemini-analyze` - Google Gemini Analysis
- `POST /api/canvas-generate` - Canvas Generation

### **System**
- `GET /health` - Health check

---

## 🐳 Docker Deployment (Optional)

### **Create Dockerfile**
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

### **Build & Run**
```bash
docker build -t ai-product-analyzer .
docker run -p 5000:5000 ai-product-analyzer
```

---

## 🔒 Run as Background Service (systemd)

### **Create systemd service**
```bash
sudo nano /etc/systemd/system/ai-analyzer.service
```

### **Service configuration:**
```ini
[Unit]
Description=AI Product Image Analyzer Flask Server
After=network.target

[Service]
User=root
WorkingDirectory=/home/root/webapp
Environment="PATH=/usr/bin:/usr/local/bin"
ExecStart=/usr/bin/python3 /home/root/webapp/app.py
Restart=always

[Install]
WantedBy=multi-user.target
```

### **Enable & Start**
```bash
sudo systemctl daemon-reload
sudo systemctl enable ai-analyzer
sudo systemctl start ai-analyzer
sudo systemctl status ai-analyzer
```

---

## 🌐 Production Deployment with Nginx

### **Install Nginx**
```bash
sudo apt update
sudo apt install nginx
```

### **Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/ai-analyzer
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 120s;
    }
}
```

### **Enable site**
```bash
sudo ln -s /etc/nginx/sites-available/ai-analyzer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 📊 Monitoring

### **Check Logs**
```bash
# Flask logs (if running with start.sh)
tail -f nohup.out

# systemd logs
sudo journalctl -u ai-analyzer -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### **Health Check**
```bash
curl http://localhost:5000/health
```

---

## 🔥 Performance Tuning

### **Gunicorn with Multiple Workers**
```bash
gunicorn -w 4 -b 0.0.0.0:5000 --timeout 120 app:app
```

### **Gunicorn with Gevent**
```bash
pip install gevent
gunicorn -k gevent -w 4 -b 0.0.0.0:5000 app:app
```

---

## 🐛 Troubleshooting

### **Port already in use**
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

### **Permission denied**
```bash
chmod +x start.sh
chmod +x app.py
```

### **Dependencies not found**
```bash
python3 -m pip install -r requirements.txt --force-reinstall
```

---

## 💰 Cost

- **Hosting:** $0 (self-hosted)
- **OpenAI API:** ~$0.05 per workflow (user pays)
- **Gemini API:** $0 (FREE tier)

---

## 📞 Support

**Repository:** https://github.com/bighi9999/Quet
**Latest Commit:** Check `git log -1`

---

Generated: $(date)
