# Lumina Interactive Design Specification

> A technical guide for implementing cutting-edge interactive experiences. Lumina creates appealing digital experiences for customers and their brands.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Custom Cursor System](#1-custom-cursor-system)
3. [Magnetic Interactions](#2-magnetic-interactions)
4. [Scroll-Triggered Animations](#3-scroll-triggered-animations)
5. [Kinetic Typography](#4-kinetic-typography)
6. [Page Transitions](#5-page-transitions)
7. [3D Interactive Elements](#6-3d-interactive-elements)
8. [Micro-Interactions Library](#7-micro-interactions-library)
9. [Sound Design](#8-sound-design)
10. [Performance Considerations](#9-performance-considerations)
11. [Implementation Roadmap](#10-implementation-roadmap)

---

## Design Philosophy

**Core Principle**: Every interaction should feel intentional, refined, and slightly unexpected.

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERACTION HIERARCHY                     │
├─────────────────────────────────────────────────────────────┤
│  Level 1: Ambient       │ Always running, subtle            │
│  (cursor, parallax)     │ User doesn't consciously notice   │
├─────────────────────────┼───────────────────────────────────┤
│  Level 2: Reactive      │ Responds to user input            │
│  (hovers, clicks)       │ Immediate, satisfying feedback    │
├─────────────────────────┼───────────────────────────────────┤
│  Level 3: Progressive   │ Rewards exploration               │
│  (scroll reveals)       │ Creates sense of discovery        │
├─────────────────────────┼───────────────────────────────────┤
│  Level 4: Memorable     │ Signature moments                 │
│  (page transitions)     │ What users remember & share       │
└─────────────────────────┴───────────────────────────────────┘
```

---

## 1. Custom Cursor System

### 1.1 Cursor Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CURSOR STATES                            │
├──────────────┬──────────────────────────────────────────────┤
│  Default     │  ○  Small dot (8px) with outline ring (32px) │
│  Hover Link  │  ◉  Expanded ring (64px) with "View" text    │
│  Hover Image │  ◎  Ring transforms to frame corners         │
│  Click       │  ●  Dot expands, ring contracts briefly      │
│  Dragging    │  ⟷  Horizontal arrows for sliders            │
│  Loading     │  ◌  Ring becomes spinning arc                │
│  Hidden      │  -  Over video/3D elements                   │
└──────────────┴──────────────────────────────────────────────┘
```

### 1.2 Technical Implementation

```javascript
// cursor.js - Custom Cursor Module

class LuminaCursor {
  constructor() {
    this.cursor = {
      dot: document.querySelector('.cursor-dot'),
      ring: document.querySelector('.cursor-ring'),
      text: document.querySelector('.cursor-text')
    };

    this.pos = { x: 0, y: 0 };
    this.mouse = { x: 0, y: 0 };
    this.speed = 0.15; // Lerp factor for smooth follow

    this.init();
  }

  init() {
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // Bind hover targets
    this.bindHoverTargets();

    // Start animation loop
    this.animate();
  }

  animate() {
    // Smooth interpolation (lerp)
    this.pos.x += (this.mouse.x - this.pos.x) * this.speed;
    this.pos.y += (this.mouse.y - this.pos.y) * this.speed;

    // Apply transforms
    this.cursor.dot.style.transform =
      `translate(${this.mouse.x}px, ${this.mouse.y}px)`;
    this.cursor.ring.style.transform =
      `translate(${this.pos.x}px, ${this.pos.y}px)`;

    requestAnimationFrame(() => this.animate());
  }

  bindHoverTargets() {
    // Links & buttons
    document.querySelectorAll('a, button, [data-cursor="pointer"]')
      .forEach(el => {
        el.addEventListener('mouseenter', () => this.setState('hover'));
        el.addEventListener('mouseleave', () => this.setState('default'));
      });

    // Images & media
    document.querySelectorAll('img, video, [data-cursor="media"]')
      .forEach(el => {
        el.addEventListener('mouseenter', () => this.setState('media'));
        el.addEventListener('mouseleave', () => this.setState('default'));
      });

    // Custom text cursors
    document.querySelectorAll('[data-cursor-text]')
      .forEach(el => {
        el.addEventListener('mouseenter', () => {
          this.setText(el.dataset.cursorText);
          this.setState('text');
        });
        el.addEventListener('mouseleave', () => this.setState('default'));
      });
  }

  setState(state) {
    this.cursor.ring.dataset.state = state;
    this.cursor.dot.dataset.state = state;
  }

  setText(text) {
    this.cursor.text.textContent = text;
  }
}

// Initialize
const cursor = new LuminaCursor();
```

### 1.3 CSS Styling

```css
/* cursor.css */

/* Hide default cursor site-wide */
*, *::before, *::after {
  cursor: none !important;
}

/* Cursor elements */
.cursor-dot {
  position: fixed;
  top: -4px;
  left: -4px;
  width: 8px;
  height: 8px;
  background: var(--color-accent);
  border-radius: 50%;
  pointer-events: none;
  z-index: 10001;
  mix-blend-mode: difference;
  transition: transform 0.1s ease, width 0.3s ease, height 0.3s ease;
}

.cursor-ring {
  position: fixed;
  top: -24px;
  left: -24px;
  width: 48px;
  height: 48px;
  border: 1px solid var(--color-accent);
  border-radius: 50%;
  pointer-events: none;
  z-index: 10000;
  opacity: 0.5;
  transition:
    width 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    height 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.3s ease,
    border-radius 0.4s ease;
}

.cursor-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0;
  transition: opacity 0.3s ease;
  white-space: nowrap;
}

/* State: Hover */
.cursor-ring[data-state="hover"] {
  width: 80px;
  height: 80px;
  top: -40px;
  left: -40px;
  opacity: 1;
  background: rgba(255, 255, 255, 0.05);
}

.cursor-dot[data-state="hover"] {
  transform: scale(0);
}

/* State: Text */
.cursor-ring[data-state="text"] {
  width: 120px;
  height: 120px;
  top: -60px;
  left: -60px;
  background: var(--color-accent);
  opacity: 1;
}

.cursor-ring[data-state="text"] .cursor-text {
  opacity: 1;
  color: var(--color-bg);
}

/* State: Media (corner frames) */
.cursor-ring[data-state="media"] {
  width: 64px;
  height: 64px;
  border: none;
  border-radius: 0;
  background:
    linear-gradient(var(--color-accent), var(--color-accent)) top left,
    linear-gradient(var(--color-accent), var(--color-accent)) top right,
    linear-gradient(var(--color-accent), var(--color-accent)) bottom left,
    linear-gradient(var(--color-accent), var(--color-accent)) bottom right;
  background-size: 12px 1px, 12px 1px, 12px 1px, 12px 1px,
                   1px 12px, 1px 12px, 1px 12px, 1px 12px;
  background-repeat: no-repeat;
}

/* Mobile: Show default cursor */
@media (hover: none) and (pointer: coarse) {
  *, *::before, *::after {
    cursor: auto !important;
  }
  .cursor-dot, .cursor-ring {
    display: none;
  }
}
```

### 1.4 HTML Structure

```html
<!-- Add to body -->
<div class="cursor-dot"></div>
<div class="cursor-ring">
  <span class="cursor-text"></span>
</div>

<!-- Usage on elements -->
<a href="/work" data-cursor-text="Explore">Our Work</a>
<div class="project-card" data-cursor-text="View Case Study">...</div>
```

---

## 2. Magnetic Interactions

### 2.1 Magnetic Button Behavior

```
┌─────────────────────────────────────────────────────────────┐
│                    MAGNETIC FIELD ZONES                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│         Zone 3: Detection (150px)                           │
│         ┌─────────────────────────────┐                     │
│         │  Zone 2: Attraction (80px)  │                     │
│         │  ┌───────────────────────┐  │                     │
│         │  │  Zone 1: Strong (40px)│  │                     │
│         │  │  ┌─────────────────┐  │  │                     │
│         │  │  │    [BUTTON]     │  │  │                     │
│         │  │  └─────────────────┘  │  │                     │
│         │  └───────────────────────┘  │                     │
│         └─────────────────────────────┘                     │
│                                                              │
│  Movement: Button follows cursor within attraction zone      │
│  Strength: Decreases with distance (inverse square)          │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Implementation

```javascript
// magnetic.js - Magnetic Elements Module

class MagneticElement {
  constructor(element, options = {}) {
    this.el = element;
    this.options = {
      strength: 0.5,        // How much the element moves (0-1)
      triggerArea: 150,     // Detection radius in pixels
      interpolation: 0.1,   // Smoothing factor
      ...options
    };

    this.pos = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.isHovered = false;

    this.init();
  }

  init() {
    this.el.addEventListener('mouseenter', () => this.isHovered = true);
    this.el.addEventListener('mouseleave', () => {
      this.isHovered = false;
      this.target = { x: 0, y: 0 };
    });

    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.animate();
  }

  onMouseMove(e) {
    const rect = this.el.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    const distance = Math.hypot(e.clientX - center.x, e.clientY - center.y);

    if (distance < this.options.triggerArea) {
      // Calculate pull strength (stronger when closer)
      const pull = 1 - (distance / this.options.triggerArea);

      this.target = {
        x: (e.clientX - center.x) * this.options.strength * pull,
        y: (e.clientY - center.y) * this.options.strength * pull
      };
    } else if (!this.isHovered) {
      this.target = { x: 0, y: 0 };
    }
  }

  animate() {
    // Smooth interpolation
    this.pos.x += (this.target.x - this.pos.x) * this.options.interpolation;
    this.pos.y += (this.target.y - this.pos.y) * this.options.interpolation;

    this.el.style.transform = `translate(${this.pos.x}px, ${this.pos.y}px)`;

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize all magnetic elements
document.querySelectorAll('[data-magnetic]').forEach(el => {
  new MagneticElement(el, {
    strength: parseFloat(el.dataset.magneticStrength) || 0.5
  });
});
```

### 2.3 Usage

```html
<!-- Basic magnetic button -->
<button class="btn-primary" data-magnetic>
  Start a Project
</button>

<!-- Strong magnetic effect -->
<a href="/work" data-magnetic data-magnetic-strength="0.8">
  View Our Work
</a>

<!-- Magnetic with inner content shift -->
<button class="btn-magnetic" data-magnetic>
  <span data-magnetic data-magnetic-strength="0.3">
    Let's Talk
  </span>
</button>
```

---

## 3. Scroll-Triggered Animations

### 3.1 Animation Types

```
┌─────────────────────────────────────────────────────────────┐
│                    SCROLL ANIMATION TYPES                    │
├──────────────┬──────────────────────────────────────────────┤
│  Fade Up     │  Element fades in while moving up 40px       │
│  Fade Scale  │  Element fades in while scaling from 0.95    │
│  Stagger     │  Children animate sequentially (0.1s delay)  │
│  Parallax    │  Element moves at different scroll speed     │
│  Reveal      │  Clip-path or mask reveals content           │
│  Counter     │  Numbers count up to target value            │
│  Draw        │  SVG paths draw on scroll                    │
│  Scrub       │  Animation progress tied to scroll position  │
└──────────────┴──────────────────────────────────────────────┘
```

### 3.2 GSAP ScrollTrigger Implementation

```javascript
// scroll-animations.js

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// FADE UP ANIMATION
// ============================================
function initFadeUp() {
  gsap.utils.toArray('[data-animate="fade-up"]').forEach(el => {
    gsap.from(el, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  });
}

// ============================================
// STAGGERED CHILDREN
// ============================================
function initStagger() {
  gsap.utils.toArray('[data-animate="stagger"]').forEach(container => {
    const children = container.children;

    gsap.from(children, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 80%'
      }
    });
  });
}

// ============================================
// TEXT REVEAL (Line by line)
// ============================================
function initTextReveal() {
  gsap.utils.toArray('[data-animate="text-reveal"]').forEach(el => {
    // Split text into lines (use SplitType or manual)
    const lines = el.querySelectorAll('.line');

    gsap.from(lines, {
      yPercent: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%'
      }
    });
  });
}

// ============================================
// PARALLAX SECTIONS
// ============================================
function initParallax() {
  gsap.utils.toArray('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.5;

    gsap.to(el, {
      yPercent: -30 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}

// ============================================
// NUMBER COUNTER
// ============================================
function initCounters() {
  gsap.utils.toArray('[data-counter]').forEach(el => {
    const target = parseInt(el.dataset.counter);
    const suffix = el.dataset.counterSuffix || '';

    gsap.to(el, {
      innerText: target,
      duration: 2,
      ease: 'power2.out',
      snap: { innerText: 1 },
      scrollTrigger: {
        trigger: el,
        start: 'top 80%'
      },
      onUpdate: function() {
        el.textContent = Math.round(this.targets()[0].innerText) + suffix;
      }
    });
  });
}

// ============================================
// HORIZONTAL SCROLL SECTION
// ============================================
function initHorizontalScroll() {
  const container = document.querySelector('[data-horizontal-scroll]');
  if (!container) return;

  const sections = gsap.utils.toArray(container.querySelectorAll('.panel'));

  gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 1,
      snap: 1 / (sections.length - 1),
      end: () => '+=' + container.offsetWidth
    }
  });
}

// ============================================
// SVG PATH DRAWING
// ============================================
function initSVGDraw() {
  gsap.utils.toArray('[data-animate="draw"]').forEach(svg => {
    const paths = svg.querySelectorAll('path');

    paths.forEach(path => {
      const length = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length
      });

      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: svg,
          start: 'top 70%'
        }
      });
    });
  });
}

// ============================================
// IMAGE REVEAL (Clip-path)
// ============================================
function initImageReveal() {
  gsap.utils.toArray('[data-animate="reveal"]').forEach(el => {
    gsap.from(el, {
      clipPath: 'inset(100% 0% 0% 0%)',
      duration: 1.2,
      ease: 'power4.inOut',
      scrollTrigger: {
        trigger: el,
        start: 'top 75%'
      }
    });
  });
}

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================
function initScrollProgress() {
  const progress = document.querySelector('.scroll-progress');
  if (!progress) return;

  gsap.to(progress, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3
    }
  });
}

// Initialize all
export function initScrollAnimations() {
  initFadeUp();
  initStagger();
  initTextReveal();
  initParallax();
  initCounters();
  initHorizontalScroll();
  initSVGDraw();
  initImageReveal();
  initScrollProgress();
}
```

### 3.3 Usage Examples

```html
<!-- Fade up -->
<h2 data-animate="fade-up">Our Services</h2>

<!-- Stagger children -->
<div class="grid" data-animate="stagger">
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
</div>

<!-- Parallax image -->
<div class="image-container">
  <img src="hero.jpg" data-parallax="0.3" alt="">
</div>

<!-- Counter -->
<span data-counter="98" data-counter-suffix="%">0</span>

<!-- Text reveal (requires line splitting) -->
<h1 data-animate="text-reveal">
  <span class="line">We craft digital</span>
  <span class="line">experiences that last</span>
</h1>

<!-- Image reveal -->
<div class="image-wrapper" data-animate="reveal">
  <img src="project.jpg" alt="">
</div>
```

---

## 4. Kinetic Typography

### 4.1 Hero Text Animation System

```
┌─────────────────────────────────────────────────────────────┐
│                   KINETIC TEXT EFFECTS                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Effect 1: Character Cascade                                 │
│  ┌─────────────────────────────────────────┐                │
│  │  L → Lu → Lum → Lumi → Lumin → Lumina   │                │
│  │  (Characters reveal left to right)       │                │
│  └─────────────────────────────────────────┘                │
│                                                              │
│  Effect 2: Word Morphing                                     │
│  ┌─────────────────────────────────────────┐                │
│  │  Design → Develop → Deploy → Deliver    │                │
│  │  (Words transition with blur/scale)      │                │
│  └─────────────────────────────────────────┘                │
│                                                              │
│  Effect 3: Split Scramble                                    │
│  ┌─────────────────────────────────────────┐                │
│  │  ▓▒░ → D▒░ → Di░ → Dig → Digi → Digital │                │
│  │  (Random chars resolve to final text)    │                │
│  └─────────────────────────────────────────┘                │
│                                                              │
│  Effect 4: Elastic Bounce                                    │
│  ┌─────────────────────────────────────────┐                │
│  │  Each character drops in with bounce     │                │
│  │  Staggered timing creates wave effect    │                │
│  └─────────────────────────────────────────┘                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Text Splitting Utility

```javascript
// text-split.js

export function splitText(element, type = 'chars') {
  const text = element.textContent;
  element.textContent = '';
  element.setAttribute('aria-label', text);

  if (type === 'chars') {
    const chars = text.split('');
    chars.forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.style.setProperty('--char-index', i);
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.setAttribute('aria-hidden', 'true');
      element.appendChild(span);
    });
  }

  if (type === 'words') {
    const words = text.split(' ');
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.style.setProperty('--word-index', i);
      span.textContent = word;
      span.setAttribute('aria-hidden', 'true');
      element.appendChild(span);
      if (i < words.length - 1) {
        element.appendChild(document.createTextNode(' '));
      }
    });
  }

  if (type === 'lines') {
    // More complex - requires measuring
    const words = text.split(' ');
    let currentLine = [];
    let lines = [];

    // Measure and group into lines
    // (simplified - use SplitType library for production)
    lines = [text]; // Fallback to single line

    lines.forEach((line, i) => {
      const div = document.createElement('div');
      div.className = 'line-wrapper';
      const span = document.createElement('span');
      span.className = 'line';
      span.style.setProperty('--line-index', i);
      span.textContent = line;
      div.appendChild(span);
      element.appendChild(div);
    });
  }

  return element;
}
```

### 4.3 Character Animation Effects

```javascript
// kinetic-text.js

import { gsap } from 'gsap';
import { splitText } from './text-split.js';

// ============================================
// EFFECT: Character Cascade
// ============================================
export function charCascade(element) {
  splitText(element, 'chars');
  const chars = element.querySelectorAll('.char');

  gsap.from(chars, {
    opacity: 0,
    y: 50,
    rotateX: -90,
    stagger: 0.03,
    duration: 0.8,
    ease: 'back.out(1.7)'
  });
}

// ============================================
// EFFECT: Text Scramble
// ============================================
export class TextScramble {
  constructor(element) {
    this.el = element;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.textContent;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);

    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0; i < this.queue.length; i++) {
      let { from, to, start, end, char } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

// ============================================
// EFFECT: Word Rotation
// ============================================
export function wordRotator(element, words, interval = 3000) {
  let currentIndex = 0;
  const scrambler = new TextScramble(element);

  function next() {
    scrambler.setText(words[currentIndex]).then(() => {
      setTimeout(next, interval);
    });
    currentIndex = (currentIndex + 1) % words.length;
  }

  next();
}

// ============================================
// EFFECT: Elastic Wave
// ============================================
export function elasticWave(element) {
  splitText(element, 'chars');
  const chars = element.querySelectorAll('.char');

  gsap.from(chars, {
    y: -100,
    opacity: 0,
    duration: 1.2,
    ease: 'elastic.out(1, 0.3)',
    stagger: {
      each: 0.05,
      from: 'start'
    }
  });
}

// ============================================
// EFFECT: Glitch Text
// ============================================
export function glitchText(element) {
  element.classList.add('glitch');
  element.dataset.text = element.textContent;
}
```

### 4.4 CSS for Kinetic Text

```css
/* kinetic-text.css */

/* Base setup */
[data-kinetic] {
  display: inline-block;
}

.char, .word, .line {
  display: inline-block;
  will-change: transform, opacity;
}

.line-wrapper {
  overflow: hidden;
}

/* Scramble effect */
.scramble-char {
  color: var(--color-accent);
  opacity: 0.7;
}

/* Glitch effect */
.glitch {
  position: relative;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.glitch::before {
  animation: glitch-1 0.3s infinite linear alternate-reverse;
  clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
  color: cyan;
}

.glitch::after {
  animation: glitch-2 0.3s infinite linear alternate-reverse;
  clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
  color: magenta;
}

@keyframes glitch-1 {
  0% { transform: translate(2px, 0); }
  100% { transform: translate(-2px, 0); }
}

@keyframes glitch-2 {
  0% { transform: translate(-2px, 0); }
  100% { transform: translate(2px, 0); }
}

/* Hover reveal (underline draw) */
.text-reveal-underline {
  position: relative;
  display: inline-block;
}

.text-reveal-underline::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1);
}

.text-reveal-underline:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
```

### 4.5 Usage

```html
<!-- Character cascade on load -->
<h1 data-kinetic="cascade">Lumina Digital</h1>

<!-- Word rotation -->
<h2>We <span id="rotating-word">Design</span></h2>
<script>
  wordRotator(
    document.getElementById('rotating-word'),
    ['Design', 'Develop', 'Deploy', 'Deliver'],
    2500
  );
</script>

<!-- Glitch effect -->
<span data-kinetic="glitch">INNOVATION</span>

<!-- Hover underline -->
<a href="/work" class="text-reveal-underline">View Our Work</a>
```

---

## 5. Page Transitions

### 5.1 Transition Types

```
┌─────────────────────────────────────────────────────────────┐
│                    PAGE TRANSITION TYPES                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Type 1: Fade Through                                        │
│  ┌────────┐    ┌────────┐    ┌────────┐                     │
│  │ Page A │ →  │ Black  │ →  │ Page B │                     │
│  └────────┘    └────────┘    └────────┘                     │
│                                                              │
│  Type 2: Slide Over                                          │
│  ┌────────┐         ┌────────┐                              │
│  │ Page A │ ← ───── │ Page B │ slides in from right         │
│  └────────┘         └────────┘                              │
│                                                              │
│  Type 3: Wipe Reveal                                         │
│  ┌████░░░░┐ → ┌██████░░┐ → ┌████████┐                       │
│  │ Page B revealed by expanding rectangle                    │
│  └────────┘   └────────┘   └────────┘                       │
│                                                              │
│  Type 4: Clip Expand                                         │
│  Click point becomes origin for circular/rectangular clip    │
│  that expands to reveal new page                             │
│                                                              │
│  Type 5: Morph (FLIP)                                        │
│  Shared elements animate to new positions                    │
│  (e.g., card → full page hero)                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Implementation with Barba.js + GSAP

```javascript
// transitions.js

import barba from '@barba/core';
import { gsap } from 'gsap';

// Transition overlay element
const overlay = document.querySelector('.page-transition-overlay');

// ============================================
// TRANSITION: Wipe
// ============================================
const wipeTransition = {
  name: 'wipe',

  leave(data) {
    return gsap.to(overlay, {
      scaleY: 1,
      transformOrigin: 'bottom',
      duration: 0.6,
      ease: 'power4.inOut'
    });
  },

  enter(data) {
    // Reset and animate out
    gsap.set(overlay, { transformOrigin: 'top' });

    return gsap.to(overlay, {
      scaleY: 0,
      duration: 0.6,
      ease: 'power4.inOut',
      delay: 0.1
    });
  }
};

// ============================================
// TRANSITION: Clip from Click
// ============================================
const clipTransition = {
  name: 'clip',

  leave(data) {
    const trigger = data.trigger;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    // Get click position if available
    if (trigger && trigger !== 'barba') {
      const rect = trigger.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    // Set clip origin
    overlay.style.setProperty('--clip-x', `${x}px`);
    overlay.style.setProperty('--clip-y', `${y}px`);

    return gsap.to(overlay, {
      '--clip-radius': '150vmax',
      duration: 0.8,
      ease: 'power3.inOut'
    });
  },

  enter(data) {
    return gsap.to(overlay, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
      onComplete: () => {
        gsap.set(overlay, {
          '--clip-radius': '0',
          opacity: 1
        });
      }
    });
  }
};

// ============================================
// TRANSITION: Slide
// ============================================
const slideTransition = {
  name: 'slide',

  leave(data) {
    return gsap.to(data.current.container, {
      x: '-100%',
      duration: 0.6,
      ease: 'power3.inOut'
    });
  },

  enter(data) {
    gsap.set(data.next.container, { x: '100%' });

    return gsap.to(data.next.container, {
      x: '0%',
      duration: 0.6,
      ease: 'power3.inOut'
    });
  }
};

// ============================================
// INITIALIZE BARBA
// ============================================
barba.init({
  transitions: [
    {
      name: 'default',
      ...wipeTransition
    },
    {
      name: 'project',
      from: { namespace: ['home', 'work'] },
      to: { namespace: ['project'] },
      ...clipTransition
    },
    {
      name: 'navigation',
      custom: ({ trigger }) => trigger.classList?.contains('nav-link'),
      ...slideTransition
    }
  ],

  views: [
    {
      namespace: 'home',
      afterEnter() {
        // Reinitialize home-specific scripts
        initHeroAnimations();
      }
    },
    {
      namespace: 'project',
      afterEnter() {
        // Reinitialize project page scripts
        initProjectAnimations();
      }
    }
  ]
});

// Reinitialize scroll triggers after each transition
barba.hooks.after(() => {
  ScrollTrigger.refresh();
  initScrollAnimations();
});
```

### 5.3 CSS for Transitions

```css
/* transitions.css */

.page-transition-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-bg);
  z-index: 9999;
  pointer-events: none;
  transform: scaleY(0);

  /* For clip transition */
  --clip-x: 50%;
  --clip-y: 50%;
  --clip-radius: 0;
  clip-path: circle(var(--clip-radius) at var(--clip-x) var(--clip-y));
}

/* Barba containers */
[data-barba="container"] {
  width: 100%;
}

/* Prevent scroll during transition */
html.is-transitioning {
  overflow: hidden;
  pointer-events: none;
}

/* Shared element transitions (FLIP technique) */
.shared-element {
  view-transition-name: shared-hero;
}

@supports (view-transition-name: none) {
  ::view-transition-old(shared-hero),
  ::view-transition-new(shared-hero) {
    animation-duration: 0.5s;
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
}
```

### 5.4 HTML Structure

```html
<!DOCTYPE html>
<html>
<head>...</head>
<body>
  <!-- Transition overlay -->
  <div class="page-transition-overlay"></div>

  <!-- Barba wrapper -->
  <div data-barba="wrapper">
    <nav>...</nav>

    <!-- Barba container (changes on navigation) -->
    <main data-barba="container" data-barba-namespace="home">
      <!-- Page content -->
    </main>
  </div>
</body>
</html>
```

---

## 6. 3D Interactive Elements

### 6.1 Options Comparison

```
┌─────────────────────────────────────────────────────────────┐
│                    3D TECHNOLOGY OPTIONS                     │
├──────────────┬──────────────────────────────────────────────┤
│  Three.js    │ Full 3D engine, most flexible, steeper curve │
│  Spline      │ Visual editor, easy embed, limited custom    │
│  CSS 3D      │ Native, performant, limited to transforms    │
│  React Three │ React integration, great DX, requires React  │
│  Fiber       │                                              │
└──────────────┴──────────────────────────────────────────────┘

Recommendation: CSS 3D for simple effects, Spline for complex scenes
```

### 6.2 CSS 3D Card Flip

```css
/* 3d-card.css */

.card-3d-container {
  perspective: 1000px;
  width: 300px;
  height: 400px;
}

.card-3d {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-3d:hover {
  transform: rotateY(180deg);
}

.card-3d-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 16px;
  overflow: hidden;
}

.card-3d-front {
  background: var(--color-surface);
}

.card-3d-back {
  background: var(--color-accent);
  transform: rotateY(180deg);
}
```

### 6.3 Mouse-Tracking 3D Tilt

```javascript
// tilt.js

class TiltElement {
  constructor(element, options = {}) {
    this.el = element;
    this.options = {
      maxTilt: 15,           // Max rotation in degrees
      perspective: 1000,      // Perspective value
      scale: 1.05,           // Scale on hover
      speed: 400,            // Transition speed
      glare: true,           // Add glare effect
      maxGlare: 0.3,         // Max glare opacity
      ...options
    };

    this.init();
  }

  init() {
    this.el.style.transformStyle = 'preserve-3d';
    this.el.style.transition = `transform ${this.options.speed}ms ease`;

    if (this.options.glare) {
      this.addGlare();
    }

    this.el.addEventListener('mouseenter', () => this.onEnter());
    this.el.addEventListener('mousemove', (e) => this.onMove(e));
    this.el.addEventListener('mouseleave', () => this.onLeave());
  }

  addGlare() {
    const glare = document.createElement('div');
    glare.className = 'tilt-glare';
    glare.innerHTML = '<div class="tilt-glare-inner"></div>';
    this.el.appendChild(glare);
    this.glare = glare.querySelector('.tilt-glare-inner');
  }

  onEnter() {
    this.el.style.transition = 'none';
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
      scale(${this.options.scale})
    `;

    if (this.glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      this.glare.style.background = `
        radial-gradient(
          circle at ${glareX}% ${glareY}%,
          rgba(255,255,255,${this.options.maxGlare}),
          transparent 60%
        )
      `;
    }
  }

  onLeave() {
    this.el.style.transition = `transform ${this.options.speed}ms ease`;
    this.el.style.transform = `
      perspective(${this.options.perspective}px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;

    if (this.glare) {
      this.glare.style.background = 'transparent';
    }
  }
}

// Initialize
document.querySelectorAll('[data-tilt]').forEach(el => {
  new TiltElement(el);
});
```

### 6.4 Spline Integration

```html
<!-- Embed Spline scene -->
<script type="module" src="https://unpkg.com/@splinetool/viewer/build/spline-viewer.js"></script>

<spline-viewer
  url="https://prod.spline.design/YOUR-SCENE-ID/scene.splinecode"
  loading="lazy"
  events-target="global"
></spline-viewer>

<style>
  spline-viewer {
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
</style>
```

### 6.5 Particle Background (Three.js)

```javascript
// particles.js

import * as THREE from 'three';

class ParticleBackground {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    this.particles = null;
    this.mouse = { x: 0, y: 0 };

    this.init();
  }

  init() {
    // Setup renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Create particles
    const geometry = new THREE.BufferGeometry();
    const count = 2000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xC9A962,
      size: 0.02,
      transparent: true,
      opacity: 0.8
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);

    this.camera.position.z = 3;

    // Events
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    this.animate();
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onMouseMove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Rotate particles
    this.particles.rotation.x += 0.0003;
    this.particles.rotation.y += 0.0005;

    // Mouse influence
    this.particles.rotation.x += this.mouse.y * 0.0005;
    this.particles.rotation.y += this.mouse.x * 0.0005;

    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize
const particleContainer = document.getElementById('particle-bg');
if (particleContainer) {
  new ParticleBackground(particleContainer);
}
```

---

## 7. Micro-Interactions Library

### 7.1 Button Interactions

```css
/* micro-interactions.css */

/* Ripple effect */
.btn-ripple {
  position: relative;
  overflow: hidden;
}

.btn-ripple::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition: transform 0.5s, opacity 1s;
}

.btn-ripple:active::after {
  transform: scale(0, 0);
  opacity: 0.3;
  transition: 0s;
}

/* Shine sweep */
.btn-shine {
  position: relative;
  overflow: hidden;
}

.btn-shine::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

.btn-shine:hover::before {
  left: 100%;
}

/* Border draw */
.btn-border-draw {
  position: relative;
  background: transparent;
  border: none;
  padding: 12px 24px;
  color: var(--color-text);
}

.btn-border-draw::before,
.btn-border-draw::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.btn-border-draw::before {
  top: 0;
  left: 0;
}

.btn-border-draw::after {
  bottom: 0;
  right: 0;
}

.btn-border-draw:hover::before {
  width: 100%;
  height: 100%;
  border-top-color: var(--color-accent);
  border-right-color: var(--color-accent);
}

.btn-border-draw:hover::after {
  width: 100%;
  height: 100%;
  border-bottom-color: var(--color-accent);
  border-left-color: var(--color-accent);
}

/* Fill slide */
.btn-fill-slide {
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.btn-fill-slide::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-accent);
  transform: translateX(-101%);
  transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1);
  z-index: -1;
}

.btn-fill-slide:hover::before {
  transform: translateX(0);
}
```

### 7.2 Link Interactions

```css
/* Underline animations */
.link-underline-grow {
  position: relative;
}

.link-underline-grow::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 1px;
  background: currentColor;
  transition: width 0.3s ease, left 0.3s ease;
}

.link-underline-grow:hover::after {
  width: 100%;
  left: 0;
}

/* Bracket hover */
.link-brackets::before,
.link-brackets::after {
  display: inline-block;
  opacity: 0;
  transition: transform 0.3s, opacity 0.2s;
}

.link-brackets::before {
  content: '[';
  margin-right: 0.2em;
  transform: translateX(10px);
}

.link-brackets::after {
  content: ']';
  margin-left: 0.2em;
  transform: translateX(-10px);
}

.link-brackets:hover::before,
.link-brackets:hover::after {
  opacity: 1;
  transform: translateX(0);
}

/* Highlight fill */
.link-highlight {
  background: linear-gradient(
    to right,
    var(--color-accent) 50%,
    transparent 50%
  );
  background-size: 200% 100%;
  background-position: right;
  transition: background-position 0.3s ease;
}

.link-highlight:hover {
  background-position: left;
  color: var(--color-bg);
}
```

### 7.3 Card Interactions

```css
/* Card lift with shadow */
.card-lift {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.card-lift:hover {
  transform: translateY(-8px);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

/* Card border glow */
.card-glow {
  position: relative;
}

.card-glow::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(
    135deg,
    var(--color-accent),
    transparent 50%,
    var(--color-accent)
  );
  border-radius: inherit;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-glow:hover::before {
  opacity: 1;
}

/* Card content reveal */
.card-reveal {
  overflow: hidden;
}

.card-reveal .card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    transparent 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 24px;
  transform: translateY(60%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-reveal:hover .card-overlay {
  transform: translateY(0);
}

.card-reveal .card-title {
  transform: translateY(0);
  transition: transform 0.4s;
}

.card-reveal:hover .card-title {
  transform: translateY(-10px);
}

.card-reveal .card-description {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s, transform 0.4s;
  transition-delay: 0.1s;
}

.card-reveal:hover .card-description {
  opacity: 1;
  transform: translateY(0);
}
```

### 7.4 Form Interactions

```css
/* Input focus animation */
.input-animated {
  position: relative;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--color-border);
  padding: 12px 0;
  width: 100%;
  color: var(--color-text);
  transition: border-color 0.3s;
}

.input-animated:focus {
  outline: none;
  border-color: var(--color-accent);
}

.input-animated + .input-label {
  position: absolute;
  left: 0;
  top: 12px;
  color: var(--color-muted);
  pointer-events: none;
  transition:
    transform 0.3s ease,
    font-size 0.3s ease,
    color 0.3s ease;
}

.input-animated:focus + .input-label,
.input-animated:not(:placeholder-shown) + .input-label {
  transform: translateY(-24px);
  font-size: 12px;
  color: var(--color-accent);
}

.input-animated + .input-label + .input-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-accent);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.input-animated:focus + .input-label + .input-line {
  transform: scaleX(1);
}
```

### 7.5 Loading States

```css
/* Skeleton loading */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface) 25%,
    var(--color-surface-light) 50%,
    var(--color-surface) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Pulse dot */
.loading-dot {
  width: 8px;
  height: 8px;
  background: var(--color-accent);
  border-radius: 50%;
  animation: pulse 1.4s ease-in-out infinite both;
}

.loading-dots {
  display: flex;
  gap: 6px;
}

.loading-dots .loading-dot:nth-child(1) { animation-delay: -0.32s; }
.loading-dots .loading-dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes pulse {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Spinner */
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-surface);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## 8. Sound Design

### 8.1 Subtle Audio Feedback

```javascript
// audio.js - Optional subtle sound effects

class AudioFeedback {
  constructor() {
    this.enabled = localStorage.getItem('soundEnabled') !== 'false';
    this.audioContext = null;

    this.sounds = {
      hover: { frequency: 800, duration: 0.05, volume: 0.1 },
      click: { frequency: 600, duration: 0.1, volume: 0.15 },
      success: { frequency: [523, 659, 784], duration: 0.15, volume: 0.12 },
      transition: { frequency: 400, duration: 0.2, volume: 0.08 }
    };
  }

  init() {
    // Create audio context on first user interaction
    document.addEventListener('click', () => {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
    }, { once: true });
  }

  play(type) {
    if (!this.enabled || !this.audioContext) return;

    const sound = this.sounds[type];
    if (!sound) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    const frequencies = Array.isArray(sound.frequency)
      ? sound.frequency
      : [sound.frequency];

    frequencies.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.frequency.value = freq;
      osc.type = 'sine';

      gain.gain.setValueAtTime(sound.volume, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        this.audioContext.currentTime + sound.duration
      );

      osc.start(this.audioContext.currentTime + (i * 0.05));
      osc.stop(this.audioContext.currentTime + sound.duration + (i * 0.05));
    });
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('soundEnabled', this.enabled);
    return this.enabled;
  }
}

// Initialize and bind to interactions
const audio = new AudioFeedback();
audio.init();

document.querySelectorAll('button, a').forEach(el => {
  el.addEventListener('mouseenter', () => audio.play('hover'));
  el.addEventListener('click', () => audio.play('click'));
});
```

---

## 9. Performance Considerations

### 9.1 Animation Performance Checklist

```
┌─────────────────────────────────────────────────────────────┐
│                 PERFORMANCE BEST PRACTICES                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ✓ Use transform and opacity for animations (GPU-accelerated)│
│  ✓ Avoid animating width, height, top, left, margin, padding│
│  ✓ Use will-change sparingly and remove after animation      │
│  ✓ Debounce scroll and resize event handlers                 │
│  ✓ Use requestAnimationFrame for JS animations               │
│  ✓ Implement lazy loading for heavy 3D elements              │
│  ✓ Use CSS containment (contain: layout paint)               │
│  ✓ Reduce motion for users who prefer it                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 Reduced Motion Support

```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```javascript
// Check preference in JS
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  // Disable complex animations
  gsap.globalTimeline.timeScale(1000);
}
```

### 9.3 Lazy Loading Interactions

```javascript
// Defer heavy interactions until needed
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Initialize heavy interactions only when visible
      const el = entry.target;

      if (el.dataset.tilt) {
        new TiltElement(el);
      }

      if (el.dataset.particles) {
        new ParticleBackground(el);
      }

      observer.unobserve(el);
    }
  });
}, { rootMargin: '100px' });

document.querySelectorAll('[data-defer-init]').forEach(el => {
  observer.observe(el);
});
```

---

## 10. Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Set up GSAP with ScrollTrigger
- [ ] Implement custom cursor system
- [ ] Add basic scroll animations (fade-up, stagger)
- [ ] Create micro-interaction CSS library

### Phase 2: Core Interactions (Week 2)
- [ ] Build magnetic button system
- [ ] Implement kinetic typography for hero
- [ ] Add page transition framework (Barba.js)
- [ ] Create 3D tilt cards

### Phase 3: Polish (Week 3)
- [ ] Refine all animation timings/easing
- [ ] Add loading states and skeleton screens
- [ ] Implement reduced motion alternatives
- [ ] Performance optimization pass

### Phase 4: Enhancement (Week 4)
- [ ] Consider adding 3D elements (Spline/Three.js)
- [ ] Optional: Subtle audio feedback
- [ ] Cross-browser testing
- [ ] Mobile optimization

---

## Dependencies

```json
{
  "dependencies": {
    "gsap": "^3.12.0",
    "@barba/core": "^2.9.7"
  },
  "optionalDependencies": {
    "three": "^0.160.0",
    "@splinetool/viewer": "^1.0.0",
    "lenis": "^1.0.0"
  }
}
```

---

## File Structure

```
src/
├── js/
│   ├── main.js
│   ├── cursor.js
│   ├── magnetic.js
│   ├── scroll-animations.js
│   ├── kinetic-text.js
│   ├── transitions.js
│   ├── tilt.js
│   └── audio.js (optional)
│
├── css/
│   ├── style.css
│   ├── cursor.css
│   ├── kinetic-text.css
│   ├── transitions.css
│   └── micro-interactions.css
│
└── index.html
```

---

*This specification provides a complete blueprint for implementing cutting-edge interactive experiences. Each section can be implemented incrementally, allowing for testing and refinement at each stage.*
