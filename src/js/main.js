/* ============================================
   LUMINA EXPERIMENTAL - MAIN ENTRY POINT
   ============================================ */

import { cursor } from './cursor.js';
import { initMagnetic } from './magnetic.js';
import { initScrollAnimations } from './scroll-animations.js';
import { initKineticText } from './kinetic-text.js';
import { initTilt } from './tilt.js';

// ============================================
// SMOOTH SCROLL (using native CSS)
// ============================================
function initSmoothScroll() {
  // Already handled via CSS scroll-behavior: smooth
  // This function can be expanded for Lenis integration if needed

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ============================================
// PRELOADER (Optional)
// ============================================
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('is-hidden');
      document.body.classList.add('is-loaded');
    }, 500);
  });
}

// ============================================
// MOBILE NAVIGATION
// ============================================
function initMobileNav() {
  const toggle = document.querySelector('.nav__menu');
  const mobileMenu = document.querySelector('.nav__mobile-menu');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link');

  if (!toggle || !mobileMenu) return;

  function openMenu() {
    toggle.classList.add('is-active');
    toggle.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('is-open');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    toggle.classList.remove('is-active');
    toggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }

  // Toggle menu on hamburger click
  toggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking a link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Close menu on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

// ============================================
// INITIALIZE ALL MODULES
// ============================================
function init() {
  // Core interactions
  initMagnetic();
  initTilt();

  // Animations
  initScrollAnimations();
  initKineticText();

  // Navigation & scroll
  initSmoothScroll();
  initPreloader();
  initMobileNav();

  // Refresh cursor bindings after dynamic content
  cursor.refresh();

  console.log('🌟 Lumina Experimental initialized');
}

// ============================================
// DOM READY
// ============================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ============================================
// EXPORTS (for debugging in console)
// ============================================
window.Lumina = {
  cursor,
  initMagnetic,
  initScrollAnimations,
  initKineticText,
  initTilt
};
