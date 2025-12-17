/**
 * AI Product Analyzer - Frontend Application
 */

// State
let state = {
    selectedImage: null,
    imageData: null,
    currentMode: 'prompt'
};

// DOM Elements
const elements = {
    // Mode Switching
    modeBtns: document.querySelectorAll('.mode-btn'),
    promptMode: document.getElementById('prompt-mode'),
    analyzeMode: document.getElementById('analyze-mode'),
    
    // Image Upload
    dropZone: document.getElementById('drop-zone'),
    imageInput: document.getElementById('image-input'),
    browseBtn: document.getElementById('browse-btn'),
    previewContainer: document.getElementById('preview-container'),
    previewImage: document.getElementById('preview-image'),
    clearImageBtn: document.getElementById('clear-image'),
    
    // Form
    audienceInput: document.getElementById('audience-input'),
    charCount: document.getElementById('char-count'),
    generatorOptions: document.querySelectorAll('.generator-option'),
    generateBtn: document.getElementById('generate-btn'),
    
    // Loading & Results
    loadingState: document.getElementById('loading-state'),
    progressFill: document.getElementById('progress-fill'),
    resultsContainer: document.getElementById('results-container')
};

// ============================================
// Mode Switching
// ============================================

elements.modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        switchMode(mode);
    });
});

function switchMode(mode) {
    state.currentMode = mode;
    
    // Update buttons
    elements.modeBtns.forEach(btn => {
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update content
    if (mode === 'prompt') {
        elements.promptMode.classList.add('active');
        elements.analyzeMode.classList.remove('active');
    } else {
        elements.promptMode.classList.remove('active');
        elements.analyzeMode.classList.add('active');
    }
}

// ============================================
// Image Upload
// ============================================

// Click to browse
elements.browseBtn.addEventListener('click', () => {
    elements.imageInput.click();
});

elements.dropZone.addEventListener('click', (e) => {
    if (e.target === elements.dropZone || e.target.closest('.upload-icon')) {
        elements.imageInput.click();
    }
});

// File input change
elements.imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImageFile(file);
    }
});

// Drag and drop
elements.dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    elements.dropZone.classList.add('drag-over');
});

elements.dropZone.addEventListener('dragleave', () => {
    elements.dropZone.classList.remove('drag-over');
});

elements.dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    elements.dropZone.classList.remove('drag-over');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImageFile(file);
    } else {
        showError('Vui lòng chọn file hình ảnh hợp lệ');
    }
});

// Clear image
elements.clearImageBtn.addEventListener('click', () => {
    clearImage();
});

function handleImageFile(file) {
    // Validate file size
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        showError('Kích thước file quá lớn. Tối đa 10MB.');
        return;
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        showError('Định dạng không hợp lệ. Chỉ chấp nhận JPG, PNG, WebP.');
        return;
    }
    
    state.selectedImage = file;
    
    // Read file
    const reader = new FileReader();
    reader.onload = (e) => {
        state.imageData = e.target.result;
        showPreview(e.target.result);
        elements.generateBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}

function showPreview(dataUrl) {
    elements.previewImage.src = dataUrl;
    elements.dropZone.style.display = 'none';
    elements.previewContainer.style.display = 'block';
}

function clearImage() {
    state.selectedImage = null;
    state.imageData = null;
    elements.imageInput.value = '';
    elements.previewContainer.style.display = 'none';
    elements.dropZone.style.display = 'block';
    elements.generateBtn.disabled = true;
    elements.resultsContainer.style.display = 'none';
}

// ============================================
// Form Handling
// ============================================

// Character counter
elements.audienceInput.addEventListener('input', (e) => {
    const count = e.target.value.length;
    elements.charCount.textContent = count;
});

// Generator selection
elements.generatorOptions.forEach(option => {
    option.addEventListener('click', () => {
        elements.generatorOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        option.querySelector('input').checked = true;
    });
});

// Generate button
elements.generateBtn.addEventListener('click', () => {
    generatePrompt();
});

// ============================================
// API Calls
// ============================================

async function generatePrompt() {
    if (!state.imageData) {
        showError('Vui lòng chọn hình ảnh');
        return;
    }
    
    // Get form data
    const targetAudience = elements.audienceInput.value.trim();
    const generator = document.querySelector('input[name="generator"]:checked').value;
    
    // Show loading
    showLoading();
    
    // Simulate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 5;
        if (progress <= 90) {
            elements.progressFill.style.width = `${progress}%`;
        }
    }, 200);
    
    try {
        const response = await fetch('/api/generate-prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: state.imageData,
                targetAudience,
                generator
            })
        });
        
        clearInterval(progressInterval);
        elements.progressFill.style.width = '100%';
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Lỗi khi tạo prompt');
        }
        
        const result = await response.json();
        
        if (result.success) {
            displayResults(result.data);
        } else {
            throw new Error(result.error || 'Không thể tạo prompt');
        }
        
    } catch (error) {
        clearInterval(progressInterval);
        hideLoading();
        showError(error.message);
    }
}

// ============================================
// UI Helpers
// ============================================

function showLoading() {
    elements.generateBtn.disabled = true;
    elements.loadingState.style.display = 'block';
    elements.resultsContainer.style.display = 'none';
    elements.progressFill.style.width = '0%';
}

function hideLoading() {
    elements.generateBtn.disabled = false;
    elements.loadingState.style.display = 'none';
    elements.progressFill.style.width = '0%';
}

function displayResults(data) {
    hideLoading();
    
    const { prompt, negativePrompt, metadata, suggestions, analysis } = data;
    
    const html = `
        <div class="result-header">
            <h3 class="result-title">✅ Prompt đã tạo thành công!</h3>
            <button class="btn-new" onclick="clearImage()">Tạo mới</button>
        </div>
        
        <div class="result-info" style="margin-bottom: 20px; padding: 15px; background: var(--gray-50); border-radius: 10px; font-size: 14px; color: var(--gray-600);">
            <strong>Loại sản phẩm:</strong> ${analysis.productType} | 
            <strong>Màu sắc:</strong> ${analysis.detectedColors.join(', ') || 'N/A'} | 
            <strong>Phong cách:</strong> ${analysis.style}
        </div>
        
        <h4 style="margin-bottom: 10px; color: var(--gray-700); display: flex; align-items: center; gap: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2"/>
            </svg>
            Main Prompt
        </h4>
        <div class="prompt-box">
            <pre class="prompt-text">${prompt}</pre>
            <button class="btn-copy" onclick="copyToClipboard('${escapeHtml(prompt)}', this)">
                📋 Sao chép Prompt
            </button>
        </div>
        
        <h4 style="margin: 25px 0 10px; color: var(--gray-700); display: flex; align-items: center; gap: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="2"/>
            </svg>
            Negative Prompt
        </h4>
        <div class="prompt-box" style="background: #fff5f5; border-color: #fc8181;">
            <pre class="prompt-text">${negativePrompt}</pre>
            <button class="btn-copy" onclick="copyToClipboard('${escapeHtml(negativePrompt)}', this)">
                📋 Sao chép Negative Prompt
            </button>
        </div>
        
        ${suggestions && suggestions.length > 0 ? `
        <div style="margin-top: 25px; padding: 20px; background: #fffaf0; border: 2px solid #fbd38d; border-radius: 12px;">
            <h4 style="margin-bottom: 12px; color: #744210;">💡 Gợi ý biến thể</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${suggestions.map(s => `<li style="padding: 8px 0; border-bottom: 1px solid #fbd38d; color: #744210; font-size: 13px;">${s}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
    `;
    
    elements.resultsContainer.innerHTML = html;
    elements.resultsContainer.style.display = 'block';
    
    // Scroll to results
    elements.resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function copyToClipboard(text, button) {
    // Unescape HTML entities
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    const unescapedText = textarea.value;
    
    navigator.clipboard.writeText(unescapedText).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '✅ Đã sao chép!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        showError('Không thể sao chép. Vui lòng thử lại.');
    });
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/\n/g, '\\n');
}

function showError(message) {
    alert('❌ ' + message);
}

// ============================================
// Initialize
// ============================================

console.log('AI Product Analyzer loaded');

// Check API health on load
fetch('/api/health')
    .then(res => res.json())
    .then(data => {
        console.log('API Health:', data);
        if (data.ai_service === 'unavailable') {
            console.warn('⚠️ Hugging Face AI service not configured');
        }
    })
    .catch(err => {
        console.error('API health check failed:', err);
    });
