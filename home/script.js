const navEl = document.querySelector('.nav');
const hamburgerEl = document.querySelector('.hamburger');

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

