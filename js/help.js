// js/help.js - Page-Specific JavaScript for help.html

class HelpCenterManager {
    constructor() {
        this.app = window.app || {}; // Access the global app instance
        console.log('헬 Help Center Manager Initialized');
    }

    init() {
        this.cacheDOMElements();
        this.bindEvents();
    }

    cacheDOMElements() {
        this.elements = {
            faqItems: document.querySelectorAll('.faq-item'),
            helpSearchInput: document.getElementById('help-search-input'),
            supportForm: document.getElementById('support-form'),
            messageTextarea: document.getElementById('support-message'),
            charCount: document.getElementById('message-chars'),
            fileInput: document.getElementById('support-attachments'),
            filePreview: document.getElementById('file-preview'),
        };
    }

    bindEvents() {
        // --- Accordion Functionality ---
        this.elements.faqItems.forEach(item => {
            const questionButton = item.querySelector('.faq-question');
            if (questionButton) {
                questionButton.addEventListener('click', () => {
                    item.classList.toggle('active');
                });
            }
        });

        // --- Search Functionality ---
        if (this.elements.helpSearchInput) {
            this.elements.helpSearchInput.addEventListener('input', () => this.filterHelpTopics());
        }

        // --- Support Form ---
        if (this.elements.supportForm) {
            this.elements.messageTextarea.addEventListener('input', () => this.updateCharCount());
            this.elements.fileInput.addEventListener('change', () => this.handleFileUpload());
            this.elements.supportForm.addEventListener('submit', (event) => {
                event.preventDefault();
                this.handleFormSubmit();
            });
        }
    }

    filterHelpTopics() {
        const searchTerm = this.elements.helpSearchInput.value.toLowerCase();
        const allContent = document.querySelectorAll('.faq-category, .topic-card');

        allContent.forEach(element => {
            const contentText = element.textContent.toLowerCase();
            if (contentText.includes(searchTerm)) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });
    }

    updateCharCount() {
        const count = this.elements.messageTextarea.value.length;
        this.elements.charCount.textContent = count;
        if (count > 1000) {
            this.elements.charCount.style.color = 'var(--error-color)';
        } else {
            this.elements.charCount.style.color = 'var(--text-secondary)';
        }
    }

    handleFileUpload() {
        this.elements.filePreview.innerHTML = ''; // Clear previous previews
        const files = this.elements.fileInput.files;

        if (files.length > 0) {
            Array.from(files).forEach(file => {
                const filePill = document.createElement('div');
                filePill.className = 'file-pill';
                filePill.textContent = file.name;
                this.elements.filePreview.appendChild(filePill);
            });
        }
    }

    handleFormSubmit() {
        console.log('Support form submitted.');
        // In a real app, you would collect form data and send to a support system
        
        if (this.app.notifications) {
            this.app.notifications.show('Your support ticket has been submitted!', 'success');
        } else {
            alert('Your support ticket has been submitted!');
        }

        this.elements.supportForm.reset();
        this.elements.filePreview.innerHTML = '';
        this.updateCharCount();
    }
}


// Initialize the manager when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only run this script on the help page
    if (document.querySelector('.help-hero')) {
        new HelpCenterManager().init();
    }
});