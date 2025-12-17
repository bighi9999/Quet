/**
 * UI Enhancements for AI Product Analyzer V2
 * Modern UI components and interactions
 */

class UIEnhancements {
    constructor() {
        this.loadingOverlay = null;
        this.toastContainer = null;
        this.init();
    }

    init() {
        this.createLoadingOverlay();
        this.createToastContainer();
    }

    // ========================================
    // LOADING OVERLAY
    // ========================================

    createLoadingOverlay() {
        if (document.getElementById('modern-loading-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'modern-loading-overlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="modern-spinner"></div>
            <div class="loading-text" id="modern-loading-text">Đang xử lý...</div>
            <div class="loading-subtext" id="modern-loading-subtext">Vui lòng đợi...</div>
            <div class="progress-container">
                <div class="progress-bar" id="modern-progress-bar"></div>
            </div>
        `;
        document.body.appendChild(overlay);
        this.loadingOverlay = overlay;
    }

    showLoading(text = 'Đang xử lý...', subtext = 'Vui lòng đợi...', progress = 0) {
        const overlay = document.getElementById('modern-loading-overlay');
        const textEl = document.getElementById('modern-loading-text');
        const subtextEl = document.getElementById('modern-loading-subtext');
        const progressBar = document.getElementById('modern-progress-bar');

        if (textEl) textEl.textContent = text;
        if (subtextEl) subtextEl.textContent = subtext;
        if (progressBar) progressBar.style.width = `${progress}%`;

        if (overlay) {
            overlay.classList.add('active');
        }
    }

    hideLoading() {
        const overlay = document.getElementById('modern-loading-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    updateProgress(progress) {
        const progressBar = document.getElementById('modern-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }

    updateLoadingText(text, subtext = '') {
        const textEl = document.getElementById('modern-loading-text');
        const subtextEl = document.getElementById('modern-loading-subtext');
        
        if (textEl) textEl.textContent = text;
        if (subtextEl && subtext) subtextEl.textContent = subtext;
    }

    // ========================================
    // TOAST NOTIFICATIONS
    // ========================================

    createToastContainer() {
        if (document.getElementById('toast-container')) return;

        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
        this.toastContainer = container;
    }

    showToast(message, type = 'info', title = '', duration = 4000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        const titles = {
            success: title || 'Thành công!',
            error: title || 'Lỗi!',
            warning: title || 'Cảnh báo!',
            info: title || 'Thông báo'
        };

        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || 'ℹ'}</div>
            <div class="toast-message">
                <div class="toast-title">${titles[type]}</div>
                <div class="toast-text">${message}</div>
            </div>
            <div class="toast-close" onclick="this.parentElement.remove()">×</div>
        `;

        const container = document.getElementById('toast-container');
        if (container) {
            container.appendChild(toast);

            // Trigger animation
            setTimeout(() => toast.classList.add('show'), 100);

            // Auto remove
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 400);
            }, duration);
        }
    }

    success(message, title = '') {
        this.showToast(message, 'success', title);
    }

    error(message, title = '') {
        this.showToast(message, 'error', title);
    }

    warning(message, title = '') {
        this.showToast(message, 'warning', title);
    }

    info(message, title = '') {
        this.showToast(message, 'info', title);
    }

    // ========================================
    // MODAL
    // ========================================

    showModal(title, content, onClose = null) {
        // Remove existing modal
        const existingModal = document.getElementById('result-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'result-modal';
        modal.className = 'result-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.result-modal').remove()">×</button>
                <div class="modal-header">
                    <h2>${title}</h2>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Trigger animation
        setTimeout(() => modal.classList.add('active'), 100);

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.remove();
                    if (onClose) onClose();
                }, 300);
            }
        });

        // Close on ESC key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.remove();
                    if (onClose) onClose();
                }, 300);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    closeModal() {
        const modal = document.getElementById('result-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    }

    // ========================================
    // IMAGE GALLERY
    // ========================================

    createGallery(images, container) {
        if (!container) return;

        container.innerHTML = '';
        container.className = 'image-gallery';

        images.forEach((image, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item fade-in';
            item.style.animationDelay = `${index * 0.1}s`;
            
            item.innerHTML = `
                <img src="${image.url}" alt="Generated Image ${index + 1}" loading="lazy">
                <div class="gallery-item-overlay">
                    <div class="gallery-item-actions">
                        <button class="gallery-action-btn" onclick="ui.downloadImage('${image.url}', 'image-${index + 1}.png')">
                            📥 Tải xuống
                        </button>
                        <button class="gallery-action-btn" onclick="ui.viewImageFullscreen('${image.url}')">
                            🔍 Xem lớn
                        </button>
                    </div>
                </div>
            `;

            container.appendChild(item);
        });
    }

    downloadImage(url, filename = 'image.png') {
        fetch(url)
            .then(res => res.blob())
            .then(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                link.click();
                URL.revokeObjectURL(link.href);
                this.success('Ảnh đã được tải xuống!');
            })
            .catch(err => {
                console.error('Download error:', err);
                this.error('Không thể tải xuống ảnh!');
            });
    }

    viewImageFullscreen(url) {
        const content = `
            <div style="text-align: center;">
                <img src="${url}" style="max-width: 100%; max-height: 70vh; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
                <div style="margin-top: 20px;">
                    <button onclick="ui.downloadImage('${url}', 'fullsize-image.png')" 
                            style="padding: 12px 30px; border: none; border-radius: 8px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; cursor: pointer; font-size: 1em;">
                        📥 Tải xuống ảnh
                    </button>
                </div>
            </div>
        `;
        this.showModal('Xem ảnh', content);
    }

    // ========================================
    // ANIMATIONS
    // ========================================

    animateElement(element, animation = 'fadeIn') {
        if (!element) return;
        element.classList.add(animation);
    }

    // ========================================
    // HELPERS
    // ========================================

    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    formatNumber(num) {
        return new Intl.NumberFormat('vi-VN').format(num);
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.success('Đã sao chép vào clipboard!');
        }).catch(() => {
            this.error('Không thể sao chép!');
        });
    }
}

// Initialize global UI instance
const ui = new UIEnhancements();

// Expose to window for external access
window.ui = ui;

console.log('✨ UI Enhancements loaded successfully!');
