'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initHeader();
  initNav();
  initTeam();
  initTabs();
  initOpinie();
  initScrollReveal();
  initFooterYear();
});

// ── DEV: Theme switcher (usunąć przed produkcją) ─────────
function initThemeSwitcher() {
  const btns = [...document.querySelectorAll('.dev-themes__btn')];
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const theme = btn.dataset.theme;
      if (theme === 'default') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', theme);
      }
    });
  });
}

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

// ── Testimonial grid – show more / hide ──────────────────
function initOpinie() {
  const btn   = document.getElementById('opinieMoreBtn');
  const extra = [...document.querySelectorAll('.testimonial-card[hidden]')];

  if (!btn || !extra.length) return;

  let expanded = false;

  btn.addEventListener('click', () => {
    expanded = !expanded;
    extra.forEach(card => { card.hidden = !expanded; });
    btn.innerHTML = expanded
      ? '<i class="fa-solid fa-chevron-up" aria-hidden="true"></i> Zwiń opinie'
      : '<i class="fa-solid fa-chevron-down" aria-hidden="true"></i> Pokaż wszystkie opinie';

    if (!expanded) {
      document.getElementById('opinie')
        .scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
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

// ── Footer year ───────────────────────────────────────────
function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}
