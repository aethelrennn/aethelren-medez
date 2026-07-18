/* ══════════════════════════════════════════════
   RENO_DEV — Portfolio Script
   ══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────
     1. CUSTOM CURSOR
  ───────────────────────────────────────────── */
  const cursor         = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursor-follower');

  if (cursor && cursorFollower && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = -100, mouseY = -100;
    let followerX = -100, followerY = -100;
    let raf;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth follower
    const animateCursor = () => {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      cursor.style.left         = mouseX + 'px';
      cursor.style.top          = mouseY + 'px';
      cursorFollower.style.left = followerX + 'px';
      cursorFollower.style.top  = followerY + 'px';
      raf = requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover states
    const hoverTargets = document.querySelectorAll('a, button, .project-card, input, textarea');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
        cursorFollower.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovered');
        cursorFollower.classList.remove('hovered');
      });
    });

    // Hide on leave / show on enter
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity         = '0';
      cursorFollower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity         = '1';
      cursorFollower.style.opacity = '1';
    });
  }


  /* ─────────────────────────────────────────────
     2. NAVBAR SCROLL EFFECT
  ───────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Add .scrolled class for backdrop blur
    nav.classList.toggle('scrolled', scrollY > 60);

    // Hide nav on scroll down, show on scroll up
    if (scrollY > lastScroll && scrollY > 200) {
      nav.style.transform = 'translateY(-100%)';
    } else {
      nav.style.transform = 'translateY(0)';
    }
    nav.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1), background 0.4s, border-color 0.4s, backdrop-filter 0.4s';
    lastScroll = scrollY;
  }, { passive: true });


  /* ─────────────────────────────────────────────
     3. HAMBURGER / MOBILE MENU
  ───────────────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }


  /* ─────────────────────────────────────────────
     4. SCROLL REVEAL (IntersectionObserver)
  ───────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger siblings inside same parent
        const siblings = entry.target.parentElement.querySelectorAll('[data-reveal]');
        siblings.forEach((el, i) => {
          if (el === entry.target) {
            el.style.transitionDelay = `${i * 0.08}s`;
          }
        });
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ─────────────────────────────────────────────
     5. HERO TITLE — STAGGERED LETTER ANIMATION
  ───────────────────────────────────────────── */
  const heroLines = document.querySelectorAll('.hero-title .line');
  heroLines.forEach((line, i) => {
    const text = line.textContent;
    // Wrap each character in a span
    line.innerHTML = text.split('').map((char, j) => {
      const delay = (i * 0.15 + j * 0.03).toFixed(2);
      const cls   = char === ' ' ? 'char space' : 'char';
      return `<span class="${cls}" style="
        display: inline-block;
        opacity: 0;
        transform: translateY(40px) skewX(-8deg);
        animation: char-in 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s forwards;
      ">${char === ' ' ? '&nbsp;' : char}</span>`;
    }).join('');
  });

  // Inject keyframe
  const charStyle = document.createElement('style');
  charStyle.innerHTML = `
    @keyframes char-in {
      to { opacity: 1; transform: translateY(0) skewX(0deg); }
    }
  `;
  document.head.appendChild(charStyle);


  /* ─────────────────────────────────────────────
     6. ANIMATED COUNTERS
  ───────────────────────────────────────────── */
  const counterEls = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el      = entry.target;
      const target  = parseInt(el.dataset.count, 10);
      const duration = 1800;
      const start   = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => counterObserver.observe(el));


  /* ─────────────────────────────────────────────
     7. SKILL BARS
  ───────────────────────────────────────────── */
  const skillBars = document.querySelectorAll('.skill-bar');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar   = entry.target;
      const width = bar.dataset.width;
      // Small delay so the section animation settles first
      setTimeout(() => {
        bar.style.width = width + '%';
      }, 200);
      skillObserver.unobserve(bar);
    });
  }, { threshold: 0.5 });

  skillBars.forEach(bar => skillObserver.observe(bar));


  /* ─────────────────────────────────────────────
     8. CONTACT FORM
  ───────────────────────────────────────────── */
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple validation
      const requiredFields = form.querySelectorAll('[required]');
      let valid = true;
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#ff6b35';
          field.addEventListener('input', () => {
            field.style.borderColor = '';
          }, { once: true });
        }
      });
      if (!valid) return;

      // Simulate send
      const btn     = form.querySelector('.btn-submit');
      const btnText = btn.querySelector('.btn-text');
      btn.disabled  = true;
      btnText.textContent = 'Sending...';

      setTimeout(() => {
        btnText.textContent    = 'Send Message';
        btn.disabled           = false;
        success.classList.add('show');
        form.reset();
        setTimeout(() => success.classList.remove('show'), 4000);
      }, 1400);
    });
  }


  /* ─────────────────────────────────────────────
     9. SMOOTH SCROLL FOR ANCHOR LINKS
  ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // nav height
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ─────────────────────────────────────────────
     10. PARALLAX — subtle depth on hero elements
  ───────────────────────────────────────────── */
  const heroSection = document.querySelector('.hero');

  if (heroSection) {
    const parallaxEls = [
      { el: document.querySelector('.hero-title'), speed: 0.08 },
      { el: document.querySelector('.hero-sub'),   speed: 0.05 },
      { el: document.querySelector('.hero-badge'), speed: 0.04 },
    ];

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > window.innerHeight) return;
      parallaxEls.forEach(({ el, speed }) => {
        if (el) el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }


  /* ─────────────────────────────────────────────
     11. PROJECT CARD — TILT EFFECT
  ───────────────────────────────────────────── */
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width / 2;
      const cy     = rect.height / 2;
      const rotX   = ((y - cy) / cy) * -4;
      const rotY   = ((x - cx) / cx) *  4;
      card.style.transform    = `translateY(-4px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      card.style.transition   = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.4s';
    });
  });


  /* ─────────────────────────────────────────────
     12. ACTIVE NAV LINK HIGHLIGHT (scroll spy)
  ───────────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.style.color = isActive ? 'var(--text)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => spyObserver.observe(s));

});
