/* ============================================
   MAGNETIC INTERACTIONS MODULE
   ============================================ */

export class MagneticElement {
  constructor(element, options = {}) {
    this.el = element;
    this.options = {
      strength: 0.4,        // Movement multiplier (0-1)
      triggerArea: 200,     // Detection radius in pixels
      lerp: 0.1,            // Smoothing factor
      ...options
    };

    this.pos = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.rect = null;
    this.center = { x: 0, y: 0 };
    this.isHovered = false;
    this.rafId = null;

    this.init();
  }

  init() {
    this.calculateBounds();

    // Update bounds on resize
    window.addEventListener('resize', () => this.calculateBounds());

    // Track hover state
    this.el.addEventListener('mouseenter', () => {
      this.isHovered = true;
    });

    this.el.addEventListener('mouseleave', () => {
      this.isHovered = false;
      this.target = { x: 0, y: 0 };
    });

    // Track mouse position
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));

    // Start animation loop
    this.animate();
  }

  calculateBounds() {
    this.rect = this.el.getBoundingClientRect();
    this.center = {
      x: this.rect.left + this.rect.width / 2,
      y: this.rect.top + this.rect.height / 2
    };
  }

  onMouseMove(e) {
    // Recalculate bounds (in case of scroll)
    this.rect = this.el.getBoundingClientRect();
    this.center = {
      x: this.rect.left + this.rect.width / 2,
      y: this.rect.top + this.rect.height / 2
    };

    const distance = Math.hypot(
      e.clientX - this.center.x,
      e.clientY - this.center.y
    );

    if (distance < this.options.triggerArea) {
      // Calculate magnetic pull (stronger when closer)
      const pull = 1 - (distance / this.options.triggerArea);

      this.target = {
        x: (e.clientX - this.center.x) * this.options.strength * pull,
        y: (e.clientY - this.center.y) * this.options.strength * pull
      };
    } else if (!this.isHovered) {
      this.target = { x: 0, y: 0 };
    }
  }

  animate() {
    // Smooth interpolation
    this.pos.x += (this.target.x - this.pos.x) * this.options.lerp;
    this.pos.y += (this.target.y - this.pos.y) * this.options.lerp;

    // Apply transform
    this.el.style.transform = `translate(${this.pos.x}px, ${this.pos.y}px)`;

    this.rafId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    cancelAnimationFrame(this.rafId);
    this.el.style.transform = '';
  }
}

// Initialize all magnetic elements
export function initMagnetic() {
  const elements = document.querySelectorAll('[data-magnetic]');

  elements.forEach((el) => {
    const strength = parseFloat(el.dataset.magneticStrength) || 0.4;
    const trigger = parseFloat(el.dataset.magneticTrigger) || 200;

    new MagneticElement(el, {
      strength,
      triggerArea: trigger
    });
  });
}
