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

let menuState = 'closed'; // 'closed', 'mega', 'mobile'

hamburgerEl.addEventListener('click', () => {
    if (window.innerWidth <= 900) {
        // On 'How dutchub works' pages, cycle through: closed > mega > mobile > closed
        if (menuState === 'closed') {
            // Open mega menu
            openMega();
            menuState = 'mega';
        } else if (menuState === 'mega') {
            // Close mega and open mobile nav
            closeMega();
            setTimeout(() => {
                navEl.classList.add('nav--from-mega'); // Add special class for top-down animation
                navEl.classList.remove('no-transition');
                navEl.classList.add('is-transitioning');
                navEl.classList.add('nav--open');
                hamburgerEl.classList.add('hamburger--open');
                menuState = 'mobile';
            }, 100);
        } else if (menuState === 'mobile') {
            // Close mobile nav
            navEl.classList.remove('no-transition');
            navEl.classList.add('is-transitioning');
            navEl.classList.remove('nav--open');
            navEl.classList.remove('nav--from-mega'); // Remove special class when closing
            hamburgerEl.classList.remove('hamburger--open');
            menuState = 'closed';
        }
    } else {
        // Desktop behavior remains the same
        navEl.classList.remove('no-transition');
        navEl.classList.add('is-transitioning');
        
        navEl.classList.toggle('nav--open');
        hamburgerEl.classList.toggle('hamburger--open');
    }
});

// Disable transitions during resize to prevent animation
window.addEventListener('resize', () => {
    // Add no-transition class immediately to disable animations
    navEl.classList.add('no-transition');
    navEl.classList.remove('is-transitioning');
    
    // If window is resized above 900px, close the mobile menu and reset state
    if (window.innerWidth > 900) {
        navEl.classList.remove('nav--open');
        navEl.classList.remove('nav--from-mega');
        hamburgerEl.classList.remove('hamburger--open');
        menuState = 'closed';
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
        
        // If on mobile and menuState was 'mega', open mobile nav next with top-down animation
        if (window.innerWidth <= 900 && menuState === 'mega') {
            setTimeout(() => {
                navEl.classList.add('nav--from-mega'); // Add special class for top-down animation
                navEl.classList.remove('no-transition');
                navEl.classList.add('is-transitioning');
                navEl.classList.add('nav--open');
                hamburgerEl.classList.add('hamburger--open');
                menuState = 'mobile';
            }, 100);
        } else {
            // Reset menu state when mega menu is closed via other means (ESC, background click, etc)
            menuState = 'closed';
        }
        
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
        // Reset to closed when clicking background (skip mobile nav step)
        const originalState = menuState;
        menuState = 'closed'; // Set to closed so closeMega doesn't open mobile nav
        closeMega();
        // Restore original state briefly for the transition logic, then reset
        setTimeout(() => { menuState = 'closed'; }, 50);
    }
});

// ESC key to close
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && megaMenuEl?.classList.contains('is-open')) {
        e.preventDefault();
        // Reset to closed when pressing ESC (skip mobile nav step)
        const originalState = menuState;
        menuState = 'closed'; // Set to closed so closeMega doesn't open mobile nav
        closeMega();
        // Restore original state briefly for the transition logic, then reset
        setTimeout(() => { menuState = 'closed'; }, 50);
    }
});

// Language Selector Logic



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
