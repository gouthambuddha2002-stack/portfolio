/**
 * GOUTHAM RAJ — PERSONAL PORTFOLIO
 * Main JavaScript Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------------------------
     1. Sticky Header & Scroll Elevation
     -------------------------------------------------------------------------- */
  const header = document.querySelector('.site-header');
  const handleScroll = () => {
    if (window.scrollY > 25) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* --------------------------------------------------------------------------
     2. Mobile Navigation Drawer Toggle
     -------------------------------------------------------------------------- */
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navLinksWrapper = document.querySelector('.nav-links-wrapper');
  const navLinks = document.querySelectorAll('.nav-link, .btn-nav-action');

  if (navToggle && navLinksWrapper) {
    const toggleMenu = (open) => {
      const isCurrentlyOpen = navToggle.getAttribute('aria-expanded') === 'true';
      const shouldOpen = open !== undefined ? open : !isCurrentlyOpen;

      navToggle.setAttribute('aria-expanded', String(shouldOpen));
      if (shouldOpen) {
        navLinksWrapper.classList.add('open');
        document.body.style.overflow = 'hidden';
      } else {
        navLinksWrapper.classList.remove('open');
        document.body.style.overflow = '';
      }
    };

    navToggle.addEventListener('click', () => toggleMenu());

    // Close when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 991) {
          toggleMenu(false);
        }
      });
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinksWrapper.classList.contains('open')) {
        toggleMenu(false);
        navToggle.focus();
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (
        navLinksWrapper.classList.contains('open') &&
        !navLinksWrapper.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        toggleMenu(false);
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. Smooth Scrolling with Fixed Header Offset
     -------------------------------------------------------------------------- */
  const internalAnchors = document.querySelectorAll('a[href^="#"]');

  internalAnchors.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });

        // Set URL hash cleanly without jumping
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  /* --------------------------------------------------------------------------
     4. Active Navigation State via IntersectionObserver
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id], main[id]');
  const navMenuItems = document.querySelectorAll('.nav-menu .nav-link');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute('id');
          navMenuItems.forEach((link) => {
            if (link.getAttribute('href') === `#${activeId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* --------------------------------------------------------------------------
     5. Subtle Editorial Portrait Hover Micro-Parallax
     -------------------------------------------------------------------------- */
  const portraitCard = document.querySelector('.portrait-card');
  const portraitContainer = document.querySelector('.portrait-composition');

  if (portraitCard && portraitContainer && !prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    let ticking = false;

    portraitContainer.addEventListener('mousemove', (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = portraitContainer.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          const tiltX = (y / (rect.height / 2)) * -3.5;
          const tiltY = (x / (rect.width / 2)) * 3.5;

          portraitCard.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px)`;
          ticking = false;
        });
        ticking = true;
      }
    });

    portraitContainer.addEventListener('mouseleave', () => {
      portraitCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  }

  /* --------------------------------------------------------------------------
     6. LET'S CONNECT Dropdown Toggle (WhatsApp & Instagram)
     -------------------------------------------------------------------------- */
  const navConnectBtn = document.getElementById('navConnectBtn') || document.getElementById('contactDropdownBtn');
  const navConnectMenu = document.getElementById('navConnectMenu') || document.getElementById('contactDropdownMenu');

  if (navConnectBtn && navConnectMenu) {
    const toggleConnectDropdown = (show) => {
      const isCurrentlyShow = navConnectMenu.classList.contains('show');
      const shouldShow = show !== undefined ? show : !isCurrentlyShow;

      if (shouldShow) {
        navConnectMenu.classList.add('show');
        navConnectBtn.setAttribute('aria-expanded', 'true');
      } else {
        navConnectMenu.classList.remove('show');
        navConnectBtn.setAttribute('aria-expanded', 'false');
      }
    };

    navConnectBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleConnectDropdown();
    });

    // Close when clicking items inside the dropdown
    navConnectMenu.querySelectorAll('.contact-dropdown-item').forEach((item) => {
      item.addEventListener('click', () => {
        toggleConnectDropdown(false);
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!navConnectMenu.contains(e.target) && !navConnectBtn.contains(e.target)) {
        toggleConnectDropdown(false);
      }
    });

    // Close dropdown on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navConnectMenu.classList.contains('show')) {
        toggleConnectDropdown(false);
        navConnectBtn.focus();
      }
    });
  }

  /* --------------------------------------------------------------------------
     7. Light / Dark Theme Switch
     -------------------------------------------------------------------------- */
  const THEME_KEY = 'portfolio-theme';
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  const applyTheme = (theme) => {
    const isLight = theme === 'light';
    if (isLight) {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }

    if (themeToggle) {
      themeToggle.checked = isLight;
      themeToggle.setAttribute('aria-checked', String(isLight));
      themeToggle.setAttribute('aria-label', isLight ? 'Turn off light theme' : 'Turn on light theme');
    }
  };

  const savedTheme = (() => {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  })();

  applyTheme(savedTheme === 'light' ? 'light' : 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
      const nextTheme = themeToggle.checked ? 'light' : 'dark';
      try {
        localStorage.setItem(THEME_KEY, nextTheme);
      } catch (e) { }
      applyTheme(nextTheme);
    });
  }
});
