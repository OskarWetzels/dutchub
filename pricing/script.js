const navEl = document.querySelector('.nav');
const hamburgerEl = document.querySelector('.hamburger');
// Mega menu elements
const megaMenuEl = document.getElementById('megaMenu');
const megaOpeners = [
    document.querySelector('.nav__link--how'),
    ...Array.from(document.querySelectorAll('.js-open-mega')),
].filter(Boolean);
const megaCloseBtn = megaMenuEl ? megaMenuEl.querySelector('.mega__menu__close') : null;
let lastFocusedElement = null;

let resizeTimer;

hamburgerEl.addEventListener('click', () => {
    // Remove no-transition class and add transition class for smooth animation
    navEl.classList.remove('no-transition');
    navEl.classList.add('is-transitioning');
    
    navEl.classList.toggle('nav--open');
    hamburgerEl.classList.toggle('hamburger--open');
});

// Disable transitions during resize to prevent animation
window.addEventListener('resize', () => {
    // Add no-transition class immediately to disable animations
    navEl.classList.add('no-transition');
    navEl.classList.remove('is-transitioning');
    
    // If window is resized above 900px, close the mobile menu
    if (window.innerWidth > 900) {
        navEl.classList.remove('nav--open');
        hamburgerEl.classList.remove('hamburger--open');
    }
    
    // Remove no-transition class after resize is complete
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        navEl.classList.remove('no-transition');
    }, 100);
});

// Mega menu logic
function openMega() {
    if (!megaMenuEl) return;
    lastFocusedElement = document.activeElement;
    megaMenuEl.classList.add('is-open');
    megaMenuEl.setAttribute('aria-hidden', 'false');
    const triggerBtn = document.querySelector('.nav__link--how');
    if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('scroll-lock', 'menu-open--mega');
    // Close the mobile nav if open
    navEl?.classList?.remove('nav--open');
    hamburgerEl?.classList?.remove('hamburger--open');
    // Focus close button for accessibility
    megaCloseBtn?.focus();
}

function closeMega() {
    if (!megaMenuEl) return;
    megaMenuEl.classList.add('is-closing');
    megaMenuEl.classList.remove('is-open');
    const triggerBtn = document.querySelector('.nav__link--how');
    if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'false');
    const sheet = megaMenuEl.querySelector('.mega__menu__sheet');
    // Make header visible immediately on close start (sheet sits above, so geen visuele overlap)
    document.body.classList.remove('menu-open--mega');
    const onEnd = (e) => {
        if (e.target !== sheet || e.propertyName !== 'transform') return;
        megaMenuEl.classList.remove('is-closing');
        megaMenuEl.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('scroll-lock', 'menu-open--mega');
        // restore focus
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
        sheet.removeEventListener('transitionend', onEnd);
    };
    sheet?.addEventListener('transitionend', onEnd);
}

megaOpeners.forEach((el) => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        openMega();
    });
});

megaCloseBtn?.addEventListener('click', closeMega);

// Close when clicking background outside inner content
megaMenuEl?.addEventListener('click', (e) => {
    if (e.target === megaMenuEl) {
        closeMega();
    }
});

// ESC key to close
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && megaMenuEl?.classList.contains('is-open')) {
        e.preventDefault();
        closeMega();
    }
});




// Language Selector Logic
const languageButton = document.getElementById('languageButton');
const languageDropdown = document.getElementById('languageDropdown');

if (languageButton && languageDropdown) {
    languageButton.addEventListener('click', (e) => {
        e.stopPropagation();
        languageDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language__selector')) {
            languageDropdown.classList.remove('show');
        }
    });

    const languageOptions = languageDropdown.querySelectorAll('.language__option');
    languageOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLang = option.getAttribute('data-lang');
            const selectedText = option.querySelector('.language__text').textContent;
            
            console.log('Language selected:', selectedLang, selectedText);
            
            languageDropdown.classList.remove('show');
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && languageDropdown.classList.contains('show')) {
            languageDropdown.classList.remove('show');
            languageButton.focus();
        }
    });
}
