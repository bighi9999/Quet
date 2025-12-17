# 🔐 Quick Login Guide - V5.2 (Server Không Có GUI)

## ⚠️ Vấn Đề

Server không có GUI/Display → Không thể chạy Chrome với giao diện → Không thể đăng nhập thủ công trực tiếp trên server.

## ✅ Giải Pháp: Remote Login Helper

**Đăng nhập từ máy LOCAL → Export cookies → Import vào server**

---

## 🚀 Quick Start (3 Bước)

### Bước 1: Xem Hướng Dẫn

```bash
cd /home/root/webapp
python3 remote_login_helper.py gemini-guide
```

### Bước 2: Export Cookies Từ Máy Local

**Trên máy Windows/Mac/Linux của bạn:**

#### Option A: Sử dụng Chrome DevTools (Cách 1)

1. Mở Chrome
2. Vào https://gemini.google.com/
3. Đăng nhập
4. Nhấn `F12` → Tab `Console`
5. Paste code này:

```javascript
copy(JSON.stringify(document.cookie.split(';').map(c => {
    const [name, ...v] = c.trim().split('=');
    return {name: name, value: v.join('='), domain: '.google.com'};
})));
```

6. Cookies đã copy vào clipboard
7. Paste vào file `gemini_cookies.json`

#### Option B: Sử dụng Extension (Cách 2 - Dễ Hơn!)

1. Cài extension **"EditThisCookie"** hoặc **"Cookie Editor"**
2. Vào https://gemini.google.com/
3. Đăng nhập
4. Click vào extension icon
5. Click **"Export"** → Copy JSON
6. Save vào `gemini_cookies.json`

### Bước 3: Upload & Import

#### Upload lên server:
```bash
scp gemini_cookies.json root@14.225.210.195:/home/root/webapp/
```

#### Import:
```bash
ssh root@14.225.210.195
cd /home/root/webapp
python3 remote_login_helper.py import-gemini
```

---

## 📋 Detailed Instructions

### For Gemini (Google)

```bash
# 1. View guide
python3 remote_login_helper.py gemini-guide

# 2. After export from local machine, upload:
scp gemini_cookies.json root@14.225.210.195:/home/root/webapp/

# 3. Import on server:
python3 remote_login_helper.py import-gemini
```

### For Grok (X/Twitter)

```bash
# 1. View guide
python3 remote_login_helper.py grok-guide

# 2. Export from https://x.com/i/grok
# 3. Upload:
scp grok_cookies.json root@14.225.210.195:/home/root/webapp/

# 4. Import:
python3 remote_login_helper.py import-grok
```

### Check Status

```bash
python3 remote_login_helper.py status
```

---

## 🍪 Cookie Export Methods

### Method 1: Chrome DevTools Console

**For Gemini:**
```javascript
copy(JSON.stringify(document.cookie.split(';').map(c => {
    const [name, ...v] = c.trim().split('=');
    return {name: name, value: v.join('='), domain: '.google.com', path: '/'};
})));
```

**For Grok/X:**
```javascript
copy(JSON.stringify(document.cookie.split(';').map(c => {
    const [name, ...v] = c.trim().split('=');
    return {name: name, value: v.join('='), domain: '.x.com', path: '/'};
})));
```

### Method 2: Browser Extensions

**Recommended Extensions:**
- **EditThisCookie** (Chrome/Edge)
- **Cookie Editor** (Firefox/Chrome)
- **Cookie-Editor** (All browsers)

**Steps:**
1. Install extension
2. Login to website
3. Click extension icon
4. Click "Export" button
5. Copy JSON
6. Save to file

### Method 3: Manual Copy (Advanced)

1. F12 → Application tab
2. Cookies → Select domain
3. Copy each cookie manually
4. Format as JSON array

---

## 📝 Cookie JSON Format

```json
[
    {
        "name": "__Secure-1PSID",
        "value": "your_cookie_value_here",
        "domain": ".google.com",
        "path": "/",
        "secure": true,
        "httpOnly": true,
        "expirationDate": 1735689600
    },
    {
        "name": "APISID",
        "value": "another_value",
        "domain": ".google.com",
        "path": "/"
    }
]
```

**Important Cookies for Gemini:**
- `__Secure-1PSID`
- `__Secure-3PSID`
- `APISID`
- `SAPISID`
- `SSID`
- `SID`

**Important Cookies for Grok/X:**
- `auth_token`
- `ct0`
- `twid`

---

## 🔧 Troubleshooting

### Problem: "File không tồn tại"

**Check file location:**
```bash
ls -la /home/root/webapp/*.json
```

**Upload again:**
```bash
scp gemini_cookies.json root@14.225.210.195:/home/root/webapp/
```

### Problem: "Không đọc được file"

**Check JSON format:**
```bash
cat gemini_cookies.json | python3 -m json.tool
```

Should be valid JSON array.

### Problem: "Session expired"

Cookies có thời hạn (30-90 ngày). Export lại cookies mới:
```bash
# Re-export from browser
# Upload new file
# Re-import
python3 remote_login_helper.py import-gemini
```

### Problem: "Permission denied"

**Fix permissions:**
```bash
chmod 600 selenium_cookies/*.pkl
chmod 700 selenium_cookies/
```

---

## 🎯 Complete Workflow Example

### Setup Gemini

```bash
# === On Your Local Machine ===

# 1. Open Chrome
# 2. Go to https://gemini.google.com/
# 3. Login with Google account
# 4. F12 → Console → Paste script → Copy cookies
# 5. Save to gemini_cookies.json

# 6. Upload to server
scp gemini_cookies.json root@14.225.210.195:/home/root/webapp/


# === On Server ===

ssh root@14.225.210.195
cd /home/root/webapp

# 7. Import cookies
python3 remote_login_helper.py import-gemini

# ✅ Output:
# ✅ Đọc được X cookies từ JSON
# ✅ Đã lưu X cookies vào: /home/root/webapp/selenium_cookies/gemini_cookies.pkl
# 🎉 Gemini cookies import thành công!

# 8. Verify
python3 remote_login_helper.py status

# ✅ Output:
# Gemini: ✅ Có
#   File: /home/root/webapp/selenium_cookies/gemini_cookies.pkl
#   Size: XXXX bytes
#   Cookies: X items
```

### Setup Grok (Same Process)

```bash
# Local: Export from https://x.com/i/grok
# Upload: scp grok_cookies.json root@server:/home/root/webapp/
# Import: python3 remote_login_helper.py import-grok
```

---

## ✅ Verification

After import, test in webapp:

1. Open http://14.225.210.195:5000/v5.html
2. Choose **"🤖 Selenium Mode"**
3. Upload image
4. Click **"Phân Tích Ngay"**
5. Selenium should use saved cookies!

---

## 🔐 Security Notes

### Cookie Storage Location

```
/home/root/webapp/selenium_cookies/
├── gemini_cookies.pkl      # Selenium format
├── grok_cookies.pkl        # Selenium format
└── chrome_user_data/       # Chrome profile (not used in remote method)
```

### Important

⚠️ **Cookies = Passwords!**

- Protect cookies like passwords
- Don't share with anyone
- Don't commit to Git (already in .gitignore)
- Rotate periodically

### File Permissions

```bash
chmod 700 selenium_cookies/
chmod 600 selenium_cookies/*.pkl
chmod 600 *.json  # Temporary JSON files
```

### Cleanup After Import

```bash
# Delete JSON files after import (optional)
rm gemini_cookies.json
rm grok_cookies.json
```

---

## 📊 Comparison: Methods

| Method | Pros | Cons |
|--------|------|------|
| **setup_ai_login.py** | Automatic, Easy | Requires GUI/Display |
| **remote_login_helper.py** | Works on headless server | Manual export needed |

**Current Solution**: Use `remote_login_helper.py` because server has no GUI.

---

## 🎉 Benefits

### After Setup:
✅ One-time cookie export  
✅ Selenium auto-uses saved cookies  
✅ No repeated logins  
✅ Works on headless server  
✅ Secure storage

### User Experience:
- Login once on your local machine
- Export cookies (1 minute)
- Upload to server (10 seconds)
- Import (5 seconds)
- **Done forever!**

---

## 📚 Related Files

- `remote_login_helper.py` - Cookie import tool
- `selenium_auth_manager.py` - Auth manager (for GUI systems)
- `setup_ai_login.py` - Original tool (requires GUI)
- `PERSISTENT_AUTH_GUIDE.md` - Full guide
- `QUICK_LOGIN_GUIDE.md` - This file

---

## 🆘 Need Help?

### Check Status
```bash
python3 remote_login_helper.py status
```

### View Guides
```bash
python3 remote_login_helper.py gemini-guide
python3 remote_login_helper.py grok-guide
```

### Test Import
```bash
# Should show success message
python3 remote_login_helper.py import-gemini
```

---

## ✅ Checklist

Setup Gemini:
- [ ] Export cookies from local browser
- [ ] Save to `gemini_cookies.json`
- [ ] Upload to server
- [ ] Import: `python3 remote_login_helper.py import-gemini`
- [ ] Verify: `python3 remote_login_helper.py status`

Setup Grok:
- [ ] Export cookies from local browser
- [ ] Save to `grok_cookies.json`
- [ ] Upload to server
- [ ] Import: `python3 remote_login_helper.py import-grok`
- [ ] Verify status

Test:
- [ ] Open webapp
- [ ] Use Selenium mode
- [ ] Should auto-login!

---

**Version**: V5.2  
**Status**: ✅ Production Ready  
**Server**: Headless (No GUI)  
**Solution**: Remote cookie import

**🚀 Ready to use! Follow the steps above to setup your persistent authentication.**
