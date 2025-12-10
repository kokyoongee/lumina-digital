/* ============================================
   3D TILT EFFECT MODULE
   ============================================ */

export class TiltElement {
  constructor(element, options = {}) {
    this.el = element;
    this.options = {
      maxTilt: 15,          // Max rotation in degrees
      perspective: 1000,     // Perspective value
      scale: 1.02,          // Scale on hover
      speed: 400,           // Transition speed (ms)
      glare: true,          // Add glare effect
      maxGlare: 0.2,        // Max glare opacity
      ...options
    };

    this.glareElement = null;
    this.rafId = null;

    this.init();
  }

  init() {
    // Check for touch device
    if ('ontouchstart' in window) return;

    this.el.style.transformStyle = 'preserve-3d';
    this.el.style.willChange = 'transform';

    if (this.options.glare) {
      this.addGlare();
    }

    this.bindEvents();
  }

  addGlare() {
    const glareWrapper = document.createElement('div');
    glareWrapper.className = 'tilt-glare';

    const glareInner = document.createElement('div');
    glareInner.className = 'tilt-glare-inner';

    glareWrapper.appendChild(glareInner);
    this.el.appendChild(glareWrapper);

    this.glareElement = glareInner;
  }

  bindEvents() {
    this.el.addEventListener('mouseenter', () => this.onEnter());
    this.el.addEventListener('mousemove', (e) => this.onMove(e));
    this.el.addEventListener('mouseleave', () => this.onLeave());
  }

  onEnter() {
    this.el.style.transition = `transform ${this.options.speed}ms ease`;

    // Remove transition after initial scale for smooth tilt
    setTimeout(() => {
      this.el.style.transition = 'none';
    }, this.options.speed);
  }

  onMove(e) {
    const rect = this.el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -this.options.maxTilt;
    const rotateY = ((x - centerX) / centerX) * this.options.maxTilt;

    this.el.style.transform = `
      perspective(${this.options.perspective}px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale3d(${this.options.scale}, ${this.options.scale}, ${this.options.scale})
    `;

    if (this.glareElement) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      this.glareElement.style.background = `
        radial-gradient(
          circle at ${glareX}% ${glareY}%,
          rgba(255, 255, 255, ${this.options.maxGlare}),
          transparent 50%
        )
      `;
      this.glareElement.style.opacity = '1';
    }
  }

  onLeave() {
    this.el.style.transition = `transform ${this.options.speed}ms ease`;
    this.el.style.transform = `
      perspective(${this.options.perspective}px)
      rotateX(0deg)
      rotateY(0deg)
      scale3d(1, 1, 1)
    `;

    if (this.glareElement) {
      this.glareElement.style.opacity = '0';
    }
  }

  destroy() {
    this.el.style.transform = '';
    this.el.style.transition = '';

    if (this.glareElement) {
      this.glareElement.parentElement.remove();
    }
  }
}

// ============================================
// INITIALIZE FROM DATA ATTRIBUTES
// ============================================
export function initTilt() {
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    const maxTilt = parseFloat(el.dataset.tiltMax) || 15;
    const scale = parseFloat(el.dataset.tiltScale) || 1.02;
    const glare = el.dataset.tiltGlare !== 'false';

    new TiltElement(el, {
      maxTilt,
      scale,
      glare
    });
  });
}
