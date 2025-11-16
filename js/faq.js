// js/faq.js - Page-Specific JavaScript for faq.html

class FaqPageManager {
    constructor() {
        console.log('❓ FAQ Page Manager Initialized');
    }

    init() {
        this.cacheDOMElements();
        this.bindEvents();
    }

    cacheDOMElements() {
        this.elements = {
            faqSearchInput: document.getElementById('faq-search-input'),
            faqItems: document.querySelectorAll('.faq-item'),
            suggestionTags: document.querySelectorAll('.suggestion-tag'),
            helpfulButtons: document.querySelectorAll('.helpful-btn'),
            suggestQuestionBtn: document.getElementById('suggest-question'),
            suggestModal: document.getElementById('suggest-question-modal'),
            modalCloseButtons: document.querySelectorAll('.modal-close'),
        };
    }

    bindEvents() {
        // --- Accordion Functionality ---
        this.elements.faqItems.forEach(item => {
            const questionButton = item.querySelector('.faq-question');
            questionButton.addEventListener('click', () => {
                // If this item is already open, close it. Otherwise, open it.
                const isOpen = item.classList.contains('active');
                
                // Optional: Close all others before opening a new one
                // this.elements.faqItems.forEach(i => i.classList.remove('active'));

                if (!isOpen) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        });

        // --- Search Functionality ---
        this.elements.faqSearchInput.addEventListener('input', () => this.filterFaqs());
        
        this.elements.suggestionTags.forEach(tag => {
            tag.addEventListener('click', () => {
                this.elements.faqSearchInput.value = tag.dataset.search;
                this.filterFaqs();
            });
        });

        // --- Helpful Button Feedback ---
        this.elements.helpfulButtons.forEach(button => {
            button.addEventListener('click', () => {
                const parent = button.parentElement;
                parent.querySelectorAll('.helpful-btn').forEach(btn => btn.disabled = true);
                button.classList.add('selected');
                // In a real app, you'd send this feedback to an analytics service
                console.log(`Feedback received: ${button.dataset.helpful}`);
            });
        });

        // --- Modal Triggers ---
        if (this.elements.suggestQuestionBtn) {
            this.elements.suggestQuestionBtn.addEventListener('click', () => this.openModal(this.elements.suggestModal));
        }

        // --- Modal Closing ---
        this.elements.modalCloseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                this.closeModal(modal);
            });
        });
    }

    filterFaqs() {
        const searchTerm = this.elements.faqSearchInput.value.toLowerCase();

        this.elements.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question span').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();

            // If the search term is found in the question or answer, show the item. Otherwise, hide it.
            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    openModal(modal) {
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

// Initialize the manager when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only run this script on the FAQ page
    if (document.querySelector('.faq-hero')) {
        new FaqPageManager().init();
    }
});