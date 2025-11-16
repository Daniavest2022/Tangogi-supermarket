// js/terms.js - Page-Specific JavaScript for terms.html

class TermsPageManager {
    constructor() {
        this.app = window.app || {};
        console.log('⚖️ Terms of Service Page Manager Initialized');
    }

    init() {
        this.cacheDOMElements();
        this.bindEvents();
    }

    cacheDOMElements() {
        this.elements = {
            // Tab navigation
            navItems: document.querySelectorAll('.terms-nav .nav-item'),
            sections: document.querySelectorAll('.terms-section'),

            // Modals and triggers
            viewChangesBtn: document.getElementById('view-terms-changes'),
            changesModal: document.getElementById('terms-changes-modal'),
            acceptanceModal: document.getElementById('acceptance-modal'),
            modalCloseButtons: document.querySelectorAll('.modal-close'),
            
            // Acceptance modal logic
            acceptanceCheckboxes: document.querySelectorAll('#acceptance-modal input[type="checkbox"]'),
            confirmAcceptanceBtn: document.getElementById('confirm-acceptance'),
            declineTermsBtn: document.getElementById('decline-terms'),
        };
    }

    bindEvents() {
        // --- Tab Navigation ---
        this.elements.navItems.forEach(item => {
            item.addEventListener('click', () => this.handleNavClick(item));
        });

        // --- Modal Triggers ---
        if (this.elements.viewChangesBtn) {
            this.elements.viewChangesBtn.addEventListener('click', () => this.openModal(this.elements.changesModal));
        }
        
        // Example: Trigger acceptance modal (in a real app, this might be on signup)
        // For demonstration, let's say you have a button to trigger it. If not, this logic is ready for when you need it.
        // const someTriggerButton = document.getElementById('some-trigger');
        // if(someTriggerButton) someTriggerButton.addEventListener('click', () => this.openModal(this.elements.acceptanceModal));


        // --- Modal Closing ---
        this.elements.modalCloseButtons.forEach(button => {
            button.addEventListener('click', () => this.closeModal(button.closest('.modal')));
        });
        
        if (this.elements.declineTermsBtn) {
            this.elements.declineTermsBtn.addEventListener('click', () => this.closeModal(this.elements.acceptanceModal));
        }

        // --- Acceptance Modal Logic ---
        this.elements.acceptanceCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.checkAcceptanceState());
        });
        
        if (this.elements.confirmAcceptanceBtn) {
            this.elements.confirmAcceptanceBtn.addEventListener('click', () => {
                alert('Terms Accepted! Thank you.');
                this.closeModal(this.elements.acceptanceModal);
            });
        }
    }

    handleNavClick(clickedItem) {
        // Deactivate all
        this.elements.navItems.forEach(item => item.classList.remove('active'));
        this.elements.sections.forEach(section => section.classList.remove('active'));

        // Activate clicked item and corresponding section
        clickedItem.classList.add('active');
        const targetId = clickedItem.dataset.target + '-section';
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    openModal(modal) {
        if (modal) modal.style.display = 'flex';
    }

    closeModal(modal) {
        if (modal) modal.style.display = 'none';
    }

    checkAcceptanceState() {
        // Check if all three checkboxes are ticked
        const allChecked = Array.from(this.elements.acceptanceCheckboxes).every(checkbox => checkbox.checked);
        // Enable or disable the "I Accept" button
        this.elements.confirmAcceptanceBtn.disabled = !allChecked;
    }
}


// Initialize the manager when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only run this script on the terms page
    if (document.querySelector('.terms-hero')) {
        new TermsPageManager().init();
    }
});