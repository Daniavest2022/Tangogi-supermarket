// js/theme.js

export class ThemeManager {
    constructor() {
        console.log('🎨 Theme Manager Initialized');
        this.toggleButton = document.getElementById('dark-mode-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
    }

    init() {
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', () => this.toggleTheme());
        }
        this.applyTheme(this.currentTheme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    applyTheme(theme) {
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(`${theme}-mode`);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        // Update the toggle button icon
        if (this.toggleButton) {
            const icon = this.toggleButton.querySelector('i');
            if (theme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    }
}