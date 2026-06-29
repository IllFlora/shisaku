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
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    fadeElements.forEach(el => {
        if (!reduceMotion) {
            el.classList.add('motion-ready');
            observer.observe(el);
        } else {
            el.classList.add('visible');
        }
    });

    // Smooth scroll effects: hero parallax + sticky header, batched in one
    // requestAnimationFrame-throttled, passive scroll listener (no layout
    // thrash, GPU-accelerated transform — keeps scrolling buttery).
    const headerEl = document.querySelector('header');
    const heroSlider = document.querySelector('.hero-slider');
    let latestScrollY = window.scrollY;
    let scrollTicking = false;

    const onScrollFrame = () => {
        const y = latestScrollY;
        // Subtle parallax only while the hero is on screen; clamp past it so we
        // stop writing styles once it's scrolled away.
        if (heroSlider) {
            const limit = window.innerHeight;
            const shift = (y < limit ? y : limit) * 0.3;
            heroSlider.style.transform = `translate3d(0, ${shift}px, 0)`;
        }
        if (headerEl) {
            headerEl.classList.toggle('scrolled', y > 50);
        }
        scrollTicking = false;
    };

    window.addEventListener('scroll', () => {
        latestScrollY = window.scrollY;
        if (!scrollTicking) {
            scrollTicking = true;
            requestAnimationFrame(onScrollFrame);
        }
    }, { passive: true });
    onScrollFrame(); // set initial state

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

    // (Sticky header is handled in the rAF scroll loop above.)

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
        const navLinks = [...nav.querySelectorAll('a')];
        const isJapanese = document.documentElement.lang === 'ja';

        const setMenuState = (open, restoreFocus = false) => {
            mobileToggle.classList.toggle('active', open);
            nav.classList.toggle('nav-active', open);
            document.body.classList.toggle('no-scroll', open);
            mobileToggle.setAttribute('aria-expanded', String(open));
            mobileToggle.setAttribute('aria-label', open
                ? (isJapanese ? 'メニューを閉じる' : 'Close menu')
                : (isJapanese ? 'メニューを開く' : 'Open menu'));

            if (open && navLinks.length) {
                navLinks[0].focus();
            } else if (restoreFocus) {
                mobileToggle.focus();
            }
        };

        mobileToggle.addEventListener('click', () => {
            const isOpen = nav.classList.contains('nav-active');
            setMenuState(!isOpen, isOpen);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && nav.classList.contains('nav-active')) {
                setMenuState(false, true);
            }

            if (event.key === 'Tab' && nav.classList.contains('nav-active')) {
                const focusable = [mobileToggle, ...navLinks];
                const currentIndex = focusable.indexOf(document.activeElement);

                if (event.shiftKey && currentIndex <= 0) {
                    event.preventDefault();
                    focusable[focusable.length - 1].focus();
                } else if (!event.shiftKey && currentIndex === focusable.length - 1) {
                    event.preventDefault();
                    mobileToggle.focus();
                }
            }
        });

        // Close menu when a link is clicked
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                setMenuState(false);
            });
        });
    }

});
