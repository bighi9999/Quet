/**
 * AI Product Analyzer V5 - Selenium Edition
 * Hỗ trợ cả Selenium Web Automation và API Mode
 */

// ===== STATE MANAGEMENT =====
const state = {
    mode: 'selenium', // 'selenium' or 'api'
    selectedProvider: 'gemini',
    uploadedImage: null,
    analyzing: false,
    history: JSON.parse(localStorage.getItem('v5_history') || '[]')
};

// ===== SELENIUM LIVE VIEW STATE =====
const seleniumLiveView = {
    actions: [],
    isVisible: false,
    actionCount: 0
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initModeSelector();
    initUpload();
    initAnalyze();
    initSeleniumLiveView();
    loadHistory();
    checkServerStatus();
});

// ===== PARTICLES BACKGROUND =====
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#667eea' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#667eea',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
}

// ===== MODE SELECTOR =====
function initModeSelector() {
    const modeButtons = document.querySelectorAll('.mode-btn');
    
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            switchMode(mode);
            
            // Update UI
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function switchMode(mode) {
    state.mode = mode;
    
    const seleniumInfo = document.getElementById('seleniumInfo');
    const apiInfo = document.getElementById('apiInfo');
    const providerSelection = document.getElementById('providerSelection');
    
    if (mode === 'selenium') {
        seleniumInfo.style.display = 'block';
        apiInfo.style.display = 'none';
        providerSelection.style.display = 'none';
        showToast('✅ Chế độ Selenium - Phân tích miễn phí không cần API key', 'success');
    } else {
        seleniumInfo.style.display = 'none';
        apiInfo.style.display = 'block';
        providerSelection.style.display = 'grid';
        showToast('🔑 Chế độ API - Sử dụng API keys đã cấu hình', 'info');
    }
}

// ===== UPLOAD HANDLING =====
function initUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const removeBtn = document.getElementById('removeBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    uploadBtn.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleFileUpload(file);
    });
    
    // Drag & Drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });
    
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) handleFileUpload(file);
    });
    
    removeBtn.addEventListener('click', () => {
        state.uploadedImage = null;
        document.getElementById('uploadZone').style.display = 'flex';
        document.getElementById('previewContainer').style.display = 'none';
        analyzeBtn.disabled = true;
        fileInput.value = '';
    });
}

function handleFileUpload(file) {
    if (!file.type.startsWith('image/')) {
        showToast('❌ Vui lòng chọn file ảnh', 'error');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        showToast('❌ Ảnh quá lớn. Tối đa 10MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        state.uploadedImage = e.target.result;
        
        // Show preview
        document.getElementById('uploadZone').style.display = 'none';
        const previewContainer = document.getElementById('previewContainer');
        previewContainer.style.display = 'block';
        document.getElementById('imagePreview').src = e.target.result;
        document.getElementById('analyzeBtn').disabled = false;
        
        showToast('✅ Ảnh đã tải lên thành công', 'success');
    };
    reader.readAsDataURL(file);
}

// ===== ANALYZE =====
function initAnalyze() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    analyzeBtn.addEventListener('click', performAnalysis);
    
    // Provider selection (for API mode)
    const providerCards = document.querySelectorAll('.provider-card');
    providerCards.forEach(card => {
        card.addEventListener('click', () => {
            providerCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            state.selectedProvider = card.dataset.provider;
        });
    });
}

async function performAnalysis() {
    if (state.analyzing) return;
    if (!state.uploadedImage) {
        showToast('❌ Vui lòng tải ảnh lên trước', 'error');
        return;
    }
    
    state.analyzing = true;
    
    // Show loading
    document.getElementById('loadingContainer').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('analyzeBtn').disabled = true;
    
    try {
        let result;
        
        if (state.mode === 'selenium') {
            result = await analyzeWithSelenium();
        } else {
            result = await analyzeWithAPI();
        }
        
        displayResults(result);
        saveToHistory(result);
        
    } catch (error) {
        showToast(`❌ Lỗi: ${error.message}`, 'error');
        console.error(error);
    } finally {
        state.analyzing = false;
        document.getElementById('loadingContainer').style.display = 'none';
        document.getElementById('analyzeBtn').disabled = false;
    }
}

// ===== SELENIUM ANALYSIS =====
async function analyzeWithSelenium() {
    updateLoadingText('🤖 Selenium Web Automation', 'Đang tự động truy cập AI web services...');
    
    // Show Selenium Live View steps
    addSeleniumAction('🚀 Bắt đầu Selenium automation...', 'start');
    addSeleniumAction('🔧 Khởi tạo Chrome headless driver...', 'info');
    
    // Simulate step-by-step process
    setTimeout(() => addSeleniumAction('🌐 Đang truy cập Hugging Face Space...', 'navigate'), 1000);
    setTimeout(() => addSeleniumAction('📤 Đang upload hình ảnh lên server...', 'upload'), 2000);
    setTimeout(() => addSeleniumAction('⏳ Chờ AI xử lý hình ảnh...', 'wait'), 4000);
    setTimeout(() => addSeleniumAction('🔍 Đang scrape kết quả từ trang web...', 'scrape'), 6000);
    
    try {
        const response = await fetch('/api/selenium-analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: state.uploadedImage,
                provider: 'auto', // Try BLIP then CLIP
                query: 'Phân tích chi tiết hình ảnh sản phẩm này bằng tiếng Việt'
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            addSeleniumAction(`❌ Lỗi: ${data.error}`, 'error');
            throw new Error(data.error || 'Selenium analysis failed');
        }
        
        addSeleniumAction(`✅ Hoàn tất! Provider: ${data.provider}`, 'success');
        addSeleniumAction(`📊 Model sử dụng: ${data.model || 'unknown'}`, 'info');
        
        return {
            provider: data.provider,
            method: 'selenium',
            model: data.model || 'unknown',
            analysis: data.analysis,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        addSeleniumAction(`❌ Exception: ${error.message}`, 'error');
        throw error;
    }
}

// ===== API ANALYSIS =====
async function analyzeWithAPI() {
    const provider = state.selectedProvider;
    updateLoadingText(`🔑 API Mode - ${provider}`, `Đang phân tích với ${provider} API...`);
    
    let endpoint;
    let payload = { image: state.uploadedImage, useServerKey: true };
    
    switch (provider) {
        case 'gemini':
            endpoint = '/api/gemini-analyze';
            break;
        case 'grok':
            endpoint = '/api/grok-analyze';
            break;
        case 'multi-ai':
            endpoint = '/api/multi-analyze';
            payload.providers = ['gemini', 'grok'];
            break;
        case 'openai':
            endpoint = '/api/analyze';
            const apiKey = prompt('Nhập OpenAI API Key:');
            if (!apiKey) throw new Error('Cần API key để sử dụng OpenAI');
            payload.apiKey = apiKey;
            payload.useServerKey = false;
            break;
        default:
            throw new Error('Unknown provider');
    }
    
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'API analysis failed');
    }
    
    return {
        provider: provider,
        method: 'api',
        model: data.model || 'unknown',
        analysis: data.analysis || formatMultiAIResults(data.results),
        timestamp: new Date().toISOString()
    };
}

function formatMultiAIResults(results) {
    if (!results) return 'No results';
    
    let formatted = '';
    for (const [provider, result] of Object.entries(results)) {
        formatted += `\n\n=== ${provider.toUpperCase()} ===\n${result.analysis || result.error}\n`;
    }
    return formatted;
}

// ===== DISPLAY RESULTS =====
function displayResults(result) {
    const resultsSection = document.getElementById('resultsSection');
    const resultsGrid = document.getElementById('resultsGrid');
    
    resultsGrid.innerHTML = `
        <div class="result-card">
            <div class="result-header">
                <span class="result-provider">${result.provider}</span>
                <span class="result-method">${result.method}</span>
            </div>
            <div class="result-model">${result.model}</div>
            <div class="result-content">${result.analysis}</div>
            <div class="result-footer">
                <span>⏰ ${new Date(result.timestamp).toLocaleString('vi-VN')}</span>
            </div>
        </div>
    `;
    
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    showToast('✅ Phân tích hoàn tất!', 'success');
}

// ===== HISTORY =====
function saveToHistory(result) {
    state.history.unshift({
        ...result,
        image: state.uploadedImage
    });
    
    // Keep only last 10
    if (state.history.length > 10) {
        state.history = state.history.slice(0, 10);
    }
    
    localStorage.setItem('v5_history', JSON.stringify(state.history));
    loadHistory();
}

function loadHistory() {
    const historyList = document.getElementById('historyList');
    
    if (state.history.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #999;">Chưa có lịch sử phân tích</p>';
        return;
    }
    
    historyList.innerHTML = state.history.map((item, index) => `
        <div class="history-item" onclick="loadHistoryItem(${index})">
            <img src="${item.image}" alt="History">
            <div class="history-info">
                <div class="history-provider">${item.provider} (${item.method})</div>
                <div class="history-time">${new Date(item.timestamp).toLocaleString('vi-VN')}</div>
            </div>
        </div>
    `).join('');
}

function loadHistoryItem(index) {
    const item = state.history[index];
    displayResults(item);
    showToast('📜 Đã tải lịch sử', 'info');
}

// ===== UTILITIES =====
function updateLoadingText(title, text) {
    document.getElementById('loadingTitle').textContent = title;
    document.getElementById('loadingText').textContent = text;
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

async function checkServerStatus() {
    try {
        const response = await fetch('/api/config');
        const config = await response.json();
        
        console.log('Server Config:', config);
        
        if (config.selenium) {
            showToast('✅ Selenium automation đã sẵn sàng', 'success');
        } else {
            showToast('⚠️ Selenium không khả dụng, chỉ dùng được API mode', 'warning');
        }
    } catch (error) {
        console.error('Failed to check server status:', error);
    }
}

// ===== SELENIUM LIVE VIEW =====
function initSeleniumLiveView() {
    const toggleBtn = document.getElementById('seleniumToggleBtn');
    const liveView = document.getElementById('seleniumLiveView');
    const closeBtn = document.getElementById('closeSeleniumView');
    const clearBtn = document.getElementById('clearSeleniumLog');
    
    // Toggle visibility
    toggleBtn.addEventListener('click', () => {
        seleniumLiveView.isVisible = !seleniumLiveView.isVisible;
        if (seleniumLiveView.isVisible) {
            liveView.classList.add('active');
            // Reset badge when opening
            document.getElementById('seleniumBadge').textContent = '0';
            seleniumLiveView.actionCount = 0;
        } else {
            liveView.classList.remove('active');
        }
    });
    
    // Close button
    closeBtn.addEventListener('click', () => {
        seleniumLiveView.isVisible = false;
        liveView.classList.remove('active');
    });
    
    // Clear log
    clearBtn.addEventListener('click', () => {
        seleniumLiveView.actions = [];
        updateSeleniumView();
        addSeleniumAction('🗑️ Log đã được xóa', 'info');
    });
}

function addSeleniumAction(text, type = 'info', icon = null) {
    const timestamp = new Date().toLocaleTimeString('vi-VN');
    const action = { text, type, icon, timestamp };
    
    seleniumLiveView.actions.push(action);
    
    // Keep only last 20 actions
    if (seleniumLiveView.actions.length > 20) {
        seleniumLiveView.actions.shift();
    }
    
    updateSeleniumView();
    
    // Update badge if view is hidden
    if (!seleniumLiveView.isVisible) {
        seleniumLiveView.actionCount++;
        document.getElementById('seleniumBadge').textContent = seleniumLiveView.actionCount;
    }
    
    // Show toggle button
    const toggleBtn = document.getElementById('seleniumToggleBtn');
    toggleBtn.classList.add('has-activity');
}

function updateSeleniumView() {
    const viewBody = document.getElementById('seleniumViewBody');
    
    if (seleniumLiveView.actions.length === 0) {
        viewBody.innerHTML = `
            <div class="selenium-action">
                <div class="selenium-action-time">⏰ Chờ hoạt động...</div>
                <div class="selenium-action-text">
                    <span class="selenium-action-icon">💤</span>
                    Selenium sẽ hiển thị các bước thực hiện ở đây.
                </div>
            </div>
        `;
        return;
    }
    
    viewBody.innerHTML = seleniumLiveView.actions.map(action => {
        const iconMap = {
            'start': '🚀',
            'navigate': '🌐',
            'upload': '📤',
            'wait': '⏳',
            'scrape': '🔍',
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        };
        
        const emoji = action.icon || iconMap[action.type] || '•';
        const cssClass = action.type === 'error' ? 'error' : 
                        action.type === 'warning' ? 'warning' : '';
        
        return `
            <div class="selenium-action ${cssClass}">
                <div class="selenium-action-time">⏰ ${action.timestamp}</div>
                <div class="selenium-action-text">
                    <span class="selenium-action-icon">${emoji}</span>
                    ${action.text}
                </div>
            </div>
        `;
    }).reverse().join('');
    
    // Auto scroll to top (newest)
    viewBody.scrollTop = 0;
}

function showSeleniumSteps(steps) {
    // Show predefined steps for Selenium automation
    const stepMessages = {
        'init': '🔧 Khởi tạo Chrome headless driver...',
        'navigate': '🌐 Đang truy cập trang web AI...',
        'upload': '📤 Đang upload hình ảnh...',
        'process': '⚙️ AI đang xử lý hình ảnh...',
        'scrape': '🔍 Đang lấy kết quả phân tích...',
        'complete': '✅ Hoàn tất! Đang trả kết quả về webapp...'
    };
    
    let delay = 0;
    steps.forEach((step, index) => {
        setTimeout(() => {
            addSeleniumAction(stepMessages[step] || step, step === 'complete' ? 'success' : 'info');
        }, delay);
        delay += 1000; // 1s between each step
    });
}

// ===== GLOBAL FUNCTIONS =====
window.loadHistoryItem = loadHistoryItem;
window.addSeleniumAction = addSeleniumAction;
window.showSeleniumSteps = showSeleniumSteps;
