document.addEventListener('DOMContentLoaded', () => {
    // Navbar Burger
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    if ($navbarBurgers.length > 0) {
        $navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {
                const target = el.dataset.target;
                const $target = document.getElementById(target);
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');
            });
        });
    }

    // Modals
    function openModal($el) {
        $el.classList.add('is-active');
    }

    function closeModal($el) {
        $el.classList.remove('is-active');
    }

    function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal);
        });
    }

    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);

        $trigger.addEventListener('click', () => {
            openModal($target);
        });
    });

    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });

    document.addEventListener('keydown', (event) => {
        const e = event || window.event;
        if (e.keyCode === 27) { // Escape key
            closeAllModals();
        }
    });

    // Intersection Observer for Scroll Animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Once animated, we can stop observing this element
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.fadeInUp, .fadeIn');
    animatedElements.forEach(el => animationObserver.observe(el));

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');
            if (answer.style.display === 'none') {
                answer.style.display = 'block';
                icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
            } else {
                answer.style.display = 'none';
                icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
            }
        });
    });

    // Agenda Carousel
    const agendaSlides = document.getElementById('agendaSlides');
    if (agendaSlides) {
        const slides = document.querySelectorAll('.agenda-slide');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const dots = document.querySelectorAll('.dot');
        let currentSlide = 0;

        function getItemsPerView() {
            return window.innerWidth > 768 ? 3 : 1;
        }

        function updateCarousel() {
            const itemsPerView = getItemsPerView();
            const maxSlide = slides.length - itemsPerView;
            if (currentSlide > maxSlide) currentSlide = maxSlide;
            if (currentSlide < 0) currentSlide = 0;

            const offset = (currentSlide * (100 / itemsPerView));
            agendaSlides.style.transform = `translateX(-${offset}%)`;
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('is-active', index === Math.floor(currentSlide / itemsPerView));
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const itemsPerView = getItemsPerView();
                currentSlide = Math.max(0, currentSlide - itemsPerView);
                updateCarousel();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const itemsPerView = getItemsPerView();
                const maxSlide = slides.length - itemsPerView;
                currentSlide = Math.min(maxSlide, currentSlide + itemsPerView);
                updateCarousel();
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const itemsPerView = getItemsPerView();
                currentSlide = index * itemsPerView;
                updateCarousel();
            });
        });

        window.addEventListener('resize', updateCarousel);
    }

    // Accommodation Fade Carousel
    const accommodationCarousels = document.querySelectorAll('.accommodation-carousel');
    accommodationCarousels.forEach(carousel => {
        const slides = carousel.querySelectorAll('.carousel-fade-slide');
        const interval = parseInt(carousel.dataset.interval) || 3000;
        let currentSlide = 0;

        if (slides.length > 1) {
            setInterval(() => {
                slides[currentSlide].classList.remove('is-active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('is-active');
            }, interval);
        }
    });

    // Lock Screen Logic
    const lockScreen = document.getElementById('lockScreen');
    if (lockScreen) {
        const lockInput = lockScreen.querySelector('.code-input');
        const correctCode = '2026';

        // Check if already unlocked
        if (localStorage.getItem('kimura_unlocked') === 'true') {
            lockScreen.classList.add('is-hidden');
            document.body.style.overflow = 'auto';
        } else {
            document.body.style.overflow = 'hidden';
            // Auto focus input
            setTimeout(() => lockInput.focus(), 500);
        }

        lockInput.addEventListener('input', (e) => {
            // Only allow numbers
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            
            if (e.target.value.length === 4) {
                if (e.target.value === correctCode) {
                    localStorage.setItem('kimura_unlocked', 'true');
                    lockScreen.classList.add('is-hidden');
                    document.body.style.overflow = 'auto';
                } else {
                    lockInput.classList.add('is-error');
                    setTimeout(() => lockInput.classList.remove('is-error'), 500);
                    e.target.value = '';
                }
            }
        });
    }

    // Registration Section Code Logic
    const regInput = document.querySelector('.reg-code');
    if (regInput) {
        const correctCode = '2026';
        const errorMsg = document.getElementById('regErrorMessage');

        regInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            
            if (e.target.value.length === 4) {
                if (e.target.value === correctCode) {
                    localStorage.setItem('kimura_unlocked', 'true');
                    window.location.href = 'pages/morocco-2026.html';
                } else {
                    errorMsg.classList.remove('is-hidden');
                    regInput.classList.add('is-error');
                    setTimeout(() => regInput.classList.remove('is-error'), 500);
                    e.target.value = '';
                }
            } else {
                errorMsg.classList.add('is-hidden');
            }
        });
    }
});
