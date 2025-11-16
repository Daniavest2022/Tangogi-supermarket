// js/register.js - Page-Specific JavaScript for register.html

class RegistrationManager {
    constructor() {
        this.app = window.app || {};
        this.currentStep = 1;
        console.log('✅ Registration Page Manager Initialized');
    }

    init() {
        this.cacheDOMElements();
        this.bindEvents();
    }

    cacheDOMElements() {
        this.elements = {
            form: document.getElementById('registration-form'),
            steps: document.querySelectorAll('.form-step'),
            progressSteps: document.querySelectorAll('.progress-steps .step'),
            progressFill: document.querySelector('.progress-fill'),
            nextButtons: document.querySelectorAll('.btn-next'),
            prevButtons: document.querySelectorAll('.btn-prev'),
            passwordInput: document.getElementById('password'),
            passwordStrengthFill: document.querySelector('.strength-fill'),
            passwordStrengthText: document.querySelector('.strength-text'),
        };
    }

    bindEvents() {
        if (!this.elements.form) return;

        // --- Step Navigation ---
        this.elements.nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                const nextStep = parseInt(button.dataset.next, 10);
                if (this.validateStep(this.currentStep)) {
                    this.goToStep(nextStep);
                }
            });
        });

        this.elements.prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                const prevStep = parseInt(button.dataset.prev, 10);
                this.goToStep(prevStep);
            });
        });
        
        // --- Password Strength ---
        if (this.elements.passwordInput) {
            this.elements.passwordInput.addEventListener('input', () => this.checkPasswordStrength());
        }

        // --- Final Form Submission ---
        this.elements.form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (this.validateStep(3)) {
                this.handleRegistration();
            }
        });
    }

    goToStep(stepNumber) {
        this.currentStep = stepNumber;

        // Update form steps visibility
        this.elements.steps.forEach(step => {
            step.classList.toggle('active', parseInt(step.dataset.step) === this.currentStep);
        });

        // Update progress bar
        this.elements.progressSteps.forEach(step => {
            step.classList.toggle('active', parseInt(step.dataset.step) <= this.currentStep);
        });
        
        const progressPercentage = ((this.currentStep - 1) / (this.elements.steps.length - 1)) * 100;
        this.elements.progressFill.style.width = `${progressPercentage}%`;
    }

    validateStep(stepNumber) {
        // This is a placeholder for real validation logic
        // In a real app, you would check each field in the current step
        console.log(`Validating step ${stepNumber}...`);
        // For now, we'll just return true to allow navigation
        return true;
    }

    checkPasswordStrength() {
        const password = this.elements.passwordInput.value;
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/\d/)) strength++;
        if (password.match(/[^a-zA-Z\d]/)) strength++;

        const strengthPercentage = (strength / 4) * 100;
        this.elements.passwordStrengthFill.style.width = `${strengthPercentage}%`;
        
        const strengthColors = ['#f44336', '#ff9800', '#ffeb3b', '#4caf50'];
        const strengthTexts = ['Weak', 'Medium', 'Good', 'Strong'];
        
        this.elements.passwordStrengthFill.style.backgroundColor = strengthColors[strength - 1] || '#eee';
        this.elements.passwordStrengthText.textContent = `Password strength: ${strengthTexts[strength - 1] || ''}`;
    }

    handleRegistration() {
        console.log('Form is valid. Simulating registration...');
        
        // In a real app, you would collect all form data and send it to a server.
        // For now, we'll just show a success message and redirect.

        alert('Account created successfully! Please check your email to verify.');
        window.location.href = 'login.html'; // Redirect to login page after successful registration
    }
}


// Initialize the manager when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only run this script on the registration page
    if (document.getElementById('registration-form')) {
        new RegistrationManager().init();
    }
});