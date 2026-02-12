// Theme Switcher
const ThemeSwitcher = {
    THEMES: {
        dark: 'dark',
        light: 'light'
    },

    init() {
        const savedTheme = localStorage.getItem('lumen-theme') || 'dark';
        this.applyTheme(savedTheme);
        this.createThemeSwitcher();
    },

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('lumen-theme', theme);
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        this.updateThemeButton(newTheme);
    },

    updateThemeButton(theme) {
        const buttons = document.querySelectorAll('.theme-option');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === theme) {
                btn.classList.add('active');
            }
        });
    },

    createThemeSwitcher() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

        const html = `
            <div class="theme-switcher-container">
                <button class="theme-toggle-btn" aria-label="Cambiar tema">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"></path>
                    </svg>
                </button>
                <div class="theme-options-panel">
                    <h4>Tema de Color</h4>
                    <div class="theme-options">
                        <button class="theme-option ${currentTheme === 'dark' ? 'active' : ''}" data-theme="dark">
                            <span class="theme-preview theme-preview-dark"></span>
                            <span class="theme-name">Oscuro</span>
                        </button>
                        <button class="theme-option ${currentTheme === 'light' ? 'active' : ''}" data-theme="light">
                            <span class="theme-preview theme-preview-light"></span>
                            <span class="theme-name">Claro</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);

        // Event listeners
        const toggleBtn = document.querySelector('.theme-toggle-btn');
        const panel = document.querySelector('.theme-options-panel');
        const themeOptions = document.querySelectorAll('.theme-option');

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('active');
        });

        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.applyTheme(theme);
                this.updateThemeButton(theme);
                panel.classList.remove('active');
            });
        });

        // Cerrar al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.theme-switcher-container')) {
                panel.classList.remove('active');
            }
        });
    }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ThemeSwitcher.init());
} else {
    ThemeSwitcher.init();
}
