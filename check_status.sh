#!/bin/bash
echo "================================================"
echo "🔍 WEBAPP V6.0.0 - QUICK STATUS CHECK"
echo "================================================"
echo ""

echo "1️⃣ Service Status:"
systemctl is-active ai-analyzer.service && echo "   ✅ Flask service RUNNING" || echo "   ❌ Flask service STOPPED"
echo ""

echo "2️⃣ Port Check:"
netstat -tlnp | grep 5000 > /dev/null && echo "   ✅ Port 5000 LISTENING" || echo "   ❌ Port 5000 NOT LISTENING"
echo ""

echo "3️⃣ Public Access:"
curl -s -o /dev/null -w "%{http_code}" http://14.225.210.195:5000/ | grep 200 > /dev/null && echo "   ✅ Public URL ACCESSIBLE" || echo "   ❌ Public URL FAILED"
echo ""

echo "4️⃣ API Endpoints:"
curl -s http://127.0.0.1:5000/api/supported-types > /dev/null && echo "   ✅ API endpoints WORKING" || echo "   ❌ API endpoints FAILED"
echo ""

echo "5️⃣ Selenium Check:"
SELENIUM_COUNT=$(grep -r "selenium" /home/root/webapp/ --include="*.py" --include="*.js" --include="*.html" 2>/dev/null | wc -l)
if [ "$SELENIUM_COUNT" -eq 0 ]; then
    echo "   ✅ NO Selenium found (Clean)"
else
    echo "   ⚠️  Found $SELENIUM_COUNT Selenium references"
fi
echo ""

echo "================================================"
echo "🌐 Main URL: http://14.225.210.195:5000"
echo "📚 GitHub: https://github.com/bighi9999/Quet"
echo "================================================"
