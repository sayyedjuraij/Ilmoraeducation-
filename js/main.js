// 3D Card Tilt Effect Initialization
const tiltElements = document.querySelectorAll('.tilt-card');
function initTiltEffect(){
    tiltElements.forEach(element => {
        // Add event listeners for mouse movement
        element.addEventListener('mousemove', (e) => {
            const { width, height } = element.getBoundingClientRect();
            const x = e.clientX - element.offsetLeft;
            const y = e.clientY - element.offsetTop;
            const xMove = (x / width) * 100;
            const yMove = (y / height) * 100;
            element.style.transform = `rotateY(${(xMove - 50) / 5}deg) rotateX(${(50 - yMove) / 5}deg)`;
        });
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });
    });
}

// Mouse-follow Effect for Hero Section
const heroSection = document.querySelector('.hero');
function initMouseFollow(){
    heroSection.addEventListener('mousemove', (e) => {
        const { width, height } = heroSection.getBoundingClientRect();
        const x = (e.clientX / width) * 100;
        const y = (e.clientY / height) * 100;
        heroSection.style.backgroundPosition = `${x}% ${y}%`;
    });
}

// Enhanced Scroll Animations with Perspective
function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('.scroll-animation');
    window.addEventListener('scroll', () => {
        scrollElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const viewportHeight = window.innerHeight;
            if (elementPosition < viewportHeight) {
                element.style.transform = 'translateY(0)';
                element.style.opacity = '1';
            } else {
                element.style.transform = 'translateY(50px)';
                element.style.opacity = '0';
            }
        });
    });
}

// Initialize all effects
document.addEventListener('DOMContentLoaded', () => {
    initTiltEffect();
    initMouseFollow();
    initScrollAnimations();
});
