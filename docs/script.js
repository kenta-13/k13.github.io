// Retro 1999 Site with Modern Functionality
// Single Page Application Router & Features

class RetroModernSite {
  constructor() {
    this.currentPage = 'index';
    this.visitorCount = this.getVisitorCount();
    this.theme = localStorage.getItem('theme') || 'retro';
    this.init();
  }

  init() {
    console.log('🚀 Initializing Retro Modern Site...');
    this.updateVisitorCounter();
    this.setupThemeToggle();
    this.setupRouting();
    this.setupAnimations();
    this.initializePageFeatures();
    this.setupServiceWorker();
  }

  // ===== VISITOR COUNTER =====
  getVisitorCount() {
    let count = localStorage.getItem('visitorCount');
    if (!count) {
      count = Math.floor(Math.random() * 100) + 1; // Start with random number
      localStorage.setItem('visitorCount', count);
    } else {
      count = parseInt(count) + 1;
      localStorage.setItem('visitorCount', count);
    }
    return count;
  }

  updateVisitorCounter() {
    const counterElement = document.querySelector('.visitor-number');
    if (counterElement) {
      const paddedCount = String(this.visitorCount).padStart(6, '0');
      counterElement.textContent = paddedCount;

      // Add animation
      counterElement.classList.add('pulse');
      setTimeout(() => counterElement.classList.remove('pulse'), 1000);
    }
  }

  // ===== THEME TOGGLE =====
  setupThemeToggle() {
    // Create theme toggle button if it doesn't exist
    if (!document.querySelector('.theme-toggle')) {
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'theme-toggle';
      toggleBtn.innerHTML = '🌓 THEME';
      toggleBtn.onclick = () => this.toggleTheme();
      document.body.appendChild(toggleBtn);
    }

    // Apply saved theme
    this.applyTheme();
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', this.theme);
    this.applyTheme();
  }

  applyTheme() {
    document.body.className = this.theme === 'dark' ? 'dark-theme' : 'light-theme';
  }

  // ===== SPA ROUTING =====
  setupRouting() {
    // Only intercept specific prototype page links, allow normal navigation for other pages
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        const url = new URL(link.href);
        const path = url.pathname;

        // Allow normal navigation for excel-tips.html and other external pages
        // Only intercept prototype pages (which don't exist anymore)
        if (path.includes('excel-tips.html') || path.includes('index.html') || path === '/') {
          // Let the browser handle normal navigation
          return;
        }

        // Only intercept if it's a prototype page
        if (path.includes('prototype')) {
          e.preventDefault();
          this.navigate(path);
        }
      }
    });

    // Handle back/forward buttons
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.page) {
        this.loadPage(e.state.page, false);
      }
    });
  }

  navigate(path) {
    const page = path.replace(/^\/|\/$/g, '').replace('.html', '') || 'index';
    history.pushState({ page }, '', path);
    this.loadPage(page);
  }

  async loadPage(pageName, updateHistory = true) {
    // Smooth fade out
    document.body.style.opacity = '0.5';

    // Simulate page load (in real SPA, you'd fetch/render content)
    await new Promise(resolve => setTimeout(resolve, 300));

    // Update current page
    this.currentPage = pageName;

    // Reinitialize page-specific features
    this.initializePageFeatures();

    // Smooth fade in
    document.body.style.opacity = '1';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ===== PAGE-SPECIFIC FEATURES =====
  initializePageFeatures() {
    const page = this.getCurrentPageFromURL();

    switch(page) {
      case 'prototype05':
        this.initArcadeGame();
        break;
      case 'prototype06':
        this.initMusicPlayer();
        break;
      case 'prototype07':
        this.initTerminal();
        break;
      case 'prototype10':
        this.initCountdown();
        break;
    }

    // Update visitor counter on index
    if (page === 'index') {
      this.updateVisitorCounter();
    }
  }

  getCurrentPageFromURL() {
    const path = window.location.pathname;
    const page = path.replace(/^\/|\/$/g, '').replace('.html', '') || 'index';
    return page.split('/').pop();
  }

  // ===== ARCADE GAME (Prototype 05) =====
  initArcadeGame() {
    console.log('🕹️ Initializing Arcade Game...');

    // Simple score incrementer
    const scoreElement = document.querySelector('.game-score');
    if (scoreElement) {
      let score = 1234560;
      setInterval(() => {
        score += Math.floor(Math.random() * 100);
        scoreElement.textContent = score;
      }, 2000);
    }

    // Button interactions
    const buttons = document.querySelectorAll('.game-button');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => btn.style.transform = 'scale(1)', 100);
      });
    });
  }

  // ===== MUSIC PLAYER (Prototype 06) =====
  initMusicPlayer() {
    console.log('🎵 Initializing Music Player...');

    const playBtn = document.querySelector('.play-btn');
    const pauseBtn = document.querySelector('.pause-btn');
    const progressBar = document.querySelector('.progress-bar');

    let isPlaying = false;
    let progress = 0;
    let interval;

    const updateProgress = () => {
      if (isPlaying) {
        progress += 0.5;
        if (progress >= 100) progress = 0;

        if (progressBar) {
          progressBar.style.width = progress + '%';
        }
      }
    };

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        isPlaying = true;
        interval = setInterval(updateProgress, 100);
      });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        isPlaying = false;
        clearInterval(interval);
      });
    }
  }

  // ===== INTERACTIVE TERMINAL (Prototype 07) =====
  initTerminal() {
    console.log('💻 Initializing Terminal...');

    const terminalOutput = document.querySelector('.terminal-output');
    const terminalInput = document.querySelector('.terminal-input');

    if (terminalInput) {
      terminalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const command = terminalInput.value.trim().toUpperCase();
          this.executeTerminalCommand(command, terminalOutput);
          terminalInput.value = '';
        }
      });
    }

    // Auto-typing effect for terminal
    this.terminalAutoType();
  }

  terminalAutoType() {
    const cursor = document.querySelector('.terminal-cursor');
    if (cursor) {
      setInterval(() => {
        cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
      }, 500);
    }
  }

  executeTerminalCommand(command, output) {
    const responses = {
      'HELP': 'Available commands: HELP, STATUS, FILES, EXIT, HELLO',
      'STATUS': 'All systems operational. CPU: 85%, RAM: 60%, NETWORK: ONLINE',
      'FILES': 'prototype01.html, prototype02.html, ... prototype10.html',
      'HELLO': 'Hello, User! Welcome to the system.',
      'EXIT': 'Logging out... Just kidding, you\'re stuck here! 😄'
    };

    const response = responses[command] || `Command not found: ${command}`;

    if (output) {
      const line = document.createElement('div');
      line.style.color = '#00FF00';
      line.textContent = `> ${command}\n${response}\n`;
      output.appendChild(line);
      output.scrollTop = output.scrollHeight;
    }
  }

  // ===== COUNTDOWN TIMER (Prototype 10) =====
  initCountdown() {
    console.log('⏰ Initializing Countdown...');

    // Countdown to a future date (New Year 2026 for example)
    const targetDate = new Date('2026-01-01T00:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Update DOM elements
      const daysEl = document.querySelector('.countdown-days');
      const hoursEl = document.querySelector('.countdown-hours');
      const minutesEl = document.querySelector('.countdown-minutes');
      const secondsEl = document.querySelector('.countdown-seconds');

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ===== ANIMATIONS =====
  setupAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, { threshold: 0.1 });

    // Observe all tables
    document.querySelectorAll('table').forEach(table => {
      observer.observe(table);
    });

    // Add glow effect to special elements
    document.querySelectorAll('blink, .special').forEach(el => {
      el.classList.add('glow');
    });
  }

  // ===== SERVICE WORKER (PWA Support) =====
  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(() => {
        console.log('✅ Service Worker registered (PWA ready!)');
      }).catch(err => {
        console.log('⚠️ Service Worker registration failed:', err);
      });
    }
  }

  // ===== ANALYTICS (Privacy-friendly) =====
  trackPageView() {
    const pageViews = JSON.parse(localStorage.getItem('pageViews') || '{}');
    const page = this.getCurrentPageFromURL();
    pageViews[page] = (pageViews[page] || 0) + 1;
    localStorage.setItem('pageViews', JSON.stringify(pageViews));
  }
}

// Initialize the site
document.addEventListener('DOMContentLoaded', () => {
  window.retroSite = new RetroModernSite();

  // Add Easter Eggs
  console.log('%c🎮 Welcome to the Retro Future! 🎮', 'color: #00FF00; font-size: 20px; font-weight: bold;');
  console.log('%cTry typing: retroSite.visitorCount', 'color: #00FFFF;');

  // Konami Code Easter Egg
  let konamiCode = [];
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
      alert('🎮 KONAMI CODE ACTIVATED! You found the secret! 🎮');
      document.body.style.animation = 'spin 2s linear';
      setTimeout(() => document.body.style.animation = '', 2000);
    }
  });
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RetroModernSite;
}
