import random
import time
import os
import sys

# Update danh sách tên với các tên phổ biến thực tế
first_names = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles",
               "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen",
               "Daniel", "Matthew", "Anthony", "Donald", "Mark", "Paul", "Steven", "Andrew", "Kenneth", "Joshua",
               "Nancy", "Lisa", "Margaret", "Sandra", "Ashley", "Kimberly", "Emily", "Donna", "Michelle", "Carol"]

last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
              "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
              "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson"]

# Các pattern email thực tế
patterns = [
    "first.last",
    "firstlast",
    "flast",
    "firstl",
    "first_last",
    "last.first",
    "first.last.year",
    "first.last.number",
    "firstinitiallast"
]

def clear_screen():
    os.system('clear')

def show_banner():
    print("═" * 60)
    print("          SCAN ALL MAIL BY HUYPC")
    print("═" * 60)

def get_user_choice():
    print("\nChọn loại mail (chọn số):")
    print("1. Gmail (gmail.com)")
    print("2. Outlook/Hotmail (outlook.com, hotmail.com)")
    print("3. Yahoo (yahoo.com)")
    print("4. Apple (icloud.com, me.com)")
    print("5. Tất cả các loại")
    
    while True:
        choice = input("\nNhập lựa chọn (1-5): ").strip()
        if choice in ['1', '2', '3', '4', '5']:
            return choice
        print("Chọn đúng số đi đồ ngu!")

def get_domains(choice):
    domain_map = {
        '1': ['gmail.com'],
        '2': ['outlook.com', 'hotmail.com'],
        '3': ['yahoo.com'],
        '4': ['icloud.com', 'me.com'],
        '5': ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'aol.com']
    }
    return domain_map.get(choice, ['gmail.com'])

def get_quantity():
    while True:
        try:
            qty = input("\nNhập số lượng mail cần scan (100-10000): ").strip()
            qty = int(qty)
            if 100 <= qty <= 10000:
                return qty
            print("Nhập số từ 100 đến 10000 thằng chó!")
        except:
            print("Nhập số nguyên đi đồ ngu!")

def generate_realistic_email(first, last, domain):
    year = random.choice(['', '87', '92', '95', '98', '01', '04', '08'])
    number = random.choice(['', str(random.randint(1, 99)), str(random.randint(1970, 2005))])
    
    pattern = random.choice(patterns)
    
    if pattern == "first.last":
        email = f"{first.lower()}.{last.lower()}"
    elif pattern == "firstlast":
        email = f"{first.lower()}{last.lower()}"
    elif pattern == "flast":
        email = f"{first[0].lower()}{last.lower()}"
    elif pattern == "firstl":
        email = f"{first.lower()}{last[0].lower()}"
    elif pattern == "first_last":
        email = f"{first.lower()}_{last.lower()}"
    elif pattern == "last.first":
        email = f"{last.lower()}.{first.lower()}"
    elif pattern == "first.last.year":
        email = f"{first.lower()}.{last.lower()}{year}"
    elif pattern == "first.last.number":
        email = f"{first.lower()}.{last.lower()}{number}"
    elif pattern == "firstinitiallast":
        email = f"{first[0].lower()}{last.lower()}"
    
    # Thêm số ngẫu nhiên 30% trường hợp
    if random.random() < 0.3 and not number:
        email += str(random.randint(2, 99))
    
    return f"{email}@{domain}"

def generate_realistic_password():
    # Tạo password có vẻ thực tế
    base_words = ["password", "letmein", "football", "iloveyou", "monkey", "dragon", "baseball", "trustno1"]
    numbers = ["123", "1234", "12345", "123456", "111", "222", "999"]
    special = ["!", "@", "#", "$", "&"]
    
    password_type = random.random()
    
    if password_type < 0.4:  # 40% password đơn giản
        return random.choice(base_words) + random.choice(numbers)
    elif password_type < 0.7:  # 30% password phức tạp hơn
        word = random.choice(base_words)
        return word.capitalize() + random.choice(numbers) + random.choice(special)
    else:  # 30% random hoàn toàn
        chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%"
        return ''.join(random.choice(chars) for _ in range(random.randint(8, 12)))

def scan_email(email, password, delay=True):
    """Giả lập quá trình scan với độ trễ thực tế"""
    # Độ trễ ngẫu nhiên từ 0.5 đến 3 giây
    if delay:
        scan_time = random.uniform(0.5, 3.0)
        time.sleep(scan_time)
    
    # Tỷ lệ thành công giả (70% thành công, 30% thất bại)
    success = random.random() < 0.7
    
    if success:
        status = "✅ VALID"
        return True, status
    else:
        # Các loại lỗi thực tế
        errors = ["❌ INVALID", "❌ WRONG PASS", "❌ ACCOUNT LOCKED", "❌ NOT FOUND", "❌ TIMEOUT"]
        status = random.choice(errors)
        return False, status

def main():
    clear_screen()
    show_banner()
    
    print("Phiên bản: 2.0 - Realistic Email Scanner")
    print("Chú ý: Tool này chỉ dùng cho mục đích nghiên cứu!\n")
    
    # Chọn loại mail
    choice = get_user_choice()
    domains = get_domains(choice)
    
    # Nhập số lượng
    quantity = get_quantity()
    
    # Chọn chế độ
    print("\nChọn chế độ scan:")
    print("1. Chậm (an toàn, ít nghi ngờ)")
    print("2. Trung bình")
    print("3. Nhanh (có thể bị block)")
    
    mode_choice = input("Chọn chế độ (1-3): ").strip()
    if mode_choice == '1':
        delay_range = (1.0, 4.0)
    elif mode_choice == '2':
        delay_range = (0.5, 2.0)
    else:
        delay_range = (0.1, 0.8)
    
    # Xác nhận
    print(f"\n═" * 50)
    print(f"Loại mail: {', '.join(domains)}")
    print(f"Số lượng cần scan: {quantity}")
    print(f"Chế độ: {'Chậm' if mode_choice == '1' else 'Trung bình' if mode_choice == '2' else 'Nhanh'}")
    print(f"═" * 50)
    
    confirm = input("\nBắt đầu scan? (y/n): ").lower()
    if confirm != 'y':
        print("Hủy bỏ thao tác!")
        return
    
    # Bắt đầu scan
    clear_screen()
    show_banner()
    print(f"\nĐang scan {quantity} địa chỉ email...")
    print("─" * 80)
    
    scanned = 0
    valid_count = 0
    filename = "valid_emails.txt"
    log_filename = "scan_log.txt"
    
    start_time = time.time()
    
    with open(filename, "w", encoding="utf-8") as valid_file, \
         open(log_filename, "w", encoding="utf-8") as log_file:
        
        log_file.write(f"Email Scanner Log - Started at {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
        log_file.write(f"Target: {quantity} emails | Domains: {', '.join(domains)}\n")
        log_file.write("="*60 + "\n")
        
        while scanned < quantity:
            first = random.choice(first_names)
            last = random.choice(last_names)
            domain = random.choice(domains)
            
            email = generate_realistic_email(first, last, domain)
            password = generate_realistic_password()
            
            # Scan từng email một
            is_valid, status = scan_email(email, password, delay=(mode_choice != '3'))
            
            # Hiển thị kết quả
            elapsed = time.time() - start_time
            speed = scanned / elapsed if elapsed > 0 else 0
            
            print(f"[{scanned+1:04d}/{quantity:04d}] {email}")
            print(f"     Pass: {password} | Status: {status} | Speed: {speed:.1f}/sec")
            
            if is_valid:
                valid_file.write(f"{email}:{password}\n")
                valid_file.flush()
                valid_count += 1
            
            # Ghi log
            log_file.write(f"{email}:{password} | {status} | {time.strftime('%H:%M:%S')}\n")
            log_file.flush()
            
            scanned += 1
            
            # Hiển thị progress mỗi 10 dòng
            if scanned % 10 == 0:
                percent = (scanned / quantity) * 100
                remaining = quantity - scanned
                est_time = remaining * (sum(delay_range)/2) if mode_choice != '3' else remaining * 0.3
                
                print(f"\n⏳ Progress: {scanned}/{quantity} ({percent:.1f}%)")
                print(f"✅ Valid: {valid_count} | ❌ Invalid: {scanned - valid_count}")
                print(f"⏱️ Thời gian ước tính còn lại: {est_time/60:.1f} phút")
                print("─" * 80)
    
    total_time = time.time() - start_time
    
    print("\n" + "═" * 80)
    print("✅ SCAN HOÀN TẤT!")
    print("═" * 80)
    print(f"Tổng số đã scan: {scanned}")
    print(f"Email hợp lệ: {valid_count}")
    print(f"Email không hợp lệ: {scanned - valid_count}")
    print(f"Tỷ lệ thành công: {(valid_count/scanned)*100:.1f}%")
    print(f"Thời gian thực hiện: {total_time/60:.2f} phút")
    print(f"Tốc độ trung bình: {scanned/total_time:.1f} email/giây")
    print(f"\n📁 File valid emails: {filename}")
    print(f"📁 File log chi tiết: {log_filename}")
    
    # Hiển thị preview 10 email hợp lệ
    print("\nPreview 10 email hợp lệ đầu tiên:")
    print("─" * 60)
    try:
        with open(filename, "r", encoding="utf-8") as f:
            lines = f.readlines()[:10]
            for i, line in enumerate(lines):
                print(f"  {i+1:02d}. {line.strip()}")
    except:
        print("  Không có email hợp lệ nào được tìm thấy.")
    
    print("\n⚠️  Cảnh báo: Đây chỉ là mô phỏng cho mục đích giáo dục!")
    print("⚠️  Không sử dụng cho mục đích bất hợp pháp!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Scan đã bị dừng bởi người dùng!")
    except Exception as e:
        print(f"\n\n💥 Lỗi nghiêm trọng: {str(e)}")
    finally:
        print("\nTool đã kết thúc. Xóa file log để bảo mật!")