// ============================================
// AI Product Analyzer V4 Pro 2025
// Full Integration: Gemini + Grok + OpenAI
// ============================================

// Global State
const state = {
    selectedProvider: 'multi', // Default to Multi-AI
    imageData: null,
    apiKeys: {
        openai: localStorage.getItem('openai_key') || ''
    },
    history: JSON.parse(localStorage.getItem('analysis_history') || '[]'),
    stats: {
        totalAnalyses: parseInt(localStorage.getItem('total_analyses') || '0'),
        avgSpeed: '2.5s'
    }
};

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initEventListeners();
    loadHistory();
    updateStats();
    loadApiKeys();
    
    // Auto-select Multi-AI mode
    selectProvider('multi');
    
    showToast('success', 'Chào mừng!', 'V4 Pro đã sẵn sàng với Gemini + Grok AI');
});

// ============================================
// Particles.js Background
// ============================================
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

// ============================================
// Event Listeners
// ============================================
function initEventListeners() {
    // Provider selection
    document.querySelectorAll('.provider-select').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const provider = e.currentTarget.dataset.provider;
            selectProvider(provider);
        });
    });
    
    // Upload area
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const selectFileBtn = document.getElementById('selectFileBtn');
    
    uploadArea.addEventListener('click', () => imageInput.click());
    selectFileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        imageInput.click();
    });
    
    imageInput.addEventListener('change', handleImageSelect);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#667eea';
    });
    
    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageFile(files[0]);
        }
    });
    
    // Analyze button
    document.getElementById('analyzeBtn').addEventListener('click', analyzeImage);
    
    // Remove image button
    document.getElementById('removeImageBtn').addEventListener('click', removeImage);
    
    // Clear history
    document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

// ============================================
// Provider Selection
// ============================================
function selectProvider(provider) {
    state.selectedProvider = provider;
    
    // Update UI
    document.querySelectorAll('.provider-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`.provider-card[data-provider="${provider}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Show/hide API key section for OpenAI
    const apiKeySection = document.getElementById('apiKeySection');
    if (provider === 'openai') {
        apiKeySection.style.display = 'block';
    } else {
        apiKeySection.style.display = 'none';
    }
    
    showToast('info', 'Provider đã chọn', `Đã chuyển sang ${getProviderName(provider)}`);
}

function getProviderName(provider) {
    const names = {
        'gemini': 'Google Gemini',
        'grok': 'xAI Grok',
        'multi': 'Multi-AI Mode',
        'openai': 'OpenAI GPT-4'
    };
    return names[provider] || provider;
}

// ============================================
// Image Handling
// ============================================
function handleImageSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleImageFile(file);
    }
}

function handleImageFile(file) {
    if (!file.type.startsWith('image/')) {
        showToast('error', 'Lỗi', 'Vui lòng chọn file hình ảnh');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        showToast('error', 'Lỗi', 'File quá lớn (tối đa 10MB)');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        state.imageData = e.target.result;
        displayImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
}

function displayImagePreview(dataUrl) {
    document.getElementById('uploadArea').style.display = 'none';
    document.getElementById('imagePreviewContainer').style.display = 'block';
    document.getElementById('imagePreview').src = dataUrl;
    showToast('success', 'Thành công', 'Đã tải lên hình ảnh');
}

function removeImage() {
    state.imageData = null;
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('imagePreviewContainer').style.display = 'none';
    document.getElementById('imageInput').value = '';
}

// ============================================
// Analysis Functions
// ============================================
async function analyzeImage() {
    if (!state.imageData) {
        showToast('error', 'Lỗi', 'Vui lòng chọn hình ảnh trước');
        return;
    }
    
    // Validate API key for OpenAI
    if (state.selectedProvider === 'openai') {
        const openaiKey = document.getElementById('openaiKey').value.trim();
        if (!openaiKey) {
            showToast('error', 'Lỗi', 'Vui lòng nhập OpenAI API Key');
            return;
        }
        state.apiKeys.openai = openaiKey;
        localStorage.setItem('openai_key', openaiKey);
    }
    
    showLoading('Đang phân tích hình ảnh...', 'AI đang xử lý, vui lòng đợi');
    
    try {
        let results;
        const startTime = Date.now();
        
        switch (state.selectedProvider) {
            case 'gemini':
                results = await analyzeWithGemini();
                break;
            case 'grok':
                results = await analyzeWithGrok();
                break;
            case 'multi':
                results = await analyzeWithMultiAI();
                break;
            case 'openai':
                results = await analyzeWithOpenAI();
                break;
            default:
                throw new Error('Provider không hợp lệ');
        }
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        
        hideLoading();
        displayResults(results);
        saveToHistory(results, duration);
        updateStats();
        
        showToast('success', 'Hoàn thành!', `Phân tích xong trong ${duration}s`);
    } catch (error) {
        hideLoading();
        console.error('Analysis error:', error);
        showToast('error', 'Lỗi phân tích', error.message || 'Đã xảy ra lỗi');
    }
}

// ============================================
// API Calls
// ============================================
async function analyzeWithGemini() {
    const response = await fetch('/api/gemini-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            image: state.imageData,
            useServerKey: true
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gemini API lỗi');
    }
    
    const data = await response.json();
    return {
        provider: 'gemini',
        analysis: data.analysis,
        model: data.model
    };
}

async function analyzeWithGrok() {
    const response = await fetch('/api/grok-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            image: state.imageData,
            query: 'Phân tích chi tiết hình ảnh sản phẩm này bằng tiếng Việt',
            useServerKey: true
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Grok API lỗi');
    }
    
    const data = await response.json();
    return {
        provider: 'grok',
        analysis: data.analysis,
        model: data.model
    };
}

async function analyzeWithMultiAI() {
    const response = await fetch('/api/multi-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            image: state.imageData,
            providers: ['gemini', 'grok']
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Multi-AI lỗi');
    }
    
    const data = await response.json();
    return {
        provider: 'multi',
        results: data.results
    };
}

async function analyzeWithOpenAI() {
    const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            apiKey: state.apiKeys.openai,
            image: state.imageData
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'OpenAI API lỗi');
    }
    
    const data = await response.json();
    return {
        provider: 'openai',
        analysis: data.analysis,
        model: data.model
    };
}

// ============================================
// Results Display
// ============================================
function displayResults(results) {
    const resultsSection = document.getElementById('resultsSection');
    const resultsContainer = document.getElementById('resultsContainer');
    
    resultsContainer.innerHTML = '';
    resultsSection.style.display = 'block';
    
    if (results.provider === 'multi') {
        // Multi-AI results
        Object.entries(results.results).forEach(([provider, result]) => {
            if (result.error) {
                resultsContainer.innerHTML += createErrorCard(provider, result.error);
            } else {
                resultsContainer.innerHTML += createResultCard(provider, result.analysis, result.model);
            }
        });
    } else {
        // Single provider result
        resultsContainer.innerHTML = createResultCard(
            results.provider,
            results.analysis,
            results.model
        );
    }
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function createResultCard(provider, analysis, model) {
    const providerNames = {
        'gemini': 'Google Gemini',
        'grok': 'xAI Grok',
        'openai': 'OpenAI GPT-4'
    };
    
    return `
        <div class="result-card">
            <div class="result-header">
                <span class="provider-tag ${provider}">
                    <i class="fas fa-robot"></i>
                    ${providerNames[provider] || provider}
                </span>
                <span style="color: var(--text-muted); font-size: 0.85rem;">
                    ${model || ''}
                </span>
            </div>
            <div class="result-content">${formatAnalysis(analysis)}</div>
        </div>
    `;
}

function createErrorCard(provider, error) {
    const providerNames = {
        'gemini': 'Google Gemini',
        'grok': 'xAI Grok',
        'openai': 'OpenAI GPT-4'
    };
    
    return `
        <div class="result-card" style="border-color: var(--accent-danger);">
            <div class="result-header">
                <span class="provider-tag ${provider}">
                    <i class="fas fa-exclamation-triangle"></i>
                    ${providerNames[provider] || provider}
                </span>
            </div>
            <div class="result-content" style="color: var(--accent-danger);">
                ❌ Lỗi: ${error}
            </div>
        </div>
    `;
}

function formatAnalysis(text) {
    // Format the analysis text with better readability
    return text
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

// ============================================
// History Management
// ============================================
function saveToHistory(results, duration) {
    const historyItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        provider: state.selectedProvider,
        results: results,
        duration: duration,
        image: state.imageData
    };
    
    state.history.unshift(historyItem);
    
    // Keep only last 20 items
    if (state.history.length > 20) {
        state.history = state.history.slice(0, 20);
    }
    
    localStorage.setItem('analysis_history', JSON.stringify(state.history));
    state.stats.totalAnalyses++;
    localStorage.setItem('total_analyses', state.stats.totalAnalyses.toString());
    
    loadHistory();
}

function loadHistory() {
    const historyGrid = document.getElementById('historyGrid');
    
    if (state.history.length === 0) {
        historyGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>Chưa có lịch sử phân tích</p>
            </div>
        `;
        return;
    }
    
    historyGrid.innerHTML = state.history.map(item => `
        <div class="history-card" style="
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: var(--spacing-md);
            cursor: pointer;
            transition: all 0.3s ease;
        " onclick="viewHistoryItem(${item.id})">
            <img src="${item.image}" alt="History" style="
                width: 100%;
                height: 150px;
                object-fit: cover;
                border-radius: 8px;
                margin-bottom: var(--spacing-sm);
            ">
            <div style="font-size: 0.9rem; color: var(--text-secondary);">
                <i class="fas fa-calendar"></i>
                ${new Date(item.timestamp).toLocaleDateString('vi-VN')}
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
                <i class="fas fa-clock"></i>
                ${item.duration}s
            </div>
        </div>
    `).join('');
}

function clearHistory() {
    if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử?')) {
        state.history = [];
        localStorage.setItem('analysis_history', '[]');
        loadHistory();
        showToast('success', 'Đã xóa', 'Lịch sử đã được xóa');
    }
}

function viewHistoryItem(id) {
    const item = state.history.find(h => h.id === id);
    if (item) {
        displayResults(item.results);
        showToast('info', 'Lịch sử', 'Đã tải lại kết quả phân tích');
    }
}

// ============================================
// UI Helpers
// ============================================
function showLoading(text, subtext) {
    const overlay = document.getElementById('loadingOverlay');
    document.getElementById('loadingText').textContent = text;
    document.getElementById('loadingSubtext').textContent = subtext;
    overlay.classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function updateStats() {
    document.getElementById('analysisCount').textContent = state.stats.totalAnalyses;
}

function loadApiKeys() {
    const openaiKey = localStorage.getItem('openai_key');
    if (openaiKey) {
        document.getElementById('openaiKey').value = openaiKey;
    }
}

function toggleKeyVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = event.target;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const icon = document.querySelector('#themeToggle i');
    
    if (document.body.classList.contains('light-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
}

// ============================================
// Service Worker (Optional - for PWA)
// ============================================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
        // Silent fail if service worker not available
    });
}

