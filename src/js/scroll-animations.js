/* ============================================
   SCROLL ANIMATIONS MODULE
   Uses GSAP ScrollTrigger
   ============================================ */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// HERO ANIMATIONS
// ============================================
export function initHeroAnimations() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Eyebrow
  tl.to('.hero__eyebrow', {
    opacity: 1,
    y: 0,
    duration: 0.8
  });

  // Title lines (staggered)
  tl.to('.hero__title-text', {
    opacity: 1,
    y: 0,
    duration: 1,
    stagger: 0.15
  }, '-=0.4');

  // Subtitle
  tl.to('.hero__subtitle', {
    opacity: 1,
    y: 0,
    duration: 0.8
  }, '-=0.6');

  // CTA buttons
  tl.to('.hero__cta', {
    opacity: 1,
    y: 0,
    duration: 0.8
  }, '-=0.5');

  // Scroll indicator
  tl.to('.hero__scroll', {
    opacity: 1,
    duration: 0.6
  }, '-=0.3');
}

// ============================================
// SCROLL-TRIGGERED REVEALS
// ============================================
export function initScrollReveals() {
  // Fade Up animations
  gsap.utils.toArray('[data-animate="fade-up"]').forEach((el) => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  // Fade In
  gsap.utils.toArray('[data-animate="fade-in"]').forEach((el) => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 1,
      duration: 1,
      ease: 'power2.out'
    });
  });

  // Scale Up
  gsap.utils.toArray('[data-animate="scale-up"]').forEach((el) => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  // Slide Left
  gsap.utils.toArray('[data-animate="slide-left"]').forEach((el) => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  // Slide Right
  gsap.utils.toArray('[data-animate="slide-right"]').forEach((el) => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  // Reveal (Clip Path)
  gsap.utils.toArray('[data-animate="reveal"]').forEach((el) => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      clipPath: 'inset(0 0 0 0)',
      duration: 1.2,
      ease: 'power4.inOut'
    });
  });

  // Staggered children
  gsap.utils.toArray('[data-animate="stagger"]').forEach((container) => {
    const children = container.children;

    gsap.to(children, {
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out'
    });
  });
}

// ============================================
// PARALLAX EFFECTS
// ============================================
export function initParallax() {
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax) || 0.5;

    gsap.to(el, {
      scrollTrigger: {
        trigger: el.parentElement || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      yPercent: -30 * speed,
      ease: 'none'
    });
  });
}

// ============================================
// SCROLL PROGRESS BAR
// ============================================
export function initScrollProgress() {
  const progress = document.querySelector('.scroll-progress');
  if (!progress) return;

  // Use vanilla JS scroll listener for better mobile compatibility
  function updateProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    progress.style.transform = `scaleX(${scrollPercent})`;
  }

  // Update on scroll with passive listener for performance
  window.addEventListener('scroll', updateProgress, { passive: true });

  // Initial update
  updateProgress();
}

// ============================================
// NAV SCROLL STATE
// ============================================
export function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => {
      if (self.direction === 1 && self.scroll() > 80) {
        nav.classList.add('is-scrolled');
      } else if (self.scroll() < 80) {
        nav.classList.remove('is-scrolled');
      }
    }
  });
}

// ============================================
// COUNTER ANIMATION
// ============================================
export function initCounters() {
  gsap.utils.toArray('[data-counter]').forEach((el) => {
    const target = parseInt(el.dataset.counter, 10);
    const suffix = el.dataset.counterSuffix || '';

    const obj = { value: 0 };

    gsap.to(obj, {
      scrollTrigger: {
        trigger: el,
        start: 'top 80%'
      },
      value: target,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = Math.round(obj.value) + suffix;
      }
    });
  });
}

// ============================================
// INITIALIZE ALL
// ============================================
export function initScrollAnimations() {
  initHeroAnimations();
  initScrollReveals();
  initParallax();
  initScrollProgress();
  initNavScroll();
  initCounters();
}
