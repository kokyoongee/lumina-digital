/* ============================================
   CUSTOM CURSOR MODULE
   ============================================ */

export class Cursor {
  constructor() {
    this.dot = null;
    this.ring = null;
    this.text = null;

    this.pos = { x: 0, y: 0 };
    this.mouse = { x: 0, y: 0 };
    this.visible = false;

    this.dotSpeed = 1;      // Instant follow
    this.ringSpeed = 0.15;  // Smooth lag

    this.init();
  }

  init() {
    // Check for touch device
    if ('ontouchstart' in window) return;

    this.createElements();
    this.bindEvents();
    this.animate();

    // Delay visibility for smooth entrance
    setTimeout(() => {
      document.body.classList.add('cursor-ready');
    }, 100);
  }

  createElements() {
    // Cursor Dot
    this.dot = document.createElement('div');
    this.dot.className = 'cursor-dot';
    this.dot.dataset.state = 'default';

    // Cursor Ring
    this.ring = document.createElement('div');
    this.ring.className = 'cursor-ring';
    this.ring.dataset.state = 'default';

    // Cursor Text (inside ring)
    this.text = document.createElement('span');
    this.text.className = 'cursor-text';
    this.ring.appendChild(this.text);

    // Append to body
    document.body.appendChild(this.dot);
    document.body.appendChild(this.ring);
  }

  bindEvents() {
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      if (!this.visible) {
        this.visible = true;
        this.pos.x = this.mouse.x;
        this.pos.y = this.mouse.y;
      }
    });

    // Mouse enter/leave window
    document.addEventListener('mouseenter', () => {
      this.dot.style.opacity = '1';
      this.ring.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      this.dot.style.opacity = '0';
      this.ring.style.opacity = '0';
    });

    // Click effect
    document.addEventListener('mousedown', () => this.onClick());
    document.addEventListener('mouseup', () => this.onRelease());

    // Bind hover targets
    this.bindHoverTargets();
  }

  bindHoverTargets() {
    // Standard hover elements (links, buttons)
    const hoverElements = document.querySelectorAll(
      'a, button, [data-cursor="pointer"], input[type="submit"]'
    );

    hoverElements.forEach((el) => {
      el.addEventListener('mouseenter', () => this.setState('hover'));
      el.addEventListener('mouseleave', () => this.setState('default'));
    });

    // Media elements (images, videos)
    const mediaElements = document.querySelectorAll(
      'img, video, [data-cursor="media"]'
    );

    mediaElements.forEach((el) => {
      el.addEventListener('mouseenter', () => this.setState('media'));
      el.addEventListener('mouseleave', () => this.setState('default'));
    });

    // Custom text cursor
    const textElements = document.querySelectorAll('[data-cursor-text]');

    textElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        this.setText(el.dataset.cursorText);
        this.setState('text');
      });
      el.addEventListener('mouseleave', () => {
        this.setState('default');
      });
    });

    // Hidden cursor
    const hiddenElements = document.querySelectorAll('[data-cursor="hidden"]');

    hiddenElements.forEach((el) => {
      el.addEventListener('mouseenter', () => this.setState('hidden'));
      el.addEventListener('mouseleave', () => this.setState('default'));
    });
  }

  setState(state) {
    this.dot.dataset.state = state;
    this.ring.dataset.state = state;
  }

  setText(text) {
    this.text.textContent = text;
  }

  onClick() {
    this.setState('click');
  }

  onRelease() {
    // Return to previous state
    this.setState('default');
  }

  animate() {
    // Lerp for smooth ring follow
    this.pos.x += (this.mouse.x - this.pos.x) * this.ringSpeed;
    this.pos.y += (this.mouse.y - this.pos.y) * this.ringSpeed;

    // Apply transforms
    this.dot.style.left = `${this.mouse.x}px`;
    this.dot.style.top = `${this.mouse.y}px`;

    this.ring.style.left = `${this.pos.x}px`;
    this.ring.style.top = `${this.pos.y}px`;

    requestAnimationFrame(() => this.animate());
  }

  // Public method to refresh bindings (after dynamic content)
  refresh() {
    this.bindHoverTargets();
  }
}

// Auto-initialize
export const cursor = new Cursor();
