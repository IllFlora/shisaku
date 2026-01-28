document.addEventListener('DOMContentLoaded', () => {

    // Scroll Animation (Fade Up)
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));

    // Parallax Effect for Hero
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroBg = document.querySelector('.hero-slider');
        const pageHeader = document.querySelector('.page-header');

        if (heroBg) {
            heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        if (pageHeader) {
            pageHeader.style.backgroundPositionY = `${scrolled * 0.5}px`;
        }
    });

    // Hero Slider
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    function nextSlide() {
        if (slides.length === 0) return;
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    if (slides.length > 0) {
        setInterval(nextSlide, slideInterval);
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Sticky Header
    const header = document.querySelector('header');
    const checkScroll = () => {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Initial check

    // Client Details Modals
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCards = document.querySelectorAll('.client-card[data-modal]');
    const closeButtons = document.querySelectorAll('.modal-close');
    const modals = document.querySelectorAll('.client-modal');

    // Open Modal
    modalCards.forEach(card => {
        card.addEventListener('click', () => {
            const modalId = card.getAttribute('data-modal');
            const targetModal = document.getElementById(modalId);

            if (targetModal && modalOverlay) {
                targetModal.classList.add('active');
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    });

    // Close Function
    const closeModal = () => {
        modals.forEach(modal => modal.classList.remove('active'));
        if (modalOverlay) modalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    };

    // Close on X click
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Close on Overlay click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const nav = document.querySelector('nav');

    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            nav.classList.toggle('nav-active');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when a link is clicked
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                nav.classList.remove('nav-active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

});
