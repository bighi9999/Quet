"""
Selenium Authentication Manager - V5.2
Quản lý đăng nhập và lưu session/cookies cho Gemini & Grok
Chỉ cần đăng nhập 1 lần duy nhất!
"""

import os
import json
import pickle
import time
import logging
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Paths for storing cookies/sessions
COOKIES_DIR = '/home/root/webapp/selenium_cookies'
Path(COOKIES_DIR).mkdir(parents=True, exist_ok=True)

GEMINI_COOKIES = os.path.join(COOKIES_DIR, 'gemini_cookies.pkl')
GROK_COOKIES = os.path.join(COOKIES_DIR, 'grok_cookies.pkl')
USER_DATA_DIR = os.path.join(COOKIES_DIR, 'chrome_user_data')

# User credentials (từ environment hoặc config)
CREDENTIALS = {
    'gemini': {
        'email': os.getenv('GEMINI_USER_EMAIL', ''),
        'password': os.getenv('GEMINI_USER_PASSWORD', '')
    },
    'grok': {
        'username': os.getenv('GROK_USERNAME', ''),  # X/Twitter username
        'password': os.getenv('GROK_PASSWORD', '')
    }
}


class SeleniumAuthManager:
    """Quản lý authentication và session persistence"""
    
    def __init__(self, headless=False):
        """
        Initialize với headless=False để có thể tương tác manual login
        """
        self.headless = headless
        self.driver = None
        
    def create_driver(self, use_profile=True):
        """Tạo Chrome driver với user profile để persist sessions"""
        try:
            chrome_options = Options()
            
            if self.headless:
                chrome_options.add_argument('--headless=new')
            
            # Sử dụng user data directory để lưu session
            if use_profile:
                chrome_options.add_argument(f'--user-data-dir={USER_DATA_DIR}')
                chrome_options.add_argument('--profile-directory=Default')
            
            # Basic options
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
            chrome_options.add_argument('--disable-gpu')
            chrome_options.add_argument('--window-size=1920,1080')
            
            # Anti-detection
            chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
            chrome_options.add_experimental_option('useAutomationExtension', False)
            
            # User agent
            chrome_options.add_argument(
                'user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                'AppleWebKit/537.36 (KHTML, like Gecko) '
                'Chrome/120.0.0.0 Safari/537.36'
            )
            
            self.driver = webdriver.Chrome(options=chrome_options)
            
            # Remove webdriver detection
            self.driver.execute_cdp_cmd('Page.addScriptToEvaluateOnNewDocument', {
                'source': '''
                    Object.defineProperty(navigator, 'webdriver', {
                        get: () => undefined
                    });
                '''
            })
            
            logger.info("✅ Chrome driver created with persistent profile")
            return self.driver
            
        except Exception as e:
            logger.error(f"❌ Failed to create driver: {e}")
            raise
    
    def save_cookies(self, provider):
        """Lưu cookies vào file"""
        try:
            cookies = self.driver.get_cookies()
            cookie_file = GEMINI_COOKIES if provider == 'gemini' else GROK_COOKIES
            
            with open(cookie_file, 'wb') as f:
                pickle.dump(cookies, f)
            
            logger.info(f"✅ Saved {len(cookies)} cookies for {provider}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to save cookies: {e}")
            return False
    
    def load_cookies(self, provider):
        """Load cookies từ file"""
        try:
            cookie_file = GEMINI_COOKIES if provider == 'gemini' else GROK_COOKIES
            
            if not os.path.exists(cookie_file):
                logger.warning(f"⚠️ No saved cookies for {provider}")
                return False
            
            with open(cookie_file, 'rb') as f:
                cookies = pickle.load(f)
            
            # Add cookies to driver
            for cookie in cookies:
                try:
                    self.driver.add_cookie(cookie)
                except Exception as e:
                    # Skip cookies that fail (e.g., expired)
                    pass
            
            logger.info(f"✅ Loaded {len(cookies)} cookies for {provider}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to load cookies: {e}")
            return False
    
    def check_gemini_session(self):
        """Kiểm tra xem đã đăng nhập Gemini chưa"""
        try:
            self.driver.get('https://gemini.google.com/')
            time.sleep(3)
            
            # Check if we're on login page or app page
            current_url = self.driver.current_url
            
            if 'accounts.google.com' in current_url:
                logger.info("❌ Not logged in to Gemini")
                return False
            else:
                logger.info("✅ Already logged in to Gemini")
                return True
                
        except Exception as e:
            logger.error(f"❌ Error checking Gemini session: {e}")
            return False
    
    def check_grok_session(self):
        """Kiểm tra xem đã đăng nhập Grok (X) chưa"""
        try:
            self.driver.get('https://x.com/i/grok')
            time.sleep(3)
            
            current_url = self.driver.current_url
            
            if 'login' in current_url.lower():
                logger.info("❌ Not logged in to Grok/X")
                return False
            else:
                logger.info("✅ Already logged in to Grok/X")
                return True
                
        except Exception as e:
            logger.error(f"❌ Error checking Grok session: {e}")
            return False
    
    def manual_login_gemini(self):
        """
        Hướng dẫn đăng nhập thủ công Gemini
        Driver sẽ mở browser cho user tự login
        """
        logger.info("🔐 Manual login required for Gemini")
        logger.info("📝 Please login manually in the browser window...")
        
        try:
            self.driver.get('https://accounts.google.com/')
            
            logger.info("""
╔════════════════════════════════════════════════════════╗
║   🔐 GEMINI MANUAL LOGIN                              ║
╚════════════════════════════════════════════════════════╝

Bước 1: Trình duyệt đã mở
Bước 2: Đăng nhập bằng tài khoản Google của bạn
Bước 3: Sau khi đăng nhập xong, quay lại terminal
Bước 4: Nhấn Enter để tiếp tục...

⏳ Đợi bạn đăng nhập...
            """)
            
            input("👉 Nhấn Enter sau khi đã đăng nhập xong: ")
            
            # Verify login
            if self.check_gemini_session():
                self.save_cookies('gemini')
                logger.info("✅ Gemini login successful and cookies saved!")
                return True
            else:
                logger.error("❌ Login verification failed")
                return False
                
        except Exception as e:
            logger.error(f"❌ Manual login error: {e}")
            return False
    
    def manual_login_grok(self):
        """
        Hướng dẫn đăng nhập thủ công Grok/X
        """
        logger.info("🔐 Manual login required for Grok/X")
        
        try:
            self.driver.get('https://x.com/login')
            
            logger.info("""
╔════════════════════════════════════════════════════════╗
║   🔐 GROK (X/TWITTER) MANUAL LOGIN                    ║
╚════════════════════════════════════════════════════════╝

Bước 1: Trình duyệt đã mở trang login X
Bước 2: Đăng nhập bằng tài khoản X/Twitter của bạn
Bước 3: Sau khi đăng nhập xong, quay lại terminal
Bước 4: Nhấn Enter để tiếp tục...

⏳ Đợi bạn đăng nhập...
            """)
            
            input("👉 Nhấn Enter sau khi đã đăng nhập xong: ")
            
            # Verify login
            if self.check_grok_session():
                self.save_cookies('grok')
                logger.info("✅ Grok/X login successful and cookies saved!")
                return True
            else:
                logger.error("❌ Login verification failed")
                return False
                
        except Exception as e:
            logger.error(f"❌ Manual login error: {e}")
            return False
    
    def ensure_gemini_auth(self):
        """
        Đảm bảo đã đăng nhập Gemini
        Tự động load cookies hoặc yêu cầu login manual
        """
        try:
            if not self.driver:
                self.create_driver(use_profile=True)
            
            # Try to access Gemini with saved session
            self.driver.get('https://gemini.google.com/')
            time.sleep(2)
            
            # Load saved cookies if available
            self.load_cookies('gemini')
            self.driver.refresh()
            time.sleep(3)
            
            # Check if logged in
            if self.check_gemini_session():
                logger.info("✅ Gemini session restored from cookies")
                return True
            else:
                logger.info("⚠️ Need fresh login")
                return self.manual_login_gemini()
                
        except Exception as e:
            logger.error(f"❌ Error ensuring Gemini auth: {e}")
            return False
    
    def ensure_grok_auth(self):
        """
        Đảm bảo đã đăng nhập Grok/X
        """
        try:
            if not self.driver:
                self.create_driver(use_profile=True)
            
            # Try to access Grok
            self.driver.get('https://x.com/i/grok')
            time.sleep(2)
            
            # Load saved cookies
            self.load_cookies('grok')
            self.driver.refresh()
            time.sleep(3)
            
            # Check if logged in
            if self.check_grok_session():
                logger.info("✅ Grok session restored from cookies")
                return True
            else:
                logger.info("⚠️ Need fresh login")
                return self.manual_login_grok()
                
        except Exception as e:
            logger.error(f"❌ Error ensuring Grok auth: {e}")
            return False
    
    def close(self):
        """Đóng driver"""
        if self.driver:
            self.driver.quit()
            self.driver = None


# ===== HELPER FUNCTIONS =====

def setup_gemini_login():
    """
    CLI tool để setup Gemini login một lần
    """
    print("""
╔════════════════════════════════════════════════════════╗
║   🔐 GEMINI LOGIN SETUP                               ║
╚════════════════════════════════════════════════════════╝

Công cụ này sẽ giúp bạn đăng nhập Gemini và lưu session.
Sau này sẽ không cần đăng nhập lại!

    """)
    
    auth_manager = SeleniumAuthManager(headless=False)
    
    try:
        success = auth_manager.ensure_gemini_auth()
        
        if success:
            print("""
✅ ĐÃ HOÀN TẤT!

Session Gemini đã được lưu. 
Selenium giờ sẽ tự động sử dụng session này.
Không cần đăng nhập lại!

Cookies được lưu tại: {GEMINI_COOKIES}
            """)
        else:
            print("❌ Login thất bại. Vui lòng thử lại.")
            
    finally:
        auth_manager.close()


def setup_grok_login():
    """
    CLI tool để setup Grok login một lần
    """
    print("""
╔════════════════════════════════════════════════════════╗
║   🔐 GROK (X) LOGIN SETUP                             ║
╚════════════════════════════════════════════════════════╝

Công cụ này sẽ giúp bạn đăng nhập X/Grok và lưu session.

    """)
    
    auth_manager = SeleniumAuthManager(headless=False)
    
    try:
        success = auth_manager.ensure_grok_auth()
        
        if success:
            print("""
✅ ĐÃ HOÀN TẤT!

Session Grok/X đã được lưu.
Selenium giờ sẽ tự động sử dụng session này.

Cookies được lưu tại: {GROK_COOKIES}
            """)
        else:
            print("❌ Login thất bại. Vui lòng thử lại.")
            
    finally:
        auth_manager.close()


if __name__ == '__main__':
    import sys
    
    if len(sys.argv) < 2:
        print("""
Usage:
  python selenium_auth_manager.py gemini    # Setup Gemini login
  python selenium_auth_manager.py grok      # Setup Grok login
  python selenium_auth_manager.py both      # Setup both
        """)
        sys.exit(1)
    
    command = sys.argv[1].lower()
    
    if command == 'gemini':
        setup_gemini_login()
    elif command == 'grok':
        setup_grok_login()
    elif command == 'both':
        setup_gemini_login()
        setup_grok_login()
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)
