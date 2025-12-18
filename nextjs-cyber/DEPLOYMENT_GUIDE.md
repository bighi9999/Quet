# 🚀 HƯỚNG DẪN TRIỂN KHAI PRODUCTION

## 📋 TÓM TẮT

Script `deploy_master.sh` thực hiện **10 nhiệm vụ tự động** để đưa hệ thống lên chuẩn Production:

### PHẦN 1: HẠ TẦNG HỆ THỐNG
1. ✅ Tạo 8GB Swap Memory
2. ✅ Dọn dẹp hệ thống (cleanup)
3. ✅ Cấu hình tường lửa UFW

### PHẦN 2: ỨNG DỤNG
4. ✅ Chuẩn bị môi trường build
5. ✅ Build tối ưu với memory limit
6. ✅ Khởi động PM2 Production mode

### PHẦN 3: WEB SERVER
7. ✅ Sửa lỗi 502 (fix Nginx proxy)
8. ✅ Tối ưu hiệu suất Nginx
9. ✅ Kiểm tra & gia hạn SSL

### PHẦN 4: GIÁM SÁT
10. ✅ Tự động kiểm tra và báo cáo

---

## 🎯 CÁCH SỬ DỤNG

### Bước 1: Chạy Script (Cần quyền root)

```bash
cd /home/root/webapp/nextjs-cyber
sudo bash deploy_master.sh
```

### Bước 2: Đợi Hoàn Thành

Script sẽ tự động thực hiện tất cả các bước. Nếu gặp lỗi, script sẽ dừng ngay để bạn kiểm tra.

Thời gian dự kiến: **5-10 phút** (tùy vào tốc độ VPS)

### Bước 3: Kiểm Tra Kết Quả

Sau khi script hoàn thành, bạn sẽ thấy bảng thống kê:
- 📊 Memory (RAM + Swap)
- 💾 Disk Usage
- ⚙️ PM2 Status
- 🌐 Nginx Status
- 🔒 Firewall Status

---

## 🔍 KIỂM TRA THỦ CÔNG

### 1. Kiểm tra Swap

```bash
free -h
```

Kết quả mong đợi: **Swap: 8GB**

### 2. Kiểm tra PM2

```bash
pm2 list
pm2 logs bg-ai-tools --lines 20
```

Kết quả mong đợi: **Status: online**

### 3. Kiểm tra Nginx

```bash
sudo nginx -t
sudo systemctl status nginx
```

Kết quả mong đợi: **Active: active (running)**

### 4. Kiểm tra Firewall

```bash
sudo ufw status
```

Kết quả mong đợi:
```
Status: active
To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
30000/tcp                  DENY        Anywhere
```

### 5. Test Website

```bash
# Test local
curl http://localhost:30000

# Test public
curl https://mochiphoto.click
```

Kết quả mong đợi: **HTTP 200**

---

## 🐛 XỬ LÝ LỖI

### Lỗi: "502 Bad Gateway" vẫn còn

**Nguyên nhân:** Nginx chưa reload hoặc PM2 chưa start

**Giải pháp:**
```bash
# Kiểm tra PM2
pm2 restart bg-ai-tools

# Reload Nginx
sudo systemctl reload nginx

# Test lại
curl https://mochiphoto.click
```

### Lỗi: "Cannot find module"

**Nguyên nhân:** node_modules bị lỗi

**Giải pháp:**
```bash
cd /home/root/webapp/nextjs-cyber
rm -rf node_modules .next
npm install
npm run build
pm2 restart bg-ai-tools
```

### Lỗi: SSL Certificate không có

**Nguyên nhân:** DNS chưa trỏ đúng hoặc Certbot lỗi

**Giải pháp:**
```bash
# Kiểm tra DNS
dig mochiphoto.click

# Chạy Certbot thủ công
sudo certbot --nginx -d mochiphoto.click
```

### Lỗi: "Out of memory"

**Nguyên nhân:** RAM + Swap không đủ

**Giải pháp:**
```bash
# Kiểm tra memory
free -h

# Tạo swap thêm nếu cần
sudo fallocate -l 4G /swapfile2
sudo chmod 600 /swapfile2
sudo mkswap /swapfile2
sudo swapon /swapfile2
```

---

## 📊 GIÁM SÁT THƯỜNG XUYÊN

### Lệnh hữu ích:

```bash
# Xem log PM2
pm2 logs bg-ai-tools

# Xem memory real-time
watch -n 1 free -h

# Xem disk usage
df -h

# Xem Nginx logs
sudo tail -f /var/log/nginx/error.log

# Xem UFW logs
sudo tail -f /var/log/ufw.log
```

---

## 🔄 CẬP NHẬT CODE MỚI

Khi có code mới từ GitHub:

```bash
cd /home/root/webapp/nextjs-cyber

# Pull code mới
git pull origin main

# Chạy lại script deploy
sudo bash deploy_master.sh
```

---

## 🛡️ BẢO MẬT

### Script đã cấu hình:

- ✅ UFW chặn port 30000 từ bên ngoài
- ✅ Chỉ Nginx (localhost) được truy cập port 30000
- ✅ SSL/TLS bắt buộc (HTTPS)
- ✅ Security headers trong Nginx
- ✅ Swap với swappiness=10 (ưu tiên RAM)

### Lưu ý bảo mật:

1. **Không public port 30000**: Luôn truy cập qua Nginx (port 80/443)
2. **Đổi SSH port** (tùy chọn): Đổi từ 22 sang port khác để tránh scan bot
3. **Fail2ban** (khuyến nghị): Cài để chặn brute-force SSH

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề:

1. Đọc lại log trong terminal khi chạy script
2. Kiểm tra từng bước thủ công (xem mục "KIỂM TRA THỦ CÔNG")
3. Chạy lại script: `sudo bash deploy_master.sh`

---

**Version:** v1.0.0  
**Date:** December 18, 2025  
**Author:** Senior DevOps Architect  
**Script:** deploy_master.sh
