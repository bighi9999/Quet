"""
AI Web Automation Module
Sử dụng Selenium để tự động truy cập các trang web AI và lấy kết quả phân tích
"""

import os
import time
import base64
import tempfile
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

class AIWebAutomation:
    def __init__(self, headless=True):
        """Initialize Chrome driver với headless mode"""
        self.headless = headless
        self.driver = None
        
    def setup_driver(self):
        """Thiết lập Chrome driver"""
        chrome_options = Options()
        
        if self.headless:
            chrome_options.add_argument('--headless=new')
        
        # Thêm các options để tối ưu
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        # User agent
        chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
        
        # Khởi tạo driver
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        
        # Remove webdriver flag
        self.driver.execute_cdp_cmd('Page.addScriptToEvaluateOnNewDocument', {
            'source': '''
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => undefined
                })
            '''
        })
        
        return self.driver
    
    def save_image_temp(self, base64_image):
        """Lưu base64 image vào file tạm"""
        # Remove data:image prefix if exists
        if ',' in base64_image:
            base64_image = base64_image.split(',')[1]
        
        # Decode and save
        image_data = base64.b64decode(base64_image)
        
        # Create temp file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.png')
        temp_file.write(image_data)
        temp_file.close()
        
        return temp_file.name
    
    def analyze_with_gemini_web(self, image_base64, query="Phân tích chi tiết hình ảnh sản phẩm này"):
        """
        Phân tích ảnh bằng cách truy cập Google AI Studio hoặc Gemini Web Demo
        LƯU Ý: Đây là demo concept. Trong thực tế cần API chính thức.
        """
        try:
            if not self.driver:
                self.setup_driver()
            
            # Vì Google Gemini web interface yêu cầu authentication phức tạp,
            # ta sẽ sử dụng một giải pháp khác: Gửi request trực tiếp đến API public
            # hoặc sử dụng các alternative web services
            
            result = {
                'success': False,
                'analysis': 'Selenium web automation đang được phát triển. Hiện tại sử dụng API trực tiếp.',
                'provider': 'gemini-web',
                'method': 'selenium'
            }
            
            return result
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'provider': 'gemini-web'
            }
    
    def analyze_with_huggingface_demo(self, image_base64, model='Salesforce/blip-image-captioning-large'):
        """
        Sử dụng Hugging Face Spaces demos (miễn phí, không cần auth)
        """
        try:
            if not self.driver:
                self.setup_driver()
            
            # Save image to temp file
            image_path = self.save_image_temp(image_base64)
            
            # Navigate to Hugging Face Space
            space_url = f"https://huggingface.co/spaces/{model}"
            self.driver.get(space_url)
            
            # Wait for page load
            time.sleep(5)
            
            # Find and upload image
            try:
                file_input = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='file']"))
                )
                file_input.send_keys(image_path)
                
                # Wait for result
                time.sleep(8)
                
                # Extract result (specific to each space)
                result_element = self.driver.find_element(By.CSS_SELECTOR, ".output-text")
                analysis = result_element.text
                
                # Clean up temp file
                os.unlink(image_path)
                
                return {
                    'success': True,
                    'analysis': analysis,
                    'provider': 'huggingface',
                    'model': model
                }
                
            except Exception as inner_e:
                # Clean up temp file
                if os.path.exists(image_path):
                    os.unlink(image_path)
                raise inner_e
                
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'provider': 'huggingface'
            }
    
    def analyze_with_free_ocr(self, image_base64):
        """
        Sử dụng các free OCR/Image analysis web services
        """
        try:
            if not self.driver:
                self.setup_driver()
            
            # Save image
            image_path = self.save_image_temp(image_base64)
            
            # Navigate to free OCR service (example: https://www.onlineocr.net/)
            self.driver.get("https://www.onlineocr.net/")
            
            time.sleep(3)
            
            # Upload image
            file_input = self.driver.find_element(By.ID, "file")
            file_input.send_keys(image_path)
            
            # Click convert button
            convert_btn = self.driver.find_element(By.ID, "convert")
            convert_btn.click()
            
            # Wait for result
            time.sleep(10)
            
            # Extract text
            result_text = self.driver.find_element(By.ID, "output").text
            
            # Clean up
            os.unlink(image_path)
            
            return {
                'success': True,
                'analysis': f"Phân tích OCR:\n{result_text}",
                'provider': 'free-ocr'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'provider': 'free-ocr'
            }
    
    def close(self):
        """Đóng driver"""
        if self.driver:
            self.driver.quit()
            self.driver = None

# Singleton instance
_automation_instance = None

def get_automation_instance():
    """Get or create automation instance"""
    global _automation_instance
    if _automation_instance is None:
        _automation_instance = AIWebAutomation(headless=True)
    return _automation_instance

def analyze_image_web(image_base64, provider='auto'):
    """
    Main function để phân tích ảnh qua web automation
    """
    automation = get_automation_instance()
    
    try:
        if provider == 'huggingface' or provider == 'auto':
            # Try HuggingFace first (most reliable free option)
            result = automation.analyze_with_huggingface_demo(image_base64)
            if result.get('success'):
                return result
        
        if provider == 'ocr' or provider == 'auto':
            # Fallback to OCR
            result = automation.analyze_with_free_ocr(image_base64)
            if result.get('success'):
                return result
        
        # If all fail, return error
        return {
            'success': False,
            'error': 'Không thể phân tích qua web automation',
            'suggestion': 'Sử dụng API trực tiếp thay vì web scraping'
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

