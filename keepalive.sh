#!/bin/bash

# Keepalive script for AI Product Analyzer
# Keeps the server running and accessible

SERVER_URL="http://localhost:3000"
PUBLIC_URL="http://14.225.210.195:3000"
LOG_FILE="/home/root/webapp/keepalive.log"

echo "========================================" | tee -a $LOG_FILE
echo "Keepalive Script Started" | tee -a $LOG_FILE
echo "Time: $(date)" | tee -a $LOG_FILE
echo "========================================" | tee -a $LOG_FILE

while true; do
    # Check if server is responding
    if curl -s -f "$SERVER_URL/api/health" > /dev/null 2>&1; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✓ Server is healthy" | tee -a $LOG_FILE
        
        # Also ping keepalive endpoint
        curl -s "$SERVER_URL/keepalive" > /dev/null 2>&1
    else
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✗ Server not responding! Attempting restart..." | tee -a $LOG_FILE
        
        # Kill existing node processes
        killall node 2>/dev/null
        
        # Wait a moment
        sleep 2
        
        # Restart server
        cd /home/root/webapp
        nohup node index.js > server.log 2>&1 &
        
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] ↻ Server restarted" | tee -a $LOG_FILE
        
        # Wait for server to start
        sleep 5
    fi
    
    # Wait 30 seconds before next check
    sleep 30
done
