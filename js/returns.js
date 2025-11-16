// js/returns.js - Page-Specific JavaScript for returns.html

class ReturnsPageManager {
    constructor() {
        this.app = window.app || {};
        this.currentWizardStep = 1;
        console.log('🔄 Returns Page Manager Initialized');
    }

    init() {
        this.cacheDOMElements();
        this.bindEvents();
    }

    cacheDOMElements() {
        this.elements = {
            // Main action buttons
            startReturnBtn: document.getElementById('start-return'),
            trackReturnBtn: document.getElementById('track-return'),
            returnHelpBtn: document.getElementById('return-help'),

            // FAQ items
            faqItems: document.querySelectorAll('.returns-faq-section .faq-item'),
            
            // Modals
            startReturnModal: document.getElementById('start-return-modal'),
            trackReturnModal: document.getElementById('track-return-modal'),
            modalCloseButtons: document.querySelectorAll('.modal-close'),

            // Wizard elements
            wizardSteps: document.querySelectorAll('.wizard-step'),
            wizardPrevBtn: document.getElementById('wizard-prev'),
            wizardNextBtn: document.getElementById('wizard-next'),
            wizardSubmitBtn: document.getElementById('wizard-submit'),
        };
    }

    bindEvents() {
        // --- Main Action Buttons ---
        if (this.elements.startReturnBtn) {
            this.elements.startReturnBtn.addEventListener('click', () => this.openModal(this.elements.startReturnModal));
        }
        if (this.elements.trackReturnBtn) {
            this.elements.trackReturnBtn.addEventListener('click', () => this.openModal(this.elements.trackReturnModal));
        }
        if (this.elements.returnHelpBtn) {
            // Redirect to help page for more info
            this.elements.returnHelpBtn.addEventListener('click', () => window.location.href = 'help.html#returns');
        }

        // --- Accordion Functionality ---
        this.elements.faqItems.forEach(item => {
            const questionButton = item.querySelector('.faq-question');
            if (questionButton) {
                questionButton.addEventListener('click', () => {
                    item.classList.toggle('active');
                });
            }
        });

        // --- Modal Closing ---
        this.elements.modalCloseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                this.closeModal(modal);
            });
        });

        // --- Return Wizard Navigation ---
        if (this.elements.wizardNextBtn) {
            this.elements.wizardNextBtn.addEventListener('click', () => this.navigateWizard(1));
        }
        if (this.elements.wizardPrevBtn) {
            this.elements.wizardPrevBtn.addEventListener('click', () => this.navigateWizard(-1));
        }
        if (this.elements.wizardSubmitBtn) {
            this.elements.wizardSubmitBtn.addEventListener('click', () => this.submitReturnRequest());
        }
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

    navigateWizard(direction) {
        const nextStep = this.currentWizardStep + direction;

        // In a real app, you would add validation here before proceeding
        
        this.goToWizardStep(nextStep);
    }
    
    goToWizardStep(stepNumber) {
        this.currentWizardStep = stepNumber;

        // Show/hide the correct step panel
        this.elements.wizardSteps.forEach(step => {
            step.classList.toggle('active', parseInt(step.dataset.step) === this.currentWizardStep);
        });

        // Update button visibility
        this.elements.wizardPrevBtn.style.display = this.currentWizardStep > 1 ? 'inline-flex' : 'none';
        this.elements.wizardNextBtn.style.display = this.currentWizardStep < this.elements.wizardSteps.length ? 'inline-flex' : 'none';
        this.elements.wizardSubmitBtn.style.display = this.currentWizardStep === this.elements.wizardSteps.length ? 'inline-flex' : 'none';
    }

    submitReturnRequest() {
        console.log('Return request submitted.');
        // In a real app, you would collect form data and send it to a server.
        
        this.closeModal(this.elements.startReturnModal);
        
        if (this.app.notifications) {
            this.app.notifications.show('Return request submitted successfully!', 'success');
        } else {
            alert('Return request submitted successfully!');
        }
        
        // Reset wizard to first step for next time
        this.goToWizardStep(1);
    }
}


// Initialize the manager when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only run this script on the returns page
    if (document.querySelector('.returns-hero')) {
        new ReturnsPageManager().init();
    }
});
