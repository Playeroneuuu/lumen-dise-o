// ============================================
// SCRIPT PARA PÁGINA MINIMALISTA
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // 1. SMOOTH SCROLL
    // ========================================

    // Scroll suave para todos los enlaces
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function () {
            const featuredSection = document.querySelector('.featured-section');
            if (featuredSection) {
                featuredSection.scrollIntoView({ behavior: 'smooth' });
            }
        });

        // Ocultar scroll indicator al hacer scroll
        window.addEventListener('scroll', function () {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'all';
            }
        });
    }

    // ========================================
    // 2. TOAST NOTIFICATIONS
    // ========================================

    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toast-container') || (() => {
            const div = document.createElement('div');
            div.id = 'toast-container';
            Object.assign(div.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: '10000',
                display: 'flex',
                flexDirection: 'column-reverse',
                gap: '10px'
            });
            document.body.appendChild(div);
            return div;
        })();

        const toast = document.createElement('div');
        Object.assign(toast.style, {
            backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '4px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            opacity: '0',
            transition: 'all 0.3s ease',
            transform: 'translateY(20px)',
            fontSize: '14px'
        });
        toast.textContent = message;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 100);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ========================================
    // 3. VALIDACIÓN DE FORMULARIO CTA
    // ========================================

    const ctaForm = document.querySelector('.cta-form');
    if (ctaForm) {
        ctaForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailInput = this.querySelector('.cta-input');
            const email = emailInput.value.trim();

            // Validación simple de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                showToast('Por favor ingresa un email válido', 'error');
                emailInput.focus();
                return;
            }

            // Simular envío
            const submitBtn = this.querySelector('.cta-button');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showToast('¡Gracias por suscribirte! 🎉');
                emailInput.value = '';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // ========================================
    // 4. INTERACCIONES DE BOTONES
    // ========================================

    // Botones "Leer artículo"
    const readButtons = document.querySelectorAll('.btn-read');
    readButtons.forEach(button => {
        button.addEventListener('click', function () {
            const article = this.closest('.article');
            const title = article.querySelector('.article-title').textContent;
            console.log(`Navegando al artículo: ${title}`);
        });
    });

    // ========================================
    // 5. MENÚ MÓVIL
    // ========================================

    const menuMobile = document.querySelector('.menu-mobile');
    const nav = document.querySelector('.nav');

    if (menuMobile && nav) {
        menuMobile.addEventListener('click', function () {
            nav.classList.toggle('nav-mobile-active');

            const isActive = nav.classList.contains('nav-mobile-active');
            this.innerHTML = isActive
                ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
                : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        });
    }

    // ========================================
    // 6. ANIMACIONES AL HACER SCROLL
    // ========================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, observerOptions);

    // Observar artículos
    document.querySelectorAll('.article, .featured-card').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });

    // ========================================
    // 7. ESTILOS DINÁMICOS
    // ========================================

    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 767px) {
            .nav {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                background: rgba(0, 0, 0, 0.98);
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 2rem;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
                z-index: 1000;
            }
            
            .nav-mobile-active {
                display: flex !important;
                opacity: 1 !important;
                pointer-events: all !important;
            }
            
            .menu-mobile {
                position: relative;
                z-index: 1001;
            }
        }
    `;
    document.head.appendChild(style);

    console.log('✅ Script cargado correctamente - Página Minimalista');
});
