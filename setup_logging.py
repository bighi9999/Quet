"""
Setup comprehensive logging system for AI Product Analyzer
"""
import os
import sys
import logging
from logging.handlers import RotatingFileHandler
from datetime import datetime

# Create logs directory
logs_dir = '/home/root/webapp/logs'
os.makedirs(logs_dir, exist_ok=True)

# Configure logging formats
log_format = logging.Formatter(
    '%(asctime)s | %(levelname)-8s | %(name)-20s | %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

# Main application log
app_log_file = os.path.join(logs_dir, 'app.log')
app_handler = RotatingFileHandler(
    app_log_file,
    maxBytes=10*1024*1024,  # 10MB
    backupCount=5
)
app_handler.setFormatter(log_format)
app_handler.setLevel(logging.INFO)

# Error log
error_log_file = os.path.join(logs_dir, 'error.log')
error_handler = RotatingFileHandler(
    error_log_file,
    maxBytes=10*1024*1024,  # 10MB
    backupCount=5
)
error_handler.setFormatter(log_format)
error_handler.setLevel(logging.ERROR)

# API activity log
api_log_file = os.path.join(logs_dir, 'api.log')
api_handler = RotatingFileHandler(
    api_log_file,
    maxBytes=10*1024*1024,  # 10MB
    backupCount=5
)
api_handler.setFormatter(log_format)
api_handler.setLevel(logging.DEBUG)

# Console handler
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(log_format)
console_handler.setLevel(logging.INFO)

# Configure root logger
logging.basicConfig(
    level=logging.DEBUG,
    handlers=[app_handler, error_handler, console_handler]
)

# Create logger for different components
def get_logger(name):
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)
    return logger

# API logger
api_logger = logging.getLogger('api')
api_logger.addHandler(api_handler)
api_logger.setLevel(logging.DEBUG)

print(f"✅ Logging configured:")
print(f"   📝 App Log: {app_log_file}")
print(f"   ❌ Error Log: {error_log_file}")
print(f"   🔗 API Log: {api_log_file}")
