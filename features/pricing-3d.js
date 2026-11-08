/**
 * MicroSIS.ai — 3D Perspective Pricing Engine (shadcn/pricing.tsx runtime)
 *
 * Implements:
 * 1. Radix-style Switch toggle ("Annual billing (Save 20%)")
 * 2. 50-particle circular Confetti burst from the switch origin (gravity: 1.2, decay: 0.94, startVelocity: 30)
 * 3. NumberFlow 500ms ease-out tabular-nums price counter interpolation
 */
(function () {
  'use strict';

  function fireSwitchConfetti(originX, originY, primaryHex) {
    var canvas = document.createElement('canvas');
    canvas.style.cssText =
      'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:99999;';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    if (!ctx) {
      canvas.remove();
      return;
    }

    var palette = [
      primaryHex || '#0066CC',
      '#5AD2F4',
      '#1B6CA8',
      '#7C3AED',
      '#10B981',
      '#F59E0B'
    ];

    var particles = [];
    var count = 50;
    var spreadRad = (60 * Math.PI) / 180;
    var baseAngle = -Math.PI / 2;

    for (var i = 0; i < count; i++) {
      var angle = baseAngle + (Math.random() - 0.5) * spreadRad * 1.8;
      var velocity = (18 + Math.random() * 16) * (0.75 + Math.random() * 0.5);
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * velocity * 0.45,
        vy: Math.sin(angle) * velocity * 0.45,
        r: 3.5 + Math.random() * 3.5,
        color: palette[i % palette.length],
        ticks: 0,
        maxTicks: 110 + Math.floor(Math.random() * 50)
      });
    }

    var gravity = 0.42;
    var decay = 0.94;

    function step() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var alive = 0;
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        if (p.ticks >= p.maxTicks) continue;
        alive++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= decay;
        p.vy = p.vy * decay + gravity;
        p.ticks++;

        var alpha = Math.max(0, 1 - p.ticks / p.maxTicks);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (alive > 0) {
        window.requestAnimationFrame(step);
      } else {
        canvas.remove();
      }
    }

    window.requestAnimationFrame(step);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateNumberFlow(el, fromVal, toVal, durationMs) {
    durationMs = durationMs || 500;
    if (fromVal === toVal) {
      el.textContent = '$' + toVal.toLocaleString('en-US');
      return;
    }
    var start = performance.now();
    el.classList.add('is-animating');

    function tick(now) {
      var elapsed = now - start;
      var t = Math.min(1, elapsed / durationMs);
      var eased = easeOutCubic(t);
      var current = Math.round(fromVal + (toVal - fromVal) * eased);
      el.textContent = '$' + current.toLocaleString('en-US');
      if (t < 1) {
        window.requestAnimationFrame(tick);
      } else {
        el.textContent = '$' + toVal.toLocaleString('en-US');
        el.classList.remove('is-animating');
      }
    }

    window.requestAnimationFrame(tick);
  }

  function togglePricingSection(sectionEl, switchBtn, forceAnnual) {
    var isCurrentlyAnnual = switchBtn.getAttribute('aria-checked') === 'true';
    var nextAnnual =
      typeof forceAnnual === 'boolean' ? forceAnnual : !isCurrentlyAnnual;

    switchBtn.setAttribute('aria-checked', nextAnnual ? 'true' : 'false');

    if (nextAnnual && !isCurrentlyAnnual) {
      var rect = switchBtn.getBoundingClientRect();
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height / 2;
      var accent =
        getComputedStyle(sectionEl).getPropertyValue('--card-accent').trim() ||
        '#0066CC';
      fireSwitchConfetti(x, y, accent);
    }

    // Animate NumberFlow prices
    sectionEl.querySelectorAll('.p3d-price-value').forEach(function (priceEl) {
      var monthly = Number(priceEl.getAttribute('data-monthly') || 0);
      var annual = Number(priceEl.getAttribute('data-annual') || 0);
      var fromVal = nextAnnual ? monthly : annual;
      var toVal = nextAnnual ? annual : monthly;
      animateNumberFlow(priceEl, fromVal, toVal, 500);
    });

    // Update billing captions
    sectionEl
      .querySelectorAll('.p3d-billing-caption')
      .forEach(function (captionEl) {
        var unit = captionEl.getAttribute('data-unit') || '';
        var base = nextAnnual ? 'billed annually' : 'billed monthly';
        captionEl.textContent = unit ? base + ' \u00b7 ' + unit : base;
      });

    // Sync checkout buttons
    sectionEl.querySelectorAll('.start-order').forEach(function (btn) {
      btn.setAttribute(
        'data-billing-cycle',
        nextAnnual ? 'annual' : 'monthly'
      );
    });
  }

  function initPricing3D() {
    document.addEventListener('click', function (e) {
      var switchBtn = e.target.closest('.p3d-switch');
      if (switchBtn) {
        var section = switchBtn.closest('.p3d-section, .pricing-section');
        if (section) {
          e.preventDefault();
          togglePricingSection(section, switchBtn);
        }
        return;
      }

      var labelEl = e.target.closest('.p3d-toggle-label');
      if (labelEl) {
        var sec = labelEl.closest('.p3d-section, .pricing-section');
        var sw = sec ? sec.querySelector('.p3d-switch') : null;
        if (sec && sw) {
          e.preventDefault();
          togglePricingSection(sec, sw);
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPricing3D);
  } else {
    initPricing3D();
  }
})();
