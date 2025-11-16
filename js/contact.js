// js/contact.js - Page-Specific JavaScript for contact.html

class ContactPageManager {
    constructor() {
        this.app = window.app || {}; // Access the global app instance
        console.log('📞 Contact Page Manager Initialized');
    }

    init() {
        this.cacheDOMElements();
        this.bindEvents();
        this.initMap();
    }

    cacheDOMElements() {
        this.elements = {
            contactForm: document.getElementById('contact-form'),
            nameInput: document.getElementById('name'),
            emailInput: document.getElementById('email'),
            subjectSelect: document.getElementById('subject'),
            messageTextarea: document.getElementById('message'),
            charCount: document.getElementById('char-count'),
        };
    }

    bindEvents() {
        if (!this.elements.contactForm) return;

        // --- Real-time validation on input ---
        this.elements.nameInput.addEventListener('input', () => this.validateName());
        this.elements.emailInput.addEventListener('input', () => this.validateEmail());
        this.elements.subjectSelect.addEventListener('change', () => this.validateSubject());
        this.elements.messageTextarea.addEventListener('input', () => this.validateMessage());

        // --- Character counter ---
        this.elements.messageTextarea.addEventListener('input', () => this.updateCharCount());

        // --- Form submission ---
        this.elements.contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (this.validateForm()) {
                this.handleFormSubmit();
            }
        });
    }
    
    // --- Validation Logic ---

    validateName() {
        return this.validateField(this.elements.nameInput, this.elements.nameInput.value.length >= 3, 'Full name must be at least 3 characters.');
    }

    validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return this.validateField(this.elements.emailInput, emailRegex.test(this.elements.emailInput.value), 'Please enter a valid email address.');
    }

    validateSubject() {
        return this.validateField(this.elements.subjectSelect, this.elements.subjectSelect.value !== '', 'Please select a subject.');
    }

    validateMessage() {
        return this.validateField(this.elements.messageTextarea, this.elements.messageTextarea.value.length >= 10, 'Message must be at least 10 characters long.');
    }

    validateField(field, condition, errorMessage) {
        const feedback = field.nextElementSibling;
        if (condition) {
            field.classList.remove('invalid');
            feedback.textContent = '';
            return true;
        } else {
            field.classList.add('invalid');
            feedback.textContent = errorMessage;
            return false;
        }
    }
    
    validateForm() {
        // Run all validations and return true only if all are successful
        const isNameValid = this.validateName();
        const isEmailValid = this.validateEmail();
        const isSubjectValid = this.validateSubject();
        const isMessageValid = this.validateMessage();
        return isNameValid && isEmailValid && isSubjectValid && isMessageValid;
    }
    
    updateCharCount() {
        const count = this.elements.messageTextarea.value.length;
        this.elements.charCount.textContent = count;
        if (count > 500) {
            this.elements.charCount.style.color = 'var(--error-color)';
        } else {
            this.elements.charCount.style.color = 'var(--text-secondary)';
        }
    }

    handleFormSubmit() {
        console.log('Form is valid. Submitting...');
        // In a real app, you would send this data to a server
        // For now, we'll just show a success message
        
        if (this.app.notifications) {
            this.app.notifications.show('Your message has been sent successfully!', 'success');
        } else {
            alert('Your message has been sent successfully!');
        }

        this.elements.contactForm.reset();
        this.updateCharCount();
    }
    
    // --- Interactive Map & Button Handlers ---

    initMap() {
        // This is a placeholder. A real implementation would use Google Maps API, etc.
        // For now, we just make the buttons work.
    }

    openInGoogleMaps() {
        const address = "No. 1 Campground Rd, Anthony Village, Lagos";
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
    }

    callNumber(number) {
        window.location.href = `tel:${number}`;
    }

    composeEmail() {
        window.location.href = 'mailto:support@tangogi.com';
    }
}


// Attach methods to the global `app` object so HTML onclick can find them
// This is a simple way to connect inline event handlers to our class methods.
function setupGlobalAppHandlers(manager) {
    if (!window.app) window.app = {};
    window.app.openInGoogleMaps = manager.openInGoogleMaps.bind(manager);
    window.app.callNumber = manager.callNumber.bind(manager);
    window.app.composeEmail = manager.composeEmail.bind(manager);
    // getDirections is the same as openInGoogleMaps for this example
    window.app.getDirections = manager.openInGoogleMaps.bind(manager);
}


// Initialize the manager when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only run this script on the contact page
    if (document.querySelector('.contact-hero')) {
        const contactManager = new ContactPageManager();
        contactManager.init();
        setupGlobalAppHandlers(contactManager); // Make functions available to HTML
    }
});