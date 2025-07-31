// Main application JavaScript
class StudentLoadgeApp {
    constructor() {
        this.currentTab = 'dashboard';
        this.currentLanguage = 'fr';
        this.timer = { start: null, elapsed: 0 };
        this.projects = [];
        this.currentProject = null;
        
        this.init();
    }
    
    init() {
        this.initEventListeners();
        this.initTimer();
        this.loadProjects();
        this.updateStats();
        this.initKeyboardShortcuts();
        this.loadExpressTemplates();
        this.loadRecentActivity();
    }
    
    initEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
        
        // Language switch
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.currentTarget.getAttribute('data-lang');
                this.switchLanguage(lang);
            });
        });
        
        // Action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.handleAction(action);
            });
        });
        
        // Header buttons
        document.getElementById('saveBtn')?.addEventListener('click', () => this.saveProject());
        document.getElementById('exportBtn')?.addEventListener('click', () => this.exportProject());
        document.getElementById('settingsBtn')?.addEventListener('click', () => this.openSettings());
        
        // Client form
        document.getElementById('clientForm')?.addEventListener('input', () => this.updateProjectInfo());
    }
    
    initTimer() {
        this.timer.start = Date.now();
        this.updateTimer();
        setInterval(() => this.updateTimer(), 1000);
    }
    
    updateTimer() {
        const elapsed = Math.floor((Date.now() - this.timer.start) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    switchTab(tabId) {
        // Update nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`)?.classList.add('active');
        
        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabId)?.classList.add('active');
        
        this.currentTab = tabId;
        
        // Load tab-specific content
        this.loadTabContent(tabId);
    }
    
    switchLanguage(lang) {
        // Update language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-lang="${lang}"]`)?.classList.add('active');
        
        this.currentLanguage = lang;
        this.updateLanguageContent();
    }
    
    updateLanguageContent() {
        // Update interface text based on language
        const translations = {
            fr: {
                'dashboard': 'Dashboard',
                'cv-builder': 'Générateur CV',
                'letter-builder': 'Lettres Motivation',
                'projects': 'Mes Projets'
            },
            en: {
                'dashboard': 'Dashboard',
                'cv-builder': 'CV Builder',
                'letter-builder': 'Cover Letters',
                'projects': 'My Projects'
            }
        };
        
        // Apply translations (simplified for now)
        console.log(`Language switched to: ${this.currentLanguage}`);
    }
    
    handleAction(action) {
        switch (action) {
            case 'new-cv':
                this.createNewCV();
                break;
            case 'new-letter':
                this.createNewLetter();
                break;
            case 'import-data':
                this.importData();
                break;
            default:
                console.log(`Action not implemented: ${action}`);
        }
    }
    
    createNewCV() {
        this.switchTab('cv-builder');
        this.startNewProject('cv');
    }
    
    createNewLetter() {
        this.switchTab('letter-builder');
        this.startNewProject('letter');
    }
    
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        this.importProjectData(data);
                    } catch (error) {
                        alert('Erreur lors de l\'importation du fichier');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
    
    startNewProject(type) {
        this.currentProject = {
            id: Date.now().toString(),
            type: type,
            name: 'Nouveau Projet',
            created: new Date(),
            modified: new Date(),
            data: {},
            status: 'draft'
        };
        
        this.updateProjectInfo();
        this.timer.start = Date.now(); // Reset timer for new project
    }
    
    updateProjectInfo() {
        const clientName = document.getElementById('clientName')?.value;
        const targetPosition = document.getElementById('targetPosition')?.value;
        const sector = document.getElementById('sector')?.value;
        
        if (this.currentProject && clientName) {
            this.currentProject.name = `${clientName} - ${targetPosition || 'CV'}`;
            this.currentProject.data.clientName = clientName;
            this.currentProject.data.targetPosition = targetPosition;
            this.currentProject.data.sector = sector;
            
            // Update project name display
            const projectNameElement = document.querySelector('.project-name');
            if (projectNameElement) {
                projectNameElement.textContent = this.currentProject.name;
            }
        }
    }
    
    saveProject() {
        if (!this.currentProject) {
            alert('Aucun projet à sauvegarder');
            return;
        }
        
        this.currentProject.modified = new Date();
        
        // Save to localStorage
        const existingIndex = this.projects.findIndex(p => p.id === this.currentProject.id);
        if (existingIndex >= 0) {
            this.projects[existingIndex] = this.currentProject;
        } else {
            this.projects.push(this.currentProject);
        }
        
        localStorage.setItem('studentloadge_projects', JSON.stringify(this.projects));
        
        // Show success message
        this.showNotification('Projet sauvegardé avec succès', 'success');
        this.updateStats();
    }
    
    exportProject() {
        if (!this.currentProject) {
            alert('Aucun projet à exporter');
            return;
        }
        
        // Show export modal
        this.showExportModal();
    }
    
    showExportModal() {
        const modal = document.createElement('div');
        modal.className = 'export-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Exporter le projet</h3>
                    <button class="modal-close" onclick="this.closest('.export-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="export-options">
                        <button class="export-btn" data-format="pdf">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14,2 14,8 20,8"/>
                            </svg>
                            <span>PDF</span>
                        </button>
                        <button class="export-btn" data-format="docx">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14,2 14,8 20,8"/>
                            </svg>
                            <span>DOCX</span>
                        </button>
                        <button class="export-btn" data-format="png">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <polyline points="21,15 16,10 5,21"/>
                            </svg>
                            <span>PNG</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add export handlers
        modal.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.currentTarget.getAttribute('data-format');
                this.performExport(format);
                modal.remove();
            });
        });
    }
    
    performExport(format) {
        // This will be implemented with the export module
        console.log(`Exporting as ${format}`);
        this.showNotification(`Export ${format.toUpperCase()} en cours...`, 'info');
        
        // Simulate export process
        setTimeout(() => {
            this.showNotification(`Export ${format.toUpperCase()} terminé`, 'success');
        }, 2000);
    }
    
    openSettings() {
        console.log('Opening settings...');
        // Settings modal implementation
    }
    
    loadProjects() {
        const saved = localStorage.getItem('studentloadge_projects');
        if (saved) {
            this.projects = JSON.parse(saved);
        }
        this.updateRecentProjects();
    }
    
    updateRecentProjects() {
        const recentContainer = document.getElementById('recentProjects');
        if (!recentContainer) return;
        
        const recent = this.projects
            .sort((a, b) => new Date(b.modified) - new Date(a.modified))
            .slice(0, 5);
        
        if (recent.length === 0) {
            recentContainer.innerHTML = '<p class="no-projects">Aucun projet récent</p>';
            return;
        }
        
        recentContainer.innerHTML = recent.map(project => `
            <div class="project-item" onclick="app.loadProject('${project.id}')">
                <svg class="project-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${project.type === 'cv' ? 
                        '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/>' :
                        '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'
                    }
                </svg>
                <div class="project-details">
                    <div class="project-name">${project.name}</div>
                    <div class="project-meta">${this.formatDate(project.modified)}</div>
                </div>
            </div>
        `).join('');
    }
    
    loadProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            this.currentProject = project;
            this.switchTab(project.type === 'cv' ? 'cv-builder' : 'letter-builder');
            this.updateProjectInfo();
        }
    }
    
    updateStats() {
        const cvCount = this.projects.filter(p => p.type === 'cv').length;
        const letterCount = this.projects.filter(p => p.type === 'letter').length;
        const projectCount = this.projects.length;
        
        // Calculate average time (mock for now)
        const avgTime = projectCount > 0 ? Math.floor(Math.random() * 30) + 15 : 0;
        
        document.getElementById('cvCount').textContent = cvCount;
        document.getElementById('letterCount').textContent = letterCount;
        document.getElementById('projectCount').textContent = projectCount;
        document.getElementById('avgTime').textContent = `${avgTime}min`;
    }
    
    loadTabContent(tabId) {
        switch (tabId) {
            case 'cv-builder':
                this.loadCVBuilder();
                break;
            case 'letter-builder':
                this.loadLetterBuilder();
                break;
            case 'projects':
                this.loadProjectsGrid();
                break;
        }
    }
    
    loadCVBuilder() {
        const container = document.getElementById('cvTemplateSelector');
        if (!container) return;
        
        // Load CV templates
        container.innerHTML = `
            <div class="template-category">
                <h4 class="category-title">Templates Express (15-20 min)</h4>
                <div class="template-grid">
                    ${this.generateTemplateOptions('express', 'cv')}
                </div>
            </div>
            <div class="template-category">
                <h4 class="category-title">Modernes</h4>
                <div class="template-grid">
                    ${this.generateTemplateOptions('modern', 'cv')}
                </div>
            </div>
            <div class="template-category">
                <h4 class="category-title">Classiques</h4>
                <div class="template-grid">
                    ${this.generateTemplateOptions('classic', 'cv')}
                </div>
            </div>
            <div class="template-category">
                <h4 class="category-title">Créatifs</h4>
                <div class="template-grid">
                    ${this.generateTemplateOptions('creative', 'cv')}
                </div>
            </div>
        `;
        
        // Add template selection handlers
        container.querySelectorAll('.template-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const templateId = e.currentTarget.getAttribute('data-template');
                this.selectTemplate(templateId, 'cv');
            });
        });
    }
    
    loadLetterBuilder() {
        const container = document.getElementById('letterTemplateSelector');
        if (!container) return;
        
        container.innerHTML = `
            <div class="template-category">
                <h4 class="category-title">Lettres Générales</h4>
                <div class="template-grid">
                    ${this.generateTemplateOptions('general', 'letter')}
                </div>
            </div>
            <div class="template-category">
                <h4 class="category-title">Tech & IT</h4>
                <div class="template-grid">
                    ${this.generateTemplateOptions('tech', 'letter')}
                </div>
            </div>
            <div class="template-category">
                <h4 class="category-title">Business</h4>
                <div class="template-grid">
                    ${this.generateTemplateOptions('business', 'letter')}
                </div>
            </div>
        `;
    }
    
    generateTemplateOptions(category, type) {
        const templates = this.getTemplatesByCategory(category, type);
        return templates.map(template => `
            <div class="template-option" data-template="${template.id}">
                <div class="template-preview-mini">
                    ${template.name}
                </div>
                <div class="template-name-mini">${template.name}</div>
                <div class="template-time-mini">${template.time}</div>
            </div>
        `).join('');
    }
    
    getTemplatesByCategory(category, type) {
        // Mock template data
        const templates = {
            cv: {
                express: [
                    { id: 'cv-express-1', name: 'Modern Express', time: '15min' },
                    { id: 'cv-express-2', name: 'Corporate Express', time: '18min' },
                    { id: 'cv-express-3', name: 'Tech Express', time: '16min' },
                    { id: 'cv-express-4', name: 'Creative Express', time: '20min' }
                ],
                modern: [
                    { id: 'cv-modern-1', name: 'Minimal Pro', time: '25min' },
                    { id: 'cv-modern-2', name: 'Clean Design', time: '22min' },
                    { id: 'cv-modern-3', name: 'Professional', time: '28min' },
                    { id: 'cv-modern-4', name: 'Elegant', time: '24min' }
                ],
                classic: [
                    { id: 'cv-classic-1', name: 'Traditional', time: '30min' },
                    { id: 'cv-classic-2', name: 'Corporate', time: '26min' },
                    { id: 'cv-classic-3', name: 'Executive', time: '32min' },
                    { id: 'cv-classic-4', name: 'Academic', time: '28min' }
                ],
                creative: [
                    { id: 'cv-creative-1', name: 'Designer', time: '35min' },
                    { id: 'cv-creative-2', name: 'Artistic', time: '38min' },
                    { id: 'cv-creative-3', name: 'Colorful', time: '33min' },
                    { id: 'cv-creative-4', name: 'Unique', time: '40min' }
                ]
            },
            letter: {
                general: [
                    { id: 'letter-general-1', name: 'Standard', time: '15min' },
                    { id: 'letter-general-2', name: 'Professional', time: '18min' },
                    { id: 'letter-general-3', name: 'Modern', time: '16min' },
                    { id: 'letter-general-4', name: 'Classic', time: '20min' }
                ],
                tech: [
                    { id: 'letter-tech-1', name: 'Developer', time: '20min' },
                    { id: 'letter-tech-2', name: 'Engineer', time: '22min' },
                    { id: 'letter-tech-3', name: 'Data Scientist', time: '25min' },
                    { id: 'letter-tech-4', name: 'DevOps', time: '23min' }
                ],
                business: [
                    { id: 'letter-business-1', name: 'Sales', time: '18min' },
                    { id: 'letter-business-2', name: 'Marketing', time: '20min' },
                    { id: 'letter-business-3', name: 'Finance', time: '22min' },
                    { id: 'letter-business-4', name: 'Consulting', time: '25min' }
                ]
            }
        };
        
        return templates[type]?.[category] || [];
    }
    
    selectTemplate(templateId, type) {
        // Remove previous selections
        document.querySelectorAll('.template-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Select current template
        document.querySelector(`[data-template="${templateId}"]`)?.classList.add('selected');
        
        // Load template content
        this.loadTemplateContent(templateId, type);
    }
    
    loadTemplateContent(templateId, type) {
        const contentContainer = document.getElementById(`${type}BuilderContent`);
        if (!contentContainer) return;
        
        contentContainer.innerHTML = `
            <div class="template-editor">
                <h3>Template: ${templateId}</h3>
                <p>Éditeur de template à implémenter</p>
                <div class="editor-placeholder">
                    <p>Ici sera affiché l'éditeur pour le template sélectionné</p>
                    <p>Avec formulaire de saisie et prévisualisation en temps réel</p>
                </div>
            </div>
        `;
    }
    
    loadProjectsGrid() {
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;
        
        if (this.projects.length === 0) {
            grid.innerHTML = `
                <div class="no-projects-message">
                    <h3>Aucun projet</h3>
                    <p>Commencez par créer votre premier CV ou lettre de motivation</p>
                    <button class="btn-primary" onclick="app.createNewCV()">Créer un CV</button>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = this.projects.map(project => `
            <div class="project-card" onclick="app.loadProject('${project.id}')">
                <div class="project-header">
                    <div>
                        <div class="project-title">${project.name}</div>
                        <div class="project-type">${project.type === 'cv' ? 'CV' : 'Lettre de motivation'}</div>
                    </div>
                    <div class="project-status ${project.status}">${this.getStatusLabel(project.status)}</div>
                </div>
                <div class="project-meta">
                    <span>Modifié: ${this.formatDate(project.modified)}</span>
                    <span>${project.data.sector || 'Non spécifié'}</span>
                </div>
            </div>
        `).join('');
    }
    
    loadExpressTemplates() {
        const container = document.getElementById('expressTemplates');
        if (!container) return;
        
        const expressTemplates = this.getTemplatesByCategory('express', 'cv').slice(0, 4);
        container.innerHTML = expressTemplates.map(template => `
            <div class="express-template" onclick="app.selectTemplate('${template.id}', 'cv')">
                <div class="template-preview-mini">${template.name.charAt(0)}</div>
                <div class="template-name-mini">${template.name}</div>
                <div class="template-time-mini">${template.time}</div>
            </div>
        `).join('');
    }
    
    loadRecentActivity() {
        const container = document.getElementById('activityList');
        if (!container) return;
        
        // Mock recent activity
        const activities = [
            { type: 'cv', title: 'CV créé pour Jean Dupont', time: 'Il y a 2h' },
            { type: 'letter', title: 'Lettre de motivation - Tech', time: 'Il y a 5h' },
            { type: 'export', title: 'Export PDF réussi', time: 'Hier' }
        ];
        
        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${activity.type === 'cv' ? 
                            '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>' :
                            activity.type === 'letter' ?
                            '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>' :
                            '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>'
                        }
                    </svg>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }
    
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveProject();
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportProject();
                        break;
                    case 'n':
                        e.preventDefault();
                        this.createNewCV();
                        break;
                }
            }
        });
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    formatDate(date) {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    getStatusLabel(status) {
        const labels = {
            'draft': 'Brouillon',
            'in-progress': 'En cours',
            'completed': 'Terminé'
        };
        return labels[status] || status;
    }
    
    importProjectData(data) {
        // Import project data from JSON
        if (data.projects) {
            this.projects = [...this.projects, ...data.projects];
            localStorage.setItem('studentloadge_projects', JSON.stringify(this.projects));
            this.updateStats();
            this.updateRecentProjects();
            this.showNotification('Données importées avec succès', 'success');
        }
    }
}

// Global functions for onclick handlers
function showExpressTemplates() {
    app.switchTab('cv-builder');
}

function startClientProject() {
    const clientName = document.getElementById('clientName').value;
    const targetPosition = document.getElementById('targetPosition').value;
    const sector = document.getElementById('sector').value;
    
    if (!clientName || !targetPosition) {
        alert('Veuillez remplir au moins le nom du client et le poste visé');
        return;
    }
    
    app.startNewProject('cv');
    app.switchTab('cv-builder');
}

function importProjects() {
    app.importData();
}

function exportProjects() {
    const data = {
        projects: app.projects,
        exported: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'studentloadge_projects.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Initialize app
let app;
function initializeApp() {
    app = new StudentLoadgeApp();
}

// Add notification styles
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 90px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
}

.notification.show {
    transform: translateX(0);
}

.notification-success {
    background: #22c55e;
}

.notification-error {
    background: #ef4444;
}

.notification-info {
    background: #3b82f6;
}

.notification-warning {
    background: #f59e0b;
}

.export-modal {
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

.export-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-top: 1rem;
}

.export-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.5rem;
    background: var(--glass);
    border: 2px solid var(--border);
    border-radius: 12px;
    cursor: pointer;
    transition: var(--transition-fast);
    color: var(--text-primary);
}

.export-btn:hover {
    border-color: var(--primary);
    background: var(--surface-light);
}

.export-btn svg {
    color: var(--primary);
}

.no-projects-message {
    text-align: center;
    padding: 3rem;
    color: var(--text-secondary);
}

.no-projects-message h3 {
    color: var(--text-primary);
    margin-bottom: 1rem;
}

.no-projects-message .btn-primary {
    margin-top: 1.5rem;
}

.template-editor {
    padding: 2rem;
    text-align: center;
}

.editor-placeholder {
    background: var(--surface);
    border: 2px dashed var(--border);
    border-radius: 12px;
    padding: 3rem;
    margin-top: 2rem;
    color: var(--text-secondary);
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', notificationStyles);

