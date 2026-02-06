/* =============================================================
   KurumsalCo Admin Panel - Interactive JavaScript
   Sidebar, Dropdowns, Tabs, Accordions, Modals, Theme,
   Notifications, Toasts, Search, Tooltips, Counters
   ============================================================= */

(function () {
  'use strict';

  /* ===========================================================
     1. THEME TOGGLE  (Light / Dark)
     =========================================================== */
  var THEME_KEY = 'theme';

  function applyTheme(mode) {
    if (mode === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    /* update every icon on the page (topbar + any other toggle) */
    document.querySelectorAll('[data-theme-icon]').forEach(function (el) {
      el.textContent = mode === 'dark' ? '\u263E' : '\u2600';
    });
    /* legacy id-based icon */
    var legacy = document.getElementById('themeIcon');
    if (legacy) legacy.textContent = mode === 'dark' ? '\u263E' : '\u2600';
  }

  function toggleTheme() {
    var next = document.body.classList.contains('dark') ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }

  /* expose globally so inline onclick still works during migration */
  window.toggleTheme = toggleTheme;

  /* init on load */
  applyTheme(localStorage.getItem(THEME_KEY) || 'light');


  /* ===========================================================
     2. SIDEBAR
     =========================================================== */
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebarOverlay');

  /* ---- Mobile open / close ---- */
  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('mobile-open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  function toggleSidebar() {
    if (!sidebar) return;
    sidebar.classList.contains('mobile-open') ? closeSidebar() : openSidebar();
  }
  window.toggleSidebar = toggleSidebar;

  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  /* close sidebar on Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeSidebar();
      closeAllDropdowns();
      closeAllModals();
    }
  });

  /* ---- Desktop collapse (mini sidebar) ---- */
  function toggleSidebarCollapse() {
    if (!sidebar) return;
    sidebar.classList.toggle('collapsed');
    document.querySelector('.main-content').classList.toggle('sidebar-collapsed');
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed') ? '1' : '0');
  }
  window.toggleSidebarCollapse = toggleSidebarCollapse;

  if (localStorage.getItem('sidebarCollapsed') === '1' && sidebar) {
    sidebar.classList.add('collapsed');
    var mc = document.querySelector('.main-content');
    if (mc) mc.classList.add('sidebar-collapsed');
  }

  /* ---- Sidebar Dropdown / Accordion ---- */
  document.querySelectorAll('.sidebar-dropdown').forEach(function (dd) {
    var trigger = dd.querySelector('.sidebar-nav-link');
    if (!trigger) return;
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      /* close siblings */
      dd.parentElement.querySelectorAll('.sidebar-dropdown.open').forEach(function (other) {
        if (other !== dd) other.classList.remove('open');
      });
      dd.classList.toggle('open');
    });
  });


  /* ===========================================================
     3. DROPDOWNS  (Topbar & anywhere)
     =========================================================== */
  function closeAllDropdowns() {
    document.querySelectorAll('.dropdown.open').forEach(function (d) {
      d.classList.remove('open');
    });
  }

  /* Click-based dropdowns (adds .open) */
  document.querySelectorAll('.dropdown > [tabindex]').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var parent = this.closest('.dropdown');
      var wasOpen = parent.classList.contains('open');
      closeAllDropdowns();
      if (!wasOpen) parent.classList.add('open');
    });
  });

  /* Mega-menu click trigger */
  document.querySelectorAll('.mega-menu-wrapper > [tabindex]').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var parent = this.closest('.mega-menu-wrapper');
      parent.classList.toggle('force-open');
    });
  });

  /* close on outside click */
  document.addEventListener('click', function () {
    closeAllDropdowns();
    document.querySelectorAll('.mega-menu-wrapper.force-open').forEach(function (m) {
      m.classList.remove('force-open');
    });
  });

  /* prevent dropdown menu from closing itself on inner click */
  document.querySelectorAll('.dropdown-menu').forEach(function (menu) {
    menu.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  });


  /* ===========================================================
     4. TABS
     =========================================================== */
  document.querySelectorAll('.tabs').forEach(function (tabGroup) {
    var tabs = tabGroup.querySelectorAll('.tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        this.classList.add('active');
        /* if data-target exists, show/hide panels */
        var target = this.getAttribute('data-target');
        if (target) {
          var container = tabGroup.parentElement;
          container.querySelectorAll('.tab-panel').forEach(function (p) {
            p.style.display = 'none';
          });
          var panel = container.querySelector(target);
          if (panel) {
            panel.style.display = '';
            panel.style.animation = 'authFadeIn .3s ease forwards';
          }
        }
      });
    });
  });


  /* ===========================================================
     5. ACCORDIONS
     =========================================================== */
  document.querySelectorAll('[data-accordion]').forEach(function (acc) {
    var items = acc.querySelectorAll('.accordion-item');
    items.forEach(function (item) {
      var head = item.querySelector('.accordion-header');
      if (!head) return;
      head.addEventListener('click', function () {
        var wasOpen = item.classList.contains('open');
        /* close siblings if single mode */
        if (acc.getAttribute('data-accordion') === 'single') {
          items.forEach(function (i) { i.classList.remove('open'); });
        }
        item.classList.toggle('open', !wasOpen);
      });
    });
  });


  /* ===========================================================
     6. MODALS  (generic)
     =========================================================== */
  function openModalById(id) {
    var m = document.getElementById(id);
    if (!m) return;
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModalById(id) {
    var m = document.getElementById(id);
    if (!m) return;
    m.classList.remove('open');
    document.body.style.overflow = '';
  }
  function closeAllModals() {
    document.querySelectorAll('.modal-overlay.open').forEach(function (m) {
      m.classList.remove('open');
    });
    document.body.style.overflow = '';
  }
  window.openModal  = window.openModal  || function (id) { openModalById(id); };
  window.closeModal = window.closeModal || function (id) {
    if (typeof id === 'string') { closeModalById(id); }
    else { closeAllModals(); }
  };

  /* click overlay to close */
  document.querySelectorAll('.modal-overlay').forEach(function (ov) {
    ov.addEventListener('click', function (e) {
      if (e.target === ov) {
        ov.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  /* data-modal-open / data-modal-close buttons */
  document.querySelectorAll('[data-modal-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModalById(this.getAttribute('data-modal-open'));
    });
  });
  document.querySelectorAll('[data-modal-close]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = this.getAttribute('data-modal-close');
      if (id) closeModalById(id); else closeAllModals();
    });
  });


  /* ===========================================================
     7. FORM SWITCHES  (.form-switch  &  .perm-toggle)
     =========================================================== */
  document.querySelectorAll('.form-switch, .perm-toggle').forEach(function (sw) {
    /* skip if already has inline onclick */
    if (sw.getAttribute('onclick')) return;
    sw.addEventListener('click', function () {
      this.classList.toggle('active');
      this.classList.toggle('on');
    });
  });


  /* ===========================================================
     8. NOTIFICATION BADGE PULSE
     =========================================================== */
  function pulseNotificationDots() {
    document.querySelectorAll('.notification-dot').forEach(function (dot) {
      dot.style.animation = 'none';
      void dot.offsetWidth;                   /* reflow */
      dot.style.animation = 'badgePulse 2s ease infinite';
    });
  }
  pulseNotificationDots();

  /* Periodically animate badge counts */
  setInterval(function () {
    document.querySelectorAll('.badge.danger').forEach(function (b) {
      b.style.animation = 'none';
      void b.offsetWidth;
      b.style.animation = 'badgeBounce .4s ease';
    });
  }, 15000);


  /* ===========================================================
     9. STATUS / CATEGORY PILLS
     =========================================================== */
  document.querySelectorAll('.status-pills, .category-pills').forEach(function (group) {
    group.querySelectorAll('.status-pill, .category-pill').forEach(function (pill) {
      pill.addEventListener('click', function () {
        group.querySelectorAll('.status-pill, .category-pill').forEach(function (p) {
          p.classList.remove('active');
        });
        this.classList.add('active');
      });
    });
  });

  /* Date pills (reports page) */
  document.querySelectorAll('.date-pills').forEach(function (group) {
    group.querySelectorAll('.date-pill').forEach(function (pill) {
      pill.addEventListener('click', function () {
        group.querySelectorAll('.date-pill').forEach(function (p) { p.classList.remove('active'); });
        this.classList.add('active');
      });
    });
  });

  /* Notification filter sidebar */
  document.querySelectorAll('.notif-filter-item[data-filter]').forEach(function (item) {
    item.addEventListener('click', function () {
      var parent = this.closest('.notif-filter-sidebar');
      if (!parent) return;
      parent.querySelectorAll('.notif-filter-item[data-filter]').forEach(function (i) {
        i.classList.remove('active');
      });
      this.classList.add('active');
    });
  });


  /* ===========================================================
     10. PAGINATION
     =========================================================== */
  document.querySelectorAll('.pagination').forEach(function (pag) {
    pag.querySelectorAll('.pagination-btn').forEach(function (btn) {
      if (btn.classList.contains('disabled')) return;
      btn.addEventListener('click', function () {
        pag.querySelectorAll('.pagination-btn').forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
      });
    });
  });


  /* ===========================================================
     11. TOAST NOTIFICATIONS
     =========================================================== */
  var toastContainer = null;
  function ensureToastContainer() {
    if (toastContainer) return;
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  /**
   * showToast({ title, message, type, duration })
   * type: 'success' | 'danger' | 'warning' | 'info'
   */
  function showToast(opts) {
    ensureToastContainer();
    opts = opts || {};
    var type = opts.type || 'info';
    var duration = opts.duration || 4000;
    var icons = { success: '\u2713', danger: '\u2717', warning: '\u26A0', info: '\u24D8' };

    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.innerHTML =
      '<div class="toast-icon">' + (icons[type] || '') + '</div>' +
      '<div class="toast-body">' +
        (opts.title ? '<div class="toast-title">' + opts.title + '</div>' : '') +
        (opts.message ? '<div class="toast-msg">' + opts.message + '</div>' : '') +
      '</div>' +
      '<div class="toast-close">\u00D7</div>' +
      '<div class="toast-progress"><div class="toast-progress-bar" style="animation-duration:' + duration + 'ms"></div></div>';

    toastContainer.appendChild(toast);

    /* trigger enter animation */
    requestAnimationFrame(function () { toast.classList.add('show'); });

    /* close button */
    toast.querySelector('.toast-close').addEventListener('click', function () {
      removeToast(toast);
    });

    /* auto-remove */
    setTimeout(function () { removeToast(toast); }, duration);
  }

  function removeToast(toast) {
    toast.classList.add('hide');
    setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 350);
  }

  window.showToast = showToast;


  /* ===========================================================
     12. SEARCH SHORTCUT  (Ctrl+K)
     =========================================================== */
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      var searchInput = document.querySelector('.topbar-search input') ||
                        document.querySelector('.bill-search input') ||
                        document.querySelector('.notif-search input');
      if (searchInput) searchInput.focus();
    }
  });


  /* ===========================================================
     13. ANIMATED COUNTERS  (Intersection Observer)
     =========================================================== */
  function animateCounter(el) {
    var target = parseInt(el.textContent.replace(/[^0-9]/g, ''), 10);
    if (isNaN(target) || target === 0) return;
    var prefix = el.textContent.match(/^[^0-9]*/)[0] || '';
    var suffix = el.textContent.match(/[^0-9]*$/)[0] || '';
    var duration = 1200;
    var start = 0;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); /* easeOutCubic */
      var current = Math.floor(eased * target);
      el.textContent = prefix + current.toLocaleString('tr-TR') + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toLocaleString('tr-TR') + suffix;
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = '1';
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.stat-card h3, .kpi-value, .sec-stat h3, .bill-stat h3, .notif-stat-info h3, .user-stat-info h3').forEach(function (el) {
      counterObserver.observe(el);
    });
  }


  /* ===========================================================
     14. SCROLL ANIMATIONS  (Intersection Observer)
     =========================================================== */
  if ('IntersectionObserver' in window) {
    var animObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          animObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.animate-fade, .animate-slide-up, .animate-slide-left, .animate-scale').forEach(function (el) {
      el.classList.add('anim-init');
      animObserver.observe(el);
    });
  }


  /* ===========================================================
     15. TABLE ROW CHECKBOX  (select-all)
     =========================================================== */
  document.querySelectorAll('.table').forEach(function (table) {
    var headCheck = table.querySelector('thead input[type="checkbox"]');
    if (!headCheck) return;
    var bodyChecks = table.querySelectorAll('tbody input[type="checkbox"]');
    headCheck.addEventListener('change', function () {
      var checked = this.checked;
      bodyChecks.forEach(function (cb) { cb.checked = checked; });
    });
    bodyChecks.forEach(function (cb) {
      cb.addEventListener('change', function () {
        var all = Array.from(bodyChecks).every(function (c) { return c.checked; });
        headCheck.checked = all;
      });
    });
  });


  /* ===========================================================
     16. ALERT DISMISS
     =========================================================== */
  document.querySelectorAll('.alert').forEach(function (alert) {
    alert.style.cursor = 'pointer';
    alert.setAttribute('title', 'Kapatmak icin tiklayin');
    alert.addEventListener('click', function () {
      this.style.transition = 'all .3s ease';
      this.style.opacity = '0';
      this.style.transform = 'translateY(-10px)';
      var self = this;
      setTimeout(function () {
        self.style.display = 'none';
      }, 300);
    });
  });


  /* ===========================================================
     17. CHART BAR TOOLTIPS
     =========================================================== */
  document.querySelectorAll('.chart-bar, .area-bar, .rev-bar').forEach(function (bar) {
    bar.addEventListener('mouseenter', function () {
      var h = Math.round(parseFloat(this.style.height));
      if (!isNaN(h)) {
        this.setAttribute('title', h + '%');
      }
    });
  });


  /* ===========================================================
     18. DEMO: Show toast on form submit
     =========================================================== */
  document.querySelectorAll('.btn-primary').forEach(function (btn) {
    if (btn.type === 'submit' || btn.closest('form')) return; /* skip real forms */
    if (btn.closest('.modal-footer') || btn.closest('.modal-overlay')) return;
  });

  /* Hook into settings / security save buttons */
  document.querySelectorAll('.settings-section-footer .btn-primary, .card-footer .btn-primary').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      showToast({
        title: 'Basarili!',
        message: 'Degisiklikler basariyla kaydedildi.',
        type: 'success',
        duration: 3000
      });
    });
  });


  /* ===========================================================
     19. RIPPLE EFFECT ON BUTTONS
     =========================================================== */
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = this.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      this.appendChild(ripple);
      setTimeout(function () { if (ripple.parentNode) ripple.parentNode.removeChild(ripple); }, 600);
    });
  });


  /* ===========================================================
     20. KEYBOARD SHORTCUTS
     =========================================================== */
  document.addEventListener('keydown', function (e) {
    /* Ctrl+Shift+D = toggle dark mode */
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      toggleTheme();
      showToast({
        title: 'Tema Degistirildi',
        message: document.body.classList.contains('dark') ? 'Koyu mod aktif' : 'Acik mod aktif',
        type: 'info',
        duration: 2000
      });
    }
    /* Ctrl+B = collapse sidebar */
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      if (window.innerWidth > 768) {
        toggleSidebarCollapse();
      } else {
        toggleSidebar();
      }
    }
  });


  /* ===========================================================
     INIT COMPLETE
     =========================================================== */
  console.log('%c KurumsalCo Admin Panel %c JS Loaded ',
    'background:#6366f1;color:#fff;padding:4px 8px;border-radius:4px 0 0 4px;font-weight:700;',
    'background:#1e293b;color:#f1f5f9;padding:4px 8px;border-radius:0 4px 4px 0;');

})();
