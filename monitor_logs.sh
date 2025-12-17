#!/bin/bash
# Monitor Webapp Logs in Real-time

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║          AI PRODUCT ANALYZER - LOG MONITOR                   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Monitoring Options:"
echo "  1️⃣  App Logs        - General application activity"
echo "  2️⃣  Error Logs      - Critical errors only"
echo "  3️⃣  API Logs        - API request/response details"
echo "  4️⃣  Service Logs    - Systemd service logs"
echo "  5️⃣  All Logs        - Everything (verbose)"
echo ""

# Create logs directory if not exists
mkdir -p /home/root/webapp/logs

# Check which logs to show
case "${1:-all}" in
  app)
    echo "📝 Watching: Application Logs"
    tail -f /home/root/webapp/logs/app.log 2>/dev/null || echo "No app logs yet"
    ;;
  error)
    echo "❌ Watching: Error Logs"
    tail -f /home/root/webapp/logs/error.log 2>/dev/null || echo "No error logs yet"
    ;;
  api)
    echo "🔗 Watching: API Logs"
    tail -f /home/root/webapp/logs/api.log 2>/dev/null || echo "No API logs yet"
    ;;
  service)
    echo "⚙️  Watching: Service Logs"
    journalctl -u ai-analyzer.service -f
    ;;
  all)
    echo "📊 Watching: All Logs"
    echo ""
    echo "=== Recent Service Logs ===" 
    journalctl -u ai-analyzer.service --no-pager -n 20
    echo ""
    echo "=== Recent Error Logs ==="
    tail -20 /home/root/webapp/logs/error.log 2>/dev/null || echo "No errors logged"
    echo ""
    echo "=== Recent API Logs ==="
    tail -20 /home/root/webapp/logs/api.log 2>/dev/null || echo "No API logs yet"
    ;;
  *)
    echo "Usage: $0 [app|error|api|service|all]"
    exit 1
    ;;
esac
