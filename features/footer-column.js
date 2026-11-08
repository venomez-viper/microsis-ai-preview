/* footer-column · Footer4Col live-site helper (MicroSIS.ai)
   - Keeps the copyright year current (static fallback: 2026).
   - Pauses the "Schedule Briefing" ping animation while the footer is offscreen.
   Reduced motion is handled in CSS (animation removed entirely). */
(function () {
  'use strict';

  var root = document.getElementById('fc4Footer');
  if (!root) return;

  var yearEl = document.getElementById('fc4Year');
  if (yearEl) {
    var year = new Date().getFullYear();
    if (year >= 2026) yearEl.textContent = String(year);
  }

  var reduceMq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var visible = false;

  function apply() {
    var reduced = !!(reduceMq && reduceMq.matches);
    root.classList.toggle('fc4-is-paused', reduced || !visible);
  }

  root.classList.add('fc4-is-paused');

  var observer = null;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        visible = entries[i].isIntersecting;
      }
      apply();
    }, { rootMargin: '120px 0px' });
    observer.observe(root);
  } else {
    visible = true;
    apply();
  }

  if (reduceMq) {
    if (typeof reduceMq.addEventListener === 'function') {
      reduceMq.addEventListener('change', apply);
    } else if (typeof reduceMq.addListener === 'function') {
      reduceMq.addListener(apply);
    }
  }

  window.MicroSISFooterColumn = {
    root: root,
    destroy: function () {
      if (observer) observer.disconnect();
      if (reduceMq) {
        if (typeof reduceMq.removeEventListener === 'function') {
          reduceMq.removeEventListener('change', apply);
        } else if (typeof reduceMq.removeListener === 'function') {
          reduceMq.removeListener(apply);
        }
      }
      root.classList.remove('fc4-is-paused');
    }
  };
})();
