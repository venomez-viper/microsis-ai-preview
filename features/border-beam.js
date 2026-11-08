/**
 * MicroSIS.ai · BorderBeam Runtime Controller (vanilla port of components/ui/border-beam.tsx)
 *
 * Mounts animated <div class="bb-beam"><div class="bb-beam-light"></div></div>
 * into key enterprise cards and surfaces, computes the dynamic rectangular SVG
 * offset-path ("M 0 0 H <width> V <height> H 0 V 0") on load and resize, and
 * syncs lightColor with the active theme ("dark" -> "#FAFAFA", "light" -> "#FF2056").
 */
(function () {
  'use strict';

  var TARGET_SELECTORS = [
    { selector: '.ps-stat-card', lightWidth: 220, duration: 7, borderWidth: 1.5 },
    { selector: '.pc-content', lightWidth: 320, duration: 9, borderWidth: 1.5 },
    { selector: '.gf-suite-showcase', lightWidth: 420, duration: 12, borderWidth: 1.5 },
    { selector: '.fluid-stage-shell', lightWidth: 450, duration: 14, borderWidth: 1.5 },
    { selector: '.finder-surface', lightWidth: 380, duration: 11, borderWidth: 1.5 },
    { selector: '.topology-card', lightWidth: 300, duration: 9, borderWidth: 1.5 },
    { selector: '.outcome-card', lightWidth: 300, duration: 10, borderWidth: 1.5 },
    { selector: '.p3d-card', lightWidth: 320, duration: 9, borderWidth: 1.5 },
    { selector: '.principle-card', lightWidth: 240, duration: 8, borderWidth: 1.5 },
    { selector: '.orig-number-card', lightWidth: 220, duration: 8, borderWidth: 1.5 }
  ];

  var mountedBeams = [];
  var resizeObserver = null;

  function getThemeLightColor(customColor) {
    if (customColor) return customColor;
    var theme = document.documentElement.getAttribute('data-theme') || 'light';
    return theme === 'dark' ? '#FAFAFA' : '#FF2056';
  }

  function updateBeamPath(beamEl) {
    if (!beamEl) return;
    var w = beamEl.offsetWidth;
    var h = beamEl.offsetHeight;
    if (w > 0 && h > 0) {
      beamEl.style.setProperty(
        '--path',
        'path("M 0 0 H ' + w + ' V ' + h + ' H 0 V 0")'
      );
    }
  }

  function syncAllThemes() {
    var color = getThemeLightColor();
    mountedBeams.forEach(function (beamEl) {
      var custom = beamEl.getAttribute('data-custom-color');
      beamEl.style.setProperty('--light-color', custom || color);
    });
  }

  function updateAllPaths() {
    mountedBeams.forEach(updateBeamPath);
  }

  function attachBorderBeam(hostEl, opts, index) {
    if (!hostEl || hostEl.querySelector(':scope > .bb-beam')) return;
    opts = opts || {};

    var computedPos = window.getComputedStyle(hostEl).position;
    if (computedPos === 'static') {
      hostEl.classList.add('bb-host');
    }

    var beam = document.createElement('div');
    beam.className = 'bb-beam';
    beam.setAttribute('aria-hidden', 'true');

    var duration = opts.duration || Number(hostEl.getAttribute('data-bb-duration')) || 8;
    var lightWidth = opts.lightWidth || Number(hostEl.getAttribute('data-bb-width')) || 280;
    var borderWidth = opts.borderWidth || Number(hostEl.getAttribute('data-bb-border')) || 1.5;
    var customColor = opts.lightColor || hostEl.getAttribute('data-bb-color') || '';

    beam.style.setProperty('--duration', String(duration));
    beam.style.setProperty('--light-width', lightWidth + 'px');
    beam.style.setProperty('--border-width', borderWidth + 'px');
    beam.style.setProperty('--light-color', getThemeLightColor(customColor));
    beam.style.setProperty('--bb-delay', ((index || 0) * -1.35).toFixed(2) + 's');

    if (customColor) {
      beam.setAttribute('data-custom-color', customColor);
    }

    var light = document.createElement('div');
    light.className = 'bb-beam-light';
    beam.appendChild(light);

    hostEl.appendChild(beam);
    mountedBeams.push(beam);
    updateBeamPath(beam);

    if (resizeObserver) {
      resizeObserver.observe(beam);
    }
  }

  function scanAndMount() {
    var globalIdx = 0;
    TARGET_SELECTORS.forEach(function (cfg) {
      var nodes = document.querySelectorAll(cfg.selector);
      nodes.forEach(function (node) {
        attachBorderBeam(node, cfg, globalIdx++);
      });
    });
  }

  function initBorderBeams() {
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(function (entries) {
        entries.forEach(function (entry) {
          updateBeamPath(entry.target);
        });
      });
    }

    scanAndMount();

    window.addEventListener('resize', updateAllPaths, { passive: true });

    if (typeof MutationObserver !== 'undefined') {
      var themeObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          if (m.attributeName === 'data-theme' || m.attributeName === 'data-active-page') {
            syncAllThemes();
            requestAnimationFrame(function () {
              scanAndMount();
              updateAllPaths();
            });
          }
        });
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme', 'data-active-page']
      });
    }
  }

  window.MicroSISBorderBeam = {
    attach: attachBorderBeam,
    refresh: function () {
      scanAndMount();
      updateAllPaths();
      syncAllThemes();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBorderBeams);
  } else {
    initBorderBeams();
  }
})();
