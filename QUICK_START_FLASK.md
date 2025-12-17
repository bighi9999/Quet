# ⚡ Quick Start - Flask Server trên SSH

## 🎯 Chỉ 4 Bước Đơn Giản!

### **Bước 1: Clone Repository**
```bash
git clone https://github.com/bighi9999/Quet.git
cd Quet
```

### **Bước 2: Install Dependencies**
```bash
# Install pip nếu chưa có
sudo apt update
sudo apt install python3-pip -y

# Install Flask và dependencies
pip3 install -r requirements.txt
```

### **Bước 3: Start Server**
```bash
# Option A: Dùng script (recommended)
./start.sh

# Option B: Start trực tiếp
python3 app.py

# Option C: Background với nohup
nohup python3 app.py > server.log 2>&1 &
```

### **Bước 4: Truy Cập**
```
http://YOUR_SERVER_IP:5000/v3.html
```

---

## 🔧 Cấu Hình Nâng Cao

### **Custom Port**
```bash
PORT=8080 python3 app.py
```

### **Run với Gunicorn (Production)**
```bash
pip3 install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 --timeout 120 app:app
```

### **Run Background với systemd**
```bash
# Tạo service file
sudo nano /etc/systemd/system/ai-analyzer.service
```

```ini
[Unit]
Description=AI Product Analyzer
After=network.target

[Service]
User=root
WorkingDirectory=/path/to/Quet
ExecStart=/usr/bin/python3 app.py
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable và start
sudo systemctl daemon-reload
sudo systemctl enable ai-analyzer
sudo systemctl start ai-analyzer
```

---

## 📊 Kiểm Tra Server

### **Health Check**
```bash
curl http://localhost:5000/health
```

### **Check Logs**
```bash
# Nếu dùng nohup
tail -f server.log

# Nếu dùng systemd
sudo journalctl -u ai-analyzer -f
```

### **Check Port**
```bash
sudo lsof -i :5000
```

---

## 🌐 Expose ra Internet

### **Option 1: Nginx Reverse Proxy**
```bash
sudo apt install nginx -y
```

```nginx
# /etc/nginx/sites-available/ai-analyzer
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/ai-analyzer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### **Option 2: Direct Access**
Đảm bảo firewall cho phép port 5000:
```bash
sudo ufw allow 5000
```

---

## 🚨 Troubleshooting

### **Port đã được sử dụng**
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

### **Permission denied**
```bash
chmod +x start.sh
```

### **Module not found**
```bash
pip3 install -r requirements.txt --force-reinstall
```

---

## ✅ Xong!

Server sẽ chạy tại:
- **Homepage:** http://YOUR_IP:5000
- **V3:** http://YOUR_IP:5000/v3.html
- **V2:** http://YOUR_IP:5000/v2.html
- **Health:** http://YOUR_IP:5000/health

**🎉 Enjoy AI Product Analyzer V3!**
