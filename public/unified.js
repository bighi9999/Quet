// AI Product Analyzer - Unified Platform JavaScript
console.log('AI Product Analyzer - Unified Platform loaded');

// State
let currentMode = 'prompt';
let selectedProvider = null;
let promptImageData = null;
let analyzeImageData = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initModeSelector();
    initPromptMode();
    initAnalyzeMode();
    initModals();
    checkAPIHealth();
});

// Mode Selector
function initModeSelector() {
    const modeBtns = document.querySelectorAll('.mode-btn');
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            switchMode(mode);
        });
    });
}

function switchMode(mode) {
    currentMode = mode;
    
    // Update buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    // Update content
    document.querySelectorAll('.mode-content').forEach(content => {
        content.classList.toggle('active', content.id === `${mode}-mode`);
    });
}

// Prompt Mode
function initPromptMode() {
    const input = document.getElementById('prompt-image-input');
    const dropZone = document.getElementById('prompt-drop-zone');
    const browseBtn = document.getElementById('prompt-browse-btn');
    const clearBtn = document.getElementById('prompt-clear-image');
    const generateBtn = document.getElementById('prompt-generate-btn');
    const audienceInput = document.getElementById('prompt-audience-input');
    const charCount = document.getElementById('prompt-char-count');
    
    // Upload handlers
    browseBtn.addEventListener('click', () => input.click());
    input.addEventListener('change', (e) => handlePromptImageSelect(e.target.files[0]));
    
    // Drag & drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length) {
            handlePromptImageSelect(e.dataTransfer.files[0]);
        }
    });
    
    clearBtn.addEventListener('click', () => clearPromptImage());
    generateBtn.addEventListener('click', () => generatePrompt());
    
    // Char counter
    audienceInput.addEventListener('input', () => {
        charCount.textContent = audienceInput.value.length;
    });
}

function handlePromptImageSelect(file) {
    if (!file || !file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        promptImageData = e.target.result;
        document.getElementById('prompt-preview-image').src = promptImageData;
        document.getElementById('prompt-drop-zone').style.display = 'none';
        document.getElementById('prompt-preview-container').style.display = 'block';
        document.getElementById('prompt-generate-btn').disabled = false;
    };
    reader.readAsDataURL(file);
}

function clearPromptImage() {
    promptImageData = null;
    document.getElementById('prompt-drop-zone').style.display = 'block';
    document.getElementById('prompt-preview-container').style.display = 'none';
    document.getElementById('prompt-generate-btn').disabled = true;
    document.getElementById('prompt-image-input').value = '';
}

async function generatePrompt() {
    const audience = document.getElementById('prompt-audience-input').value;
    const loading = document.getElementById('prompt-loading');
    const results = document.getElementById('prompt-results');
    const progress = document.getElementById('prompt-progress-fill');
    
    // Show loading
    loading.style.display = 'block';
    results.style.display = 'none';
    
    // Simulate progress
    let progressValue = 0;
    const progressInterval = setInterval(() => {
        progressValue += 10;
        progress.style.width = `${Math.min(progressValue, 90)}%`;
        
        // Update steps
        if (progressValue >= 30) {
            document.querySelector('.step[data-step="1"]').classList.add('active');
        }
        if (progressValue >= 60) {
            document.querySelector('.step[data-step="2"]').classList.add('active');
        }
    }, 500);
    
    try {
        const response = await fetch('/api/generate-prompt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: promptImageData,
                targetAudience: audience,
                generator: 'stable-diffusion' // Will use all models in backend
            })
        });
        
        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.json();
        
        // Complete progress
        clearInterval(progressInterval);
        progress.style.width = '100%';
        document.querySelector('.step[data-step="3"]').classList.add('active');
        
        setTimeout(() => {
            loading.style.display = 'none';
            displayPromptResults(data);
        }, 500);
        
    } catch (error) {
        clearInterval(progressInterval);
        loading.style.display = 'none';
        alert('Error: ' + error.message);
    }
}

function displayPromptResults(data) {
    const container = document.getElementById('prompt-results');
    
    container.innerHTML = `
        <h3 style="margin-bottom: 20px;"><i class="fas fa-check-circle" style="color: var(--success);"></i> Kết quả tạo prompt</h3>
        
        <div style="background: var(--bg-hover); padding: 20px; border-radius: var(--border-radius); margin-bottom: 16px;">
            <h4 style="margin-bottom: 12px;">📊 Product Analysis</h4>
            <p><strong>Type:</strong> ${data.analysis?.productType || 'N/A'}</p>
            <p><strong>Style:</strong> ${data.analysis?.style || 'N/A'}</p>
            <p><strong>Colors:</strong> ${data.analysis?.colors?.join(', ') || 'N/A'}</p>
        </div>
        
        <div style="background: var(--bg-hover); padding: 20px; border-radius: var(--border-radius); margin-bottom: 16px;">
            <h4 style="margin-bottom: 12px;">✨ Generated Prompt</h4>
            <textarea readonly style="width: 100%; min-height: 100px; margin-bottom: 12px;">${data.prompt}</textarea>
            <button onclick="copyToClipboard('${data.prompt.replace(/'/g, "\\'")}')"><i class="fas fa-copy"></i> Copy</button>
        </div>
        
        ${data.negativePrompt ? `
        <div style="background: var(--bg-hover); padding: 20px; border-radius: var(--border-radius);">
            <h4 style="margin-bottom: 12px;">🚫 Negative Prompt</h4>
            <textarea readonly style="width: 100%; min-height: 80px; margin-bottom: 12px;">${data.negativePrompt}</textarea>
            <button onclick="copyToClipboard('${data.negativePrompt.replace(/'/g, "\\'")}')"><i class="fas fa-copy"></i> Copy</button>
        </div>
        ` : ''}
    `;
    
    container.style.display = 'block';
}

// Analyze Mode
function initAnalyzeMode() {
    const cards = document.querySelectorAll('.provider-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            selectProvider(card.dataset.provider);
        });
    });
    
    const input = document.getElementById('analyze-image-input');
    const dropZone = document.getElementById('analyze-drop-zone');
    const browseBtn = document.getElementById('analyze-browse-btn');
    const clearBtn = document.getElementById('analyze-clear-image');
    const analyzeBtn = document.getElementById('analyze-btn');
    
    browseBtn.addEventListener('click', () => input.click());
    input.addEventListener('change', (e) => handleAnalyzeImageSelect(e.target.files[0]));
    
    // Drag & drop (similar to prompt mode)
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length) {
            handleAnalyzeImageSelect(e.dataTransfer.files[0]);
        }
    });
    
    clearBtn.addEventListener('click', () => clearAnalyzeImage());
    analyzeBtn.addEventListener('click', () => analyzeProduct());
}

function selectProvider(provider) {
    selectedProvider = provider;
    document.querySelectorAll('.provider-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.provider === provider);
    });
    
    // Show/hide API key section for OpenAI
    const apiKeySection = document.getElementById('analyze-api-key-section');
    if (provider === 'openai') {
        apiKeySection.style.display = 'block';
    } else {
        apiKeySection.style.display = 'none';
    }
    
    updateAnalyzeButton();
}

function handleAnalyzeImageSelect(file) {
    if (!file || !file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        analyzeImageData = e.target.result;
        document.getElementById('analyze-preview-image').src = analyzeImageData;
        document.getElementById('analyze-drop-zone').style.display = 'none';
        document.getElementById('analyze-preview-container').style.display = 'block';
        updateAnalyzeButton();
    };
    reader.readAsDataURL(file);
}

function clearAnalyzeImage() {
    analyzeImageData = null;
    document.getElementById('analyze-drop-zone').style.display = 'block';
    document.getElementById('analyze-preview-container').style.display = 'none';
    document.getElementById('analyze-image-input').value = '';
    updateAnalyzeButton();
}

function updateAnalyzeButton() {
    const btn = document.getElementById('analyze-btn');
    btn.disabled = !(selectedProvider && analyzeImageData);
}

async function analyzeProduct() {
    const loading = document.getElementById('analyze-loading');
    const results = document.getElementById('analyze-results');
    
    loading.style.display = 'block';
    results.style.display = 'none';
    
    try {
        let endpoint = '';
        let body = { image: analyzeImageData };
        
        if (selectedProvider === 'gemini') {
            endpoint = '/api/gemini-analyze';
        } else if (selectedProvider === 'grok') {
            endpoint = '/api/grok-analyze';
        } else if (selectedProvider === 'openai') {
            endpoint = '/api/analyze';
            body.apiKey = document.getElementById('analyze-api-key-input').value;
        }
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        if (!response.ok) throw new Error('Analysis failed');
        
        const data = await response.json();
        
        loading.style.display = 'none';
        displayAnalyzeResults(data);
        
    } catch (error) {
        loading.style.display = 'none';
        alert('Error: ' + error.message);
    }
}

function displayAnalyzeResults(data) {
    const container = document.getElementById('analyze-results');
    container.innerHTML = `
        <h3 style="margin-bottom: 20px;"><i class="fas fa-check-circle" style="color: var(--success);"></i> Analysis Complete</h3>
        <div style="background: var(--bg-hover); padding: 20px; border-radius: var(--border-radius);">
            <pre style="white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${JSON.stringify(data, null, 2)}</pre>
        </div>
    `;
    container.style.display = 'block';
}

// Modals
function initModals() {
    const helpBtn = document.getElementById('helpBtn');
    const helpModal = document.getElementById('helpModal');
    
    helpBtn.addEventListener('click', () => {
        helpModal.style.display = 'flex';
    });
    
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal || e.target.classList.contains('modal-close')) {
            helpModal.style.display = 'none';
        }
    });
}

// Utility functions
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    });
}

async function checkAPIHealth() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('API Health:', data);
    } catch (error) {
        console.error('API Health check failed:', error);
    }
}
