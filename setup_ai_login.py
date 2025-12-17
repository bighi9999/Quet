#!/usr/bin/env python3
"""
Setup AI Login - One-time authentication setup
Đăng nhập Gemini và Grok một lần duy nhất, sau đó lưu session
"""

import sys
import os
from selenium_auth_manager import SeleniumAuthManager, GEMINI_COOKIES, GROK_COOKIES

def print_banner():
    print("""
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║        🔐 AI PLATFORM LOGIN SETUP - V5.2                    ║
║                                                              ║
║     Đăng nhập một lần - Sử dụng mãi mãi!                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

Công cụ này sẽ giúp bạn:
  1. Đăng nhập vào Gemini (Google)
  2. Đăng nhập vào Grok (X/Twitter)
  3. Lưu session/cookies
  4. Selenium tự động sử dụng session đã lưu

➡️ Bạn CHỈ CẦN đăng nhập 1 LẦN DUY NHẤT!

    """)

def setup_gemini():
    """Setup Gemini login"""
    print("\n" + "="*60)
    print("🧠 GEMINI (GOOGLE) LOGIN SETUP")
    print("="*60 + "\n")
    
    auth = SeleniumAuthManager(headless=False)
    
    try:
        print("📝 Bước 1: Khởi tạo Chrome browser...")
        auth.create_driver(use_profile=True)
        
        print("📝 Bước 2: Kiểm tra session hiện tại...")
        if auth.check_gemini_session():
            print("✅ Bạn đã đăng nhập Gemini rồi!")
            auth.save_cookies('gemini')
            print(f"✅ Cookies đã lưu tại: {GEMINI_COOKIES}")
            return True
        
        print("📝 Bước 3: Cần đăng nhập mới...")
        success = auth.manual_login_gemini()
        
        if success:
            print("""
✅ ĐÃ HOÀN TẤT GEMINI SETUP!

Session đã được lưu thành công.
Selenium giờ sẽ tự động sử dụng session này.
Bạn không cần đăng nhập lại!
            """)
            return True
        else:
            print("❌ Gemini setup thất bại")
            return False
            
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        return False
    finally:
        # Don't close driver yet, keep it open
        pass

def setup_grok():
    """Setup Grok login"""
    print("\n" + "="*60)
    print("🤖 GROK (X/TWITTER) LOGIN SETUP")
    print("="*60 + "\n")
    
    auth = SeleniumAuthManager(headless=False)
    
    try:
        print("📝 Bước 1: Khởi tạo Chrome browser...")
        auth.create_driver(use_profile=True)
        
        print("📝 Bước 2: Kiểm tra session hiện tại...")
        if auth.check_grok_session():
            print("✅ Bạn đã đăng nhập Grok/X rồi!")
            auth.save_cookies('grok')
            print(f"✅ Cookies đã lưu tại: {GROK_COOKIES}")
            return True
        
        print("📝 Bước 3: Cần đăng nhập mới...")
        success = auth.manual_login_grok()
        
        if success:
            print("""
✅ ĐÃ HOÀN TẤT GROK SETUP!

Session đã được lưu thành công.
Selenium giờ sẽ tự động sử dụng session này.
            """)
            return True
        else:
            print("❌ Grok setup thất bại")
            return False
            
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        return False
    finally:
        pass

def check_status():
    """Kiểm tra trạng thái session hiện tại"""
    print("\n" + "="*60)
    print("📊 KIỂM TRA TRẠNG THÁI SESSION")
    print("="*60 + "\n")
    
    # Check file existence
    gemini_exists = os.path.exists(GEMINI_COOKIES)
    grok_exists = os.path.exists(GROK_COOKIES)
    
    print(f"Gemini cookies: {'✅ Có' if gemini_exists else '❌ Không có'}")
    if gemini_exists:
        print(f"  → {GEMINI_COOKIES}")
    
    print(f"Grok cookies: {'✅ Có' if grok_exists else '❌ Không có'}")
    if grok_exists:
        print(f"  → {GROK_COOKIES}")
    
    print("\n")
    
    # Test sessions
    if gemini_exists or grok_exists:
        print("🔍 Đang test sessions...")
        auth = SeleniumAuthManager(headless=False)
        
        try:
            auth.create_driver(use_profile=True)
            
            if gemini_exists:
                print("Testing Gemini session...", end=" ")
                if auth.check_gemini_session():
                    print("✅ HOẠT ĐỘNG")
                else:
                    print("❌ HẾT HẠN (cần login lại)")
            
            if grok_exists:
                print("Testing Grok session...", end=" ")
                if auth.check_grok_session():
                    print("✅ HOẠT ĐỘNG")
                else:
                    print("❌ HẾT HẠN (cần login lại)")
                    
        except Exception as e:
            print(f"❌ Lỗi khi test: {e}")
        finally:
            auth.close()

def main():
    """Main function"""
    print_banner()
    
    if len(sys.argv) < 2:
        print("""
CÁCH SỬ DỤNG:

  python setup_ai_login.py gemini    # Setup Gemini login
  python setup_ai_login.py grok      # Setup Grok login
  python setup_ai_login.py both      # Setup cả hai
  python setup_ai_login.py status    # Kiểm tra trạng thái

VÍ DỤ:
  python setup_ai_login.py both      # Recommended!
        """)
        return
    
    command = sys.argv[1].lower()
    
    if command == 'gemini':
        setup_gemini()
        
    elif command == 'grok':
        setup_grok()
        
    elif command == 'both':
        print("📋 Sẽ setup cả Gemini và Grok\n")
        
        gemini_ok = setup_gemini()
        
        if gemini_ok:
            input("\n👉 Nhấn Enter để tiếp tục setup Grok... ")
            grok_ok = setup_grok()
            
            print("\n" + "="*60)
            print("🎉 TỔNG KẾT")
            print("="*60)
            print(f"Gemini: {'✅ Thành công' if gemini_ok else '❌ Thất bại'}")
            print(f"Grok: {'✅ Thành công' if grok_ok else '❌ Thất bại'}")
            
            if gemini_ok and grok_ok:
                print("""
✅✅✅ HOÀN TẤT TẤT CẢ! ✅✅✅

Bạn đã setup xong cả Gemini và Grok.
Selenium giờ có thể sử dụng cả 2 platforms mà không cần login!

Hãy test bằng cách chạy webapp và thử phân tích ảnh.
                """)
        else:
            print("❌ Gemini setup thất bại, bỏ qua Grok")
            
    elif command == 'status':
        check_status()
        
    else:
        print(f"❌ Unknown command: {command}")
        print("Use: gemini | grok | both | status")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️ Đã hủy bởi người dùng")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Lỗi: {e}")
        sys.exit(1)
