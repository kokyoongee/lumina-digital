/* ============================================
   KINETIC TYPOGRAPHY MODULE
   ============================================ */

import { gsap } from 'gsap';

// ============================================
// TEXT SPLITTING UTILITY
// ============================================
export function splitText(element, type = 'chars') {
  const text = element.textContent.trim();
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

  return element;
}

// ============================================
// TEXT SCRAMBLE EFFECT
// ============================================
export class TextScramble {
  constructor(element) {
    this.el = element;
    this.chars = '!<>-_\\/[]{}—=+*^?#';
    this.update = this.update.bind(this);
    this.frameRequest = null;
    this.frame = 0;
    this.queue = [];
    this.resolve = null;
  }

  setText(newText) {
    const oldText = this.el.textContent;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));

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
// WORD ROTATOR
// ============================================
export class WordRotator {
  constructor(element, words, options = {}) {
    this.el = element;
    this.words = words;
    this.options = {
      interval: 3000,
      ...options
    };

    this.currentIndex = 0;
    this.scrambler = new TextScramble(element);
    this.timeoutId = null;

    this.start();
  }

  start() {
    this.next();
  }

  next() {
    this.scrambler.setText(this.words[this.currentIndex]).then(() => {
      this.timeoutId = setTimeout(() => this.next(), this.options.interval);
    });
    this.currentIndex = (this.currentIndex + 1) % this.words.length;
  }

  stop() {
    clearTimeout(this.timeoutId);
  }
}

// ============================================
// CHARACTER CASCADE
// ============================================
export function charCascade(element, options = {}) {
  const settings = {
    duration: 0.8,
    stagger: 0.03,
    ease: 'back.out(1.7)',
    from: { y: 50, opacity: 0, rotateX: -90 },
    ...options
  };

  splitText(element, 'chars');
  const chars = element.querySelectorAll('.char');

  return gsap.from(chars, {
    ...settings.from,
    duration: settings.duration,
    stagger: settings.stagger,
    ease: settings.ease
  });
}

// ============================================
// ELASTIC WAVE
// ============================================
export function elasticWave(element, options = {}) {
  const settings = {
    duration: 1.2,
    stagger: 0.05,
    ease: 'elastic.out(1, 0.3)',
    ...options
  };

  splitText(element, 'chars');
  const chars = element.querySelectorAll('.char');

  return gsap.from(chars, {
    y: -100,
    opacity: 0,
    duration: settings.duration,
    ease: settings.ease,
    stagger: {
      each: settings.stagger,
      from: 'start'
    }
  });
}

// ============================================
// GLITCH TEXT EFFECT (CSS-based)
// ============================================
export function glitchText(element) {
  element.classList.add('glitch');
  element.dataset.text = element.textContent;
}

// ============================================
// TYPEWRITER EFFECT
// ============================================
export class Typewriter {
  constructor(element, options = {}) {
    this.el = element;
    this.options = {
      speed: 50,
      delay: 0,
      cursor: true,
      ...options
    };

    this.text = element.textContent;
    this.el.textContent = '';

    if (this.options.cursor) {
      this.el.classList.add('typewriter-cursor');
    }
  }

  type() {
    return new Promise((resolve) => {
      setTimeout(() => {
        let i = 0;
        const interval = setInterval(() => {
          if (i < this.text.length) {
            this.el.textContent += this.text.charAt(i);
            i++;
          } else {
            clearInterval(interval);
            resolve();
          }
        }, this.options.speed);
      }, this.options.delay);
    });
  }
}

// ============================================
// INITIALIZE FROM DATA ATTRIBUTES
// ============================================
export function initKineticText() {
  // Character cascade
  document.querySelectorAll('[data-kinetic="cascade"]').forEach((el) => {
    charCascade(el);
  });

  // Elastic wave
  document.querySelectorAll('[data-kinetic="elastic"]').forEach((el) => {
    elasticWave(el);
  });

  // Glitch
  document.querySelectorAll('[data-kinetic="glitch"]').forEach((el) => {
    glitchText(el);
  });

  // Word rotation
  document.querySelectorAll('[data-kinetic="rotate"]').forEach((el) => {
    const words = el.dataset.words?.split(',').map((w) => w.trim()) || [];
    if (words.length > 0) {
      new WordRotator(el, words, {
        interval: parseInt(el.dataset.interval, 10) || 3000
      });
    }
  });
}
