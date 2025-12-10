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
