/* ============================================
   MicroSIS.ai · Projects Showcase (#projects)
   The visual effect is pure CSS (projects-showcase.css). This file only:
   - flags touch input so the lighter resting state is shown (.pc-touch)
   - pauses the blob animation while the section is offscreen (.pc-paused)
   - reveals .fade-up items if they were added after script.js initialised
   - reports card clicks through window.trackEvent when it exists
   ============================================ */
(function () {
  'use strict';

  var roots = document.querySelectorAll('.pc-section');
  if (!roots.length) return;

  var cleanups = [];

  function onMedia(mq, fn) {
    if (!mq) return;
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', fn);
      cleanups.push(function () { mq.removeEventListener('change', fn); });
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(fn);
      cleanups.push(function () { mq.removeListener(fn); });
    }
  }

  var mm = typeof window.matchMedia === 'function' ? window.matchMedia.bind(window) : null;
  var touchMq = mm ? mm('(hover: none), (pointer: coarse)') : null;
  var reduceMq = mm ? mm('(prefers-reduced-motion: reduce)') : null;
  var touchSeen = false;

  function syncTouchAll() {
    var on = touchSeen || !!(touchMq && touchMq.matches);
    Array.prototype.forEach.call(roots, function (r) {
      r.classList.toggle('pc-touch', on);
    });
  }

  function syncReduceAll() {
    var on = !!(reduceMq && reduceMq.matches);
    Array.prototype.forEach.call(roots, function (r) {
      r.classList.toggle('pc-reduced', on);
    });
  }

  syncTouchAll();
  syncReduceAll();
  onMedia(touchMq, syncTouchAll);
  onMedia(reduceMq, syncReduceAll);

  Array.prototype.forEach.call(roots, function (root) {
    var grid = root.querySelector('.pc-grid');
    if (!grid) return;

    function onPointerDown(e) {
      if (e.pointerType === 'touch' || e.pointerType === 'pen') {
        touchSeen = true;
      } else if (e.pointerType === 'mouse') {
        touchSeen = false;
      }
      syncTouchAll();
    }

    if (window.PointerEvent) {
      root.addEventListener('pointerdown', onPointerDown, { passive: true });
      cleanups.push(function () { root.removeEventListener('pointerdown', onPointerDown); });
    }

    if ('IntersectionObserver' in window) {
      var pauseIo = new IntersectionObserver(function (entries) {
        var entry = entries[entries.length - 1];
        root.classList.toggle('pc-paused', !entry.isIntersecting);
      }, { rootMargin: '120px 0px' });
      pauseIo.observe(grid);
      cleanups.push(function () { pauseIo.disconnect(); });

      var pending = root.querySelectorAll('.fade-up:not(.visible)');
      if (pending.length) {
        var fadeIo = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              fadeIo.unobserve(entry.target);
            }
          });
        }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
        Array.prototype.forEach.call(pending, function (el) { fadeIo.observe(el); });
        cleanups.push(function () { fadeIo.disconnect(); });
      }
    } else {
      Array.prototype.forEach.call(root.querySelectorAll('.fade-up'), function (el) {
        el.classList.add('visible');
      });
    }

    function onClick(e) {
      var card = e.target && e.target.closest ? e.target.closest('.pc-card') : null;
      if (!card || !grid.contains(card)) return;
      var project = card.getAttribute('data-pc-project') || card.getAttribute('data-slug') || '';
      var target = (card.getAttribute('href') || '').replace(/^#/, '');
      if (typeof window.trackEvent === 'function') {
        try {
          window.trackEvent('project_card_open', root.id || 'projects', project, { target: target });
        } catch (err) {
          /* telemetry must never block navigation */
        }
      }
    }

    grid.addEventListener('click', onClick);
    cleanups.push(function () { grid.removeEventListener('click', onClick); });
  });

  window.MicroSISProjectsShowcase = {
    roots: roots,
    destroy: function () {
      while (cleanups.length) {
        try { cleanups.pop()(); } catch (err) { /* ignore */ }
      }
      Array.prototype.forEach.call(roots, function (r) {
        r.classList.remove('pc-touch', 'pc-paused', 'pc-reduced');
      });
    }
  };
})();
