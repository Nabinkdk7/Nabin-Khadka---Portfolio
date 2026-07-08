/* ==========================================================================
   NABIN KHADKA — PORTFOLIO INTERACTIONS (v3.0)
   Delta-Time Canvas Physics • Throttled 3D Tilt • Magnetic Physics • Idle-Aware
   ========================================================================== */

(function () {
  'use strict';

  // --- QUERY UTILITIES ---
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // --- LOCAL VARIABLE DATA ---
  // Base64 encoded email to prevent spam harvesting: "nabin@frontend.dev"
  const ENCODED_EMAIL = 'bmFiaW5AZnJvbnRlbmQuZGV2';

  // --- INITIALIZATION ---
  window.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initTheme();
    initMobileNav();
    initRevealAnimations();
    initMagneticHover();
    initPerspectiveTilt();
    initProjectFiltering();
    initEmailDecryption();
    initCanvasParticles();
    initAboutCanvas(); // Newly Added About Section Canvas
    initCanvasPlayground(); // Newly Added Motion Sandbox
    initBackToTop();
    
    // Set footer year
    $('#current-year').textContent = new Date().getFullYear();
  });

  // --- PAGE LOADER ---
  function initLoader() {
    const loader = $('#loader');
    if (!loader) return;
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('loaded');
        // Trigger entrance animations for visible items
        document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('active'));
      }, 700);
    });
  }

  // --- DARK / LIGHT THEME TOGGLE ---
  function initTheme() {
    const themeToggle = $('#theme-toggle');
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  }

  // --- SCROLL EVENTS & NAVBAR STATE ---
  const navbar = $('#navbar');
  const navLinks = $$('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Navigation Highlighting and Scroll Reveal
  function initRevealAnimations() {
    const sections = $$('section[id]');
    
    const navObserverOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, navObserverOptions);

    sections.forEach(sec => navObserver.observe(sec));

    // Scroll reveal cards / items
    const revealEls = $$('.reveal');
    const revealObserverOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, revealObserverOptions);

    revealEls.forEach(el => revealObserver.observe(el));
  }

  // --- MOBILE NAVIGATION PANEL ---
  function initMobileNav() {
    const hamburger = $('#hamburger');
    const mobileNav = $('#mobile-nav');

    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileNav.classList.toggle('open', isOpen);
      mobileNav.setAttribute('aria-hidden', !isOpen);
    });

    mobileNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // --- MAGNETIC HOVER ELEMENT PHYSICS ---
  function initMagneticHover() {
    const magneticItems = $$('[data-magnetic]');
    
    magneticItems.forEach(item => {
      item.addEventListener('mousemove', (e) => {
        const bounds = item.getBoundingClientRect();
        const relX = e.clientX - (bounds.left + bounds.width / 2);
        const relY = e.clientY - (bounds.top + bounds.height / 2);
        
        const pullX = relX * 0.28;
        const pullY = relY * 0.35;
        
        item.style.transform = `translate(${pullX.toFixed(2)}px, ${pullY.toFixed(2)}px)`;
      });

      item.addEventListener('mouseleave', () => {
        item.style.transform = '';
      });
    });
  }

  // --- THROTTLED 3D CARD PERSPECTIVE TILT ---
  function initPerspectiveTilt() {
    const cards = $$('.avatar-frame, .project-card, .stat-card');
    
    cards.forEach(card => {
      let isThrottled = false;
      
      card.addEventListener('mousemove', (e) => {
        if (isThrottled) return;
        
        isThrottled = true;
        requestAnimationFrame(() => {
          const bounds = card.getBoundingClientRect();
          const w = bounds.width;
          const h = bounds.height;
          
          const percentX = (e.clientX - bounds.left) / w - 0.5;
          const percentY = (e.clientY - bounds.top) / h - 0.5;
          
          const rotY = (percentX * 8).toFixed(2);
          const rotX = (percentY * -8).toFixed(2);
          
          card.style.transform = `perspective(1000px) rotateY(${rotY}deg) rotateX(${rotX}deg) translateY(-4px)`;
          isThrottled = false;
        });
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // --- FILTERABLE PROJECTS GRID ---
  function initProjectFiltering() {
    const filters = $$('.filter-btn');
    const cards = $$('.project-card');

    if (!filters.length || !cards.length) return;

    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(f => {
          f.classList.remove('active');
          f.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const activeFilter = btn.dataset.filter;

        cards.forEach(card => {
          const category = card.dataset.category;

          if (activeFilter === 'all' || category === activeFilter) {
            card.style.display = '';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 400);
          }
        });
      });
    });
  }

  // --- SECURE BASE64 EMAIL DECRYPTION ---
  function initEmailDecryption() {
    const emailCard = $('#obfuscated-email');
    const emailText = $('#email-text');

    if (!emailCard || !emailText) return;

    let decrypted = false;

    function decrypt() {
      if (decrypted) return;
      const email = atob(ENCODED_EMAIL);
      emailCard.href = `mailto:${email}`;
      emailText.textContent = email;
      decrypted = true;
    }

    emailCard.addEventListener('mouseover', decrypt);
    emailCard.addEventListener('focus', decrypt);
    emailCard.addEventListener('touchstart', decrypt, { passive: true });
  }

  // --- IDLE-AWARE HERO BACKGROUND PARTICLES ---
  function initCanvasParticles() {
    const canvas = $('#hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let particles = [];
    let width, height;
    let lastTime = performance.now();
    
    let isElementVisible = true;
    let isDocumentVisible = true;

    const heroSection = $('#home');
    if (heroSection) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isElementVisible = entry.isIntersecting;
          if (isElementVisible && isDocumentVisible) {
            lastTime = performance.now();
            requestAnimationFrame(tick);
          }
        });
      }, { threshold: 0.05 });
      heroObserver.observe(heroSection);
    }

    document.addEventListener('visibilitychange', () => {
      isDocumentVisible = document.visibilityState === 'visible';
      if (isElementVisible && isDocumentVisible) {
        lastTime = performance.now();
        requestAnimationFrame(tick);
      }
    });

    function resize() {
      width = canvas.width = heroSection.clientWidth;
      height = canvas.height = heroSection.clientHeight;
      
      const count = Math.min(60, Math.floor((width * height) / 25000));
      particles = [];
      
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 20,
          vy: (Math.random() - 0.5) * 20
        });
      }
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    function tick(timestamp) {
      if (!isElementVisible || !isDocumentVisible) return;

      const delta = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      const capDelta = Math.min(delta, 0.1);
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx * capDelta;
        p.y += p.vy * capDelta;

        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > height) { p.y = height; p.vy *= -1; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(155, 170, 196, 0.45)';
        ctx.fill();
      });

      ctx.lineWidth = 0.5;
      const maxDistance = 110;
      
      const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
      const colorValue = isLightTheme ? '124, 58, 237' : '94, 234, 212';

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.18;
            ctx.strokeStyle = `rgba(${colorValue}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(tick);
    }
  }

  // --- ATTRACTIVE ABOUT ME BACKGROUND CANVAS ---
  function initAboutCanvas() {
    const canvas = $('#about-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let particles = [];
    let width, height;
    let lastTime = performance.now();
    let isElementVisible = false;
    let isDocumentVisible = true;

    // We will use a purple/pink theme to make it look premium
    const config = {
      count: 45,
      speed: 1.2,
      distance: 140,
      color: 'rgba(167, 139, 250, ' // Using Violet as base
    };

    let mouse = { x: -1000, y: -1000, active: false };

    const aboutSection = $('#about');
    if (aboutSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isElementVisible = entry.isIntersecting;
          if (isElementVisible && isDocumentVisible) {
            lastTime = performance.now();
            requestAnimationFrame(tick);
          }
        });
      }, { threshold: 0.05 });
      observer.observe(aboutSection);
    }

    document.addEventListener('visibilitychange', () => {
      isDocumentVisible = document.visibilityState === 'visible';
      if (isElementVisible && isDocumentVisible) {
        lastTime = performance.now();
        requestAnimationFrame(tick);
      }
    });

    function resize() {
      width = canvas.width = aboutSection.clientWidth;
      height = canvas.height = aboutSection.clientHeight;
      
      particles = [];
      for (let i = 0; i < config.count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 40,
          vy: (Math.random() - 0.5) * 40
        });
      }
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    aboutSection.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });

    aboutSection.addEventListener('mouseleave', () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    });

    function tick(timestamp) {
      if (!isElementVisible || !isDocumentVisible) return;

      const delta = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      const capDelta = Math.min(delta, 0.1);
      ctx.clearRect(0, 0, width, height);

      const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
      const colorPrefix = isLightTheme ? 'rgba(124, 58, 237, ' : 'rgba(167, 139, 250, ';

      particles.forEach((p) => {
        p.x += p.vx * capDelta * config.speed;
        p.y += p.vy * capDelta * config.speed;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          
          if (dist < 150) {
            p.x += (dx / dist) * 30 * capDelta;
            p.y += (dy / dist) * 30 * capDelta;
          }
        }

        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > height) { p.y = height; p.vy *= -1; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${colorPrefix}0.7)`;
        ctx.fill();
      });

      ctx.lineWidth = 0.8;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        if (mouse.active) {
          const mdx = p1.x - mouse.x;
          const mdy = p1.y - mouse.y;
          const mdist = Math.hypot(mdx, mdy);
          
          if (mdist < config.distance + 40) {
            const alpha = (1 - mdist / (config.distance + 40)) * 0.5;
            ctx.strokeStyle = `${colorPrefix}${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < config.distance) {
            const alpha = (1 - dist / config.distance) * 0.25;
            ctx.strokeStyle = `${colorPrefix}${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(tick);
    }
  }

  // --- IDLE-AWARE PLAYGROUND SANDBOX GRAPHICS ---
  function initCanvasPlayground() {
    const canvas = $('#sandbox-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const statsEl = $('#sandbox-stats');
    
    // Sliders & Controls
    const speedSlider = $('#slider-speed');
    const countSlider = $('#slider-count');
    const distanceSlider = $('#slider-distance');
    const resetBtn = $('#btn-reset-sandbox');
    const colorPills = $$('#color-palette-options .color-pill');

    const valSpeed = $('#val-speed');
    const valCount = $('#val-count');
    const valDistance = $('#val-distance');

    let particles = [];
    let width = 0, height = 0;
    let lastTime = performance.now();
    let frameTimes = [];
    
    // User Control Variables
    let config = {
      speed: 1.0,
      count: 60,
      distance: 110,
      color: '#5eead4' // Teal by default
    };

    // Tracking mouse interaction inside sandbox
    let mouse = { x: null, y: null, active: false };

    // Visibility States
    let isElementVisible = false;
    let isDocumentVisible = true;

    // Observe Playground Section
    const playgroundSec = $('#playground');
    if (playgroundSec) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isElementVisible = entry.isIntersecting;
          if (isElementVisible && isDocumentVisible) {
            lastTime = performance.now();
            requestAnimationFrame(tick);
          }
        });
      }, { threshold: 0.05 });
      observer.observe(playgroundSec);
    }

    document.addEventListener('visibilitychange', () => {
      isDocumentVisible = document.visibilityState === 'visible';
      if (isElementVisible && isDocumentVisible) {
        lastTime = performance.now();
        requestAnimationFrame(tick);
      }
    });

    // Populate particles pool
    function buildParticles() {
      particles = [];
      for (let i = 0; i < config.count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 35,
          vy: (Math.random() - 0.5) * 35
        });
      }
    }

    // Resize handling
    function resize() {
      const parent = canvas.parentElement;
      width = canvas.width = parent.clientWidth;
      height = canvas.height = parent.clientHeight;
      buildParticles();
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // --- Control Sliders Event Binding ---
    speedSlider.addEventListener('input', (e) => {
      config.speed = parseFloat(e.target.value);
      valSpeed.textContent = config.speed.toFixed(1) + 'x';
    });

    countSlider.addEventListener('input', (e) => {
      config.count = parseInt(e.target.value);
      valCount.textContent = config.count;
      buildParticles();
    });

    distanceSlider.addEventListener('input', (e) => {
      config.distance = parseInt(e.target.value);
      valDistance.textContent = config.distance + 'px';
    });

    resetBtn.addEventListener('click', () => {
      buildParticles();
    });

    // Color theme bindings
    colorPills.forEach(pill => {
      pill.addEventListener('click', () => {
        colorPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        
        // Grab color from style background directly
        config.color = pill.style.backgroundColor;
      });
    });

    // --- Canvas Mouse Listeners ---
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    canvas.addEventListener('click', () => {
      if (!mouse.active) return;
      // Click explosion - spawn temporary particles
      for (let i = 0; i < 12; i++) {
        particles.push({
          x: mouse.x,
          y: mouse.y,
          r: Math.random() * 2 + 1.5,
          vx: (Math.random() - 0.5) * 150,
          vy: (Math.random() - 0.5) * 150,
          temp: true,
          life: 1.0 // opacity fades out
        });
      }
    });

    // --- Animation Simulation Loop ---
    function tick(timestamp) {
      if (!isElementVisible || !isDocumentVisible) return;

      const delta = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      const capDelta = Math.min(delta, 0.1);
      ctx.clearRect(0, 0, width, height);

      // FPS calculation
      frameTimes.push(timestamp);
      while (frameTimes.length > 0 && frameTimes[0] <= timestamp - 1000) {
        frameTimes.shift();
      }
      statsEl.textContent = `${frameTimes.length} FPS`;

      // Update particles
      particles.forEach((p, index) => {
        // Physics update
        p.x += p.vx * capDelta * config.speed;
        p.y += p.vy * capDelta * config.speed;

        // Fading for click-spawned elements
        if (p.temp) {
          p.life -= capDelta * 1.5;
          if (p.life <= 0) {
            particles.splice(index, 1);
            return;
          }
        }

        // Mouse attraction/repulsion logic
        if (mouse.active && !p.temp) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          
          if (dist < 130) {
            // Pull closer to mouse to build magnetic cluster
            p.x -= (dx / dist) * 20 * capDelta;
            p.y -= (dy / dist) * 20 * capDelta;
          }
        }

        // Boundaries checks
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > height) { p.y = height; p.vy *= -1; }

        // Render node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        
        if (p.temp) {
          ctx.fillStyle = config.color.replace(')', `, ${p.life})`).replace('rgb', 'rgba');
        } else {
          ctx.fillStyle = config.color.replace(')', ', 0.65)').replace('rgb', 'rgba');
        }
        ctx.fill();
      });

      // Render lines connecting nodes
      ctx.lineWidth = 0.6;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Draw connections to mouse cursor
        if (mouse.active) {
          const mdx = p1.x - mouse.x;
          const mdy = p1.y - mouse.y;
          const mdist = Math.hypot(mdx, mdy);
          
          if (mdist < config.distance) {
            const alpha = (1 - mdist / config.distance) * 0.4;
            ctx.strokeStyle = config.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        // Draw node-to-node connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < config.distance) {
            const factor1 = p1.temp ? p1.life : 1;
            const factor2 = p2.temp ? p2.life : 1;
            const baseAlpha = (1 - dist / config.distance) * 0.22;
            const alpha = baseAlpha * Math.min(factor1, factor2);
            
            ctx.strokeStyle = config.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(tick);
    }
  }

  // --- FLOATING BACK TO TOP CONTROL ---
  function initBackToTop() {
    const btn = $('#back-to-top');
    if (!btn) return;

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Ambient cursor coordinates tracking
  window.addEventListener('mousemove', (e) => {
    document.body.style.setProperty('--mx', `${e.clientX}px`);
    document.body.style.setProperty('--my', `${e.clientY}px`);
  }, { passive: true });

})();
