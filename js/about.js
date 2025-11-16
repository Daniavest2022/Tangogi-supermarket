// js/about.js - Page-Specific JavaScript for about.html

class AboutPageManager {
    constructor() {
        console.log('📖 About Page Manager Initialized');
    }

    init() {
        this.setupIntersectionObserver();
    }

    // This function sets up an "observer" that watches for elements entering the screen.
    setupIntersectionObserver() {
        const options = {
            root: null, // observes intersections relative to the viewport
            rootMargin: '0px',
            threshold: 0.5 // Trigger when 50% of the element is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // If the element is intersecting (visible on screen)
                if (entry.isIntersecting) {
                    const element = entry.target;
                    // Check if it's a number counter and start the animation
                    if (element.matches('[data-count]')) {
                        this.animateCounter(element);
                    }
                    // Stop observing this element once it has been animated
                    observer.unobserve(element);
                }
            });
        }, options);

        // Tell the observer to watch all elements that have a 'data-count' attribute
        const counters = document.querySelectorAll('[data-count]');
        counters.forEach(counter => observer.observe(counter));
    }

    // This function handles the number counting animation
    animateCounter(element) {
        const target = parseInt(element.dataset.count, 10);
        const duration = 2000; // 2 seconds for the animation
        let start = 0;
        const stepTime = 20; // Update every 20ms
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;

        const updateCount = () => {
            start += increment;
            if (start < target) {
                element.textContent = Math.ceil(start).toLocaleString();
                requestAnimationFrame(updateCount);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        requestAnimationFrame(updateCount);
    }
}

// Initialize the manager when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // We only want this script to run on the "About" page,
    // so we check for an element that is unique to this page.
    if (document.querySelector('.about-hero')) {
        new AboutPageManager().init();
    }
});