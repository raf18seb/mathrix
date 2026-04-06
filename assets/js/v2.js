/* ════════════════════════════════════════════════════════════════════════════
   MATHrix v2 — Main JS
   ════════════════════════════════════════════════════════════════════════════ */

'use strict';

/* ─── Density switcher ───────────────────────────────────────────────────── */

(function initDensity() {
  const saved = localStorage.getItem('mathrix-density') || 'normal';
  document.documentElement.setAttribute('data-density', saved);

  const btns = document.querySelectorAll('.density-btn');
  btns.forEach(btn => {
    if (btn.dataset.density === saved) {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    btn.addEventListener('click', () => {
      const density = btn.dataset.density;
      document.documentElement.setAttribute('data-density', density);
      localStorage.setItem('mathrix-density', density);
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
})();


/* ─── Theme switcher ─────────────────────────────────────────────────────── */

(function initTheme() {
  const saved = localStorage.getItem('mathrix-theme-v2') || 'dark-premium';
  document.documentElement.setAttribute('data-theme', saved);

  const dots = document.querySelectorAll('.theme-dot');
  dots.forEach(dot => {
    if (dot.dataset.theme === saved) dot.classList.add('active');
    dot.addEventListener('click', () => {
      const theme = dot.dataset.theme;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('mathrix-theme-v2', theme);
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });
})();


/* ─── Header scroll shadow ───────────────────────────────────────────────── */

(function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const toggle = () => header.classList.toggle('scrolled', window.scrollY > 8);
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
})();


/* ─── Mobile nav toggle ──────────────────────────────────────────────────── */

(function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');
  if (!hamburger || !nav) return;

  const navLinks = nav.querySelector('.nav-links');

  function open() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    navLinks.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () =>
    hamburger.classList.contains('open') ? close() : open()
  );

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link =>
    link.addEventListener('click', close)
  );

  // Close on outside click
  document.addEventListener('click', e => {
    if (!document.getElementById('header').contains(e.target)) close();
  });
})();


/* ─── Scroll reveal ──────────────────────────────────────────────────────── */

(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();


/* ─── Stats counter animation ────────────────────────────────────────────── */

(function initCounters() {
  const counters = document.querySelectorAll('.stat-count[data-target]');
  if (!counters.length) return;

  let fired = false;

  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  const run = () => {
    counters.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 1600;
      const start = performance.now();

      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(easeOutCubic(progress) * target);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };

  const observer = new IntersectionObserver(entries => {
    if (!fired && entries.some(e => e.isIntersecting)) {
      fired = true;
      run();
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  const strip = document.getElementById('stats');
  if (strip) observer.observe(strip);
})();


/* ─── Cennik tabs ────────────────────────────────────────────────────────── */

(function initTabs() {
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const panel = document.getElementById('panel-' + target);
      if (panel) panel.classList.add('active');
    });
  });
})();


/* ─── Team bio expand/collapse ───────────────────────────────────────────── */

(function initTeamBio() {
  const toggles = document.querySelectorAll('.team-toggle');
  if (!toggles.length) return;

  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.team-card');
      const isOpen = card.classList.contains('bio-open');

      card.classList.toggle('bio-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });
})();


/* ─── Reviews toggle ─────────────────────────────────────────────────────── */

(function initReviews() {
  const btn  = document.getElementById('reviews-toggle');
  const grid = document.getElementById('reviews-grid');
  if (!btn || !grid) return;

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';

    if (!expanded) {
      grid.classList.add('expanded');
      btn.setAttribute('aria-expanded', 'true');
      btn.querySelector('span').textContent = 'Ukryj dodatkowe opinie';

      // Trigger reveal on newly visible cards
      grid.querySelectorAll('.review-extra.reveal').forEach(card => {
        setTimeout(() => card.classList.add('visible'), 50);
      });
    } else {
      grid.classList.remove('expanded');
      btn.setAttribute('aria-expanded', 'false');
      btn.querySelector('span').textContent = 'Pokaż wszystkie opinie';
    }
  });
})();


/* ─── Copy buttons ───────────────────────────────────────────────────────── */

(function initCopyBtns() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        const icon = btn.querySelector('i');
        icon.className = 'fa-solid fa-check';
        btn.classList.add('copied');
        setTimeout(() => {
          icon.className = 'fa-regular fa-copy';
          btn.classList.remove('copied');
        }, 2000);
      } catch (e) {
        // fallback — silently ignore
      }
    });
  });
})();


/* ─── Footer year ────────────────────────────────────────────────────────── */

(function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ─── Scrollspy ──────────────────────────────────────────────────────────── */

(function initScrollspy() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const setActive = id => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-15% 0px -75% 0px' });

  sections.forEach(s => observer.observe(s));
})();


/* ─── Smooth scroll for anchor links ────────────────────────────────────── */

(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('header')?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
