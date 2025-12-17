#!/bin/bash

# AI Product Image Analyzer - Flask Server Startup Script

echo "╔═══════════════════════════════════════════════╗"
echo "║  🎨 AI Product Image Analyzer V3             ║"
echo "║  Flask Server Setup                          ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found! Please install Python 3.8+"
    exit 1
fi

echo "✅ Python3 found: $(python3 --version)"

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 not found! Please install pip3"
    exit 1
fi

echo "✅ pip3 found"

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    pip3 install -r requirements.txt -q
    echo "✅ Dependencies installed"
else
    echo "⚠️  requirements.txt not found, skipping dependency installation"
fi

# Load environment variables if .env exists
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Environment variables loaded from .env"
fi

# Set default values
PORT=${PORT:-5000}
HOST=${HOST:-0.0.0.0}

echo ""
echo "🚀 Starting Flask server..."
echo "   Host: $HOST"
echo "   Port: $PORT"
echo ""
echo "🌐 Access URLs:"
echo "   - Local:    http://localhost:$PORT"
echo "   - Network:  http://$HOST:$PORT"
echo "   - V3:       http://$HOST:$PORT/v3.html"
echo "   - Health:   http://$HOST:$PORT/health"
echo ""
echo "⏹️  Press Ctrl+C to stop the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start Flask server
python3 app.py
