#!/usr/bin/env python3
"""
Remote Login Helper - V5.2
Giải pháp cho server không có GUI:
1. Generate instructions để login từ máy local
2. Export cookies từ browser
3. Import cookies vào server
"""

import os
import json
import pickle
from pathlib import Path

COOKIES_DIR = '/home/root/webapp/selenium_cookies'
Path(COOKIES_DIR).mkdir(parents=True, exist_ok=True)

GEMINI_COOKIES = os.path.join(COOKIES_DIR, 'gemini_cookies.pkl')
GROK_COOKIES = os.path.join(COOKIES_DIR, 'grok_cookies.pkl')


def print_banner():
    print("""
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     🔐 REMOTE LOGIN HELPER - V5.2                           ║
║                                                              ║
║     Đăng nhập từ máy local → Export cookies → Server       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    """)


def show_gemini_instructions():
    """Hướng dẫn export Gemini cookies"""
    print("""
╔══════════════════════════════════════════════════════════════╗
║   📝 HƯỚNG DẪN EXPORT GEMINI COOKIES                         ║
╚══════════════════════════════════════════════════════════════╝

🌐 Bước 1: Mở trình duyệt trên MÁY LOCAL của bạn

🔗 Bước 2: Truy cập Gemini
   URL: https://gemini.google.com/

🔐 Bước 3: Đăng nhập bằng Google account của bạn

🍪 Bước 4: Export cookies bằng Chrome DevTools

   A. Nhấn F12 để mở DevTools
   
   B. Chọn tab "Application" (hoặc "Ứng dụng")
   
   C. Bên trái, chọn "Cookies" → "https://gemini.google.com"
   
   D. Copy tất cả cookies:
      • Click phải vào danh sách cookies
      • Chọn "Copy all as JSON" (hoặc copy từng cookie)
   
   E. HOẶC sử dụng Console:
      • Chọn tab "Console"
      • Paste đoạn code này:
      
      ```javascript
      copy(JSON.stringify(document.cookie.split(';').map(c => {
          const [name, ...v] = c.trim().split('=');
          return {name: name, value: v.join('='), domain: '.google.com'};
      })));
      ```
      
      • Cookies đã được copy vào clipboard!

📋 Bước 5: Paste cookies vào file

   Tạo file: gemini_cookies.json
   
   Format:
   [
       {
           "name": "cookie_name",
           "value": "cookie_value",
           "domain": ".google.com",
           "path": "/"
       },
       ...
   ]

📤 Bước 6: Upload file lên server

   Sử dụng SCP:
   scp gemini_cookies.json root@14.225.210.195:/home/root/webapp/

✅ Bước 7: Import vào server
   
   python3 remote_login_helper.py import-gemini

═══════════════════════════════════════════════════════════════

⚡ CÁCH NHANH: Sử dụng Browser Extension

   1. Cài extension "EditThisCookie" hoặc "Cookie Editor"
   2. Truy cập https://gemini.google.com/
   3. Đăng nhập
   4. Click vào extension icon
   5. Click "Export" → Copy JSON
   6. Paste vào file gemini_cookies.json
   7. Upload lên server
   8. Import: python3 remote_login_helper.py import-gemini

    """)


def show_grok_instructions():
    """Hướng dẫn export Grok cookies"""
    print("""
╔══════════════════════════════════════════════════════════════╗
║   📝 HƯỚNG DẪN EXPORT GROK (X) COOKIES                       ║
╚══════════════════════════════════════════════════════════════╝

🌐 Bước 1: Mở trình duyệt trên MÁY LOCAL

🔗 Bước 2: Truy cập X/Twitter
   URL: https://x.com/

🔐 Bước 3: Đăng nhập bằng X/Twitter account

🔗 Bước 4: Truy cập Grok
   URL: https://x.com/i/grok

🍪 Bước 5: Export cookies (tương tự Gemini)

   A. Nhấn F12 → tab "Application"
   
   B. "Cookies" → "https://x.com"
   
   C. Sử dụng Console script:
   
   ```javascript
   copy(JSON.stringify(document.cookie.split(';').map(c => {
       const [name, ...v] = c.trim().split('=');
       return {name: name, value: v.join('='), domain: '.x.com'};
   })));
   ```

📋 Bước 6: Save vào file grok_cookies.json

📤 Bước 7: Upload lên server
   
   scp grok_cookies.json root@14.225.210.195:/home/root/webapp/

✅ Bước 8: Import
   
   python3 remote_login_helper.py import-grok

    """)


def import_gemini_cookies():
    """Import Gemini cookies từ JSON file"""
    print("\n🔄 Importing Gemini cookies...\n")
    
    json_file = '/home/root/webapp/gemini_cookies.json'
    
    if not os.path.exists(json_file):
        print(f"❌ File không tồn tại: {json_file}")
        print("\nVui lòng:")
        print(f"  1. Tạo file gemini_cookies.json với cookies từ browser")
        print(f"  2. Upload lên: {json_file}")
        return False
    
    try:
        # Read JSON
        with open(json_file, 'r') as f:
            cookies_json = json.load(f)
        
        print(f"✅ Đọc được {len(cookies_json)} cookies từ JSON")
        
        # Convert to Selenium format
        selenium_cookies = []
        for cookie in cookies_json:
            selenium_cookie = {
                'name': cookie.get('name', ''),
                'value': cookie.get('value', ''),
                'domain': cookie.get('domain', '.google.com'),
                'path': cookie.get('path', '/'),
                'secure': cookie.get('secure', True),
                'httpOnly': cookie.get('httpOnly', False)
            }
            
            # Add expiry if available
            if 'expirationDate' in cookie:
                selenium_cookie['expiry'] = int(cookie['expirationDate'])
            
            selenium_cookies.append(selenium_cookie)
        
        # Save as pickle
        with open(GEMINI_COOKIES, 'wb') as f:
            pickle.dump(selenium_cookies, f)
        
        print(f"✅ Đã lưu {len(selenium_cookies)} cookies vào: {GEMINI_COOKIES}")
        print("\n🎉 Gemini cookies import thành công!")
        print("\nSelenium giờ có thể sử dụng session này.")
        
        return True
        
    except Exception as e:
        print(f"❌ Lỗi khi import: {e}")
        return False


def import_grok_cookies():
    """Import Grok cookies từ JSON file"""
    print("\n🔄 Importing Grok cookies...\n")
    
    json_file = '/home/root/webapp/grok_cookies.json'
    
    if not os.path.exists(json_file):
        print(f"❌ File không tồn tại: {json_file}")
        print("\nVui lòng:")
        print(f"  1. Tạo file grok_cookies.json với cookies từ browser")
        print(f"  2. Upload lên: {json_file}")
        return False
    
    try:
        with open(json_file, 'r') as f:
            cookies_json = json.load(f)
        
        print(f"✅ Đọc được {len(cookies_json)} cookies từ JSON")
        
        selenium_cookies = []
        for cookie in cookies_json:
            selenium_cookie = {
                'name': cookie.get('name', ''),
                'value': cookie.get('value', ''),
                'domain': cookie.get('domain', '.x.com'),
                'path': cookie.get('path', '/'),
                'secure': cookie.get('secure', True),
                'httpOnly': cookie.get('httpOnly', False)
            }
            
            if 'expirationDate' in cookie:
                selenium_cookie['expiry'] = int(cookie['expirationDate'])
            
            selenium_cookies.append(selenium_cookie)
        
        with open(GROK_COOKIES, 'wb') as f:
            pickle.dump(selenium_cookies, f)
        
        print(f"✅ Đã lưu {len(selenium_cookies)} cookies vào: {GROK_COOKIES}")
        print("\n🎉 Grok cookies import thành công!")
        
        return True
        
    except Exception as e:
        print(f"❌ Lỗi khi import: {e}")
        return False


def check_cookies_status():
    """Kiểm tra cookies hiện có"""
    print("\n📊 TRẠNG THÁI COOKIES\n")
    
    gemini_exists = os.path.exists(GEMINI_COOKIES)
    grok_exists = os.path.exists(GROK_COOKIES)
    
    print(f"Gemini: {'✅ Có' if gemini_exists else '❌ Chưa có'}")
    if gemini_exists:
        size = os.path.getsize(GEMINI_COOKIES)
        print(f"  File: {GEMINI_COOKIES}")
        print(f"  Size: {size} bytes")
        
        try:
            with open(GEMINI_COOKIES, 'rb') as f:
                cookies = pickle.load(f)
            print(f"  Cookies: {len(cookies)} items")
        except:
            print(f"  ⚠️ Không đọc được file")
    
    print()
    
    print(f"Grok: {'✅ Có' if grok_exists else '❌ Chưa có'}")
    if grok_exists:
        size = os.path.getsize(GROK_COOKIES)
        print(f"  File: {GROK_COOKIES}")
        print(f"  Size: {size} bytes")
        
        try:
            with open(GROK_COOKIES, 'rb') as f:
                cookies = pickle.load(f)
            print(f"  Cookies: {len(cookies)} items")
        except:
            print(f"  ⚠️ Không đọc được file")


def main():
    print_banner()
    
    import sys
    
    if len(sys.argv) < 2:
        print("""
CÁCH SỬ DỤNG:

  1. Xem hướng dẫn export cookies:
     python3 remote_login_helper.py gemini-guide
     python3 remote_login_helper.py grok-guide

  2. Import cookies từ JSON file:
     python3 remote_login_helper.py import-gemini
     python3 remote_login_helper.py import-grok

  3. Kiểm tra trạng thái:
     python3 remote_login_helper.py status

VÍ DỤ WORKFLOW:

  # Bước 1: Xem hướng dẫn
  python3 remote_login_helper.py gemini-guide
  
  # Bước 2: Trên máy local - Export cookies từ browser
  # → Save vào gemini_cookies.json
  
  # Bước 3: Upload lên server
  # scp gemini_cookies.json root@server:/home/root/webapp/
  
  # Bước 4: Import
  python3 remote_login_helper.py import-gemini
  
  # ✅ Done! Selenium sẽ dùng cookies này

        """)
        return
    
    command = sys.argv[1].lower()
    
    if command == 'gemini-guide':
        show_gemini_instructions()
        
    elif command == 'grok-guide':
        show_grok_instructions()
        
    elif command == 'import-gemini':
        import_gemini_cookies()
        
    elif command == 'import-grok':
        import_grok_cookies()
        
    elif command == 'status':
        check_cookies_status()
        
    else:
        print(f"❌ Unknown command: {command}")
        print("Use: gemini-guide | grok-guide | import-gemini | import-grok | status")


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️ Đã hủy")
    except Exception as e:
        print(f"\n❌ Lỗi: {e}")
