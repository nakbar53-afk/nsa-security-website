/* ===== NSA Security Group LLC — Main JS ===== */

document.addEventListener('DOMContentLoaded', () => {
  // ── Navbar scroll effect ──
  const nav = document.getElementById('mainNav');
  const handleScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ── Mobile toggle ──
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    links.classList.toggle('active');
    const spans = toggle.querySelectorAll('span');
    toggle.classList.toggle('open');
    if (toggle.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile menu on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('active');
      toggle.classList.remove('open');
      toggle.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity = '';
      });
    });
  });

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      e.preventDefault();
      const target = document.querySelector(id);
      if (target) {
        const offset = nav.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Scroll reveal animations ──
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger siblings
        const parent = entry.target.parentElement;
        const siblings = parent ? Array.from(parent.querySelectorAll('.reveal')) : [];
        const idx = siblings.indexOf(entry.target);
        const delay = idx >= 0 ? idx * 120 : 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));

  // ── Quote form handling (submits to Netlify Forms) ──
  const form = document.getElementById('quoteForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(form);
    
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    })
    .then(() => {
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Quote Request Sent!';
      btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      btn.style.color = '#fff';
      form.reset();
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.style.color = '';
      }, 4000);
    })
    .catch(() => {
      // Fallback to mailto if fetch fails
      const values = Object.fromEntries(formData.entries());
      const subject = encodeURIComponent('Security Quote Request — ' + values.firstName + ' ' + values.lastName);
      const body = encodeURIComponent(
        `Name: ${values.firstName} ${values.lastName}\nEmail: ${values.email}\nPhone: ${values.phone || 'N/A'}\nService: ${values.serviceType}\n\nDetails:\n${values.message || 'N/A'}`
      );
      window.location.href = `mailto:info@nsasecuritygroup.com?subject=${subject}&body=${body}`;
    });
  });

  // ── Counter animation for hero stats ──
  const statValues = document.querySelectorAll('.hero-stat-value');
  const animateValue = (el) => {
    const text = el.textContent.trim();
    // Match patterns like "100%", "24/7", "5+", but skip pure text like "WA"
    const match = text.match(/^(\d+)(.*$)/);
    if (match) {
      const target = parseInt(match[1]);
      const suffix = match[2];
      let current = 0;
      const duration = 1500;
      const step = target / (duration / 16);
      const tick = () => {
        current += step;
        if (current >= target) {
          el.textContent = target + suffix;
          return;
        }
        el.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(tick);
      };
      tick();
    }
  };

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statValues.forEach(el => animateValue(el));
        heroObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) heroObserver.observe(heroStats);
});
