/**
 * MicroSIS.ai — Sun & Moon Celestial Dome Theme Toggle Runtime
 * Exact port of components/ui/sun-moon-theme-toggle.tsx
 */
(function () {
  'use strict';

  var MOON = { side: -1, spin: 25 };
  var SUN = { side: 1, spin: 120 };
  var ARC_RADIUS = 115;
  var QUARTER_TURN = Math.PI / 2;
  var KEYFRAME_STEPS = 30;
  var DURATION = 1740;
  var SKY_EASING = 'cubic-bezier(0.65, 0, 0.35, 1)';
  var PAGE_FADE_STYLE_ID = 'sun-moon-theme-fade';
  var PAGE_FADE_PROPERTIES =
    'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke';
  var STARS = [
    { x: 24, y: 22, r: 1.6, t: 2100 },
    { x: 66, y: 16, r: 1.2, t: 2600 },
    { x: 80, y: 42, r: 1.8, t: 1900 },
    { x: 38, y: 58, r: 1.1, t: 2900 },
    { x: 58, y: 74, r: 1.4, t: 2300 },
    { x: 14, y: 72, r: 1.2, t: 2500 }
  ];

  var pageFadeCleanup = 0;

  function arcPoint(side, angle) {
    return {
      x: side * ARC_RADIUS * Math.sin(angle),
      y: ARC_RADIUS * (1 - Math.cos(angle))
    };
  }

  function easeInCubic(t) {
    return t * t * t;
  }

  function easeOutBack(t) {
    var overshoot = 1.4;
    return (
      1 +
      (overshoot + 1) * Math.pow(t - 1, 3) +
      overshoot * Math.pow(t - 1, 2)
    );
  }

  function settingKeyframes(body) {
    var frames = [];
    for (var i = 0; i <= KEYFRAME_STEPS; i++) {
      var t = i / KEYFRAME_STEPS;
      var travelled = easeInCubic(t);
      var pt = arcPoint(body.side, travelled * QUARTER_TURN);
      frames.push({
        offset: t,
        transform:
          'translate(' +
          pt.x +
          '%, ' +
          pt.y +
          '%) rotate(' +
          body.side * body.spin * travelled +
          'deg)',
        opacity: t < 0.55 ? 1 : (1 - t) / 0.45
      });
    }
    return frames;
  }

  function risingKeyframes(body) {
    var frames = [];
    for (var i = 0; i <= KEYFRAME_STEPS; i++) {
      var t = i / KEYFRAME_STEPS;
      var remaining = 1 - easeOutBack(t);
      var pt = arcPoint(body.side, remaining * QUARTER_TURN);
      frames.push({
        offset: t,
        transform:
          'translate(' +
          pt.x +
          '%, ' +
          pt.y +
          '%) rotate(' +
          body.side * body.spin * remaining +
          'deg) scale(' +
          (1 - 0.28 * remaining) +
          ')',
        opacity: Math.min(1, t / 0.3)
      });
    }
    return frames;
  }

  var KEYFRAMES = {
    moonSets: settingKeyframes(MOON),
    moonRises: risingKeyframes(MOON),
    sunSets: settingKeyframes(SUN),
    sunRises: risingKeyframes(SUN)
  };

  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function readCurrentTheme() {
    var dt = document.documentElement.getAttribute('data-theme');
    if (dt === 'dark' || dt === 'light') return dt;
    return document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';
  }

  function applyDocumentTheme(theme, duration) {
    if (duration > 0 && !prefersReducedMotion()) {
      var style = document.getElementById(PAGE_FADE_STYLE_ID);
      if (!style) {
        style = document.createElement('style');
        style.id = PAGE_FADE_STYLE_ID;
        document.head.appendChild(style);
      }
      style.textContent =
        '*, *::before, *::after { transition-property: ' +
        PAGE_FADE_PROPERTIES +
        ' !important; transition-duration: ' +
        duration +
        'ms !important; transition-timing-function: cubic-bezier(0.65, 0, 0.35, 1) !important; transition-delay: 0s !important; }';
      window.clearTimeout(pageFadeCleanup);
      pageFadeCleanup = window.setTimeout(function () {
        if (style && style.parentNode) style.parentNode.removeChild(style);
      }, duration + 100);
    }

    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem('microsis_appearance', theme);
    } catch (e) {}

    var nimbus = document.getElementById('nimbusHeaderNav');
    if (nimbus) {
      nimbus.setAttribute('data-tone', theme === 'dark' ? 'dark' : 'light');
    }
    var splash = document.getElementById('glassLogoSplash');
    if (splash) {
      splash.setAttribute('data-look', theme === 'dark' ? 'dark' : 'light');
    }
  }

  function setRestingPositions(moonEl, sunEl, nightEl, dayEl, theme) {
    var isDark = theme === 'dark';
    if (nightEl) nightEl.style.opacity = isDark ? '1' : '0';
    if (dayEl) dayEl.style.opacity = isDark ? '0' : '1';
    if (moonEl) {
      moonEl.style.transform = isDark
        ? 'none'
        : 'translate(' + MOON.side * ARC_RADIUS + '%, ' + ARC_RADIUS + '%)';
      moonEl.style.opacity = isDark ? '1' : '0';
    }
    if (sunEl) {
      sunEl.style.transform = !isDark
        ? 'none'
        : 'translate(' + SUN.side * ARC_RADIUS + '%, ' + ARC_RADIUS + '%)';
      sunEl.style.opacity = !isDark ? '1' : '0';
    }
  }

  function initSunMoonToggle() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;

    var moonEl = btn.querySelector('[data-body="moon"]');
    var sunEl = btn.querySelector('[data-body="sun"]');
    var nightEl = btn.querySelector('[data-sky="night"]');
    var dayEl = btn.querySelector('[data-sky="day"]');
    var flight = [];

    var initialTheme = readCurrentTheme();
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    btn.setAttribute('data-state', initialTheme);
    btn.setAttribute(
      'aria-label',
      initialTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
    );
    setRestingPositions(moonEl, sunEl, nightEl, dayEl, initialTheme);

    // Start star twinkle animations inside night sky
    if (nightEl && !prefersReducedMotion() && typeof nightEl.animate === 'function') {
      var starEls = nightEl.querySelectorAll('[data-star]');
      Array.prototype.forEach.call(starEls, function (star, idx) {
        star.animate(
          [{ opacity: 0.35 }, { opacity: 1 }, { opacity: 0.35 }],
          {
            duration: (STARS[idx] && STARS[idx].t) || 2400,
            delay: -idx * 530,
            iterations: Infinity,
            easing: 'ease-in-out'
          }
        );
      });
    }

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      var current = readCurrentTheme();
      var next = current === 'dark' ? 'light' : 'dark';

      btn.setAttribute('data-state', next);
      btn.setAttribute(
        'aria-label',
        next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
      applyDocumentTheme(next, DURATION);

      // Update resting fallback styles once animation finishes
      setRestingPositions(moonEl, sunEl, nightEl, dayEl, next);

      if (flight.length > 0) {
        flight.forEach(function (anim) {
          anim.reverse();
        });
        return;
      }

      if (
        !moonEl ||
        !sunEl ||
        typeof moonEl.animate !== 'function' ||
        prefersReducedMotion()
      ) {
        return;
      }

      var toLight = next === 'light';
      var setting = (toLight ? moonEl : sunEl).animate(
        toLight ? KEYFRAMES.moonSets : KEYFRAMES.sunSets,
        {
          duration: DURATION * 0.65,
          fill: 'both'
        }
      );
      var rising = (toLight ? sunEl : moonEl).animate(
        toLight ? KEYFRAMES.sunRises : KEYFRAMES.moonRises,
        {
          duration: DURATION * 0.64,
          delay: DURATION * 0.36,
          fill: 'both'
        }
      );
      var pair = [setting, rising];

      if (nightEl && dayEl) {
        var skyOptions = {
          duration: DURATION,
          easing: SKY_EASING,
          fill: 'both'
        };
        pair.push(
          nightEl.animate(
            [{ opacity: toLight ? 1 : 0 }, { opacity: toLight ? 0 : 1 }],
            skyOptions
          ),
          dayEl.animate(
            [{ opacity: toLight ? 0 : 1 }, { opacity: toLight ? 1 : 0 }],
            skyOptions
          )
        );
      }

      flight = pair;
      Promise.all(
        pair.map(function (a) {
          return a.finished;
        })
      ).then(
        function () {
          if (flight !== pair) return;
          flight = [];
          pair.forEach(function (a) {
            a.cancel();
          });
          setRestingPositions(moonEl, sunEl, nightEl, dayEl, readCurrentTheme());
        },
        function () {}
      );
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSunMoonToggle);
  } else {
    initSunMoonToggle();
  }
})();
