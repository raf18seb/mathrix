'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initNav();
  initTeam();
  initTabs();
  initSlider();
  initScrollReveal();
});

// ── Header scroll shadow ──────────────────────────────────
function initHeader() {
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 4);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Mobile nav toggle ─────────────────────────────────────
function initNav() {
  const toggle = document.getElementById('navToggle');
  const nav    = document.getElementById('nav');
  const header = document.getElementById('header');

  function close() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('.nav__link').forEach(link =>
    link.addEventListener('click', close)
  );

  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) close();
  });
}

// ── Team bio expand / collapse ────────────────────────────
function initTeam() {
  const cards = [...document.querySelectorAll('.team__card')];
  const bios  = [...document.querySelectorAll('.team__bio')];

  function closeAll() {
    bios.forEach(b  => { b.hidden = true; });
    cards.forEach(c => c.setAttribute('aria-expanded', 'false'));
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const idx    = card.dataset.member;
      const bio    = document.getElementById(`bio-${idx}`);
      const isOpen = !bio.hidden;

      closeAll();

      if (!isOpen) {
        bio.hidden = false;
        card.setAttribute('aria-expanded', 'true');

        // Scroll bio into view on small screens
        if (window.matchMedia('(max-width: 640px)').matches) {
          setTimeout(() =>
            bio.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
        }
      }
    });
  });

  document.querySelectorAll('.team__bio-close').forEach(btn =>
    btn.addEventListener('click', (e) => { e.stopPropagation(); closeAll(); })
  );
}

// ── Price tabs ────────────────────────────────────────────
function initTabs() {
  const tabs   = [...document.querySelectorAll('.tab')];
  const panels = [...document.querySelectorAll('.tab-panel')];

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const n = tab.dataset.tab;

      tabs.forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });

      panels.forEach(p => {
        const match = p.id === `tab-panel-${n}`;
        p.classList.toggle('active', match);
        p.hidden = !match;
      });
    });
  });
}

// ── Testimonial slider ────────────────────────────────────
function initSlider() {
  const track   = document.getElementById('sliderTrack');
  const dotsEl  = document.getElementById('sliderDots');
  const counter = document.getElementById('sliderCounter');
  const slides  = [...track.children];
  const total   = slides.length;

  let current = 0;
  let timer;

  // Build dot buttons
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Opinia ${i + 1} z ${total}`);
    dot.addEventListener('click', () => { goTo(i); resetTimer(); });
    dotsEl.appendChild(dot);
  });

  const dots = [...dotsEl.children];

  function goTo(i) {
    current = ((i % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, j) => d.classList.toggle('active', j === current));
    counter.textContent = `${current + 1} / ${total}`;
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(next, 7000);
  }

  document.getElementById('sliderNext').addEventListener('click', () => { next(); resetTimer(); });
  document.getElementById('sliderPrev').addEventListener('click', () => { prev(); resetTimer(); });

  // Keyboard support
  document.getElementById('slider').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { next(); resetTimer(); }
    if (e.key === 'ArrowLeft')  { prev(); resetTimer(); }
  });

  // Touch / pointer swipe
  let startX = 0;
  track.addEventListener('pointerdown', e => { startX = e.clientX; }, { passive: true });
  track.addEventListener('pointerup',   e => {
    const delta = startX - e.clientX;
    if (Math.abs(delta) > 48) { delta > 0 ? next() : prev(); resetTimer(); }
  }, { passive: true });

  resetTimer();
}

// ── Scroll reveal (IntersectionObserver) ─────────────────
function initScrollReveal() {
  const els = [...document.querySelectorAll('.reveal')];
  if (!els.length) return;

  if (!window.IntersectionObserver) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  els.forEach(el => io.observe(el));
}
