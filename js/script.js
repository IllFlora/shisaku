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
        // stop writing styles once it's scrolled away. Skipped entirely for
        // users who prefer reduced motion.
        if (heroSlider && !reduceMotion) {
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

    // Hero Slider — slides 2-3 are deferred via data-bg so their images don't
    // compete with the LCP image at first paint; they hydrate after load and
    // the rotation never advances onto a slide whose image isn't ready yet.
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    function hydrateDeferredSlides() {
        document.querySelectorAll('.slide[data-bg]').forEach(slide => {
            const src = slide.dataset.bg;
            const img = new Image();
            img.onload = () => {
                slide.style.backgroundImage = `url('${src}')`;
                delete slide.dataset.bg;
            };
            img.src = src;
        });
    }

    function nextSlide() {
        if (slides.length === 0) return;
        const next = (currentSlide + 1) % slides.length;
        if (slides[next].dataset.bg) return; // image not ready — retry next tick
        slides[currentSlide].classList.remove('active');
        currentSlide = next;
        slides[currentSlide].classList.add('active');
    }

    if (slides.length > 0) {
        window.addEventListener('load', hydrateDeferredSlides);
        if (!reduceMotion) {
            setInterval(nextSlide, slideInterval);
        }
    }

    // Smooth Scrolling for Anchor Links (skip bare "#" links like the JP|EN
    // switch, and move focus to the target for keyboard/skip-link users)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: reduceMotion ? 'auto' : 'smooth'
                });
                target.focus({ preventScroll: true });
            }
        });
    });

    // (Sticky header is handled in the rAF scroll loop above.)

    // (Client-detail modals were removed from the markup; their JS is gone too.)

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
