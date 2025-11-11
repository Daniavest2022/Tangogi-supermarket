// js/about.js
export class AboutManager {
    constructor(app) {
        this.app = app;
        this.animated = false;
    }

    init() {
        console.log('📖 About Manager Initialized');
        this.bindAboutEvents();
        this.setupAnimations();
        this.initializeCounters();
        this.setupScrollAnimations();
    }

    bindAboutEvents() {
        // Smooth scrolling for anchor links
        this.bindSmoothScrolling();
        
        // Hero section interactions
        this.bindHeroInteractions();
        
        // Team member interactions
        this.bindTeamInteractions();
        
        // Testimonial interactions
        this.bindTestimonialInteractions();
        
        // CTA button tracking
        this.bindCTATracking();
    }

    bindSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL without page jump
                    history.pushState(null, null, `#${targetId}`);
                }
            });
        });
    }

    bindHeroInteractions() {
        const heroSection = document.querySelector('.about-hero');
        const floatingElements = document.querySelectorAll('.floating-element');
        
        if (heroSection) {
            // Parallax effect for floating elements
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                floatingElements.forEach((element, index) => {
                    const speed = 0.3 + (index * 0.1);
                    element.style.transform = `translateY(${rate * speed}px)`;
                });
            });

            // Hover effects for floating elements
            floatingElements.forEach(element => {
                element.addEventListener('mouseenter', () => {
                    element.style.transform = 'scale(1.1) rotate(5deg)';
                    element.style.transition = 'transform 0.3s ease';
                });
                
                element.addEventListener('mouseleave', () => {
                    element.style.transform = 'scale(1) rotate(0deg)';
                });
            });
        }
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger counter animation for stats
                    if (entry.target.classList.contains('stats-bar')) {
                        this.animateCounters();
                    }
                    
                    // Trigger team member animations
                    if (entry.target.classList.contains('team-section')) {
                        this.animateTeamMembers();
                    }
                    
                    // Trigger testimonial animations
                    if (entry.target.classList.contains('testimonials-section')) {
                        this.animateTestimonials();
                    }
                }
            });
        }, observerOptions);

        // Observe all sections for animation
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    initializeCounters() {
        // Initialize counter elements
        const counters = document.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            counter.textContent = '0';
        });
    }

    animateCounters() {
        if (this.animated) return;
        
        const counters = document.querySelectorAll('[data-count]');
        const speed = 200; // Lower is faster

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText;
            
            const inc = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(() => this.animateCounters(), 1);
            } else {
                counter.innerText = this.formatNumber(target);
            }
        });
        
        this.animated = true;
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    bindTeamInteractions() {
        const teamMembers = document.querySelectorAll('.team-member');
        
        teamMembers.forEach(member => {
            member.addEventListener('mouseenter', () => {
                member.style.transform = 'translateY(-10px)';
                member.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                member.style.transition = 'all 0.3s ease';
            });
            
            member.addEventListener('mouseleave', () => {
                member.style.transform = 'translateY(0)';
                member.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            });

            // Click to show more info
            member.addEventListener('click', () => {
                this.showTeamMemberDetail(member);
            });
        });
    }

    showTeamMemberDetail(member) {
        const name = member.querySelector('h3').textContent;
        const role = member.querySelector('.member-role').textContent;
        const bio = member.querySelector('.member-bio').textContent;
        
        // Create modal or expand member info
        this.app.notifications.show(`Learn more about ${name} - ${role}`, 'info');
        
        // You could implement a modal here
        console.log(`Team Member: ${name}, Role: ${role}, Bio: ${bio}`);
    }

    bindTestimonialInteractions() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        testimonialCards.forEach((card, index) => {
            // Staggered appearance
            card.style.animationDelay = `${index * 0.2}s`;
            
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'scale(1.05)';
                card.style.zIndex = '10';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'scale(1)';
                card.style.zIndex = '1';
            });

            // Click to share testimonial
            card.addEventListener('click', () => {
                this.shareTestimonial(card);
            });
        });
    }

    shareTestimonial(card) {
        const content = card.querySelector('p').textContent;
        const author = card.querySelector('.testimonial-author strong').textContent;
        
        if (navigator.share) {
            navigator.share({
                title: `Testimonial from ${author}`,
                text: content,
                url: window.location.href
            }).catch(error => console.log('Error sharing:', error));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`"${content}" - ${author}`).then(() => {
                this.app.notifications.show('Testimonial copied to clipboard!', 'success');
            });
        }
    }

    bindCTATracking() {
        const ctaButtons = document.querySelectorAll('.cta-buttons .btn');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const buttonText = button.textContent.trim();
                const buttonType = button.classList.contains('btn-primary') ? 'primary' : 'secondary';
                
                // Track CTA clicks
                this.trackCTAClick(buttonText, buttonType);
                
                // Add visual feedback
                this.animateButtonClick(button);
            });
        });
    }

    trackCTAClick(buttonText, buttonType) {
        // Analytics tracking
        console.log(`CTA Clicked: ${buttonText} (${buttonType})`);
        
        // You can integrate with analytics service here
        if (this.app.analytics) {
            this.app.analytics.trackEvent('about_page_cta', {
                button_text: buttonText,
                button_type: buttonType,
                page_section: 'cta_section'
            });
        }
    }

    animateButtonClick(button) {
        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }

    animateTeamMembers() {
        const teamMembers = document.querySelectorAll('.team-member');
        
        teamMembers.forEach((member, index) => {
            member.style.animationDelay = `${index * 0.3}s`;
            member.classList.add('animate-slide-up');
        });
    }

    animateTestimonials() {
        const testimonials = document.querySelectorAll('.testimonial-card');
        
        testimonials.forEach((testimonial, index) => {
            testimonial.style.animationDelay = `${index * 0.2}s`;
            testimonial.classList.add('animate-fade-in');
        });
    }

    setupScrollAnimations() {
        // Progress indicator for story timeline
        this.setupTimelineProgress();
        
        // Parallax for sustainability section
        this.setupSustainabilityParallax();
    }

    setupTimelineProgress() {
        const timeline = document.querySelector('.story-timeline');
        if (!timeline) return;

        const timelineItems = timeline.querySelectorAll('.timeline-item');
        
        window.addEventListener('scroll', () => {
            const timelineTop = timeline.offsetTop;
            const timelineHeight = timeline.offsetHeight;
            const scrollPosition = window.pageYOffset + window.innerHeight;
            
            timelineItems.forEach((item, index) => {
                const itemTop = item.offsetTop;
                const progress = (scrollPosition - itemTop) / window.innerHeight;
                
                if (progress > 0.3 && progress < 0.7) {
                    item.classList.add('active');
                }
            });
        });
    }

    setupSustainabilityParallax() {
        const sustainabilitySection = document.querySelector('.sustainability-section');
        if (!sustainabilitySection) return;

        const ecoBadge = sustainabilitySection.querySelector('.eco-badge');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const sectionTop = sustainabilitySection.offsetTop;
            const sectionHeight = sustainabilitySection.offsetHeight;
            
            if (scrolled > sectionTop - window.innerHeight && scrolled < sectionTop + sectionHeight) {
                const rate = (scrolled - sectionTop) * 0.3;
                if (ecoBadge) {
                    ecoBadge.style.transform = `translateY(${rate}px) rotate(${rate * 0.1}deg)`;
                }
            }
        });
    }

    // Utility method to check if element is in viewport
    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Cleanup method
    destroy() {
        // Remove event listeners and clean up
        window.removeEventListener('scroll', this.handleScroll);
    }
}