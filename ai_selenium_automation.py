"""
AI Selenium Automation - V5.2 Pro 2025
Tự động truy cập các trang web AI và lấy kết quả phân tích
Hỗ trợ: Google Gemini, ChatGPT, Grok (X.AI)
✨ NEW: Persistent authentication với session/cookie storage
"""

import os
import time
import base64
import tempfile
import logging
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# Import auth manager
try:
    from selenium_auth_manager import SeleniumAuthManager
    AUTH_MANAGER_AVAILABLE = True
except ImportError:
    AUTH_MANAGER_AVAILABLE = False
    logger.warning("⚠️ SeleniumAuthManager not available")

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# User data directory for persistent sessions
USER_DATA_DIR = '/home/root/webapp/selenium_cookies/chrome_user_data'
Path(USER_DATA_DIR).mkdir(parents=True, exist_ok=True)


class AISeleniumDriver:
    """Driver chung cho các AI automation"""
    
    def __init__(self, headless=True):
        self.headless = headless
        self.driver = None
        self.wait_timeout = 30
        
    def setup_driver(self, use_persistent_profile=True):
        """Khởi tạo Chrome driver với anti-detection và persistent profile"""
        try:
            chrome_options = Options()
            
            # Persistent user profile để lưu session
            if use_persistent_profile:
                chrome_options.add_argument(f'--user-data-dir={USER_DATA_DIR}')
                chrome_options.add_argument('--profile-directory=Default')
                logger.info("✅ Using persistent Chrome profile")
            
            # Headless mode
            if self.headless:
                chrome_options.add_argument('--headless=new')
                
            # Security & Performance
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
            chrome_options.add_argument('--disable-gpu')
            chrome_options.add_argument('--disable-blink-features=AutomationControlled')
            chrome_options.add_argument('--window-size=1920,1080')
            chrome_options.add_argument('--start-maximized')
            
            # Anti-detection
            chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
            chrome_options.add_experimental_option('useAutomationExtension', False)
            chrome_options.add_argument('--disable-blink-features=AutomationControlled')
            
            # User Agent
            chrome_options.add_argument(
                'user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                'AppleWebKit/537.36 (KHTML, like Gecko) '
                'Chrome/120.0.0.0 Safari/537.36'
            )
            
            # Language
            chrome_options.add_argument('--lang=vi-VN')
            
            # Khởi tạo driver
            self.driver = webdriver.Chrome(options=chrome_options)
            
            # Remove webdriver flag
            self.driver.execute_cdp_cmd('Page.addScriptToEvaluateOnNewDocument', {
                'source': '''
                    Object.defineProperty(navigator, 'webdriver', {
                        get: () => undefined
                    });
                    window.chrome = {
                        runtime: {}
                    };
                '''
            })
            
            logger.info("✅ Chrome driver initialized successfully")
            return self.driver
            
        except Exception as e:
            logger.error(f"❌ Failed to setup driver: {e}")
            raise
    
    def save_base64_image(self, base64_str):
        """Lưu base64 image vào file tạm"""
        try:
            # Remove data URL prefix
            if ',' in base64_str:
                base64_str = base64_str.split(',')[1]
            
            # Decode
            image_data = base64.b64decode(base64_str)
            
            # Save to temp file
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.png')
            temp_file.write(image_data)
            temp_file.close()
            
            logger.info(f"📁 Saved image to: {temp_file.name}")
            return temp_file.name
            
        except Exception as e:
            logger.error(f"❌ Failed to save image: {e}")
            raise
    
    def cleanup_temp_file(self, file_path):
        """Xóa file tạm"""
        try:
            if file_path and os.path.exists(file_path):
                os.unlink(file_path)
                logger.info(f"🗑️ Cleaned up: {file_path}")
        except Exception as e:
            logger.warning(f"⚠️ Failed to cleanup {file_path}: {e}")
    
    def close(self):
        """Đóng driver"""
        if self.driver:
            self.driver.quit()
            self.driver = None
            logger.info("🔒 Driver closed")


class GeminiWebAutomation(AISeleniumDriver):
    """Automation cho Google Gemini AI Studio"""
    
    GEMINI_URL = "https://aistudio.google.com/app/prompts/new_chat"
    
    def analyze_image(self, image_base64, query="Phân tích chi tiết hình ảnh sản phẩm này"):
        """
        Phân tích ảnh qua Gemini AI Studio
        
        LƯU Ý: Gemini AI Studio yêu cầu đăng nhập Google.
        Chiến lược thay thế: Sử dụng API miễn phí từ Google AI Studio API key.
        """
        image_path = None
        
        try:
            if not self.driver:
                self.setup_driver()
            
            # Save image
            image_path = self.save_base64_image(image_base64)
            
            # Navigate to Gemini
            logger.info("🌐 Navigating to Gemini AI Studio...")
            self.driver.get(self.GEMINI_URL)
            time.sleep(5)
            
            # Check if login required
            if "accounts.google.com" in self.driver.current_url:
                return {
                    'success': False,
                    'error': 'Gemini yêu cầu đăng nhập Google',
                    'suggestion': 'Sử dụng Gemini API Key thay vì web automation',
                    'provider': 'gemini-web'
                }
            
            # Wait for upload button
            try:
                upload_btn = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='file']"))
                )
                upload_btn.send_keys(image_path)
                logger.info("📤 Image uploaded")
                time.sleep(2)
                
            except TimeoutException:
                logger.warning("⚠️ Upload button not found")
                return {
                    'success': False,
                    'error': 'Không tìm thấy nút upload trên Gemini',
                    'provider': 'gemini-web'
                }
            
            # Enter query
            try:
                text_input = self.driver.find_element(By.CSS_SELECTOR, "textarea[aria-label*='prompt']")
                text_input.send_keys(query)
                text_input.send_keys(Keys.RETURN)
                logger.info("✉️ Query sent")
                
            except NoSuchElementException:
                logger.warning("⚠️ Text input not found")
                return {
                    'success': False,
                    'error': 'Không tìm thấy ô nhập text',
                    'provider': 'gemini-web'
                }
            
            # Wait for response
            time.sleep(10)
            
            try:
                response_element = WebDriverWait(self.driver, 20).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, ".response-container"))
                )
                analysis_text = response_element.text
                
                return {
                    'success': True,
                    'analysis': analysis_text,
                    'provider': 'gemini-web',
                    'method': 'selenium'
                }
                
            except TimeoutException:
                return {
                    'success': False,
                    'error': 'Timeout chờ phản hồi từ Gemini',
                    'provider': 'gemini-web'
                }
            
        except Exception as e:
            logger.error(f"❌ Gemini automation failed: {e}")
            return {
                'success': False,
                'error': str(e),
                'provider': 'gemini-web'
            }
        
        finally:
            self.cleanup_temp_file(image_path)


class ChatGPTWebAutomation(AISeleniumDriver):
    """Automation cho ChatGPT"""
    
    CHATGPT_URL = "https://chatgpt.com/"
    
    def analyze_image(self, image_base64, query="Phân tích chi tiết hình ảnh sản phẩm này"):
        """
        Phân tích ảnh qua ChatGPT
        
        LƯU Ý: ChatGPT yêu cầu đăng nhập OpenAI.
        Chiến lược: Sử dụng OpenAI API thay vì web automation.
        """
        return {
            'success': False,
            'error': 'ChatGPT yêu cầu đăng nhập OpenAI',
            'suggestion': 'Sử dụng OpenAI API Key thay vì web automation',
            'provider': 'chatgpt-web'
        }


class GrokWebAutomation(AISeleniumDriver):
    """Automation cho Grok (X.AI)"""
    
    GROK_URL = "https://x.com/i/grok"
    
    def analyze_image(self, image_base64, query="Phân tích chi tiết hình ảnh sản phẩm này"):
        """
        Phân tích ảnh qua Grok
        
        LƯU Ý: Grok yêu cầu đăng nhập X (Twitter).
        Chiến lược: Sử dụng Grok API thay vì web automation.
        """
        return {
            'success': False,
            'error': 'Grok yêu cầu đăng nhập X (Twitter)',
            'suggestion': 'Sử dụng Grok API Key thay vì web automation',
            'provider': 'grok-web'
        }


class FreeAIWebAutomation(AISeleniumDriver):
    """
    Automation cho các free AI tools không cần authentication
    Ví dụ: Hugging Face Spaces, Replicate demos, etc.
    """
    
    def analyze_with_blip(self, image_base64):
        """Sử dụng BLIP (Hugging Face Space)"""
        image_path = None
        
        try:
            if not self.driver:
                self.setup_driver()
            
            # Save image
            image_path = self.save_base64_image(image_base64)
            
            # Navigate to BLIP Space
            url = "https://huggingface.co/spaces/Salesforce/BLIP"
            logger.info(f"🌐 Navigating to {url}...")
            self.driver.get(url)
            time.sleep(5)
            
            # Upload image
            try:
                file_input = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='file']"))
                )
                file_input.send_keys(image_path)
                logger.info("📤 Image uploaded to BLIP")
                
                # Wait for result
                time.sleep(8)
                
                # Get caption
                result = self.driver.find_element(By.CSS_SELECTOR, ".output-text, .textbox").text
                
                return {
                    'success': True,
                    'analysis': f"BLIP Image Captioning:\n{result}",
                    'provider': 'blip-huggingface',
                    'method': 'selenium'
                }
                
            except Exception as e:
                logger.error(f"❌ BLIP automation failed: {e}")
                return {
                    'success': False,
                    'error': str(e),
                    'provider': 'blip-huggingface'
                }
        
        finally:
            self.cleanup_temp_file(image_path)
    
    def analyze_with_clip(self, image_base64):
        """Sử dụng CLIP Interrogator"""
        image_path = None
        
        try:
            if not self.driver:
                self.setup_driver()
            
            image_path = self.save_base64_image(image_base64)
            
            url = "https://huggingface.co/spaces/pharma/CLIP-Interrogator"
            logger.info(f"🌐 Navigating to {url}...")
            self.driver.get(url)
            time.sleep(5)
            
            try:
                file_input = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='file']"))
                )
                file_input.send_keys(image_path)
                logger.info("📤 Image uploaded to CLIP")
                
                time.sleep(10)
                
                result = self.driver.find_element(By.CSS_SELECTOR, ".output-text, .textbox").text
                
                return {
                    'success': True,
                    'analysis': f"CLIP Interrogator:\n{result}",
                    'provider': 'clip-huggingface',
                    'method': 'selenium'
                }
                
            except Exception as e:
                return {
                    'success': False,
                    'error': str(e),
                    'provider': 'clip-huggingface'
                }
        
        finally:
            self.cleanup_temp_file(image_path)


# ===== MAIN INTERFACE =====

_driver_pool = {
    'gemini': None,
    'chatgpt': None,
    'grok': None,
    'free': None
}

def get_driver(provider='free'):
    """Get or create driver instance"""
    global _driver_pool
    
    if _driver_pool[provider] is None:
        if provider == 'gemini':
            _driver_pool[provider] = GeminiWebAutomation(headless=True)
        elif provider == 'chatgpt':
            _driver_pool[provider] = ChatGPTWebAutomation(headless=True)
        elif provider == 'grok':
            _driver_pool[provider] = GrokWebAutomation(headless=True)
        else:
            _driver_pool[provider] = FreeAIWebAutomation(headless=True)
    
    return _driver_pool[provider]


def analyze_with_selenium(image_base64, provider='auto', query='Phân tích chi tiết hình ảnh sản phẩm này'):
    """
    Main function: Phân tích ảnh bằng Selenium automation
    
    Args:
        image_base64: Base64 encoded image
        provider: 'gemini', 'chatgpt', 'grok', 'blip', 'clip', 'auto'
        query: Text prompt
    
    Returns:
        dict: {
            'success': bool,
            'analysis': str,
            'provider': str,
            'method': 'selenium'
        }
    """
    logger.info(f"🚀 Starting Selenium analysis with provider: {provider}")
    
    try:
        if provider == 'auto':
            # Try free tools first (no auth required)
            providers = ['blip', 'clip']
        else:
            providers = [provider]
        
        for prov in providers:
            try:
                if prov == 'gemini':
                    driver = get_driver('gemini')
                    result = driver.analyze_image(image_base64, query)
                    
                elif prov == 'chatgpt':
                    driver = get_driver('chatgpt')
                    result = driver.analyze_image(image_base64, query)
                    
                elif prov == 'grok':
                    driver = get_driver('grok')
                    result = driver.analyze_image(image_base64, query)
                    
                elif prov == 'blip':
                    driver = get_driver('free')
                    result = driver.analyze_with_blip(image_base64)
                    
                elif prov == 'clip':
                    driver = get_driver('free')
                    result = driver.analyze_with_clip(image_base64)
                
                else:
                    result = {
                        'success': False,
                        'error': f'Unknown provider: {prov}'
                    }
                
                # If success, return immediately
                if result.get('success'):
                    logger.info(f"✅ Analysis successful with {prov}")
                    return result
                else:
                    logger.warning(f"⚠️ Provider {prov} failed: {result.get('error')}")
                    
            except Exception as e:
                logger.error(f"❌ Error with provider {prov}: {e}")
                continue
        
        # All providers failed
        return {
            'success': False,
            'error': 'Tất cả các phương thức web automation đều thất bại',
            'suggestion': 'Khuyến nghị: Sử dụng API trực tiếp thay vì Selenium',
            'details': 'Gemini/ChatGPT/Grok yêu cầu authentication. Free tools có thể không ổn định.'
        }
        
    except Exception as e:
        logger.error(f"❌ Fatal error in analyze_with_selenium: {e}")
        return {
            'success': False,
            'error': str(e)
        }


def cleanup_all_drivers():
    """Đóng tất cả drivers"""
    global _driver_pool
    for provider, driver in _driver_pool.items():
        if driver:
            try:
                driver.close()
            except:
                pass
    _driver_pool = {k: None for k in _driver_pool.keys()}
    logger.info("🧹 All drivers cleaned up")


if __name__ == '__main__':
    # Test
    test_image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    
    result = analyze_with_selenium(test_image, provider='auto')
    print(result)
    
    cleanup_all_drivers()
