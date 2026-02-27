// ==========================================
// SMOOTH SCROLL & NAVIGATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Smooth scroll for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ==========================================
    // SCROLL ANIMATIONS
    // ==========================================

    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.team-card, .service-card');

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight * 0.85 && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial check
    animateOnScroll();

    // On scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(() => {
            animateOnScroll();
        });
    });

    // ==========================================
    // HEADER BACKGROUND ON SCROLL
    // ==========================================

    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
        } else {
            header.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // ==========================================
    // PARALLAX EFFECT (SUBTLE)
    // ==========================================

    const parallaxElements = document.querySelectorAll('.hero, .services-section');

    window.addEventListener('scroll', () => {
        parallaxElements.forEach(element => {
            const scrolled = window.pageYOffset;
            const elementTop = element.offsetTop;
            const elementHeight = element.offsetHeight;

            if (scrolled > elementTop - window.innerHeight && scrolled < elementTop + elementHeight) {
                const yPos = (scrolled - elementTop) * 0.3;
                element.style.backgroundPositionY = `${yPos}px`;
            }
        });
    });

    // ==========================================
    // FORM ENHANCEMENTS
    // ==========================================

    const form = document.querySelector('.contact-form');

    if (form) {
        // Form validation feedback
        const inputs = form.querySelectorAll('input, textarea');

        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    input.style.borderColor = '#e74c3c';
                } else {
                    input.style.borderColor = 'transparent';
                }
            });

            input.addEventListener('focus', () => {
                input.style.borderColor = 'var(--color-accent)';
            });
        });

        // Form submit (placeholder - replace with actual backend)
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('.form-submit');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span>Wird gesendet...</span>';
            submitBtn.disabled = true;

            // Simulate sending (replace with actual API call)
            setTimeout(() => {
                submitBtn.innerHTML = '<span>✓ Gesendet!</span>';
                submitBtn.style.background = '#27ae60';

                setTimeout(() => {
                    form.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 2000);
            }, 1500);
        });
    }

    // ==========================================
    // PERFORMANCE: REDUCE ANIMATIONS ON MOBILE
    // ==========================================

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (mediaQuery.matches) {
        document.querySelectorAll('*').forEach(element => {
            element.style.animation = 'none';
            element.style.transition = 'none';
        });
    }

});
