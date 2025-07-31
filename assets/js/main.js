// Main JavaScript for StudentLoadge Pro
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initNavigation();
    initTemplatesTabs();
    initScrollEffects();
    initAnimations();
}

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 15, 15, 0.95)';
        } else {
            navbar.style.background = 'rgba(15, 15, 15, 0.9)';
        }
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Templates tabs functionality
function initTemplatesTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const templatesGrid = document.getElementById('templatesGrid');
    
    if (!templatesGrid) return;
    
    // Template data
    const templates = {
        express: [
            { name: 'Modern Express', time: '15min', category: 'express', preview: 'modern-express.jpg' },
            { name: 'Corporate Express', time: '18min', category: 'express', preview: 'corporate-express.jpg' },
            { name: 'Creative Express', time: '20min', category: 'express', preview: 'creative-express.jpg' },
            { name: 'Tech Express', time: '16min', category: 'express', preview: 'tech-express.jpg' }
        ],
        modern: [
            { name: 'Minimal Pro', time: '25min', category: 'modern', preview: 'minimal-pro.jpg' },
            { name: 'Clean Design', time: '22min', category: 'modern', preview: 'clean-design.jpg' },
            { name: 'Professional', time: '28min', category: 'modern', preview: 'professional.jpg' },
            { name: 'Elegant', time: '24min', category: 'modern', preview: 'elegant.jpg' }
        ],
        classic: [
            { name: 'Traditional', time: '30min', category: 'classic', preview: 'traditional.jpg' },
            { name: 'Corporate', time: '26min', category: 'classic', preview: 'corporate.jpg' },
            { name: 'Executive', time: '32min', category: 'classic', preview: 'executive.jpg' },
            { name: 'Academic', time: '28min', category: 'classic', preview: 'academic.jpg' }
        ],
        creative: [
            { name: 'Designer', time: '35min', category: 'creative', preview: 'designer.jpg' },
            { name: 'Artistic', time: '38min', category: 'creative', preview: 'artistic.jpg' },
            { name: 'Colorful', time: '33min', category: 'creative', preview: 'colorful.jpg' },
            { name: 'Unique', time: '40min', category: 'creative', preview: 'unique.jpg' }
        ]
    };
    
    // Tab click handlers
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get selected category
            const category = button.getAttribute('data-tab');
            
            // Update templates grid
            updateTemplatesGrid(templates[category] || templates.express);
        });
    });
    
    // Initialize with express templates
    updateTemplatesGrid(templates.express);
}

function updateTemplatesGrid(templates) {
    const grid = document.getElementById('templatesGrid');
    if (!grid) return;
    
    grid.innerHTML = templates.map(template => `
        <div class="template-card" data-template="${template.name.toLowerCase().replace(/\s+/g, '-')}">
            <div class="template-preview">
                <div class="template-image">
                    <div class="template-placeholder">
                        <svg viewBox="0 0 200 280" fill="none">
                            <rect width="200" height="280" fill="#f8f9fa" rx="8"/>
                            <rect x="20" y="20" width="60" height="60" fill="#e11d48" rx="30"/>
                            <rect x="90" y="20" width="90" height="12" fill="#1a1a1a" rx="6"/>
                            <rect x="90" y="40" width="70" height="8" fill="#6b7280" rx="4"/>
                            <rect x="20" y="100" width="160" height="8" fill="#1a1a1a" rx="4"/>
                            <rect x="20" y="120" width="140" height="6" fill="#6b7280" rx="3"/>
                            <rect x="20" y="135" width="120" height="6" fill="#6b7280" rx="3"/>
                            <rect x="20" y="165" width="160" height="8" fill="#1a1a1a" rx="4"/>
                            <rect x="20" y="185" width="100" height="6" fill="#6b7280" rx="3"/>
                            <rect x="20" y="200" width="130" height="6" fill="#6b7280" rx="3"/>
                        </svg>
                    </div>
                    <div class="template-overlay">
                        <button class="btn-preview">Aperçu</button>
                        <button class="btn-use">Utiliser</button>
                    </div>
                </div>
                <div class="template-info">
                    <h3 class="template-name">${template.name}</h3>
                    <div class="template-meta">
                        <span class="template-time">⏱ ${template.time}</span>
                        <span class="template-category">${template.category}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to template cards
    grid.querySelectorAll('.template-card').forEach(card => {
        const previewBtn = card.querySelector('.btn-preview');
        const useBtn = card.querySelector('.btn-use');
        
        previewBtn?.addEventListener('click', () => {
            const templateName = card.getAttribute('data-template');
            showTemplatePreview(templateName);
        });
        
        useBtn?.addEventListener('click', () => {
            const templateName = card.getAttribute('data-template');
            useTemplate(templateName);
        });
    });
}

function showTemplatePreview(templateName) {
    // Create modal for template preview
    const modal = document.createElement('div');
    modal.className = 'template-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Aperçu du template</h3>
                <button class="modal-close" onclick="closeModal()">×</button>
            </div>
            <div class="modal-body">
                <div class="template-preview-large">
                    <p>Aperçu du template: ${templateName}</p>
                    <p>Fonctionnalité à implémenter dans la version complète</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeModal()">Fermer</button>
                <button class="btn-primary" onclick="useTemplate('${templateName}')">Utiliser ce template</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function useTemplate(templateName) {
    // Redirect to app with selected template
    window.location.href = `app.html?template=${templateName}`;
}

function closeModal() {
    const modal = document.querySelector('.template-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Scroll effects
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.feature-card, .section-header').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Animations
function initAnimations() {
    // Add hover effects to cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click ripple effect to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS for modal and ripple effects
const additionalStyles = `
<style>
.template-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
}

.modal-content {
    position: relative;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow: hidden;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border);
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    transition: var(--transition-fast);
}

.modal-close:hover {
    background: var(--surface-light);
    color: var(--text-primary);
}

.modal-body {
    padding: 1.5rem;
}

.modal-footer {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    padding: 1.5rem;
    border-top: 1px solid var(--border);
}

.template-card {
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    overflow: hidden;
    transition: var(--transition-normal);
    cursor: pointer;
}

.template-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary);
}

.template-preview {
    position: relative;
}

.template-image {
    position: relative;
    aspect-ratio: 3/4;
    overflow: hidden;
}

.template-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface-light);
}

.template-placeholder svg {
    width: 80%;
    height: 80%;
}

.template-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    opacity: 0;
    transition: var(--transition-normal);
}

.template-card:hover .template-overlay {
    opacity: 1;
}

.btn-preview, .btn-use {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition-fast);
}

.btn-preview {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.btn-preview:hover {
    background: white;
    color: var(--secondary);
}

.btn-use {
    background: var(--primary);
    color: white;
}

.btn-use:hover {
    background: var(--primary-dark);
}

.template-info {
    padding: 1rem;
}

.template-name {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
}

.template-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.template-time {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.template-category {
    background: var(--primary);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: uppercase;
}

.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.btn-secondary {
    padding: 0.75rem 1.5rem;
    background: transparent;
    color: var(--text-secondary);
    border: 2px solid var(--border);
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition-fast);
}

.btn-secondary:hover {
    background: var(--surface-light);
    color: var(--text-primary);
    border-color: var(--text-secondary);
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);

